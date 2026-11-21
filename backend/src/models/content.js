import mongoose from 'mongoose';
const { Schema } = mongoose, mixed = Schema.Types.Mixed;
function define(name, fields, indexes = []) {
  const schema = new Schema({ _id: String, automatedValidation:mixed, ...fields }, { timestamps: true, strict: 'throw', autoIndex: false, autoCreate: false, minimize: false });
  for (const [keys, options] of indexes) schema.index(keys, options);
  return mongoose.models[name] || mongoose.model(name, schema);
}
export const ContentApproval = define('ContentApproval', { entityType:String,entityId:String,schemeId: String, sourceVersionId: String, sourceHash: String, factsHash: String, facts: mixed,
  excerpt: String, clauseRefs: [String], evidenceUrl: String, rightsBasis: String, evidence: String, reviewer: String, verifiedAt: Date, validUntil: Date,
  dataClass: { type: String, enum: ['CURATED_PUBLIC', 'LIVE', 'SYNTHETIC'] }, sourceIds: [String] });
export const AIJob = define('AIJob', { entityType:String,entityId:String,schemeId: String, approvalId: String, sourceVersionId: String, sourceHash: String, language: String,
  task: String, promptVersion: String, provider: String, model: String, dedupeKey: String, state: String, attempts: { type: Number, default: 0 },
  leaseToken: { type: String, select: false }, leaseUntil: Date, nextRetry: Date, errorCode: String, error: String, artifactId: String, finishedAt: Date,
  requestedBy: String, dataClass: String, usage: mixed, providerAttempts: [mixed], costBoundUsd: Number, actualProvider: String, actualModel: String }, [[{ dedupeKey: 1 }, { unique: true }], [{ state: 1, nextRetry: 1, createdAt: 1 }, {}]]);
export const AIArtifact = define('AIArtifact', { entityType:String,entityId:String,schemeId: String, jobId: String, approvalId: String, sourceVersionId: String, sourceHash: String,
  language: String, task: String, promptVersion: String, provider: String, model: String, dataClass: String,
  output: mixed, validation: mixed, usage: mixed, attempts: [mixed], costUsd: Number, state: String, stale: { type: Boolean, default: false },
  revision: { type: Number, default: 1 }, editor: String, reviewEvidence: String, reviewedAt: Date, previousArtifactId: String }, [[{ schemeId: 1, sourceVersionId: 1, language: 1, state: 1 }, {}]]);
export const SchemeSearchDocument = define('SchemeSearchDocument', { schemeId: String, sourceVersionId: String, approvalId: String, language: String,
  title: String, aliases: [String], keywords: [String], romanized: [String], tokens: [String], titleTokens: [String], state: String, categories: [String],
  artifactId: String, dataClass: String, published: Boolean, publishedAt: Date }, [[{ language: 1, tokens: 1, published: 1 }, {}], [{ language:1,published:1,publishedAt:-1,schemeId:1 },{}], [{ schemeId: 1, language: 1 }, { unique: true }]]);
export const ContentPublication = define('ContentPublication', { schemeId: String, approvalId: String, sourceVersionId: String, artifactIds: [String], action: String, reviewer: String, evidence: String, dataClass: String });
export const AIDailyBudget = define('AIDailyBudget', { committedUsd: { type: Number, default: 0 }, requests: { type: Number, default: 0 } });
export const AIWorkerSlot = define('AIWorkerSlot', { token: String, leaseUntil: Date });
export const AIProviderState = define('AIProviderState', { disabled: Boolean, credentialStatus: Number, cooldownUntil: Date, category: String, checkedAt: Date, modelAvailable: Boolean });
export const contentModels = { ContentApproval, AIJob, AIArtifact, SchemeSearchDocument, ContentPublication, AIDailyBudget, AIWorkerSlot, AIProviderState };
export async function initContentModels() { for (const Model of Object.values(contentModels)) { await Model.createCollection(); await Model.createIndexes(); } }
