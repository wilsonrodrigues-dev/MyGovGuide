// Database references, not an invented statement that a person checked facts.
export function attachedEvidence({entityType,entityId,versionId,sourceUrl,approvalId,artifactIds=[],documentHash,clauseRefs=[],factsHash},note=''){
 return JSON.stringify({origin:'DATABASE_ATTACHED_EVIDENCE',entityType,entityId,versionId,sourceUrl,approvalId,artifactIds,documentHash,clauseRefs,factsHash,...(note?.trim()?{administratorNote:note.trim()}: {})});
}
