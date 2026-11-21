import {hash} from '../../utils/hash.js';
export const ruleVersion='review-evidence-2';
export const fingerprint=value=>hash(JSON.parse(JSON.stringify(value)));
export function dependencySnapshot(value){const omit=new Set(['createdAt','updatedAt','__v','lastCheckedAt','lastChangedAt','lastSuccessfulCollection','lastCollectionError','httpCache','incrementalState']);const strip=v=>Array.isArray(v)?v.map(strip):v&&typeof v==='object'&&!(v instanceof Date)?Object.fromEntries(Object.entries(v).filter(([k])=>!omit.has(k)).map(([k,x])=>[k,strip(x)])):v;return fingerprint(strip(value));}
export const iso=value=>{const date=new Date(value);if(!value||!Number.isFinite(+date))return null;if(typeof value==='string'&&/^\d{4}-\d\d-\d\d/.test(value)){const day=value.slice(0,10),check=new Date(day+'T00:00:00.000Z');if(!Number.isFinite(+check)||check.toISOString().slice(0,10)!==day)return null;}return date.toISOString();};
export const safeUrl=value=>{try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password&&!u.hash?u.href:null;}catch{return null;}};
export function checkVersion(version,entityType,entityId){return Boolean(version&&version.entityType===entityType&&version.entityId===entityId&&/^[a-f0-9]{64}$/.test(version.contentHash)&&hash(version.payload)===version.contentHash);}
export function approvedObservationHistory({row,approval,version,entityId,reviewed,conflicts=[],versions=[],changes=[]}){
 if(!reviewed||!approval?.verifiedAt)return null;const at=new Date(approval.createdAt||approval.verifiedAt);
 const old=v=>checkVersion(v,'Scheme',entityId)&&Number.isFinite(+new Date(v.retrievedAt))&&new Date(v.retrievedAt)<=at;
 if(row.reason==='INITIAL_RESEARCH_REVIEW'&&row.versionId!==version.id&&row.versionId!==version._id&&old(versions.find(v=>(v.id||v._id)===row.versionId)))return'HISTORICAL_RESEARCH_COMPARISON_AFTER_LIMITED_FACT_REVIEW';
 if(row.reason.startsWith('CONFLICTING_OFFICIAL_EVIDENCE:')){const field=row.reason.split(':')[1],facts=conflicts.filter(f=>f.field===field);if(facts.length&&facts.some(f=>f.versionId===(version.id||version._id)&&JSON.stringify(f.value)===JSON.stringify(approval.facts[field]))&&facts.every(f=>{const v=versions.find(v=>(v.id||v._id)===f.versionId);return old(v)&&JSON.stringify(v.payload[field])===JSON.stringify(f.value);}))return'HISTORICAL_COMPARISON_WITH_EXACT_REVIEWED_FACT_SCOPE_NOT_ELIGIBILITY_APPROVAL';}
 if(row.reason==='SOURCE_CONTENT_CHANGED'&&row.versionId===(version.id||version._id)&&changes.length&&changes.every(c=>Number.isFinite(+new Date(c.createdAt))&&new Date(c.createdAt)<=at))return'CHANGE_ALREADY_COVERED_BY_EXACT_CURRENT_FACT_REVIEW';
 return null;
}
export function noticeHistory(entity,version,now=new Date()){
 const original=version?.original||{},date=iso(original.observedPublicationDate||entity?.publishedAt);
 const {collectionProvenance,...raw}=original;
 const rawHashValid=Boolean(collectionProvenance?.rawRecordHash&&hash(raw)===collectionProvenance.rawRecordHash);
 const expires=iso(version?.payload?.effectiveUntil||version?.payload?.expiresAt);
 if(expires&&new Date(expires)<=now)return{historical:true,basis:'EXPLICIT_SOURCE_VALIDITY_ENDED',date:expires};
 // This archives internal RSS snapshots, not a finding that the hazard ended.
 const snapshot=rawHashValid&&entity?.publicationStatus==='INTERNAL'&&entity.actionable===false&&original.collectionProvenance?.mode==='LIVE'&&original.collectionProvenance.synthetic===false&&original.collectionScope==='RSS headline/summary/date/link only; CAP documents and images are not fetched'&&original.freshnessNote?.startsWith('Not a verified active warning.')&&date&&now-new Date(date)>=48*3600000;
 return{historical:Boolean(snapshot),basis:snapshot?'INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY':null,date,archivePolicyHours:48};
}
export function classifyEvidence({type,entity,version,hashValid,approvalReusable=false,approvalCoversReview=false,metadataOnly=false,conflict=false,materialChange=false,missing=[],blocked=[],history={}}){
 if(!entity||!version||!hashValid)return{risk:'BLOCKED',basis:'MISSING_OR_INCONSISTENT_VERSION_EVIDENCE'};
 if(type==='Notice'&&history.historical)return{risk:'HISTORICAL',basis:history.basis};
 if(conflict||materialChange)return{risk:'REVIEW_REQUIRED',basis:conflict?'CONFLICTING_FACTS_REQUIRE_HUMAN_DECISION':'MATERIAL_FACT_CHANGE_REQUIRES_HUMAN_DECISION'};
 if(blocked.length)return{risk:'BLOCKED',basis:'UNRESOLVED_RIGHTS_IDENTITY_OR_CURRENTNESS'};
 if(approvalReusable&&approvalCoversReview&&!missing.length)return{risk:'ROUTINE',basis:'EXACT_APPROVED_SCOPE_AND_DEPENDENCIES_UNCHANGED'};
 if(metadataOnly&&approvalReusable)return{risk:'ROUTINE',basis:'METADATA_ONLY_CHECK_WITHIN_EXISTING_REVIEWED_SCOPE'};
 return{risk:'REVIEW_REQUIRED',basis:'UNREVIEWED_OR_INCOMPLETE_PUBLIC_FACTS'};
}
