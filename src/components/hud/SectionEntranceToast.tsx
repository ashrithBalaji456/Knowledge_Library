import React, { useEffect, useState, useRef } from 'react';
import { useLibraryStore } from '../../store/useLibraryStore';

export const SectionEntranceToast: React.FC = () => {
  const activeChunk = useLibraryStore((s) => s.activeChunk);
  const sections = useLibraryStore((s) => s.sections);
  const resources = useLibraryStore((s) => s.resources);

  const [visible, setVisible] = useState(false);
  const [currentSection, setCurrentSection] = useState<typeof sections[0] | null>(null);
  const prevChunk = useRef(activeChunk);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (activeChunk !== prevChunk.current && activeChunk !== 'central') {
      prevChunk.current = activeChunk;
      const sec = sections.find((s) => s.id === activeChunk);
      if (sec) {
        setCurrentSection(sec);
        setVisible(true);

        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          setVisible(false);
        }, 2400);
      }
    } else if (activeChunk === 'central') {
      prevChunk.current = 'central';
    }
  }, [activeChunk, sections]);

  if (!visible || !currentSection) return null;

  const count = resources.filter((r) => r.location?.sectionId === currentSection.id).length;

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 pointer-events-none animate-in fade-in slide-in-from-top-4 duration-300">
      <div
        className="px-6 py-3 rounded-2xl cyber-glass-glow border shadow-2xl flex items-center gap-3.5 text-center"
        style={{ borderColor: `${currentSection.color}88` }}
      >
        <span className="text-2xl drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">{currentSection.icon}</span>
        <div className="text-left">
          <div className="text-[9px] font-mono tracking-widest text-cyan-400 uppercase">
            ENTERING SECTOR
          </div>
          <h3
            className="text-sm font-extrabold tracking-wide font-['Outfit']"
            style={{ color: currentSection.accentColor }}
          >
            {currentSection.name.toUpperCase()}
          </h3>
          <p className="text-[11px] text-slate-400 font-mono">
            {count} Indexed Neural Archives
          </p>
        </div>
      </div>
    </div>
  );
};
