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

async function run() {
  const files = await scanPdfs(dir);
  const out = [];

  for (const f of files) {
    const stat = fs.statSync(f);
    let pages = 0;
    try {
      const data = new Uint8Array(fs.readFileSync(f));
      const loadingTask = pdfjsLib.getDocument({ data });
      const doc = await loadingTask.promise;
      pages = doc.numPages;
    } catch (e) {
      pages = 0;
    }

    out.push({
      fileName: path.basename(f),
      fullPath: f,
      size: stat.size,
      pages: pages
    });
  }

  fs.writeFileSync('scripts/devotional_manifest.json', JSON.stringify(out, null, 2));
  console.log(`Saved ${out.length} items to scripts/devotional_manifest.json`);
}

run();
