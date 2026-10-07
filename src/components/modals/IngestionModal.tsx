import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  Archive,
  CheckCircle2,
  Sparkles,
  X,
  FileCheck,
  Compass,
} from 'lucide-react';
import { useLibraryStore } from '../../store/useLibraryStore';

export const IngestionModal: React.FC = () => {
  const activeModal = useLibraryStore((s) => s.activeModal);
  const closeModal = useLibraryStore((s) => s.closeModal);
  const startIngestion = useLibraryStore((s) => s.startIngestion);
  const isIngesting = useLibraryStore((s) => s.isIngesting);
  const importProgress = useLibraryStore((s) => s.importProgress);

  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (activeModal !== 'ingest') return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter(
        (f) =>
          f.name.toLowerCase().endsWith('.pdf') ||
          f.name.toLowerCase().endsWith('.zip')
      );
      setSelectedFiles((prev) => [...prev, ...files]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleStartIngest = async () => {
    if (selectedFiles.length === 0) return;
    await startIngestion(selectedFiles);
    setSelectedFiles([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030712]/80 backdrop-blur-xl">
      <div className="relative w-full max-w-2xl overflow-hidden cyber-glass-dense rounded-2xl border border-cyan-500/30 shadow-2xl text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cyan-900/40 bg-[#040814]/70">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-400/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">
                AUTOMATED INGESTION PIPELINE
              </div>
              <h2 className="text-xl font-bold font-heading text-slate-100 flex items-center gap-2">
                Ingest Neural Knowledge Assets
                <span className="text-xs font-mono py-0.5 px-2 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  AI Auto
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-light">
                Upload individual PDFs or a ZIP archive. The neural classifier indexes and allocates each book into the 3D space.
              </p>
            </div>
          </div>
          {!isIngesting && (
            <button
              onClick={closeModal}
              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/40 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Active Ingestion Progress State */}
          {isIngesting ? (
            <div className="py-8 px-6 rounded-xl bg-stone-800/60 border border-amber-500/30 text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 animate-pulse">
                <Sparkles className="w-8 h-8 animate-spin" style={{ animationDuration: '6s' }} />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-stone-100">
                  {importProgress?.stage === 'extracting' && '📦 Extracting Archive Files...'}
                  {importProgress?.stage === 'parsing' && '📄 Reading Document Structure & Text...'}
                  {importProgress?.stage === 'classifying' && '🧠 Classifying & Determining Right Section...'}
                  {importProgress?.stage === 'connecting' && '🔗 Discovering Prerequisite & Related Links...'}
                  {importProgress?.stage === 'complete' && '✨ Finalizing 3D Library Placement...'}
                  {!importProgress && 'Initializing intelligent librarian...'}
                </h3>
                <p className="text-sm text-stone-400 font-mono truncate max-w-md mx-auto">
                  {importProgress?.currentFileName || 'Processing uploads...'}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="w-full bg-stone-700/60 rounded-full h-3 overflow-hidden border border-stone-600/40">
                  <div
                    className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 h-3 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${importProgress?.percent || 15}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-stone-400">
                  <span>Processed: {importProgress?.processedCount || 0} / {importProgress?.totalCount || selectedFiles.length}</span>
                  <span className="font-semibold text-amber-400">{importProgress?.percent || 15}%</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-stone-900/60 border border-stone-800 text-xs text-stone-400 flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Extracting takeaways, checking duplicate hashes & updating 3D physical layout...</span>
              </div>
            </div>
          ) : (
            <>
              {/* Drag and Drop Area */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
                    : 'border-stone-700 hover:border-amber-500/60 bg-stone-800/40 hover:bg-stone-800/60'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.zip"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-base font-medium text-stone-200">
                      Drag & Drop <span className="text-amber-400 font-semibold">PDFs</span> or a <span className="text-amber-400 font-semibold">ZIP file</span> here
                    </p>
                    <p className="text-xs text-stone-400 mt-1">
                      Supports technical books, handbooks, study notes, novels, devotional texts, and interview guides.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="mt-2 px-4 py-2 text-xs font-semibold rounded-lg bg-stone-700 hover:bg-stone-600 text-stone-200 transition"
                  >
                    Browse Files from Computer
                  </button>
                </div>
              </div>

              {/* Selected Files List */}
              {selectedFiles.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-medium text-stone-300">
                    <span>Selected Files ({selectedFiles.length})</span>
                    <button
                      onClick={() => setSelectedFiles([])}
                      className="text-stone-400 hover:text-red-400 transition"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {selectedFiles.map((file, idx) => (
                      <div
                        key={`${file.name}-${idx}`}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-stone-800/70 border border-stone-700/60 text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {file.name.toLowerCase().endsWith('.zip') ? (
                            <Archive className="w-4 h-4 text-amber-400 shrink-0" />
                          ) : (
                            <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                          )}
                          <span className="text-stone-200 truncate font-medium">{file.name}</span>
                          <span className="text-stone-400 text-[10px]">
                            ({(file.size / (1024 * 1024)).toFixed(1)} MB)
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(idx);
                          }}
                          className="p-1 text-stone-400 hover:text-red-400 transition"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Intelligent Librarian Rules Explainer */}
              <div className="p-4 rounded-xl bg-stone-800/40 border border-stone-800 space-y-2 text-xs text-stone-400">
                <div className="flex items-center gap-2 text-stone-200 font-semibold">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>How Intelligent Ingestion Works:</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex items-start gap-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span><b>Auto-Classifies</b> topic, difficulty, audience & subcategory</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                    <span><b>Handbooks Wing</b> isolates quick references & cheat sheets</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span><b>Generates Purpose & Takeaways</b> for the book info card</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                    <span><b>Duplicate Detection</b> alerts if already in collection</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        {!isIngesting && (
          <div className="flex items-center justify-between p-6 border-t border-cyan-900/40 bg-[#040814]/80">
            <span className="text-xs text-slate-400 font-mono">
              {selectedFiles.length === 0
                ? 'Select or drop files to proceed'
                : `${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''} queued`}
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={closeModal}
                className="cyber-btn px-4 py-2 text-xs font-medium rounded-xl text-slate-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleStartIngest}
                disabled={selectedFiles.length === 0}
                className={`px-5 py-2.5 text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-lg ${
                  selectedFiles.length > 0
                    ? 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-cyan-950/60 cursor-pointer border border-cyan-400/40'
                    : 'bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Process & Deploy in 3D Space</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
