import React, { useState } from 'react';
import { useLibraryStore } from '../../store/useLibraryStore';
import {
  X,
  Milestone,
  CheckCircle,
  Flame,
  ArrowRight,
  Lock,
  MapPin,
  Sparkles,
  BookOpen
} from 'lucide-react';

export const LearningPathModal: React.FC = () => {
  const learningPaths = useLibraryStore((s) => s.learningPaths);
  const resources = useLibraryStore((s) => s.resources);
  const closeModal = useLibraryStore((s) => s.closeModal);
  const selectResource = useLibraryStore((s) => s.selectResource);
  const locateBook = useLibraryStore((s) => s.locateBook);

  const [activePathId, setActivePathId] = useState<string>(learningPaths[0]?.id || '');

  const activePath = learningPaths.find((p) => p.id === activePathId) || learningPaths[0];

  const pathResources = activePath
    ? activePath.resourceIds
        .map((id) => resources.find((r) => r.id === id))
        .filter(Boolean) as typeof resources
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030712]/80 backdrop-blur-xl pointer-events-auto">
      <div className="relative w-full max-w-4xl h-[85vh] rounded-3xl cyber-glass-dense border border-cyan-500/30 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-cyan-900/40 flex items-center justify-between gap-4 bg-[#040814]/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Milestone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">
                CURRICULUM MATRIX // CAREER PATHWAYS
              </div>
              <h2 className="text-base font-bold text-slate-100 font-['Outfit']">
                CURATED LEARNING PATHWAYS
              </h2>
              <p className="text-xs text-slate-400 font-light">
                Step-by-step career blueprints and sequential concept mastery roadmaps
              </p>
            </div>
          </div>

          <button
            onClick={closeModal}
            className="p-1.5 rounded-full hover:bg-cyan-950/40 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Path Selection Tabs */}
        <div className="px-6 py-3 border-b border-cyan-900/30 bg-[#040814]/50 flex items-center gap-2 overflow-x-auto">
          {learningPaths.map((path) => (
            <button
              key={path.id}
              onClick={() => setActivePathId(path.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all ${
                path.id === activePath?.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                  : 'bg-slate-900/60 text-slate-400 hover:bg-slate-850 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span>{path.icon}</span>
              <span>{path.title}</span>
            </button>
          ))}
        </div>

        {/* Path Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {activePath && (
            <div className="p-5 rounded-2xl cyber-glass-card border border-cyan-900/40 mb-6">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1 font-mono">
                <Sparkles className="w-4 h-4" /> Career Blueprint: {activePath.targetRole}
              </div>
              <p className="text-sm text-slate-300 font-light">
                {activePath.description}
              </p>
            </div>
          )}

          {/* Sequential Step Cards */}
          <div className="relative pl-6 md:pl-8 border-l-2 border-cyan-900/50 space-y-6">
            {pathResources.map((res, index) => {
              const isDone = res.readingStatus === 'COMPLETED' || res.progress >= 100;
              const isFocus = res.priority === 'CURRENT_FOCUS' || res.readingStatus === 'READING';

              return (
                <div key={res.id} className="relative group">
                  {/* Step Number Dot on Timeline */}
                  <div
                    className={`absolute -left-[31px] md:-left-[39px] top-1.5 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold border ${
                      isDone
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.7)]'
                        : isFocus
                        ? 'bg-cyan-500 text-slate-950 border-cyan-300 ring-4 ring-cyan-400/30 shadow-[0_0_12px_rgba(6,182,212,0.8)]'
                        : 'bg-slate-900 text-slate-400 border-slate-700'
                    }`}
                  >
                    {isDone ? <CheckCircle className="w-3.5 h-3.5 stroke-[3]" /> : index + 1}
                  </div>

                  {/* Card Body */}
                  <div className="p-4 rounded-2xl cyber-glass-card hover:border-cyan-400/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-cyan-900/40">
                          {res.category.toUpperCase()}
                        </span>
                        {isFocus && (
                          <span className="text-[10px] font-bold text-violet-400 flex items-center gap-1 font-mono">
                            <Flame className="w-3 h-3" /> Current Focus
                          </span>
                        )}
                        {isDone && (
                          <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 font-mono">
                            <CheckCircle className="w-3.5 h-3.5" /> Mastered
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-bold text-slate-100 font-['Outfit']">
                        {res.title}
                      </h4>
                      <p className="text-xs text-slate-400 font-light line-clamp-1">
                        {res.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          closeModal();
                          locateBook(res.id);
                        }}
                        className="cyber-btn p-2 rounded-xl text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                        title="Locate book on shelf in 3D"
                      >
                        <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="hidden sm:inline">Warp</span>
                      </button>

                      <button
                        onClick={() => selectResource(res.id)}
                        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-md shadow-cyan-950/60"
                      >
                        Inspect <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
