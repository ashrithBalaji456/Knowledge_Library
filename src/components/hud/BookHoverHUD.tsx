import React from 'react';
import { useLibraryStore } from '../../store/useLibraryStore';
import { Star, Flame, CheckCircle, Sparkles } from 'lucide-react';

export const BookHoverHUD: React.FC = () => {
  const hoveredResourceId = useLibraryStore((s) => s.hoveredResourceId);
  const resources = useLibraryStore((s) => s.resources);
  const sections = useLibraryStore((s) => s.sections);
  const activeModal = useLibraryStore((s) => s.activeModal);

  if (activeModal) return null;

  const hoveredResource = hoveredResourceId
    ? resources.find((r) => r.id === hoveredResourceId)
    : null;

  const section = hoveredResource
    ? sections.find((s) => s.id === hoveredResource.category)
    : null;
  const sectionColor = section?.color || hoveredResource?.location?.colorHex || '#3b82f6';

  return (
    <div className="fixed inset-0 pointer-events-none z-30 flex items-center justify-center">
      {/* Center Crosshair */}
      <div className="relative flex items-center justify-center">
        <div
          className={`w-2 h-2 rounded-full transition-all duration-200 ${
            hoveredResource
              ? 'scale-150 bg-amber-400 ring-4 ring-amber-400/40 shadow-lg'
              : 'bg-amber-100/60'
          }`}
        />
      </div>

      {/* Floating Hover Inspection Card (Rule 51: Fast Preview Mode) */}
      {hoveredResource && (
        <div
          className="absolute top-[54%] transform -translate-y-0 px-4 py-3 rounded-2xl bg-stone-900/95 backdrop-blur-xl border shadow-2xl shadow-black/80 flex flex-col items-center text-center max-w-sm animate-in fade-in zoom-in-95 duration-150"
          style={{ borderColor: `${sectionColor}aa` }}
        >
          {/* Priority / Focus Badges */}
          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap justify-center">
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
          <h3 className="font-bold text-sm text-stone-100 font-heading line-clamp-1">
            {hoveredResource.title}
          </h3>
          <p className="text-xs text-stone-300 font-light mb-1.5">
            by <span className="text-amber-400 font-medium">{hoveredResource.author}</span>
          </p>

          {/* One-Line Purpose Statement (Rule 51) */}
          {hoveredResource.whatIsThisBookFor && (
            <p className="text-[11px] text-stone-300 bg-stone-800/60 rounded-lg p-1.5 px-2.5 mb-2 line-clamp-2 italic border border-stone-800">
              "{hoveredResource.whatIsThisBookFor}"
            </p>
          )}

          {/* Reading Progress Bar & Rating */}
          <div className="w-full flex items-center justify-between gap-2 mb-2">
            <div className="flex-1 h-1.5 rounded-full bg-stone-800 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${hoveredResource.progress || 0}%`,
                  backgroundColor: sectionColor,
                }}
              />
            </div>
            <span className="text-[10px] font-mono text-amber-300 font-bold">
              {hoveredResource.progress || 0}%
            </span>
            {hoveredResource.personalRating && hoveredResource.personalRating > 0 && (
              <span className="text-[10px] font-mono text-amber-400 font-bold flex items-center gap-0.5">
                ★ {hoveredResource.personalRating}
              </span>
            )}
          </div>

          {/* Interaction key hint */}
          <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-semibold">
            <kbd className="px-1.5 py-0.5 rounded bg-stone-800 border border-stone-700 font-mono text-amber-200 text-[10px]">
              E
            </kbd>
            <span>or Click to view book info card</span>
          </div>
        </div>
      )}
    </div>
  );
};
