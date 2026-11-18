// A mocked authoritative database snapshot, never a collected government record.
// This helper is used only inside the isolated integration database.
import {ContentApproval,AIArtifact,SchemeSearchDocument} from '../../src/models/content.js';
import {models} from '../../src/models/index.js';
import {canonicalFacts,preservedFacts,searchTokens} from '../../src/services/content/contracts.js';
export async function mockPublicationSnapshot(scheme){
 const version=await models.SourceVersion.findById(scheme.currentVersionId).lean(),facts=canonicalFacts(version.payload),id=`mock-approval-${scheme.id}`,excerpt='Mock reviewed source passage used exclusively for isolated publication projection tests.';
 const approval={_id:id,schemeId:scheme.id,sourceVersionId:version.id,sourceHash:version.contentHash,facts,excerpt,clauseRefs:['mock-source-clause'],evidenceUrl:scheme.sourceUrl,rightsBasis:'Mock public rights snapshot',evidence:'Simulated editorial evidence, not real source verification',reviewer:'Isolated test editor',verifiedAt:new Date(),validUntil:new Date(Date.now()+86400000),dataClass:'CURATED_PUBLIC'};
 const output={language:'en',title:scheme.title,summary:'Mock reviewed publication for projection tests.',whoItMayHelp:'Source-defined audience',benefits:[],documents:[],howToApply:{steps:[],links:[{url:scheme.sourceUrl,label:'Source'}]},limitations:['Mock test data, not a real government scheme.'],aliases:[],keywords:['preview'],romanized:[],preservedFacts:preservedFacts(facts),citations:[{clauseRef:approval.clauseRefs[0],quote:excerpt}]};
 await ContentApproval.create(approval);await AIArtifact.create({_id:`mock-artifact-${scheme.id}`,schemeId:scheme.id,approvalId:id,sourceVersionId:version.id,sourceHash:version.contentHash,language:'en',output,state:'APPROVED',dataClass:'CURATED_PUBLIC',stale:false,validation:{ok:true}});
 await SchemeSearchDocument.create({_id:`mock-index-${scheme.id}`,schemeId:scheme.id,sourceVersionId:version.id,approvalId:id,artifactId:`mock-artifact-${scheme.id}`,language:'en',title:scheme.title,titleTokens:[],aliases:[],tokens:searchTokens([scheme.title,'preview']),state:scheme.state,categories:scheme.beneficiaryCategories,dataClass:'CURATED_PUBLIC',published:true});
 await models.Scheme.updateOne({_id:scheme.id},{$set:{contentApprovalId:id}});
}
