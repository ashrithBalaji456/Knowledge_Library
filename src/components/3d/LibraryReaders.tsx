import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// -------------------------------------------------------------
// TEXTURE HELPERS (Reused across all readers for 0 memory overhead)
// -------------------------------------------------------------
let cachedOpenPageTexture: THREE.CanvasTexture | null = null;
function getOpenPageTexture(): THREE.CanvasTexture {
  if (cachedOpenPageTexture) return cachedOpenPageTexture;
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#FAF6ED'; // Warm cream archival paper
  ctx.fillRect(0, 0, 512, 512);

  // Subtle margin guides
  ctx.strokeStyle = 'rgba(203, 213, 225, 0.35)';
  ctx.lineWidth = 1;
  ctx.strokeRect(32, 32, 448, 448);

  // Chapter Header & Page number
  ctx.fillStyle = '#64748B';
  ctx.fillRect(48, 44, 140, 5);
  ctx.fillRect(440, 44, 24, 5);

  // Paragraph text lines
  ctx.fillStyle = '#1E293B';
  for (let y = 72; y < 450; y += 17) {
    const isParagraphEnd = (y % 68 === 0);
    const isCodeIndent = (y % 85 === 0);
    const startX = isCodeIndent ? 72 : 48;
    const lineWidth = isParagraphEnd ? 260 : (448 - startX - ((y * 7) % 35));
    ctx.fillRect(startX, y, lineWidth, 4.5);
  }

  cachedOpenPageTexture = new THREE.CanvasTexture(canvas);
  return cachedOpenPageTexture;
}

// -------------------------------------------------------------
// REUSABLE SHARED GEOMETRIES (Zero GC pressure)
// -------------------------------------------------------------
const GEOM_HEAD = new THREE.SphereGeometry(0.12, 16, 16);
const GEOM_HAIR_SHORT = new THREE.SphereGeometry(0.128, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.58);
const GEOM_HAIR_BUN = new THREE.SphereGeometry(0.05, 12, 12);
const GEOM_NECK = new THREE.CylinderGeometry(0.05, 0.055, 0.08, 12);
const GEOM_TORSO_MALE = new THREE.BoxGeometry(0.36, 0.48, 0.22);
const GEOM_TORSO_SLIM = new THREE.BoxGeometry(0.32, 0.46, 0.20);
const GEOM_SHOULDER = new THREE.SphereGeometry(0.07, 12, 12);
const GEOM_ARM_SEGMENT = new THREE.CylinderGeometry(0.045, 0.04, 0.24, 12);
const GEOM_FOREARM = new THREE.CylinderGeometry(0.04, 0.035, 0.22, 12);
const GEOM_HAND = new THREE.BoxGeometry(0.055, 0.04, 0.08);
const GEOM_THIGH = new THREE.CylinderGeometry(0.075, 0.065, 0.38, 12);
const GEOM_CALF = new THREE.CylinderGeometry(0.06, 0.05, 0.38, 12);
const GEOM_SHOE = new THREE.BoxGeometry(0.09, 0.07, 0.20);
const GEOM_GLASSES_FRAME = new THREE.TorusGeometry(0.032, 0.005, 8, 16);
const GEOM_GLASSES_BRIDGE = new THREE.BoxGeometry(0.03, 0.006, 0.006);

// Shared chair geometries
const GEOM_CHAIR_SEAT = new THREE.BoxGeometry(0.52, 0.08, 0.50);
const GEOM_CHAIR_BACK = new THREE.BoxGeometry(0.50, 0.44, 0.06);
const GEOM_CHAIR_POLE = new THREE.CylinderGeometry(0.03, 0.03, 0.42, 12);
const GEOM_CHAIR_BASE = new THREE.CylinderGeometry(0.24, 0.28, 0.04, 16);

// Shared open book parts
const GEOM_BOOK_COVER = new THREE.BoxGeometry(0.22, 0.008, 0.30);
const GEOM_BOOK_PAGE = new THREE.BoxGeometry(0.20, 0.016, 0.28);
const GEOM_BOOK_SPINE = new THREE.CylinderGeometry(0.012, 0.012, 0.30, 8);

// Shared coffee mug & accessories
const GEOM_MUG = new THREE.CylinderGeometry(0.04, 0.035, 0.09, 12);
const GEOM_MUG_HANDLE = new THREE.TorusGeometry(0.025, 0.007, 6, 12);
const GEOM_TABLET = new THREE.BoxGeometry(0.20, 0.008, 0.28);

// Shared materials
const MAT_PAGE = new THREE.MeshStandardMaterial({
  roughness: 0.85,
  metalness: 0.05,
});
const MAT_TITANIUM = new THREE.MeshStandardMaterial({
  color: '#CBD5E1',
  roughness: 0.25,
  metalness: 0.8,
});
const MAT_CHAIR_LEATHER = new THREE.MeshStandardMaterial({
  color: '#1E293B',
  roughness: 0.4,
  metalness: 0.1,
});
const MAT_MUG = new THREE.MeshStandardMaterial({
  color: '#F8FAFC',
  roughness: 0.2,
  metalness: 0.1,
});
const MAT_TABLET_SCREEN = new THREE.MeshBasicMaterial({
  color: '#38BDF8',
});

