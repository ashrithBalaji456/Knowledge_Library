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
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl cyber-glass-glow text-cyan-200">
          <BookOpen className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
          <span className="font-extrabold text-sm tracking-wider font-heading hidden sm:inline bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300 bg-clip-text text-transparent">
            KNOWLEDGE ARCHIVE 3D
          </span>
        </div>

        {/* Section Browser Drawer */}
        <button
          onClick={() => openModal('sectionBrowser')}
          className="cyber-btn flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-semibold"
          title="Browse All Library Sections"
        >
          <Layers className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span className="hidden md:inline">Sections</span>
        </button>

        {/* Ingest / Upload PDFs & ZIPs Button (Rule 1 & 30) */}
        <button
          onClick={() => openModal('ingest')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold shadow-xl shadow-cyan-950/50 transition-all cursor-pointer group border border-cyan-400/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
          title="Ingest PDF Books or ZIP Archive"
        >
          <Upload className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform text-cyan-200" />
          <span>Upload PDF / ZIP</span>
          <span className="hidden lg:inline text-[10px] py-0.5 px-1.5 rounded bg-black/30 text-cyan-200 font-mono border border-cyan-400/30">
            AI Ingest
          </span>
        </button>

        {/* Personal Dashboard Button (Rule 78 & 79) */}
        <button
          onClick={() => openModal('dashboard')}
          className="cyber-btn flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-semibold"
          title="Personal Dashboard & Section Curator"
        >
          <BarChart3 className="w-4 h-4 text-violet-400 group-hover:scale-110 transition-transform" />
          <span className="hidden md:inline">Dashboard</span>
        </button>

        {/* Real-time FPS Telemetry pill if enabled */}
        {preferences.showFpsMonitor && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#040814]/85 border border-cyan-900/50 text-[11px] font-mono text-cyan-400 backdrop-blur-md">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>{fpsMetrics.fps} FPS</span>
            <span className="text-cyan-800">•</span>
            <span className="text-slate-400">{fpsMetrics.drawCalls} calls</span>
          </div>
        )}
      </div>

      {/* Global Action Toolbar with Cyber Accents */}
      <div className="pointer-events-auto flex items-center gap-2">
        {/* Search button with Cyan accent */}
        <button
          onClick={() => openModal('search')}
          className="cyber-btn flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold"
        >
          <Search className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span className="hidden md:inline">Search</span>
          <kbd className="hidden lg:inline px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-800/80 border border-cyan-500/30 text-cyan-300">
            /
          </kbd>
        </button>

        {/* Atmosphere Cycle: Day / Evening / Night */}
        <button
          onClick={cycleAtmosphere}
          title={`Atmosphere Lighting: ${atmosphere.toUpperCase()} (Click to toggle)`}
          className="cyber-btn flex items-center gap-1.5 px-3 py-2.5 rounded-2xl text-xs font-semibold"
        >
          {atmosphere === 'day' && <Sun className="w-4 h-4 text-cyan-300" />}
          {atmosphere === 'evening' && <Sunset className="w-4 h-4 text-violet-400" />}
          {atmosphere === 'night' && <Moon className="w-4 h-4 text-indigo-400" />}
          <span className="capitalize text-slate-200 hidden sm:inline">{atmosphere}</span>
        </button>

        {/* Knowledge Graph with Purple/Violet accent */}
        <button
          onClick={() => openModal('graph')}
          title="Interactive Knowledge Graph (G)"
          className="cyber-btn p-2.5 rounded-2xl text-violet-300"
        >
          <Network className="w-4 h-4" />
        </button>

        {/* Learning Paths with Blue/Cyan accent */}
        <button
          onClick={() => openModal('paths')}
          title="Learning Curriculums & Paths (P)"
          className="cyber-btn p-2.5 rounded-2xl text-sky-300"
        >
          <Milestone className="w-4 h-4" />
        </button>

        {/* Toggle Minimap */}
        <button
          onClick={toggleMinimap}
          title={preferences.showMinimap ? 'Hide Architectural Radar (M)' : 'Show Architectural Radar (M)'}
          className={`p-2.5 rounded-2xl transition-all cursor-pointer ${
            preferences.showMinimap
              ? 'cyber-btn-active text-cyan-300'
              : 'cyber-btn text-slate-400'
          }`}
        >
          <MapPin className="w-4 h-4" />
        </button>

        {/* Sound toggle */}
        <button
          onClick={toggleSound}
          title={preferences.soundEnabled ? 'Mute Library Audio' : 'Enable Library Audio'}
          className="cyber-btn p-2.5 rounded-2xl text-slate-300"
        >
          {preferences.soundEnabled ? (
            <Volume2 className="w-4 h-4 text-cyan-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {/* Settings button */}
        <button
          onClick={() => openModal('settings')}
          title="Library Engine Preferences"
          className="cyber-btn p-2.5 rounded-2xl text-slate-300"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
