import React, { useState, useEffect, useMemo } from 'react';
import { useLibraryStore } from '../../store/useLibraryStore';
import { Star, Flame, CheckCircle, BookOpen } from 'lucide-react';

export const BookHoverHUD: React.FC = () => {
  const hoveredResourceId = useLibraryStore((s) => s.hoveredResourceId);
  const resources = useLibraryStore((s) => s.resources);
  const sections = useLibraryStore((s) => s.sections);
  const activeModal = useLibraryStore((s) => s.activeModal);

  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      if (document.pointerLockElement) {
        setMousePos(null);
      } else {
        setMousePos({ x: e.clientX, y: e.clientY });
      }
    };
    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  if (activeModal) return null;

  const hoveredResource = hoveredResourceId
    ? resources.find((r) => r.id === hoveredResourceId)
    : null;

  const section = hoveredResource
    ? sections.find((s) => s.id === hoveredResource.category)
    : null;
  const sectionColor = section?.color || hoveredResource?.location?.colorHex || '#3b82f6';

  const bookMatter = hoveredResource
    ? hoveredResource.whatIsThisBookFor || hoveredResource.summary || hoveredResource.description
    : null;

  // Position card near mouse cursor if hovering with pointer, or centered below crosshair
  const isMouseDriven = Boolean(mousePos && (window as any).__mouseHoveredBookId);
  const cardStyle: React.CSSProperties = isMouseDriven && mousePos
    ? {
        position: 'fixed',
        left: `${Math.min(window.innerWidth - 380, Math.max(20, mousePos.x + 24))}px`,
        top: `${Math.min(window.innerHeight - 260, Math.max(20, mousePos.y + 16))}px`,
        transform: 'none',
        borderColor: `${sectionColor}aa`,
      }
    : {
        position: 'absolute',
        top: '55%',
        left: '50%',
        transform: 'translate(-50%, 0)',
        borderColor: `${sectionColor}aa`,
      };

  return (
    <div className="fixed inset-0 pointer-events-none z-30 flex items-center justify-center">
      {/* Center Crosshair (aiming reticle) */}
      <div className="relative flex items-center justify-center">
        <div
          className={`w-2 h-2 rounded-full transition-all duration-200 ${
            hoveredResource
              ? 'scale-150 bg-cyan-400 ring-4 ring-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.9)]'
              : 'bg-cyan-200/50 shadow-sm'
          }`}
        />
        {hoveredResource && (
          <div className="absolute w-7 h-7 rounded-full border border-cyan-400/50 animate-ping pointer-events-none" />
        )}
      </div>

      {/* Floating Hover Inspection Card */}
      {hoveredResource && (
        <div
          className="pointer-events-none select-none px-4 py-3.5 rounded-2xl cyber-glass-dense border shadow-2xl flex flex-col items-center text-center max-w-sm w-80 sm:w-96 animate-in fade-in zoom-in-95 duration-150"
          style={cardStyle}
        >
          {/* Priority / Focus Badges */}
          <div className="flex items-center gap-1.5 mb-2 flex-wrap justify-center">
            <span
              className="text-[10px] font-bold font-mono px-2 py-0.5 rounded uppercase tracking-wider"
              style={{
                backgroundColor: `${sectionColor}22`,
                color: sectionColor,
                border: `1px solid ${sectionColor}66`,
              }}
            >
              {section?.name || hoveredResource.category}
            </span>
            {hoveredResource.location?.rowLabel && (
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                {hoveredResource.location.rowLabel}
              </span>
            )}
            <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-slate-900/80 text-slate-300 border border-slate-700/60 uppercase">
              {hoveredResource.resourceType || 'BOOK'}
            </span>
            {hoveredResource.priority === 'MUST_LEARN' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 border border-cyan-400/50 text-cyan-300">
                <Star className="w-3 h-3 fill-cyan-300" /> MUST LEARN
              </span>
            )}
            {hoveredResource.priority === 'CURRENT_FOCUS' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/20 border border-violet-400/50 text-violet-300">
                <Flame className="w-3 h-3" /> CURRENT FOCUS
              </span>
            )}
            {hoveredResource.readingStatus === 'COMPLETED' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 border border-emerald-400/50 text-emerald-300">
                <CheckCircle className="w-3 h-3" /> COMPLETED
              </span>
            )}
          </div>

          {/* Book Title */}
          <h3 className="font-bold text-sm text-slate-100 font-heading line-clamp-2 mb-0.5 tracking-tight">
            {hoveredResource.title}
          </h3>
          <p className="text-xs text-slate-400 font-light mb-2">
            by <span className="text-cyan-300 font-medium">{hoveredResource.author}</span>
          </p>

          {/* Concise Book Purpose & Matter */}
          {bookMatter && (
            <p className="text-[11px] text-slate-300 bg-slate-950/70 rounded-xl p-2.5 px-3 mb-2.5 line-clamp-3 italic border border-cyan-900/30 leading-relaxed text-left w-full shadow-inner">
              "{bookMatter}"
            </p>
          )}

          {/* Reading Progress Bar & Pages info */}
          <div className="w-full flex items-center justify-between gap-2 mb-2 text-[10px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-3 h-3 text-cyan-400" />
              <span>{hoveredResource.pages ? `${hoveredResource.pages} pages` : 'Technical PDF'}</span>
            </div>
            <div className="flex-1 max-w-[120px] h-1.5 rounded-full bg-slate-800/80 overflow-hidden border border-slate-700/50">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${hoveredResource.progress || 0}%`,
                  backgroundColor: sectionColor,
                }}
              />
            </div>
            <span className="font-mono text-cyan-300 font-bold">
              {hoveredResource.progress || 0}%
            </span>
          </div>

          {/* Interaction key hint */}
          <div className="flex items-center gap-1.5 text-[11px] text-cyan-400 font-semibold pt-1 border-t border-slate-800/80 w-full justify-center">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-cyan-500/40 font-mono text-cyan-200 text-[10px] shadow-sm">
              E
            </kbd>
            <span>or Click to access neural book reader</span>
          </div>
        </div>
      )}
    </div>
  );
};

