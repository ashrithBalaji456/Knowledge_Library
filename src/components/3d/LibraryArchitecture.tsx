import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useLibraryStore } from '../../store/useLibraryStore';

// Generate ultra-luxurious polished architectural terrazzo/marble floor texture
let cachedLuxuryFloorTexture: THREE.CanvasTexture | null = null;
function getLuxuryFloorTexture(): THREE.CanvasTexture {
  if (cachedLuxuryFloorTexture) return cachedLuxuryFloorTexture;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Light, elegant pearl-gray architectural marble base (high visibility!)
  ctx.fillStyle = '#E2E8F0';
  ctx.fillRect(0, 0, 1024, 1024);

  // Large geometric panels (256x256 px tiles)
  const tileSize = 256;
  const panelColors = ['#F1F5F9', '#E2E8F0', '#F8FAFC', '#E2E8F0'];

  for (let y = 0; y < 1024; y += tileSize) {
    for (let x = 0; x < 1024; x += tileSize) {
      const idx = (Math.floor(x / tileSize) + Math.floor(y / tileSize)) % panelColors.length;
      ctx.fillStyle = panelColors[idx];
      ctx.fillRect(x + 2, y + 2, tileSize - 4, tileSize - 4);

      // Fine terrazzo flecks
      ctx.fillStyle = 'rgba(148, 163, 184, 0.2)';
      for (let f = 0; f < 12; f++) {
        const fx = x + 10 + (f * 19) % (tileSize - 20);
        const fy = y + 10 + (f * 29) % (tileSize - 20);
        ctx.fillRect(fx, fy, 2, 2);
      }

      // Crisp subtle champagne-metal tile joint
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 1, y + 1, tileSize - 2, tileSize - 2);

      // Delicate corner inlay
      ctx.fillStyle = 'rgba(217, 119, 6, 0.4)';
      ctx.fillRect(x + 4, y + 4, 3, 3);
      ctx.fillRect(x + tileSize - 7, y + 4, 3, 3);
      ctx.fillRect(x + 4, y + tileSize - 7, 3, 3);
      ctx.fillRect(x + tileSize - 7, y + tileSize - 7, 3, 3);
    }
  }

  cachedLuxuryFloorTexture = new THREE.CanvasTexture(canvas);
  cachedLuxuryFloorTexture.wrapS = THREE.RepeatWrapping;
  cachedLuxuryFloorTexture.wrapT = THREE.RepeatWrapping;
  cachedLuxuryFloorTexture.repeat.set(16, 22);
  return cachedLuxuryFloorTexture;
}

