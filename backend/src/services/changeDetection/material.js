import {canonicalFacts} from '../content/contracts.js';
import {hash,stable} from '../../utils/hash.js';
export function materialFacts(payload){const value=canonicalFacts(payload);delete value.supportingOfficialUrls;delete value.historicalAliases;
 for(const key of ['governmentLevel','programmeType','documentReferences','sourceEdition','observedPublicationDate','languages'])if(payload[key]!=null)value[key]=payload[key];
 for(const k of ['requiredDocuments','beneficiaryCategories'])if(Array.isArray(value[k]))value[k]=[...value[k]].sort();
 if(value.observedFacts){value.observedFacts={...value.observedFacts};for(const k of ['fetchedAt','retrievedAt','collectedAt','lastCheckedAt','evidenceCheckedAt','runId','etag','lastModified'])delete value.observedFacts[k];}
 return stable(value);
}
export function factChanges(before,after,prefix=''){
 const changes=[];for(const key of [...new Set([...Object.keys(before||{}),...Object.keys(after||{})])].sort()){const a=before?.[key],b=after?.[key],field=prefix?prefix+'.'+key:key;if(hash(a??null)===hash(b??null))continue;if(a&&b&&typeof a==='object'&&typeof b==='object'&&!Array.isArray(a)&&!Array.isArray(b))changes.push(...factChanges(a,b,field));else changes.push({field,before:a??null,after:b??null});}return changes;
}