// -------------------------------------------------------------
// COMPONENT: OPEN 3D BOOK
// -------------------------------------------------------------
interface OpenBookProps {
  coverColor: string;
  glowColor?: string;
  angle?: number;
}

const OpenBook: React.FC<OpenBookProps> = ({ coverColor, glowColor = '#38BDF8', angle = 0.25 }) => {
  const pageTexture = useMemo(() => getOpenPageTexture(), []);

  const coverMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: coverColor,
        roughness: 0.45,
        metalness: 0.15,
      }),
    [coverColor]
  );

  const pageMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: pageTexture,
        roughness: 0.85,
        metalness: 0.02,
      }),
    [pageTexture]
  );

  return (
    <group>
      {/* Spine hinge */}
      <mesh geometry={GEOM_BOOK_SPINE} material={coverMat} rotation={[Math.PI / 2, 0, 0]} />

      {/* Left Wing (Cover + Paper block) */}
      <group position={[-0.10, 0, 0]} rotation={[0, 0, angle]}>
        <mesh geometry={GEOM_BOOK_COVER} material={coverMat} position={[-0.10, -0.006, 0]} />
        <mesh geometry={GEOM_BOOK_PAGE} material={pageMat} position={[-0.10, 0.006, 0]} />
      </group>

      {/* Right Wing (Cover + Paper block) */}
      <group position={[0.10, 0, 0]} rotation={[0, 0, -angle]}>
        <mesh geometry={GEOM_BOOK_COVER} material={coverMat} position={[0.10, -0.006, 0]} />
        <mesh geometry={GEOM_BOOK_PAGE} material={pageMat} position={[0.10, 0.006, 0]} />
      </group>

      {/* Subtle intellectual page illumination */}
      <pointLight position={[0, 0.08, 0]} color={glowColor} intensity={0.18} distance={1.2} decay={2} />
    </group>
  );
};

// -------------------------------------------------------------
// COMPONENT: MODERN ARCHITECTURAL STUDY CHAIR
// -------------------------------------------------------------
const ModernStudyChair: React.FC<{ position: [number, number, number]; rotationY: number }> = ({
  position,
  rotationY,
}) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Pedestal base */}
      <mesh geometry={GEOM_CHAIR_BASE} material={MAT_TITANIUM} position={[0, 0.02, 0]} />
      <mesh geometry={GEOM_CHAIR_POLE} material={MAT_TITANIUM} position={[0, 0.23, 0]} />

      {/* Padded seat cushion (Y = 0.46m) */}
      <mesh geometry={GEOM_CHAIR_SEAT} material={MAT_CHAIR_LEATHER} position={[0, 0.46, 0]} />

      {/* Contoured ergonomic backrest */}
      <mesh geometry={GEOM_CHAIR_BACK} material={MAT_CHAIR_LEATHER} position={[0, 0.72, -0.22]} />
    </group>
  );
};

// -------------------------------------------------------------
// COMPONENT: INDIVIDUAL 3D READER
// -------------------------------------------------------------
export interface ReaderConfig {
  id: string;
  name: string;
  pose: 'sitting_desk' | 'sitting_sofa' | 'sitting_step' | 'standing_aisle' | 'leaning_balcony';
  position: [number, number, number];
  rotationY: number;
  outfitColor: string;
  pantsColor: string;
  skinColor: string;
  hairColor: string;
  hairStyle?: 'short' | 'bun' | 'curly';
  hasGlasses?: boolean;
  bookColor: string;
  hasMug?: boolean;
  isTablet?: boolean;
}

