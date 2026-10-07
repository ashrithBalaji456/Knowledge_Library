import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useLibraryStore } from '../../store/useLibraryStore';

// Generate modular architectural floor texture with visible dark blue-gray panels
let cachedArchitecturalFloorTexture: THREE.CanvasTexture | null = null;
function getArchitecturalFloorTexture(): THREE.CanvasTexture {
  if (cachedArchitecturalFloorTexture) return cachedArchitecturalFloorTexture;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Base architectural dark blue-gray (clearly visible tonal separation!)
  ctx.fillStyle = '#162032';
  ctx.fillRect(0, 0, 1024, 1024);

  // Large geometric panels (256x256 px tiles)
  const tileSize = 256;
  const panelColors = ['#1D2A40', '#1A263B', '#202E44', '#182436'];

  for (let y = 0; y < 1024; y += tileSize) {
    for (let x = 0; x < 1024; x += tileSize) {
      const idx = (Math.floor(x / tileSize) + Math.floor(y / tileSize)) % panelColors.length;
      ctx.fillStyle = panelColors[idx];
      ctx.fillRect(x + 3, y + 3, tileSize - 6, tileSize - 6);

      // Fine brushed graphite surface texture
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.04)';
      ctx.lineWidth = 1;
      for (let g = 12; g < tileSize; g += 32) {
        ctx.beginPath();
        ctx.moveTo(x + 6, y + g);
        ctx.lineTo(x + tileSize - 6, y + g);
        ctx.stroke();
      }

      // Clean architectural bevel seam
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 4;
      ctx.strokeRect(x + 1, y + 1, tileSize - 2, tileSize - 2);

      // Delicate embedded corner guidance node
      ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.fillRect(x + 7, y + 7, 3, 3);
      ctx.fillRect(x + tileSize - 10, y + 7, 3, 3);
      ctx.fillRect(x + 7, y + tileSize - 10, 3, 3);
      ctx.fillRect(x + tileSize - 10, y + tileSize - 10, 3, 3);
    }
  }

  cachedArchitecturalFloorTexture = new THREE.CanvasTexture(canvas);
  cachedArchitecturalFloorTexture.wrapS = THREE.RepeatWrapping;
  cachedArchitecturalFloorTexture.wrapT = THREE.RepeatWrapping;
  cachedArchitecturalFloorTexture.repeat.set(16, 22);
  return cachedArchitecturalFloorTexture;
}

// Reusable static geometries
const SHARED_BOX_GEOMETRY = new THREE.BoxGeometry(1, 1, 1);
const SHARED_CYLINDER_GEOMETRY = new THREE.CylinderGeometry(1, 1, 1, 16);