export const LibraryArchitecture: React.FC = () => {
  const atmosphere = useLibraryStore((s) => s.atmosphere);
  const floorTexture = useMemo(() => getLuxuryFloorTexture(), []);

  // Animated glass elevator pod ref
  const elevatorPodRef = useRef<THREE.Group>(null);
  const fountainCoreRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    // Smooth vertical elevator ascent/descent cycle
    if (elevatorPodRef.current) {
      elevatorPodRef.current.position.y = 1.2 + ((Math.sin(time * 0.4) + 1) / 2) * 12.0;
    }
    // Subtle rotation of central holographic fountain
    if (fountainCoreRef.current) {
      fountainCoreRef.current.rotation.y = time * 0.5;
    }
  });

  // Luminous, luxury architectural materials
  const floorMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: floorTexture,
        roughness: 0.16, // High gloss reflection capturing skylight and book lighting
        metalness: 0.12,
      }),
    [floorTexture]
  );

  const whiteSculpturalCeilingMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#F8FAFC', // Crisp white/cream sculpted parametric panels
        roughness: 0.45,
        metalness: 0.05,
      }),
    []
  );

  const warmWoodFaciaMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#B45309', // Warm honey oak balcony facias
        roughness: 0.35,
        metalness: 0.25,
      }),
    []
  );

  const champagneTitaniumMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#CBD5E1', // Brushed champagne stainless steel / titanium
        roughness: 0.25,
        metalness: 0.78,
      }),
    []
  );

  const clearBalustradeGlassMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#E0F2FE',
        roughness: 0.04,
        metalness: 0.1,
        transparent: true,
        opacity: 0.32,
        transmission: 0.75,
        reflectivity: 0.95,
      }),
    []
  );

  const warmCoveLedMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#FDE68A', // Warm golden 3000K indirect cove lighting
      }),
    []
  );

  const cyanAccentLedMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#38BDF8', // Crisp sky blue accent
      }),
    []
  );

  const skylightDomeGlassMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#BAE6FD',
        roughness: 0.02,
        metalness: 0.1,
        transparent: true,
        opacity: 0.28,
        transmission: 0.85,
      }),
    []
  );

  // Exterior background vista (blue sky, trees, clouds)
  const exteriorTreeColor = atmosphere === 'day' ? '#15803D' : atmosphere === 'evening' ? '#374151' : '#1E293B';

  const ATRIUM_Z = -14;
  const ATRIUM_RADIUS = 16.5;

  return (
    <group>
      {/* ========================================================= */}
      {/* 1. POLISHED REFLECTIVE CONCOURSE FLOOR (120m x 168m)      */}
      {/* ========================================================= */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, -38]} receiveShadow>
        <planeGeometry args={[120, 168]} />
        <primitive object={floorMaterial} attach="material" />
      </mesh>

      {/* Central Nave Polished Runner */}
      <mesh position={[0, 0.005, -38]}>
        <boxGeometry args={[12, 0.015, 152]} />
        <primitive object={whiteSculpturalCeilingMaterial} attach="material" />
      </mesh>

      {/* Warm Golden Navigation Light Inlays */}
      <mesh position={[-6.0, 0.018, -38]}>
        <boxGeometry args={[0.08, 0.01, 152]} />
        <primitive object={warmCoveLedMaterial} attach="material" />
      </mesh>
      <mesh position={[6.0, 0.018, -38]}>
        <boxGeometry args={[0.08, 0.01, 152]} />
        <primitive object={warmCoveLedMaterial} attach="material" />
      </mesh>

      {/* ========================================================= */}
      {/* 2. GRAND MULTI-TIER ATRIUM ROTUNDA (Center at X=0, Z=-14) */}
      {/* ========================================================= */}
      <group position={[0, 0, ATRIUM_Z]}>
        {/* --- SUNKEN CONVERSATION AMPHITHEATER (Directly matching Image 2!) --- */}
        <group position={[0, 0, 0]}>
          {/* Stepped Terraced Seating Rings */}
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[11.5, 12.2, 0.2, 48]} />
            <primitive object={whiteSculpturalCeilingMaterial} attach="material" />
          </mesh>
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[8.8, 9.4, 0.2, 48]} />
            <primitive object={whiteSculpturalCeilingMaterial} attach="material" />
          </mesh>
          {/* Plush Curved Sofa Ring in Dove Gray with Warm Under-Cushion Glow */}
          <mesh position={[0, 0.45, 0]}>
            <torusGeometry args={[8.6, 0.45, 16, 48]} />
            <primitive object={whiteSculpturalCeilingMaterial} attach="material" />
          </mesh>
          {/* Under-Sofa Warm Light Halo */}
          <mesh position={[0, 0.15, 0]}>
            <torusGeometry args={[8.8, 0.04, 8, 48]} />
            <primitive object={warmCoveLedMaterial} attach="material" />
          </mesh>

          {/* Central Low Round Wooden Conference / Reading Table */}
          <mesh position={[0, 0.42, 0]}>
            <cylinderGeometry args={[2.2, 2.2, 0.08, 32]} />
            <primitive object={warmWoodFaciaMaterial} attach="material" />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.6, 0.8, 0.4, 16]} />
            <primitive object={champagneTitaniumMaterial} attach="material" />
          </mesh>

          {/* Central Holographic Information Core (matching Image 3) */}
          <group ref={fountainCoreRef} position={[0, 0.9, 0]}>
            <mesh>
              <icosahedronGeometry args={[0.55, 1]} />
              <primitive object={cyanAccentLedMaterial} attach="material" />
            </mesh>
            <mesh>
              <torusGeometry args={[0.9, 0.02, 8, 32]} />
              <primitive object={warmCoveLedMaterial} attach="material" />
            </mesh>
          </group>
        </group>

        {/* --- 8 TOWERING STRUCTURAL TITANIUM ARCHITECTURAL COLUMNS (H = 18m) --- */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * Math.PI) / 4;
          const colX = Math.cos(angle) * (ATRIUM_RADIUS - 0.5);
          const colZ = Math.sin(angle) * (ATRIUM_RADIUS - 0.5);
          return (
            <group key={i} position={[colX, 9.0, colZ]}>
              <mesh>
                <cylinderGeometry args={[0.5, 0.6, 18.0, 16]} />
                <primitive object={champagneTitaniumMaterial} attach="material" />
              </mesh>
              {/* Vertical Warm LED Reveal Channel */}
              <mesh position={[0, 0, 0.52]}>
                <boxGeometry args={[0.06, 17.6, 0.04]} />
                <primitive object={warmCoveLedMaterial} attach="material" />
              </mesh>
              {/* Level 2 Capital Collar at Y = 5.2m */}
              <mesh position={[0, -3.8, 0]}>
                <cylinderGeometry args={[0.8, 0.8, 0.4, 16]} />
                <primitive object={champagneTitaniumMaterial} attach="material" />
              </mesh>
              {/* Level 3 Capital Collar at Y = 10.4m */}
              <mesh position={[0, 1.4, 0]}>
                <cylinderGeometry args={[0.8, 0.8, 0.4, 16]} />
                <primitive object={champagneTitaniumMaterial} attach="material" />
              </mesh>
            </group>
          );
        })}

        {/* --- LEVEL 2: CIRCULAR MEZZANINE BALCONY (Y = 5.2m) --- */}
        <group position={[0, 5.2, 0]}>
          {/* Walking Concourse Deck (Inner R = 11.5m, Outer R = 16.5m) */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[11.5, 16.5, 64]} />
            <primitive object={floorMaterial} attach="material" />
          </mesh>
          {/* Warm Wood Balcony Facia Underneath */}
          <mesh position={[0, -0.25, 0]}>
            <cylinderGeometry args={[11.45, 11.45, 0.5, 64, 1, true]} />
            <primitive object={warmWoodFaciaMaterial} attach="material" />
          </mesh>
          <mesh position={[0, -0.25, 0]}>
            <cylinderGeometry args={[16.55, 16.55, 0.5, 64, 1, true]} />
            <primitive object={warmWoodFaciaMaterial} attach="material" />
          </mesh>
          {/* Recessed Warm LED Ribbon along Facia Rim */}
          <mesh position={[0, -0.5, 0]}>
            <torusGeometry args={[11.45, 0.035, 8, 64]} />
            <primitive object={warmCoveLedMaterial} attach="material" />
          </mesh>

          {/* Curved Structural Glass Balustrade (H = 1.2m) */}
          <mesh position={[0, 0.6, 0]}>
            <cylinderGeometry args={[11.5, 11.5, 1.2, 64, 1, true]} />
            <primitive object={clearBalustradeGlassMaterial} attach="material" />
          </mesh>
          {/* Polished Stainless Steel Top Handrail */}
          <mesh position={[0, 1.22, 0]}>
            <torusGeometry args={[11.5, 0.045, 12, 64]} />
            <primitive object={champagneTitaniumMaterial} attach="material" />
          </mesh>

          {/* --- CURVED BOOK WALLS ON LEVEL 2 (Directly matching Image 1 & 2!) --- */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * Math.PI) / 4 + 0.15;
            const bX = Math.cos(angle) * 15.2;
            const bZ = Math.sin(angle) * 15.2;
            return (
              <group key={i} position={[bX, 1.5, bZ]} rotation={[0, -angle - Math.PI / 2, 0]}>
                <mesh>
                  <boxGeometry args={[4.8, 3.0, 0.5]} />
                  <primitive object={warmWoodFaciaMaterial} attach="material" />
                </mesh>
                {/* 3 Horizontal Illuminated Shelf Bands */}
                {[-0.8, 0, 0.8].map((sY, sIdx) => (
                  <mesh key={sIdx} position={[0, sY, 0.26]}>
                    <boxGeometry args={[4.6, 0.08, 0.04]} />
                    <primitive object={warmCoveLedMaterial} attach="material" />
                  </mesh>
                ))}
              </group>
            );
          })}
        </group>

        {/* --- LEVEL 3: UPPER TIER VIEWING GALLERIA (Y = 10.4m, matching Image 3) --- */}
        <group position={[0, 10.4, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[13.2, 17.5, 64]} />
            <primitive object={floorMaterial} attach="material" />
          </mesh>
          <mesh position={[0, -0.25, 0]}>
            <cylinderGeometry args={[13.15, 13.15, 0.5, 64, 1, true]} />
            <primitive object={warmWoodFaciaMaterial} attach="material" />
          </mesh>
          <mesh position={[0, -0.5, 0]}>
            <torusGeometry args={[13.15, 0.035, 8, 64]} />
            <primitive object={warmCoveLedMaterial} attach="material" />
          </mesh>
          {/* Glass Railing */}
          <mesh position={[0, 0.6, 0]}>
            <cylinderGeometry args={[13.2, 13.2, 1.2, 64, 1, true]} />
            <primitive object={clearBalustradeGlassMaterial} attach="material" />
          </mesh>
          <mesh position={[0, 1.22, 0]}>
            <torusGeometry args={[13.2, 0.045, 12, 64]} />
            <primitive object={champagneTitaniumMaterial} attach="material" />
          </mesh>
        </group>

        {/* --- CENTRAL PANORAMIC CYLINDRICAL GLASS ELEVATOR TOWER (matching Image 3!) --- */}
        <group position={[0, 0, 0]}>
          {/* Structural Vertical Glass Tube (H = 18m) */}
          <mesh position={[0, 9.0, 0]}>
            <cylinderGeometry args={[1.7, 1.7, 18.0, 32, 1, true]} />
            <primitive object={clearBalustradeGlassMaterial} attach="material" />
          </mesh>
          {/* 4 Titanium Vertical Struts */}
          {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((sAng, sI) => (
            <mesh key={sI} position={[Math.cos(sAng) * 1.72, 9.0, Math.sin(sAng) * 1.72]}>
              <cylinderGeometry args={[0.06, 0.06, 18.0, 12]} />
              <primitive object={champagneTitaniumMaterial} attach="material" />
            </mesh>
          ))}
          {/* Animated Ascending/Descending Glass Observation Elevator Pod */}
          <group ref={elevatorPodRef} position={[0, 1.2, 0]}>
            <mesh position={[0, 1.4, 0]}>
              <cylinderGeometry args={[1.5, 1.5, 2.6, 24]} />
              <primitive object={clearBalustradeGlassMaterial} attach="material" />
            </mesh>
            <mesh position={[0, 0.1, 0]}>
              <cylinderGeometry args={[1.55, 1.55, 0.2, 24]} />
              <primitive object={champagneTitaniumMaterial} attach="material" />
            </mesh>
            <mesh position={[0, 2.7, 0]}>
              <cylinderGeometry args={[1.55, 1.55, 0.2, 24]} />
              <primitive object={champagneTitaniumMaterial} attach="material" />
            </mesh>
            <mesh position={[0, 0.22, 0]}>
              <torusGeometry args={[1.52, 0.03, 8, 32]} />
              <primitive object={warmCoveLedMaterial} attach="material" />
            </mesh>
          </group>
        </group>

        {/* --- GRAND SWEEPING CURVED STAIRCASE (matching Image 1 & 2!) --- */}
        <group position={[0, 0, 0]}>
          {Array.from({ length: 26 }).map((_, stepIdx) => {
            // Curving smoothly from angle 0 to PI around the atrium while ascending from Y=0 to 5.2m
            const t = stepIdx / 25;
            const stepAngle = -Math.PI * 0.45 + t * Math.PI * 0.85;
            const stepRadius = 10.2 + Math.sin(t * Math.PI) * 1.4;
            const stepX = Math.cos(stepAngle) * stepRadius;
            const stepZ = Math.sin(stepAngle) * stepRadius;
            const stepY = t * 5.2;

            return (
              <group key={stepIdx} position={[stepX, stepY + 0.1, stepZ]} rotation={[0, -stepAngle, 0]}>
                {/* Step Tread in White Sculptural Composite */}
                <mesh>
                  <boxGeometry args={[2.4, 0.16, 0.75]} />
                  <primitive object={whiteSculpturalCeilingMaterial} attach="material" />
                </mesh>
                {/* Warm Golden Step-Edge Glow Strip (matching Image 1 & 2!) */}
                <mesh position={[0, 0.085, 0.36]}>
                  <boxGeometry args={[2.3, 0.02, 0.03]} />
                  <primitive object={warmCoveLedMaterial} attach="material" />
                </mesh>
              </group>
            );
          })}
        </group>
      </group>

      {/* ========================================================= */}
      {/* 3. MULTI-LEVEL SKY BRIDGES (Connecting East & West Wings) */}
      {/* ========================================================= */}
      {/* South Skybridge at Z = 6m, Y = 5.2m */}
      <group position={[0, 5.2, 6]}>
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[42, 0.4, 4.2]} />
          <primitive object={warmWoodFaciaMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[41.8, 0.02, 3.8]} />
          <primitive object={floorMaterial} attach="material" />
        </mesh>
        {/* North Glass Railing */}
        <mesh position={[0, 0.62, -2.0]}>
          <boxGeometry args={[42, 1.2, 0.06]} />
          <primitive object={clearBalustradeGlassMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 1.24, -2.0]}>
          <boxGeometry args={[42, 0.05, 0.08]} />
          <primitive object={champagneTitaniumMaterial} attach="material" />
        </mesh>
        {/* South Glass Railing */}
        <mesh position={[0, 0.62, 2.0]}>
          <boxGeometry args={[42, 1.2, 0.06]} />
          <primitive object={clearBalustradeGlassMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 1.24, 2.0]}>
          <boxGeometry args={[42, 0.05, 0.08]} />
          <primitive object={champagneTitaniumMaterial} attach="material" />
        </mesh>
        {/* Warm Underside Bridge Ribbon */}
        <mesh position={[0, -0.42, 0]}>
          <boxGeometry args={[41.8, 0.03, 0.15]} />
          <primitive object={warmCoveLedMaterial} attach="material" />
        </mesh>
      </group>

      {/* North Skybridge at Z = -34m, Y = 5.2m */}
      <group position={[0, 5.2, -34]}>
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[42, 0.4, 4.2]} />
          <primitive object={warmWoodFaciaMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[41.8, 0.02, 3.8]} />
          <primitive object={floorMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 0.62, -2.0]}>
          <boxGeometry args={[42, 1.2, 0.06]} />
          <primitive object={clearBalustradeGlassMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 1.24, -2.0]}>
          <boxGeometry args={[42, 0.05, 0.08]} />
          <primitive object={champagneTitaniumMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 0.62, 2.0]}>
          <boxGeometry args={[42, 1.2, 0.06]} />
          <primitive object={clearBalustradeGlassMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 1.24, 2.0]}>
          <boxGeometry args={[42, 0.05, 0.08]} />
          <primitive object={champagneTitaniumMaterial} attach="material" />
        </mesh>
      </group>

      {/* ========================================================= */}
      {/* 4. GEODESIC GLASS DOME SKYLIGHT (Directly matching Image 3)*/}
      {/* ========================================================= */}
      <group position={[0, 17.5, ATRIUM_Z]}>
        {/* Enormous Geodesic Glass Dome (34m x 26m Oval, Y = 17.5m) */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[17.0, 17.0, 0.1, 48, 1, true]} />
          <primitive object={skylightDomeGlassMaterial} attach="material" />
        </mesh>
        {/* Geodesic Diamond Titanium Mullion Grid */}
        <mesh position={[0, 0.1, 0]}>
          <torusGeometry args={[17.0, 0.18, 12, 48]} />
          <primitive object={champagneTitaniumMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <torusGeometry args={[11.5, 0.14, 12, 48]} />
          <primitive object={champagneTitaniumMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <torusGeometry args={[6.0, 0.12, 12, 32]} />
          <primitive object={champagneTitaniumMaterial} attach="material" />
        </mesh>
        {/* Radial Mullion Spokes */}
        {Array.from({ length: 12 }).map((_, mIdx) => {
          const mAng = (mIdx * Math.PI) / 6;
          return (
            <mesh key={mIdx} position={[0, 0.1, 0]} rotation={[0, mAng, 0]}>
              <boxGeometry args={[34.0, 0.12, 0.16]} />
              <primitive object={champagneTitaniumMaterial} attach="material" />
            </mesh>
          );
        })}
      </group>

      {/* ========================================================= */}
      {/* 5. FLOWING PARAMETRIC WAVE CEILING (matching Image 2 & 4) */}
      {/* ========================================================= */}
      {/* Sinuous undulating ribbon waves with integrated warm LED coves */}
      {[-52, -40, -28, 28, 40, 52].map((waveX, wIdx) => (
        <group key={wIdx} position={[waveX, 16.8, -38]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[10.5, 0.45, 156]} />
            <primitive object={whiteSculpturalCeilingMaterial} attach="material" />
          </mesh>
          {/* Continuous Warm LED Cove Ribbons */}
          <mesh position={[-5.1, -0.25, 0]}>
            <boxGeometry args={[0.08, 0.04, 156]} />
            <primitive object={warmCoveLedMaterial} attach="material" />
          </mesh>
          <mesh position={[5.1, -0.25, 0]}>
            <boxGeometry args={[0.08, 0.04, 156]} />
            <primitive object={warmCoveLedMaterial} attach="material" />
          </mesh>
        </group>
      ))}

      {/* ========================================================= */}
      {/* 6. SOARING NORTH GLASS CURTAIN WALL (matching Image 1 & 4)*/}
      {/* ========================================================= */}
      {/* Grand Double-Height Floor-to-Ceiling Glass Facade (Z = -118m) */}
      <group position={[0, 9.0, -118]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[64, 18.0, 0.12]} />
          <primitive object={skylightDomeGlassMaterial} attach="material" />
        </mesh>
        {/* Towering Vertical Titanium Mullions */}
        {[-28, -20, -12, -4, 4, 12, 20, 28].map((mulX, mulI) => (
          <mesh key={mulI} position={[mulX, 0, 0.08]}>
            <boxGeometry args={[0.35, 18.0, 0.35]} />
            <primitive object={champagneTitaniumMaterial} attach="material" />
          </mesh>
        ))}
        {/* Horizontal Mullion Beams */}
        <mesh position={[0, -3.8, 0.08]}>
          <boxGeometry args={[64, 0.4, 0.35]} />
          <primitive object={champagneTitaniumMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 2.4, 0.08]}>
          <boxGeometry args={[64, 0.4, 0.35]} />
          <primitive object={champagneTitaniumMaterial} attach="material" />
        </mesh>
      </group>

      {/* Exterior Sunlit Treetops & Horizon beyond the glass */}
      <group position={[0, 0, -135]}>
        {[-32, -18, -4, 12, 26, 40].map((tX, tIdx) => (
          <group key={tIdx} position={[tX, 0, (tIdx % 2) * 6]}>
            <mesh position={[0, 7.0, 0]}>
              <cylinderGeometry args={[2.5, 3.8, 14.0, 8]} />
              <meshStandardMaterial color={exteriorTreeColor} roughness={0.9} />
            </mesh>
            <mesh position={[0, 2.0, 0]}>
              <cylinderGeometry args={[0.4, 0.5, 4.0, 8]} />
              <meshStandardMaterial color="#78350F" roughness={0.8} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ========================================================= */}
      {/* 7. ARCHITECTURAL STUDY DESKS (matching Images 2 & 3)      */}
      {/* ========================================================= */}
      {[
        [-20, 0, 4],
        [20, 0, 4],
        [-20, 0, -30],
        [20, 0, -30],
      ].map(([dX, dY, dZ], dIdx) => (
        <group key={dIdx} position={[dX, dY, dZ]}>
          {/* Large Warm Wood Study Desk */}
          <mesh position={[0, 0.75, 0]}>
            <boxGeometry args={[4.2, 0.08, 1.8]} />
            <primitive object={warmWoodFaciaMaterial} attach="material" />
          </mesh>
          {/* Champagne Legs */}
          <mesh position={[-1.9, 0.36, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.72, 12]} />
            <primitive object={champagneTitaniumMaterial} attach="material" />
          </mesh>
          <mesh position={[1.9, 0.36, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.72, 12]} />
            <primitive object={champagneTitaniumMaterial} attach="material" />
          </mesh>
          {/* Banker / Study Lamp with Warm Glow */}
          <mesh position={[0, 0.95, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.35, 12]} />
            <primitive object={champagneTitaniumMaterial} attach="material" />
          </mesh>
          <mesh position={[0, 1.15, 0]}>
            <boxGeometry args={[0.5, 0.06, 0.12]} />
            <primitive object={warmCoveLedMaterial} attach="material" />
          </mesh>
        </group>
      ))}

      {/* Solid Perimeter Walls in Warm Stone / Architectural White Composite */}
      {/* South Wall */}
      <mesh position={[0, 9.0, 42]}>
        <boxGeometry args={[116, 18.0, 1.2]} />
        <primitive object={whiteSculpturalCeilingMaterial} attach="material" />
      </mesh>
      {/* West Wall */}
      <mesh position={[-56, 9.0, -38]}>
        <boxGeometry args={[1.2, 18.0, 160]} />
        <primitive object={whiteSculpturalCeilingMaterial} attach="material" />
      </mesh>
      {/* East Wall */}
      <mesh position={[56, 9.0, -38]}>
        <boxGeometry args={[1.2, 18.0, 160]} />
        <primitive object={whiteSculpturalCeilingMaterial} attach="material" />
      </mesh>
    </group>
  );
};
