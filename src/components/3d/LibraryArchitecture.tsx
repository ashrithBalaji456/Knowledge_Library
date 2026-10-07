import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useLibraryStore } from '../../store/useLibraryStore';

// Generate modular obsidian & polished graphite floor texture
let cachedObsidianFloorTexture: THREE.CanvasTexture | null = null;
function getObsidianFloorTexture(): THREE.CanvasTexture {
  if (cachedObsidianFloorTexture) return cachedObsidianFloorTexture;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Deep obsidian/graphite composite base
  ctx.fillStyle = '#060A14';
  ctx.fillRect(0, 0, 1024, 1024);

  // Large geometric architectural floor panels (256x256 tiles)
  const tileSize = 256;
  const panelColors = ['#080E1C', '#070D1A', '#091020', '#060B18'];

  for (let y = 0; y < 1024; y += tileSize) {
    for (let x = 0; x < 1024; x += tileSize) {
      const idx = (Math.floor(x / tileSize) + Math.floor(y / tileSize)) % panelColors.length;
      ctx.fillStyle = panelColors[idx];
      ctx.fillRect(x + 2, y + 2, tileSize - 4, tileSize - 4);

      // Fine brushed carbon grain
      ctx.strokeStyle = 'rgba(85, 223, 255, 0.035)';
      ctx.lineWidth = 1;
      for (let g = 8; g < tileSize; g += 32) {
        ctx.beginPath();
        ctx.moveTo(x + 4, y + g);
        ctx.lineTo(x + tileSize - 4, y + g);
        ctx.stroke();
      }

      // Subtle recessed beveled groove
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.lineWidth = 3;
      ctx.strokeRect(x + 1, y + 1, tileSize - 2, tileSize - 2);

      // Delicate cyber corner node marker
      ctx.fillStyle = 'rgba(85, 223, 255, 0.35)';
      ctx.fillRect(x + 6, y + 6, 3, 3);
      ctx.fillRect(x + tileSize - 9, y + 6, 3, 3);
      ctx.fillRect(x + 6, y + tileSize - 9, 3, 3);
      ctx.fillRect(x + tileSize - 9, y + tileSize - 9, 3, 3);
    }
  }

  cachedObsidianFloorTexture = new THREE.CanvasTexture(canvas);
  cachedObsidianFloorTexture.wrapS = THREE.RepeatWrapping;
  cachedObsidianFloorTexture.wrapT = THREE.RepeatWrapping;
  cachedObsidianFloorTexture.repeat.set(16, 22);
  return cachedObsidianFloorTexture;
}