const ReaderFigure: React.FC<{ config: ReaderConfig }> = ({ config }) => {
  const figureGroupRef = useRef<THREE.Group>(null);
  const headGroupRef = useRef<THREE.Group>(null);
  const breathSeed = useRef(Math.random() * Math.PI * 2);

  const skinMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: config.skinColor, roughness: 0.6, metalness: 0.05 }),
    [config.skinColor]
  );
  const outfitMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: config.outfitColor, roughness: 0.75, metalness: 0.08 }),
    [config.outfitColor]
  );
  const pantsMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: config.pantsColor, roughness: 0.8, metalness: 0.05 }),
    [config.pantsColor]
  );
  const hairMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: config.hairColor, roughness: 0.85, metalness: 0.02 }),
    [config.hairColor]
  );
  const shoeMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#0F172A', roughness: 0.4, metalness: 0.2 }),
    []
  );

  // Subtle organic reading posture micro-breathing (eliminates mannequin stiffness)
  useFrame((state) => {
    if (!headGroupRef.current) return;
    const t = state.clock.getElapsedTime();
    const breath = Math.sin(t * 1.4 + breathSeed.current);
    // Subtle head nodding / scanning pages
    headGroupRef.current.rotation.x = -0.32 + breath * 0.02;
    headGroupRef.current.rotation.y = Math.sin(t * 0.35 + breathSeed.current) * 0.035;
  });

  // Render pose-specific body kinematics
  switch (config.pose) {
    // ---------------------------------------------------------
    // 1. SITTING AT STUDY DESK (Chair Y=0.46, Desk Y=0.75)
    // ---------------------------------------------------------
    case 'sitting_desk': {
      return (
        <group position={config.position} rotation={[0, config.rotationY, 0]}>
          {/* Matching modern study chair */}
          <ModernStudyChair position={[0, 0, 0]} rotationY={0} />

          {/* Root Pelvis on Chair (Y = 0.50m) */}
          <group ref={figureGroupRef} position={[0, 0.50, 0]}>
            {/* Torso leaning slightly forward towards reading desk */}
            <mesh
              geometry={GEOM_TORSO_MALE}
              material={outfitMat}
              position={[0, 0.26, -0.04]}
              rotation={[0.12, 0, 0]}
            />

            {/* Neck */}
            <mesh geometry={GEOM_NECK} material={skinMat} position={[0, 0.53, -0.01]} />

            {/* Head looking down at open book */}
            <group ref={headGroupRef} position={[0, 0.65, 0.01]} rotation={[-0.35, 0, 0]}>
              <mesh geometry={GEOM_HEAD} material={skinMat} />
              {/* Hair */}
              <mesh geometry={GEOM_HAIR_SHORT} material={hairMat} position={[0, 0.03, 0]} />
              {config.hairStyle === 'bun' && (
                <mesh geometry={GEOM_HAIR_BUN} material={hairMat} position={[0, 0.08, -0.11]} />
              )}
              {/* Reading Spectacles */}
              {config.hasGlasses && (
                <group position={[0, 0.02, 0.115]}>
                  <mesh geometry={GEOM_GLASSES_FRAME} material={MAT_TITANIUM} position={[-0.045, 0, 0]} />
                  <mesh geometry={GEOM_GLASSES_FRAME} material={MAT_TITANIUM} position={[0.045, 0, 0]} />
                  <mesh geometry={GEOM_GLASSES_BRIDGE} material={MAT_TITANIUM} position={[0, 0, 0]} />
                </group>
              )}
            </group>

            {/* Left Arm resting on desk holding left page */}
            <group position={[-0.20, 0.44, -0.04]}>
              <mesh geometry={GEOM_SHOULDER} material={outfitMat} />
              {/* Upper arm angled forward */}
              <group position={[-0.04, -0.11, 0.08]} rotation={[0.55, 0, 0.22]}>
                <mesh geometry={GEOM_ARM_SEGMENT} material={outfitMat} />
                {/* Forearm resting flat on desk */}
                <group position={[0, -0.11, 0.06]} rotation={[-0.75, 0, 0.35]}>
                  <mesh geometry={GEOM_FOREARM} material={outfitMat} />
                  {/* Hand on desk holding book edge */}
                  <mesh geometry={GEOM_HAND} material={skinMat} position={[0.02, -0.12, 0.04]} />
                </group>
              </group>
            </group>

            {/* Right Arm resting on desk */}
            <group position={[0.20, 0.44, -0.04]}>
              <mesh geometry={GEOM_SHOULDER} material={outfitMat} />
              {/* Upper arm */}
              <group position={[0.04, -0.11, 0.08]} rotation={[0.55, 0, -0.22]}>
                <mesh geometry={GEOM_ARM_SEGMENT} material={outfitMat} />
                {/* Forearm */}
                <group position={[0, -0.11, 0.06]} rotation={[-0.75, 0, -0.35]}>
                  <mesh geometry={GEOM_FOREARM} material={outfitMat} />
                  {/* Hand turning page or holding coffee mug */}
                  <mesh geometry={GEOM_HAND} material={skinMat} position={[-0.02, -0.12, 0.04]} />
                </group>
              </group>
            </group>

            {/* Thighs (Horizontal under desk) */}
            <mesh
              geometry={GEOM_THIGH}
              material={pantsMat}
              position={[-0.10, -0.04, 0.16]}
              rotation={[Math.PI / 2 - 0.08, 0, 0]}
            />
            <mesh
              geometry={GEOM_THIGH}
              material={pantsMat}
              position={[0.10, -0.04, 0.16]}
              rotation={[Math.PI / 2 - 0.08, 0, 0]}
            />

            {/* Calves (Vertical down to floor) */}
            <mesh geometry={GEOM_CALF} material={pantsMat} position={[-0.10, -0.26, 0.34]} />
            <mesh geometry={GEOM_CALF} material={pantsMat} position={[0.10, -0.26, 0.34]} />

            {/* Shoes resting flat on floor */}
            <mesh geometry={GEOM_SHOE} material={shoeMat} position={[-0.10, -0.46, 0.38]} />
            <mesh geometry={GEOM_SHOE} material={shoeMat} position={[0.10, -0.46, 0.38]} />
          </group>

          {/* Open Book resting on study desk in front of reader (Desk surface at Y=0.76m, Z=0.48m) */}
          <group position={[0, 0.77, 0.44]} rotation={[-0.04, 0, 0]}>
            <OpenBook coverColor={config.bookColor} />
          </group>

          {/* Optional Coffee Mug on desk */}
          {config.hasMug && (
            <group position={[0.34, 0.79, 0.38]}>
              <mesh geometry={GEOM_MUG} material={MAT_MUG} />
              <mesh geometry={GEOM_MUG_HANDLE} material={MAT_MUG} position={[0.04, 0, 0]} rotation={[0, 0, Math.PI / 2]} />
            </group>
          )}
        </group>
      );
    }

    // ---------------------------------------------------------
    // 2. SITTING ON ROTUNDA SOFA / LOUNGE (Holding book in hands)
    // ---------------------------------------------------------
    case 'sitting_sofa': {
      return (
        <group position={config.position} rotation={[0, config.rotationY, 0]}>
          {/* Seated Root on Plush Sofa (Y = 0.45m) */}
          <group ref={figureGroupRef} position={[0, 0.45, 0]}>
            {/* Relaxed reclined torso */}
            <mesh
              geometry={GEOM_TORSO_SLIM}
              material={outfitMat}
              position={[0, 0.24, -0.06]}
              rotation={[-0.08, 0, 0]}
            />

            {/* Neck */}
            <mesh geometry={GEOM_NECK} material={skinMat} position={[0, 0.50, -0.04]} />

            {/* Head tilted forward reading book in hands */}
            <group ref={headGroupRef} position={[0, 0.62, -0.02]} rotation={[-0.38, 0, 0]}>
              <mesh geometry={GEOM_HEAD} material={skinMat} />
              <mesh geometry={GEOM_HAIR_SHORT} material={hairMat} position={[0, 0.03, 0]} />
              {config.hairStyle === 'bun' && (
                <mesh geometry={GEOM_HAIR_BUN} material={hairMat} position={[0, 0.08, -0.11]} />
              )}
              {config.hasGlasses && (
                <group position={[0, 0.02, 0.115]}>
                  <mesh geometry={GEOM_GLASSES_FRAME} material={MAT_TITANIUM} position={[-0.045, 0, 0]} />
                  <mesh geometry={GEOM_GLASSES_FRAME} material={MAT_TITANIUM} position={[0.045, 0, 0]} />
                  <mesh geometry={GEOM_GLASSES_BRIDGE} material={MAT_TITANIUM} position={[0, 0, 0]} />
                </group>
              )}
            </group>

            {/* Arms cradling book in lap / chest */}
            <group position={[-0.18, 0.40, -0.04]}>
              <mesh geometry={GEOM_SHOULDER} material={outfitMat} />
              <group position={[-0.02, -0.10, 0.06]} rotation={[0.65, 0, 0.35]}>
                <mesh geometry={GEOM_ARM_SEGMENT} material={outfitMat} />
                <group position={[0, -0.10, 0.08]} rotation={[-0.95, 0, 0.45]}>
                  <mesh geometry={GEOM_FOREARM} material={outfitMat} />
                  <mesh geometry={GEOM_HAND} material={skinMat} position={[0.03, -0.11, 0.04]} />
                </group>
              </group>
            </group>

            <group position={[0.18, 0.40, -0.04]}>
              <mesh geometry={GEOM_SHOULDER} material={outfitMat} />
              <group position={[0.02, -0.10, 0.06]} rotation={[0.65, 0, -0.35]}>
                <mesh geometry={GEOM_ARM_SEGMENT} material={outfitMat} />
                <group position={[0, -0.10, 0.08]} rotation={[-0.95, 0, -0.45]}>
                  <mesh geometry={GEOM_FOREARM} material={outfitMat} />
                  <mesh geometry={GEOM_HAND} material={skinMat} position={[-0.03, -0.11, 0.04]} />
                </group>
              </group>
            </group>

            {/* Book held up comfortably at chest height */}
            <group position={[0, 0.38, 0.26]} rotation={[0.75, 0, 0]}>
              <OpenBook coverColor={config.bookColor} />
            </group>

            {/* Relaxed legs draped over sofa rim */}
            <mesh
              geometry={GEOM_THIGH}
              material={pantsMat}
              position={[-0.09, -0.04, 0.16]}
              rotation={[Math.PI / 2 - 0.15, 0, 0.05]}
            />
            <mesh
              geometry={GEOM_THIGH}
              material={pantsMat}
              position={[0.09, -0.04, 0.16]}
              rotation={[Math.PI / 2 - 0.15, 0, -0.05]}
            />

            <mesh geometry={GEOM_CALF} material={pantsMat} position={[-0.10, -0.24, 0.34]} rotation={[0.1, 0, 0]} />
            <mesh geometry={GEOM_CALF} material={pantsMat} position={[0.10, -0.24, 0.34]} rotation={[0.1, 0, 0]} />

            <mesh geometry={GEOM_SHOE} material={shoeMat} position={[-0.10, -0.42, 0.38]} />
            <mesh geometry={GEOM_SHOE} material={shoeMat} position={[0.10, -0.42, 0.38]} />
          </group>
        </group>
      );
    }

    // ---------------------------------------------------------
    // 3. SITTING ON SUNKEN ROTUNDA STEP / TERRACE (Casual reading)
    // ---------------------------------------------------------
    case 'sitting_step': {
      return (
        <group position={config.position} rotation={[0, config.rotationY, 0]}>
          <group ref={figureGroupRef} position={[0, 0.25, 0]}>
            {/* Torso */}
            <mesh geometry={GEOM_TORSO_SLIM} material={outfitMat} position={[0, 0.24, -0.02]} rotation={[0.05, 0, 0]} />
            <mesh geometry={GEOM_NECK} material={skinMat} position={[0, 0.50, 0]} />

            {/* Head */}
            <group ref={headGroupRef} position={[0, 0.62, 0.02]} rotation={[-0.42, 0, 0]}>
              <mesh geometry={GEOM_HEAD} material={skinMat} />
              <mesh geometry={GEOM_HAIR_SHORT} material={hairMat} position={[0, 0.03, 0]} />
            </group>

            {/* Arms holding book in lap */}
            <group position={[-0.18, 0.40, 0]}>
              <group position={[-0.02, -0.10, 0.06]} rotation={[0.60, 0, 0.30]}>
                <mesh geometry={GEOM_ARM_SEGMENT} material={outfitMat} />
                <group position={[0, -0.10, 0.06]} rotation={[-0.85, 0, 0.40]}>
                  <mesh geometry={GEOM_FOREARM} material={outfitMat} />
                  <mesh geometry={GEOM_HAND} material={skinMat} position={[0.03, -0.10, 0.04]} />
                </group>
              </group>
            </group>

            <group position={[0.18, 0.40, 0]}>
              <group position={[0.02, -0.10, 0.06]} rotation={[0.60, 0, -0.30]}>
                <mesh geometry={GEOM_ARM_SEGMENT} material={outfitMat} />
                <group position={[0, -0.10, 0.06]} rotation={[-0.85, 0, -0.40]}>
                  <mesh geometry={GEOM_FOREARM} material={outfitMat} />
                  <mesh geometry={GEOM_HAND} material={skinMat} position={[-0.03, -0.10, 0.04]} />
                </group>
              </group>
            </group>

            {/* Open Book resting on lap */}
            <group position={[0, 0.22, 0.28]} rotation={[0.55, 0, 0]}>
              <OpenBook coverColor={config.bookColor} />
            </group>

            {/* Crossed/bent legs on step */}
            <mesh
              geometry={GEOM_THIGH}
              material={pantsMat}
              position={[-0.10, -0.02, 0.16]}
              rotation={[Math.PI / 2 - 0.2, 0, 0.2]}
            />
            <mesh
              geometry={GEOM_THIGH}
              material={pantsMat}
              position={[0.10, -0.02, 0.16]}
              rotation={[Math.PI / 2 - 0.2, 0, -0.2]}
            />
            <mesh geometry={GEOM_CALF} material={pantsMat} position={[-0.12, -0.14, 0.32]} rotation={[0.2, 0, 0]} />
            <mesh geometry={GEOM_CALF} material={pantsMat} position={[0.12, -0.14, 0.32]} rotation={[0.2, 0, 0]} />
            <mesh geometry={GEOM_SHOE} material={shoeMat} position={[-0.12, -0.22, 0.36]} />
            <mesh geometry={GEOM_SHOE} material={shoeMat} position={[0.12, -0.22, 0.36]} />
          </group>
        </group>
      );
    }

    // ---------------------------------------------------------
    // 4. STANDING IN BOOK AISLE (Browsing / Reading standing up)
    // ---------------------------------------------------------
    case 'standing_aisle': {
      return (
        <group position={config.position} rotation={[0, config.rotationY, 0]}>
          {/* Standing Pelvis at Y = 0.88m */}
          <group ref={figureGroupRef} position={[0, 0.88, 0]}>
            {/* Upright Torso */}
            <mesh geometry={GEOM_TORSO_MALE} material={outfitMat} position={[0, 0.25, 0]} />
            <mesh geometry={GEOM_NECK} material={skinMat} position={[0, 0.52, 0]} />

            {/* Head tilted down towards book held in hands */}
            <group ref={headGroupRef} position={[0, 0.64, 0.02]} rotation={[-0.42, 0, 0]}>
              <mesh geometry={GEOM_HEAD} material={skinMat} />
              <mesh geometry={GEOM_HAIR_SHORT} material={hairMat} position={[0, 0.03, 0]} />
              {config.hairStyle === 'bun' && (
                <mesh geometry={GEOM_HAIR_BUN} material={hairMat} position={[0, 0.08, -0.11]} />
              )}
              {config.hasGlasses && (
                <group position={[0, 0.02, 0.115]}>
                  <mesh geometry={GEOM_GLASSES_FRAME} material={MAT_TITANIUM} position={[-0.045, 0, 0]} />
                  <mesh geometry={GEOM_GLASSES_FRAME} material={MAT_TITANIUM} position={[0.045, 0, 0]} />
                  <mesh geometry={GEOM_GLASSES_BRIDGE} material={MAT_TITANIUM} position={[0, 0, 0]} />
                </group>
              )}
            </group>

            {/* Left Arm holding book base */}
            <group position={[-0.19, 0.42, 0]}>
              <mesh geometry={GEOM_SHOULDER} material={outfitMat} />
              <group position={[-0.02, -0.11, 0.06]} rotation={[0.55, 0, 0.28]}>
                <mesh geometry={GEOM_ARM_SEGMENT} material={outfitMat} />
                <group position={[0, -0.11, 0.06]} rotation={[-0.92, 0, 0.40]}>
                  <mesh geometry={GEOM_FOREARM} material={outfitMat} />
                  <mesh geometry={GEOM_HAND} material={skinMat} position={[0.03, -0.11, 0.04]} />
                </group>
              </group>
            </group>

            {/* Right Arm turning pages */}
            <group position={[0.19, 0.42, 0]}>
              <mesh geometry={GEOM_SHOULDER} material={outfitMat} />
              <group position={[0.02, -0.11, 0.06]} rotation={[0.55, 0, -0.28]}>
                <mesh geometry={GEOM_ARM_SEGMENT} material={outfitMat} />
                <group position={[0, -0.11, 0.06]} rotation={[-0.92, 0, -0.40]}>
                  <mesh geometry={GEOM_FOREARM} material={outfitMat} />
                  <mesh geometry={GEOM_HAND} material={skinMat} position={[-0.03, -0.11, 0.04]} />
                </group>
              </group>
            </group>

            {/* Book held at chest/waist level */}
            <group position={[0, 0.32, 0.30]} rotation={[0.72, 0, 0]}>
              <OpenBook coverColor={config.bookColor} />
            </group>

            {/* Standing Legs with natural weight shift */}
            <mesh geometry={GEOM_THIGH} material={pantsMat} position={[-0.10, -0.18, 0]} rotation={[0.04, 0, 0.02]} />
            <mesh geometry={GEOM_THIGH} material={pantsMat} position={[0.10, -0.18, 0]} rotation={[-0.02, 0, -0.02]} />

            <mesh geometry={GEOM_CALF} material={pantsMat} position={[-0.10, -0.54, 0]} />
            <mesh geometry={GEOM_CALF} material={pantsMat} position={[0.10, -0.54, 0]} />

            {/* Shoes */}
            <mesh geometry={GEOM_SHOE} material={shoeMat} position={[-0.10, -0.84, 0.04]} />
            <mesh geometry={GEOM_SHOE} material={shoeMat} position={[0.10, -0.84, 0.04]} />
          </group>
        </group>
      );
    }

    // ---------------------------------------------------------
    // 5. LEANING ON MEZZANINE BALCONY (Level 2, Y = 5.2m)
    // ---------------------------------------------------------
    case 'leaning_balcony': {
      return (
        <group position={config.position} rotation={[0, config.rotationY, 0]}>
          <group ref={figureGroupRef} position={[0, 0.88, 0]}>
            {/* Leaning gently forward against the glass balustrade */}
            <mesh geometry={GEOM_TORSO_MALE} material={outfitMat} position={[0, 0.25, 0.06]} rotation={[0.15, 0, 0]} />
            <mesh geometry={GEOM_NECK} material={skinMat} position={[0, 0.52, 0.10]} />

            {/* Head looking down into the grand atrium */}
            <group ref={headGroupRef} position={[0, 0.64, 0.14]} rotation={[-0.28, 0, 0]}>
              <mesh geometry={GEOM_HEAD} material={skinMat} />
              <mesh geometry={GEOM_HAIR_SHORT} material={hairMat} position={[0, 0.03, 0]} />
            </group>

            {/* Forearms resting comfortably on the 1.22m handrail */}
            <group position={[-0.19, 0.42, 0.06]}>
              <group position={[-0.02, -0.11, 0.08]} rotation={[0.75, 0, 0.18]}>
                <mesh geometry={GEOM_ARM_SEGMENT} material={outfitMat} />
                <group position={[0, -0.11, 0.06]} rotation={[-0.85, 0, 0.15]}>
                  <mesh geometry={GEOM_FOREARM} material={outfitMat} />
                  <mesh geometry={GEOM_HAND} material={skinMat} position={[0.02, -0.11, 0.04]} />
                </group>
              </group>
            </group>

            <group position={[0.19, 0.42, 0.06]}>
              <group position={[0.02, -0.11, 0.08]} rotation={[0.75, 0, -0.18]}>
                <mesh geometry={GEOM_ARM_SEGMENT} material={outfitMat} />
                <group position={[0, -0.11, 0.06]} rotation={[-0.85, 0, -0.15]}>
                  <mesh geometry={GEOM_FOREARM} material={outfitMat} />
                  <mesh geometry={GEOM_HAND} material={skinMat} position={[-0.02, -0.11, 0.04]} />
                </group>
              </group>
            </group>

            {/* Open Book or Digital Pad resting on handrail */}
            <group position={[0, 0.35, 0.32]} rotation={[0.22, 0, 0]}>
              <OpenBook coverColor={config.bookColor} />
            </group>

            {/* Standing Legs */}
            <mesh geometry={GEOM_THIGH} material={pantsMat} position={[-0.10, -0.18, 0.02]} rotation={[0.06, 0, 0]} />
            <mesh geometry={GEOM_THIGH} material={pantsMat} position={[0.10, -0.18, 0.02]} rotation={[0.06, 0, 0]} />

            <mesh geometry={GEOM_CALF} material={pantsMat} position={[-0.10, -0.54, 0]} />
            <mesh geometry={GEOM_CALF} material={pantsMat} position={[0.10, -0.54, 0]} />

            <mesh geometry={GEOM_SHOE} material={shoeMat} position={[-0.10, -0.84, 0.02]} />
            <mesh geometry={GEOM_SHOE} material={shoeMat} position={[0.10, -0.84, 0.02]} />
          </group>
        </group>
      );
    }

    default:
      return null;
  }
};

