import React from 'react';
import { useLibraryStore } from './store/useLibraryStore';
import { LibraryScene } from './components/3d/LibraryScene';
import { WelcomeScreen } from './components/hud/WelcomeScreen';
import { TopNav } from './components/hud/TopNav';
import { Minimap } from './components/hud/Minimap';
import { BookHoverHUD } from './components/hud/BookHoverHUD';
import { ControlsHint } from './components/hud/ControlsHint';
import { SectionEntranceToast } from './components/hud/SectionEntranceToast';
import { BookDetailModal } from './components/modals/BookDetailModal';
import { PDFReaderModal } from './components/modals/PDFReaderModal';
import { KnowledgeGraphModal } from './components/modals/KnowledgeGraphModal';
import { LearningPathModal } from './components/modals/LearningPathModal';
import { SearchModal } from './components/modals/SearchModal';
import { ManageModal } from './components/modals/ManageModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { SectionBrowserModal } from './components/modals/SectionBrowserModal';

export const App: React.FC = () => {
  const hasEnteredLibrary = useLibraryStore((s) => s.hasEnteredLibrary);
  const activeModal = useLibraryStore((s) => s.activeModal);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans">
      {/* Primary 3D Library World Engine */}
      <LibraryScene />

      {/* Entrance Welcome Screen */}
      {!hasEnteredLibrary && <WelcomeScreen />}

      {/* Exploration HUD & Controls (Active once entered) */}
      {hasEnteredLibrary && (
        <>
          <TopNav />
          <Minimap />
          <BookHoverHUD />
          <ControlsHint />
          <SectionEntranceToast />
        </>
      )}

      {/* Modal Interfaces */}
      {activeModal === 'detail' && <BookDetailModal />}
      {activeModal === 'pdf' && <PDFReaderModal />}
      {activeModal === 'graph' && <KnowledgeGraphModal />}
      {activeModal === 'paths' && <LearningPathModal />}
      {activeModal === 'search' && <SearchModal />}
      {activeModal === 'manage' && <ManageModal />}
      {activeModal === 'settings' && <SettingsModal />}
      {activeModal === 'sectionBrowser' && <SectionBrowserModal />}
    </div>
  );
};

export default App;
