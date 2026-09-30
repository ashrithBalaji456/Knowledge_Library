import fs from 'fs';
import path from 'path';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

const dir = 'C:\\Users\\ashri\\Downloads\\Telegram Desktop\\DevotioanalBooks';

async function scanPdfs(folder) {
  const results = [];
  const entries = fs.readdirSync(folder, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(folder, entry.name);
    if (entry.isDirectory()) {
      const sub = await scanPdfs(full);
      results.push(...sub);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.pdf')) {
      results.push(full);
    }
  }
  return results;
}

async function inspectAll() {
  const pdfs = await scanPdfs(dir);
  console.log(`Found ${pdfs.length} PDFs total.`);

  for (const pdfPath of pdfs) {
    try {
      const data = new Uint8Array(fs.readFileSync(pdfPath));
      const loadingTask = pdfjsLib.getDocument({ data });
      const doc = await loadingTask.promise;
      const numPages = doc.numPages;

      let sampleText = '';
      for (let i = 1; i <= Math.min(2, numPages); i++) {
        const page = await doc.getPage(i);
        const textContent = await page.getTextContent();
        sampleText += textContent.items.map(item => item.str).join(' ') + ' ';
      }

      console.log(JSON.stringify({
        fileName: path.basename(pdfPath),
        fullPath: pdfPath,
        pages: numPages,
        snippet: sampleText.slice(0, 200).replace(/\s+/g, ' ').trim()
      }));
    } catch (err) {
      console.log(JSON.stringify({
        fileName: path.basename(pdfPath),
        fullPath: pdfPath,
        error: err.message
      }));
    }
  }
}

inspectAll();
