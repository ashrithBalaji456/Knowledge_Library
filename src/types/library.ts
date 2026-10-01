export type ResourceType =
  | 'BOOK'
  | 'HANDBOOK'
  | 'REFERENCE'
  | 'TEXTBOOK'
  | 'COURSE_MATERIAL'
  | 'STUDY_NOTES'
  | 'CHEAT_SHEET'
  | 'INTERVIEW_GUIDE'
  | 'DOCUMENTATION'
  | 'NOVEL'
  | 'DEVOTIONAL'
  | 'PAPER'
  | 'TUTORIAL'
  | 'PRACTICE_MATERIAL'
  | 'PDF'
  | 'GITHUB'
  | 'GOOGLE_DRIVE'
  | 'WEBSITE'
  | 'VIDEO'
  | 'ARTICLE'
  | 'COURSE'
  | 'AUDIO'
  | 'NOTE'
  | 'OTHER';

export type Priority =
  | 'CURRENT_FOCUS'
  | 'MUST_LEARN'
  | 'IMPORTANT'
  | 'NORMAL'
  | 'LOW';

export type ResourceStatus =
  | 'NOT_STARTED'
  | 'READING'
  | 'COMPLETED'
  | 'PAUSED'
  | 'WANT_TO_READ'
  | 'REFERENCE_ONLY'
  | 'ABANDONED';

export type Difficulty =
  | 'BEGINNER'
  | 'INTERMEDIATE'
  | 'ADVANCED'
  | 'EXPERT';

export type RelationshipType =
  | 'PREREQUISITE'
  | 'NEXT'
  | 'RELATED'
  | 'DEEPER_DIVE'
  | 'ALTERNATIVE'
  | 'REFERENCE'
  | 'INTERVIEW'
  | 'PRACTICAL'
  | 'ADVANCED'
  | 'BEGINNER_FRIENDLY'
  | 'COMPLEMENTARY'
  | 'BUILDS_ON'
  | 'COMPLEMENTS';

export type AtmosphereMode = 'day' | 'evening' | 'night';

export type WingType = 'central' | 'west' | 'east' | 'north' | 'south' | 'handbooks' | 'humanities';

export interface PhysicalLocation {
  sectionId: string;
  sectionName: string;
  subSection: string;
  shelfId: string;
  shelfIndex: number;
  shelfNumber: number;
  rowNumber: number; // 0: Top, 1: Middle, 2: Lower
  rowLabel?: string; // Explicit language or sub-category label on that row
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

export interface ClassificationConfidence {
  categoryConfidence: number; // 0 to 100
  subcategoryConfidence: number; // 0 to 100
  needsReview: boolean;
  reason: string;
  matchedKeywords: string[];
  aiGenerated: boolean;
  sourceTrace?: {
    extractedTitle?: string;
    extractedAuthor?: string;
    extractedPages?: number;
    extractedTocSample?: string[];
  };
}

export interface Resource {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  authors?: string[];
  publisher?: string;
  publicationYear?: string | number;
  isbn?: string;
  language?: string;
  pages?: number;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  fileHash?: string;
  source: 'uploaded_pdf' | 'zip_import' | 'google_drive' | 'github' | 'url' | 'sample';
  sourceUrl?: string;
  fileDataUrl?: string; // base64 or blob URL for direct in-browser reading

  // Taxonomy
  category: string; // Primary category / section ID
  subCategory: string; // Subcategory / subsection
  resourceType: ResourceType;
  difficulty: Difficulty;
  topics: string[];
  tags: string[];

  // Intelligent Decision Aid
  whatIsThisBookFor: string; // "What is this book for?" (concise decision statement)
  summary: string; // Concise summary
  keyTakeaways: string[]; // 5-10 specific bullet points
  prerequisites: string[]; // What you should know before reading
  recommendedNext: string[]; // What to read next

  // User Engagement & Tracking
  personalRating?: number; // 0 to 5 (supports 0.5 increments)
  personalReview?: string; // "What did I think about this book?"
  personalNotes?: string;
  readingStatus: ResourceStatus;
  progress: number; // 0 to 100
  currentPage?: number;
  totalPages?: number;
  dateAdded?: string;
  lastOpened?: string;
  isFavorite?: boolean;
  priority: Priority;
  notes?: string[];
  bookmarks?: number[];
  contentSample?: string[];

  // Legacy & Compatibility Aliases
  type?: ResourceType;
  status?: ResourceStatus;
  description?: string;
  url?: string;
  isCurrentFocus?: boolean;

  // Confidence & Verification
  confidence?: ClassificationConfidence;

  // 3D Physical Placement
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
  wing: WingType;
  anchorPosition: [number, number, number];
  rotationY?: number;
  isHandbookSection?: boolean;
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
  totalHandbooks: number;
  totalSections: number;
  totalSubcategories: number;
  readingCount: number;
  inProgressCount?: number;
  completedCount: number;
  mustLearnCount: number;
  currentFocusCount: number;
  favoriteCount: number;
  averageRating: number;
  totalPages: number;
  overallProgress: number;
}

export interface DuplicateDetectionResult {
  isDuplicate: boolean;
  matchedResource?: Resource;
  matchReason?: string;
  similarity: number;
}

export interface ImportReport {
  added: Resource[];
  duplicates: {
    file: string;
    existing: Resource;
    newResource: Resource;
    action: 'replace' | 'keep_existing' | 'keep_both';
  }[];
  needsReview: Resource[];
  failed: { fileName: string; error: string }[];
  newSectionsCreated: string[];
  newSubsectionsCreated: string[];
  relationshipsCreated: number;
  learningPathsUpdated: number;
}
