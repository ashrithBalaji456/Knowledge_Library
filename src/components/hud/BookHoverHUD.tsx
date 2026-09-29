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
          className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
            hoveredResource
              ? 'scale-150 bg-amber-400 ring-4 ring-amber-400/40 shadow-lg'
              : 'bg-amber-100/60 shadow-sm'
          }`}
        />
      </div>

      {/* Floating Hover Inspection Card */}
      {hoveredResource && (
        <div
          className="pointer-events-none select-none px-4 py-3.5 rounded-2xl bg-stone-900/95 backdrop-blur-xl border shadow-2xl shadow-black/90 flex flex-col items-center text-center max-w-sm w-80 sm:w-96 animate-in fade-in zoom-in-95 duration-150"
          style={cardStyle}
        >
          {/* Priority / Focus Badges */}
          <div className="flex items-center gap-1.5 mb-2 flex-wrap justify-center">
            <span
              className="text-[10px] font-bold font-mono px-2 py-0.5 rounded uppercase"
              style={{
                backgroundColor: `${sectionColor}22`,
                color: sectionColor,
                border: `1px solid ${sectionColor}44`,
              }}
            >
              {section?.name || hoveredResource.category}
            </span>
            {hoveredResource.location?.rowLabel && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {hoveredResource.location.rowLabel}
              </span>
            )}
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-stone-800 text-stone-300 border border-stone-700 uppercase">
              {hoveredResource.resourceType || 'BOOK'}
            </span>
            {hoveredResource.priority === 'MUST_LEARN' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/25 border border-amber-500/50 text-amber-300">
                <Star className="w-3 h-3 fill-amber-300" /> MUST LEARN
              </span>
            )}
            {hoveredResource.priority === 'CURRENT_FOCUS' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/25 border border-rose-500/50 text-rose-300">
                <Flame className="w-3 h-3" /> CURRENT FOCUS
              </span>
            )}
            {hoveredResource.readingStatus === 'COMPLETED' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/25 border border-emerald-500/50 text-emerald-300">
                <CheckCircle className="w-3 h-3" /> COMPLETED
              </span>
            )}
          </div>

          {/* Book Title */}
          <h3 className="font-bold text-sm text-stone-100 font-heading line-clamp-2 mb-0.5">
            {hoveredResource.title}
          </h3>
          <p className="text-xs text-stone-300 font-light mb-2">
            by <span className="text-amber-400 font-medium">{hoveredResource.author}</span>
          </p>

          {/* Concise Book Purpose & Matter */}
          {bookMatter && (
            <p className="text-[11px] text-stone-200 bg-stone-800/80 rounded-xl p-2 px-3 mb-2.5 line-clamp-3 italic border border-stone-700/60 leading-relaxed text-left w-full shadow-inner">
              "{bookMatter}"
            </p>
          )}

          {/* Reading Progress Bar & Pages info */}
          <div className="w-full flex items-center justify-between gap-2 mb-2 text-[10px] text-stone-400">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-3 h-3 text-stone-400" />
              <span>{hoveredResource.pages ? `${hoveredResource.pages} pages` : 'Technical PDF'}</span>
            </div>
            <div className="flex-1 max-w-[120px] h-1.5 rounded-full bg-stone-800 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${hoveredResource.progress || 0}%`,
                  backgroundColor: sectionColor,
                }}
              />
            </div>
            <span className="font-mono text-amber-300 font-bold">
              {hoveredResource.progress || 0}%
            </span>
          </div>

          {/* Interaction key hint */}
          <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-semibold pt-1 border-t border-stone-800/80 w-full justify-center">
            <kbd className="px-1.5 py-0.5 rounded bg-stone-800 border border-stone-700 font-mono text-amber-200 text-[10px] shadow-sm">
              E
            </kbd>
            <span>or Click to open book reader</span>
          </div>
        </div>
      )}
    </div>
  );
};

