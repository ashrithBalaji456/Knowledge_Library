import { create } from 'zustand';
import {
  Resource,
  Section,
  Relationship,
  LearningPath,
  UserPreferences,
  LibraryStats,
  AtmosphereMode,
} from '../types/library';
import { INITIAL_SECTIONS } from '../data/initialSections';
import { INITIAL_RESOURCES } from '../data/initialResources';
import { INITIAL_RELATIONSHIPS, INITIAL_LEARNING_PATHS } from '../data/initialRelationships';
import { computeLibraryPlacements } from '../engine/placementEngine';
import { sound } from '../engine/soundEngine';

export type ModalType =
  | 'detail'
  | 'pdf'
  | 'graph'
  | 'paths'
  | 'search'
  | 'manage'
  | 'settings'
  | 'sectionBrowser'
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
  updateReadingProgress: (resourceId: string, page: number, total: number) => void;
  toggleFavorite: (resourceId: string) => void;
  toggleCurrentFocus: (resourceId: string) => void;
  markCompleted: (resourceId: string) => void;
  locateBook: (resourceId: string) => void;
  teleportToSection: (sectionId: string) => void;
  addResource: (res: Omit<Resource, 'id'>) => void;
  updateResource: (id: string, updates: Partial<Resource>) => void;
  deleteResource: (id: string) => void;
  addRelationship: (rel: Omit<Relationship, 'id'>) => void;
  deleteRelationship: (id: string) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  getLibraryStats: () => LibraryStats;
}

const initialPlacement = computeLibraryPlacements(INITIAL_SECTIONS, INITIAL_RESOURCES);

