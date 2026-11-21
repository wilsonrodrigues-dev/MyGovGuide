import test from 'node:test';import assert from 'node:assert/strict';import {formGuidanceFields} from '../src/lib/formGuidanceFields.js';
test('missing language field retains its official label and page without borrowing another explanation',()=>{
 const detail={fields:[{id:'a',label:'Name',page:1},{id:'b',label:'Address',page:2}],guidance:{fields:[{id:'a',originalLabel:'Name',explanation:'TEST reading aid'}]}};
 const fields=formGuidanceFields(detail);assert.equal(fields.length,2);assert.equal(fields[0].page,1);assert.equal(fields[1].label,'Address');assert.equal(fields[1].explanation,undefined);assert.equal(fields[1].needsVerification,true);
 detail.guidance.fields[0].page=2;assert.equal(formGuidanceFields(detail)[0].explanation,undefined);detail.guidance=null;assert.equal(formGuidanceFields(detail).length,2);
});
