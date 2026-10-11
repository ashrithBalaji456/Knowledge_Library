import { create } from 'zustand';
import {
  Resource,
  Section,
  Relationship,
  LearningPath,
  UserPreferences,
  LibraryStats,
  AtmosphereMode,
  ImportReport,
} from '../types/library';
import { INITIAL_SECTIONS } from '../data/initialSections';
import { INITIAL_RESOURCES } from '../data/initialResources';
import { PYTHON_TO_ML_RESOURCES } from '../data/pythonMlResources';
import { INITIAL_RELATIONSHIPS, INITIAL_LEARNING_PATHS } from '../data/initialRelationships';
import { computeLibraryPlacements } from '../engine/placementEngine';
import { sound } from '../engine/soundEngine';
import { processIngestionFiles, IngestionProgressEvent } from '../engine/zipIngestionEngine';

export type ModalType =
  | 'detail'
  | 'pdf'
  | 'graph'
  | 'paths'
  | 'search'
  | 'manage'
  | 'settings'
  | 'sectionBrowser'
  | 'ingest'
  | 'dashboard'
  | 'importReport'
  | 'importReview'
  | null;

export interface FpsMetrics {
  fps: number;
  drawCalls: number;
  triangles: number;
  activeObjects: number;
}

interface LibraryStoreState {
  // Data
  resources: Resource[];
  sections: Section[];
  relationships: Relationship[];
  learningPaths: LearningPath[];
  preferences: UserPreferences;

  // Environment & Atmosphere
  atmosphere: AtmosphereMode;
  activeChunk: string;
  fpsMetrics: FpsMetrics;

  // Exploration State
  hasEnteredLibrary: boolean;
  playerLocation: [number, number, number];
  playerRotationY: number;
  cameraTarget: [number, number, number] | null;
  cameraLookAt: [number, number, number] | null;
  isNavigatingCamera: boolean;

  // Ingestion & Dynamic Pipeline
  isIngesting: boolean;
  importProgress: IngestionProgressEvent | null;
  lastImportReport: ImportReport | null;

  // Search History
  searchHistory: string[];

  // Interactions
  hoveredResourceId: string | null;
  selectedResourceId: string | null;
  highlightedResourceId: string | null;

  // Modals & Reader
  activeModal: ModalType;
  pdfResource: Resource | null;
  savedCameraStateBeforePDF: {
    position: [number, number, number];
    rotationY: number;
  } | null;

  // Actions
  enterLibrary: () => void;
  setAtmosphere: (atm: AtmosphereMode) => void;
  setActiveChunk: (chunk: string) => void;
  setFpsMetrics: (metrics: FpsMetrics) => void;
  addSearchHistory: (term: string) => void;
  setPlayerTransform: (pos: [number, number, number], rotY: number) => void;
  setHoveredResource: (id: string | null) => void;
  selectResource: (id: string | null) => void;
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
  openPdfReader: (res: Resource) => void;
  closePdfReader: () => void;

  // Reading & Ratings
  updateReadingProgress: (resourceId: string, page: number, total: number) => void;
  rateResource: (resourceId: string, rating: number, review?: string) => void;
  setPersonalNotes: (resourceId: string, notes: string) => void;
  toggleFavorite: (resourceId: string) => void;
  toggleCurrentFocus: (resourceId: string) => void;
  markCompleted: (resourceId: string) => void;
  locateBook: (resourceId: string) => void;
  teleportToSection: (sectionId: string) => void;

  // Dynamic Ingestion Actions
  startIngestion: (files: File[]) => Promise<void>;
  resolveDuplicate: (fileName: string, action: 'replace' | 'keep_existing' | 'keep_both') => void;
  acceptReviewBook: (bookId: string) => void;
  reclassifyBook: (bookId: string, newCategoryId: string, newSubcategory: string) => void;

