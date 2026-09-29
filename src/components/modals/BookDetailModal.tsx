import React, { useMemo } from 'react';
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
  HardDrive,
  Sparkles,
  Layers
} from 'lucide-react';

const GithubIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

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
  const isPdf = resource.type === 'PDF' || resource.type === 'BOOK' || resource.contentSample;
  const isGithub = resource.type === 'GITHUB';
  const isDrive = resource.type === 'GOOGLE_DRIVE';

  const section = sections.find((s) => s.id === resource.category);
  const sectionColor = section?.color || '#3b82f6';

  const handleOpenResource = () => {
    if (isPdf && resource.contentSample) {
      openPdfReader(resource);
    } else if (resource.url) {
      window.open(resource.url, '_blank', 'noopener,noreferrer');
    } else {
      openPdfReader({
        ...resource,
        contentSample: [
          `# ${resource.title}\n\n**Author:** ${resource.author}\n**Category:** ${resource.category}\n\n${resource.description}`,
          `## Foundational Theory & Architecture\n\nThis knowledge tome is placed in your personal library. Master the fundamentals and progress through the recommended next steps.`,
        ],
      });
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'BEGINNER':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'INTERMEDIATE':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'ADVANCED':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      case 'EXPERT':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      default:
        return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md pointer-events-auto overflow-y-auto">
      <div
        className="relative w-full max-w-2xl my-8 rounded-3xl bg-slate-900/95 border border-slate-800 shadow-2xl flex flex-col overflow-hidden max-h-[90vh]"
        style={{ borderTopColor: sectionColor, borderTopWidth: '4px' }}
      >
        {/* Header Ribbon */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono uppercase"
              style={{
                backgroundColor: `${sectionColor}22`,
                color: sectionColor,
                border: `1px solid ${sectionColor}44`,
              }}
            >
              {section?.name || resource.category}
            </span>
            <span className="text-xs text-slate-400 font-light">
              • {resource.type}
            </span>
          </div>

          <button
            onClick={closeModal}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6">
          {/* Main Book Title & Badges */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              {resource.priority === 'MUST_LEARN' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300">
                  <Star className="w-3.5 h-3.5 fill-amber-300" /> MUST LEARN
                </span>
              )}
              {resource.isCurrentFocus && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 border border-red-500/40 text-red-300">
                  <Flame className="w-3.5 h-3.5" /> CURRENT FOCUS
                </span>
              )}
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(
                  resource.difficulty
                )}`}
              >
                {resource.difficulty}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300">
                {resource.status}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 font-['Outfit']">
              {resource.title}
            </h2>
            <p className="text-sm text-slate-400 mt-1 font-light">
              by <span className="text-slate-200 font-medium">{resource.author}</span>
            </p>
          </div>

          {/* Physical Library Location Badge */}
          {loc && (
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="flex-1 truncate">
                <span className="text-slate-500">Location: </span>
                <span className="font-semibold text-amber-300">{loc.sectionName}</span>
                <span className="text-slate-600"> → </span>
                <span>Shelf {loc.shelfNumber < 10 ? '0' + loc.shelfNumber : loc.shelfNumber}</span>
                <span className="text-slate-600"> → </span>
                <span className="text-slate-300 font-medium">
                  {loc.rowNumber === 0
                    ? 'Top Shelf (Prominent)'
                    : loc.rowNumber === 1
                    ? 'Middle Shelf'
                    : 'Lower Shelf'}
                </span>
              </div>
            </div>
          )}

          {/* Reading Progress */}
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Learning Progress</span>
              <span className="font-mono text-amber-400 font-bold">
                {resource.progress}%
                {resource.currentPage && resource.totalPages && (
                  <span className="text-slate-400 font-normal ml-1.5">
                    (Page {resource.currentPage} of {resource.totalPages})
                  </span>
                )}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${resource.progress}%`,
                  backgroundColor: sectionColor,
                }}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Overview & Key Concepts
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed font-light">
              {resource.description}
            </p>
          </div>

          {/* Tags */}
          <div>
            <div className="flex flex-wrap gap-1.5">
              {resource.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-800 border border-slate-700 text-slate-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* --- BEFORE THIS (Prerequisites) --- */}
          {recommendations && recommendations.learnFirst.length > 0 && (
            <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-900/40 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-300 uppercase tracking-wider">
                <ArrowLeft className="w-4 h-4" /> BEFORE THIS BOOK (Prerequisites)
              </div>
              <div className="space-y-2">
                {recommendations.learnFirst.map((item) => (
                  <div
                    key={item.resource.id}
                    onClick={() => selectResource(item.resource.id)}
                    className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-semibold text-slate-200 group-hover:text-blue-300 transition-colors">
                        ◉ {item.resource.title}
                      </h5>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {item.resource.progress}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 font-light italic">
                      "{item.reason}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- YOU SHOULD READ NEXT --- */}
          {recommendations && recommendations.learnNext.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-900/40 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-400" /> YOU SHOULD READ NEXT
              </div>
              <div className="space-y-2">
                {recommendations.learnNext.map((item) => (
                  <div
                    key={item.resource.id}
                    onClick={() => selectResource(item.resource.id)}
                    className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-semibold text-slate-200 group-hover:text-amber-300 transition-colors">
                        → {item.resource.title}
                      </h5>
                      <ArrowRight className="w-4 h-4 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-xs text-amber-300/80 mt-1 font-light italic">
                      "{item.reason}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 md:p-6 border-t border-slate-800/80 bg-slate-950/70 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(resource.id)}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                resource.isFavorite
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Star className={`w-4 h-4 ${resource.isFavorite ? 'fill-amber-300' : ''}`} />
              <span className="hidden sm:inline">Favorite</span>
            </button>

            <button
              onClick={() => toggleCurrentFocus(resource.id)}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                resource.isCurrentFocus
                  ? 'bg-red-500/20 border-red-500/40 text-red-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span className="hidden sm:inline">Focus</span>
            </button>

            <button
              onClick={() => markCompleted(resource.id)}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                resource.status === 'COMPLETED'
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Completed</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => locateBook(resource.id)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-amber-400" />
              LOCATE BOOK
            </button>

            <button
              onClick={handleOpenResource}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
            >
              {isGithub ? (
                <>
                  <GithubIcon className="w-4 h-4" /> OPEN GITHUB
                </>
              ) : isDrive ? (
                <>
                  <HardDrive className="w-4 h-4" /> OPEN DRIVE
                </>
              ) : (
                <>
                  <BookOpen className="w-4 h-4" /> OPEN BOOK
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
