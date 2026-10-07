import React from 'react';
import { useLibraryStore } from '../../store/useLibraryStore';
import {
  BookOpen,
  Star,
  Flame,
  CheckCircle,
  Compass,
  Layers,
  Sparkles,
  ArrowRight,
  Upload,
} from 'lucide-react';

export const WelcomeScreen: React.FC = () => {
  const enterLibrary = useLibraryStore((s) => s.enterLibrary);
  const openModal = useLibraryStore((s) => s.openModal);
  const getLibraryStats = useLibraryStore((s) => s.getLibraryStats);
  const loadSampleDemoCollection = useLibraryStore((s) => s.loadSampleDemoCollection);
  const stats = getLibraryStats();

  const isEmpty = stats.totalResources === 0;

  const handleUploadClick = () => {
    enterLibrary();
    openModal('ingest');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#030712]/92 backdrop-blur-2xl text-slate-100 overflow-hidden">
      {/* Background ambient gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-600/12 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-4xl w-full mx-6 p-8 md:p-12 rounded-3xl cyber-glass-dense border border-cyan-500/30 shadow-2xl shadow-black/90 flex flex-col items-center text-center">
        {/* Emblem */}
        <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-cyan-500/10 border border-cyan-400/40 text-cyan-400 mb-5 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
          <BookOpen className="w-12 h-12" />
        </div>

        {/* Heading */}
        <div className="text-[11px] font-mono tracking-widest text-cyan-400 uppercase mb-1">
          ADVANCED VIRTUAL KNOWLEDGE ENVIRONMENT
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-200 via-sky-100 to-indigo-300 bg-clip-text text-transparent font-heading mb-3">
          3D KNOWLEDGE ARCHIVE
        </h1>
        <p className="text-base md:text-lg text-slate-300 font-light tracking-wide mb-6 max-w-xl">
          {isEmpty
            ? 'Neural repository initialized and standby. Upload your PDF books or a ZIP archive to let the AI librarian analyze and reconstruct your spatial library.'
            : 'Explore, learn, and master your personal collection of books and knowledge nodes in full 3D cyber-spatial fidelity.'}
        </p>

        {/* Dynamic Statistics Bar with Real Live Counts */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 w-full mb-8">
          <div className="p-4 rounded-2xl cyber-glass-card flex flex-col items-center shadow-md">
            <span className="text-2xl md:text-3xl font-bold font-mono text-slate-100">
              {stats.totalResources}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1 mt-1 font-medium">
              <Layers className="w-3.5 h-3.5 text-cyan-400" /> Archives
            </span>
          </div>

          <div className="p-4 rounded-2xl cyber-glass-card flex flex-col items-center shadow-md">
            <span className="text-2xl md:text-3xl font-bold font-mono text-cyan-300">
              {stats.mustLearnCount}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1 mt-1 font-medium">
              <Star className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/20" /> Must Learn
            </span>
          </div>

          <div className="p-4 rounded-2xl cyber-glass-card flex flex-col items-center shadow-md">
            <span className="text-2xl md:text-3xl font-bold font-mono text-violet-400">
              {stats.currentFocusCount}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1 mt-1 font-medium">
              <Flame className="w-3.5 h-3.5 text-violet-400" /> Focus
            </span>
          </div>

          <div className="p-4 rounded-2xl cyber-glass-card flex flex-col items-center shadow-md">
            <span className="text-2xl md:text-3xl font-bold font-mono text-blue-400">
              {stats.readingCount}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1 mt-1 font-medium">
              <Compass className="w-3.5 h-3.5 text-blue-400" /> Reading
            </span>
          </div>

          <div className="p-4 rounded-2xl cyber-glass-card flex flex-col items-center col-span-2 sm:col-span-1 shadow-md">
            <span className="text-2xl md:text-3xl font-bold font-mono text-emerald-400">
              {stats.completedCount}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1 mt-1 font-medium">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Completed
            </span>
          </div>
        </div>

        {/* Controls Summary Badge */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-300 bg-black/40 px-6 py-2.5 rounded-full border border-cyan-900/40 mb-8 backdrop-blur-md">
          <span><kbd className="px-2 py-0.5 rounded bg-slate-900 border border-cyan-500/30 text-cyan-200 font-mono">WASD</kbd> Move</span>
          <span className="text-cyan-800">•</span>
          <span><kbd className="px-2 py-0.5 rounded bg-slate-900 border border-cyan-500/30 text-cyan-200 font-mono">Shift</kbd> Sprint</span>
          <span className="text-cyan-800">•</span>
          <span><kbd className="px-2 py-0.5 rounded bg-slate-900 border border-cyan-500/30 text-cyan-200 font-mono">Mouse</kbd> Look</span>
          <span className="text-cyan-800">•</span>
          <span><kbd className="px-2 py-0.5 rounded bg-slate-900 border border-cyan-500/30 text-cyan-200 font-mono">E / Click</kbd> Inspect Tome</span>
          <span className="text-cyan-800">•</span>
          <span><kbd className="px-2 py-0.5 rounded bg-slate-900 border border-cyan-500/30 text-cyan-200 font-mono">/</kbd> Search</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {isEmpty ? (
            <>
              {/* Primary Upload Button */}
              <button
                onClick={handleUploadClick}
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-extrabold text-base tracking-wider shadow-xl shadow-cyan-950/60 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer border border-cyan-400/40"
              >
                <Upload className="w-5 h-5 text-white transition-transform group-hover:-translate-y-0.5" />
                <span>UPLOAD BOOKS (PDF / ZIP)</span>
                <Sparkles className="w-4 h-4 text-cyan-200" />
              </button>

              {/* Enter Empty Library Space */}
              <button
                onClick={enterLibrary}
                className="cyber-btn px-6 py-4 rounded-2xl text-slate-300 font-bold text-sm tracking-wide"
              >
                <span>Explore 3D Space</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={enterLibrary}
                className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 font-extrabold text-base md:text-lg tracking-wider shadow-xl shadow-cyan-500/30 hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-slate-950 transition-transform group-hover:rotate-12" />
                <span>INITIALIZE ARCHIVE</span>
                <ArrowRight className="w-5 h-5 text-slate-950 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={handleUploadClick}
                className="cyber-btn px-6 py-4 rounded-2xl text-cyan-300 font-bold text-sm tracking-wide flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>Upload More Books</span>
              </button>
            </>
          )}
        </div>

        {/* Optional Starter Demo Link */}
        {isEmpty && (
          <div className="mt-6 pt-4 border-t border-cyan-900/40 text-xs text-slate-500">
            <span>Just testing things out? </span>
            <button
              onClick={loadSampleDemoCollection}
              className="text-cyan-400/80 hover:text-cyan-300 underline font-medium cursor-pointer"
            >
              Load starter sample collection (45 books)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
