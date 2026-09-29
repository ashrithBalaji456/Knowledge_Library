import React, { useMemo, useState } from 'react';
import { useLibraryStore } from '../../store/useLibraryStore';
import { computeRecommendations } from '../../engine/recommendationEngine';
import {
  X,
  BookOpen,
  MapPin,
  Star,
  Flame,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Layers,
  Heart,
  HelpCircle,
  BookmarkCheck,
  Edit3,
  Check,
  ExternalLink,
} from 'lucide-react';
import { openPdfInNewTab, getPdfUrl } from '../../utils/pdfViewer';

export const BookDetailModal: React.FC = () => {
  const selectedResourceId = useLibraryStore((s) => s.selectedResourceId);
  const resources = useLibraryStore((s) => s.resources);
  const sections = useLibraryStore((s) => s.sections);
  const relationships = useLibraryStore((s) => s.relationships);
  const closeModal = useLibraryStore((s) => s.closeModal);
  const openPdfReader = useLibraryStore((s) => s.openPdfReader);
  const locateBook = useLibraryStore((s) => s.locateBook);
  const selectResource = useLibraryStore((s) => s.selectResource);
  const toggleFavorite = useLibraryStore((s) => s.toggleFavorite);
  const toggleCurrentFocus = useLibraryStore((s) => s.toggleCurrentFocus);
  const markCompleted = useLibraryStore((s) => s.markCompleted);
  const rateResource = useLibraryStore((s) => s.rateResource);
  const setPersonalNotes = useLibraryStore((s) => s.setPersonalNotes);

  const [editingNotes, setEditingNotes] = useState(false);
  const [noteInput, setNoteInput] = useState('');
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const resource = useMemo(
    () => resources.find((r) => r.id === selectedResourceId),
    [resources, selectedResourceId]
  );

  const recommendations = useMemo(() => {
    if (!resource) return null;
    return computeRecommendations(resource, resources, relationships);
  }, [resource, resources, relationships]);

  if (!resource) return null;

  const loc = resource.location;
  const section = sections.find((s) => s.id === resource.category);
  const sectionColor = section?.color || resource.location?.colorHex || '#d97706';

  const handleOpenBook = () => {
    openPdfInNewTab(resource);
  };

  const handleStarClick = (ratingValue: number) => {
    rateResource(resource.id, ratingValue);
  };

  const handleSaveNotes = () => {
    setPersonalNotes(resource.id, noteInput);
    setEditingNotes(false);
  };

  const startEditNotes = () => {
    setNoteInput(resource.personalNotes || '');
    setEditingNotes(true);
  };

  const currentRating = resource.personalRating || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md pointer-events-auto overflow-y-auto">
      <div
        className="relative w-full max-w-2xl my-6 rounded-3xl bg-stone-900/95 border border-stone-700/60 shadow-2xl flex flex-col overflow-hidden max-h-[92vh]"
        style={{ borderTopColor: sectionColor, borderTopWidth: '4px' }}
      >
        {/* Header Ribbon */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-stone-800 bg-stone-950/70">
          <div className="flex items-center gap-2.5">
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono uppercase tracking-wider"
              style={{
                backgroundColor: `${sectionColor}22`,
                color: sectionColor,
                border: `1px solid ${sectionColor}44`,
              }}
            >
              {section?.name || resource.category}
            </span>
            <span className="text-xs text-stone-400 font-medium">
              → {resource.subCategory || 'General'}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-stone-800 text-stone-300 border border-stone-700 text-[10px] font-mono font-semibold uppercase">
              {resource.resourceType || 'BOOK'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(resource.id)}
              className={`p-2 rounded-xl transition ${
                resource.isFavorite
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  : 'bg-stone-800/80 text-stone-400 hover:text-stone-200'
              }`}
              title="Add to Favorites"
            >
              <Heart className={`w-4 h-4 ${resource.isFavorite ? 'fill-rose-500' : ''}`} />
            </button>
            <button
              onClick={() => toggleCurrentFocus(resource.id)}
              className={`p-2 rounded-xl transition ${
                resource.priority === 'CURRENT_FOCUS'
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                  : 'bg-stone-800/80 text-stone-400 hover:text-stone-200'
              }`}
              title="Set as Current Focus"
            >
              <Flame className="w-4 h-4" />
            </button>
            <button
              onClick={closeModal}
              className="p-2 rounded-xl bg-stone-800/80 text-stone-400 hover:text-stone-100 hover:bg-stone-700 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Top Hero: Cover Preview + Title + Author (Rules 13, 28, 63) */}
          <div className="flex items-start gap-5">
            {/* Realistic Book Cover Graphic */}
            <div
              className="w-28 h-40 rounded-xl shrink-0 p-3 shadow-2xl flex flex-col justify-between border relative overflow-hidden"
              style={{
                backgroundColor: resource.location?.colorHex || sectionColor,
                borderColor: 'rgba(255,255,255,0.2)',
              }}
            >
              {/* Gold foil decorative line */}
              <div className="absolute top-2 left-2 right-2 h-0.5 bg-amber-300/40" />
              <div className="absolute bottom-2 left-2 right-2 h-0.5 bg-amber-300/40" />

              <div className="space-y-1">
                <span className="text-[9px] font-mono tracking-widest uppercase text-amber-200/90 font-bold block truncate">
                  {section?.code || 'LIB'}
                </span>
                <h4 className="text-xs font-bold text-white line-clamp-3 leading-snug">
                  {resource.title}
                </h4>
              </div>

              <div className="text-[10px] text-white/80 font-medium truncate">
                {resource.author}
              </div>
            </div>

            {/* Title & Metadata Details */}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h1 className="text-xl md:text-2xl font-bold font-heading text-stone-100 leading-tight">
                  {resource.title}
                </h1>
              </div>

              <p className="text-sm font-medium text-stone-300">
                by <span className="text-amber-400 font-semibold">{resource.author}</span>
              </p>

              {/* Status & Difficulty Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono bg-stone-800 text-stone-300 border border-stone-700">
                  {resource.difficulty || 'INTERMEDIATE'}
                </span>

                {resource.priority === 'MUST_LEARN' && (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>MUST LEARN</span>
                  </span>
                )}

                {resource.priority === 'CURRENT_FOCUS' && (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-rose-400" />
                    <span>CURRENT FOCUS</span>
                  </span>
                )}

                <span className="text-xs text-stone-400">
                  {resource.totalPages || resource.pages || 350} pages
                </span>
              </div>

              {/* Interactive Personal Rating (Rule 26) */}
              <div className="flex items-center gap-2 pt-2">
                <span className="text-xs text-stone-400 font-medium">My Rating:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const fillAmount = (hoverRating !== null ? hoverRating : currentRating) >= star;
                    return (
                      <button
                        key={star}
                        onClick={() => handleStarClick(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="p-0.5 hover:scale-110 transition cursor-pointer"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            fillAmount
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-stone-600 hover:text-stone-400'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                <span className="text-xs font-mono text-amber-400 font-bold ml-1">
                  {currentRating > 0 ? `${currentRating}.0` : 'Not Rated'}
                </span>
              </div>
            </div>
          </div>

          {/* WHAT IS THIS BOOK FOR? (Rule 15 - Most Important Field) */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1.5 shadow-inner">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>WHAT IS THIS BOOK FOR?</span>
            </div>
            <p className="text-sm font-semibold text-stone-100 leading-relaxed">
              {resource.whatIsThisBookFor ||
                `For mastering ${resource.title} and deepening applied expertise in ${resource.category}.`}
            </p>
          </div>

          {/* Book Summary (Rule 14) */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
              Book Summary
            </h3>
            <p className="text-sm text-stone-300 leading-relaxed">
              {resource.summary || resource.description}
            </p>
          </div>

          {/* KEY TAKEAWAYS (Rule 16: 5-10 specific bullet points) */}
          {resource.keyTakeaways && resource.keyTakeaways.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-2">
                <BookmarkCheck className="w-4 h-4 text-emerald-400" />
                <span>KEY TAKEAWAYS & CONCEPTS</span>
              </h3>
              <ul className="space-y-1.5">
                {resource.keyTakeaways.map((takeaway, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-xs text-stone-200 bg-stone-800/40 p-2.5 rounded-xl border border-stone-800"
                  >
                    <span className="flex items-center justify-center w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-snug">{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Prerequisites & "Read This Before" (Rule 17, 19) */}
          {resource.prerequisites && resource.prerequisites.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-2">
                <ArrowLeft className="w-3.5 h-3.5 text-orange-400" />
                <span>READ THIS BEFORE (PREREQUISITES)</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {resource.prerequisites.map((prereq, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-xl bg-orange-500/10 text-orange-200 border border-orange-500/30 text-xs font-medium"
                  >
                    {prereq}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Next (Rule 20) */}
          {resource.recommendedNext && resource.recommendedNext.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-2">
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                <span>YOU MAY WANT TO READ NEXT</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {resource.recommendedNext.map((nextItem, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-200 border border-emerald-500/30 text-xs font-medium"
                  >
                    {nextItem}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Personal Review & Notes (Rule 27, 56) */}
          <div className="space-y-2 p-4 rounded-2xl bg-stone-800/40 border border-stone-700/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-300">
                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                <span>MY PERSONAL NOTES & REVIEW</span>
              </div>
              {!editingNotes && (
                <button
                  onClick={startEditNotes}
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
                >
                  {resource.personalNotes ? 'Edit Notes' : '+ Add Note'}
                </button>
              )}
            </div>

            {editingNotes ? (
              <div className="space-y-2">
                <textarea
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Record your takeaways, interview reminders, or personal critique..."
                  className="w-full h-20 p-2.5 rounded-xl bg-stone-900 border border-amber-500/40 text-stone-100 text-xs focus:outline-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingNotes(false)}
                    className="px-3 py-1 rounded-lg text-xs text-stone-400 hover:text-stone-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNotes}
                    className="px-3 py-1 rounded-lg text-xs bg-amber-600 hover:bg-amber-500 text-white font-semibold"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-stone-400 italic">
                {resource.personalNotes ||
                  'No personal notes added yet. Record your takeaways for fast reference during interviews.'}
              </p>
            )}
          </div>

          {/* Reading Progress Tracker (Rule 25) */}
          <div className="space-y-2 p-4 rounded-2xl bg-stone-800/60 border border-stone-700/60">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-stone-300">Reading Progress</span>
              <span className="font-mono text-amber-400 font-bold">{resource.progress || 0}%</span>
            </div>
            <div className="w-full bg-stone-700 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-emerald-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${resource.progress || 0}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-stone-400 pt-1">
              <span>Status: <b className="text-stone-200">{resource.readingStatus || 'NOT_STARTED'}</b></span>
              {resource.progress < 100 && (
                <button
                  onClick={() => markCompleted(resource.id)}
                  className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  <span>Mark Completed</span>
                </button>
              )}
            </div>
          </div>

          {/* AI Traceability Notice (Rule 45) */}
          <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800 text-[11px] text-stone-500 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-stone-400" />
              <span>
                Source: <b className="text-stone-400">{resource.fileName || 'Digital Tome'}</b> • Verified metadata
              </span>
            </div>
            <span className="text-stone-600 font-mono">ID: {resource.id.slice(0, 10)}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-stone-800 bg-stone-950/80">
          {loc && (
            <button
              onClick={() => locateBook(resource.id)}
              className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-2 border border-stone-700 transition"
            >
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Locate on 3D Shelf</span>
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <button
              onClick={closeModal}
              className="px-3.5 py-2 text-xs font-medium rounded-xl text-stone-400 hover:text-stone-200 transition cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => openPdfReader(resource)}
              className="px-3.5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 border border-stone-700 transition cursor-pointer"
              title="Open in embedded 3D Reader"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>3D Reader</span>
            </button>
            <button
              onClick={handleOpenBook}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-900/40 transition cursor-pointer border border-amber-400/30"
              title="Open actual PDF in new browser tab"
            >
              <ExternalLink className="w-4 h-4 text-white" />
              <span>Open PDF (New Page)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
