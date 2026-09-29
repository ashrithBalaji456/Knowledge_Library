export type ResourceType =
  | 'PDF'
  | 'BOOK'
  | 'GITHUB'
  | 'GOOGLE_DRIVE'
  | 'WEBSITE'
  | 'VIDEO'
  | 'ARTICLE'
  | 'COURSE'
  | 'NOTE'
  | 'ZIP'
  | 'LINK';

export type Priority =
  | 'MUST_LEARN'
  | 'CURRENT_FOCUS'
  | 'CRITICAL'
  | 'HIGH'
  | 'MEDIUM'
  | 'LOW'
  | 'IMPORTANT'
  | 'NORMAL'
  | 'COMPLETED';

export type ResourceStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'PAUSED'
  | 'ARCHIVED';

export type Difficulty =
  | 'BEGINNER'
  | 'INTERMEDIATE'
  | 'ADVANCED'
  | 'EXPERT';

export type RelationshipType =
  | 'PREREQUISITE'
  | 'RELATED'
  | 'NEXT'
  | 'ADVANCED'
  | 'ALTERNATIVE'
  | 'PRACTICAL'
  | 'INTERVIEW'
  | 'DEEPER_DIVE'
  | 'BUILDS_ON'
  | 'COMPLEMENTS';

export type AtmosphereMode = 'day' | 'evening' | 'night';

export interface PhysicalLocation {
  sectionId: string;
  sectionName: string;
  subSection: string;
  shelfId: string;
  shelfIndex: number;
  shelfNumber: number;
  rowNumber: number; // 0: Top, 1: Middle, 2: Lower
  slotIndex: number;
  position: [number, number, number];
  rotation: [number, number, number];
  dimensions: {
    height: number;
    width: number;
    thickness: number;
  };
  // Imperfections for realism:
  tiltZ: number; // slight leaning tilt (radians)
  pushOffset: number; // pushed slightly in or out
  colorHex: string; // rich curated book color
}

export interface Resource {
  id: string;
  title: string;
  author: string;
  description: string;
  type: ResourceType;
  category: string; // matches Section id or name
  subCategory: string;
  priority: Priority;
  status: ResourceStatus;
  difficulty: Difficulty;
  tags: string[];
  url?: string;
  filePath?: string;
  thumbnail?: string;
  progress: number; // 0 to 100
  currentPage?: number;
  totalPages?: number;
  lastOpened?: string;
  isFavorite?: boolean;
  isCurrentFocus?: boolean;
  stars?: number; // for GitHub
  notes?: string[];
  bookmarks?: number[];
  contentSample?: string[]; // Sample pages for PDF reading
  location?: PhysicalLocation;
}

export interface Section {
  id: string;
  name: string;
  code: string;
  description: string;
  icon: string;
  color: string;
  accentColor: string;
  subSections: string[];
  wing: 'central' | 'west' | 'east' | 'north' | 'south';
  anchorPosition: [number, number, number];
  rotationY?: number;
}

export interface Relationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: RelationshipType;
  reason: string;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  icon: string;
  targetRole: string;
  resourceIds: string[];
}

export interface UserPreferences {
  soundEnabled: boolean;
  soundVolume: number;
  footstepsEnabled: boolean;
  moveSpeed: number;
  lookSensitivity: number;
  showMinimap: boolean;
  showControlsHint: boolean;
  graphicsQuality: 'high' | 'medium' | 'low';
  pointerLock: boolean;
  atmosphere: AtmosphereMode;
  showFpsMonitor: boolean;
}

export interface LibraryStats {
  totalResources: number;
  completedCount: number;
  inProgressCount: number;
  mustLearnCount: number;
  currentFocusCount: number;
  overallProgress: number;
  totalSections: number;
}
