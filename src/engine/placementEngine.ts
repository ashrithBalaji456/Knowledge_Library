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
  rowLabels?: string[]; // Language/topic label for each row
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
  'sec-devotional-motivation': ['#c2410c', '#ea580c', '#d97706', '#9a3412', '#78350f', '#b45309'],
  'sec-devotional-kshetras': ['#b45309', '#ca8a04', '#d97706', '#854d0e', '#713f12', '#eab308'],
  'sec-devotional-sadhana': ['#d97706', '#ea580c', '#b45309', '#9a3412', '#c2410c', '#f59e0b'],

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

export interface RowClassification {
  rowLabels: [string, string, string];
  assignRow: (resource: Resource) => 0 | 1 | 2;
}

export function getSectionRowClassification(section: Section): RowClassification {
  const sid = section.id.toLowerCase();

  if (sid === 'python') {
    return {
      rowLabels: ['PYTHON CORE & SYNTAX', 'PYTHON FOR DATA & WEB', 'ADVANCED PYTHON & 400 EXERCISES'],
      assignRow: (r) => {
        const t = (r.title + ' ' + (r.subCategory || '') + ' ' + (r.tags || []).join(' ')).toLowerCase();
        if (t.includes('exercise') || t.includes('professional') || t.includes('astrophysics') || t.includes('advanced') || (r.pages && r.pages > 300)) {
          return 2;
        }
        if (t.includes('data') || t.includes('pandas') || t.includes('numpy') || t.includes('csv') || t.includes('game') || t.includes('web')) {
          return 1;
        }
        return 0;
      },
    };
  }

  if (sid === 'data-science') {
    return {
      rowLabels: ['DATA WRANGLING & PANDAS / NUMPY', 'R STATISTICAL LANGUAGE & TIDYVERSE', 'PROBABILITY, LINEAR ALGEBRA & STATS'],
      assignRow: (r) => {
        const t = (r.title + ' ' + (r.subCategory || '') + ' ' + (r.tags || []).join(' ')).toLowerCase();
        if (t.includes('r for data') || t.includes('rstats') || t.includes('tidyverse') || t.includes(' r ')) {
          return 1;
        }
        if (t.includes('linear algebra') || t.includes('probability') || t.includes('statistics') || t.includes('math')) {
          return 2;
        }
        return 0;
      },
    };
  }

  if (sid === 'ai-ml') {
    return {
      rowLabels: ['MACHINE LEARNING FOUNDATIONS', 'DEEP LEARNING & NEURAL NETWORKS', 'MIT PRESS: OPTIMIZATION & DECISION'],
      assignRow: (r) => {
        const t = (r.title + ' ' + (r.subCategory || '') + ' ' + (r.tags || []).join(' ')).toLowerCase();
        if (t.includes('decision') || t.includes('optimization') || t.includes('validation') || t.includes('mit press')) {
          return 2;
        }
        if (t.includes('deep learning') || t.includes('neural') || t.includes('nlp') || t.includes('transformer')) {
          return 1;
        }
        return 0;
      },
    };
  }

  if (sid === 'sec-handbooks') {
    return {
      rowLabels: ['PYTHON SYNTAX & QUICK CHEATSHEETS', 'ML FORMULAS & ALGORITHM REFERENCES', 'DATA ANALYSIS, MATPLOTLIB & SEABORN'],
      assignRow: (r) => {
        const t = (r.title + ' ' + (r.subCategory || '') + ' ' + (r.tags || []).join(' ')).toLowerCase();
        if (t.includes('matplotlib') || t.includes('seaborn') || t.includes('eda') || t.includes('data science cheat')) {
          return 2;
        }
        if (t.includes('formula') || t.includes('algorithm') || t.includes('bayes') || t.includes('100days')) {
          return 1;
        }
        return 0;
      },
    };
  }

  if (sid === 'interviews') {
    return {
      rowLabels: ['PYTHON TECHNICAL INTERVIEWS', 'DATA SCIENCE & ML SCREENING QUESTIONS', 'NLP QUESTIONS & CAREER ROADMAPS'],
      assignRow: (r) => {
        const t = (r.title + ' ' + (r.subCategory || '') + ' ' + (r.tags || []).join(' ')).toLowerCase();
        if (t.includes('roadmap') || t.includes('plan') || t.includes('nlp')) {
          return 2;
        }
        if (t.includes('data science') || t.includes('machine learning') || t.includes('ai')) {
          return 1;
        }
        return 0;
      },
    };
  }

  if (sid === 'projects') {
    return {
      rowLabels: ['PREDICTIVE MODELING PROJECTS', '500+ AI/ML PROJECTS & SOURCE CODE', 'MACHINE LEARNING LABS & APPLICATIONS'],
      assignRow: (r) => {
        const t = (r.title + ' ' + (r.subCategory || '') + ' ' + (r.tags || []).join(' ')).toLowerCase();
        if (t.includes('500') || t.includes('source code') || t.includes('repo')) {
          return 1;
        }
        if (t.includes('lab') || t.includes('deploy') || t.includes('application')) {
          return 2;
        }
        return 0;
      },
    };
  }

  if (sid === 'java') {
    return {
      rowLabels: ['JAVA CORE & OOP FOUNDATIONS', 'JAVA & SPRING BOOT ARCHITECTURE', 'JAVA & SPRING BOOT TECHNICAL INTERVIEWS'],
      assignRow: (r) => {
        const t = (r.title + ' ' + (r.subCategory || '') + ' ' + (r.tags || []).join(' ')).toLowerCase();
        if (t.includes('interview') || t.includes('tier') || t.includes('preparation')) {
          return 2;
        }
        if (t.includes('spring') || t.includes('architecture') || t.includes('springboot')) {
          return 1;
        }
        return 0;
      },
    };
  }

  if (sid === 'dsa') {
    return {
      rowLabels: ['LEETCODE 150 & STRIVER FAANG PATTERNS', 'TCS NQT & CAMPUS RECRUITMENT CODING', 'TREES, GRAPHS & DYNAMIC PROGRAMMING'],
      assignRow: (r) => {
        const t = (r.title + ' ' + (r.subCategory || '') + ' ' + (r.tags || []).join(' ')).toLowerCase();
        if (t.includes('tcs') || t.includes('campus') || t.includes('prime') || t.includes('nqt')) {
          return 1;
        }
        if (t.includes('tree') || t.includes('graph') || t.includes('dynamic programming') || t.includes('dp')) {
          return 2;
        }
        return 0;
      },
    };
  }

  if (sid === 'spring-boot' || sid === 'sec-spring') {
    return {
      rowLabels: ['SPRING CORE & DEPENDENCY INJECTION', 'MICROSERVICES ARCHITECTURE & KAFKA', 'LINKEDIN SPRING & SYSTEM DESIGN INTERVIEWS'],
      assignRow: (r) => {
        const t = (r.title + ' ' + (r.subCategory || '') + ' ' + (r.tags || []).join(' ')).toLowerCase();
        if (t.includes('59') || t.includes('linkedin') || t.includes('q & a') || t.includes('q&a') || t.includes('system design')) {
          return 2;
        }
        if (t.includes('micro') || t.includes('kafka') || t.includes('distributed') || t.includes('cloud')) {
          return 1;
        }
        return 0;
      },
    };
  }

  if (sid === 'system-design') {
    return {
      rowLabels: ['TOP 15 SYSTEM DESIGN PATTERNS', 'HLD & HIGH-SCALE ARCHITECTURES', 'LOW-LEVEL DESIGN & SOLID PRINCIPLES'],
      assignRow: (r) => {
        const t = (r.title + ' ' + (r.subCategory || '') + ' ' + (r.tags || []).join(' ')).toLowerCase();
        if (t.includes('pattern') || t.includes('top 15') || t.includes('top15')) {
          return 0;
        }
        if (t.includes('hld') || t.includes('high-scale') || t.includes('scalab') || t.includes('large scale') || t.includes('cloud')) {
          return 1;
        }
        return 2;
      },
    };
  }

  if (sid === 'devops') {
    return {
      rowLabels: ['DOCKER & KUBERNETES CONTAINERS', 'GIT & GITHUB VERSION CONTROL', 'CI/CD PIPELINES & SRE OBSERVABILITY'],
      assignRow: (r) => {
        const t = (r.title + ' ' + (r.subCategory || '') + ' ' + (r.tags || []).join(' ')).toLowerCase();
        if (t.includes('docker') || t.includes('kubernetes') || t.includes('k8s') || t.includes('container')) {
          return 0;
        }
        if (t.includes('git') || t.includes('github') || t.includes('version')) {
          return 1;
        }
        return 2;
      },
    };
  }

  if (sid === 'databases') {
    return {
      rowLabels: ['SQL 14 CORE FUNDAMENTALS & JOINS', 'INDEXING & QUERY PERFORMANCE TUNING', 'NOSQL, REDIS & DISTRIBUTED STORAGE'],
      assignRow: (r) => {
        const t = (r.title + ' ' + (r.subCategory || '') + ' ' + (r.tags || []).join(' ')).toLowerCase();
        if (t.includes('14') || t.includes('fundamental') || t.includes('concept') || t.includes('join') || t.includes('askpavan')) {
          return 0;
        }
        if (t.includes('index') || t.includes('tuning') || t.includes('query') || t.includes('performance')) {
          return 1;
        }
        return 2;
      },
    };
  }

  if (sid === 'ai-ml') {
    return {
      rowLabels: ['MACHINE LEARNING FOUNDATIONS', 'DEEP LEARNING, RAG & VECTOR SEARCH', 'LLM APPLICATION ENGINEERING & AGENTS'],
      assignRow: (r) => {
        const t = (r.title + ' ' + (r.subCategory || '') + ' ' + (r.tags || []).join(' ')).toLowerCase();
        if (t.includes('rag') || t.includes('retrieval') || t.includes('vector') || t.includes('deep') || t.includes('transformer')) {
          return 1;
        }
        if (t.includes('llm') || t.includes('agent') || t.includes('prompt') || t.includes('cline') || t.includes('omniroute')) {
          return 2;
        }
        return 0;
      },
    };
  }

  if (sid === 'sec-devotional' || sid === 'devotional') {
    return {
      rowLabels: ['MAHA PURANAS & SACRED EPICS', 'ADVAITA PHILOSOPHY & LIFE LESSONS', 'YUGA DHARMA & DEVOTIONAL POETRY'],
      assignRow: (r) => {
        const t = (r.title + ' ' + (r.subCategory || '') + ' ' + (r.tags || []).join(' ')).toLowerCase();
        if (t.includes('shiva') || t.includes('panduranga') || t.includes('karthika') || t.includes('purana')) {
          return 0;
        }
        if (t.includes('shankara') || t.includes('advaita') || t.includes('ganga') || t.includes('charitamrutham')) {
          return 1;
        }
        return 2; // Yugadarsanam, STR
      },
    };
  }

  if (sid === 'sec-devotional-motivation') {
    return {
      rowLabels: ['HANUMAN LIFE LESSONS & COURAGE', 'PARASHARA SAMHITA & ESOTERIC WISDOM', 'SRI RAMA RAKSHA & DHARMA IN ACTION'],
      assignRow: (r) => {
        const t = (r.title + ' ' + (r.subCategory || '') + ' ' + (r.tags || []).join(' ')).toLowerCase();
        if (t.includes('srianjaneya') || t.includes('ananda') || t.includes('courage') || t.includes('tales')) {
          return 0;
        }
        if (t.includes('paraashara') || t.includes('samhita') || t.includes('hanumadvishaya')) {
          return 1;
        }
        return 2; // Sri Rama Raksha Vratam
      },
    };
  }

  if (sid === 'sec-devotional-kshetras') {
    return {
      rowLabels: ['108 DIVYA DESAMS (ENGLISH SACRED PILGRIMAGE)', 'TIRUMALA & VENKATESWARA DIVINE CHRONICLES', 'SHAIVA & SHAKTI KSHETRA MAHATYAM'],
      assignRow: (r) => {
        const t = (r.title + ' ' + (r.subCategory || '') + ' ' + (r.tags || []).join(' ')).toLowerCase();
        if (t.includes('108') || t.includes('divya desams') || t.includes('english')) {
          return 0;
        }
        if (t.includes('venkat') || t.includes('srinivasa') || t.includes('padmavathi') || t.includes('darsanam')) {
          return 1;
        }
        return 2; // Kalahasti, Malleshwara, Bapatla
      },
    };
  }

  if (sid === 'sec-devotional-sadhana') {
    return {
      rowLabels: ['VEDIC POOJA, HOMA & DISCIPLINE KALPATARUVU', 'TTD NITYA STOTRAVALI & TULASI MAHATMYAM', 'ASHTA-DEVATA VRATA KALPAM & SARASWATHI'],
      assignRow: (r) => {
        const t = (r.title + ' ' + (r.subCategory || '') + ' ' + (r.tags || []).join(' ')).toLowerCase();
        if (t.includes('kalpataruvu') || t.includes('puuja') || t.includes('homa')) {
          return 0;
        }
        if (t.includes('stothra') || t.includes('stotra') || t.includes('tulasi') || t.includes('ttd') || t.includes('mahalaxmi')) {
          return 1;
        }
        return 2; // Ashta-Devata Vratams (Narasimha, Durga, Maheswara, Subramanya, Krishna, Saraswathi)
      },
    };
  }

  if (sid === 'sec-novels-literature' || sid === 'novels' || sid === 'literature') {
    return {
      rowLabels: ['CLASSIC & TIMELESS LITERATURE', 'MYTHOLOGICAL FANTASY & SCI-FI SAGAS', 'MYSTERY, SUSPENSE & THRILLERS'],
      assignRow: (r) => {
        const t = (r.title + ' ' + (r.subCategory || '') + ' ' + (r.tags || []).join(' ')).toLowerCase();
        if (t.includes('samsara') || t.includes('fantasy') || t.includes('sci-fi') || t.includes('mytholog') || t.includes('gods')) {
          return 1;
        }
        if (t.includes('mystery') || t.includes('thriller') || t.includes('crime') || t.includes('suspense')) {
          return 2;
        }
        return 0; // Classic Literature
      },
    };
  }

  // Fallback for dynamic sections
  const sub = section.subSections || [];
  const label0 = sub[0] ? sub[0].toUpperCase() : 'CORE FOUNDATIONS';
  const label1 = sub[1] ? sub[1].toUpperCase() : 'ARCHITECTURE & PRACTICAL';
  const label2 = sub[2] ? sub[2].toUpperCase() : 'ADVANCED MASTERY & SYSTEMS';

  return {
    rowLabels: [label0, label1, label2],
    assignRow: (r) => {
      if (r.subCategory && sub.length > 0) {
        const idx = sub.findIndex((s) => s.toLowerCase() === r.subCategory.toLowerCase());
        if (idx >= 0) return Math.min(2, idx) as 0 | 1 | 2;
      }
      return getPriorityTier(r.priority) as 0 | 1 | 2;
    },
  };
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

  // Shelf physical constants — ENLARGED & WIDENED CUPBOARDS
  const SHELF_WIDTH = 5.2; // Widened from 3.6 to 5.2 meters for immense presence & room
  const SHELF_HEIGHT = 2.85; // Height increased from 2.6 to 2.85 meters
  const SHELF_DEPTH = 0.72; // Deepened from 0.65 to 0.72 meters
  const ROW_COUNT = 3;
  // Row heights relative to shelf base: [Top (Row 0), Middle (Row 1), Bottom (Row 2)]
  const ROW_Y_OFFSETS = [2.065, 1.245, 0.425];
  const USABLE_WIDTH = 4.8;

  sections.forEach((section) => {
    const sectionRes = resourcesBySection.get(section.id) || [];
    const rowClassification = getSectionRowClassification(section);

    // Group resources into language-wise and topic-wise rows
    const row0: Resource[] = [];
    const row1: Resource[] = [];
    const row2: Resource[] = [];

    sectionRes.forEach((res) => {
      const targetRow = rowClassification.assignRow(res);
      if (targetRow === 0) row0.push(res);
      else if (targetRow === 1) row1.push(res);
      else row2.push(res);
    });

    const sortBooks = (a: Resource, b: Resource) => {
      // 1. Must Learn & Current Focus first
      const pA = a.priority === 'MUST_LEARN' ? 2 : a.priority === 'CURRENT_FOCUS' ? 1 : 0;
      const pB = b.priority === 'MUST_LEARN' ? 2 : b.priority === 'CURRENT_FOCUS' ? 1 : 0;
      if (pB !== pA) return pB - pA;
      // 2. Alphabetical by title
      return a.title.localeCompare(b.title);
    };

    row0.sort(sortBooks);
    row1.sort(sortBooks);
    row2.sort(sortBooks);

    // Dynamic Shelf Scaling: Up to 15 books per shelf row fit comfortably across 4.8m usable width
    const MAX_BOOKS_PER_SHELF_ROW = 15;
    const maxBooksInAnyRow = Math.max(row0.length, row1.length, row2.length, 1);
    const shelvesNeeded = Math.max(1, Math.ceil(maxBooksInAnyRow / MAX_BOOKS_PER_SHELF_ROW));
    const totalShelvesForSection = Math.max(2, shelvesNeeded * 2);

    const sectionShelves: ShelfInfo[] = [];
    const [secX, secY, secZ] = resolvedAnchors.get(section.id) || section.anchorPosition || [0, 0, 0];
    const aisleHalfWidth = 2.6;
    const shelfSpacingZ = 5.8;

    for (let i = 0; i < totalShelvesForSection; i++) {
      const isLeftSide = i % 2 === 0;
      const aisleIndex = Math.floor(i / 2);
      const shelfX = isLeftSide ? secX - aisleHalfWidth : secX + aisleHalfWidth;
      const shelfZ = secZ + (aisleIndex - (shelvesNeeded - 1) / 2) * shelfSpacingZ;
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
        rowLabels: rowClassification.rowLabels,
      };

      sectionShelves.push(shelf);
      allShelves.push(shelf);
    }

    const rows = [row0, row1, row2];

    rows.forEach((rowList, rowIndex) => {
      if (rowList.length === 0) return;

      // Primary cupboard (shelf 0) takes all books up to MAX_BOOKS_PER_SHELF_ROW (15 books).
      // Overflow only goes to subsequent cupboards if a category exceeds 15 books in that row.
      // This guarantees 100% of books in the section are present on the front cupboard!
      const shelfChunks: Resource[][] = Array.from({ length: sectionShelves.length }, () => []);

      rowList.forEach((res, itemIdx) => {
        const targetShelfIdx = Math.min(Math.floor(itemIdx / MAX_BOOKS_PER_SHELF_ROW), sectionShelves.length - 1);
        shelfChunks[targetShelfIdx].push(res);
      });

      shelfChunks.forEach((shelfBooks, currentShelfIdx) => {
        const count = shelfBooks.length;
        if (count === 0) return;

        const activeShelf = sectionShelves[currentShelfIdx];
        const shelfRotY = activeShelf.rotation[1];
        const isLeft = Math.abs(shelfRotY - Math.PI / 2) < 0.1;
        const localY = ROW_Y_OFFSETS[rowIndex];

        // Gallery-quality centered positioning: generous spacing, ZERO depth stacking, ZERO occlusion
        const maxSpacing = 0.48; // 48cm between centers (leaves 21cm gap for 27cm book cover)
        const minSpacing = 0.32; // 32cm between centers (leaves 5cm gap for 27cm book cover)
        const availableSpan = Math.min(USABLE_WIDTH - 0.3, count > 1 ? (count - 1) * maxSpacing : 0);
        const spacing = count > 1 ? Math.max(minSpacing, availableSpan / (count - 1)) : 0;
        const totalSpan = (count - 1) * spacing;
        const startX = -totalSpan / 2;

        shelfBooks.forEach((res, idxOnShelf) => {
          const rnd = pseudoRandom(res.id + res.title);
          const rnd2 = pseudoRandom(res.title + res.id + 'seed2');

          // Clean, readable, harmonious proportions
          const bookThickness = 0.072 + (rnd * 0.016); // 0.072m - 0.088m
          const bookHeight = 0.44 + ((rnd2 * 11) % 1) * 0.04; // 0.44m - 0.48m
          const bookDepth = 0.27; // Uniform 27cm display width along shelf

          // Set pushOffset to 0 so ALL books align to the exact same baseline depth
          const pushOffset = 0;
          const tiltZ = 0; // Upright, crisp presentation

          const colorHex = getCuratedBookColor(section.id, res.priority, rnd);

          const localX = count === 1 ? 0 : startX + idxOnShelf * spacing;

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
            rowLabel: rowClassification.rowLabels[rowIndex],
            slotIndex: idxOnShelf,
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
        });
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
