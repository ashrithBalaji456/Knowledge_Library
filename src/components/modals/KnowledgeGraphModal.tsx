import React, { useState, useMemo } from 'react';
import { useLibraryStore } from '../../store/useLibraryStore';
import { X, Network, Search, MapPin, ExternalLink, ArrowRight } from 'lucide-react';

export const KnowledgeGraphModal: React.FC = () => {
  const resources = useLibraryStore((s) => s.resources);
  const relationships = useLibraryStore((s) => s.relationships);
  const sections = useLibraryStore((s) => s.sections);
  const closeModal = useLibraryStore((s) => s.closeModal);
  const selectResource = useLibraryStore((s) => s.selectResource);
  const locateBook = useLibraryStore((s) => s.locateBook);

  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  // Filter resources based on search and category
  const filteredResources = useMemo(() => {
    return resources.filter((r) => {
      const matchCat = selectedCategory === 'all' || r.category === selectedCategory;
      const matchSearch =
        !searchFilter ||
        r.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
        r.tags.some((t) => t.toLowerCase().includes(searchFilter.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [resources, selectedCategory, searchFilter]);

  // Generate 2D graph layout coordinates dynamically grouped by category
  const nodeLayout = useMemo(() => {
    const layout = new Map<string, { x: number; y: number; resource: typeof resources[0] }>();
    const categoryClusters: { [cat: string]: typeof resources } = {};

    filteredResources.forEach((r) => {
      if (!categoryClusters[r.category]) categoryClusters[r.category] = [];
      categoryClusters[r.category].push(r);
    });

    const categories = Object.keys(categoryClusters);
    const width = 900;
    const height = 550;
    const centerX = width / 2;
    const centerY = height / 2;

    categories.forEach((cat, catIdx) => {
      const clusterAngle = (catIdx / categories.length) * Math.PI * 2;
      const clusterRadius = 180;
      const clusterCenterX = centerX + Math.cos(clusterAngle) * clusterRadius;
      const clusterCenterY = centerY + Math.sin(clusterAngle) * clusterRadius;

      const items = categoryClusters[cat];
      items.forEach((item, itemIdx) => {
        const itemAngle = (itemIdx / items.length) * Math.PI * 2;
        const itemRadius = 55 + (itemIdx % 2) * 25;
        const x = clusterCenterX + Math.cos(itemAngle) * itemRadius;
        const y = clusterCenterY + Math.sin(itemAngle) * itemRadius;
        layout.set(item.id, { x, y, resource: item });
      });
    });

    return layout;
  }, [filteredResources]);

  const activeNode = activeNodeId ? resources.find((r) => r.id === activeNodeId) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030712]/80 backdrop-blur-xl pointer-events-auto">
      <div className="relative w-full max-w-5xl h-[85vh] rounded-3xl cyber-glass-dense border border-cyan-500/30 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-cyan-900/40 flex items-center justify-between gap-4 bg-[#040814]/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">
                NEURAL TOPOLOGY // KNOWLEDGE GRAPH
              </div>
              <h2 className="text-base font-bold text-slate-100 font-['Outfit']">
                KNOWLEDGE RELATIONSHIPS CONSTELLATION
              </h2>
              <p className="text-xs text-slate-400 font-light">
                Explore concept dependencies, architectural prerequisites, and inter-domain links
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

        {/* Toolbar: Category pills & search */}
        <div className="px-6 py-3 border-b border-cyan-900/30 bg-[#040814]/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto max-w-xl pb-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                selectedCategory === 'all'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                  : 'bg-slate-900/80 text-slate-400 hover:bg-slate-850 border border-slate-800'
              }`}
            >
              All Sectors
            </button>
            {sections.slice(0, 6).map((sec) => (
              <button
                key={sec.id}
                onClick={() => setSelectedCategory(sec.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer whitespace-nowrap transition-all ${
                  selectedCategory === sec.id
                    ? 'bg-violet-600 text-white font-semibold shadow-[0_0_12px_rgba(139,92,246,0.6)]'
                    : 'bg-slate-900/80 text-slate-400 hover:bg-slate-850 border border-slate-800'
                }`}
              >
                {sec.icon} {sec.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search graph nodes..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900/80 border border-cyan-900/50 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>
        </div>

        {/* SVG Graph Viewport */}
        <div className="flex-1 relative overflow-hidden bg-[#030612] flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 900 550">
            <defs>
              <marker
                id="arrowhead"
                markerWidth="8"
                markerHeight="6"
                refX="14"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#06B6D4" />
              </marker>
            </defs>

            {/* Connecting Relationship Edges */}
            {relationships.map((rel) => {
              const sourceNode = nodeLayout.get(rel.sourceId);
              const targetNode = nodeLayout.get(rel.targetId);
              if (!sourceNode || !targetNode) return null;

              const isHighlighted =
                activeNodeId === rel.sourceId || activeNodeId === rel.targetId;

              return (
                <g key={rel.id}>
                  <line
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke={isHighlighted ? '#06B6D4' : '#1e293b'}
                    strokeWidth={isHighlighted ? 2.5 : 1.2}
                    strokeDasharray={rel.type === 'PREREQUISITE' ? '4 3' : undefined}
                    markerEnd="url(#arrowhead)"
                    opacity={isHighlighted ? 1 : 0.65}
                  />
                </g>
              );
            })}

            {/* Nodes */}
            {Array.from(nodeLayout.entries()).map(([id, node]) => {
              const res = node.resource;
              const isActive = activeNodeId === id;
              const isMustLearn = res.priority === 'MUST_LEARN';

              return (
                <g
                  key={id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => setActiveNodeId(id)}
                  className="cursor-pointer group"
                >
                  {/* Outer halo */}
                  <circle
                    r={isActive ? 22 : 16}
                    fill={isMustLearn ? '#06b6d422' : '#3b82f622'}
                    stroke={isActive ? '#06B6D4' : isMustLearn ? '#38BDF8' : '#6366F1'}
                    strokeWidth={isActive ? 3 : 1.5}
                    className="transition-all"
                  />

                  {/* Node icon / dot */}
                  <circle
                    r={isActive ? 8 : 6}
                    fill={isActive ? '#06B6D4' : '#f8fafc'}
                  />

                  {/* Title Label */}
                  <text
                    y={28}
                    textAnchor="middle"
                    fill={isActive ? '#38BDF8' : '#94a3b8'}
                    fontSize={isActive ? '11px' : '9px'}
                    fontWeight={isActive ? 'bold' : 'normal'}
                    className="select-none pointer-events-none font-mono"
                  >
                    {res.title.length > 20 ? res.title.slice(0, 18) + '..' : res.title}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Active Node Detail Card (Flyout inside graph) */}
          {activeNode && (
            <div className="absolute bottom-6 right-6 max-w-sm p-4 rounded-2xl cyber-glass-glow shadow-2xl animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider font-mono">
                  {activeNode.priority} • {activeNode.category}
                </span>
                <button
                  onClick={() => setActiveNodeId(null)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <h4 className="text-sm font-bold text-slate-100 font-['Outfit'] mb-1">
                {activeNode.title}
              </h4>
              <p className="text-xs text-slate-400 line-clamp-2 mb-3 font-light">
                {activeNode.description}
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    closeModal();
                    locateBook(activeNode.id);
                  }}
                  className="flex-1 py-1.5 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-cyan-950/60"
                >
                  <MapPin className="w-3.5 h-3.5" /> Warp in 3D
                </button>

                <button
                  onClick={() => selectResource(activeNode.id)}
                  className="cyber-btn py-1.5 px-3 rounded-xl text-slate-200 text-xs font-semibold cursor-pointer"
                >
                  Inspect
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
