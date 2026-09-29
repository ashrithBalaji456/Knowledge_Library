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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/90 backdrop-blur-xl text-stone-100 overflow-hidden">
      {/* Background ambient gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-amber-600/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-4xl w-full mx-6 p-8 md:p-12 rounded-3xl bg-stone-900/90 border border-stone-700/60 shadow-2xl shadow-black/90 flex flex-col items-center text-center">
        {/* Emblem */}
        <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-amber-500/20 border border-amber-500/40 text-amber-400 mb-5 shadow-lg">
          <BookOpen className="w-12 h-12" />
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-amber-200 via-stone-100 to-amber-300 bg-clip-text text-transparent font-heading mb-2">
          MY KNOWLEDGE LIBRARY
        </h1>
        <p className="text-base md:text-lg text-stone-300 font-light tracking-wide mb-6 max-w-xl">
          {isEmpty
            ? 'Your personal library is empty and ready. Upload your PDF books or a ZIP archive to let the AI librarian organize and build your 3D world.'
            : 'Explore, learn, and master your personal collection of books and resources in 3D.'}
        </p>

        {/* Dynamic Statistics Bar with Real Live Counts */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 w-full mb-8">
          <div className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700/60 flex flex-col items-center shadow-md">
            <span className="text-2xl md:text-3xl font-bold font-mono text-stone-100">
              {stats.totalResources}
            </span>
            <span className="text-xs text-stone-400 flex items-center gap-1 mt-1 font-medium">
              <Layers className="w-3.5 h-3.5 text-blue-400" /> Resources
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700/60 flex flex-col items-center shadow-md">
            <span className="text-2xl md:text-3xl font-bold font-mono text-amber-400">
              {stats.mustLearnCount}
            </span>
            <span className="text-xs text-stone-400 flex items-center gap-1 mt-1 font-medium">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" /> Must Learn
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700/60 flex flex-col items-center shadow-md">
            <span className="text-2xl md:text-3xl font-bold font-mono text-red-400">
              {stats.currentFocusCount}
            </span>
            <span className="text-xs text-stone-400 flex items-center gap-1 mt-1 font-medium">
              <Flame className="w-3.5 h-3.5 text-red-400" /> Focus
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700/60 flex flex-col items-center shadow-md">
            <span className="text-2xl md:text-3xl font-bold font-mono text-blue-400">
              {stats.readingCount}
            </span>
            <span className="text-xs text-stone-400 flex items-center gap-1 mt-1 font-medium">
              <Compass className="w-3.5 h-3.5 text-blue-400" /> Reading
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700/60 flex flex-col items-center col-span-2 sm:col-span-1 shadow-md">
            <span className="text-2xl md:text-3xl font-bold font-mono text-emerald-400">
              {stats.completedCount}
            </span>
            <span className="text-xs text-stone-400 flex items-center gap-1 mt-1 font-medium">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Completed
            </span>
          </div>
        </div>

        {/* Controls Summary Badge */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-stone-400 bg-stone-950/70 px-6 py-2.5 rounded-full border border-stone-800 mb-8">
          <span><kbd className="px-2 py-0.5 rounded bg-stone-800 text-stone-200 font-mono">WASD</kbd> Move</span>
          <span>•</span>
          <span><kbd className="px-2 py-0.5 rounded bg-stone-800 text-stone-200 font-mono">Shift</kbd> Sprint</span>
          <span>•</span>
          <span><kbd className="px-2 py-0.5 rounded bg-stone-800 text-stone-200 font-mono">Mouse</kbd> Look</span>
          <span>•</span>
          <span><kbd className="px-2 py-0.5 rounded bg-stone-800 text-stone-200 font-mono">E / Click</kbd> Inspect Book</span>
          <span>•</span>
          <span><kbd className="px-2 py-0.5 rounded bg-stone-800 text-stone-200 font-mono">/</kbd> Search</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {isEmpty ? (
            <>
              {/* Primary Upload Button */}
              <button
                onClick={handleUploadClick}
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 hover:from-amber-500 hover:to-orange-500 text-white font-extrabold text-base tracking-wider shadow-xl shadow-amber-900/40 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer border border-amber-400/40"
              >
                <Upload className="w-5 h-5 text-white transition-transform group-hover:-translate-y-0.5" />
                <span>UPLOAD YOUR BOOKS (PDF / ZIP)</span>
                <Sparkles className="w-4 h-4 text-amber-200" />
              </button>

              {/* Enter Empty Library Space */}
              <button
                onClick={enterLibrary}
                className="px-6 py-4 rounded-2xl bg-stone-800/90 hover:bg-stone-750 text-stone-300 font-bold text-sm tracking-wide border border-stone-700 transition cursor-pointer"
              >
                <span>Explore Empty 3D Space</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={enterLibrary}
                className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-extrabold text-base md:text-lg tracking-wider shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-stone-950 transition-transform group-hover:rotate-12" />
                <span>ENTER LIBRARY</span>
                <ArrowRight className="w-5 h-5 text-stone-950 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={handleUploadClick}
                className="px-6 py-4 rounded-2xl bg-stone-800/90 hover:bg-stone-750 text-amber-400 font-bold text-sm tracking-wide border border-amber-500/30 transition cursor-pointer flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>Upload More Books</span>
              </button>
            </>
          )}
        </div>

        {/* Optional Starter Demo Link */}
        {isEmpty && (
          <div className="mt-6 pt-4 border-t border-stone-800/80 text-xs text-stone-500">
            <span>Just testing things out? </span>
            <button
              onClick={loadSampleDemoCollection}
              className="text-amber-400/80 hover:text-amber-300 underline font-medium cursor-pointer"
            >
              Load starter sample collection (45 books)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
