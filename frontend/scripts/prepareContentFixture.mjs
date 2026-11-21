import { mkdtemp,writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fixtureScheme,mockRouter } from '../../backend/tests/support/contentFixture.js';
import { collect } from '../../backend/src/services/ingestion/collect.js';
import { approveFacts,enqueueAI,runAIOnce } from '../../backend/src/services/content/workflow.js';
export async function prepareContentFixture(store){
 const examples=[fixtureScheme,...['desktop','mobile','blocked'].map(suffix=>({...fixtureScheme,id:'synthetic-consolidated-'+suffix,title:'SYNTHETIC Consolidated '+suffix,sourceUrl:fixtureScheme.sourceUrl+'-'+suffix,keyFacts:{...fixtureScheme.keyFacts,...(suffix==='blocked'?{publicationBlocked:true}:{})}}))];
 const dir=await mkdtemp(path.join(os.tmpdir(),'mygovguide-browser-content-'));await writeFile(path.join(dir,'scheme.json'),JSON.stringify(examples));
 const run=await collect(store,[{sourceId:'synthetic-ai-source',method:'api',entityType:'Scheme',url:fixtureScheme.sourceUrl,fixture:'scheme.json',title:'SYNTHETIC CONTENT E2E SOURCE'}],{offline:true,fixtureRoot:dir});
 if(run.counters.failed)throw new Error('Synthetic content fixture failed to stage');
 for(const example of examples){const scheme=await store.get('Scheme',example.id);
 await approveFacts(scheme.id,{sourceVersionId:scheme.currentVersionId,excerpt:fixtureScheme.description,clauseRefs:['Synthetic clause 1'],evidenceUrl:scheme.sourceUrl,rightsBasis:'SYNTHETIC browser test reuse evidence; no actual government data.',evidence:'Simulated fact approval only in isolated browser database.',verifiedAt:new Date().toISOString(),validUntil:new Date(Date.now()+86400000).toISOString(),publicNonSensitive:true,factsChecked:true,rightsChecked:true},'e2e-test-reviewer');
 await enqueueAI(scheme.id,['en','hi','kn'],'e2e-test-reviewer',{config:{GEMINI_MODEL:'mock-model'}});
 for(let i=0;i<3;i++)await runAIOnce({router:mockRouter()});
 }
 console.log('Clearly labeled synthetic EN/HI/KN artifacts prepared with an offline mock; no provider generation calls.');
}
