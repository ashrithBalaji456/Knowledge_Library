import { Resource, Section, PhysicalLocation } from '../types/library';

export interface ShelfInfo {
  id: string;
  sectionId: string;
  shelfNumber: number;
  position: [number, number, number];
  rotation: [number, number, number];
  width: number;
  height: number;
  depth: number;
  rowCount: number;
}

export interface SectionPlacement {
  section: Section;
  shelves: ShelfInfo[];
  resources: Resource[];
}

export interface PlacementResult {
  placedResources: Resource[];
  shelves: ShelfInfo[];
  sectionPlacements: Map<string, SectionPlacement>;
}

// Priority tier mapping:
// Tier 0 (Top Shelf): MUST_LEARN, CURRENT_FOCUS, CRITICAL
// Tier 1 (Middle Shelf): HIGH, MEDIUM, IMPORTANT
// Tier 2 (Bottom Shelf): LOW, NORMAL, COMPLETED
export function getPriorityTier(priority: string): number {
  switch (priority) {
    case 'MUST_LEARN':
    case 'CURRENT_FOCUS':
    case 'CRITICAL':
      return 0; // Top shelf (Eye level)
    case 'HIGH':
    case 'MEDIUM':
    case 'IMPORTANT':
      return 1; // Middle shelf
    case 'LOW':
    case 'NORMAL':
    case 'COMPLETED':
    default:
      return 2; // Bottom shelf
  }
}

// Deterministic hash for book dimensions and imperfections
function pseudoRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(Math.sin(hash));
}

// Curated vibrant & realistic palette per domain
const COLOR_PALETTES: Record<string, string[]> = {
  java: ['#1d4ed8', '#1e40af', '#2563eb', '#3b82f6', '#1e3a8a', '#0369a1'],
  dsa: ['#6d28d9', '#7c3aed', '#8b5cf6', '#5b21b6', '#4c1d95', '#a855f7'],
  'system-design': ['#c2410c', '#ea580c', '#f97316', '#fb923c', '#9a3412', '#b45309'],
  'spring-boot': ['#047857', '#059669', '#10b981', '#34d399', '#065f46', '#0f766e'],
  databases: ['#0e7490', '#0891b2', '#06b6d4', '#22d3ee', '#155e75', '#164e63'],
  'ai-ml': ['#be185d', '#db2777', '#ec4899', '#f472b6', '#9d174d', '#831843'],
  cloud: ['#b45309', '#d97706', '#f59e0b', '#fbbf24', '#78350f', '#ca8a04'],
  devops: ['#0f766e', '#0d9488', '#14b8a6', '#2dd4bf', '#115e59', '#042f2e'],
  security: ['#991b1b', '#b91c1c', '#dc2626', '#ef4444', '#7f1d1d', '#881337'],
  'must-learn': ['#b45309', '#d97706', '#f59e0b', '#eab308', '#ca8a04', '#92400e'],
  'current-focus': ['#b91c1c', '#dc2626', '#ef4444', '#ea580c', '#c2410c', '#991b1b'],
  completed: ['#065f46', '#047857', '#059669', '#10b981', '#15803d', '#166534'],
};

export function getCuratedBookColor(category: string, priority: string, seed: number): string {
  if (priority === 'MUST_LEARN') {
    return '#d97706'; // Rich regal gold
  }
  if (priority === 'CURRENT_FOCUS') {
    return '#dc2626'; // Vibrant flame ruby
  }
  const palette = COLOR_PALETTES[category] || [
    '#1e293b',
    '#334155',
    '#475569',
    '#0f172a',
    '#1e3a8a',
    '#1e1b4b',
  ];
  const idx = Math.floor(seed * palette.length) % palette.length;
  return palette[idx];
}

