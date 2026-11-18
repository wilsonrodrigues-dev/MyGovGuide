const prohibited = /^(?:aadhaar(?:number|no)?|aadhar(?:number|no)?|beneficiary(?:id|list|records)|beneficiaries|accountnumber|bankaccount|mobilenumber|phonenumber|password|otp|apikey|accesstoken|citizenrecords|applicationid|personaldata)$/i;
export function redactPrivate(value) {
  if (Array.isArray(value)) return value.map(redactPrivate);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) =>
    [key, prohibited.test(key.replace(/[_\s-]/g, '')) ? '[REDACTED]' : redactPrivate(item)]));
  return value;
}
export function assertPublicResearch(value) {
  if (Array.isArray(value)) { value.forEach(assertPublicResearch); return; }
  if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) {
      if (prohibited.test(key.replace(/[_\s-]/g, ''))) throw new Error('Private citizen or credential fields are excluded from research ingestion');
      assertPublicResearch(item);
    }
  }
}
