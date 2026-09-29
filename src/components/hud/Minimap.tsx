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
    const mapY = ((-z + 30) / 90) * mapHeight;
    return { x: mapX, y: mapY };
  };

  const playerPos = worldToMap(playerLocation[0], playerLocation[2]);
  const activeSec = sections.find((s) => s.id === activeChunk);

  return (
    <div className="fixed bottom-6 right-6 z-40 pointer-events-auto">
      <div className="relative p-3 rounded-3xl bg-stone-900/95 backdrop-blur-xl border border-amber-600/30 shadow-2xl flex flex-col items-center">
        {/* Header */}
        <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-stone-800 text-[11px] font-bold text-amber-100">
          <div className="flex items-center gap-1.5 truncate">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span className="truncate">
              {activeSec ? activeSec.name.toUpperCase() : 'GRAND CENTRAL NAVE'}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 text-stone-400 hover:text-white cursor-pointer"
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => updatePreferences({ showMinimap: false })}
              className="p-1 text-stone-400 hover:text-white cursor-pointer"
              title="Hide Minimap (M)"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2D Schematic Floor Canvas (Warm Architectural Parchment Tone) */}
        <div
          className="relative bg-[#2D1F17] rounded-2xl border border-stone-800 overflow-hidden"
          style={{ width: mapWidth, height: mapHeight }}
        >
          {/* Subtle architectural grid lines */}
          <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 divide-x divide-y divide-amber-900/20 pointer-events-none" />

          {/* Burgundy Carpet Runner in Center Aisle */}
          <div
            className="absolute bg-red-900/50 border-x border-amber-600/40 pointer-events-none"
            style={{
              left: `${((0 - 2.5 + 45) / 90) * mapWidth}px`,
              width: `${(5 / 90) * mapWidth}px`,
              top: '0px',
              bottom: '0px',
            }}
          />

          {/* Section Wings & Pins with Colorful Badges */}
          {sections.map((sec) => {
            const { x, y } = worldToMap(sec.anchorPosition[0], sec.anchorPosition[2]);
            const isCurrent = activeChunk === sec.id;

            return (
              <div
                key={sec.id}
                onClick={() => teleportToSection(sec.id)}
                title={`Click to travel: ${sec.name}`}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
                style={{ left: `${x}px`, top: `${y}px` }}
              >
                <div
                  className={`rounded-full flex items-center justify-center font-bold transition-all shadow-md ${
                    isCurrent ? 'ring-2 ring-amber-300 scale-125' : 'hover:scale-125'
                  }`}
                  style={{
                    width: isExpanded ? '20px' : '16px',
                    height: isExpanded ? '20px' : '16px',
                    backgroundColor: sec.color,
                    color: '#ffffff',
                    fontSize: isExpanded ? '10px' : '8px',
                  }}
                >
                  {sec.icon}
                </div>

                <span className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 bottom-full mb-1 px-1.5 py-0.5 rounded-md bg-stone-900 border border-stone-700 text-[9px] font-mono whitespace-nowrap text-amber-200 z-30 shadow-xl">
                  {sec.name}
                </span>
              </div>
            );
          })}

          {/* Player Position Blip & Direction FOV Cone */}
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
            style={{ left: `${playerPos.x}px`, top: `${playerPos.y}px` }}
          >
            {/* Heading Cone */}
            <div
              className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[12px] border-b-amber-400 opacity-90"
              style={{
                transform: `rotate(${playerRotationY + Math.PI}rad)`,
                transformOrigin: '50% 100%',
              }}
            />
            {/* Center Player Dot */}
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-white shadow-lg shadow-amber-400/90 -mt-1 mx-auto" />
          </div>
        </div>

        {/* Legend */}
        <div className="w-full flex items-center justify-between pt-2 text-[10px] text-stone-400">
          <span className="flex items-center gap-1 font-medium text-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> You
          </span>
          <span className="text-stone-400 font-mono text-[9px]">Click pin to travel</span>
        </div>
      </div>
    </div>
  );
};
