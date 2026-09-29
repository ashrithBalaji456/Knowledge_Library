import React from 'react';
import { useLibraryStore } from '../../store/useLibraryStore';
import { BookOpen, Star, Flame, CheckCircle, Compass, Layers, Sparkles, ArrowRight } from 'lucide-react';

export const WelcomeScreen: React.FC = () => {
  const enterLibrary = useLibraryStore((s) => s.enterLibrary);
  const getLibraryStats = useLibraryStore((s) => s.getLibraryStats);
  const stats = getLibraryStats();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-xl text-slate-100 overflow-hidden">
      {/* Background ambient gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-amber-600/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-4xl w-full mx-6 p-8 md:p-12 rounded-3xl bg-slate-900/85 border border-slate-800 shadow-2xl shadow-black/90 flex flex-col items-center text-center">
        {/* Emblem */}
        <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 via-blue-500/20 to-purple-500/20 border border-amber-500/30 text-amber-400 mb-5 shadow-lg">
          <BookOpen className="w-12 h-12" />
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-amber-200 via-white to-blue-200 bg-clip-text text-transparent font-['Outfit'] mb-2">
          MY KNOWLEDGE LIBRARY
        </h1>
        <p className="text-lg md:text-xl text-slate-300 font-light tracking-wide mb-8">
          Explore. Learn. Connect. Grow.
        </p>

        {/* Dynamic Statistics Bar with Colorful Accents */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 w-full mb-10">
          <div className="p-4 rounded-2xl bg-slate-850/80 border border-slate-800 flex flex-col items-center shadow-md">
            <span className="text-2xl md:text-3xl font-bold text-slate-100 font-['Outfit']">
              {stats.totalResources}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1 mt-1 font-medium">
              <Layers className="w-3.5 h-3.5 text-blue-400" /> Resources
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-850/80 border border-slate-800 flex flex-col items-center shadow-md">
            <span className="text-2xl md:text-3xl font-bold text-amber-400 font-['Outfit']">
              {stats.mustLearnCount}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1 mt-1 font-medium">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" /> Must Learn
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-850/80 border border-slate-800 flex flex-col items-center shadow-md">
            <span className="text-2xl md:text-3xl font-bold text-red-400 font-['Outfit']">
              {stats.currentFocusCount}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1 mt-1 font-medium">
              <Flame className="w-3.5 h-3.5 text-red-400" /> Focus
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-850/80 border border-slate-800 flex flex-col items-center shadow-md">
            <span className="text-2xl md:text-3xl font-bold text-blue-400 font-['Outfit']">
              {stats.inProgressCount}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1 mt-1 font-medium">
              <Compass className="w-3.5 h-3.5 text-blue-400" /> In Progress
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-850/80 border border-slate-800 flex flex-col items-center col-span-2 sm:col-span-1 shadow-md">
            <span className="text-2xl md:text-3xl font-bold text-emerald-400 font-['Outfit']">
              {stats.completedCount}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1 mt-1 font-medium">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Completed
            </span>
          </div>
        </div>

        {/* Controls Summary Badge */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 bg-slate-950/70 px-6 py-3 rounded-full border border-slate-800 mb-8">
          <span><kbd className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-mono">WASD</kbd> Move</span>
          <span>•</span>
          <span><kbd className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-mono">Shift</kbd> Sprint</span>
          <span>•</span>
          <span><kbd className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-mono">Mouse</kbd> Look</span>
          <span>•</span>
          <span><kbd className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-mono">E / Click</kbd> Inspect</span>
          <span>•</span>
          <span><kbd className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-mono">/</kbd> Search</span>
        </div>

        {/* Animated Enter Library Button */}
        <button
          onClick={enterLibrary}
          className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-base md:text-lg tracking-wider shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
        >
          <Sparkles className="w-5 h-5 text-slate-950 transition-transform group-hover:rotate-12" />
          <span>ENTER LIBRARY</span>
          <ArrowRight className="w-5 h-5 text-slate-950 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
