import {fork} from 'node:child_process';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {detectableLabels} from './labels.js';
import {identityMarkers} from './identityMarkers.js';
export const MAX_UPLOAD_BYTES=5*1024*1024;
let active=0;
export function formError(code,status=400){return Object.assign(new Error(code),{code,status,safe:true});}
export function detectFileType(buffer,mime){
 if(!Buffer.isBuffer(buffer))throw formError('FILE_TYPE_MISMATCH',415);
 if(!buffer.length||buffer.length>MAX_UPLOAD_BYTES)throw formError('FILE_SIZE_LIMIT',413);
 let type=buffer.subarray(0,5).toString()==='%PDF-'?'application/pdf':buffer.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))?'image/png':buffer[0]===255&&buffer[1]===216&&buffer[2]===255?'image/jpeg':null;
 if(!type||type!==mime)throw formError('FILE_TYPE_MISMATCH',415);
 // Bound PNG allocation before native decode. JPEG decode is memory/time isolated.
 if(type==='image/png'&&(buffer.length<24||buffer.readUInt32BE(16)*buffer.readUInt32BE(20)>16000000))throw formError('IMAGE_DIMENSIONS_EXCEEDED');
 if(type==='image/jpeg'){
  let offset=2,dimensions=false;
  while(offset+4<=buffer.length){
   if(buffer[offset++]!==255)break;while(buffer[offset]===255)offset++;
   const marker=buffer[offset++];if(marker===217||marker===218)break;if(marker===1||marker>=208&&marker<=215)continue;
   const size=buffer.readUInt16BE(offset);if(size<2||offset+size>buffer.length)break;
   if([192,193,194,195,197,198,199,201,202,203,205,206,207].includes(marker)){
    if(size<8)break;const height=buffer.readUInt16BE(offset+3),width=buffer.readUInt16BE(offset+5);
    if(!width||!height||width>8000||height>8000||width*height>16000000)throw formError('IMAGE_DIMENSIONS_EXCEEDED');dimensions=true;break;
   }offset+=size;
  }if(!dimensions)throw formError('DOCUMENT_UNREADABLE',422);
 }
 return type;
}
export async function extractDocument(buffer,mime){
 const type=detectFileType(buffer,mime);
 if(active>=2)throw formError('UPLOAD_BUSY',429);
 active++;
 try{return await new Promise((resolve,reject)=>{
  const child=fork(fileURLToPath(new URL('./extractChild.js',import.meta.url)),[],{env:{SYSTEMROOT:process.env.SYSTEMROOT,PATH:process.env.PATH,TEMP:process.env.TEMP},execArgv:['--max-old-space-size=256'],serialization:'advanced',stdio:['ignore','ignore','ignore','ipc'],windowsHide:true});
  let done=false;const finish=(error,value)=>{if(done)return;done=true;clearTimeout(timer);child.kill();error?reject(error):resolve(value);};
  const timer=setTimeout(()=>finish(formError('PARSING_TIME_LIMIT',422)),20000);
  child.on('message',m=>m.ok?finish(null,{...m,sha256:createHash('sha256').update(buffer).digest('hex')}):finish(formError(m.error,422)));
  child.on('error',()=>finish(formError('PARSER_UNAVAILABLE',503)));
  child.on('exit',()=>finish(formError('DOCUMENT_UNREADABLE',422)));
  child.send({bytes:buffer,type});
 });}finally{active--;}
}
export function privateUploadResult(extraction,knownDocuments=[]){
 const match=knownDocuments.find(d=>d.sha256===extraction.sha256);
 const acro=(extraction.acroFields||[]).map(label=>String(label).replace(/([a-z])([A-Z])/g,'$1 $2')).join('\n');
 const labels=detectableLabels(extraction.text+'\n'+acro);
 const normalize=s=>s.normalize('NFKC').toLowerCase().replace(/\s+/g,' ').trim();
 const text=normalize(extraction.text);
 const possibleMatches=match?[]:knownDocuments.filter(d=>{const markers=d.identifiers?.length?d.identifiers:identityMarkers[d.formId];return markers?.length>=2&&markers.every(marker=>text.includes(normalize(marker)))&&d.fields?.length&&d.fields.filter(f=>text.includes(normalize(f.label))).length>=Math.min(3,d.fields.length);}).slice(0,3).map(d=>({formId:d.formId,edition:d.edition,status:'POSSIBLE_MATCH_NEEDS_VERIFICATION'}));
 return {status:extraction.ocr==='UNAVAILABLE'?'OCR_UNAVAILABLE':match?'REFERENCE_DOCUMENT_MATCH':'UNIDENTIFIED_FORM',ocr:extraction.ocr,ocrConfidence:extraction.ocrConfidence,ocrLanguage:extraction.ocrLanguage,pages:extraction.pages,fields:labels.map((label,index)=>({id:'detected-'+index,label,status:'NEEDS_VERIFICATION'})),match:match?{formId:match.formId,documentId:match._id,edition:match.edition,method:'EXACT_DOCUMENT_SHA256'}:null,possibleMatches,confidence:match?'EXACT_REFERENCE_BYTES':'UNCONFIRMED',externalProcessing:false,retention:'NO_SERVER_STORAGE',rawTextReturned:false};
}
