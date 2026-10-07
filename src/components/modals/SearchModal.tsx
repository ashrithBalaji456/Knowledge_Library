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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 p-4 bg-[#030712]/80 backdrop-blur-xl pointer-events-auto">
      <div className="relative w-full max-w-3xl rounded-3xl cyber-glass-dense border border-cyan-500/30 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-cyan-900/40 flex items-center gap-3 bg-[#040814]/70">
          <Search className="w-5 h-5 text-cyan-400 shrink-0 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search neural archives (e.g. Concurrency, Redis, LLMs, Spring Security, PyTorch)..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none font-mono"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-cyan-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={closeModal}
            className="p-1.5 rounded-full hover:bg-cyan-950/40 text-slate-400 hover:text-cyan-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Recent Searches & Category Chips */}
        {!query && (
          <div className="px-5 py-3 border-b border-cyan-900/30 bg-[#050C1C]/40 space-y-2">
            {/* Recent Searches */}
            <div className="flex items-center gap-2 overflow-x-auto text-xs">
              <span className="text-slate-400 flex items-center gap-1 font-semibold shrink-0 font-mono text-[11px]">
                <History className="w-3.5 h-3.5 text-cyan-400" /> Recent:
              </span>
              {searchHistory.map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleRecentClick(item)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-cyan-950/50 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 text-xs shrink-0 cursor-pointer transition-colors font-mono"
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Category Quick Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs pt-1">
              <span className="text-slate-400 shrink-0 font-semibold font-mono text-[11px]">Sectors:</span>
              {sections.slice(0, 7).map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setQuery(sec.name.split(' ')[0])}
                  className="px-2.5 py-1 rounded-lg text-xs shrink-0 cursor-pointer transition-all hover:scale-105"
                  style={{
                    backgroundColor: `${sec.color}18`,
                    color: sec.accentColor,
                    border: `1px solid ${sec.color}44`,
                  }}
                >
                  {sec.icon} {sec.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Filter Pills */}
        <div className="px-5 py-2.5 border-b border-cyan-900/30 bg-[#040814]/50 flex items-center gap-2 overflow-x-auto text-xs">
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
              className={`px-3 py-1 rounded-full whitespace-nowrap cursor-pointer transition-all text-xs font-medium ${
                filterType === pill.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                  : 'bg-slate-900/80 text-slate-400 hover:text-cyan-300 hover:bg-slate-850 border border-slate-800'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Cyber Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2.5">
          {results.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm font-mono">
              No matching knowledge nodes found for "{query}".
            </div>
          ) : (
            results.map((res) => {
              const matchedSection = sections.find((s) => s.id === res.category);
              const accentColor = matchedSection?.color || '#06B6D4';

              return (
                <div
                  key={res.id}
                  onClick={() => handleSelectBook(res.id, res.title)}
                  className="p-3.5 rounded-2xl cyber-glass-card hover:border-cyan-400/50 shadow-md transition-all flex items-center justify-between gap-4 cursor-pointer group"
                  style={{
                    borderLeftColor: accentColor,
                    borderLeftWidth: '4px',
                  }}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Colorful Book Swatch Icon */}
                    <div
                      className="w-10 h-12 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 shadow-md border border-white/20"
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
                          className="text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase tracking-wider"
                          style={{
                            backgroundColor: `${accentColor}22`,
                            color: accentColor,
                            border: `1px solid ${accentColor}44`,
                          }}
                        >
                          {res.category}
                        </span>
                        {res.priority === 'MUST_LEARN' && (
                          <span className="text-[10px] font-bold text-cyan-300 flex items-center gap-1 font-mono">
                            <Star className="w-3 h-3 fill-cyan-300" /> Must Learn
                          </span>
                        )}
                        {res.isCurrentFocus && (
                          <span className="text-[10px] font-bold text-violet-400 flex items-center gap-1 font-mono">
                            <Flame className="w-3 h-3" /> Focus
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-mono">
                          {res.progress}%
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors truncate">
                        {res.title}
                      </h4>
                      <p className="text-xs text-slate-400 truncate mt-0.5 font-light">
                        by {res.author} • {res.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-semibold text-cyan-400 opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity font-mono">
                      <MapPin className="w-3.5 h-3.5" /> Warp in 3D{' '}
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
