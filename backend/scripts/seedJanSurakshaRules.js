// Adds exact DFS FAQ clauses and complete PMJJBY/PMSBY rule packets in a
// deliberately unapproved state. A separate human review must approve them.
import {connectDB,disconnectDB,requireTransactions} from '../src/config/db.js';
import {models} from '../src/models/index.js';
import {inspectRules} from '../src/services/eligibility/service.js';
import {hash} from '../src/utils/hash.js';
const apply=process.argv.includes('--apply');
if(apply)throw Object.assign(Error('Historical seed is disabled: it altered source-version metadata and omitted the one-account restriction. Preserve the existing review; stage a new immutable evidence revision through the admin workflow.'),{code:'HISTORICAL_SEED_DISABLED'});
const now=new Date();
const effectiveFrom=new Date(now.getTime()-86400000);
const effectiveUntil=new Date('2027-01-05T23:59:59.000Z');
const review={
 scope:'FULL_ELIGIBILITY_CLAUSES',
 reviewer:'OpenCode research verification (not a human editorial approval)',
 rightsBasis:'Official Department of Financial Services FAQ; short exact clause quotation for verification; link-only; no form or image reuse.',
 currentnessChecked:true,
 checkedAt:now,
 validUntil:effectiveUntil,
 notes:'Exact clauses quoted from the DFS FAQ last updated 05.01.2026. A human rules decision is still required before citizens can evaluate eligibility.'
};
const pmjjyClauses=[
 'PMJJBY-FAQ-Q5 (Who will be eligible to subscribe?): All individual (single or joint) account holders of participating banks / Post office, in the age group of 18 to 50 years are entitled to join. In case of multiple accounts held by an individual in one or different banks / Post offices, the person is eligible to join the scheme through one bank / Post office account only.',
 "PMJJBY-FAQ-Q4 (How will the premium be paid?): The premium will be deducted from the account holder's bank / Post office account through `auto debit' facility in one instalment, as per the consent given by the subscriber at the time of enrolment."
].join('\n');
const pmsbyClauses=[
 'PMSBY-FAQ-Q5 (Who will be eligible to subscribe?): All individual (single or joint) account holders of participating banks / Post office, in the age group of 18 to 70 years are entitled to join. In case of multiple accounts held by an individual in one or different banks/ Post offices, the person is eligible to join the scheme through one bank / Post office account only.',
 "PMSBY-FAQ-Q4 (How will the premium be paid?): The premium will be deducted from the account holder's bank / Post office account through `auto debit' facility in one instalment, as per the consent given by the subscriber at the time of enrolment."
].join('\n');
const q=(field,type,min,max,label,why)=>({field,type,...(type==='number'?{min,max}:{}),label,why});
const questions={
 'IN-WK-02':[
  q('age','number',0,120,{en:'What is your age in completed years?',hi:'आपकी पूर्ण वर्षों में आयु कितनी है?',kn:'ನಿಮ್ಮ ಪೂರ್ಣ ವರ್ಷಗಳ ವಯಸ್ಸು ಎಷ್ಟು?'},{en:'PMJJBY entry is for participating-bank or post-office account holders aged 18 to 50 years.',hi:'PMJJBY में प्रवेश 18 से 50 वर्ष के भागीदार बैंक या डाकघर खाताधारकों के लिए है।',kn:'PMJJBY ಪ್ರವೇಶ 18 ರಿಂದ 50 ವರ್ಷ ವಯಸ್ಸಿನ ಭಾಗಿಯಾಗಿರುವ ಬ್ಯಾಂಕ್ ಅಥವಾ ಅಂಚೆ ಕಚೇರಿ ಖಾತೆದಾರರಿಗೆ.'}),
  q('hasBankAccount','boolean',undefined,undefined,{en:'Do you hold an eligible account with a participating bank or post office?',hi:'क्या आपके पास किसी भागीदार बैंक या डाकघर में पात्र खाता है?',kn:'ನೀವು ಭಾಗಿಯಾಗಿರುವ ಬ್ಯಾಂಕ್ ಅಥವಾ ಅಂಚೆ ಕಚೇರಿಯಲ್ಲಿ ಅರ್ಹ ಖಾತೆಯನ್ನು ಹೊಂದಿದ್ದೀರಾ?'},{en:'Enrolment is through a participating bank or post-office account.',hi:'नामांकन भागीदार बैंक या डाकघर के खाते के माध्यम से होता है।',kn:'ನೋಂದಣಿ ಭಾಗಿಯಾಗಿರುವ ಬ್ಯಾಂಕ್ ಅಥವಾ ಅಂಚೆ ಕಚೇರಿ ಖಾತೆಯ ಮೂಲಕ ನಡೆಯುತ್ತದೆ.'}),
  q('autoDebitConsent','boolean',undefined,undefined,{en:'Do you consent to auto-debit of the premium from that account?',hi:'क्या आप उस खाते से प्रीमियम के ऑटो-डेबिट के लिए सहमत हैं?',kn:'ಆ ಖಾತೆಯಿಂದ ಪ್ರೀಮಿಯಂ ಸ್ವಯಂ-ಡೆಬಿಟ್ಗೆ ನೀವು ಸಮ್ಮತಿಸುತ್ತೀರಾ?'},{en:'The official form requires the subscriber’s auto-debit consent.',hi:'आधिकारिक फॉर्म में ग्राहक की ऑटो-डेबिट सहमति आवश्यक है।',kn:'ಅಧಿಕೃತ ಫಾರ್ಮ್ ಚಂದಾದಾರರ ಸ್ವಯಂ-ಡೆಬಿಟ್ ಸಮ್ಮತಿಯನ್ನು ಕೇಳುತ್ತದೆ.'})
 ],
 'IN-WK-03':[
  q('age','number',0,120,{en:'What is your age in completed years?',hi:'आपकी पूर्ण वर्षों में आयु कितनी है?',kn:'ನಿಮ್ಮ ಪೂರ್ಣ ವರ್ಷಗಳ ವಯಸ್ಸು ಎಷ್ಟು?'},{en:'PMSBY entry is for participating-bank or post-office account holders aged 18 to 70 years.',hi:'PMSBY में प्रवेश 18 से 70 वर्ष के भागीदार बैंक या डाकघर खाताधारकों के लिए है।',kn:'PMSBY ಪ್ರವೇಶ 18 ರಿಂದ 70 ವರ್ಷ ವಯಸ್ಸಿನ ಭಾಗಿಯಾಗಿರುವ ಬ್ಯಾಂಕ್ ಅಥವಾ ಅಂಚೆ ಕಚೇರಿ ಖಾತೆದಾರರಿಗೆ.'}),
  q('hasBankAccount','boolean',undefined,undefined,{en:'Do you hold an eligible account with a participating bank or post office?',hi:'क्या आपके पास किसी भागीदार बैंक या डाकघर में पात्र खाता है?',kn:'ನೀವು ಭಾಗಿಯಾಗಿರುವ ಬ್ಯಾಂಕ್ ಅಥವಾ ಅಂಚೆ ಕಚೇರಿಯಲ್ಲಿ ಅರ್ಹ ಖಾತೆಯನ್ನು ಹೊಂದಿದ್ದೀರಾ?'},{en:'Enrolment is through a participating bank or post-office account.',hi:'नामांकन भागीदार बैंक या डाकघर के खाते के माध्यम से होता है।',kn:'ನೋಂದಣಿ ಭಾಗಿಯಾಗಿರುವ ಬ್ಯಾಂಕ್ ಅಥವಾ ಅಂಚೆ ಕಚೇರಿ ಖಾತೆಯ ಮೂಲಕ ನಡೆಯುತ್ತದೆ.'}),
  q('autoDebitConsent','boolean',undefined,undefined,{en:'Do you consent to auto-debit of the premium from that account?',hi:'क्या आप उस खाते से प्रीमियम के ऑटो-डेबिट के लिए सहमत हैं?',kn:'ಆ ಖಾತೆಯಿಂದ ಪ್ರೀಮಿಯಂ ಸ್ವಯಂ-ಡೆಬಿಟ್ಗೆ ನೀವು ಸಮ್ಮತಿಸುತ್ತೀರಾ?'},{en:'The official form requires the subscriber’s auto-debit consent.',hi:'आधिकारिक फॉर्म में ग्राहक की ऑटो-डेबिट सहमति आवश्यक है।',kn:'ಅಧಿಕೃತ ಫಾರ್ಮ್ ಚಂದಾದಾರರ ಸ್ವಯಂ-ಡೆಬಿಟ್ ಸಮ್ಮತಿಯನ್ನು ಕೇಳುತ್ತದೆ.'})
 ]
};
const rules={
 'IN-WK-02':[
  {id:'pmjjy-age',field:'age',dataType:'number',operator:'between',value:[18,50],inclusiveMin:true,inclusiveMax:true,clauseRefs:['PMJJBY-FAQ-Q5'],unit:'years'},
  {id:'pmjjy-participating-account',field:'hasBankAccount',dataType:'boolean',operator:'eq',value:true,clauseRefs:['PMJJBY-FAQ-Q5']},
  {id:'pmjjy-auto-debit-consent',field:'autoDebitConsent',dataType:'boolean',operator:'eq',value:true,clauseRefs:['PMJJBY-FAQ-Q4']}
 ],
 'IN-WK-03':[
  {id:'pmsby-age',field:'age',dataType:'number',operator:'between',value:[18,70],inclusiveMin:true,inclusiveMax:true,clauseRefs:['PMSBY-FAQ-Q5'],unit:'years'},
  {id:'pmsby-participating-account',field:'hasBankAccount',dataType:'boolean',operator:'eq',value:true,clauseRefs:['PMSBY-FAQ-Q5']},
  {id:'pmsby-auto-debit-consent',field:'autoDebitConsent',dataType:'boolean',operator:'eq',value:true,clauseRefs:['PMSBY-FAQ-Q4']}
 ]
};
const clauses={'IN-WK-02':pmjjyClauses,'IN-WK-03':pmsbyClauses};
await connectDB();
try{
 if(apply){await requireTransactions();}
 const audit=[];
 for(const schemeId of ['IN-WK-02','IN-WK-03']){
  const scheme=await models.Scheme.findById(schemeId).lean();
  if(!scheme?.currentVersionId)throw new Error(schemeId+': CURRENT_VERSION_MISSING');
  const version=await models.SourceVersion.findById(scheme.currentVersionId).lean();
  if(!version)throw new Error(schemeId+': SOURCE_VERSION_MISSING');
  const sourceBindings=[
   {versionId:version.id,contentHash:version.contentHash,clauseRef:schemeId==='IN-WK-02'?'PMJJBY-FAQ-Q5':'PMSBY-FAQ-Q5',quote:schemeId==='IN-WK-02'?'All individual (single or joint) account holders of participating banks / Post office, in the age group of 18 to 50 years are entitled to join.':'All individual (single or joint) account holders of participating banks / Post office, in the age group of 18 to 70 years are entitled to join.'},
   {versionId:version.id,contentHash:version.contentHash,clauseRef:schemeId==='IN-WK-02'?'PMJJBY-FAQ-Q4':'PMSBY-FAQ-Q4',quote:"The premium will be deducted from the account holder's bank / Post office account through `auto debit' facility in one instalment, as per the consent given by the subscriber at the time of enrolment."}
  ];
  const rulePayload={rules:rules[schemeId],questions:questions[schemeId],sourceBindings,completeness:'COMPLETE',missingInformation:[],effectiveFrom,effectiveUntil};
  const ruleHash=hash(rulePayload);
  const existing=await models.EligibilityRuleSet.findById('rules-'+schemeId).lean();
  const session=await models.Scheme.db.startSession();
  let outcome='UNCHANGED';
  try{
   await session.startTransaction();
   await models.SourceVersion.updateOne({_id:version.id},{$set:{'original.originalClauses':clauses[schemeId],'original.rulesEvidenceReview':review,'original.eligibilityClausesCheckedAt':now}},{session});
   const current=await models.EligibilityRuleSet.findById('rules-'+schemeId).session(session).lean();
   if(current?.contentHash!==ruleHash||current?.status!=='REVIEW_REQUIRED'){
    const revision=(current?.revision||0)+1;
    await models.EligibilityRuleSet.updateOne({_id:'rules-'+schemeId},{$set:{
     id:'rules-'+schemeId,schemeId,status:'REVIEW_REQUIRED',publicationStatus:'INTERNAL',completeness:'COMPLETE',
     missingInformation:[],rules:rules[schemeId],questions:questions[schemeId],sourceVersionIds:[scheme.currentVersionId],
     sourceBindings,exceptions:[],effectiveFrom,effectiveUntil,cacheStale:false,contentHash:ruleHash,revision,lastCheckedAt:now,
     original:{...(current?.original||{}),rulesEvidenceReview:review}
    },$push:{revisionHistory:{revision:current?.revision||0,previousStatus:current?.status||null,at:now,actor:'seedJanSurakshaRules',decision:'PREPARE_EXACT_RULES_FOR_HUMAN_REVIEW',snapshot:ruleHash}}},{upsert:true,session});
    outcome=current?'UPDATED':'NEW';
   }
   const candidate=apply?await models.EligibilityRuleSet.findById('rules-'+schemeId).session(session).lean():{...existing,_id:'rules-'+schemeId,id:'rules-'+schemeId,schemeId,status:'REVIEW_REQUIRED',publicationStatus:'INTERNAL',completeness:'COMPLETE',missingInformation:[],rules:rules[schemeId],questions:questions[schemeId],sourceVersionIds:[scheme.currentVersionId],sourceBindings,exceptions:[],effectiveFrom,effectiveUntil,cacheStale:false,original:{...(existing?.original||{}),rulesEvidenceReview:review}};
   const check=await inspectRules(candidate,{session,requireApproved:false});
   if(!check.ok)throw new Error(schemeId+': '+check.errors.join('; '));
   if(apply)await session.commitTransaction();else await session.abortTransaction();
   audit.push({schemeId,contentHash:ruleHash,ok:check.ok,status:'REVIEW_REQUIRED',outcome:apply?outcome:'VALIDATED_NOT_STORED'});
  }catch(error){if(session.inTransaction())await session.abortTransaction();throw error;}finally{await session.endSession();}
 }
 console.log(JSON.stringify({at:now,apply,audit,publications:0},null,2));
}finally{await disconnectDB();}
