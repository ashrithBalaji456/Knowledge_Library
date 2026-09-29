import JSZip from 'jszip';
import * as pdfjsLib from 'pdfjs-dist';
import {
  Resource,
  Section,
  ImportReport,
  Relationship,
} from '../types/library';
import {
  ExtractedPDFMetadata,
  classifyResource,
  detectDuplicate,
  computeContentHash,
  buildResourceRelationships,
  normalizeText,
} from './librarianEngine';

// Configure pdfjs worker if available in browser environment
try {
  if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  }
} catch (e) {
  console.warn('PDF.js worker initialization notice:', e);
}

export interface IngestionProgressEvent {
  percent: number; // 0 - 100
  processedCount: number;
  totalCount: number;
  currentFileName: string;
  stage: 'extracting' | 'parsing' | 'classifying' | 'connecting' | 'complete';
}

/**
 * Extract metadata and text samples from a PDF ArrayBuffer
 */
export async function extractPdfMetadataAndText(
  arrayBuffer: ArrayBuffer,
  fileName: string
): Promise<ExtractedPDFMetadata> {
  const meta: ExtractedPDFMetadata = {
    fileName,
    fileSize: arrayBuffer.byteLength,
    title: fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
    totalPages: 1,
    sampleText: '',
    tableOfContents: [],
  };

  try {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true,
      stopAtErrors: false,
    });

    const pdfDoc = await loadingTask.promise;
    meta.totalPages = pdfDoc.numPages;

    // Extract PDF internal metadata
    try {
      const pdfMeta = await pdfDoc.getMetadata();
      if (pdfMeta && pdfMeta.info) {
        const info = pdfMeta.info as Record<string, any>;
        if (info.Title && typeof info.Title === 'string' && info.Title.trim().length > 2) {
          meta.title = info.Title.trim();
        }
        if (info.Author && typeof info.Author === 'string') {
          meta.author = info.Author.trim();
        }
        if (info.Subject && typeof info.Subject === 'string') {
          meta.subject = info.Subject.trim();
        }
        if (info.Keywords && typeof info.Keywords === 'string') {
          meta.keywords = info.Keywords.split(/[,;]+/).map((k) => k.trim());
        }
      }
    } catch {
      // Ignore metadata parsing error and continue to text extraction
    }

    // Extract text from the first 2-3 pages (TOC & Intro) for content understanding
    const pagesToScan = Math.min(3, pdfDoc.numPages);
    let extractedSample = '';

    for (let pageNum = 1; pageNum <= pagesToScan; pageNum++) {
      try {
        const page = await pdfDoc.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str || '')
          .join(' ')
          .trim();
        extractedSample += ' ' + pageText;
      } catch {
        // Continue if single page scan fails
      }
    }

    meta.sampleText = extractedSample.slice(0, 1500).trim();
  } catch (err) {
    console.warn(`PDF text extraction warning for ${fileName}:`, err);
    // Graceful fallback to filename-based analysis
  }

  return meta;
}

/**
 * Ingest multiple files or a ZIP archive containing PDFs (Rules 30 & 31)
 */
