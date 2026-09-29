import React, { useState, useEffect } from 'react';
import { useLibraryStore } from '../../store/useLibraryStore';
import { sound } from '../../engine/soundEngine';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Bookmark,
  Search,
  BookOpen,
  List,
  CheckCircle,
  FileText
} from 'lucide-react';

export const PDFReaderModal: React.FC = () => {
  const pdfResource = useLibraryStore((s) => s.pdfResource);
  const closePdfReader = useLibraryStore((s) => s.closePdfReader);
  const updateReadingProgress = useLibraryStore((s) => s.updateReadingProgress);

  const [currentPage, setCurrentPage] = useState(pdfResource?.currentPage || 1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showToc, setShowToc] = useState(false);
  const [pageSearchTerm, setPageSearchTerm] = useState('');

  if (!pdfResource) return null;

  const totalPages = pdfResource.totalPages || 320;
  const samplePages = pdfResource.contentSample || [
    `# ${pdfResource.title}\n\n**Author:** ${pdfResource.author}\n**Category:** ${pdfResource.category}\n\n${pdfResource.description}`,
    `## Foundational Theory & System Mechanics\n\nTo master this domain, engineers must understand the core abstractions before scaling out.\n\nKey takeaways:\n1. Maintain invariant integrity across distributed states.\n2. Leverage declarative pipelines rather than imperative loops.\n3. Benchmark under realistic load before optimizing premature hotspots.`,
    `## Deep Dive Architecture & Code Patterns\n\n\`\`\`java\npublic class Engine {\n    public static void main(String[] args) {\n        System.out.println("Processing high throughput event streams...");\n    }\n}\n\`\`\`\n\nEnsure lock-free concurrency and non-blocking I/O whenever possible.`,
    `## Production Verification & Best Practices\n\nAlways deploy telemetry, metrics, and distributed tracing. Review latency percentiles (p95, p99) rather than misleading averages.`
  ];

  const currentContent =
    samplePages[(currentPage - 1) % samplePages.length] || samplePages[0];

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      sound.playPageFlip();
      const next = currentPage + 1;
      setCurrentPage(next);
      updateReadingProgress(pdfResource.id, next, totalPages);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      sound.playPageFlip();
      const prev = currentPage - 1;
      setCurrentPage(prev);
      updateReadingProgress(pdfResource.id, prev, totalPages);
    }
  };

  const handleZoomIn = () => setZoomLevel((z) => Math.min(180, z + 15));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(70, z - 15));

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Keyboard navigation for page turns
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNextPage();
      if (e.key === 'ArrowLeft') handlePrevPage();
      if (e.key === 'Escape') closePdfReader();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages]);

  const progressPct = Math.round((currentPage / totalPages) * 100);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-slate-100 select-none overflow-hidden">
      {/* --- TOP TOOLBAR --- */}
      <div className="h-16 px-4 md:px-6 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0 shadow-lg">
        {/* Return to Library Button (returns to exact physical camera spot) */}
        <button
          onClick={closePdfReader}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 hover:border-amber-400/50 transition-all cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
          <span>RETURN TO LIBRARY</span>
        </button>

        {/* Book Title & Progress Pill */}
        <div className="flex flex-col items-center max-w-md truncate text-center">
          <h2 className="text-sm font-bold text-slate-100 font-['Outfit'] truncate">
            {pdfResource.title}
          </h2>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span>by {pdfResource.author}</span>
            <span>•</span>
            <span className="font-mono text-amber-400 font-semibold">
              Page {currentPage} of {totalPages} ({progressPct}%)
            </span>
          </div>
        </div>

        {/* Controls: Zoom, Bookmarks, TOC, Fullscreen */}
        <div className="flex items-center gap-2">
          {/* Table of contents toggle */}
          <button
            onClick={() => setShowToc(!showToc)}
            className={`p-2 rounded-xl border text-xs cursor-pointer transition-colors ${
              showToc ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
            title="Table of Contents"
          >
            <List className="w-4 h-4" />
          </button>

          {/* Bookmark toggle */}
          <button
            onClick={() => {
              setIsBookmarked(!isBookmarked);
              sound.playChime();
            }}
            className={`p-2 rounded-xl border text-xs cursor-pointer transition-colors ${
              isBookmarked ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
            title="Bookmark Page"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-300' : ''}`} />
          </button>

          {/* Zoom controls */}
          <div className="hidden sm:flex items-center bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
            <button
              onClick={handleZoomOut}
              className="p-2 hover:bg-slate-700 text-slate-300 cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="px-2 text-xs font-mono text-slate-400">{zoomLevel}%</span>
            <button
              onClick={handleZoomIn}
              className="p-2 hover:bg-slate-700 text-slate-300 cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* --- READING WORKSPACE --- */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Table of Contents Drawer */}
        {showToc && (
          <div className="w-72 bg-slate-900 border-r border-slate-800 p-4 overflow-y-auto space-y-3 shrink-0 animate-in slide-in-from-left duration-200">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Table of Contents
            </h3>
            <div className="space-y-1">
              {[
                { title: '1. Foundations & Philosophy', page: 1 },
                { title: '2. Core Architecture & Mental Models', page: 45 },
                { title: '3. Concurrency & State Management', page: 112 },
                { title: '4. Performance Tuning & Latency', page: 184 },
                { title: '5. Production Reliability & Operations', page: 260 },
              ].map((item) => (
                <button
                  key={item.page}
                  onClick={() => {
                    setCurrentPage(item.page);
                    updateReadingProgress(pdfResource.id, item.page, totalPages);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between cursor-pointer transition-colors ${
                    currentPage >= item.page
                      ? 'bg-slate-800 text-amber-300 font-semibold'
                      : 'text-slate-400 hover:bg-slate-800/50'
                  }`}
                >
                  <span className="truncate">{item.title}</span>
                  <span className="font-mono text-[11px] text-slate-500">p.{item.page}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Central Document Page Viewport */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center bg-slate-950">
          <div
            className="w-full max-w-3xl bg-slate-900/90 rounded-2xl border border-slate-800 shadow-2xl p-8 md:p-12 text-slate-200 flex flex-col justify-between transition-all"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          >
            {/* Rendered Document Page */}
            <div className="space-y-6 select-text">
              {/* Header on page */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs text-slate-500">
                <span>{pdfResource.title}</span>
                <span>Section: {pdfResource.category}</span>
              </div>

              {/* Page Body with formatting */}
              <div className="prose prose-invert max-w-none text-sm md:text-base leading-relaxed space-y-4">
                {currentContent.split('\n\n').map((paragraph, idx) => {
                  if (paragraph.startsWith('# ')) {
                    return (
                      <h1 key={idx} className="text-2xl font-bold text-amber-300 font-['Outfit'] pt-2">
                        {paragraph.replace('# ', '')}
                      </h1>
                    );
                  }
                  if (paragraph.startsWith('## ')) {
                    return (
                      <h2 key={idx} className="text-lg font-bold text-slate-100 font-['Outfit'] pt-2">
                        {paragraph.replace('## ', '')}
                      </h2>
                    );
                  }
                  if (paragraph.startsWith('```')) {
                    const cleanCode = paragraph.replace(/```[a-z]*/g, '').trim();
                    return (
                      <pre key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto">
                        {cleanCode}
                      </pre>
                    );
                  }
                  return (
                    <p key={idx} className="text-slate-300 font-light leading-relaxed">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </div>

            {/* Page Footer */}
            <div className="pt-8 mt-12 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>Personal Knowledge Library System</span>
              <span className="font-mono font-bold text-slate-400">Page {currentPage}</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- BOTTOM PAGINATION BAR --- */}
      <div className="h-16 px-6 bg-slate-900/95 border-t border-slate-800 flex items-center justify-between shrink-0 shadow-lg">
        {/* Previous Button */}
        <button
          onClick={handlePrevPage}
          disabled={currentPage <= 1}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        {/* Page Slider & Direct Input */}
        <div className="flex items-center gap-3 w-full max-w-md mx-4">
          <input
            type="range"
            min={1}
            max={totalPages}
            value={currentPage}
            onChange={(e) => {
              const val = Number(e.target.value);
              setCurrentPage(val);
              updateReadingProgress(pdfResource.id, val, totalPages);
            }}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
          <span className="text-xs font-mono text-slate-400 whitespace-nowrap">
            {currentPage} / {totalPages}
          </span>
        </div>

        {/* Next Button */}
        <button
          onClick={handleNextPage}
          disabled={currentPage >= totalPages}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
