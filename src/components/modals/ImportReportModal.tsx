import React, { useState } from 'react';
import {
  CheckCircle,
  AlertTriangle,
  Copy,
  BookOpen,
  ArrowRight,
  Sparkles,
  X,
  Compass,
} from 'lucide-react';
import { useLibraryStore } from '../../store/useLibraryStore';

export const ImportReportModal: React.FC = () => {
  const activeModal = useLibraryStore((s) => s.activeModal);
  const closeModal = useLibraryStore((s) => s.closeModal);
  const lastReport = useLibraryStore((s) => s.lastImportReport);
  const resolveDuplicate = useLibraryStore((s) => s.resolveDuplicate);
  const acceptReviewBook = useLibraryStore((s) => s.acceptReviewBook);
  const locateBook = useLibraryStore((s) => s.locateBook);
  const sections = useLibraryStore((s) => s.sections);

  const [activeTab, setActiveTab] = useState<'summary' | 'review' | 'duplicates'>('summary');

  if (activeModal !== 'importReport' || !lastReport) return null;

  const hasReviews = lastReport.needsReview.length > 0;
  const hasDuplicates = lastReport.duplicates.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="relative w-full max-w-3xl overflow-hidden glass-panel-glow rounded-2xl border border-amber-600/30 bg-stone-900/95 shadow-2xl text-stone-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-800 bg-stone-900/80">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-heading text-stone-100 flex items-center gap-2">
                Ingestion Complete
                <span className="text-xs font-mono py-0.5 px-2.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {lastReport.added.length} Resources Added
                </span>
              </h2>
              <p className="text-xs text-stone-400">
                All resources have been intelligently organized and placed on the shelves in the 3D library.
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-stone-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('summary')}
            className={`pb-2.5 px-3 border-b-2 transition ${
              activeTab === 'summary'
                ? 'border-amber-500 text-amber-400 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Overview & Summary
          </button>
          {hasReviews && (
            <button
              onClick={() => setActiveTab('review')}
              className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition ${
                activeTab === 'review'
                  ? 'border-amber-500 text-amber-400 font-semibold'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              <span>Needs Review</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[10px]">
                {lastReport.needsReview.length}
              </span>
            </button>
          )}
          {hasDuplicates && (
            <button
              onClick={() => setActiveTab('duplicates')}
              className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition ${
                activeTab === 'duplicates'
                  ? 'border-amber-500 text-amber-400 font-semibold'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              <span>Duplicates</span>
              <span className="px-1.5 py-0.2 rounded-full bg-orange-500/20 text-orange-300 text-[10px]">
                {lastReport.duplicates.length}
              </span>
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'summary' && (
            <div className="space-y-6">
              {/* Metric Cards Grid (Rule 71) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-stone-800/60 border border-stone-700/60">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>Added Books</span>
                  </div>
                  <div className="text-2xl font-bold text-stone-100">{lastReport.added.length}</div>
                  <div className="text-[11px] text-stone-400">Placed on 3D shelves</div>
                </div>

                <div className="p-4 rounded-xl bg-stone-800/60 border border-stone-700/60">
                  <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span>Relationships</span>
                  </div>
                  <div className="text-2xl font-bold text-stone-100">{lastReport.relationshipsCreated}</div>
                  <div className="text-[11px] text-stone-400">Connections mapped</div>
                </div>

                <div className="p-4 rounded-xl bg-stone-800/60 border border-stone-700/60">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Needs Review</span>
                  </div>
                  <div className="text-2xl font-bold text-stone-100">{lastReport.needsReview.length}</div>
                  <div className="text-[11px] text-stone-400">Low confidence matches</div>
                </div>

                <div className="p-4 rounded-xl bg-stone-800/60 border border-stone-700/60">
                  <div className="flex items-center gap-2 text-orange-400 text-xs font-semibold mb-1">
                    <Copy className="w-4 h-4" />
                    <span>Duplicates</span>
                  </div>
                  <div className="text-2xl font-bold text-stone-100">{lastReport.duplicates.length}</div>
                  <div className="text-[11px] text-stone-400">Detected & handled</div>
                </div>
              </div>

              {/* Dynamic Section Creation Report (Rule 72) */}
              {lastReport.newSectionsCreated.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                    <Compass className="w-4 h-4" />
                    <span>New Library Sections Created Dynamically:</span>
                  </div>
                  <p className="text-xs text-stone-300">
                    No existing section adequately matched these resources, so the AI librarian created new physical sections:
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {lastReport.newSectionsCreated.map((secName, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-200 border border-amber-500/40 text-xs font-semibold"
                      >
                        🏛️ {secName}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Newly Ingested Books Preview */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                  Recently Placed on Shelves
                </h3>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {lastReport.added.map((book) => {
                    const sec = sections.find((s) => s.id === book.category);
                    return (
                      <div
                        key={book.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-stone-800/50 border border-stone-700/50 text-xs hover:bg-stone-800/80 transition"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="w-2.5 h-8 rounded-sm shrink-0"
                            style={{ backgroundColor: book.location?.colorHex || '#3b82f6' }}
                          />
                          <div className="min-w-0">
                            <h4 className="font-semibold text-stone-200 truncate">{book.title}</h4>
                            <p className="text-[11px] text-stone-400 truncate">
                              {book.author} • {sec?.name || book.category} → {book.subCategory}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => locateBook(book.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-[11px] font-medium shrink-0 flex items-center gap-1 transition"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Locate in 3D</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Needs Review Tab (Rule 32) */}
          {activeTab === 'review' && (
            <div className="space-y-4">
              <p className="text-xs text-stone-400">
                These resources were placed with lower confidence. You can confirm the suggested location or change where it should be stored.
              </p>
              <div className="space-y-3">
                {lastReport.needsReview.map((book) => {
                  const sec = sections.find((s) => s.id === book.category);
                  return (
                    <div
                      key={book.id}
                      className="p-4 rounded-xl bg-stone-800/60 border border-amber-500/30 space-y-3 text-xs"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-stone-100 text-sm">{book.title}</h4>
                          <p className="text-stone-400">{book.author}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px]">
                          Confidence: {book.confidence?.categoryConfidence || 65}%
                        </span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-stone-900/60 border border-stone-800 space-y-1">
                        <div className="text-stone-400">
                          Suggested: <span className="text-stone-200 font-semibold">{sec?.name}</span> →{' '}
                          <span className="text-amber-400 font-semibold">{book.subCategory}</span>
                        </div>
                        <div className="text-stone-500 text-[11px]">
                          Reason: {book.confidence?.reason || 'Semantics and keyword density'}
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => acceptReviewBook(book.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition"
                        >
                          Accept Location
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Duplicates Tab (Rule 12) */}
          {activeTab === 'duplicates' && (
            <div className="space-y-4">
              <p className="text-xs text-stone-400">
                The following files match books already present in your library. Choose how each duplicate should be handled:
              </p>
              <div className="space-y-3">
                {lastReport.duplicates.map((dup, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-stone-800/60 border border-orange-500/30 space-y-3 text-xs"
                  >
                    <div>
                      <h4 className="font-bold text-stone-100 text-sm">{dup.file}</h4>
                      <p className="text-stone-400">
                        Matches existing book: <span className="text-amber-400 font-semibold">"{dup.existing.title}"</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => resolveDuplicate(dup.file, 'keep_existing')}
                        className="px-3 py-1.5 rounded-lg bg-stone-700 hover:bg-stone-600 text-stone-200 text-xs font-medium transition"
                      >
                        Keep Existing Only
                      </button>
                      <button
                        onClick={() => resolveDuplicate(dup.file, 'replace')}
                        className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium transition"
                      >
                        Replace with Upload
                      </button>
                      <button
                        onClick={() => resolveDuplicate(dup.file, 'keep_both')}
                        className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-600 text-stone-300 text-xs font-medium transition"
                      >
                        Keep Both Editions
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-stone-800 bg-stone-900/90">
          <span className="text-xs text-stone-400">
            {lastReport.added.length} books organized into {sections.length} physical sections
          </span>
          <button
            onClick={closeModal}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-900/30 transition cursor-pointer"
          >
            <span>Enter & Explore 3D Library</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
