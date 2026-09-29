import React from 'react';
import { useLibraryStore } from '../../store/useLibraryStore';
import {
  Search,
  Network,
  Milestone,
  Upload,
  BarChart3,
  MapPin,
  Volume2,
  VolumeX,
  Settings,
  BookOpen,
  Sun,
  Sunset,
  Moon,
  Layers,
  Activity,
  Sparkles,
} from 'lucide-react';
import { AtmosphereMode } from '../../types/library';

export const TopNav: React.FC = () => {
  const openModal = useLibraryStore((s) => s.openModal);
  const preferences = useLibraryStore((s) => s.preferences);
  const updatePreferences = useLibraryStore((s) => s.updatePreferences);
  const atmosphere = useLibraryStore((s) => s.atmosphere);
  const setAtmosphere = useLibraryStore((s) => s.setAtmosphere);
  const fpsMetrics = useLibraryStore((s) => s.fpsMetrics);

  const toggleSound = () => {
    updatePreferences({ soundEnabled: !preferences.soundEnabled });
  };

  const toggleMinimap = () => {
    updatePreferences({ showMinimap: !preferences.showMinimap });
  };

  const cycleAtmosphere = () => {
    const next: Record<AtmosphereMode, AtmosphereMode> = {
      day: 'evening',
      evening: 'night',
      night: 'day',
    };
    setAtmosphere(next[atmosphere]);
  };

  return (
    <header className="fixed top-4 left-4 right-4 z-40 pointer-events-none flex items-center justify-between">
      {/* Brand & Ingestion Trigger */}
      <div className="pointer-events-auto flex items-center gap-2.5">
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-stone-900/90 backdrop-blur-xl border border-amber-600/30 shadow-xl text-amber-100">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <span className="font-extrabold text-sm tracking-wide font-heading hidden sm:inline">
            3D KNOWLEDGE LIBRARY
          </span>
        </div>

        {/* Section Browser Drawer */}
        <button
          onClick={() => openModal('sectionBrowser')}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-stone-900/90 backdrop-blur-xl border border-blue-500/30 hover:border-blue-400 hover:bg-stone-850 hover:shadow-blue-500/20 text-slate-100 text-xs font-semibold shadow-xl transition-all cursor-pointer group"
          title="Browse All Library Sections"
        >
          <Layers className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
          <span className="hidden md:inline">Sections</span>
        </button>

        {/* Ingest / Upload PDFs & ZIPs Button (Rule 1 & 30) */}
        <button
          onClick={() => openModal('ingest')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold shadow-xl shadow-amber-950/40 transition-all cursor-pointer group border border-amber-400/30"
          title="Ingest PDF Books or ZIP Archive"
        >
          <Upload className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
          <span>Upload PDF / ZIP</span>
          <span className="hidden lg:inline text-[10px] py-0.5 px-1.5 rounded bg-black/20 text-amber-100 font-mono">
            AI Auto
          </span>
        </button>

        {/* Personal Dashboard Button (Rule 78 & 79) */}
        <button
          onClick={() => openModal('dashboard')}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-stone-900/90 backdrop-blur-xl border border-amber-500/30 hover:border-amber-400 hover:bg-stone-850 text-amber-100 text-xs font-semibold shadow-xl transition-all cursor-pointer group"
          title="Personal Dashboard & Section Curator"
        >
          <BarChart3 className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          <span className="hidden md:inline">Dashboard</span>
        </button>

        {/* Real-time FPS Telemetry pill if enabled */}
        {preferences.showFpsMonitor && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-950/80 border border-stone-800 text-[11px] font-mono text-emerald-400">
            <Activity className="w-3.5 h-3.5" />
            <span>{fpsMetrics.fps} FPS</span>
            <span className="text-stone-500">•</span>
            <span className="text-stone-400">{fpsMetrics.drawCalls} calls</span>
          </div>
        )}
      </div>

      {/* Global Action Toolbar with Distinct Colorful Accents */}
      <div className="pointer-events-auto flex items-center gap-2">
        {/* Search button with Warm Amber/Gold accent */}
        <button
          onClick={() => openModal('search')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-stone-900/90 backdrop-blur-xl border border-amber-500/40 hover:border-amber-400 hover:bg-stone-850 hover:shadow-amber-500/20 text-amber-100 text-xs font-semibold shadow-xl transition-all cursor-pointer group"
        >
          <Search className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          <span className="hidden md:inline">Search</span>
          <kbd className="hidden lg:inline px-1.5 py-0.5 text-[10px] font-mono rounded bg-stone-800 border border-stone-700 text-amber-300">
            /
          </kbd>
        </button>

        {/* Atmosphere Cycle: Day / Evening / Night */}
        <button
          onClick={cycleAtmosphere}
          title={`Lighting: ${atmosphere.toUpperCase()} (Click to toggle)`}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-2xl bg-stone-900/90 backdrop-blur-xl border border-orange-500/30 hover:border-orange-400 hover:bg-stone-850 text-slate-100 text-xs font-semibold shadow-xl transition-all cursor-pointer"
        >
          {atmosphere === 'day' && <Sun className="w-4 h-4 text-amber-400" />}
          {atmosphere === 'evening' && <Sunset className="w-4 h-4 text-orange-400" />}
          {atmosphere === 'night' && <Moon className="w-4 h-4 text-indigo-400" />}
          <span className="capitalize text-stone-200 hidden sm:inline">{atmosphere}</span>
        </button>

        {/* Knowledge Graph with Purple accent */}
        <button
          onClick={() => openModal('graph')}
          title="Interactive Knowledge Graph (G)"
          className="p-2.5 rounded-2xl bg-stone-900/90 backdrop-blur-xl border border-purple-500/30 hover:border-purple-400 hover:bg-stone-850 text-purple-300 shadow-xl transition-all cursor-pointer hover:scale-105"
        >
          <Network className="w-4 h-4" />
        </button>

        {/* Learning Paths with Emerald accent */}
        <button
          onClick={() => openModal('paths')}
          title="Learning Curriculums & Paths (P)"
          className="p-2.5 rounded-2xl bg-stone-900/90 backdrop-blur-xl border border-emerald-500/30 hover:border-emerald-400 hover:bg-stone-850 text-emerald-300 shadow-xl transition-all cursor-pointer hover:scale-105"
        >
          <Milestone className="w-4 h-4" />
        </button>

        {/* Toggle Minimap */}
        <button
          onClick={toggleMinimap}
          title={preferences.showMinimap ? 'Hide Architectural Map (M)' : 'Show Architectural Map (M)'}
          className={`p-2.5 rounded-2xl bg-stone-900/90 backdrop-blur-xl border shadow-xl transition-all cursor-pointer hover:scale-105 ${
            preferences.showMinimap
              ? 'border-amber-500/50 text-amber-400 bg-amber-500/10'
              : 'border-stone-700 text-stone-400 hover:text-stone-200'
          }`}
        >
          <MapPin className="w-4 h-4" />
        </button>

        {/* Sound toggle */}
        <button
          onClick={toggleSound}
          title={preferences.soundEnabled ? 'Mute Library Audio' : 'Enable Library Audio'}
          className="p-2.5 rounded-2xl bg-stone-900/90 backdrop-blur-xl border border-stone-700 hover:border-stone-500 hover:bg-stone-850 text-stone-300 shadow-xl transition-all cursor-pointer hover:scale-105"
        >
          {preferences.soundEnabled ? (
            <Volume2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-stone-500" />
          )}
        </button>

        {/* Settings button */}
        <button
          onClick={() => openModal('settings')}
          title="Library Engine Preferences"
          className="p-2.5 rounded-2xl bg-stone-900/90 backdrop-blur-xl border border-stone-700 hover:border-stone-500 hover:bg-stone-850 text-stone-300 shadow-xl transition-all cursor-pointer hover:scale-105"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
