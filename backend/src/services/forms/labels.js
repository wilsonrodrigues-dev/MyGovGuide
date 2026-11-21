import {orderedLabels} from './orderedLabels.js';
// A fixed vocabulary prevents filled values or arbitrary PDF instructions from
// being reflected as guidance. Unknown labels remain unverified, never invented.
export const fieldLabels=['First Name','Middle Name','Last Name','Name of the Applicant','Name of Applicant','Name of the beneficiary','Consumer Name','Name','Date of Birth','DOB as per Aadhaar','Aadhaar Number','Aadhaar','Mobile No','Mobile','E-mail ID','Address','House Number/ Flat Name','Floor Number','Street Name/ Road Name','Village/ Town','PIN','Pin Code','District','State','Bank Name','Branch Name','IFSC Code','Bank Account Number','Name in Bank Account','Relationship','Gender','Signature','Date','Place'];
export function detectableLabels(text){return orderedLabels(text,fieldLabels);}
