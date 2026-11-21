import mongoose from 'mongoose';
const {Schema}=mongoose;
const options={timestamps:true,strict:'throw',autoCreate:false,autoIndex:false};
const assessment=new Schema({_id:String,packetKey:{type:String,index:true},snapshot:String,ruleVersion:String,entityType:String,entityId:String,risk:{type:String,enum:['ROUTINE','HISTORICAL','BLOCKED','REVIEW_REQUIRED']},recordIds:[String],packet:Schema.Types.Mixed},options);
assessment.index({packetKey:1,snapshot:1},{unique:true});
const triage=new Schema({_id:String,reviewItemId:{type:String,index:true},packetKey:String,snapshot:String,risk:{type:String,enum:['ROUTINE','HISTORICAL']},disposition:{type:String,enum:['HANDLED_ROUTINE','ARCHIVED_HISTORICAL']},ruleVersion:String,actor:String,reason:String,approvalActions:{type:Number,default:0}},options);
triage.index({reviewItemId:1,snapshot:1},{unique:true});
export const ReviewEvidenceAssessment=mongoose.models.ReviewEvidenceAssessment||mongoose.model('ReviewEvidenceAssessment',assessment);
export const ReviewTriageEvent=mongoose.models.ReviewTriageEvent||mongoose.model('ReviewTriageEvent',triage);
const contentDecision=new Schema({_id:String,packetKey:{type:String,index:true},snapshot:String,action:{type:String,enum:['APPROVE_AND_PUBLISH','KEEP_PENDING','REJECT']},actor:String,note:String,evidence:Schema.Types.Mixed},options);
export const AdminContentDecision=mongoose.models.AdminContentDecision||mongoose.model('AdminContentDecision',contentDecision);
export async function initReviewEvidenceModels(){for(const Model of [ReviewEvidenceAssessment,ReviewTriageEvent,AdminContentDecision]){await Model.createCollection();await Model.createIndexes();}}
