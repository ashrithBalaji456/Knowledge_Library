import React from 'react';
import { useLibraryStore } from '../../store/useLibraryStore';
import {
  X,
  Settings,
  Volume2,
  Eye,
  MousePointer,
  Sun,
  Sunset,
  Moon,
  Activity,
  Zap
} from 'lucide-react';
import { AtmosphereMode } from '../../types/library';

export const SettingsModal: React.FC = () => {
  const preferences = useLibraryStore((s) => s.preferences);
  const updatePreferences = useLibraryStore((s) => s.updatePreferences);
  const atmosphere = useLibraryStore((s) => s.atmosphere);
  const setAtmosphere = useLibraryStore((s) => s.setAtmosphere);
  const closeModal = useLibraryStore((s) => s.closeModal);
  const fpsMetrics = useLibraryStore((s) => s.fpsMetrics);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030712]/80 backdrop-blur-xl pointer-events-auto">
      <div className="relative w-full max-w-lg rounded-3xl cyber-glass-dense border border-cyan-500/30 shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-cyan-900/40 flex items-center justify-between bg-[#040814]/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">
                ENGINE PREFERENCES // TELEMETRY
              </div>
              <h2 className="text-base font-bold text-slate-100 font-['Outfit']">
                SYSTEM CONFIGURATION & TUNING
              </h2>
              <p className="text-xs text-slate-400 font-light">Atmosphere, graphics rendering, and telemetry</p>
            </div>
          </div>

          <button
            onClick={closeModal}
            className="p-1.5 rounded-full hover:bg-cyan-950/40 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Atmosphere Mode */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2 font-mono">
              <Sun className="w-4 h-4 text-cyan-400" /> Lighting & Atmosphere
            </h3>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'day', label: 'Day', icon: Sun, color: 'text-cyan-300' },
                { id: 'evening', label: 'Evening', icon: Sunset, color: 'text-violet-400' },
                { id: 'night', label: 'Night', icon: Moon, color: 'text-indigo-400' },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = atmosphere === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setAtmosphere(item.id as AtmosphereMode)}
                    className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                        : 'bg-[#040814]/60 border-slate-800 text-slate-400 hover:border-cyan-500/30'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${item.color}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Performance & Quality */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2 font-mono">
              <Zap className="w-4 h-4" /> Rendering Engine & Telemetry
            </h3>

            <div className="flex items-center justify-between p-3.5 rounded-2xl cyber-glass-card">
              <div>
                <span className="text-xs text-slate-200 font-medium block">
                  Show Real-Time FPS & Telemetry
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {fpsMetrics.fps} FPS • {fpsMetrics.drawCalls} draw calls • {fpsMetrics.triangles.toLocaleString()} triangles
                </span>
              </div>
              <input
                type="checkbox"
                checked={preferences.showFpsMonitor}
                onChange={(e) => updatePreferences({ showFpsMonitor: e.target.checked })}
                className="w-4 h-4 accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl cyber-glass-card border-emerald-500/30">
              <div>
                <span className="text-xs text-emerald-300 font-bold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  120 FPS High-Refresh Engine Mode
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Eliminates camera drag & stutter during sudden turns & sprints
                </span>
              </div>
              <input
                type="checkbox"
                checked={preferences.targetFps120}
                onChange={(e) => updatePreferences({ targetFps120: e.target.checked })}
                className="w-4 h-4 accent-emerald-400 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl cyber-glass-card text-xs">
              <span className="text-slate-300 font-mono">Graphics Quality Profile</span>
              <div className="flex items-center gap-1">
                {(['low', 'medium', 'high'] as const).map((q) => (
                  <button
                    key={q}
                    onClick={() => updatePreferences({ graphicsQuality: q })}
                    className={`px-3 py-1 rounded-xl font-bold uppercase text-[10px] cursor-pointer transition-all ${
                      preferences.graphicsQuality === q
                        ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.6)] font-mono'
                        : 'bg-slate-900 text-slate-400 hover:text-cyan-300 border border-slate-800'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Audio Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2 font-mono">
              <Volume2 className="w-4 h-4" /> Audio & Acoustics
            </h3>

            <div className="flex items-center justify-between p-3.5 rounded-2xl cyber-glass-card">
              <span className="text-xs text-slate-200">Library Sound Effects</span>
              <input
                type="checkbox"
                checked={preferences.soundEnabled}
                onChange={(e) => updatePreferences({ soundEnabled: e.target.checked })}
                className="w-4 h-4 accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl cyber-glass-card">
              <span className="text-xs text-slate-200">Footstep Acoustics</span>
              <input
                type="checkbox"
                checked={preferences.footstepsEnabled}
                onChange={(e) => updatePreferences({ footstepsEnabled: e.target.checked })}
                className="w-4 h-4 accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Controls Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2 font-mono">
              <MousePointer className="w-4 h-4" /> Movement & Camera Damping
            </h3>

            <div className="space-y-1.5 p-3.5 rounded-2xl cyber-glass-card">
              <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
                <span>Walking Speed</span>
                <span className="text-cyan-400">{preferences.moveSpeed}</span>
              </div>
              <input
                type="range"
                min="4"
                max="12"
                step="0.5"
                value={preferences.moveSpeed}
                onChange={(e) => updatePreferences({ moveSpeed: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            <div className="space-y-1.5 p-3.5 rounded-2xl cyber-glass-card">
              <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
                <span>Mouse Look Sensitivity</span>
                <span className="text-cyan-400">
                  {preferences.lookSensitivity.toFixed(1)}x
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.1"
                value={preferences.lookSensitivity}
                onChange={(e) => updatePreferences({ lookSensitivity: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl cyber-glass-card">
              <span className="text-xs text-slate-200">FPS Pointer Lock Mode</span>
              <input
                type="checkbox"
                checked={preferences.pointerLock}
                onChange={(e) => updatePreferences({ pointerLock: e.target.checked })}
                className="w-4 h-4 accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