  // Management & Manual Organization (Rules 59, 60, 61)
  addResource: (res: Omit<Resource, 'id'>) => void;
  updateResource: (id: string, updates: Partial<Resource>) => void;
  deleteResource: (id: string) => void;
  moveResource: (resourceId: string, newSectionId: string, newSubcategory: string) => void;
  renameSection: (sectionId: string, newName: string) => void;
  renameSubsection: (sectionId: string, oldSub: string, newSub: string) => void;
  mergeSections: (sourceSectionId: string, targetSectionId: string) => void;
  recalculatePlacements: () => void;
  loadSampleDemoCollection: () => void;
  clearAllResources: () => void;

  addRelationship: (rel: Omit<Relationship, 'id'>) => void;
  deleteRelationship: (id: string) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  getLibraryStats: () => LibraryStats;
}

// Persistent user storage helper - defaults to the real user collection + devotional scriptures & motivation
const STORAGE_KEY = 'pk_library_resources_v31_carbs_and_first_date';

interface StoredLibraryData {
  version: number;
  overrides: Record<string, Partial<Resource>>;
  customResources: Resource[];
  deletedIds?: string[];
}

function loadStoredResources(): Resource[] {
  try {
    if (typeof window !== 'undefined') {
      // Purge obsolete legacy mock keys from localStorage
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('pk_library_resources_') && key !== STORAGE_KEY) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));

      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);

        // Case 1: Legacy full-array format migration
        if (Array.isArray(parsed)) {
          const staticMap = new Map(PYTHON_TO_ML_RESOURCES.map((r) => [r.id, r]));
          const custom: Resource[] = [];
          const overrides: Record<string, Partial<Resource>> = {};

          for (const item of parsed) {
            if (staticMap.has(item.id)) {
              const diff: Partial<Resource> = {};
              if (item.progress) diff.progress = item.progress;
              if (item.readingStatus && item.readingStatus !== 'NOT_STARTED') diff.readingStatus = item.readingStatus;
              if (item.currentPage) diff.currentPage = item.currentPage;
              if (item.lastOpened) diff.lastOpened = item.lastOpened;
              if (item.personalRating) diff.personalRating = item.personalRating;
              if (item.personalReview) diff.personalReview = item.personalReview;
              if (item.personalNotes) diff.personalNotes = item.personalNotes;
              if (item.isFavorite) diff.isFavorite = item.isFavorite;
              if (item.isCurrentFocus) diff.isCurrentFocus = item.isCurrentFocus;
              if (item.priority && item.priority !== staticMap.get(item.id)?.priority) diff.priority = item.priority;
              if (item.category && item.category !== staticMap.get(item.id)?.category) diff.category = item.category;
              if (item.subCategory && item.subCategory !== staticMap.get(item.id)?.subCategory) diff.subCategory = item.subCategory;
              if (Object.keys(diff).length > 0) {
                overrides[item.id] = diff;
              }
            } else {
              const { fileDataUrl, ...cleanRes } = item;
              custom.push(cleanRes as Resource);
            }
          }

          // Immediately save in compact format to clear the 5MB quota
          try {
            const compactPayload: StoredLibraryData = {
              version: 32,
              overrides,
              customResources: custom,
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(compactPayload));
          } catch (e) {
            console.warn('Could not compress legacy storage:', e);
          }

          const merged = PYTHON_TO_ML_RESOURCES.map((base) => {
            return overrides[base.id] ? { ...base, ...overrides[base.id] } : base;
          });
          return [...merged, ...custom];
        }

        // Case 2: New compact StoredLibraryData format
        if (parsed && typeof parsed === 'object' && parsed.overrides) {
          const overrides = (parsed.overrides || {}) as Record<string, Partial<Resource>>;
          const custom = (parsed.customResources || []) as Resource[];
          const deletedIds = new Set((parsed.deletedIds || []) as string[]);

          const baseResources = PYTHON_TO_ML_RESOURCES.filter((r) => !deletedIds.has(r.id)).map((base) => {
            return overrides[base.id] ? { ...base, ...overrides[base.id] } : base;
          });

          return [...baseResources, ...custom];
        }
      }
    }
  } catch (e) {
    console.warn('Could not read user library from localStorage:', e);
  }
  return PYTHON_TO_ML_RESOURCES; // Default to user's real collection
}

