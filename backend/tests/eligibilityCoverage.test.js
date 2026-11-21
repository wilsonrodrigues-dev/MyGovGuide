import test from 'node:test';import assert from 'node:assert/strict';import {hasSingleAccountRestriction} from '../src/services/eligibility/service.js';
test('one-account clause requires an unconditional exclusion, not a merely mentioned or optional question',()=>{
 const restriction={field:'alreadyEnrolled',dataType:'boolean',operator:'eq',value:false};assert.equal(hasSingleAccountRestriction([]),false);assert.equal(hasSingleAccountRestriction([restriction]),true);assert.equal(hasSingleAccountRestriction([{...restriction,value:true}]),false);assert.equal(hasSingleAccountRestriction([{logic:'AND',children:[restriction]}]),true);assert.equal(hasSingleAccountRestriction([{logic:'OR',children:[restriction,{field:'age'}]}]),false);
});
