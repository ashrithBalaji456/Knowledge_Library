import React, { useState } from 'react';
import { useLibraryStore } from '../../store/useLibraryStore';
import { Compass, ChevronDown, ChevronUp, EyeOff } from 'lucide-react';

export const Minimap: React.FC = () => {
  const sections = useLibraryStore((s) => s.sections);
  const playerLocation = useLibraryStore((s) => s.playerLocation);
  const playerRotationY = useLibraryStore((s) => s.playerRotationY);
  const teleportToSection = useLibraryStore((s) => s.teleportToSection);
  const preferences = useLibraryStore((s) => s.preferences);
  const updatePreferences = useLibraryStore((s) => s.updatePreferences);
  const activeChunk = useLibraryStore((s) => s.activeChunk);

  const [isExpanded, setIsExpanded] = useState(false);

  if (!preferences.showMinimap) return null;

  const mapWidth = isExpanded ? 280 : 190;
  const mapHeight = isExpanded ? 310 : 210;

  const worldToMap = (x: number, z: number) => {
    const mapX = ((x + 45) / 90) * mapWidth;
    // Map North (-Z, deep library) to top (0), and South (+Z, entrance) to bottom (mapHeight)
    const mapY = ((z + 62) / 92) * mapHeight;
    return { x: mapX, y: mapY };
  };

  const playerPos = worldToMap(playerLocation[0], playerLocation[2]);
  const activeSec = sections.find((s) => s.id === activeChunk);

  return (
    <div className="fixed bottom-6 right-6 z-40 pointer-events-auto">
      <div className="relative p-3 rounded-3xl cyber-glass-glow flex flex-col items-center">
        {/* Header */}
        <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-cyan-900/40 text-[11px] font-bold text-cyan-200">
          <div className="flex items-center gap-1.5 truncate">
            <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
            <span className="truncate tracking-wider font-mono text-[10px]">
              {activeSec ? activeSec.name.toUpperCase() : 'CENTRAL CORE SECTOR'}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 text-slate-400 hover:text-cyan-300 cursor-pointer transition-colors"
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => updatePreferences({ showMinimap: false })}
              className="p-1 text-slate-400 hover:text-cyan-300 cursor-pointer transition-colors"
              title="Hide Minimap (M)"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2D Cyber Radar Floor Canvas */}
        <div
          className="relative bg-[#040814] rounded-2xl border border-cyan-900/50 overflow-hidden shadow-inner"
          style={{ width: mapWidth, height: mapHeight }}
        >
          {/* Subtle cyber radar grid lines */}
          <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 divide-x divide-y divide-cyan-500/10 pointer-events-none" />

          {/* Central obsidian glass runner with cyan guide stripes */}
          <div
            className="absolute bg-cyan-950/40 border-x border-cyan-500/30 pointer-events-none"
            style={{
              left: `${((0 - 2.5 + 45) / 90) * mapWidth}px`,
              width: `${(5 / 90) * mapWidth}px`,
              top: '0px',
              bottom: '0px',
            }}
          />

          {/* Section Wings & Pins with Glowing Holographic Badges */}
          {sections.map((sec) => {
            const { x, y } = worldToMap(sec.anchorPosition[0], sec.anchorPosition[2]);
            const isCurrent = activeChunk === sec.id;

            return (
              <div
                key={sec.id}
                onClick={() => teleportToSection(sec.id)}
                title={`Click to warp: ${sec.name}`}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
                style={{ left: `${x}px`, top: `${y}px` }}
              >
                <div
                  className={`rounded-full flex items-center justify-center font-bold transition-all ${
                    isCurrent
                      ? 'ring-2 ring-cyan-300 ring-offset-1 ring-offset-black scale-125 shadow-[0_0_12px_rgba(6,182,212,0.8)]'
                      : 'hover:scale-125 opacity-85 hover:opacity-100 shadow-md'
                  }`}
                  style={{
                    width: isExpanded ? '20px' : '16px',
                    height: isExpanded ? '20px' : '16px',
                    backgroundColor: sec.color,
                    color: '#ffffff',
                    fontSize: isExpanded ? '10px' : '8px',
                    border: '1px solid rgba(255,255,255,0.4)',
                  }}
                >
                  {sec.icon}
                </div>

                <span className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 bottom-full mb-1 px-2 py-0.5 rounded-md bg-[#050B17] border border-cyan-500/50 text-[9px] font-mono whitespace-nowrap text-cyan-200 z-30 shadow-2xl">
                  {sec.name}
                </span>
              </div>
            );
          })}

          {/* Player Position Blip & Direction FOV Laser Cone */}
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
            style={{ left: `${playerPos.x}px`, top: `${playerPos.y}px` }}
          >
            {/* Heading Laser Cone */}
            <div
              className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[12px] border-b-cyan-400 opacity-90 drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]"
              style={{
                transform: `rotate(${-playerRotationY}rad)`,
                transformOrigin: '50% 100%',
              }}
            />
            {/* Center Player Dot with Cyber Glow */}
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 border border-white shadow-[0_0_10px_rgba(6,182,212,1)] -mt-1 mx-auto" />
          </div>
        </div>

        {/* Legend */}
        <div className="w-full flex items-center justify-between pt-2 text-[10px] text-slate-400">
          <span className="flex items-center gap-1.5 font-medium text-cyan-300 font-mono text-[9px]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_rgba(6,182,212,0.8)]" /> User Beacon
          </span>
          <span className="text-slate-500 font-mono text-[9px]">Click node to warp</span>
        </div>
      </div>
    </div>
  );
};
