import React, { useState } from 'react';
import {
  BarChart3,
  BookOpen,
  CheckCircle,
  Flame,
  Star,
  Heart,
  FolderTree,
  Edit2,
  GitMerge,
  ArrowRight,
  X,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useLibraryStore } from '../../store/useLibraryStore';

export const DashboardModal: React.FC = () => {
  const activeModal = useLibraryStore((s) => s.activeModal);
  const closeModal = useLibraryStore((s) => s.closeModal);
  const getLibraryStats = useLibraryStore((s) => s.getLibraryStats);
  const resources = useLibraryStore((s) => s.resources);
  const sections = useLibraryStore((s) => s.sections);
  const renameSection = useLibraryStore((s) => s.renameSection);
  const mergeSections = useLibraryStore((s) => s.mergeSections);
  const teleportToSection = useLibraryStore((s) => s.teleportToSection);

  const [activeTab, setActiveTab] = useState<'analytics' | 'sections'>('analytics');
  const [editingSecId, setEditingSecId] = useState<string | null>(null);
  const [renamedTitle, setRenamedTitle] = useState('');

  const [mergeSource, setMergeSource] = useState<string>('');
  const [mergeTarget, setMergeTarget] = useState<string>('');

  if (activeModal !== 'dashboard') return null;

  const stats = getLibraryStats();

  // Compute progress and counts per section
  const sectionStats = sections.map((sec) => {
    const secRes = resources.filter((r) => r.category === sec.id);
    const completed = secRes.filter((r) => r.readingStatus === 'COMPLETED' || r.progress >= 100).length;
    const avgProgress =
      secRes.length > 0
        ? Math.round(secRes.reduce((acc, curr) => acc + (curr.progress || 0), 0) / secRes.length)
        : 0;

    return {
      section: sec,
      count: secRes.length,
      completed,
      avgProgress,
    };
  });

  const handleStartRename = (secId: string, currentName: string) => {
    setEditingSecId(secId);
    setRenamedTitle(currentName);
  };

  const handleSaveRename = (secId: string) => {
    if (renamedTitle.trim()) {
      renameSection(secId, renamedTitle.trim());
    }
    setEditingSecId(null);
  };

  const handleExecuteMerge = () => {
    if (mergeSource && mergeTarget && mergeSource !== mergeTarget) {
      mergeSections(mergeSource, mergeTarget);
      setMergeSource('');
      setMergeTarget('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030712]/80 backdrop-blur-xl">
      <div className="relative w-full max-w-4xl overflow-hidden cyber-glass-dense rounded-3xl border border-cyan-500/30 shadow-2xl text-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cyan-900/40 bg-[#040814]/70">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-cyan-500/15 border border-cyan-400/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">
                TELEMETRY & SECTOR CURATOR
              </div>
              <h2 className="text-xl font-bold font-heading text-slate-100 flex items-center gap-2">
                Neural Archive Dashboard
              </h2>
              <p className="text-xs text-slate-400 font-light">
                Real-time collection metrics, cognitive mastery indexes, and architectural sector management.
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-4 px-6 pt-3 border-b border-cyan-900/40 text-xs font-semibold bg-[#040814]/50">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'analytics'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Collection Analytics</span>
          </button>
          <button
            onClick={() => setActiveTab('sections')}
            className={`pb-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'sections'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>Sector Manager (Merge / Rename)</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'analytics' ? (
            <>
              {/* Primary Stats Grid (Rules 78, 79) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl cyber-glass-card shadow-md">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                    <span>Total Tomes</span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-slate-100">{stats.totalResources}</div>
                  <div className="text-[11px] text-cyan-400/90 font-medium font-mono">{stats.totalHandbooks} Handbooks & Guides</div>
                </div>

                <div className="p-4 rounded-2xl cyber-glass-card shadow-md">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Completed</span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-emerald-400">{stats.completedCount}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{stats.readingCount} Active Reading</div>
                </div>

                <div className="p-4 rounded-2xl cyber-glass-card shadow-md">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
                    <Star className="w-4 h-4 text-cyan-300 fill-cyan-300" />
                    <span>Must Learn</span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-slate-100">{stats.mustLearnCount}</div>
                  <div className="text-[11px] text-violet-400 font-medium font-mono">{stats.currentFocusCount} In Active Focus</div>
                </div>

                <div className="p-4 rounded-2xl cyber-glass-card shadow-md">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
                    <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                    <span>Favorites & Rating</span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-rose-400">{stats.favoriteCount}</div>
                  <div className="text-[11px] text-slate-400 font-mono">★ {stats.averageRating} Avg Rating</div>
                </div>
              </div>

              {/* Progress by Knowledge Domain (Rule 79) */}
              <div className="p-5 rounded-2xl bg-stone-800/40 border border-stone-700/60 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Top Knowledge Domains & Mastery</span>
                  </h3>
                  <span className="text-xs font-mono text-stone-400">
                    Overall Library: <b className="text-emerald-400 font-bold">{stats.overallProgress}%</b>
                  </span>
                </div>

                <div className="space-y-3">
                  {sectionStats.map((item) => (
                    <div key={item.section.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: item.section.color }}
                          />
                          <span className="font-semibold text-stone-200">{item.section.name}</span>
                          <span className="text-stone-400 text-[11px]">({item.count} tomes)</span>
                        </div>
                        <span className="font-mono font-bold text-stone-300">{item.avgProgress}%</span>
                      </div>
                      <div className="w-full bg-stone-700/60 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${item.avgProgress}%`,
                            backgroundColor: item.section.color || '#3b82f6',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Section Manager & Merger (Rules 59, 60) */
            <div className="space-y-6">
              {/* Section Consolidation / Merge Tool */}
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-4">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                  <GitMerge className="w-4 h-4" />
                  <span>Merge Duplicate Sections (Rule 60)</span>
                </div>
                <p className="text-xs text-stone-300">
                  Consolidate duplicate sections (e.g. merge "Java Programming" into "Java Ecosystem"). All books and subsections will automatically move to the target section.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-medium text-stone-400 mb-1">
                      Source Section (to be merged & removed):
                    </label>
                    <select
                      value={mergeSource}
                      onChange={(e) => setMergeSource(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none"
                    >
                      <option value="">Select source section...</option>
                      {sections.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({resources.filter((r) => r.category === s.id).length} books)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-400 mb-1">
                      Target Section (to receive books):
                    </label>
                    <select
                      value={mergeTarget}
                      onChange={(e) => setMergeTarget(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none"
                    >
                      <option value="">Select target section...</option>
                      {sections.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleExecuteMerge}
                    disabled={!mergeSource || !mergeTarget || mergeSource === mergeTarget}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:bg-stone-800 disabled:text-stone-500 text-white font-semibold text-xs transition cursor-pointer flex items-center gap-2"
                  >
                    <GitMerge className="w-3.5 h-3.5" />
                    <span>Execute Section Merge</span>
                  </button>
                </div>
              </div>

              {/* All Sections List with Rename Capability */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                  Active Library Sections ({sections.length})
                </h3>

                <div className="space-y-2">
                  {sections.map((sec) => {
                    const count = resources.filter((r) => r.category === sec.id).length;
                    const isEditing = editingSecId === sec.id;

                    return (
                      <div
                        key={sec.id}
                        className="flex items-center justify-between p-3.5 rounded-xl bg-stone-800/60 border border-stone-700/60 text-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1 mr-4">
                          <span
                            className="w-3.5 h-3.5 rounded-full shrink-0"
                            style={{ backgroundColor: sec.color }}
                          />
                          {isEditing ? (
                            <div className="flex items-center gap-2 flex-1">
                              <input
                                type="text"
                                value={renamedTitle}
                                onChange={(e) => setRenamedTitle(e.target.value)}
                                className="px-2.5 py-1 rounded-lg bg-stone-900 border border-amber-500/50 text-stone-100 text-xs flex-1 focus:outline-none"
                              />
                              <button
                                onClick={() => handleSaveRename(sec.id)}
                                className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-semibold"
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            <div className="min-w-0">
                              <div className="font-bold text-stone-100 flex items-center gap-2">
                                <span>{sec.name}</span>
                                {sec.isHandbookSection && (
                                  <span className="px-1.5 py-0.2 rounded-full bg-orange-500/20 text-orange-300 text-[10px]">
                                    Handbook Pavilion
                                  </span>
                                )}
                              </div>
                              <div className="text-stone-400 text-[11px] truncate">
                                {count} books • {sec.subSections.length} subsections
                              </div>
                            </div>
                          )}
                        </div>

                        {!isEditing && (
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => handleStartRename(sec.id, sec.name)}
                              className="p-1.5 rounded-lg bg-stone-700/60 hover:bg-stone-700 text-stone-300 transition"
                              title="Rename Section"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => teleportToSection(sec.id)}
                              className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 font-medium transition"
                            >
                              Teleport
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-stone-800 bg-stone-950/70">
          <span className="text-xs text-stone-400">
            {stats.totalResources} resources cataloged across {sections.length} physical sections
          </span>
          <button
            onClick={closeModal}
            className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs transition"
          >
            Return to 3D Library
          </button>
        </div>
      </div>
    </div>
  );
};
