import React from 'react';
import { useLibraryStore } from '../../store/useLibraryStore';

export const ControlsHint: React.FC = () => {
  const preferences = useLibraryStore((s) => s.preferences);
  const activeModal = useLibraryStore((s) => s.activeModal);

  if (!preferences.showControlsHint || activeModal) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none">
      <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-slate-950/75 backdrop-blur-md border border-slate-800/80 text-[11px] text-slate-400 shadow-xl">
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[10px]">WASD</kbd>
          Move
        </span>
        <span className="text-slate-600">•</span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[10px]">Shift</kbd>
          Sprint
        </span>
        <span className="text-slate-600">•</span>
        <span>Mouse Look</span>
        <span className="text-slate-600">•</span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[10px]">E</kbd>
          Interact
        </span>
        <span className="text-slate-600">•</span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[10px]">/</kbd>
          Search
        </span>
      </div>
    </div>
  );
};