export const LibraryArchitecture: React.FC = () => {
  const atmosphere = useLibraryStore((s) => s.atmosphere);
  const floorTexture = useMemo(() => getObsidianFloorTexture(), []);

  // Shared futuristic materials
  const floorMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: floorTexture,
        roughness: 0.28,
        metalness: 0.22,
      }),
    [floorTexture]
  );

  // Walkway central runner: polished dark obsidian glass
  const runnerMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#08101E',
        roughness: 0.18,
        metalness: 0.45,
      }),
    []
  );

  // Controlled architectural guidance light strips (calm cyan glow)
  const cyanGuidanceMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#22D3EE',
      }),
    []
  );

  // Soft violet accent light strips
  const violetAccentMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#A78BFA',
      }),
    []
  );

  // Matte dark composite architectural wall panels
  const wallMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#090E1A',
        roughness: 0.75,
        metalness: 0.2,
      }),
    []
  );

  // Brushed titanium / dark alloy trim & structural frames
  const titaniumMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1E293B',
        roughness: 0.35,
        metalness: 0.75,
      }),
    []
  );

  // Translucent smoked glass with subtle blue tint
  const smokedGlassMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0F1E36',
        roughness: 0.15,
        metalness: 0.1,
        transparent: true,
        opacity: 0.65,
      }),
    []
  );

  // Colonnade pylon structural material
  const pylonMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0D1526',
        roughness: 0.4,
        metalness: 0.5,
      }),
    []
  );

  // Holographic console display material
  const holoDisplayMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#38BDF8',
        transparent: true,
        opacity: 0.85,
      }),
    []
  );

  // Outdoor distant futuristic skyline backdrop color
  const skylineSkyColor =
    atmosphere === 'day' ? '#07162C' : atmosphere === 'evening' ? '#130924' : '#030712';
  const skylightColor =
    atmosphere === 'day' ? '#7DD3FC' : atmosphere === 'evening' ? '#C084FC' : '#38BDF8';

  // Collision-free colonnade positions along the grand nave (X = +-15m)
  const pillarZPositions = [32, 20, 8, -4, -16, -28, -40, -52, -64, -76, -88, -100, -112];
  const windowZPositions = [-105, -85, -65, -45, -25, -5, 15, 35];

  // Futuristic Research Pod locations in quiet promenade alcoves
  const researchPods = [
    { x: -6.0, z: -8 },
    { x: 6.0, z: -8 },
    { x: -6.0, z: -28 },
    { x: 6.0, z: -28 },
  ];

  return (
    <group>
      {/* --- MODULAR OBSIDIAN GRAPHITE FLOOR (124m x 172m) --- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -38]} receiveShadow>
        <planeGeometry args={[124, 172]} />
        <primitive object={floorMaterial} attach="material" />
      </mesh>

      {/* --- CENTRAL PROMENADE WALKWAY (Polished Obsidian Glass Runner) --- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, -38]}>
        <planeGeometry args={[4.8, 164]} />
        <primitive object={runnerMaterial} attach="material" />
      </mesh>

      {/* Architectural Cyan Guidance Light Strips along Walkway Edges */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2.42, 0.009, -38]}>
        <planeGeometry args={[0.04, 164]} />
        <primitive object={cyanGuidanceMaterial} attach="material" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2.42, 0.009, -38]}>
        <planeGeometry args={[0.04, 164]} />
        <primitive object={cyanGuidanceMaterial} attach="material" />
      </mesh>

      {/* Subtle Violet Cross-Axis Guide Notches every 12 meters */}
      {pillarZPositions.map((z, idx) => (
        <group key={`guide-notch-${idx}`} position={[0, 0.009, z]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[4.8, 0.03]} />
            <primitive object={violetAccentMaterial} attach="material" />
          </mesh>
        </group>
      ))}

      {/* --- EXPANDED CYBERPUNK ARCHITECTURAL WALLS --- */}
      {/* South Entrance Wall (Z = +44m) */}
      <group position={[0, 0, 44]}>
        <mesh position={[0, 5.2, 0]}>
          <boxGeometry args={[120, 5.6, 0.8]} />
          <primitive object={wallMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[120, 2.4, 0.9]} />
          <primitive object={titaniumMaterial} attach="material" />
        </mesh>
        {/* Horizontal Cyan Architectural Seam */}
        <mesh position={[0, 2.42, 0.46]}>
          <boxGeometry args={[120, 0.03, 0.02]} />
          <primitive object={cyanGuidanceMaterial} attach="material" />
        </mesh>
      </group>

      {/* North Far Wall (Z = -120m) */}
      <group position={[0, 0, -120]}>
        <mesh position={[0, 5.2, 0]}>
          <boxGeometry args={[120, 5.6, 0.8]} />
          <primitive object={wallMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[120, 2.4, 0.9]} />
          <primitive object={titaniumMaterial} attach="material" />
        </mesh>
        {/* Horizontal Cyan Architectural Seam */}
        <mesh position={[0, 2.42, -0.46]}>
          <boxGeometry args={[120, 0.03, 0.02]} />
          <primitive object={cyanGuidanceMaterial} attach="material" />
        </mesh>
      </group>

      {/* West Wing Wall (X = -58m) */}
      <group position={[-58, 0, -38]}>
        <mesh position={[0, 5.2, 0]}>
          <boxGeometry args={[0.8, 5.6, 168]} />
          <primitive object={wallMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[0.9, 2.4, 168]} />
          <primitive object={titaniumMaterial} attach="material" />
        </mesh>
        {/* Horizontal Accent Seam */}
        <mesh position={[0.46, 2.42, 0]}>
          <boxGeometry args={[0.02, 0.03, 168]} />
          <primitive object={cyanGuidanceMaterial} attach="material" />
        </mesh>
      </group>

      {/* East Wing Wall (X = +58m) */}
      <group position={[58, 0, -38]}>
        <mesh position={[0, 5.2, 0]}>
          <boxGeometry args={[0.8, 5.6, 168]} />
          <primitive object={wallMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[0.9, 2.4, 168]} />
          <primitive object={titaniumMaterial} attach="material" />
        </mesh>
        {/* Horizontal Accent Seam */}
        <mesh position={[-0.46, 2.42, 0]}>
          <boxGeometry args={[0.02, 0.03, 168]} />
          <primitive object={cyanGuidanceMaterial} attach="material" />
        </mesh>
      </group>

      {/* --- FUTURISTIC PANORAMIC GLASS WINDOW VISTAS (West & East) --- */}
      {windowZPositions.map((z, i) => (
        <group key={`win-w-${i}`} position={[-57.4, 4.6, z]}>
          {/* Cyber Skyline Backdrop */}
          <mesh position={[-5.0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[14, 7.5]} />
            <meshBasicMaterial color={skylineSkyColor} />
          </mesh>

          {/* Distant Abstract City Light Silhouettes */}
          <group position={[-4.5, -1.5, 0]} rotation={[0, Math.PI / 2, 0]}>
            <mesh position={[-3, 1, 0]}>
              <boxGeometry args={[1.2, 4.5, 0.1]} />
              <meshBasicMaterial color="#0A1832" />
            </mesh>
            <mesh position={[0, 1.8, 0]}>
              <boxGeometry args={[1.5, 6.0, 0.1]} />
              <meshBasicMaterial color="#0C1D3B" />
            </mesh>
            <mesh position={[3, 1.2, 0]}>
              <boxGeometry args={[1.1, 4.8, 0.1]} />
              <meshBasicMaterial color="#0A1832" />
            </mesh>
            {/* Soft skyline beacons */}
            <mesh position={[0, 4.85, 0.06]}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshBasicMaterial color="#38BDF8" />
            </mesh>
          </group>

          {/* Smoked Architectural Glass Facade */}
          <mesh position={[0.02, 0, 0]}>
            <boxGeometry args={[0.02, 4.8, 5.2]} />
            <primitive object={smokedGlassMaterial} attach="material" />
          </mesh>
          {/* Sleek Titanium Mullions with Cyan Edge Accents */}
          <mesh position={[0.04, 0, 0]}>
            <boxGeometry args={[0.06, 4.8, 0.08]} />
            <primitive object={titaniumMaterial} attach="material" />
          </mesh>
          <mesh position={[0.04, 0, 0]}>
            <boxGeometry args={[0.06, 0.08, 5.2]} />
            <primitive object={titaniumMaterial} attach="material" />
          </mesh>
          <mesh position={[0.04, 1.4, 0]}>
            <boxGeometry args={[0.06, 0.08, 5.2]} />
            <primitive object={titaniumMaterial} attach="material" />
          </mesh>
        </group>
      ))}

      {windowZPositions.map((z, i) => (
        <group key={`win-e-${i}`} position={[57.4, 4.6, z]}>
          {/* Cyber Skyline Backdrop */}
          <mesh position={[5.0, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[14, 7.5]} />
            <meshBasicMaterial color={skylineSkyColor} />
          </mesh>

          {/* Distant Abstract City Light Silhouettes */}
          <group position={[4.5, -1.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <mesh position={[-3, 1.2, 0]}>
              <boxGeometry args={[1.1, 4.8, 0.1]} />
              <meshBasicMaterial color="#0A1832" />
            </mesh>
            <mesh position={[0, 1.8, 0]}>
              <boxGeometry args={[1.5, 6.0, 0.1]} />
              <meshBasicMaterial color="#0C1D3B" />
            </mesh>
            <mesh position={[3, 1, 0]}>
              <boxGeometry args={[1.2, 4.5, 0.1]} />
              <meshBasicMaterial color="#0A1832" />
            </mesh>
            {/* Soft skyline beacons */}
            <mesh position={[0, 4.85, 0.06]}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshBasicMaterial color="#A78BFA" />
            </mesh>
          </group>

          {/* Smoked Architectural Glass Facade */}
          <mesh position={[-0.02, 0, 0]}>
            <boxGeometry args={[0.02, 4.8, 5.2]} />
            <primitive object={smokedGlassMaterial} attach="material" />
          </mesh>
          {/* Sleek Titanium Mullions */}
          <mesh position={[-0.04, 0, 0]}>
            <boxGeometry args={[0.06, 4.8, 0.08]} />
            <primitive object={titaniumMaterial} attach="material" />
          </mesh>
          <mesh position={[-0.04, 0, 0]}>
            <boxGeometry args={[0.06, 0.08, 5.2]} />
            <primitive object={titaniumMaterial} attach="material" />
          </mesh>
          <mesh position={[-0.04, 1.4, 0]}>
            <boxGeometry args={[0.06, 0.08, 5.2]} />
            <primitive object={titaniumMaterial} attach="material" />
          </mesh>
        </group>
      ))}

      {/* --- GRAND CURVED CEILING RIBS & LINEAR LIGHT TUNNEL (120m x 168m) --- */}
      {/* Matte Carbon Vaulted Ceiling Canopy */}
      <mesh position={[0, 8.4, -38]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[120, 168]} />
        <meshStandardMaterial color="#040711" roughness={0.9} metalness={0.15} />
      </mesh>

      {/* Central Recessed Skylight pouring cool indirect blue illumination */}
      <mesh position={[0, 8.35, -38]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6.4, 156]} />
        <meshBasicMaterial color={skylightColor} transparent opacity={0.65} />
      </mesh>

      {/* Longitudinal Cyan Edge Strips flanking the central skylight */}
      <mesh position={[-3.25, 8.32, -38]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.08, 156]} />
        <primitive object={cyanGuidanceMaterial} attach="material" />
      </mesh>
      <mesh position={[3.25, 8.32, -38]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.08, 156]} />
        <primitive object={cyanGuidanceMaterial} attach="material" />
      </mesh>

      {/* Structural Curved Ceiling Ribs & Floating Light Pods */}
      {pillarZPositions.map((z, idx) => (
        <group key={`ceiling-rib-${idx}`} position={[0, 8.2, z]}>
          {/* Main Transverse Structural Titanium Rib */}
          <mesh>
            <boxGeometry args={[120, 0.35, 0.6]} />
            <primitive object={titaniumMaterial} attach="material" />
          </mesh>
          {/* Underside Cyan Edge Accent */}
          <mesh position={[0, -0.18, 0]}>
            <boxGeometry args={[120, 0.02, 0.04]} />
            <primitive object={cyanGuidanceMaterial} attach="material" />
          </mesh>

          {/* Central Holographic Lighting Ring Pendant */}
          <group position={[0, -0.85, 0]}>
            <mesh>
              <cylinderGeometry args={[0.012, 0.012, 1.5]} />
              <primitive object={titaniumMaterial} attach="material" />
            </mesh>
            {/* Outer Dark Halo Ring */}
            <mesh position={[0, -0.75, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.85, 0.035, 12, 32]} />
              <primitive object={titaniumMaterial} attach="material" />
            </mesh>
            {/* Inner Glowing Cyan Light Halo */}
            <mesh position={[0, -0.75, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.78, 0.015, 8, 32]} />
              <primitive object={cyanGuidanceMaterial} attach="material" />
            </mesh>
          </group>
        </group>
      ))}

      {/* --- SLEEK FACETED CYBER PYLONS AT X = +-15m (100% COLLISION FREE) --- */}
      {pillarZPositions.map((z, idx) => (
        <group key={`pylons-${idx}`}>
          {/* Left Pylon at X = -15 */}
          <group position={[-15, 0, z]}>
            {/* Weighted Base Plinth */}
            <mesh position={[0, 0.25, 0]}>
              <boxGeometry args={[1.1, 0.5, 1.1]} />
              <primitive object={titaniumMaterial} attach="material" />
            </mesh>
            {/* Hexagonal Vertical Pylon Body */}
            <mesh position={[0, 3.8, 0]}>
              <cylinderGeometry args={[0.38, 0.44, 7.1, 6]} />
              <primitive object={pylonMaterial} attach="material" />
            </mesh>
            {/* Structural Crown Capital */}
            <mesh position={[0, 7.4, 0]}>
              <boxGeometry args={[1.2, 0.25, 1.2]} />
              <primitive object={titaniumMaterial} attach="material" />
            </mesh>

            {/* Vertical Cyan Data Conduit Groove facing Central Aisle (+X) */}
            <mesh position={[0.42, 3.8, 0]}>
              <boxGeometry args={[0.02, 6.2, 0.06]} />
              <primitive object={cyanGuidanceMaterial} attach="material" />
            </mesh>
          </group>

          {/* Right Pylon at X = +15 */}
          <group position={[15, 0, z]}>
            {/* Weighted Base Plinth */}
            <mesh position={[0, 0.25, 0]}>
              <boxGeometry args={[1.1, 0.5, 1.1]} />
              <primitive object={titaniumMaterial} attach="material" />
            </mesh>
            {/* Hexagonal Vertical Pylon Body */}
            <mesh position={[0, 3.8, 0]}>
              <cylinderGeometry args={[0.38, 0.44, 7.1, 6]} />
              <primitive object={pylonMaterial} attach="material" />
            </mesh>
            {/* Structural Crown Capital */}
            <mesh position={[0, 7.4, 0]}>
              <boxGeometry args={[1.2, 0.25, 1.2]} />
              <primitive object={titaniumMaterial} attach="material" />
            </mesh>

            {/* Vertical Cyan Data Conduit Groove facing Central Aisle (-X) */}
            <mesh position={[-0.42, 3.8, 0]}>
              <boxGeometry args={[0.02, 6.2, 0.06]} />
              <primitive object={cyanGuidanceMaterial} attach="material" />
            </mesh>
          </group>
        </group>
      ))}

      {/* --- FUTURISTIC RESEARCH PODS & FLOATING GLASS CONSOLES --- */}
      {researchPods.map((pod, idx) => (
        <group key={`research-pod-${idx}`} position={[pod.x, 0, pod.z]}>
          {/* Smoked Glass Cantilever Desk Surface */}
          <mesh position={[0, 0.82, 0]}>
            <boxGeometry args={[2.5, 0.04, 1.3]} />
            <primitive object={smokedGlassMaterial} attach="material" />
          </mesh>
          {/* Brushed Dark Titanium Desk Frame */}
          <mesh position={[0, 0.81, 0]}>
            <boxGeometry args={[2.54, 0.02, 1.34]} />
            <primitive object={titaniumMaterial} attach="material" />
          </mesh>
          {/* Sleek Aerodynamic Angled Legs */}
          {[-1.15, 1.15].map((lx) => (
            <mesh key={`desk-leg-${lx}`} position={[lx, 0.4, 0]}>
              <boxGeometry args={[0.08, 0.8, 1.1]} />
              <primitive object={titaniumMaterial} attach="material" />
            </mesh>
          ))}

          {/* Recessed Cyan Edge Underlight */}
          <mesh position={[0, 0.79, 0]}>
            <boxGeometry args={[2.4, 0.015, 1.2]} />
            <primitive object={cyanGuidanceMaterial} attach="material" />
          </mesh>

          {/* Floating Holographic Console Terminal */}
          <group position={[0, 0.86, 0]}>
            {/* Metallic Console Base */}
            <mesh position={[0, 0.02, 0]}>
              <boxGeometry args={[0.4, 0.015, 0.25]} />
              <primitive object={titaniumMaterial} attach="material" />
            </mesh>
            {/* Angled Holographic Glass Display */}
            <mesh position={[0, 0.18, -0.05]} rotation={[-0.35, 0, 0]}>
              <boxGeometry args={[0.55, 0.3, 0.01]} />
              <primitive object={holoDisplayMaterial} attach="material" />
            </mesh>
          </group>

          {/* Minimalist Futuristic Ergonomic Stools */}
          <group position={[0, 0, 0.85]}>
            <mesh position={[0, 0.46, 0]}>
              <cylinderGeometry args={[0.26, 0.28, 0.06, 16]} />
              <primitive object={titaniumMaterial} attach="material" />
            </mesh>
            <mesh position={[0, 0.23, 0]}>
              <cylinderGeometry args={[0.04, 0.06, 0.46, 12]} />
              <primitive object={titaniumMaterial} attach="material" />
            </mesh>
          </group>
          <group position={[0, 0, -0.85]}>
            <mesh position={[0, 0.46, 0]}>
              <cylinderGeometry args={[0.26, 0.28, 0.06, 16]} />
              <primitive object={titaniumMaterial} attach="material" />
            </mesh>
            <mesh position={[0, 0.23, 0]}>
              <cylinderGeometry args={[0.04, 0.06, 0.46, 12]} />
              <primitive object={titaniumMaterial} attach="material" />
            </mesh>
          </group>
        </group>
      ))}

      {/* --- HOLOGRAPHIC DATA CORE MONUMENT (Centerpiece at X = 0, Z = 16m) --- */}
      <group position={[0, 0, 16]}>
        {/* Tiered Obsidian Plinth Base */}
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[1.8, 2.1, 0.3, 16]} />
          <primitive object={titaniumMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[1.4, 1.7, 0.15, 16]} />
          <primitive object={pylonMaterial} attach="material" />
        </mesh>

        {/* Concentric Illuminated Floor Ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.43, 0]}>
          <ringGeometry args={[1.2, 1.25, 32]} />
          <primitive object={cyanGuidanceMaterial} attach="material" />
        </mesh>

        {/* Central Crystalline Knowledge Core */}
        <mesh position={[0, 1.4, 0]}>
          <octahedronGeometry args={[0.55, 0]} />
          <meshBasicMaterial color="#38BDF8" wireframe />
        </mesh>
        <mesh position={[0, 1.4, 0]}>
          <octahedronGeometry args={[0.38, 0]} />
          <primitive object={holoDisplayMaterial} attach="material" />
        </mesh>

        {/* Outer Orbital Gyroscopic Rings */}
        <group position={[0, 1.4, 0]} rotation={[0.4, 0.6, 0]}>
          <mesh>
            <torusGeometry args={[0.95, 0.015, 8, 32]} />
            <primitive object={cyanGuidanceMaterial} attach="material" />
          </mesh>
        </group>
        <group position={[0, 1.4, 0]} rotation={[-0.5, 0.2, 0.8]}>
          <mesh>
            <torusGeometry args={[1.1, 0.012, 8, 32]} />
            <primitive object={violetAccentMaterial} attach="material" />
          </mesh>
        </group>
      </group>
    </group>
  );
};
