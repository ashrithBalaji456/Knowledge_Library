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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md pointer-events-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900/95 border border-slate-800 shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-800 text-slate-300">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 font-['Outfit']">
                LIBRARY PREFERENCES & PERFORMANCE
              </h2>
              <p className="text-xs text-slate-400">Atmosphere, graphics quality, and telemetry</p>
            </div>
          </div>

          <button
            onClick={closeModal}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Atmosphere Mode */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Sun className="w-4 h-4" /> Lighting & Atmosphere
            </h3>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'day', label: 'Day', icon: Sun, color: 'text-amber-400' },
                { id: 'evening', label: 'Evening', icon: Sunset, color: 'text-orange-400' },
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
                        ? 'bg-slate-800 border-amber-400/60 text-white shadow-lg shadow-black/40'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/60'
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
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4" /> Performance & Diagnostics
            </h3>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div>
                <span className="text-xs text-slate-200 font-medium block">
                  Show Real-Time FPS & Telemetry
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {fpsMetrics.fps} FPS • {fpsMetrics.drawCalls} draw calls • {fpsMetrics.triangles.toLocaleString()} triangles
                </span>
              </div>
              <input
                type="checkbox"
                checked={preferences.showFpsMonitor}
                onChange={(e) => updatePreferences({ showFpsMonitor: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-emerald-500/30 bg-emerald-950/10">
              <div>
                <span className="text-xs text-emerald-300 font-bold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  120 FPS High-Refresh & Anti-Lag Mode
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

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs">
              <span className="text-slate-300">Graphics Quality Profile</span>
              <div className="flex items-center gap-1">
                {(['low', 'medium', 'high'] as const).map((q) => (
                  <button
                    key={q}
                    onClick={() => updatePreferences({ graphicsQuality: q })}
                    className={`px-3 py-1 rounded-xl font-bold uppercase text-[10px] cursor-pointer transition-colors ${
                      preferences.graphicsQuality === q
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-750'
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
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Volume2 className="w-4 h-4" /> Audio & Footsteps
            </h3>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-xs text-slate-200">Library Sound Effects</span>
              <input
                type="checkbox"
                checked={preferences.soundEnabled}
                onChange={(e) => updatePreferences({ soundEnabled: e.target.checked })}
                className="w-4 h-4 accent-amber-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-xs text-slate-200">Footstep Acoustics</span>
              <input
                type="checkbox"
                checked={preferences.footstepsEnabled}
                onChange={(e) => updatePreferences({ footstepsEnabled: e.target.checked })}
                className="w-4 h-4 accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Controls Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
              <MousePointer className="w-4 h-4" /> Movement & Camera Damping
            </h3>

            <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Walking Speed</span>
                <span className="font-mono text-blue-400">{preferences.moveSpeed}</span>
              </div>
              <input
                type="range"
                min="4"
                max="12"
                step="0.5"
                value={preferences.moveSpeed}
                onChange={(e) => updatePreferences({ moveSpeed: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-400"
              />
            </div>

            <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Mouse Look Sensitivity</span>
                <span className="font-mono text-blue-400">
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
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-400"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-xs text-slate-200">FPS Pointer Lock Mode</span>
              <input
                type="checkbox"
                checked={preferences.pointerLock}
                onChange={(e) => updatePreferences({ pointerLock: e.target.checked })}
                className="w-4 h-4 accent-blue-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
