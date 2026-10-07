import React from 'react';
import { useLibraryStore } from '../../store/useLibraryStore';
import { Lock, Unlock } from 'lucide-react';

export const ControlsHint: React.FC = () => {
  const preferences = useLibraryStore((s) => s.preferences);
  const updatePreferences = useLibraryStore((s) => s.updatePreferences);
  const activeModal = useLibraryStore((s) => s.activeModal);

  if (!preferences.showControlsHint || activeModal) return null;

  const togglePointerLock = () => {
    const nextVal = !preferences.pointerLock;
    updatePreferences({ pointerLock: nextVal });
    if (nextVal) {
      const canvas = document.querySelector('canvas');
      if (canvas && canvas.requestPointerLock) {
        canvas.requestPointerLock().catch(() => {});
      }
    } else {
      if (document.exitPointerLock) {
        document.exitPointerLock();
      }
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center gap-2">
      <div className="flex items-center gap-2.5 px-4 py-2 rounded-full cyber-glass text-[11px] text-slate-200 shadow-2xl border border-cyan-500/25 backdrop-blur-md">
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-cyan-500/40 text-cyan-200 font-mono text-[10px]">WASD</kbd>
          Move
        </span>
        <span className="text-cyan-800">•</span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-cyan-500/40 text-cyan-200 font-mono text-[10px]">← →</kbd>
          Turn
        </span>
        <span className="text-cyan-800">•</span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-cyan-500/40 text-cyan-200 font-mono text-[10px]">Shift</kbd>
          Sprint
        </span>
        <span className="text-cyan-800">•</span>
        <span className="text-slate-300">
          Drag / Mouse Look
        </span>
        <span className="text-cyan-800">•</span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-cyan-500/40 text-cyan-200 font-mono text-[10px]">E / Click</kbd>
          Read
        </span>
        <span className="text-cyan-800">•</span>
        <button
          onClick={togglePointerLock}
          className="pointer-events-auto flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-400/40 text-cyan-300 hover:text-white transition-all cursor-pointer font-medium text-[10px]"
          title="Toggle between Free Mouse Drag and Locked FPS Look (Esc to unlock)"
        >
          {preferences.pointerLock ? (
            <>
              <Lock className="w-3 h-3 text-cyan-400" />
              <span>FPS Look (Esc to free)</span>
            </>
          ) : (
            <>
              <Unlock className="w-3 h-3 text-slate-400" />
              <span>Lock Mouse</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
