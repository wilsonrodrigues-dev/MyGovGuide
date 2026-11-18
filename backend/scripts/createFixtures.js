import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { serverRoot } from '../src/config/env.js';
const fixtures = path.join(serverRoot, 'fixtures');
// A minimal PDF created solely from project-authored text. Byte offsets are computed.
const stream = 'BT /F1 14 Tf 50 760 Td (SYNTHETIC local document. No operative government policy.) Tj ET';
const objects = [
  '<< /Type /Catalog /Pages 2 0 R >>',
  '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
  '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`
];
let pdf = '%PDF-1.4\n'; const offsets = [0];
objects.forEach((value, i) => { offsets.push(Buffer.byteLength(pdf)); pdf += `${i + 1} 0 obj\n${value}\nendobj\n`; });
const xref = Buffer.byteLength(pdf);
pdf += `xref\n0 6\n0000000000 65535 f \n${offsets.slice(1).map(n => `${String(n).padStart(10, '0')} 00000 n \n`).join('')}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
await writeFile(path.join(fixtures, 'document.pdf'), pdf);
const directory = path.join(fixtures, 'research-package'); await mkdir(directory, { recursive: true });
const metadata = { synthetic: true, warning: 'NOT Phase 1 research; contract fixture only' };
const base = { sourceIds: ['synthetic-source'], sourceUrl: 'https://example.test/research' };
const files = {
  'SOURCE_REGISTRY.json': { metadata, sources: [{ id: 'synthetic-source', title: 'SYNTHETIC source', url: base.sourceUrl }] },
  'VERIFIED_SCHEMES.json': { metadata, schemes: [{ id: 'synthetic-scheme', title: 'SYNTHETIC scheme', ...base,
    description: 'ಕನ್ನಡ हिंदी English', state: 'Karnataka', category: 'student', benefits: 'Research description only' }] },
  'FORMS_REGISTRY.json': { metadata, forms: [{ id: 'synthetic-form', title: 'SYNTHETIC instructions', ...base,
    formKind: 'INSTRUCTIONS_ONLY', schemeId: 'synthetic-scheme' }], brokenLinkDoNotUse: [{ url: 'https://example.test/broken', reason: 'Synthetic excluded link' }] },
  'NOTICES_AND_ALERTS.json': { metadata, notices: [{ id: 'synthetic-notice', title: 'SYNTHETIC notice', ...base }],
    scamAwareness: [{ id: 'synthetic-awareness', title: 'SYNTHETIC awareness topic', ...base }] }
};
for (const [file, data] of Object.entries(files)) await writeFile(path.join(directory, file), `${JSON.stringify(data, null, 2)}\n`);
console.log('Generated project-authored fixtures only.');