export const useLibraryStore = create<LibraryStoreState>((set, get) => ({
  resources: initialPlacement.placedResources,
  sections: INITIAL_SECTIONS,
  relationships: INITIAL_RELATIONSHIPS,
  learningPaths: INITIAL_LEARNING_PATHS,
  preferences: {
    soundEnabled: true,
    soundVolume: 0.5,
    footstepsEnabled: true,
    moveSpeed: 6.8,
    lookSensitivity: 1.0,
    showMinimap: true,
    showControlsHint: true,
    graphicsQuality: 'high',
    pointerLock: false,
    atmosphere: 'day',
    showFpsMonitor: false,
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
  playerLocation: [0, 1.7, 24],
  playerRotationY: Math.PI,
  cameraTarget: null,
  cameraLookAt: null,
  isNavigatingCamera: false,

  searchHistory: ['Java Concurrency', 'Redis', 'System Design', 'Graphs', 'Transformers'],

  hoveredResourceId: null,
  selectedResourceId: null,
  highlightedResourceId: null,

  activeModal: null,
  pdfResource: null,
  savedCameraStateBeforePDF: null,

  enterLibrary: () => {
    sound.playChime();
    set({ hasEnteredLibrary: true });
  },

  setAtmosphere: (atm) => {
    sound.playChime();
    set({ atmosphere: atm });
  },

  setActiveChunk: (chunk) => {
    set({ activeChunk: chunk });
  },

  setFpsMetrics: (metrics) => {
    set({ fpsMetrics: metrics });
  },

  addSearchHistory: (term) => {
    if (!term.trim()) return;
    const filtered = get().searchHistory.filter((t) => t.toLowerCase() !== term.toLowerCase());
    set({ searchHistory: [term, ...filtered].slice(0, 6) });
  },

  setPlayerTransform: (pos, rotY) => {
    set({ playerLocation: pos, playerRotationY: rotY });
  },

  setHoveredResource: (id) => {
    set({ hoveredResourceId: id });
  },

  selectResource: (id) => {
    if (id) {
      sound.playBookSlide();
      set({ selectedResourceId: id, activeModal: 'detail' });
    } else {
      set({ selectedResourceId: null });
    }
  },

  openModal: (modal) => {
    set({ activeModal: modal });
  },

  closeModal: () => {
    set({ activeModal: null });
  },

  openPdfReader: (res) => {
    sound.playPageFlip();
    const currentLoc = get().playerLocation;
    const currentRot = get().playerRotationY;
    set({
      pdfResource: res,
      activeModal: 'pdf',
      savedCameraStateBeforePDF: {
        position: [...currentLoc] as [number, number, number],
        rotationY: currentRot,
      },
    });
  },

  closePdfReader: () => {
    sound.playBookSlide();
    const saved = get().savedCameraStateBeforePDF;
    if (saved) {
      set({
        activeModal: null,
        pdfResource: null,
        cameraTarget: [...saved.position] as [number, number, number],
        isNavigatingCamera: true,
      });
      setTimeout(() => {
        set({ isNavigatingCamera: false, cameraTarget: null });
      }, 1000);
    } else {
      set({ activeModal: null, pdfResource: null });
    }
  },

  updateReadingProgress: (resourceId, page, total) => {
    const pct = Math.round((page / total) * 100);
    const status = pct >= 100 ? 'COMPLETED' : 'IN_PROGRESS';

    const updated = get().resources.map((r) => {
      if (r.id === resourceId) {
        return {
          ...r,
          currentPage: page,
          totalPages: total,
          progress: pct,
          status: status as any,
          lastOpened: new Date().toISOString().split('T')[0],
        };
      }
      return r;
    });

    const newPlacement = computeLibraryPlacements(get().sections, updated);
    set({ resources: newPlacement.placedResources });
  },

  toggleFavorite: (resourceId) => {
    const updated = get().resources.map((r) =>
      r.id === resourceId ? { ...r, isFavorite: !r.isFavorite } : r
    );
    set({ resources: updated });
  },

  toggleCurrentFocus: (resourceId) => {
    const updated = get().resources.map((r) =>
      r.id === resourceId ? { ...r, isCurrentFocus: !r.isCurrentFocus } : r
    );
    set({ resources: updated });
  },

  markCompleted: (resourceId) => {
    const updated = get().resources.map((r) =>
      r.id === resourceId ? { ...r, status: 'COMPLETED' as const, progress: 100 } : r
    );
    const newPlacement = computeLibraryPlacements(get().sections, updated);
    set({ resources: newPlacement.placedResources });
  },

  locateBook: (resourceId) => {
    const res = get().resources.find((r) => r.id === resourceId);
    if (!res || !res.location) return;

    sound.playChime();
    const [bookX, bookY, bookZ] = res.location.position;
    const shelf = initialPlacement.shelves.find((s) => s.id === res.location?.shelfId);
    const isLeft = shelf ? Math.abs(shelf.rotation[1] - Math.PI / 2) < 0.1 : true;
    const standX = isLeft ? bookX + 1.5 : bookX - 1.5;
    const standY = 1.7;
    const standZ = bookZ;

    set({
      highlightedResourceId: resourceId,
      selectedResourceId: resourceId,
      activeModal: 'detail',
      cameraTarget: [standX, standY, standZ],
      cameraLookAt: [bookX, bookY, bookZ],
      isNavigatingCamera: true,
    });

    setTimeout(() => {
      set({ isNavigatingCamera: false, cameraTarget: null, cameraLookAt: null });
    }, 1400);
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
    });

    setTimeout(() => {
      set({ isNavigatingCamera: false, cameraTarget: null, cameraLookAt: null });
    }, 1500);
  },

  addResource: (resData) => {
    const newRes: Resource = {
      ...resData,
      id: `res-user-${Date.now()}`,
      progress: resData.progress || 0,
      status: resData.status || 'NOT_STARTED',
    };

    const updated = [...get().resources, newRes];
    const newPlacement = computeLibraryPlacements(get().sections, updated);
    set({ resources: newPlacement.placedResources });
  },

  updateResource: (id, updates) => {
    const updated = get().resources.map((r) =>
      r.id === id ? { ...r, ...updates } : r
    );
    const newPlacement = computeLibraryPlacements(get().sections, updated);
    set({ resources: newPlacement.placedResources });
  },

  deleteResource: (id) => {
    const updated = get().resources.filter((r) => r.id !== id);
    const updatedRels = get().relationships.filter(
      (rel) => rel.sourceId !== id && rel.targetId !== id
    );
    const newPlacement = computeLibraryPlacements(get().sections, updated);
    set({
      resources: newPlacement.placedResources,
      relationships: updatedRels,
      selectedResourceId: null,
      activeModal: null,
    });
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
    const completed = res.filter((r) => r.status === 'COMPLETED').length;
    const inProgress = res.filter((r) => r.status === 'IN_PROGRESS').length;
    const mustLearn = res.filter((r) => r.priority === 'MUST_LEARN').length;
    const currentFocus = res.filter((r) => r.isCurrentFocus || r.priority === 'CURRENT_FOCUS').length;
    const overallProgress =
      res.length > 0
        ? Math.round(res.reduce((acc, curr) => acc + (curr.progress || 0), 0) / res.length)
        : 0;

    return {
      totalResources: res.length,
      completedCount: completed,
      inProgressCount: inProgress,
      mustLearnCount: mustLearn,
      currentFocusCount: currentFocus,
      overallProgress,
      totalSections: get().sections.length,
    };
  },
}));