function saveStoredResources(resources: Resource[]) {
  try {
    if (typeof window !== 'undefined') {
      const staticMap = new Map(PYTHON_TO_ML_RESOURCES.map((r) => [r.id, r]));
      const currentIds = new Set(resources.map((r) => r.id));
      const deletedIds = PYTHON_TO_ML_RESOURCES.filter((r) => !currentIds.has(r.id)).map((r) => r.id);

      const overrides: Record<string, Partial<Resource>> = {};
      const customResources: Resource[] = [];

      for (const res of resources) {
        const base = staticMap.get(res.id);
        if (base) {
          const diff: Partial<Resource> = {};
          if (res.progress !== base.progress) diff.progress = res.progress;
          if (res.readingStatus !== base.readingStatus) diff.readingStatus = res.readingStatus;
          if (res.currentPage !== base.currentPage) diff.currentPage = res.currentPage;
          if (res.lastOpened !== base.lastOpened) diff.lastOpened = res.lastOpened;
          if (res.personalRating !== base.personalRating) diff.personalRating = res.personalRating;
          if (res.personalReview !== base.personalReview) diff.personalReview = res.personalReview;
          if (res.personalNotes !== base.personalNotes) diff.personalNotes = res.personalNotes;
          if (res.isFavorite !== base.isFavorite) diff.isFavorite = res.isFavorite;
          if (res.isCurrentFocus !== base.isCurrentFocus) diff.isCurrentFocus = res.isCurrentFocus;
          if (res.priority !== base.priority) diff.priority = res.priority;
          if (res.category !== base.category) diff.category = res.category;
          if (res.subCategory !== base.subCategory) diff.subCategory = res.subCategory;

          if (Object.keys(diff).length > 0) {
            overrides[res.id] = diff;
          }
        } else {
          const { fileDataUrl, ...rest } = res;
          customResources.push(rest as Resource);
        }
      }

      const payload: StoredLibraryData = {
        version: 32,
        overrides,
        customResources,
        deletedIds: deletedIds.length > 0 ? deletedIds : undefined,
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch (quotaError) {
        console.warn('LocalStorage quota exceeded, purging old keys and retrying...', quotaError);
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const k = localStorage.key(i);
          if (k && k.startsWith('pk_library_')) {
            localStorage.removeItem(k);
          }
        }
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        } catch (retryError) {
          console.warn('Failed to save to localStorage even after purge:', retryError);
        }
      }
    }
  } catch (e) {
    console.warn('Could not persist library to localStorage:', e);
  }
}

const initialSaved = loadStoredResources();
const initialPlacement = computeLibraryPlacements(INITIAL_SECTIONS, initialSaved);

