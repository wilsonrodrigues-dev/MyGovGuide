import mongoose from 'mongoose';
import { statuses, methods, rule } from '../validators/contracts.js';
import { initContentModels } from './content.js';
import { initFormModels } from './forms.js';
import { initReviewEvidenceModels } from './reviewEvidence.js';
import {automatedActor,automatedPolicy,machineRuleValidated} from '../services/verification/automatedPolicy.js';
const { Schema } = mongoose;
const mixed = Schema.Types.Mixed;
const text = { type: String, required: true, minlength: 1 };
const url = { ...text, validate: v => { try { const u = new URL(v); return /^https?:$/.test(u.protocol) && !u.username && !u.password; } catch { return false; } } };
const ref = model => ({ type: String, ref: model, required: true });
const status = { type: String, enum: statuses, default: 'RESEARCH_ONLY', required: true };
const common = {
  _id: text, id: { ...text, unique: true }, original: { type: mixed, required: true },
  normalized: { type: mixed, default: {} }, status,
  publicationStatus: { type: String, enum: ['INTERNAL', 'PUBLISHED', 'WITHDRAWN'], default: 'INTERNAL' },
  contentHash: String, revision: { type: Number, min: 1, default: 1 },
  lastCheckedAt: Date, lastChangedAt: Date, effectiveFrom: Date, effectiveUntil: Date,
  approvedVersionId: { type: String, ref: 'SourceVersion' }, lastHumanReviewAt: Date,
  publicationEvidence: { type: mixed },
  cacheStale: { type: Boolean, default: true }, automatedValidation:mixed
};
const entity = {
  ...common, title: text, sourceIds: { type: [ref('Source')], required: true, validate: a => a.length > 0 },
  sourceUrl: url, currentVersionId: { type: String, ref: 'SourceVersion' },
  reviewNotes: [String], historicalAliases: [String]
};
const definitions = {
  Source: {
    ...common, title: text, url, host: text, organization: String, contentCategory: String,
    sourceType: String, collectionMethod: { type: String, enum: methods, default: 'offline' },
    authorizationStatus: { type: String, enum: ['NOT_AUTHORIZED_FOR_AUTOMATION', 'APPROVED', 'EXPIRED', 'REVOKED'], default: 'NOT_AUTHORIZED_FOR_AUTOMATION' },
    approval: mixed, lastSuccessfulCollection: Date, lastCollectionError: String, httpCache: mixed, incrementalState: mixed
  },
  SourceVersion: {
    ...common, sourceId: ref('Source'), sourceIds: [ref('Source')], entityType: text, entityId: text,
    contentHash: { ...text, match: /^[a-f0-9]{64}$/ }, payload: { type: mixed, required: true },
    previousVersionId: { type: String, ref: 'SourceVersion' }, retrievedAt: { type: Date, required: true }
  },
  Scheme: {
    ...entity, contentApprovalId: String, canonicalId: String, identityName: String, identityUrls: [String], lastCollectionStatus: String, lastCollectionSourceId: String, lastCollectionRunId: String, department: String, authority: String, governmentLevel: { type: String, enum: ['CENTRAL', 'STATE', 'UNKNOWN'], default: 'UNKNOWN' },
    state: { type: String, default: 'UNKNOWN' }, beneficiaryCategories: [String], programmeType: String,
    originalText: String, benefits: mixed, applicationInfo: mixed, requiredDocuments: [String],
    simplifiedText: { type: Map, of: String }, schemeStatus: { type: String, enum: ['ACTIVE', 'PAUSED', 'CLOSED', 'UNKNOWN'], default: 'UNKNOWN' }
  },
  SchemeFact: {
    ...common, schemeId: ref('Scheme'), sourceId: ref('Source'), sourceVersionId: ref('SourceVersion'),
    field: text, originalValue: { type: mixed, required: true }, normalizedValue: mixed,
    sourceSection: text, reviewerNotes: String
  },
  EligibilityRuleSet: {
    ...common, schemeId: ref('Scheme'), sourceVersionIds: [ref('SourceVersion')],
    completeness: { type: String, enum: ['INFORMATION_INCOMPLETE', 'COMPLETE'], default: 'INFORMATION_INCOMPLETE' },
    rules: { type: [mixed], default: [], validate: a => a.every(v => rule.safeParse(v).success) },
    questions: {type:[mixed],default:undefined}, sourceBindings: {type:[mixed],default:undefined},
      exceptions: [mixed], missingInformation: [String], revisionHistory: [mixed],
    review: { reviewedBy: String, evidence: String, approvedAt: Date, humanCurated: Boolean }
  },
  FormTemplate: {
    ...entity, schemeId: { type: String, ref: 'Scheme' }, linkedSchemeIds: [{ type: String, ref: 'Scheme' }],
    formKind: { type: String, enum: ['PDF_FORM', 'PUBLIC_APPLICATION_PAGE', 'AUTHENTICATED_PORTAL', 'INSTRUCTIONS_ONLY'], required: true },
    observedFields: [mixed], officialLinks: [String], requiredDocuments: [String]
  },
  Notice: {
    ...entity, publishingAuthority: String, publishedAt: Date, noticeCategory: String,
    sourceVersionId: { type: String, ref: 'SourceVersion' }, relatedSchemeId: { type: String, ref: 'Scheme' },
    dueDates: [{ date: Date, clauseRef: String, verified: Boolean }], actionable: { type: Boolean, default: false }
  },
  ScamAlert: {
    ...entity, recordType: { type: String, enum: ['DATED_OFFICIAL_ADVISORY', 'AWARENESS_TOPIC'], required: true },
    publishedAt: Date, matchedCategories: [String]
  },
  ChangeEvent: {
    ...common, entityType: text, entityId: text, sourceIds: [ref('Source')],
    oldHash: text, newHash: text, oldVersionId: ref('SourceVersion'), newVersionId: ref('SourceVersion'),
    changedFields: { type: [String], required: true }, factChanges: [mixed], summary: text,
    reviewStatus: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' }
  },
  ReviewEvent: {
    ...common, entityType: text, entityId: text, previousStatus: status, nextStatus: status,
    reviewer: text, evidence: text, notes: String, versionId: { type: String, ref: 'SourceVersion' }
  },
  ReviewItem: {
    ...common, entityType: text, entityId: text, reason: text,
    versionId: { type: String, ref: 'SourceVersion' },
    queueStatus: { type: String, enum: ['PENDING', 'RESOLVED'], default: 'PENDING' }
  },
  ImportRejection: { ...common, runId: ref('IngestionRun'), filename: text, recordIndex: { type: Number, required: true }, reason: text },
  IngestionRun: {
    ...common, mode: { type: String, enum: ['IMPORT', 'FIXTURES', 'ONLINE', 'DRY_RUN'], required: true },
    startedAt: { type: Date, required: true }, finishedAt: Date,
    outcome: { type: String, enum: ['RUNNING', 'SUCCESS', 'PARTIAL', 'FAILED', 'NO_OP'], default: 'RUNNING' },
    counters: { read: Number, created: Number, updated: Number, unchanged: Number, rejected: Number,
      pendingReview: Number, reviewItems: Number, identityReview: Number, changeEvents: Number, successful: Number, failed: Number, skipped: Number },
    sources: [mixed], runErrors: [String]
  },
  SchemeIdentity: { ...common, schemeId: ref('Scheme'), key: text, kind: text, sourceId: ref('Source'), reviewer: String, evidence: String, verifiedAt: Date },
  IdentityReviewCandidate: { ...common, sourceId: ref('Source'), recordKey: text, title: text, candidate: mixed, proposedKeys: [mixed], possibleSchemeIds: [String], reason: text, observationId: String, resolvedSchemeId: String, reviewer: String, evidence: String, resolvedAt: Date, queueStatus: {type:String,enum:['PENDING','RESOLVED'],default:'PENDING'} },
  CollectionObservation: { ...common, sourceId: ref('Source'), runId: ref('IngestionRun'), schemeId: {type:String,ref:'Scheme'}, title: text, recordKey: text, classification: {type:String,enum:['NEW','UNCHANGED','UPDATED','NEEDS_IDENTITY_REVIEW'],required:true}, sourceUrl: url, sourceVersionId: {type:String,ref:'SourceVersion'}, checkedAt: {type:Date,required:true}, factChanges: [mixed], identityReviewId: String }
};
export const models = {};
for (const [name, fields] of Object.entries(definitions)) {
  const schema = new Schema(fields, { timestamps: true, strict: 'throw', minimize: false, autoCreate: false, autoIndex: false });
  schema.pre('validate', function() {
    if (this.id !== this._id) this.invalidate('id', 'id must equal stable _id');
    if (this.effectiveFrom && this.effectiveUntil && this.effectiveFrom > this.effectiveUntil) this.invalidate('effectiveUntil', 'Invalid effective date range');
    const automatedPublication=this.publicationEvidence?.mode==='AUTOMATED_VALIDATION'&&this.publicationEvidence?.validator===automatedActor&&this.publicationEvidence?.policy===automatedPolicy&&this.publicationEvidence?.humanReviewed===false&&this.publicationEvidence?.governmentCertified===false&&this.publicationEvidence?.sourceVersionId&&this.publicationEvidence?.artifactIds?.length===3;
    if (this.publicationStatus === 'PUBLISHED' && !automatedPublication && (!['SOURCE_VERIFIED_FACT', 'RULES_APPROVED_CURRENT'].includes(this.status) ||
      !this.publicationEvidence?.rightsBasis || !this.publicationEvidence?.reviewer || !this.publicationEvidence?.evidence)) {
      this.invalidate('publicationStatus', 'Publishing requires reviewed facts and explicit rights evidence');
    }
    if(name==='EligibilityRuleSet'&&this.status==='RULES_VALIDATED_CURRENT'&&(this.completeness!=='COMPLETE'||this.missingInformation.length||!this.rules.length||!this.sourceVersionIds.length||!machineRuleValidated(this.toObject())))this.invalidate('status','Validated rules require complete source-bound automated validation');
    if (name === 'EligibilityRuleSet' && this.status === 'RULES_APPROVED_CURRENT' &&
        (this.completeness !== 'COMPLETE' || this.missingInformation.length || !this.rules.length || !this.sourceVersionIds.length || !this.review?.humanCurated || !this.review?.reviewedBy || !this.review?.evidence || !this.review?.approvedAt || !this.effectiveFrom)) {
      this.invalidate('status', 'Approved rules require complete human review, clauses, versions and effective dates');
    }
    if (name === 'ScamAlert' && this.recordType === 'AWARENESS_TOPIC' && this.publishedAt) this.invalidate('publishedAt', 'Awareness topics are not dated incidents');
    if (name === 'Source' && this.authorizationStatus === 'APPROVED' && !this.approval) this.invalidate('approval', 'Approval evidence is required');
    if (name === 'Notice' && this.dueDates?.some(d => !d.verified || !d.clauseRef || !d.date)) this.invalidate('dueDates', 'Deadlines require verified clause evidence');
  });
  if (name === 'SourceVersion') {
    schema.index({ entityType: 1, entityId: 1, revision: 1 }, { unique: true });
    schema.index({ sourceId: 1, contentHash: 1 });
  }
  if (name === 'Source') schema.index({ host: 1, authorizationStatus: 1 });
  if (name === 'Scheme') { schema.index({ state: 1, beneficiaryCategories: 1 }); schema.index({ title: 'text', originalText: 'text' }); schema.index({identityName:1}); schema.index({identityUrls:1}); schema.index({sourceUrl:1}); }
  if (name === 'SchemeIdentity') {schema.index({schemeId:1,kind:1});schema.index({sourceId:1});}
  if (name === 'IdentityReviewCandidate') schema.index({queueStatus:1,lastCheckedAt:-1});
  if (name === 'CollectionObservation') { schema.index({schemeId:1,checkedAt:-1}); schema.index({sourceId:1,checkedAt:-1}); schema.index({runId:1,recordKey:1}); }
  if (name === 'SchemeFact') schema.index({ schemeId: 1, field: 1, sourceVersionId: 1 }, { unique: true });
  if (name === 'ChangeEvent') schema.index({ entityType: 1, entityId: 1, oldVersionId: 1, newVersionId: 1 }, { unique: true });
  if (name === 'ReviewItem') schema.index({ queueStatus: 1, createdAt: -1 });
  if (name === 'IngestionRun') schema.index({ startedAt: -1 });
  schema.index({ status: 1 });
  models[name] = mongoose.models[name] || mongoose.model(name, schema);
}
export async function initModels() {
  await initContentModels();
  await initFormModels();
  await initReviewEvidenceModels();
  await Promise.all(Object.values(models).map(async model => {
    await model.createCollection();
    await model.createIndexes();
  }));
}
