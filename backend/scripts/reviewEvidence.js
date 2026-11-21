import fs from 'node:fs/promises';
import {connectDB,disconnectDB} from '../src/config/db.js';
import {initReviewEvidenceModels} from '../src/models/reviewEvidence.js';
import {reviewWorkload,buildReviewPackets,refreshReviewEvidence,triageReviewPackets} from '../src/services/verification/reviewEvidence.js';
await connectDB();try{
 await initReviewEvidenceModels();const before=await reviewWorkload({handled:'all'});await refreshReviewEvidence();let result={handledRecords:0,approvalActions:0};
 if(process.argv.includes('--handle-safe')){const packets=(await buildReviewPackets()).filter(p=>p.records.some(r=>['ROUTINE','HISTORICAL'].includes(r.risk)));for(let n=0;n<packets.length;n+=100){const batch=await triageReviewPackets({selections:packets.slice(n,n+100).map(p=>({packetKey:p.packetKey,snapshot:p.snapshot}))},'evidence-automation under owner instruction');result.handledRecords+=batch.handledRecords;}}
 const after=await reviewWorkload({handled:'all'});const report={at:new Date(),before:before.summary,after:after.summary,result,sourceRequests:0,geminiRequests:0,publicationActions:0,permissionActions:0,reviewRecordsDeleted:0};
 await fs.mkdir(new URL('../../.local/evidence-review/',import.meta.url),{recursive:true});await fs.writeFile(new URL('../../.local/evidence-review/execution.json',import.meta.url),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}finally{await disconnectDB();}
