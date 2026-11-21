// Runs only inside the credential-free extraction child. No remote model, cache,
// filesystem upload or URL input: language bytes and engine come from npm assets.
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {createWorker} from 'tesseract.js';
const require=createRequire(import.meta.url),english=require('@tesseract.js-data/eng');
export async function recognizeLocal(images){
 if(!images.length||images.length>2)throw Error('OCR_PAGE_LIMIT');
 const langPath=path.resolve(english.langPath,'../4.0.0_best_int');
 fs.accessSync(path.join(langPath,'eng.traineddata.gz'),fs.constants.R_OK);
 const worker=await createWorker('eng',1,{langPath,gzip:true,cacheMethod:'none',workerPath:require.resolve('tesseract.js/src/worker-script/node/index.js'),logger:()=>{},errorHandler:()=>{}});
 try{const pages=[];for(const image of images){const result=await worker.recognize(image.data);pages.push({page:image.page,text:result.data.text,confidence:result.data.confidence,method:'LOCAL_OCR_ENG'});}return pages;}finally{await worker.terminate();}
}
