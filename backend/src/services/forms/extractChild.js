// This process receives only document bytes. It has no application credentials,
// database imports, URL-loading entry point, logging or external AI access.
import {PDFParse} from 'pdf-parse';
import {recognizeLocal} from './localOcr.js';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {loadImage,createCanvas}=require('@napi-rs/canvas');
async function imageText(image,bytes){const scale=Math.min(1,1600/image.width,2000/image.height),canvas=createCanvas(Math.max(1,Math.floor(image.width*scale)),Math.max(1,Math.floor(image.height*scale)));canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);const png=canvas.toBuffer('image/png');try{return await recognizeLocal([{page:1,data:png}]);}finally{png.fill(0);}}
process.once('message',async({bytes,type})=>{
 let parser;let buffer=Buffer.from(bytes);
 try{
  if(type!=='application/pdf'){
   // Decode to validate structure; bound dimensions before allocating pixels.
   const image=await loadImage(buffer);
   if(image.width*image.height>16000000||image.width>8000||image.height>8000)throw Error('IMAGE_DIMENSIONS_EXCEEDED');
   let pageTexts=[];try{pageTexts=await imageText(image,buffer);}catch{}
   const text=pageTexts.map(p=>p.text).join('\n'),confidence=pageTexts[0]?.confidence||0;
   process.send({ok:true,pages:1,text,pageTexts,acroFields:[],ocr:text.trim().length<20?'UNAVAILABLE':confidence<70?'LOW_CONFIDENCE':'LOCAL_RECOGNIZED',ocrConfidence:confidence,ocrLanguage:'eng',width:image.width,height:image.height});return;
  }
  if(/\/(?:JavaScript|JS|Launch|EmbeddedFile|RichMedia|XFA|Encrypt)\b/.test(buffer.toString('latin1')))throw Error('UNSAFE_OR_ENCRYPTED_PDF');
  parser=new PDFParse({data:new Uint8Array(buffer),isEvalSupported:false,useSystemFonts:false,disableFontFace:true,useWorkerFetch:false,stopAtErrors:true});
  const info=await parser.getInfo();
  if(info.total<1||info.total>10)throw Error('PAGE_LIMIT_EXCEEDED');
  const doc=parser.doc;
  if((await doc.getJSActions())||Object.keys((await doc.getAttachments())||{}).length)throw Error('ACTIVE_CONTENT_NOT_ALLOWED');
  const fields=await doc.getFieldObjects();
  for(let p=1;p<=info.total;p++){
   const page=await doc.getPage(p);const viewport=page.getViewport({scale:1});
   if(viewport.width>20000||viewport.height>20000)throw Error('PAGE_DIMENSIONS_EXCEEDED');
   const annotations=await page.getAnnotations();
   if(annotations.some(a=>a.actions||a.jsAction||a.attachment||['FileAttachment','RichMedia','Screen'].includes(a.subtype)))throw Error('ACTIVE_CONTENT_NOT_ALLOWED');
  }
  const result=await parser.getText();
  if(result.text.length>200000)throw Error('EXTRACTED_TEXT_LIMIT_EXCEEDED');
  let pageTexts=result.pages.map(p=>({page:p.num,text:p.text})),text=result.text,ocr='NOT_NEEDED',ocrConfidence=null;
  const emptyPages=pageTexts.filter(p=>p.text.trim().length<30);
  if(emptyPages.length){try{const shots=await parser.getScreenshot({partial:emptyPages.slice(0,2).map(p=>p.page),desiredWidth:1400,imageBuffer:true,imageDataUrl:false});const recognized=await recognizeLocal(shots.pages.map(p=>({page:p.pageNumber,data:p.data})));for(const p of recognized){const index=pageTexts.findIndex(x=>x.page===p.page);if(index>=0)pageTexts[index]=p;}text=pageTexts.map(p=>p.text).join('\n');ocrConfidence=Math.min(...recognized.map(p=>p.confidence));ocr=recognized.every(p=>p.text.trim().length<20)?'UNAVAILABLE':emptyPages.length>2?'PARTIAL':ocrConfidence<70?'LOW_CONFIDENCE':'LOCAL_RECOGNIZED';for(const p of shots.pages)p.data.fill(0);}catch{ocr='UNAVAILABLE';}}
  process.send({ok:true,pages:info.total,text,pageTexts,acroFields:Object.keys(fields||{}).slice(0,100),ocr,ocrConfidence,ocrLanguage:ocr==='NOT_NEEDED'?null:'eng'});
 }catch(error){const code=String(error.message);process.send({ok:false,error:/^[A-Z_]+$/.test(code)?code:'DOCUMENT_UNREADABLE'});}
 finally{await parser?.destroy().catch(()=>{});buffer.fill(0);buffer=null;process.disconnect();}
});