export function computeLibraryPlacements(
  sections: Section[],
  resources: Resource[]
): PlacementResult {
  const sectionMap = new Map<string, Section>();
  sections.forEach((s) => sectionMap.set(s.id, s));

  // Group resources by section
  const resourcesBySection = new Map<string, Resource[]>();
  sections.forEach((s) => resourcesBySection.set(s.id, []));

  resources.forEach((res) => {
    let matchedSec = sections.find(
      (s) => s.id === res.category || s.name.toLowerCase() === res.category.toLowerCase()
    );

    if (!matchedSec && res.priority === 'MUST_LEARN') {
      matchedSec = sectionMap.get('must-learn');
    } else if (!matchedSec && res.priority === 'CURRENT_FOCUS') {
      matchedSec = sectionMap.get('current-focus');
    } else if (!matchedSec) {
      matchedSec = sections[0];
    }

    if (matchedSec) {
      const list = resourcesBySection.get(matchedSec.id) || [];
      list.push(res);
      resourcesBySection.set(matchedSec.id, list);
    }
  });

  const allPlacedResources: Resource[] = [];
  const allShelves: ShelfInfo[] = [];
  const sectionPlacements = new Map<string, SectionPlacement>();

  // Shelf physical constants
  const SHELF_WIDTH = 3.6;
  const SHELF_HEIGHT = 2.6;
  const SHELF_DEPTH = 0.65;
  const ROW_COUNT = 3;
  // Row heights relative to shelf base
  const ROW_Y_OFFSETS = [1.88, 1.14, 0.40]; // [Top, Middle, Bottom]
  const USABLE_WIDTH = 3.2;

  sections.forEach((section) => {
    const sectionRes = resourcesBySection.get(section.id) || [];

    // Separate resources into priority tiers
    const tier0 = sectionRes.filter((r) => getPriorityTier(r.priority) === 0);
    const tier1 = sectionRes.filter((r) => getPriorityTier(r.priority) === 1);
    const tier2 = sectionRes.filter((r) => getPriorityTier(r.priority) === 2);

    tier0.sort((a, b) => b.progress - a.progress);
    tier1.sort((a, b) => a.title.localeCompare(b.title));
    tier2.sort((a, b) => a.title.localeCompare(b.title));

    const maxBooksInAnyTier = Math.max(tier0.length, tier1.length, tier2.length, 1);
    const booksPerShelfRow = 14;
    const shelvesNeededPerSide = Math.max(1, Math.ceil(maxBooksInAnyTier / booksPerShelfRow));
    const totalShelvesForSection = shelvesNeededPerSide * 2;

    const sectionShelves: ShelfInfo[] = [];
    const [secX, secY, secZ] = section.anchorPosition;
    const aisleHalfWidth = 2.2;
    const shelfSpacingZ = 4.2;

    for (let i = 0; i < totalShelvesForSection; i++) {
      const isLeftSide = i % 2 === 0;
      const aisleIndex = Math.floor(i / 2);
      const shelfX = isLeftSide ? secX - aisleHalfWidth : secX + aisleHalfWidth;
      const shelfZ = secZ + (aisleIndex - (shelvesNeededPerSide - 1) / 2) * shelfSpacingZ;
      const rotY = isLeftSide ? Math.PI / 2 : -Math.PI / 2;

      const shelf: ShelfInfo = {
        id: `shelf-${section.id}-${i + 1}`,
        sectionId: section.id,
        shelfNumber: i + 1,
        position: [shelfX, secY, shelfZ],
        rotation: [0, rotY, 0],
        width: SHELF_WIDTH,
        height: SHELF_HEIGHT,
        depth: SHELF_DEPTH,
        rowCount: ROW_COUNT,
      };

      sectionShelves.push(shelf);
      allShelves.push(shelf);
    }

    const tiers = [tier0, tier1, tier2];

    tiers.forEach((tierList, rowIndex) => {
      if (tierList.length === 0) return;

      let currentShelfIdx = 0;
      let currentXOnShelf = -USABLE_WIDTH / 2 + 0.15;

      tierList.forEach((res, itemIdx) => {
        const rnd = pseudoRandom(res.id + res.title);
        const rnd2 = pseudoRandom(res.title + res.id + 'seed2');

        const bookThickness = 0.065 + rnd * 0.045; // 0.065 - 0.11m
        const bookHeight = 0.40 + ((rnd * 13) % 1) * 0.12; // 0.40 - 0.52m
        const bookDepth = 0.28 + ((rnd * 7) % 1) * 0.06; // 0.28 - 0.34m

        // Realistic subtle imperfections:
        // Some books lean slightly (1 out of ~6 books)
        const isTilted = rnd2 > 0.82;
        const tiltZ = isTilted ? (rnd2 - 0.82) * 0.6 : 0; // ~0.05 to 0.1 rad
        // Slight push forward/back variation (1-2 cm)
        const pushOffset = (rnd - 0.5) * 0.03;

        // Curated book color
        const colorHex = getCuratedBookColor(section.id, res.priority, rnd);

        // Check if book fits on current shelf row
        if (currentXOnShelf + bookThickness > USABLE_WIDTH / 2) {
          currentShelfIdx++;
          if (currentShelfIdx >= sectionShelves.length) {
            currentShelfIdx = sectionShelves.length - 1;
          }
          currentXOnShelf = -USABLE_WIDTH / 2 + 0.15;
        }

        const activeShelf = sectionShelves[currentShelfIdx];
        const shelfRotY = activeShelf.rotation[1];
        const isLeft = Math.abs(shelfRotY - Math.PI / 2) < 0.1;

        const localX = currentXOnShelf + bookThickness / 2;
        const localY = ROW_Y_OFFSETS[rowIndex];

        const worldX = activeShelf.position[0];
        const worldY = activeShelf.position[1] + localY;
        const worldZ = isLeft
          ? activeShelf.position[2] - localX
          : activeShelf.position[2] + localX;

        const location: PhysicalLocation = {
          sectionId: section.id,
          sectionName: section.name,
          subSection: res.subCategory || section.subSections[0] || 'General',
          shelfId: activeShelf.id,
          shelfIndex: currentShelfIdx,
          shelfNumber: activeShelf.shelfNumber,
          rowNumber: rowIndex,
          slotIndex: itemIdx,
          position: [worldX, worldY, worldZ],
          rotation: [0, shelfRotY, 0],
          dimensions: {
            height: bookHeight,
            width: bookDepth,
            thickness: bookThickness,
          },
          tiltZ,
          pushOffset,
          colorHex,
        };

        const placedResource: Resource = {
          ...res,
          location,
        };

        allPlacedResources.push(placedResource);
        // Realistic small gap variation between books
        currentXOnShelf += bookThickness + (0.02 + rnd * 0.025);
      });
    });

    sectionPlacements.set(section.id, {
      section,
      shelves: sectionShelves,
      resources: allPlacedResources.filter((r) => r.location?.sectionId === section.id),
    });
  });

  return {
    placedResources: allPlacedResources,
    shelves: allShelves,
    sectionPlacements,
  };
}
