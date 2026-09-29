import { Resource, Section, PhysicalLocation, WingType } from '../types/library';

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
  centerPosition: [number, number, number];
}

export interface PlacementResult {
  placedResources: Resource[];
  shelves: ShelfInfo[];
  sectionPlacements: Map<string, SectionPlacement>;
}

// Priority tier mapping:
// Tier 0 (Top Shelf): MUST_LEARN, CURRENT_FOCUS
// Tier 1 (Middle Shelf): IMPORTANT, NORMAL
// Tier 2 (Bottom Shelf): LOW
export function getPriorityTier(priority: string): number {
  switch (priority) {
    case 'MUST_LEARN':
    case 'CURRENT_FOCUS':
      return 0; // Top shelf (Eye level)
    case 'IMPORTANT':
    case 'NORMAL':
      return 1; // Middle shelf
    case 'LOW':
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
  // Handbooks Wing (Dedicated rich Amber / Terracotta / Copper)
  'sec-handbooks': ['#c2410c', '#b45309', '#d97706', '#9a3412', '#78350f', '#ea580c'],
  handbooks: ['#c2410c', '#b45309', '#d97706', '#9a3412', '#78350f', '#ea580c'],

  // Python & Data Science Wings
  python: ['#2563eb', '#1d4ed8', '#0284c7', '#0369a1', '#1e40af', '#3b82f6'],
  'sec-python': ['#2563eb', '#1d4ed8', '#0284c7', '#0369a1', '#1e40af', '#3b82f6'],

  'data-science': ['#0891b2', '#06b6d4', '#0284c7', '#0e7490', '#155e75', '#0f766e'],
  'sec-data-science': ['#0891b2', '#06b6d4', '#0284c7', '#0e7490', '#155e75', '#0f766e'],

  interviews: ['#ea580c', '#c2410c', '#d97706', '#b45309', '#e11d48', '#be123c'],
  'sec-interviews': ['#ea580c', '#c2410c', '#d97706', '#b45309', '#e11d48', '#be123c'],

  projects: ['#7c3aed', '#6d28d9', '#8b5cf6', '#4f46e5', '#4338ca', '#3730a3'],
  'sec-projects': ['#7c3aed', '#6d28d9', '#8b5cf6', '#4f46e5', '#4338ca', '#3730a3'],

  // Technical Wings
  'sec-java': ['#1d4ed8', '#1e40af', '#2563eb', '#3b82f6', '#1e3a8a', '#0369a1'],
  java: ['#1d4ed8', '#1e40af', '#2563eb', '#3b82f6', '#1e3a8a', '#0369a1'],

  'sec-dsa': ['#6d28d9', '#7c3aed', '#8b5cf6', '#5b21b6', '#4c1d95', '#a855f7'],
  dsa: ['#6d28d9', '#7c3aed', '#8b5cf6', '#5b21b6', '#4c1d95', '#a855f7'],

  'sec-system-design': ['#c2410c', '#ea580c', '#f97316', '#fb923c', '#9a3412', '#b45309'],
  'system-design': ['#c2410c', '#ea580c', '#f97316', '#fb923c', '#9a3412', '#b45309'],

  'sec-spring': ['#047857', '#059669', '#10b981', '#34d399', '#065f46', '#0f766e'],
  'spring-boot': ['#047857', '#059669', '#10b981', '#34d399', '#065f46', '#0f766e'],

  'sec-databases': ['#0e7490', '#0891b2', '#06b6d4', '#22d3ee', '#155e75', '#164e63'],
  databases: ['#0e7490', '#0891b2', '#06b6d4', '#22d3ee', '#155e75', '#164e63'],

  'sec-ai-ml': ['#0891b2', '#06b6d4', '#0284c7', '#0369a1', '#2563eb', '#1d4ed8'],
  'ai-ml': ['#0891b2', '#06b6d4', '#0284c7', '#0369a1', '#2563eb', '#1d4ed8'],

  'sec-cloud-devops': ['#b45309', '#d97706', '#ea580c', '#c2410c', '#0d9488', '#0f766e'],
  cloud: ['#b45309', '#d97706', '#f59e0b', '#fbbf24', '#78350f', '#ca8a04'],
  devops: ['#0f766e', '#0d9488', '#14b8a6', '#2dd4bf', '#115e59', '#042f2e'],

  // Humanities & Non-Technical Wings
  'sec-devotional': ['#b45309', '#d97706', '#f59e0b', '#78350f', '#92400e', '#ca8a04'],
  devotional: ['#b45309', '#d97706', '#f59e0b', '#78350f', '#92400e', '#ca8a04'],

  'sec-english-language': ['#0284c7', '#0369a1', '#0ea5e9', '#38bdf8', '#1e40af', '#1d4ed8'],
  english: ['#0284c7', '#0369a1', '#0ea5e9', '#38bdf8', '#1e40af', '#1d4ed8'],

  'sec-novels-literature': ['#7e22ce', '#9333ea', '#a855f7', '#6b21a8', '#86198f', '#be185d'],
  novels: ['#7e22ce', '#9333ea', '#a855f7', '#6b21a8', '#86198f', '#be185d'],

  // Special Collections
  'must-learn': ['#b45309', '#d97706', '#f59e0b', '#eab308', '#ca8a04', '#92400e'],
  'current-focus': ['#b91c1c', '#dc2626', '#ef4444', '#ea580c', '#c2410c', '#991b1b'],
};

export function getCuratedBookColor(category: string, priority: string, seed: number): string {
  if (priority === 'MUST_LEARN') {
    return '#d97706'; // Rich regal gold
  }
  if (priority === 'CURRENT_FOCUS') {
    return '#dc2626'; // Vibrant flame ruby
  }
  const cleanCat = category.toLowerCase().replace(/^sec-/, '');
  const palette = COLOR_PALETTES[category] || COLOR_PALETTES[cleanCat] || [
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

/**
 * Dynamically assign anchor positions to sections based on wing and count
 * to prevent physical collisions as new sections are created (Rule 36, 37, 39, 76)
 */
function resolveDynamicSectionAnchors(sections: Section[]): Map<string, [number, number, number]> {
  const anchors = new Map<string, [number, number, number]>();

  // Pre-configured primary anchor slots per wing
  const wingSlots: Record<WingType, [number, number, number][]> = {
    // West Wing: Technical / Programming (x < 0)
    west: [
      [-17, 0, 8],
      [-17, 0, -8],
      [-17, 0, -24],
      [-26, 0, 8],
      [-26, 0, -8],
      [-26, 0, -24],
    ],
    // East Wing: Databases / Cloud / DevOps / AI (x > 0)
    east: [
      [17, 0, 8],
      [17, 0, -8],
      [17, 0, -24],
      [26, 0, 8],
      [26, 0, -8],
      [26, 0, -24],
    ],
    // Central Grand Hall
    central: [
      [-5.5, 0, -10],
      [5.5, 0, -10],
      [-5.5, 0, -26],
      [5.5, 0, -26],
    ],
    // Handbooks Pavilion (Rule 4: Dedicated Major Wing)
    handbooks: [
      [17, 0, 20],
      [26, 0, 20],
      [17, 0, 28],
    ],
    // North Wing / Humanities: Literature, Devotional, English
    north: [
      [-12, 0, -42],
      [0, 0, -42],
      [12, 0, -42],
      [-12, 0, -52],
      [12, 0, -52],
    ],
    humanities: [
      [-12, 0, -42],
      [0, 0, -42],
      [12, 0, -42],
    ],
    south: [
      [-10, 0, 24],
      [10, 0, 24],
    ],
  };

  const wingCounts: Record<string, number> = {};

  sections.forEach((sec) => {
    // If the section already has a non-zero anchor and is one of the initial anchors, we can preserve it
    const hasExistingAnchor =
      sec.anchorPosition &&
      (Math.abs(sec.anchorPosition[0]) > 0.1 || Math.abs(sec.anchorPosition[2]) > 0.1);

    if (hasExistingAnchor) {
      anchors.set(sec.id, sec.anchorPosition);
      return;
    }

    const wing = sec.wing || (sec.isHandbookSection ? 'handbooks' : 'central');
    const slotList = wingSlots[wing] || wingSlots.central;
    const currentIdx = wingCounts[wing] || 0;
    wingCounts[wing] = currentIdx + 1;

    if (currentIdx < slotList.length) {
      anchors.set(sec.id, slotList[currentIdx]);
    } else {
      // Gracefully generate next offset position in that wing
      const base = slotList[slotList.length - 1];
      const extraOffsetZ = (currentIdx - slotList.length + 1) * -12;
      anchors.set(sec.id, [base[0], base[1], base[2] + extraOffsetZ]);
    }
  });

  return anchors;
}

export function computeLibraryPlacements(
  sections: Section[],
  resources: Resource[]
): PlacementResult {
  const sectionMap = new Map<string, Section>();
  sections.forEach((s) => sectionMap.set(s.id, s));

  const resolvedAnchors = resolveDynamicSectionAnchors(sections);

  // Group resources by section
  const resourcesBySection = new Map<string, Resource[]>();
  sections.forEach((s) => resourcesBySection.set(s.id, []));

  resources.forEach((res) => {
    // Rule 4: Handbooks strictly go to handbooks section if available
    let matchedSec: Section | undefined;
    if (res.resourceType === 'HANDBOOK') {
      matchedSec = sections.find((s) => s.isHandbookSection || s.id === 'sec-handbooks');
    }

    if (!matchedSec) {
      matchedSec = sections.find(
        (s) => s.id === res.category || s.name.toLowerCase() === res.category.toLowerCase()
      );
    }

    if (!matchedSec) {
      // Find by topic or keyword
      matchedSec = sections.find((s) => s.subSections.includes(res.subCategory));
    }

    if (!matchedSec && sections.length > 0) {
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
  // Row heights relative to shelf base: [Top, Middle, Bottom]
  const ROW_Y_OFFSETS = [1.88, 1.14, 0.40];
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

    // Dynamic Shelf Scaling (Rule 39, 76, 77)
    const maxBooksInAnyTier = Math.max(tier0.length, tier1.length, tier2.length, 1);
    const booksPerShelfRow = 14;
    const shelvesNeededPerSide = Math.max(1, Math.ceil(maxBooksInAnyTier / booksPerShelfRow));
    const totalShelvesForSection = shelvesNeededPerSide * 2;

    const sectionShelves: ShelfInfo[] = [];
    const [secX, secY, secZ] = resolvedAnchors.get(section.id) || section.anchorPosition || [0, 0, 0];
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

        // Realistic subtle physical imperfections
        const isTilted = rnd2 > 0.82;
        const tiltZ = isTilted ? (rnd2 - 0.82) * 0.6 : 0;
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
        currentXOnShelf += bookThickness + (0.02 + rnd * 0.025);
      });
    });

    sectionPlacements.set(section.id, {
      section: {
        ...section,
        anchorPosition: [secX, secY, secZ],
      },
      shelves: sectionShelves,
      resources: allPlacedResources.filter((r) => r.location?.sectionId === section.id),
      centerPosition: [secX, secY, secZ],
    });
  });

  return {
    placedResources: allPlacedResources,
    shelves: allShelves,
    sectionPlacements,
  };
}
