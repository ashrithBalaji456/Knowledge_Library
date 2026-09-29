import React from 'react';
import { useLibraryStore } from '../../store/useLibraryStore';
import { X, Layers, Star, Flame, ArrowRight, Compass } from 'lucide-react';

export const SectionBrowserModal: React.FC = () => {
  const sections = useLibraryStore((s) => s.sections);
  const resources = useLibraryStore((s) => s.resources);
  const teleportToSection = useLibraryStore((s) => s.teleportToSection);
  const closeModal = useLibraryStore((s) => s.closeModal);

  const handleSelectSection = (secId: string) => {
    closeModal();
    teleportToSection(secId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md pointer-events-auto">
      <div className="relative w-full max-w-5xl max-h-[85vh] rounded-3xl bg-slate-900/95 border border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 font-['Outfit']">
                LIBRARY SECTIONS & DOMAINS
              </h2>
              <p className="text-xs text-slate-400">
                Explore the wings of your personal knowledge repository
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

        {/* Grid of Colorful Section Cards */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((sec) => {
            const secResources = resources.filter(
              (r) => r.category === sec.id || r.location?.sectionId === sec.id
            );
            const total = secResources.length;
            const mustLearn = secResources.filter((r) => r.priority === 'MUST_LEARN').length;
            const focus = secResources.filter((r) => r.isCurrentFocus || r.priority === 'CURRENT_FOCUS').length;
            const avgProgress =
              total > 0
                ? Math.round(
                    secResources.reduce((acc, curr) => acc + (curr.progress || 0), 0) / total
                  )
                : 0;

            return (
              <div
                key={sec.id}
                onClick={() => handleSelectSection(sec.id)}
                className="group relative p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 shadow-xl transition-all duration-200 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
                style={{
                  borderTopColor: sec.color,
                  borderTopWidth: '3px',
                }}
              >
                <div>
                  {/* Icon & Title */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{sec.icon}</span>
                    <span
                      className="text-[10px] font-bold font-mono px-2 py-0.5 rounded uppercase"
                      style={{
                        backgroundColor: `${sec.color}22`,
                        color: sec.accentColor,
                      }}
                    >
                      {sec.code}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-100 font-['Outfit'] group-hover:text-amber-300 transition-colors">
                    {sec.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1 font-light">
                    {sec.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2.5">
                  {/* Badges */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-blue-400" /> {total} Resources
                    </span>
                    {mustLearn > 0 && (
                      <span className="text-amber-400 font-semibold flex items-center gap-1 text-[11px]">
                        <Star className="w-3 h-3 fill-amber-400" /> {mustLearn} Must Learn
                      </span>
                    )}
                    {focus > 0 && (
                      <span className="text-red-400 font-semibold flex items-center gap-1 text-[11px]">
                        <Flame className="w-3 h-3" /> {focus} Focus
                      </span>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Domain Mastery</span>
                      <span className="font-mono font-bold text-slate-300">{avgProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${avgProgress}%`,
                          backgroundColor: sec.color,
                        }}
                      />
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="flex items-center justify-end text-xs font-semibold text-slate-400 group-hover:text-amber-400 pt-1 transition-colors">
                    <span>Travel to Section</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
