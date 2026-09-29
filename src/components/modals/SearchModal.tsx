import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useLibraryStore } from '../../store/useLibraryStore';
import {
  Search,
  X,
  MapPin,
  Star,
  Flame,
  History,
  ArrowRight,
  BookOpen
} from 'lucide-react';

export const SearchModal: React.FC = () => {
  const resources = useLibraryStore((s) => s.resources);
  const sections = useLibraryStore((s) => s.sections);
  const searchHistory = useLibraryStore((s) => s.searchHistory);
  const addSearchHistory = useLibraryStore((s) => s.addSearchHistory);
  const closeModal = useLibraryStore((s) => s.closeModal);
  const locateBook = useLibraryStore((s) => s.locateBook);

  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Filtered results
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q && filterType === 'ALL') {
      // Return featured items: MUST_LEARN, CURRENT_FOCUS, and Favorites
      return resources.filter(
        (r) => r.priority === 'MUST_LEARN' || r.isCurrentFocus || r.isFavorite
      );
    }

    return resources.filter((r) => {
      const matchType =
        filterType === 'ALL' ||
        (filterType === 'MUST_LEARN' && r.priority === 'MUST_LEARN') ||
        (filterType === 'FOCUS' && (r.isCurrentFocus || r.priority === 'CURRENT_FOCUS')) ||
        (filterType === 'COMPLETED' && r.status === 'COMPLETED') ||
        r.type === filterType;

      if (!matchType) return false;
      if (!q) return true;

      return (
        r.title.toLowerCase().includes(q) ||
        r.author.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        (r.description?.toLowerCase().includes(q) ?? false) ||
        (r.summary?.toLowerCase().includes(q) ?? false) ||
        (r.whatIsThisBookFor?.toLowerCase().includes(q) ?? false) ||
        r.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [resources, query, filterType]);

  const handleSelectBook = (id: string, title: string) => {
    addSearchHistory(title);
    closeModal();
    locateBook(id);
  };

  const handleRecentClick = (term: string) => {
    setQuery(term);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 p-4 bg-slate-950/75 backdrop-blur-md pointer-events-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-slate-900/95 border border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950/60">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your knowledge (e.g. Concurrency, Redis, Graphs, Spring Boot)..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={closeModal}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Recent Searches & Category Chips */}
        {!query && (
          <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-950/40 space-y-2">
            {/* Recent Searches */}
            <div className="flex items-center gap-2 overflow-x-auto text-xs">
              <span className="text-slate-500 flex items-center gap-1 font-semibold shrink-0">
                <History className="w-3.5 h-3.5 text-slate-400" /> Recent:
              </span>
              {searchHistory.map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleRecentClick(item)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-amber-300 text-xs shrink-0 cursor-pointer transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Category Quick Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs pt-1">
              <span className="text-slate-500 shrink-0 font-semibold">Domains:</span>
              {sections.slice(0, 7).map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setQuery(sec.name.split(' ')[0])}
                  className="px-2.5 py-1 rounded-lg text-xs shrink-0 cursor-pointer transition-colors"
                  style={{
                    backgroundColor: `${sec.color}18`,
                    color: sec.accentColor,
                    border: `1px solid ${sec.color}33`,
                  }}
                >
                  {sec.icon} {sec.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Filter Pills */}
        <div className="px-5 py-2 border-b border-slate-800/80 bg-slate-950/30 flex items-center gap-2 overflow-x-auto text-xs">
          {[
            { id: 'ALL', label: 'All Items' },
            { id: 'MUST_LEARN', label: '⭐ Must Learn' },
            { id: 'FOCUS', label: '🔥 Focus' },
            { id: 'PDF', label: 'PDFs' },
            { id: 'GITHUB', label: 'GitHub' },
            { id: 'COMPLETED', label: '✅ Completed' },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setFilterType(pill.id)}
              className={`px-3 py-1 rounded-full whitespace-nowrap cursor-pointer transition-colors ${
                filterType === pill.id
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Colorful Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2.5">
          {results.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No matching knowledge resources found for "{query}".
            </div>
          ) : (
            results.map((res) => {
              const matchedSection = sections.find((s) => s.id === res.category);
              const accentColor = matchedSection?.color || '#3b82f6';

              return (
                <div
                  key={res.id}
                  onClick={() => handleSelectBook(res.id, res.title)}
                  className="p-3.5 rounded-2xl bg-slate-900/70 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 shadow-md transition-all flex items-center justify-between gap-4 cursor-pointer group"
                  style={{
                    borderLeftColor: accentColor,
                    borderLeftWidth: '4px',
                  }}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Colorful Book Swatch Icon */}
                    <div
                      className="w-10 h-12 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 shadow-md"
                      style={{
                        backgroundColor: res.location?.colorHex || accentColor,
                        color: '#f8fafc',
                      }}
                    >
                      <BookOpen className="w-5 h-5 opacity-90" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase"
                          style={{
                            backgroundColor: `${accentColor}22`,
                            color: accentColor,
                          }}
                        >
                          {res.category}
                        </span>
                        {res.priority === 'MUST_LEARN' && (
                          <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400" /> Must Learn
                          </span>
                        )}
                        {res.isCurrentFocus && (
                          <span className="text-[10px] font-bold text-red-400 flex items-center gap-1">
                            <Flame className="w-3 h-3" /> Focus
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-mono">
                          {res.progress}%
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-100 group-hover:text-amber-300 transition-colors truncate">
                        {res.title}
                      </h4>
                      <p className="text-xs text-slate-400 truncate mt-0.5 font-light">
                        by {res.author} • {res.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-semibold text-amber-400 opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                      <MapPin className="w-3.5 h-3.5" /> Locate in 3D{' '}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
