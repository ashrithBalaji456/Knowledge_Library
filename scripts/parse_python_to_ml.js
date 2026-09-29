import fs from 'fs';
import path from 'path';

async function main() {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const rootDir = 'C:\\Users\\ashri\\Downloads\\v2\\python to ml';

  function getAllPdfs(dir) {
    let files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const ent of entries) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        files = files.concat(getAllPdfs(full));
      } else if (ent.name.toLowerCase().endsWith('.pdf')) {
        files.push({ name: ent.name, fullPath: full, size: fs.statSync(full).size });
      }
    }
    return files;
  }

  const rawPdfs = getAllPdfs(rootDir);
  console.log(`Found ${rawPdfs.length} raw PDF files.`);

  const processed = [];
  const seenHashes = new Set();
  const seenTitles = new Set();

  for (let i = 0; i < rawPdfs.length; i++) {
    const item = rawPdfs[i];
    const sizeMb = (item.size / (1024 * 1024)).toFixed(2);
    let title = item.name.replace(/\.[^/.]+$/, '');
    let author = 'Unknown';
    let pages = 0;
    let snippet = '';

    // Quick duplicate check on file size + base name
    const quickKey = `${item.size}_${item.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
    if (seenHashes.has(quickKey)) {
      continue; // Skip exact duplicate file
    }
    seenHashes.add(quickKey);

    try {
      const data = new Uint8Array(fs.readFileSync(item.fullPath));
      const doc = await pdfjs.getDocument({ data }).promise;
      pages = doc.numPages;

      const meta = await doc.getMetadata();
      if (meta?.info?.Title && meta.info.Title.trim().length > 3 && !meta.info.Title.startsWith('Microsoft Word') && !meta.info.Title.startsWith('untitled')) {
        title = meta.info.Title.trim();
      }
      if (meta?.info?.Author && meta.info.Author.trim().length > 2) {
        author = meta.info.Author.trim();
      }

      // Read page 1 text
      const page1 = await doc.getPage(1);
      const textObj = await page1.getTextContent();
      snippet = textObj.items.map((it) => it.str).join(' ').slice(0, 400).trim();
    } catch (e) {
      // fallback
    }

    processed.push({
      fileName: item.name,
      fullPath: item.fullPath,
      sizeBytes: item.size,
      pages,
      rawTitle: title,
      author,
      snippet,
      relFolder: path.relative(rootDir, path.dirname(item.fullPath)),
    });
  }

  console.log(`De-duplicated into ${processed.length} unique resources.`);
  fs.writeFileSync('scripts/parsed_raw_books.json', JSON.stringify(processed, null, 2));
}

main().catch(console.error);
