import mongoose from 'mongoose';
const { Schema } = mongoose;
const mixed = Schema.Types.Mixed;
function model(name, fields, indexes = []) {
  const schema = new Schema({ _id: String, ...fields }, { timestamps: true, strict: 'throw', autoIndex: false });
  for (const [keys, options] of indexes) schema.index(keys, options);
  return mongoose.models[name] || mongoose.model(name, schema);
}
export const AdminUser = model('AdminUser', { email: { type: String, unique: true }, passwordHash: { type: String, select: false }, disabled: { type: Boolean, default: false } });
export const AdminSession = model('AdminSession', { userId: String, tokenHash: { type: String, unique: true, select: false }, expiresAt: Date }, [[{ expiresAt: 1 }, { expireAfterSeconds: 0 }]]);
export const AdminAudit = model('AdminAudit', { actor: String, action: String, target: String, details: mixed });
export const AdapterConfig = model('AdapterConfig', { approval: mixed, configHash: String, validatedHash: String, validatedAt: Date, enabled: { type: Boolean, default: false } });
export const CollectionJob = model('CollectionJob', {
  sourceId: String, mode: { type: String, enum: ['FIXTURE', 'LIVE'] }, maxRecords:Number,trigger: String, actor: String,
  state: String, activeKey: String, scheduledKey: String, leaseToken: String, leaseUntil: Date,
  attempts: { type: Number, default: 0 }, cancelRequested: { type: Boolean, default: false },
  startedAt: Date, finishedAt: Date, runId: String, counters: mixed, error: String, progress: String
}, [[{ activeKey: 1 }, { unique: true, sparse: true }], [{ scheduledKey: 1 }, { unique: true, sparse: true }], [{ state: 1, createdAt: 1 }, {}]]);
export const CollectionSchedule = model('CollectionSchedule', {
  name: String, enabled: { type: Boolean, default: false }, kind: String, cron: String, time: String, weekday: Number,
  timezone: String, sourceIds: [String], mode: String, revision: Number, nextRun: Date, lastRun: Date, lastOutcome: String
});
export const WorkerHeartbeat = model('WorkerHeartbeat', { lastSeen: Date, state: String });
export const AdminEvent = model('AdminEvent', { type: String, payload: mixed, runId:String,sequence:Number,at: Date, expiresAt: Date }, [[{ at: 1 }, {}], [{runId:1,sequence:1},{}],[{sequence:1},{unique:true,sparse:true}], [{ expiresAt: 1 }, { expireAfterSeconds: 0 }]]);
export const AdminEventCounter=model('AdminEventCounter',{value:{type:Number,default:0}});
export const DiscoveryBudget=model('DiscoveryBudget',{calls:{type:Number,default:0}});
export const DiscoveryLookup=model('DiscoveryLookup',{schemeId:String,sourceGroup:String,queryHash:String,state:String,results:[mixed],error:String,usage:mixed});
export const adminModels = { AdminUser, AdminSession, AdminAudit, AdapterConfig, CollectionJob, CollectionSchedule, WorkerHeartbeat, AdminEvent,AdminEventCounter,DiscoveryBudget,DiscoveryLookup };
export async function initAdminModels() {
  for (const Model of Object.values(adminModels)) { await Model.createCollection(); await Model.createIndexes(); }
}
