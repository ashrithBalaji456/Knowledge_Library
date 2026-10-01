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
  BookOpen,
  List,
  ExternalLink,
} from 'lucide-react';
import { getPdfUrl, openPdfInNewTab } from '../../utils/pdfViewer';

export const PDFReaderModal: React.FC = () => {
  const pdfResource = useLibraryStore((s) => s.pdfResource);
  const closePdfReader = useLibraryStore((s) => s.closePdfReader);
  const updateReadingProgress = useLibraryStore((s) => s.updateReadingProgress);

  const [currentPage, setCurrentPage] = useState(pdfResource?.currentPage || 1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showToc, setShowToc] = useState(false);

  if (!pdfResource) return null;

  const pdfUrl = getPdfUrl(pdfResource);
  const totalPages = pdfResource.totalPages || pdfResource.pages || 320;
  const samplePages = pdfResource.contentSample || [
    `# ${pdfResource.title}\n\n**Author:** ${pdfResource.author}\n**Category:** ${pdfResource.category}\n\n${pdfResource.summary || pdfResource.whatIsThisBookFor}`,
    `## Purpose & Scope\n\n${pdfResource.whatIsThisBookFor}\n\n### Key Concepts:\n${(pdfResource.keyTakeaways || []).map((k) => `- ${k}`).join('\n')}`,
    `## Foundational Theory & System Mechanics\n\nTo master this domain, engineers must understand the core abstractions before scaling out.\n\nKey takeaways:\n1. Maintain invariant integrity across distributed states.\n2. Leverage declarative pipelines rather than imperative loops.\n3. Benchmark under realistic load before optimizing premature hotspots.`,
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
    <div className="fixed inset-0 z-50 flex flex-col bg-stone-950 text-stone-100 select-none overflow-hidden">
      {/* Top Toolbar */}
      <div className="h-16 px-4 md:px-6 bg-stone-900/95 border-b border-stone-800 flex items-center justify-between gap-4 shrink-0 shadow-lg">
        {/* Return to Library (Rule 43: returns to exact physical 3D position) */}
        <button
          onClick={closePdfReader}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold border border-stone-700 hover:border-amber-400/50 transition-all cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
          <span>RETURN TO LIBRARY</span>
        </button>

        {/* Book Title & Progress Pill */}
        <div className="flex flex-col items-center max-w-md truncate text-center">
          <h2 className="text-sm font-bold text-stone-100 font-heading truncate">
            {pdfResource.title}
          </h2>
          <div className="flex items-center gap-2 text-[11px] text-stone-400">
            <span>by {pdfResource.author}</span>
            <span>•</span>
            <span className="font-mono text-amber-400 font-semibold">
              Page {currentPage} of {totalPages} ({progressPct}%)
            </span>
          </div>
        </div>

        {/* Controls: Zoom, Bookmarks, TOC, Fullscreen, Open in New Tab */}
        <div className="flex items-center gap-2">
          {pdfUrl && (
            <button
              onClick={() => openPdfInNewTab(pdfResource)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-950 transition cursor-pointer"
              title="Open actual PDF in new browser tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Open in New Tab</span>
            </button>
          )}

          <button
            onClick={() => setShowToc(!showToc)}
            className={`p-2 rounded-xl border text-xs cursor-pointer transition-colors ${
              showToc ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-stone-800 border-stone-700 text-stone-300 hover:bg-stone-700'
            }`}
            title="Table of Contents"
          >
            <List className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setIsBookmarked(!isBookmarked);
              sound.playChime();
            }}
            className={`p-2 rounded-xl border text-xs cursor-pointer transition-colors ${
              isBookmarked ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-stone-800 border-stone-700 text-stone-300 hover:bg-stone-700'
            }`}
            title="Bookmark Page"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-300' : ''}`} />
          </button>

          {!pdfResource.fileDataUrl && (
            <div className="hidden sm:flex items-center bg-stone-800 border border-stone-700 rounded-xl overflow-hidden">
              <button
                onClick={handleZoomOut}
                className="p-2 hover:bg-stone-700 text-stone-300 cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="px-2 text-xs font-mono text-stone-400">{zoomLevel}%</span>
              <button
                onClick={handleZoomIn}
                className="p-2 hover:bg-stone-700 text-stone-300 cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          )}

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-300 cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Reading Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Table of Contents Drawer */}
        {showToc && (
          <div className="w-72 bg-stone-900 border-r border-stone-800 p-4 overflow-y-auto space-y-3 shrink-0 animate-in slide-in-from-left duration-200">
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
              Table of Contents
            </h3>
            <div className="space-y-1">
              {[
                { title: '1. Foundations & Philosophy', page: 1 },
                { title: '2. Core Architecture & Mental Models', page: Math.round(totalPages * 0.15) },
                { title: '3. Concurrency & State Management', page: Math.round(totalPages * 0.35) },
                { title: '4. Performance Tuning & Latency', page: Math.round(totalPages * 0.6) },
                { title: '5. Production Reliability & Operations', page: Math.round(totalPages * 0.8) },
              ].map((item) => (
                <button
                  key={item.page}
                  onClick={() => {
                    setCurrentPage(item.page);
                    updateReadingProgress(pdfResource.id, item.page, totalPages);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between cursor-pointer transition-colors ${
                    currentPage >= item.page
                      ? 'bg-stone-800 text-amber-300 font-semibold'
                      : 'text-stone-400 hover:bg-stone-800/50'
                  }`}
                >
                  <span className="truncate">{item.title}</span>
                  <span className="font-mono text-[11px] text-stone-500">p.{item.page}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Central Viewport */}
        {pdfUrl ? (
          pdfResource.resourceType === 'AUDIO' || (pdfResource.fileName && pdfResource.fileName.toLowerCase().endsWith('.mp3')) ? (
            <div className="flex-1 w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-stone-900 via-stone-950 to-black select-none">
              <div className="max-w-xl w-full p-8 rounded-3xl bg-stone-900/90 border border-stone-800/80 shadow-2xl flex flex-col items-center text-center space-y-6 backdrop-blur-md">
                <div className="w-32 h-32 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center text-5xl shadow-inner text-amber-400 animate-pulse">
                  🎧
                </div>
                <div className="space-y-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Sacred Audio Recitation
                  </span>
                  <h2 className="text-xl md:text-2xl font-bold text-stone-100 font-heading">
                    {pdfResource.title}
                  </h2>
                  <p className="text-sm text-stone-400">{pdfResource.author}</p>
                </div>
                <p className="text-xs text-stone-400 max-w-md leading-relaxed">
                  {pdfResource.summary || pdfResource.whatIsThisBookFor}
                </p>
                <div className="w-full pt-2">
                  <audio
                    controls
                    autoPlay
                    src={pdfUrl}
                    className="w-full rounded-xl filter invert hue-rotate-180 brightness-95 opacity-90 shadow-md"
                  >
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </div>
            </div>
          ) : pdfResource.resourceType === 'GAME' || pdfResource.category.includes('arcade') ? (
            <div className="flex-1 w-full h-full flex flex-col p-2 bg-stone-950">
              <div className="flex items-center justify-between px-4 py-2.5 bg-stone-900/90 border border-stone-800 rounded-t-xl text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span className="font-mono text-cyan-300 font-bold uppercase tracking-wider">
                    Interactive Arcade Session • {pdfResource.fileName || 'Game Arena'}
                  </span>
                </div>
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-lg bg-gradient-to-r from-cyan-600 to-pink-600 hover:from-cyan-500 hover:to-pink-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-900/30 transition cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Launch in Full Browser Window</span>
                </a>
              </div>
              <iframe
                src={pdfUrl}
                className="w-full flex-1 border-none rounded-b-xl bg-stone-900 shadow-2xl"
                title={pdfResource.title}
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              />
            </div>
          ) : (
            <div className="flex-1 w-full h-full p-2 bg-stone-950">
              <iframe
                src={pdfUrl}
                className="w-full h-full border-none rounded-xl bg-white shadow-2xl"
                title={pdfResource.title}
              />
            </div>
          )
        ) : (
          <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center bg-stone-950">
            <div
              className="w-full max-w-3xl bg-stone-900/95 rounded-2xl border border-stone-800 shadow-2xl p-8 md:p-12 text-stone-200 flex flex-col justify-between transition-all"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            >
              <div className="space-y-6 select-text">
                <div className="flex items-center justify-between pb-4 border-b border-stone-800 text-xs text-stone-500">
                  <span>{pdfResource.title}</span>
                  <span>Section: {pdfResource.category}</span>
                </div>

                <div className="prose prose-invert max-w-none text-sm md:text-base leading-relaxed space-y-4">
                  {currentContent.split('\n\n').map((paragraph, idx) => {
                    if (paragraph.startsWith('# ')) {
                      return (
                        <h1 key={idx} className="text-2xl font-bold text-amber-300 font-heading pt-2">
                          {paragraph.replace('# ', '')}
                        </h1>
                      );
                    }
                    if (paragraph.startsWith('## ')) {
                      return (
                        <h2 key={idx} className="text-lg font-bold text-stone-100 font-heading pt-2">
                          {paragraph.replace('## ', '')}
                        </h2>
                      );
                    }
                    if (paragraph.startsWith('```')) {
                      const cleanCode = paragraph.replace(/```[a-z]*/g, '').trim();
                      return (
                        <pre key={idx} className="p-4 rounded-xl bg-stone-950 border border-stone-800 font-mono text-xs text-emerald-300 overflow-x-auto">
                          {cleanCode}
                        </pre>
                      );
                    }
                    return (
                      <p key={idx} className="text-stone-300 font-light leading-relaxed">
                        {paragraph}
                      </p>
                    );
                  })}
                </div>
              </div>

              <div className="pt-8 mt-12 border-t border-stone-800 flex items-center justify-between text-xs text-stone-500">
                <span>Personal Knowledge Library System</span>
                <span className="font-mono font-bold text-stone-400">Page {currentPage}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Pagination Bar */}
      <div className="h-16 px-6 bg-stone-900/95 border-t border-stone-800 flex items-center justify-between shrink-0 shadow-lg">
        <button
          onClick={handlePrevPage}
          disabled={currentPage <= 1}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 disabled:opacity-40 disabled:pointer-events-none text-stone-200 text-xs font-semibold border border-stone-700 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

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
            className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
          <span className="text-xs font-mono text-stone-400 whitespace-nowrap">
            {currentPage} / {totalPages}
          </span>
        </div>

        <button
          onClick={handleNextPage}
          disabled={currentPage >= totalPages}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 disabled:opacity-40 disabled:pointer-events-none text-stone-200 text-xs font-semibold border border-stone-700 cursor-pointer"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
