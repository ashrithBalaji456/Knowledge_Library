import React from 'react';
import { useLibraryStore } from '../../store/useLibraryStore';
import {
  Search,
  Network,
  Milestone,
  PlusCircle,
  MapPin,
  Volume2,
  VolumeX,
  Settings,
  BookOpen,
  Sun,
  Sunset,
  Moon,
  Layers,
  Activity
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
      {/* Brand & Section Browser Trigger */}
      <div className="pointer-events-auto flex items-center gap-2.5">
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-stone-900/90 backdrop-blur-xl border border-amber-600/30 shadow-xl text-amber-100">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <span className="font-extrabold text-sm tracking-wide font-['Outfit'] hidden sm:inline">
            3D KNOWLEDGE LIBRARY
          </span>
        </div>

        {/* Section Browser Drawer */}
        <button
          onClick={() => openModal('sectionBrowser')}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-stone-900/90 backdrop-blur-xl border border-blue-500/30 hover:border-blue-400 hover:bg-stone-850 hover:shadow-blue-500/20 text-slate-100 text-xs font-semibold shadow-xl transition-all cursor-pointer group"
          title="Browse All Library Sections (B)"
        >
          <Layers className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
          <span className="hidden md:inline">Browse Sections</span>
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
          <span className="hidden md:inline">Search Library</span>
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
          <span className="capitalize hidden sm:inline">{atmosphere}</span>
        </button>

        {/* Knowledge Graph button with Purple accent */}
        <button
          onClick={() => openModal('graph')}
          title="Interactive Knowledge Graph (G)"
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-2xl bg-stone-900/90 backdrop-blur-xl border border-purple-500/40 hover:border-purple-400 hover:bg-stone-850 hover:shadow-purple-500/20 text-slate-100 text-xs font-semibold shadow-xl transition-all cursor-pointer group"
        >
          <Network className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
          <span className="hidden lg:inline">Graph</span>
        </button>

        {/* Learning Paths button with Emerald Green accent */}
        <button
          onClick={() => openModal('paths')}
          title="Curated Learning Paths (P)"
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-2xl bg-stone-900/90 backdrop-blur-xl border border-emerald-500/40 hover:border-emerald-400 hover:bg-stone-850 hover:shadow-emerald-500/20 text-slate-100 text-xs font-semibold shadow-xl transition-all cursor-pointer group"
        >
          <Milestone className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span className="hidden lg:inline">Paths</span>
        </button>

        {/* Manage / Add Resource with Rich Gold accent */}
        <button
          onClick={() => openModal('manage')}
          title="Manage & Add Resources"
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-amber-500/25 hover:bg-amber-500/35 border border-amber-500/50 text-amber-300 text-xs font-bold shadow-xl transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden md:inline">Manage</span>
        </button>

        {/* Audio Toggle */}
        <button
          onClick={toggleSound}
          title={preferences.soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          className="p-2.5 rounded-2xl bg-stone-900/90 backdrop-blur-xl border border-stone-700/60 hover:bg-stone-800 text-slate-300 shadow-xl transition-all cursor-pointer"
        >
          {preferences.soundEnabled ? (
            <Volume2 className="w-4 h-4 text-amber-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-stone-500" />
          )}
        </button>

        {/* Minimap Toggle with Teal accent */}
        <button
          onClick={toggleMinimap}
          title="Toggle Minimap (M)"
          className={`p-2.5 rounded-2xl backdrop-blur-xl border shadow-xl transition-all cursor-pointer ${
            preferences.showMinimap
              ? 'bg-cyan-600/30 border-cyan-400 text-cyan-300'
              : 'bg-stone-900/90 border-stone-700/60 text-stone-400 hover:bg-stone-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
        </button>

        {/* Settings button */}
        <button
          onClick={() => openModal('settings')}
          title="Settings & Diagnostics"
          className="p-2.5 rounded-2xl bg-stone-900/90 backdrop-blur-xl border border-stone-700/60 hover:bg-stone-800 text-slate-300 shadow-xl transition-all cursor-pointer"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