export async function processIngestionFiles(
  files: File[],
  existingSections: Section[],
  existingResources: Resource[],
  onProgress?: (event: IngestionProgressEvent) => void
): Promise<{
  report: ImportReport;
  newSections: Section[];
  newRelationships: Relationship[];
}> {
  const pdfItems: { name: string; buffer: ArrayBuffer; fileDataUrl?: string }[] = [];

  // Stage 1: Unpack files & ZIPs
  onProgress?.({
    percent: 5,
    processedCount: 0,
    totalCount: files.length,
    currentFileName: 'Extracting uploaded files...',
    stage: 'extracting',
  });

  for (const file of files) {
    if (file.name.toLowerCase().endsWith('.zip')) {
      try {
        const zip = new JSZip();
        const zipContent = await zip.loadAsync(file);

        const pdfEntries = Object.keys(zipContent.files).filter(
          (path) => path.toLowerCase().endsWith('.pdf') && !path.startsWith('__MACOSX/')
        );

        for (const pdfPath of pdfEntries) {
          const entry = zipContent.files[pdfPath];
          if (!entry.dir) {
            const buffer = await entry.async('arraybuffer');
            const cleanName = pdfPath.split('/').pop() || pdfPath;
            pdfItems.push({ name: cleanName, buffer });
          }
        }
      } catch (err) {
        console.error('Failed to unpack ZIP:', err);
      }
    } else if (file.name.toLowerCase().endsWith('.pdf')) {
      const buffer = await file.arrayBuffer();
      // Generate object URL for direct viewing in PDF reader
      const blob = new Blob([buffer], { type: 'application/pdf' });
      const fileDataUrl = URL.createObjectURL(blob);
      pdfItems.push({ name: file.name, buffer, fileDataUrl });
    }
  }

  const total = pdfItems.length;
  const report: ImportReport = {
    added: [],
    duplicates: [],
    needsReview: [],
    failed: [],
    newSectionsCreated: [],
    newSubsectionsCreated: [],
    relationshipsCreated: 0,
    learningPathsUpdated: 0,
  };

  const newSectionsList: Section[] = [...existingSections];
  const newRelationshipsList: Relationship[] = [];
  const currentResourcePool: Resource[] = [...existingResources];

  // Stage 2: Process each PDF sequentially with progress tracking
  for (let idx = 0; idx < total; idx++) {
    const item = pdfItems[idx];
    const progressPercent = Math.round(15 + ((idx + 1) / total) * 75);

    onProgress?.({
      percent: progressPercent,
      processedCount: idx + 1,
      totalCount: total,
      currentFileName: item.name,
      stage: 'parsing',
    });

    try {
      // 1. Extract metadata and sample text
      const meta = await extractPdfMetadataAndText(item.buffer, item.name);
      const fileHash = computeContentHash(item.name + '_' + item.buffer.byteLength);

      // 2. Duplicate Detection (Rule 12)
      const dupCheck = detectDuplicate(fileHash, meta.title || item.name, meta.author || '', currentResourcePool);
      if (dupCheck.isDuplicate && dupCheck.matchedResource) {
        const dummyNew: Resource = {
          id: `res-dup-${Date.now()}-${idx}`,
          title: meta.title || item.name,
          author: meta.author || 'Unknown',
          source: 'uploaded_pdf',
          category: dupCheck.matchedResource.category,
          subCategory: dupCheck.matchedResource.subCategory,
          resourceType: 'BOOK',
          difficulty: 'INTERMEDIATE',
          topics: [],
          tags: [],
          whatIsThisBookFor: 'Duplicate copy',
          summary: 'Duplicate copy detected',
          keyTakeaways: [],
          prerequisites: [],
          recommendedNext: [],
          readingStatus: 'NOT_STARTED',
          progress: 0,
          priority: 'NORMAL',
          fileHash,
        };

        report.duplicates.push({
          file: item.name,
          existing: dupCheck.matchedResource,
          newResource: dummyNew,
          action: 'keep_existing',
        });
        continue;
      }

      // 3. Intelligent Classification (Rules 1, 6, 7, 8)
      onProgress?.({
        percent: progressPercent,
        processedCount: idx + 1,
        totalCount: total,
        currentFileName: item.name,
        stage: 'classifying',
      });

      const classification = classifyResource(meta, newSectionsList, currentResourcePool);

      // Check if a genuinely new Section needs creation (Rule 8 & 72)
      let targetSection = newSectionsList.find((s) => s.id === classification.primaryCategory);
      if (!targetSection) {
        targetSection = {
          id: classification.primaryCategory,
          name: classification.categoryName,
          code: classification.categoryName.slice(0, 4).toUpperCase(),
          description: `Curated collection for ${classification.categoryName}`,
          icon: classification.wing === 'handbooks' ? '📚' : classification.wing === 'humanities' ? '🕊️' : '💻',
          color: classification.colorHex,
          accentColor: classification.colorHex,
          subSections: [classification.subcategory],
          wing: classification.wing,
          anchorPosition: [0, 0, 0], // placementEngine will calculate real 3D coordinates
          isHandbookSection: classification.resourceType === 'HANDBOOK',
        };
        newSectionsList.push(targetSection);
        report.newSectionsCreated.push(targetSection.name);
      } else {
        // Add subsection if not already present
        if (!targetSection.subSections.includes(classification.subcategory)) {
          targetSection.subSections.push(classification.subcategory);
          report.newSubsectionsCreated.push(`${targetSection.name} → ${classification.subcategory}`);
        }
      }

      // 4. Construct Canonical Resource Record (Rule 11)
      const resourceId = `res-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 5)}`;
      const newBook: Resource = {
        id: resourceId,
        title: meta.title || item.name.replace(/\.[^/.]+$/, ''),
        author: meta.author || 'Not specified in source',
        authors: meta.author ? [meta.author] : [],
        publisher: 'Not specified in source',
        pages: meta.totalPages || 0,
        fileName: item.name,
        fileType: 'PDF',
        fileSize: item.buffer.byteLength,
        fileHash,
        fileDataUrl: item.fileDataUrl,
        source: 'uploaded_pdf',
        category: targetSection.id,
        subCategory: classification.subcategory,
        resourceType: classification.resourceType,
        difficulty: classification.difficulty,
        topics: classification.topics,
        tags: classification.tags,
        whatIsThisBookFor: classification.whatIsThisBookFor,
        summary: classification.summary,
        keyTakeaways: classification.keyTakeaways,
        prerequisites: classification.prerequisites,
        recommendedNext: classification.recommendedNext,
        readingStatus: 'NOT_STARTED',
        progress: 0,
        currentPage: 1,
        totalPages: meta.totalPages || 1,
        dateAdded: new Date().toISOString(),
        isFavorite: false,
        priority: classification.priority,
        confidence: classification.confidence,
        notes: [],
        bookmarks: [],
      };

      currentResourcePool.push(newBook);
      report.added.push(newBook);

      if (classification.confidence.needsReview) {
        report.needsReview.push(newBook);
      }

      // 5. Connect Related Books (Rules 18, 22, 47)
      const rels = buildResourceRelationships(newBook, currentResourcePool);
      newRelationshipsList.push(...rels);
      report.relationshipsCreated += rels.length;
    } catch (err: any) {
      console.error(`Failed to ingest ${item.name}:`, err);
      report.failed.push({ fileName: item.name, error: err.message || 'Unknown processing error' });
    }
  }

  onProgress?.({
    percent: 100,
    processedCount: total,
    totalCount: total,
    currentFileName: 'Import complete!',
    stage: 'complete',
  });

  return {
    report,
    newSections: newSectionsList,
    newRelationships: newRelationshipsList,
  };
}
