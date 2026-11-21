const validRect=r=>Array.isArray(r)&&r.length===4&&r.every(Number.isFinite)&&r[2]>r[0]&&r[3]>r[1];
const normalize=s=>String(s||'').normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
export function reliableWidget(annotations,label){const candidates=annotations.filter(a=>a.subtype==='Widget'&&[a.fieldName,a.alternativeText].some(n=>normalize(n)===normalize(label))&&validRect(a.rect));return candidates.length===1?candidates[0]:null;}
export function checkedCoordinates(field,sha){const c=field?.coordinates;return /^[a-f0-9]{64}$/.test(sha||'')&&c&&c.documentSha256===sha&&c.provenance==='REVIEWED_COORDINATES'&&c.unit==='PDF_POINTS'&&Number.isInteger(c.page)&&c.page>=1&&validRect(c.rect)?c:null;}
