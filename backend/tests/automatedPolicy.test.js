import test from 'node:test';import assert from 'node:assert/strict';
import {createAutomatedValidation,validAutomatedValidation,machineRuleValidated,ruleValidationSubject} from '../src/services/verification/automatedPolicy.js';
import {evaluateRuleSet} from '../src/services/eligibility/engine.js';
const checks={officialSource:true,sourceVersionIntegrity:true,coverage:true,factualConsistency:true,privacy:true,conflictsResolved:true};
const certificate=subject=>createAutomatedValidation({kind:'TEST',id:'TEST-ONLY',subjectHash:subject,sourceBindings:[{versionId:'SYNTHETIC-SOURCE',contentHash:'b'.repeat(64)}],checks,scope:'SYNTHETIC_TEST_ONLY',expiresAt:new Date(Date.now()+60000)});
test('automated validation has a distinct identity and fails when evidence, expiry or checks change',()=>{
 const c=certificate('a'.repeat(64));assert.equal(c.humanReviewed,false);assert.equal(c.governmentCertified,false);assert(validAutomatedValidation(c,{kind:'TEST',id:'TEST-ONLY',subjectHash:'a'.repeat(64)}));c.checks.coverage=false;assert(!validAutomatedValidation(c,{kind:'TEST',id:'TEST-ONLY',subjectHash:'a'.repeat(64)}));
 assert.throws(()=>certificate('bad'),{code:'AUTOMATED_VALIDATION_PREREQUISITES_MISSING'});
});
test('complete machine-validated rules execute without inventing human approval; incomplete or changed rules fail closed',()=>{
 const r={id:'TEST-ONLY',schemeId:'TEST-SCHEME',status:'RULES_VALIDATED_CURRENT',completeness:'COMPLETE',missingInformation:[],exceptions:[],sourceVersionIds:['SYNTHETIC-SOURCE'],sourceBindings:[{versionId:'SYNTHETIC-SOURCE',contentHash:'b'.repeat(64)}],effectiveFrom:'2026-01-01',effectiveUntil:'2099-01-01',rules:[{id:'age',field:'age',dataType:'number',operator:'gte',value:18,clauseRefs:['TEST']}],questions:[]};
 r.automatedValidation=createAutomatedValidation({kind:'ELIGIBILITY_RULESET',id:r.id,subjectHash:ruleValidationSubject(r),sourceBindings:r.sourceBindings,checks,scope:'SYNTHETIC_TEST_ONLY',expiresAt:new Date(Date.now()+60000)});assert(machineRuleValidated(r));assert.equal(evaluateRuleSet(r,{age:19},{sourceValid:true}).status,'MEETS_RECORDED_RULES');assert.equal(r.review,undefined);assert.equal(evaluateRuleSet(r,{age:17},{sourceValid:true}).status,'DOES_NOT_MEET_RECORDED_RULES');r.missingInformation=['unresolved exclusion'];assert.equal(evaluateRuleSet(r,{age:19},{sourceValid:true}).status,'CANNOT_DETERMINE');
});
