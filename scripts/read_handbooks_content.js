import fs from 'fs';
import path from 'path';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

const dir = 'C:\\Users\\ashri\\Downloads\\v2\\HandBooks_From_LinkedIn_Telegram';
const files = fs.readdirSync(dir);

for (const file of files) {
  const fullPath = path.join(dir, file);
  const data = new Uint8Array(fs.readFileSync(fullPath));
  try {
    const doc = await pdfjsLib.getDocument({ data }).promise;
    console.log(`\n========================================`);
    console.log(`FILE: ${file}`);
    console.log(`PAGES: ${doc.numPages}`);

    // Read first 2 pages
    let text = '';
    const maxPages = Math.min(doc.numPages, 3);
    for (let i = 1; i <= maxPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map(item => item.str).join(' ');
      text += `\n--- Page ${i} ---\n` + pageText.slice(0, 300);
    }
    console.log('Sample text:', text.slice(0, 600));
  } catch (err) {
    console.error(`Error reading ${file}:`, err.message);
  }
}