export const LibraryArchitecture: React.FC = () => {
  const atmosphere = useLibraryStore((s) => s.atmosphere);
  const floorTexture = useMemo(() => getArchitecturalFloorTexture(), []);

  // Animated refs for Knowledge Core gyroscopic rings and floating crystal
  const coreRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  const ring3Ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (coreRef.current) {
      coreRef.current.position.y = 3.6 + Math.sin(time * 1.2) * 0.15;
      coreRef.current.rotation.y = time * 0.4;
      coreRef.current.rotation.x = Math.sin(time * 0.5) * 0.1;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = time * 0.7;
      ring1Ref.current.rotation.y = time * 0.3;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -time * 0.55;
      ring2Ref.current.rotation.z = time * 0.4;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z = -time * 0.65;
      ring3Ref.current.rotation.x = time * 0.45;
    }
  });

  // Balanced architectural materials (distinct, readable tones — never pitch black!)
  const floorMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: floorTexture,
        roughness: 0.32,
        metalness: 0.25,
      }),
    [floorTexture]
  );

  const runnerMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1E2C44', // Dark blue-gray polished runner
        roughness: 0.22,
        metalness: 0.45,
      }),
    []
  );

  const wallMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#182234', // Visible dark slate-graphite walls
        roughness: 0.65,
        metalness: 0.22,
      }),
    []
  );

  const titaniumTrimMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#334155', // Slate titanium alloy
        roughness: 0.3,
        metalness: 0.75,
      }),
    []
  );

  const pylonMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#243248', // Structural column alloy
        roughness: 0.35,
        metalness: 0.6,
      }),
    []
  );

  const smokedGlassMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#0284C7',
        roughness: 0.08,
        metalness: 0.15,
        transparent: true,
        opacity: 0.48,
        transmission: 0.55,
        reflectivity: 0.85,
      }),
    []
  );

  const cyanLightMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#22D3EE',
      }),
    []
  );

  const violetLightMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#A78BFA',
      }),
    []
  );

  const skylightGlassMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#38BDF8',
        roughness: 0.05,
        metalness: 0.1,
        transparent: true,
        opacity: 0.35,
        transmission: 0.7,
      }),
    []
  );

  // Exterior skyline silhouette materials
  const skylineBuildingMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: atmosphere === 'day' ? '#1E293B' : atmosphere === 'evening' ? '#1E1B4B' : '#0F172A',
        roughness: 0.8,
        metalness: 0.3,
      }),
    [atmosphere]
  );

  // Positions for 10 structural rib arches across the length of the hall
  const archRibZPositions = [32, 16, 0, -16, -32, -48, -64, -80, -96, -112];

  // Atrium center point
  const ATRIUM_Z = -18;
  const ATRIUM_RADIUS = 15;

  return (
    <group>
      {/* ========================================================= */}
      {/* 1. ARCHITECTURAL MODULAR FLOOR (120m x 168m)              */}
      {/* ========================================================= */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, -38]} receiveShadow>
        <planeGeometry args={[120, 168]} />
        <primitive object={floorMaterial} attach="material" />
      </mesh>

      {/* Central Nave Polished Runner (X in [-5, 5], Z from 38 to -114) */}
      <mesh position={[0, 0.005, -38]}>
        <boxGeometry args={[10.5, 0.015, 152]} />
        <primitive object={runnerMaterial} attach="material" />
      </mesh>

      {/* Twin Longitudinal Embedded Floor Guidance Tracks */}
      <mesh position={[-5.2, 0.018, -38]}>
        <boxGeometry args={[0.06, 0.01, 152]} />
        <primitive object={cyanLightMaterial} attach="material" />
      </mesh>
      <mesh position={[5.2, 0.018, -38]}>
        <boxGeometry args={[0.06, 0.01, 152]} />
        <primitive object={cyanLightMaterial} attach="material" />
      </mesh>

      {/* ========================================================= */}
      {/* 2. CENTRAL GRAND ATRIUM ROTUNDA (Center at X=0, Z=-18)     */}
      {/* ========================================================= */}
      <group position={[0, 0, ATRIUM_Z]}>
        {/* Ground Concourse Circular Stepped Plaza Base */}
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[ATRIUM_RADIUS, ATRIUM_RADIUS + 0.6, 0.08, 48]} />
          <primitive object={pylonMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 0.085, 0]}>
          <cylinderGeometry args={[ATRIUM_RADIUS - 0.4, ATRIUM_RADIUS - 0.4, 0.01, 48]} />
          <primitive object={runnerMaterial} attach="material" />
        </mesh>

        {/* Concentric Inlaid Luminous Guidance Rings on Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.092, 0]}>
          <ringGeometry args={[5.8, 5.92, 48]} />
          <primitive object={cyanLightMaterial} attach="material" />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.092, 0]}>
          <ringGeometry args={[9.8, 9.92, 48]} />
          <primitive object={violetLightMaterial} attach="material" />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.092, 0]}>
          <ringGeometry args={[13.8, 13.92, 48]} />
          <primitive object={cyanLightMaterial} attach="material" />
        </mesh>

        {/* 8 Giant Structural Colonnade Pylons around the Atrium (H = 14m) */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * Math.PI) / 4;
          const colX = Math.cos(angle) * (ATRIUM_RADIUS - 0.8);
          const colZ = Math.sin(angle) * (ATRIUM_RADIUS - 0.8);
          return (
            <group key={i} position={[colX, 7.0, colZ]}>
              {/* Main Structural Hexagonal Pylon */}
              <mesh>
                <cylinderGeometry args={[0.55, 0.65, 14.0, 6]} />
                <primitive object={pylonMaterial} attach="material" />
              </mesh>
              {/* Titanium Vertical Cladding Flange */}
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.2, 13.8, 1.4]} />
                <primitive object={titaniumTrimMaterial} attach="material" />
              </mesh>
              {/* Vertical Cyan Architectural Light Reveal */}
              <mesh position={[0, 0, 0.72]}>
                <boxGeometry args={[0.04, 13.0, 0.04]} />
                <primitive object={cyanLightMaterial} attach="material" />
              </mesh>
              {/* Pylon Capital Collar at Mezzanine Level (Y = 4.8m) */}
              <mesh position={[0, -2.2, 0]}>
                <cylinderGeometry args={[0.85, 0.85, 0.35, 8]} />
                <primitive object={titaniumTrimMaterial} attach="material" />
              </mesh>
              {/* Pylon Upper Capital at Level 3 (Y = 9.2m) */}
              <mesh position={[0, 2.2, 0]}>
                <cylinderGeometry args={[0.85, 0.85, 0.35, 8]} />
                <primitive object={titaniumTrimMaterial} attach="material" />
              </mesh>
            </group>
          );
        })}

        {/* --- LEVEL 2: CIRCULAR MEZZANINE BALCONY (Y = 4.8m) --- */}
        <group position={[0, 4.8, 0]}>
          {/* Circular Mezzanine Walking Deck (Inner R = 11.2m, Outer R = 16.0m) */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <ringGeometry args={[11.2, 16.0, 48]} />
            <primitive object={runnerMaterial} attach="material" />
          </mesh>
          {/* Deck Structural Under-Casing */}
          <mesh position={[0, -0.22, 0]}>
            <cylinderGeometry args={[16.1, 16.1, 0.44, 48, 1, true]} />
            <primitive object={titaniumTrimMaterial} attach="material" />
          </mesh>
          <mesh position={[0, -0.22, 0]}>
            <cylinderGeometry args={[11.1, 11.1, 0.44, 48, 1, true]} />
            <primitive object={titaniumTrimMaterial} attach="material" />
          </mesh>

          {/* Curved Smoked Glass Balustrade Overlooking the Atrium Core (H = 1.15m) */}
          <mesh position={[0, 0.58, 0]}>
            <cylinderGeometry args={[11.2, 11.2, 1.15, 48, 1, true]} />
            <primitive object={smokedGlassMaterial} attach="material" />
          </mesh>
          {/* Brushed Titanium Top Handrail */}
          <mesh position={[0, 1.18, 0]}>
            <torusGeometry args={[11.2, 0.05, 8, 48]} />
            <primitive object={titaniumTrimMaterial} attach="material" />
          </mesh>
          {/* Luminous Cyan Railing Base Channel */}
          <mesh position={[0, 0.02, 0]}>
            <torusGeometry args={[11.2, 0.025, 8, 48]} />
            <primitive object={cyanLightMaterial} attach="material" />
          </mesh>

          {/* Outer Perimeter Glass Balustrade */}
          <mesh position={[0, 0.58, 0]}>
            <cylinderGeometry args={[16.0, 16.0, 1.15, 48, 1, true]} />
            <primitive object={smokedGlassMaterial} attach="material" />
          </mesh>
          <mesh position={[0, 1.18, 0]}>
            <torusGeometry args={[16.0, 0.05, 8, 48]} />
            <primitive object={titaniumTrimMaterial} attach="material" />
          </mesh>
        </group>

        {/* --- LEVEL 3: UPPER CANTILEVERED VIEWING GALLERIA (Y = 9.2m) --- */}
        <group position={[0, 9.2, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[14.2, 17.2, 48]} />
            <primitive object={titaniumTrimMaterial} attach="material" />
          </mesh>
          {/* Glass Railing */}
          <mesh position={[0, 0.55, 0]}>
            <cylinderGeometry args={[14.2, 14.2, 1.1, 48, 1, true]} />
            <primitive object={smokedGlassMaterial} attach="material" />
          </mesh>
          <mesh position={[0, 1.12, 0]}>
            <torusGeometry args={[14.2, 0.04, 8, 48]} />
            <primitive object={titaniumTrimMaterial} attach="material" />
          </mesh>
          {/* Recessed Ambient Indigo Ring */}
          <mesh position={[0, -0.05, 0]}>
            <torusGeometry args={[14.2, 0.03, 8, 48]} />
            <primitive object={violetLightMaterial} attach="material" />
          </mesh>
        </group>

        {/* ========================================================= */}
        {/* THE ICONIC FLOATING KNOWLEDGE CORE MONUMENT               */}
        {/* ========================================================= */}
        <group position={[0, 0, 0]}>
          {/* Stepped Architectural Core Plinth */}
          <mesh position={[0, 0.22, 0]}>
            <cylinderGeometry args={[3.2, 3.8, 0.44, 24]} />
            <primitive object={titaniumTrimMaterial} attach="material" />
          </mesh>
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[2.2, 2.6, 0.2, 24]} />
            <primitive object={pylonMaterial} attach="material" />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.61, 0]}>
            <ringGeometry args={[1.9, 2.05, 32]} />
            <primitive object={cyanLightMaterial} attach="material" />
          </mesh>

          {/* Central Levitating Knowledge Core Crystal */}
          <group ref={coreRef} position={[0, 3.6, 0]}>
            {/* Outer Luminous Holographic Crystal */}
            <mesh>
              <octahedronGeometry args={[1.35, 1]} />
              <primitive object={smokedGlassMaterial} attach="material" />
            </mesh>
            {/* Inner Glowing Dense Core */}
            <mesh>
              <octahedronGeometry args={[0.9, 0]} />
              <primitive object={cyanLightMaterial} attach="material" />
            </mesh>
            {/* Inner Wireframe Cyber Matrix */}
            <mesh>
              <icosahedronGeometry args={[1.45, 1]} />
              <meshBasicMaterial color="#38BDF8" wireframe transparent opacity={0.35} />
            </mesh>
          </group>

          {/* 3 Concentric Gyroscopic Orbital Titanium Rings */}
          <group ref={ring1Ref} position={[0, 3.6, 0]}>
            <mesh>
              <torusGeometry args={[2.3, 0.05, 12, 48]} />
              <primitive object={titaniumTrimMaterial} attach="material" />
            </mesh>
            <mesh>
              <torusGeometry args={[2.3, 0.018, 8, 48]} />
              <primitive object={cyanLightMaterial} attach="material" />
            </mesh>
          </group>

          <group ref={ring2Ref} position={[0, 3.6, 0]}>
            <mesh>
              <torusGeometry args={[3.1, 0.045, 12, 48]} />
              <primitive object={titaniumTrimMaterial} attach="material" />
            </mesh>
            <mesh>
              <torusGeometry args={[3.1, 0.015, 8, 48]} />
              <primitive object={violetLightMaterial} attach="material" />
            </mesh>
          </group>

          <group ref={ring3Ref} position={[0, 3.6, 0]}>
            <mesh>
              <torusGeometry args={[3.9, 0.04, 12, 48]} />
              <primitive object={titaniumTrimMaterial} attach="material" />
            </mesh>
            <mesh>
              <torusGeometry args={[3.9, 0.012, 8, 48]} />
              <primitive object={cyanLightMaterial} attach="material" />
            </mesh>
          </group>

          {/* Ascending Vertical Holographic Data Beam through the Atrium into Skylight */}
          <mesh position={[0, 8.5, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 10.0, 16]} />
            <meshBasicMaterial color="#38BDF8" transparent opacity={0.22} depthWrite={false} />
          </mesh>
          <mesh position={[0, 8.5, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 10.0, 16]} />
            <meshBasicMaterial color="#FFFFFF" transparent opacity={0.45} depthWrite={false} />
          </mesh>
        </group>
      </group>

      {/* ========================================================= */}
      {/* 3. MULTI-LEVEL SKY BRIDGES & CONNECTING PROMENADES (Y=4.8m) */}
      {/* ========================================================= */}
      {/* SOUTH SKYBRIDGE: Spanning nave at Z = 6m (X in [-20, 20]) */}
      <group position={[0, 4.8, 6]}>
        {/* Bridge Structural Deck */}
        <mesh position={[0, -0.15, 0]}>
          <boxGeometry args={[40, 0.3, 4.2]} />
          <primitive object={titaniumTrimMaterial} attach="material" />
        </mesh>
        {/* Smoked Glass Walking Surface */}
        <mesh position={[0, 0.01, 0]}>
          <boxGeometry args={[39.8, 0.02, 3.8]} />
          <primitive object={runnerMaterial} attach="material" />
        </mesh>
        {/* North Glass Railing */}
        <mesh position={[0, 0.6, -2.0]}>
          <boxGeometry args={[40, 1.15, 0.06]} />
          <primitive object={smokedGlassMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 1.18, -2.0]}>
          <boxGeometry args={[40, 0.05, 0.08]} />
          <primitive object={titaniumTrimMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 0.02, -2.0]}>
          <boxGeometry args={[40, 0.02, 0.04]} />
          <primitive object={cyanLightMaterial} attach="material" />
        </mesh>
        {/* South Glass Railing */}
        <mesh position={[0, 0.6, 2.0]}>
          <boxGeometry args={[40, 1.15, 0.06]} />
          <primitive object={smokedGlassMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 1.18, 2.0]}>
          <boxGeometry args={[40, 0.05, 0.08]} />
          <primitive object={titaniumTrimMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 0.02, 2.0]}>
          <boxGeometry args={[40, 0.02, 0.04]} />
          <primitive object={cyanLightMaterial} attach="material" />
        </mesh>
      </group>

      {/* NORTH SKYBRIDGE: Spanning nave at Z = -42m (X in [-20, 20]) */}
      <group position={[0, 4.8, -42]}>
        <mesh position={[0, -0.15, 0]}>
          <boxGeometry args={[40, 0.3, 4.2]} />
          <primitive object={titaniumTrimMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 0.01, 0]}>
          <boxGeometry args={[39.8, 0.02, 3.8]} />
          <primitive object={runnerMaterial} attach="material" />
        </mesh>
        {/* North Glass Railing */}
        <mesh position={[0, 0.6, -2.0]}>
          <boxGeometry args={[40, 1.15, 0.06]} />
          <primitive object={smokedGlassMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 1.18, -2.0]}>
          <boxGeometry args={[40, 0.05, 0.08]} />
          <primitive object={titaniumTrimMaterial} attach="material" />
        </mesh>
        {/* South Glass Railing */}
        <mesh position={[0, 0.6, 2.0]}>
          <boxGeometry args={[40, 1.15, 0.06]} />
          <primitive object={smokedGlassMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 1.18, 2.0]}>
          <boxGeometry args={[40, 0.05, 0.08]} />
          <primitive object={titaniumTrimMaterial} attach="material" />
        </mesh>
      </group>

      {/* Longitudinal Promenades at X = +/-15m connecting South & North Bridges */}
      {[-15, 15].map((xPos, idx) => (
        <group key={idx} position={[xPos, 4.8, -18]}>
          <mesh position={[0, -0.15, 0]}>
            <boxGeometry args={[3.2, 0.3, 48]} />
            <primitive object={titaniumTrimMaterial} attach="material" />
          </mesh>
          <mesh position={[0, 0.01, 0]}>
            <boxGeometry args={[3.0, 0.02, 47.8]} />
            <primitive object={runnerMaterial} attach="material" />
          </mesh>
        </group>
      ))}

      {/* ========================================================= */}
      {/* 4. PEDESTRIAN ACCESS RAMPS (Ascending from Ground to Level 2) */}
      {/* ========================================================= */}
      {/* West Ramp: from X=-15, Z=24 (Y=0) to Z=6 (Y=4.8m) */}
      <group position={[-15, 2.4, 15]}>
        {/* Inclined Deck: Length = sqrt(18^2 + 4.8^2) = 18.63m, slope angle = atan2(4.8, 18) = 0.26 rad */}
        <group rotation={[0.26, 0, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[3.4, 0.25, 18.8]} />
            <primitive object={titaniumTrimMaterial} attach="material" />
          </mesh>
          <mesh position={[0, 0.14, 0]}>
            <boxGeometry args={[3.2, 0.02, 18.6]} />
            <primitive object={runnerMaterial} attach="material" />
          </mesh>
          {/* Left Glass Railing */}
          <mesh position={[-1.65, 0.65, 0]}>
            <boxGeometry args={[0.05, 1.15, 18.6]} />
            <primitive object={smokedGlassMaterial} attach="material" />
          </mesh>
          <mesh position={[-1.65, 1.25, 0]}>
            <boxGeometry args={[0.08, 0.05, 18.6]} />
            <primitive object={titaniumTrimMaterial} attach="material" />
          </mesh>
          {/* Right Glass Railing */}
          <mesh position={[1.65, 0.65, 0]}>
            <boxGeometry args={[0.05, 1.15, 18.6]} />
            <primitive object={smokedGlassMaterial} attach="material" />
          </mesh>
          <mesh position={[1.65, 1.25, 0]}>
            <boxGeometry args={[0.08, 0.05, 18.6]} />
            <primitive object={titaniumTrimMaterial} attach="material" />
          </mesh>
          {/* Floor Guidance Strip */}
          <mesh position={[0, 0.16, 0]}>
            <boxGeometry args={[0.06, 0.01, 18.6]} />
            <primitive object={cyanLightMaterial} attach="material" />
          </mesh>
        </group>
        {/* Support Pylons underneath the ramp */}
        <mesh position={[0, -1.2, 0]}>
          <cylinderGeometry args={[0.3, 0.35, 2.4, 12]} />
          <primitive object={pylonMaterial} attach="material" />
        </mesh>
      </group>

      {/* East Ramp: from X=15, Z=24 (Y=0) to Z=6 (Y=4.8m) */}
      <group position={[15, 2.4, 15]}>
        <group rotation={[0.26, 0, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[3.4, 0.25, 18.8]} />
            <primitive object={titaniumTrimMaterial} attach="material" />
          </mesh>
          <mesh position={[0, 0.14, 0]}>
            <boxGeometry args={[3.2, 0.02, 18.6]} />
            <primitive object={runnerMaterial} attach="material" />
          </mesh>
          {/* Left Glass Railing */}
          <mesh position={[-1.65, 0.65, 0]}>
            <boxGeometry args={[0.05, 1.15, 18.6]} />
            <primitive object={smokedGlassMaterial} attach="material" />
          </mesh>
          <mesh position={[-1.65, 1.25, 0]}>
            <boxGeometry args={[0.08, 0.05, 18.6]} />
            <primitive object={titaniumTrimMaterial} attach="material" />
          </mesh>
          {/* Right Glass Railing */}
          <mesh position={[1.65, 0.65, 0]}>
            <boxGeometry args={[0.05, 1.15, 18.6]} />
            <primitive object={smokedGlassMaterial} attach="material" />
          </mesh>
          <mesh position={[1.65, 1.25, 0]}>
            <boxGeometry args={[0.08, 0.05, 18.6]} />
            <primitive object={titaniumTrimMaterial} attach="material" />
          </mesh>
          {/* Floor Guidance Strip */}
          <mesh position={[0, 0.16, 0]}>
            <boxGeometry args={[0.06, 0.01, 18.6]} />
            <primitive object={cyanLightMaterial} attach="material" />
          </mesh>
        </group>
        {/* Support Pylons underneath the ramp */}
        <mesh position={[0, -1.2, 0]}>
          <cylinderGeometry args={[0.3, 0.35, 2.4, 12]} />
          <primitive object={pylonMaterial} attach="material" />
        </mesh>
      </group>

      {/* ========================================================= */}
      {/* 5. CATHEDRAL CURVED RIBS & GRAND GLASS SKYLIGHT RUN       */}
      {/* ========================================================= */}
      {/* 10 Grand Elliptical Structural Arch Ribs Spanning the Hall */}
      {archRibZPositions.map((zPos, idx) => (
        <group key={idx} position={[0, 0, zPos]}>
          {/* Left Arch Leg (X: -54 to -26, arching from Y=0 to 12) */}
          <mesh position={[-38, 7.5, 0]} rotation={[0, 0, 0.32]}>
            <boxGeometry args={[0.9, 16.5, 1.1]} />
            <primitive object={pylonMaterial} attach="material" />
          </mesh>
          {/* Right Arch Leg (X: 26 to 54, arching from Y=0 to 12) */}
          <mesh position={[38, 7.5, 0]} rotation={[0, 0, -0.32]}>
            <boxGeometry args={[0.9, 16.5, 1.1]} />
            <primitive object={pylonMaterial} attach="material" />
          </mesh>
          {/* Top Crown Arch Beam spanning the Central Nave at Y = 15.4m */}
          <mesh position={[0, 15.4, 0]}>
            <boxGeometry args={[56, 0.8, 1.2]} />
            <primitive object={titaniumTrimMaterial} attach="material" />
          </mesh>
          {/* Underside Indirect Architectural Cove Light Ribbon */}
          <mesh position={[0, 14.95, 0]}>
            <boxGeometry args={[54, 0.04, 0.22]} />
            <primitive object={cyanLightMaterial} attach="material" />
          </mesh>
        </group>
      ))}

      {/* Continuous Grand Glass Skylight (X in [-7.5, 7.5], Y = 15.6m, Z from 36 to -114) */}
      <group position={[0, 15.6, -39]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[15.2, 0.08, 152]} />
          <primitive object={skylightGlassMaterial} attach="material" />
        </mesh>
        {/* Skylight Titanium Center Spine & Transverse Mullions */}
        <mesh position={[0, 0.06, 0]}>
          <boxGeometry args={[0.3, 0.12, 152]} />
          <primitive object={titaniumTrimMaterial} attach="material" />
        </mesh>
        <mesh position={[-7.5, 0.06, 0]}>
          <boxGeometry args={[0.25, 0.12, 152]} />
          <primitive object={titaniumTrimMaterial} attach="material" />
        </mesh>
        <mesh position={[7.5, 0.06, 0]}>
          <boxGeometry args={[0.25, 0.12, 152]} />
          <primitive object={titaniumTrimMaterial} attach="material" />
        </mesh>
      </group>

      {/* Outer Vaulted Roof Shell */}
      <mesh position={[0, 16.2, -39]}>
        <boxGeometry args={[116, 0.6, 160]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>

      {/* ========================================================= */}
      {/* 6. PERIMETER WALLS & PANORAMIC NORTH GLASS CURTAIN WALL   */}
      {/* ========================================================= */}
      {/* South Wall (Behind player spawn at Z = 42) */}
      <group position={[0, 7.5, 42]}>
        <mesh>
          <boxGeometry args={[116, 15.2, 1.2]} />
          <primitive object={wallMaterial} attach="material" />
        </mesh>
        {/* Brushed Titanium Wainscoting */}
        <mesh position={[0, -5.5, -0.62]}>
          <boxGeometry args={[116, 3.8, 0.08]} />
          <primitive object={titaniumTrimMaterial} attach="material" />
        </mesh>
        <mesh position={[0, -3.5, -0.66]}>
          <boxGeometry args={[116, 0.04, 0.04]} />
          <primitive object={cyanLightMaterial} attach="material" />
        </mesh>
      </group>

      {/* West Wall (X = -56) */}
      <group position={[-56, 7.5, -39]}>
        <mesh>
          <boxGeometry args={[1.2, 15.2, 160]} />
          <primitive object={wallMaterial} attach="material" />
        </mesh>
        <mesh position={[0.62, -5.5, 0]}>
          <boxGeometry args={[0.08, 3.8, 160]} />
          <primitive object={titaniumTrimMaterial} attach="material" />
        </mesh>
        <mesh position={[0.66, -3.5, 0]}>
          <boxGeometry args={[0.04, 0.04, 160]} />
          <primitive object={cyanLightMaterial} attach="material" />
        </mesh>
      </group>

      {/* East Wall (X = 56) */}
      <group position={[56, 7.5, -39]}>
        <mesh>
          <boxGeometry args={[1.2, 15.2, 160]} />
          <primitive object={wallMaterial} attach="material" />
        </mesh>
        <mesh position={[-0.62, -5.5, 0]}>
          <boxGeometry args={[0.08, 3.8, 160]} />
          <primitive object={titaniumTrimMaterial} attach="material" />
        </mesh>
        <mesh position={[-0.66, -3.5, 0]}>
          <boxGeometry args={[0.04, 0.04, 160]} />
          <primitive object={cyanLightMaterial} attach="material" />
        </mesh>
      </group>

      {/* FAR NORTH END (Z = -118): GRAND PANORAMIC GLASS CURTAIN WALL */}
      <group position={[0, 7.5, -118]}>
        {/* Floor-to-Ceiling Smoked Blue Glass Curtain Wall */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[56, 15.0, 0.12]} />
          <primitive object={smokedGlassMaterial} attach="material" />
        </mesh>
        {/* Structural Mullions */}
        {[-24, -16, -8, 0, 8, 16, 24].map((mX, mIdx) => (
          <mesh key={mIdx} position={[mX, 0, 0.08]}>
            <boxGeometry args={[0.28, 15.0, 0.25]} />
            <primitive object={titaniumTrimMaterial} attach="material" />
          </mesh>
        ))}
        {/* Horizontal Mullion Beams at Y = 4.8m and Y = 9.6m */}
        <mesh position={[0, -2.7, 0.08]}>
          <boxGeometry args={[56, 0.35, 0.25]} />
          <primitive object={titaniumTrimMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 2.1, 0.08]}>
          <boxGeometry args={[56, 0.35, 0.25]} />
          <primitive object={titaniumTrimMaterial} attach="material" />
        </mesh>

        {/* Flanking Solid North Walls */}
        <mesh position={[-42, 0, 0]}>
          <boxGeometry args={[28, 15.0, 1.2]} />
          <primitive object={wallMaterial} attach="material" />
        </mesh>
        <mesh position={[42, 0, 0]}>
          <boxGeometry args={[28, 15.0, 1.2]} />
          <primitive object={wallMaterial} attach="material" />
        </mesh>
      </group>

      {/* ========================================================= */}
      {/* 7. DISTANT FUTURISTIC CITY SKYLINE (Seen through North Glass) */}
      {/* ========================================================= */}
      <group position={[0, 0, -145]}>
        {/* Central Megatower Spires */}
        <mesh position={[0, 28, 0]}>
          <boxGeometry args={[14, 56, 14]} />
          <primitive object={skylineBuildingMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 58, 0]}>
          <coneGeometry args={[1.8, 14, 8]} />
          <primitive object={titaniumTrimMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 65, 0]}>
          <sphereGeometry args={[0.3, 8, 8]} />
          <primitive object={cyanLightMaterial} attach="material" />
        </mesh>

        {/* West Cluster Skyscraper Towers */}
        <mesh position={[-26, 22, 10]}>
          <boxGeometry args={[10, 44, 10]} />
          <primitive object={skylineBuildingMaterial} attach="material" />
        </mesh>
        <mesh position={[-44, 18, 15]}>
          <boxGeometry args={[16, 36, 12]} />
          <primitive object={skylineBuildingMaterial} attach="material" />
        </mesh>
        {/* Subtle Horizontal Illuminated Skyway Bridge between Towers */}
        <mesh position={[-20, 26, 6]}>
          <boxGeometry args={[18, 1.6, 2.2]} />
          <primitive object={skylineBuildingMaterial} attach="material" />
        </mesh>
        <mesh position={[-20, 26, 7.2]}>
          <boxGeometry args={[18, 0.12, 0.05]} />
          <primitive object={cyanLightMaterial} attach="material" />
        </mesh>

        {/* East Cluster Skyscraper Towers */}
        <mesh position={[26, 24, 10]}>
          <boxGeometry args={[12, 48, 10]} />
          <primitive object={skylineBuildingMaterial} attach="material" />
        </mesh>
        <mesh position={[46, 19, 15]}>
          <boxGeometry args={[14, 38, 12]} />
          <primitive object={skylineBuildingMaterial} attach="material" />
        </mesh>
        <mesh position={[22, 28, 6]}>
          <boxGeometry args={[16, 1.6, 2.2]} />
          <primitive object={skylineBuildingMaterial} attach="material" />
        </mesh>
        <mesh position={[22, 28, 7.2]}>
          <boxGeometry args={[16, 0.12, 0.05]} />
          <primitive object={violetLightMaterial} attach="material" />
        </mesh>
      </group>

      {/* ========================================================= */}
      {/* 8. FUTURISTIC ARCHITECTURAL READING PODS (Concourse Bays) */}
      {/* ========================================================= */}
      {[
        [-20, 0, -2],
        [20, 0, -2],
        [-20, 0, -34],
        [20, 0, -34],
      ].map(([rX, rY, rZ], rIdx) => (
        <group key={rIdx} position={[rX, rY, rZ]}>
          {/* Circular Raised Glass Platform */}
          <mesh position={[0, 0.06, 0]}>
            <cylinderGeometry args={[3.2, 3.4, 0.12, 24]} />
            <primitive object={pylonMaterial} attach="material" />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.125, 0]}>
            <ringGeometry args={[2.9, 3.05, 32]} />
            <primitive object={cyanLightMaterial} attach="material" />
          </mesh>

          {/* Central Cantilevered Glass Study Table */}
          <mesh position={[0, 0.72, 0]}>
            <cylinderGeometry args={[1.35, 1.35, 0.06, 24]} />
            <primitive object={smokedGlassMaterial} attach="material" />
          </mesh>
          {/* Titanium Pedestal */}
          <mesh position={[0, 0.36, 0]}>
            <cylinderGeometry args={[0.22, 0.35, 0.72, 16]} />
            <primitive object={titaniumTrimMaterial} attach="material" />
          </mesh>
          {/* Table Ambient Edge Halo */}
          <mesh position={[0, 0.72, 0]}>
            <torusGeometry args={[1.35, 0.015, 8, 32]} />
            <primitive object={cyanLightMaterial} attach="material" />
          </mesh>

          {/* Holographic Research Console Hologram on Table */}
          <mesh position={[0, 0.95, 0]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.42, 0.28, 0.02]} />
            <meshBasicMaterial color="#38BDF8" transparent opacity={0.65} />
          </mesh>

          {/* 3 Ergonomic Curved Seating Pods around Table */}
          {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((sAngle, sIdx) => {
            const sX = Math.cos(sAngle) * 2.0;
            const sZ = Math.sin(sAngle) * 2.0;
            return (
              <group key={sIdx} position={[sX, 0, sZ]} rotation={[0, -sAngle - Math.PI / 2, 0]}>
                <mesh position={[0, 0.35, 0]}>
                  <cylinderGeometry args={[0.38, 0.42, 0.5, 16]} />
                  <primitive object={titaniumTrimMaterial} attach="material" />
                </mesh>
                <mesh position={[0, 0.75, 0.2]}>
                  <boxGeometry args={[0.62, 0.5, 0.12]} />
                  <primitive object={pylonMaterial} attach="material" />
                </mesh>
              </group>
            );
          })}
        </group>
      ))}
    </group>
  );
};
