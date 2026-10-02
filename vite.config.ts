import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, type Plugin } from 'vite'
import fs from 'node:fs'
import path from 'node:path'

function localPdfServer(): Plugin {
  const findInFolderRecursive = (dir: string, targetName: string): string | null => {
    if (!fs.existsSync(dir)) return null;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        const found = findInFolderRecursive(full, targetName);
        if (found) return found;
      } else if (entry.isFile() && entry.name.toLowerCase() === targetName.toLowerCase()) {
        return full;
      }
    }
    return null;
  };

  const handler = (req: any, res: any, next: any) => {
    if (req.url && req.url.startsWith('/api/pdf')) {
      try {
        const urlObj = new URL(req.url, 'http://localhost:5173');
        let targetPath = urlObj.searchParams.get('path');
        if (!targetPath) {
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('Missing path parameter');
          return;
        }

        targetPath = decodeURIComponent(targetPath);

        let resolved = path.resolve(targetPath);
        if (!fs.existsSync(resolved)) {
          // Attempt searching across user's downloads folders (Gate_2026, Telegram Desktop, v2, etc.)
          let candidate = findInFolderRecursive('C:\\Users\\ashri\\Downloads\\Gate_2026', path.basename(targetPath));
          if (!candidate) candidate = findInFolderRecursive('C:\\Users\\ashri\\Downloads\\Telegram Desktop\\DevotioanalBooks', path.basename(targetPath));
          if (!candidate) candidate = findInFolderRecursive('C:\\Users\\ashri\\Downloads\\Telegram Desktop', path.basename(targetPath));
          if (!candidate) candidate = findInFolderRecursive('C:\\Users\\ashri\\Downloads\\v2', path.basename(targetPath));
          if (!candidate) candidate = findInFolderRecursive('C:\\Users\\ashri\\Downloads', path.basename(targetPath));
          if (candidate) resolved = candidate;
        }

        if (!fs.existsSync(resolved)) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end(`PDF file not found: ${resolved}`);
          return;
        }

        const stat = fs.statSync(resolved);
        const fileSize = stat.size;
        const range = req.headers.range;

        const mimeType = resolved.toLowerCase().endsWith('.mp3') ? 'audio/mpeg' : 'application/pdf';

        // Support HTTP Range requests for instant PDF/audio seeking
        if (range) {
          const parts = range.replace(/bytes=/, '').split('-');
          const start = parseInt(parts[0], 10);
          const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
          const chunksize = end - start + 1;
          const fileStream = fs.createReadStream(resolved, { start, end });

          res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': mimeType,
            'Content-Disposition': `inline; filename="${encodeURIComponent(path.basename(resolved))}"`,
            'Access-Control-Allow-Origin': '*',
          });
          fileStream.pipe(res);
        } else {
          res.writeHead(200, {
            'Content-Length': fileSize,
            'Content-Type': mimeType,
            'Accept-Ranges': 'bytes',
            'Content-Disposition': `inline; filename="${encodeURIComponent(path.basename(resolved))}"`,
            'Access-Control-Allow-Origin': '*',
          });
          fs.createReadStream(resolved).pipe(res);
        }
        return;
      } catch (err: any) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Server error streaming PDF: ${err?.message}`);
        return;
      }
    }
    next();
  };

  return {
    name: 'local-pdf-server',
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    localPdfServer(),
  ],
})