// -------------------------------------------------------------
// CURATED SCHOLARS / READERS POPULATION THROUGHOUT THE LIBRARY
// -------------------------------------------------------------
const READERS_COLLECTION: ReaderConfig[] = [
  // --- READERS AT STUDY DESKS ---
  {
    id: 'desk-reader-1',
    name: 'Dr. Sarah Lin (ML Research Fellow)',
    pose: 'sitting_desk',
    position: [-20, 0, 4.45], // Front West Desk (facing north into desk)
    rotationY: 0,
    outfitColor: '#1E3A8A', // Classic Navy Blue Blazer
    pantsColor: '#334155', // Charcoal Chinos
    skinColor: '#FBD38D', // Warm Ivory Skin
    hairColor: '#1C1917', // Espresso Black
    hairStyle: 'bun',
    hasGlasses: true,
    bookColor: '#0284C7', // Azure Machine Learning Guide
    hasMug: true,
  },
  {
    id: 'desk-reader-2',
    name: 'Marcus Vance (Systems Architect)',
    pose: 'sitting_desk',
    position: [20, 0, 4.45], // Front East Desk (facing north into desk)
    rotationY: 0,
    outfitColor: '#374151', // Charcoal Heather Knit
    pantsColor: '#1E293B', // Slate Denim
    skinColor: '#D97706', // Warm Bronze Skin
    hairColor: '#0F172A', // Jet Black
    hairStyle: 'short',
    hasGlasses: false,
    bookColor: '#D97706', // Gold Architecture Manual
    hasMug: true,
  },
  {
    id: 'desk-reader-3',
    name: 'Elena Rostova (Data Scientist)',
    pose: 'sitting_desk',
    position: [-20, 0, -29.55], // Rear West Desk (facing north into desk)
    rotationY: 0,
    outfitColor: '#047857', // Forest Green Cardigan
    pantsColor: '#475569', // Gray Slacks
    skinColor: '#FED7AA', // Peach Skin
    hairColor: '#B45309', // Warm Auburn Hair
    hairStyle: 'short',
    hasGlasses: true,
    bookColor: '#059669', // Emerald Statistical Handbook
    hasMug: true,
  },
  {
    id: 'desk-reader-4',
    name: 'Aarav Patel (Algorithms Researcher)',
    pose: 'sitting_desk',
    position: [20, 0, -29.55], // Rear East Desk (facing north into desk)
    rotationY: 0,
    outfitColor: '#7C2D12', // Deep Burgundy Cardigan
    pantsColor: '#1E293B', // Dark Navy Trousers
    skinColor: '#B45309', // Rich Warm Tan Skin
    hairColor: '#171717', // Black Hair
    hairStyle: 'short',
    hasGlasses: true,
    bookColor: '#EA580C', // Deep Orange DSA Manual
    hasMug: false,
  },

  // --- READERS IN ROTUNDA SUNKEN AMPHITHEATER (Center Z = -14m) ---
  {
    id: 'rotunda-sofa-1',
    name: 'Chloe Monet (Philosophy & Sacred Arts Scholar)',
    pose: 'sitting_sofa',
    position: [6.8, 0, -9.2], // Southeast curve of plush sofa ring
    rotationY: -Math.PI / 3, // Facing southwest towards central fountain
    outfitColor: '#6B21A8', // Royal Amethyst Knit
    pantsColor: '#E2E8F0', // Cream Slacks
    skinColor: '#FDE68A', // Warm Fair Skin
    hairColor: '#451A03', // Chestnut Brown
    hairStyle: 'bun',
    hasGlasses: false,
    bookColor: '#7C3AED', // Violet Sacred Scripture
  },
  {
    id: 'rotunda-sofa-2',
    name: 'Kenji Takahashi (Robotics Engineer)',
    pose: 'sitting_sofa',
    position: [-6.8, 0, -18.8], // Northwest curve of plush sofa ring
    rotationY: (2 * Math.PI) / 3, // Facing southeast towards fountain
    outfitColor: '#0F766E', // Deep Teal Jacket
    pantsColor: '#334155', // Charcoal Trousers
    skinColor: '#FDE047', // Light Tan Skin
    hairColor: '#18181B', // Dark Slate Hair
    hairStyle: 'short',
    hasGlasses: true,
    bookColor: '#0D9488', // Teal Neural Network Text
  },
  {
    id: 'rotunda-step-1',
    name: 'Maya Al-Mansoor (Graduate Student)',
    pose: 'sitting_step',
    position: [0, 0, -6.8], // Southern stepped terrace near rotunda table
    rotationY: Math.PI, // Facing south towards nave
    outfitColor: '#BE185D', // Magenta Cashmere
    pantsColor: '#0F172A', // Midnight Slacks
    skinColor: '#D97706', // Olive Skin
    hairColor: '#171717', // Dark Hair
    hairStyle: 'bun',
    hasGlasses: false,
    bookColor: '#E11D48', // Rose Python Guide
  },

  // --- READERS STANDING IN BOOK AISLES ---
  {
    id: 'aisle-standing-west',
    name: 'David Zhao (Python Core Contributor)',
    pose: 'standing_aisle',
    position: [-32, 0, 7.5], // West Wing aisle (Python Section)
    rotationY: -Math.PI / 2 + 0.35, // Angled slightly towards the bookshelf
    outfitColor: '#1E293B', // Charcoal Minimalist Jacket
    pantsColor: '#334155', // Slate Pants
    skinColor: '#FDE68A', // Warm Light Skin
    hairColor: '#262626', // Black Hair
    hairStyle: 'short',
    hasGlasses: true,
    bookColor: '#2563EB', // Python Blue Book
  },
  {
    id: 'aisle-standing-east',
    name: 'Dr. Fatima Idris (Data Science Lead)',
    pose: 'standing_aisle',
    position: [32, 0, 7.5], // East Wing aisle (Data Science Section)
    rotationY: Math.PI / 2 - 0.35, // Angled towards bookshelf
    outfitColor: '#0369A1', // Ocean Blue Blazer
    pantsColor: '#E2E8F0', // Sand Beige Trousers
    skinColor: '#92400E', // Rich Deep Bronze Skin
    hairColor: '#09090B', // Dark Hair
    hairStyle: 'bun',
    hasGlasses: false,
    bookColor: '#0284C7', // Cyan Data Wrangling Handbook
  },
  {
    id: 'aisle-standing-north',
    name: 'Julian Sterling (Bioinformatics Scholar)',
    pose: 'standing_aisle',
    position: [-8, 0, 20.5], // Interviews & Mastery section
    rotationY: Math.PI / 4,
    outfitColor: '#475569', // Heather Gray Sweater
    pantsColor: '#1E293B', // Dark Slacks
    skinColor: '#FBCFE8', // Fair Rosy Skin
    hairColor: '#CA8A04', // Honey Blond Hair
    hairStyle: 'short',
    hasGlasses: true,
    bookColor: '#F59E0B', // Gold Interview Handbook
  },

  // --- READER ON MEZZANINE BALCONY (Level 2, Y = 5.2m, Z = -14m) ---
  {
    id: 'mezzanine-balcony-reader',
    name: 'Professor Henrik Lindqvist (Library Archivist)',
    pose: 'leaning_balcony',
    position: [0, 5.2, -2.6], // Overlooking rotunda from southern mezzanine railing
    rotationY: Math.PI, // Facing south towards nave & grand chandelier
    outfitColor: '#4338CA', // Indigo Wool Overcoat
    pantsColor: '#1E1B4B', // Deep Indigo Trousers
    skinColor: '#FEF08A', // Nordic Fair Skin
    hairColor: '#E2E8F0', // Distinguished Silver Gray
    hairStyle: 'short',
    hasGlasses: true,
    bookColor: '#4F46E5', // Indigo Leather-Bound Volume
  },
];

// -------------------------------------------------------------
// PRIMARY EXPORT: LIBRARY READERS SCENE LAYER
// -------------------------------------------------------------
export const LibraryReaders: React.FC = () => {
  return (
    <group>
      {READERS_COLLECTION.map((reader) => (
        <ReaderFigure key={reader.id} config={reader} />
      ))}
    </group>
  );
};