export const useLibraryStore = create<LibraryStoreState>((set, get) => ({
  resources: initialPlacement.placedResources,
  sections: INITIAL_SECTIONS,
  relationships: INITIAL_RELATIONSHIPS,
  learningPaths: INITIAL_LEARNING_PATHS,
  preferences: {
    soundEnabled: true,
    soundVolume: 0.5,
    footstepsEnabled: true,
    moveSpeed: 9.5,
    lookSensitivity: 1.35,
    showMinimap: true,
    showControlsHint: true,
    graphicsQuality: 'high',
    pointerLock: false,
    atmosphere: 'day',
    showFpsMonitor: false,
    targetFps120: true,
  },

  atmosphere: 'day',
  activeChunk: 'central',
  fpsMetrics: {
    fps: 60,
    drawCalls: 0,
    triangles: 0,
    activeObjects: 0,
  },

  hasEnteredLibrary: false,
  playerLocation: [0, 1.7, 20],
  playerRotationY: 0,
  cameraTarget: null,
  cameraLookAt: null,
  isNavigatingCamera: false,

  isIngesting: false,
  importProgress: null,
  lastImportReport: null,

  searchHistory: ['Java Concurrency', 'Redis', 'System Design', 'Graphs', 'Transformers', 'Bhagavad Gita', 'Vocabulary'],

  hoveredResourceId: null,
  selectedResourceId: null,
  highlightedResourceId: null,

  activeModal: null,
  pdfResource: null,
  savedCameraStateBeforePDF: null,

  enterLibrary: () => {
    sound.playEnter();
    set({ hasEnteredLibrary: true });
  },

  setAtmosphere: (atm) => {
    sound.playClick();
    set({ atmosphere: atm });
  },

  setActiveChunk: (chunk) => {
    if (get().activeChunk === chunk) return;
    set({ activeChunk: chunk });
  },

  setFpsMetrics: (metrics) => {
    set({ fpsMetrics: metrics });
  },

  addSearchHistory: (term) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    const current = get().searchHistory.filter((t) => t.toLowerCase() !== trimmed.toLowerCase());
    set({ searchHistory: [trimmed, ...current.slice(0, 7)] });
  },

  setPlayerTransform: (pos, rotY) => {
    set({ playerLocation: pos, playerRotationY: rotY });
  },

  setHoveredResource: (id) => {
    if (id && id !== get().hoveredResourceId) {
      sound.playHover();
    }
    set({ hoveredResourceId: id });
  },

  selectResource: (id) => {
    if (id) {
      sound.playSelect();
      const res = get().resources.find((r) => r.id === id);
      set({
        selectedResourceId: id,
        activeModal: 'detail',
        highlightedResourceId: id,
      });
      if (res) {
        get().updateResource(id, { lastOpened: new Date().toISOString().split('T')[0] });
      }
    } else {
      set({ selectedResourceId: null });
    }
  },

  openModal: (modal) => {
    sound.playClick();
    set({ activeModal: modal });
  },

  closeModal: () => {
    sound.playClick();
    set({ activeModal: null, selectedResourceId: null });
  },

  openPdfReader: (res) => {
    sound.playPageFlip();
    const curPos = get().playerLocation;
    const curRot = get().playerRotationY;
    set({
      pdfResource: res,
      activeModal: 'pdf',
      savedCameraStateBeforePDF: {
        position: [...curPos],
        rotationY: curRot,
      },
    });
  },

  closePdfReader: () => {
    sound.playClick();
    const saved = get().savedCameraStateBeforePDF;
    set({
      activeModal: null,
      pdfResource: null,
    });
    if (saved) {
      set({
        playerLocation: saved.position,
        playerRotationY: saved.rotationY,
      });
    }
  },

  updateReadingProgress: (resourceId, page, total) => {
    const pct = total > 0 ? Math.min(100, Math.round((page / total) * 100)) : 0;
    const isDone = pct >= 100;
    get().updateResource(resourceId, {
      currentPage: page,
      totalPages: total,
      progress: pct,
      readingStatus: isDone ? 'COMPLETED' : 'READING',
      status: isDone ? 'COMPLETED' : 'READING',
    });
  },

  rateResource: (resourceId, rating, review) => {
    sound.playChime();
    get().updateResource(resourceId, {
      personalRating: rating,
      personalReview: review !== undefined ? review : get().resources.find((r) => r.id === resourceId)?.personalReview,
    });
  },

  setPersonalNotes: (resourceId, notes) => {
    get().updateResource(resourceId, {
      personalNotes: notes,
    });
  },

  toggleFavorite: (resourceId) => {
    const res = get().resources.find((r) => r.id === resourceId);
    if (!res) return;
    const nextVal = !res.isFavorite;
    sound.playClick();
    get().updateResource(resourceId, { isFavorite: nextVal });
  },

  toggleCurrentFocus: (resourceId) => {
    const res = get().resources.find((r) => r.id === resourceId);
    if (!res) return;
    sound.playClick();
    const nextPriority = res.priority === 'CURRENT_FOCUS' ? 'NORMAL' : 'CURRENT_FOCUS';
    get().updateResource(resourceId, {
      priority: nextPriority,
    });
  },

  markCompleted: (resourceId) => {
    sound.playChime();
    get().updateResource(resourceId, {
      progress: 100,
      readingStatus: 'COMPLETED',
      status: 'COMPLETED',
    });
  },

  locateBook: (resourceId) => {
    const res = get().resources.find((r) => r.id === resourceId);
    if (!res || !res.location) return;

    sound.playChime();
    const [bx, by, bz] = res.location.position;
    const targetPos: [number, number, number] = [bx, 1.7, bz + 1.8];
    const lookAtPos: [number, number, number] = [bx, by, bz];

    set({
      selectedResourceId: resourceId,
      activeModal: null,
      cameraTarget: targetPos,
      cameraLookAt: lookAtPos,
      isNavigatingCamera: true,
      highlightedResourceId: resourceId,
    });

    setTimeout(() => {
      set({ isNavigatingCamera: false, cameraTarget: null, cameraLookAt: null });
    }, 1600);
  },

  teleportToSection: (sectionId) => {
    const section = get().sections.find((s) => s.id === sectionId);
    if (!section) return;

    sound.playChime();
    const [secX, , secZ] = section.anchorPosition;
    const targetPos: [number, number, number] = [secX, 1.7, secZ + 4];
    const lookAtPos: [number, number, number] = [secX, 1.7, secZ - 6];

    set({
      activeChunk: section.id,
      cameraTarget: targetPos,
      cameraLookAt: lookAtPos,
      isNavigatingCamera: true,
      activeModal: null,
    });

    setTimeout(() => {
      set({ isNavigatingCamera: false, cameraTarget: null, cameraLookAt: null });
    }, 1500);
  },

  // --- Dynamic Ingestion Implementation (Rules 1, 30, 31, 71) ---
  startIngestion: async (files: File[]) => {
    if (!files || files.length === 0) return;

    set({ isIngesting: true, activeModal: 'ingest' });
    sound.playClick();

    try {
      const result = await processIngestionFiles(
        files,
        get().sections,
        get().resources,
        (progress) => {
          set({ importProgress: progress });
        }
      );

      const allResources = [...get().resources, ...result.report.added];
      const allRels = [...get().relationships, ...result.newRelationships];
      const newPlacement = computeLibraryPlacements(result.newSections, allResources);

      sound.playChime();

      set({
        sections: result.newSections,
        resources: newPlacement.placedResources,
        relationships: allRels,
        lastImportReport: result.report,
        isIngesting: false,
        activeModal: 'importReport',
      });
    } catch (err) {
      console.error('Ingestion failed:', err);
      set({ isIngesting: false });
    }
  },

  resolveDuplicate: (fileName, action) => {
    const report = get().lastImportReport;
    if (!report) return;

    const dup = report.duplicates.find((d) => d.file === fileName);
    if (!dup) return;

    dup.action = action;

    if (action === 'replace') {
      // Replace existing book with new book metadata
      get().updateResource(dup.existing.id, {
        title: dup.newResource.title,
        fileHash: dup.newResource.fileHash,
        fileDataUrl: dup.newResource.fileDataUrl,
      });
    } else if (action === 'keep_both') {
      // Add as second edition
      const secondEdition: Resource = {
        ...dup.newResource,
        id: `res-ed2-${Date.now()}`,
        title: `${dup.newResource.title} (2nd Copy)`,
      };
      const updated = [...get().resources, secondEdition];
      const newPlacement = computeLibraryPlacements(get().sections, updated);
      set({ resources: newPlacement.placedResources });
    }

    set({
      lastImportReport: {
        ...report,
        duplicates: report.duplicates.filter((d) => d.file !== fileName),
      },
    });
  },

  acceptReviewBook: (bookId) => {
    const report = get().lastImportReport;
    if (report) {
      set({
        lastImportReport: {
          ...report,
          needsReview: report.needsReview.filter((b) => b.id !== bookId),
        },
      });
    }
  },

  reclassifyBook: (bookId, newCategoryId, newSubcategory) => {
    get().moveResource(bookId, newCategoryId, newSubcategory);
    const report = get().lastImportReport;
    if (report) {
      set({
        lastImportReport: {
          ...report,
          needsReview: report.needsReview.filter((b) => b.id !== bookId),
        },
      });
    }
  },

  // --- Management & Organization Actions (Rules 59, 60, 61) ---
  addResource: (resData) => {
    const newRes: Resource = {
      ...resData,
      id: `res-user-${Date.now()}`,
      progress: resData.progress || 0,
      readingStatus: resData.readingStatus || 'NOT_STARTED',
    };

    const updated = [...get().resources, newRes];
    const newPlacement = computeLibraryPlacements(get().sections, updated);
    saveStoredResources(newPlacement.placedResources);
    set({ resources: newPlacement.placedResources });
  },

  updateResource: (id, updates) => {
    const needsPlacementRecalc = 'category' in updates || 'subCategory' in updates;
    const updated = get().resources.map((r) =>
      r.id === id ? { ...r, ...updates } : r
    );
    if (needsPlacementRecalc) {
      const newPlacement = computeLibraryPlacements(get().sections, updated);
      saveStoredResources(newPlacement.placedResources);
      set({ resources: newPlacement.placedResources });
    } else {
      saveStoredResources(updated);
      set({ resources: updated });
    }
  },

  deleteResource: (id) => {
    const updated = get().resources.filter((r) => r.id !== id);
    const updatedRels = get().relationships.filter(
      (rel) => rel.sourceId !== id && rel.targetId !== id
    );
    const newPlacement = computeLibraryPlacements(get().sections, updated);
    saveStoredResources(newPlacement.placedResources);
    set({
      resources: newPlacement.placedResources,
      relationships: updatedRels,
      selectedResourceId: null,
      activeModal: null,
    });
  },

  loadSampleDemoCollection: () => {
    sound.playChime();
    const newPlacement = computeLibraryPlacements(INITIAL_SECTIONS, PYTHON_TO_ML_RESOURCES);
    saveStoredResources(newPlacement.placedResources);
    set({
      sections: INITIAL_SECTIONS,
      resources: newPlacement.placedResources,
      relationships: INITIAL_RELATIONSHIPS,
    });
  },

  clearAllResources: () => {
    sound.playClick();
    saveStoredResources([]);
    const newPlacement = computeLibraryPlacements(get().sections, []);
    set({
      resources: newPlacement.placedResources,
      selectedResourceId: null,
      hoveredResourceId: null,
    });
  },

  moveResource: (resourceId, newSectionId, newSubcategory) => {
    sound.playSelect();
    const updated = get().resources.map((r) =>
      r.id === resourceId
        ? {
            ...r,
            category: newSectionId,
            subCategory: newSubcategory,
          }
        : r
    );
    const newPlacement = computeLibraryPlacements(get().sections, updated);
    set({ resources: newPlacement.placedResources });
  },

  renameSection: (sectionId, newName) => {
    const updatedSections = get().sections.map((s) =>
      s.id === sectionId ? { ...s, name: newName } : s
    );
    const newPlacement = computeLibraryPlacements(updatedSections, get().resources);
    set({
      sections: updatedSections,
      resources: newPlacement.placedResources,
    });
  },

  renameSubsection: (sectionId, oldSub, newSub) => {
    const updatedSections = get().sections.map((s) => {
      if (s.id === sectionId) {
        return {
          ...s,
          subSections: s.subSections.map((sub) => (sub === oldSub ? newSub : sub)),
        };
      }
      return s;
    });
    const updatedResources = get().resources.map((r) => {
      if (r.category === sectionId && r.subCategory === oldSub) {
        return { ...r, subCategory: newSub };
      }
      return r;
    });
    const newPlacement = computeLibraryPlacements(updatedSections, updatedResources);
    set({
      sections: updatedSections,
      resources: newPlacement.placedResources,
    });
  },

  mergeSections: (sourceSectionId, targetSectionId) => {
    const targetSection = get().sections.find((s) => s.id === targetSectionId);
    if (!targetSection) return;

    sound.playChime();
    const sourceSection = get().sections.find((s) => s.id === sourceSectionId);
    const mergedSubsections = Array.from(
      new Set([...targetSection.subSections, ...(sourceSection?.subSections || [])])
    );

    const updatedSections = get()
      .sections.filter((s) => s.id !== sourceSectionId)
      .map((s) => (s.id === targetSectionId ? { ...s, subSections: mergedSubsections } : s));

    const updatedResources = get().resources.map((r) => {
      if (r.category === sourceSectionId) {
        return { ...r, category: targetSectionId };
      }
      return r;
    });

    const newPlacement = computeLibraryPlacements(updatedSections, updatedResources);
    set({
      sections: updatedSections,
      resources: newPlacement.placedResources,
    });
  },

  recalculatePlacements: () => {
    const newPlacement = computeLibraryPlacements(get().sections, get().resources);
    set({ resources: newPlacement.placedResources });
  },

  addRelationship: (relData) => {
    const newRel: Relationship = {
      ...relData,
      id: `rel-user-${Date.now()}`,
    };
    set({ relationships: [...get().relationships, newRel] });
  },

  deleteRelationship: (id) => {
    set({
      relationships: get().relationships.filter((r) => r.id !== id),
    });
  },

  updatePreferences: (prefs) => {
    const newPrefs = { ...get().preferences, ...prefs };
    if (prefs.soundEnabled !== undefined) {
      sound.setEnabled(prefs.soundEnabled);
    }
    if (prefs.soundVolume !== undefined) {
      sound.setVolume(prefs.soundVolume);
    }
    if (prefs.atmosphere !== undefined) {
      set({ atmosphere: prefs.atmosphere });
    }
    set({ preferences: newPrefs });
  },

  getLibraryStats: () => {
    const res = get().resources;
    const completed = res.filter((r) => r.readingStatus === 'COMPLETED' || r.progress >= 100).length;
    const reading = res.filter((r) => r.readingStatus === 'READING' || (r.progress > 0 && r.progress < 100)).length;
    const handbooks = res.filter((r) => r.resourceType === 'HANDBOOK' || r.category === 'sec-handbooks').length;
    const mustLearn = res.filter((r) => r.priority === 'MUST_LEARN').length;
    const currentFocus = res.filter((r) => r.priority === 'CURRENT_FOCUS').length;
    const favorites = res.filter((r) => r.isFavorite).length;

    const ratedBooks = res.filter((r) => r.personalRating && r.personalRating > 0);
    const avgRating =
      ratedBooks.length > 0
        ? Number((ratedBooks.reduce((sum, b) => sum + (b.personalRating || 0), 0) / ratedBooks.length).toFixed(1))
        : 4.8;

    const totalPages = res.reduce((sum, b) => sum + (b.totalPages || b.pages || 0), 0);
    const overallProgress =
      res.length > 0
        ? Math.round(res.reduce((acc, curr) => acc + (curr.progress || 0), 0) / res.length)
        : 0;

    const totalSubcategories = get().sections.reduce(
      (acc, curr) => acc + (curr.subSections?.length || 0),
      0
    );

    return {
      totalResources: res.length,
      totalHandbooks: handbooks,
      totalSections: get().sections.length,
      totalSubcategories,
      readingCount: reading,
      completedCount: completed,
      mustLearnCount: mustLearn,
      currentFocusCount: currentFocus,
      favoriteCount: favorites,
      averageRating: avgRating,
      totalPages,
      overallProgress,
    };
  },
}));
