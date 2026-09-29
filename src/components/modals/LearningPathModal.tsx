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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md pointer-events-auto">
      <div className="relative w-full max-w-4xl h-[85vh] rounded-3xl bg-slate-900/95 border border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Milestone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 font-['Outfit']">
                CURATED LEARNING PATHS
              </h2>
              <p className="text-xs text-slate-400">
                Step-by-step career roadmaps and concept sequences
              </p>
            </div>
          </div>

          <button
            onClick={closeModal}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Path Selection Tabs */}
        <div className="px-6 py-3 border-b border-slate-800 bg-slate-950/40 flex items-center gap-2 overflow-x-auto">
          {learningPaths.map((path) => (
            <button
              key={path.id}
              onClick={() => setActivePathId(path.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all ${
                path.id === activePath?.id
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'
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
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/30 to-blue-950/30 border border-emerald-900/40 mb-6">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" /> Career Blueprint: {activePath.targetRole}
              </div>
              <p className="text-sm text-slate-300 font-light">
                {activePath.description}
              </p>
            </div>
          )}

          {/* Sequential Step Cards */}
          <div className="relative pl-6 md:pl-8 border-l-2 border-slate-800 space-y-6">
            {pathResources.map((res, index) => {
              const isDone = res.status === 'COMPLETED';
              const isFocus = res.isCurrentFocus || res.status === 'IN_PROGRESS';

              return (
                <div key={res.id} className="relative group">
                  {/* Step Number Dot on Timeline */}
                  <div
                    className={`absolute -left-[31px] md:-left-[39px] top-1.5 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold border ${
                      isDone
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                        : isFocus
                        ? 'bg-amber-500 text-slate-950 border-amber-400 ring-4 ring-amber-400/20'
                        : 'bg-slate-900 text-slate-400 border-slate-700'
                    }`}
                  >
                    {isDone ? <CheckCircle className="w-3.5 h-3.5 stroke-[3]" /> : index + 1}
                  </div>

                  {/* Card Body */}
                  <div className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                          {res.category.toUpperCase()}
                        </span>
                        {isFocus && (
                          <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                            <Flame className="w-3 h-3" /> Current Focus
                          </span>
                        )}
                        {isDone && (
                          <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Mastered
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
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                        title="Locate book on shelf in 3D"
                      >
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span className="hidden sm:inline">Locate</span>
                      </button>

                      <button
                        onClick={() => selectResource(res.id)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1 cursor-pointer"
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
