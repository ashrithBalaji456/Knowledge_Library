import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useLibraryStore } from '../../store/useLibraryStore';
import { DetailedIndoorTree, DetailedCourtyardTree } from './DetailedTrees';

// Generate warm natural oak parquet wood plank floor texture
let cachedFloorTexture: THREE.CanvasTexture | null = null;
function getWarmWoodFloorTexture(): THREE.CanvasTexture {
  if (cachedFloorTexture) return cachedFloorTexture;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Warm honey/amber oak planks
  const plankH = 32;
  const plankW = 128;

  ctx.fillStyle = '#8B5A35'; // Base warm oak
  ctx.fillRect(0, 0, 512, 512);

  // Draw offset wood planks with natural grain variations
  const plankColors = ['#8A5A3B', '#966342', '#7D4F31', '#A06B42', '#855636', '#925F3E'];

  for (let y = 0; y < 512; y += plankH) {
    const rowOffset = (Math.floor(y / plankH) % 2) * (plankW / 2);
    for (let x = -plankW; x < 512 + plankW; x += plankW) {
      const colorIdx = Math.abs(Math.floor(Math.sin(x * 12 + y * 7) * plankColors.length)) % plankColors.length;
      ctx.fillStyle = plankColors[colorIdx];
      ctx.fillRect(x + rowOffset, y, plankW - 2, plankH - 2);

      // Subtle fine wood grain lines
      ctx.strokeStyle = 'rgba(60, 35, 15, 0.18)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + rowOffset + 4, y + plankH * 0.35);
      ctx.lineTo(x + rowOffset + plankW - 8, y + plankH * 0.35);
      ctx.moveTo(x + rowOffset + 8, y + plankH * 0.7);
      ctx.lineTo(x + rowOffset + plankW - 12, y + plankH * 0.7);
      ctx.stroke();

      // Soft plank border groove
      ctx.strokeStyle = '#5E381E';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x + rowOffset, y, plankW - 2, plankH - 2);
    }
  }

  cachedFloorTexture = new THREE.CanvasTexture(canvas);
  cachedFloorTexture.wrapS = THREE.RepeatWrapping;
  cachedFloorTexture.wrapT = THREE.RepeatWrapping;
  cachedFloorTexture.repeat.set(24, 32);
  return cachedFloorTexture;
}

export const LibraryArchitecture: React.FC = () => {
  const atmosphere = useLibraryStore((s) => s.atmosphere);
  const floorTexture = useMemo(() => getWarmWoodFloorTexture(), []);

  // Shared warm architectural materials
  const floorMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: floorTexture,
        roughness: 0.32,
        metalness: 0.05,
      }),
    [floorTexture]
  );

  // Warm cream/ivory walls (#F5F0E6)
  const wallMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#F5F0E6', // Warm ivory
        roughness: 0.85,
        metalness: 0.02,
      }),
    []
  );

  // Lower wall wainscoting panels (rich honey-oak)
  const wainscotingMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#7D4F31', // Warm library oak wainscot
        roughness: 0.5,
        metalness: 0.05,
      }),
    []
  );

  // Warm Sandstone / Travertine columns
  const stonePillarMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#EFE7D8', // Warm creamy sandstone
        roughness: 0.65,
        metalness: 0.08,
      }),
    []
  );

  // Natural warm oak furniture
  const warmOakMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#8B5A35', // Warm natural oak
        roughness: 0.45,
        metalness: 0.05,
      }),
    []
  );

  // Antique brass / warm gold (#C69C3A)
  const brassMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#C69C3A',
        roughness: 0.3,
        metalness: 0.8,
      }),
    []
  );

  // Emerald green glass for banker lamps
  const bankerGlassMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#065F46', // Emerald green banker shade
        roughness: 0.2,
        metalness: 0.1,
        emissive: new THREE.Color('#10B981'),
        emissiveIntensity: atmosphere === 'night' ? 0.7 : 0.4,
      }),
    [atmosphere]
  );

  // Glowing warm sconce candle / frosted tulip glass
  const sconceGlowMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#FFFBEB',
        emissive: new THREE.Color(atmosphere === 'night' ? '#F59E0B' : '#FDE68A'),
        emissiveIntensity: atmosphere === 'night' ? 1.0 : 0.6,
        roughness: 0.2,
      }),
    [atmosphere]
  );

  // Dark green desk blotter leather
  const deskLeatherMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1B3D2F', // Classic British library desk leather
        roughness: 0.62,
        metalness: 0.04,
      }),
    []
  );

  // Aged manuscript parchment paper
  const parchmentMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#F4ECD8', // Aged ivory parchment paper
        roughness: 0.85,
        metalness: 0.02,
      }),
    []
  );

  // Outdoor sky & landscape visible through windows
  const skyColor =
    atmosphere === 'day' ? '#60A5FA' : atmosphere === 'evening' ? '#F97316' : '#1E1B4B';

  const outdoorSunLightColor =
    atmosphere === 'day' ? '#FFFBEB' : atmosphere === 'evening' ? '#FED7AA' : '#38BDF8';

  // Stately colonnade pillars spaced along the grand nave (100% collision-free)
  const pillarZPositions = [32, 20, 8, -4, -16, -28, -40, -52, -64, -76, -88, -100, -112];
  const windowZPositions = [-105, -85, -65, -45, -25, -5, 15, 35];

  // Reading table locations in quiet promenade alcoves
  const studyTables = [
    { x: -6.0, z: -8 },
    { x: 6.0, z: -8 },
    { x: -6.0, z: -28 },
    { x: 6.0, z: -28 },
  ];

  // Book cart locations
  const bookCarts = [
    { x: -3.2, z: 22, rot: 0.25 },
    { x: 3.2, z: -2, rot: -0.18 },
  ];

  // Botanical Indoor Planter Locations aligned with colonnade bays
  const planterLocations = [
    { x: -13.6, z: 32, rot: 0.3, variant: 'fiddle-leaf' as const, scale: 1.05 },
    { x: 13.6, z: 32, rot: -0.5, variant: 'olive' as const, scale: 1.0 },
    { x: -13.6, z: -100, rot: 1.2, variant: 'olive' as const, scale: 1.08 },
    { x: 13.6, z: -100, rot: -1.0, variant: 'fiddle-leaf' as const, scale: 1.05 },
    { x: -13.6, z: -16, rot: 2.1, variant: 'fiddle-leaf' as const, scale: 1.1 },
    { x: 13.6, z: -16, rot: -2.3, variant: 'olive' as const, scale: 1.05 },
    { x: -13.6, z: 8, rot: 0.8, variant: 'olive' as const, scale: 0.95 },
    { x: 13.6, z: 8, rot: -0.7, variant: 'fiddle-leaf' as const, scale: 0.95 },
    { x: -13.6, z: -64, rot: 1.7, variant: 'fiddle-leaf' as const, scale: 1.0 },
    { x: 13.6, z: -64, rot: -1.4, variant: 'olive' as const, scale: 1.0 },
  ];

  return (
    <group>
      {/* --- ENLARGED WARM NATURAL OAK WOOD FLOOR (124m x 172m) --- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -38]} receiveShadow>
        <planeGeometry args={[124, 172]} />
        <primitive object={floorMaterial} attach="material" />
      </mesh>

      {/* --- MAIN AISLE CARPET RUNNER (Rich Burgundy with Gold Trim) --- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, -38]}>
        <planeGeometry args={[4.8, 164]} />
        <meshStandardMaterial color="#7F1D1D" roughness={0.88} />
      </mesh>
      {/* Warm Brass Carpet Trim Rails */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2.4, 0.008, -38]}>
        <planeGeometry args={[0.1, 164]} />
        <primitive object={brassMaterial} attach="material" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2.4, 0.008, -38]}>
        <planeGeometry args={[0.1, 164]} />
        <primitive object={brassMaterial} attach="material" />
      </mesh>

      {/* --- EXPANDED ROYAL HALL WALLS WITH OAK WAINSCOTING --- */}
      {/* South Wall (Entrance Doorway at Z = +44) */}
      <group position={[0, 0, 44]}>
        <mesh position={[0, 5.2, 0]}>
          <boxGeometry args={[120, 5.6, 0.8]} />
          <primitive object={wallMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[120, 2.4, 0.9]} />
          <primitive object={wainscotingMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 2.42, 0.06]}>
          <boxGeometry args={[120, 0.12, 1.0]} />
          <primitive object={warmOakMaterial} attach="material" />
        </mesh>
      </group>

      {/* North Far Wall (Z = -120, Giving Grand Space for Vedic Itihasa) */}
      <group position={[0, 0, -120]}>
        <mesh position={[0, 5.2, 0]}>
          <boxGeometry args={[120, 5.6, 0.8]} />
          <primitive object={wallMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[120, 2.4, 0.9]} />
          <primitive object={wainscotingMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 2.42, 0.06]}>
          <boxGeometry args={[120, 0.12, 1.0]} />
          <primitive object={warmOakMaterial} attach="material" />
        </mesh>
      </group>

      {/* West Wall (X = -58, Roomy Technical Wing) */}
      <group position={[-58, 0, -38]}>
        <mesh position={[0, 5.2, 0]}>
          <boxGeometry args={[0.8, 5.6, 168]} />
          <primitive object={wallMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[0.9, 2.4, 168]} />
          <primitive object={wainscotingMaterial} attach="material" />
        </mesh>
        <mesh position={[0.06, 2.42, 0]}>
          <boxGeometry args={[1.0, 0.12, 168]} />
          <primitive object={warmOakMaterial} attach="material" />
        </mesh>
      </group>

      {/* East Wall (X = +58, Roomy Data & AI Wing) */}
      <group position={[58, 0, -38]}>
        <mesh position={[0, 5.2, 0]}>
          <boxGeometry args={[0.8, 5.6, 168]} />
          <primitive object={wallMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[0.9, 2.4, 168]} />
          <primitive object={wainscotingMaterial} attach="material" />
        </mesh>
        <mesh position={[-0.06, 2.42, 0]}>
          <boxGeometry args={[1.0, 0.12, 168]} />
          <primitive object={warmOakMaterial} attach="material" />
        </mesh>
      </group>

      {/* --- LARGE SUNLIT ARCHED LIBRARY WINDOWS (West and East Expanses) --- */}
      {windowZPositions.map((z, i) => (
        <group key={`win-w-${i}`} position={[-57.4, 4.6, z]}>
          {/* Outdoor Sky Backdrop */}
          <mesh position={[-5.0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[14, 7.5]} />
            <meshBasicMaterial color={skyColor} />
          </mesh>

          {/* Outdoor rolling green lawn ground */}
          <mesh position={[-3.5, -4.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[10, 16]} />
            <meshStandardMaterial color="#1E3A1A" roughness={0.9} />
          </mesh>

          {/* Towering 3D Courtyard Trees in outdoor view */}
          <group position={[-2.8, -4.6, -2.6]}>
            <DetailedCourtyardTree position={[0, 0, 0]} scale={0.72} rotationY={0.8 * i} />
          </group>
          <group position={[-3.8, -4.6, 2.4]}>
            <DetailedCourtyardTree position={[0, 0, 0]} scale={0.85} rotationY={1.4 * i + 0.6} />
          </group>

          {/* Oak Arched Window Frame & Mullions */}
          <mesh position={[0.04, 0, 0]}>
            <boxGeometry args={[0.08, 4.8, 0.09]} />
            <primitive object={warmOakMaterial} attach="material" />
          </mesh>
          <mesh position={[0.04, 0, 0]}>
            <boxGeometry args={[0.08, 0.09, 5.2]} />
            <primitive object={warmOakMaterial} attach="material" />
          </mesh>
          <mesh position={[0.04, 1.4, 0]}>
            <boxGeometry args={[0.08, 0.09, 5.2]} />
            <primitive object={warmOakMaterial} attach="material" />
          </mesh>
        </group>
      ))}

      {windowZPositions.map((z, i) => (
        <group key={`win-e-${i}`} position={[57.4, 4.6, z]}>
          {/* Outdoor Sky Backdrop */}
          <mesh position={[5.0, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[14, 7.5]} />
            <meshBasicMaterial color={skyColor} />
          </mesh>

          {/* Outdoor rolling green lawn ground */}
          <mesh position={[3.5, -4.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[10, 16]} />
            <meshStandardMaterial color="#1E3A1A" roughness={0.9} />
          </mesh>

          {/* Towering 3D Courtyard Trees in outdoor view */}
          <group position={[2.8, -4.6, -2.5]}>
            <DetailedCourtyardTree position={[0, 0, 0]} scale={0.72} rotationY={1.1 * i} />
          </group>
          <group position={[3.8, -4.6, 2.5]}>
            <DetailedCourtyardTree position={[0, 0, 0]} scale={0.85} rotationY={0.9 * i + 1.2} />
          </group>

          {/* Oak Arched Window Frame & Mullions */}
          <mesh position={[-0.04, 0, 0]}>
            <boxGeometry args={[0.08, 4.8, 0.09]} />
            <primitive object={warmOakMaterial} attach="material" />
          </mesh>
          <mesh position={[-0.04, 0, 0]}>
            <boxGeometry args={[0.08, 0.09, 5.2]} />
            <primitive object={warmOakMaterial} attach="material" />
          </mesh>
          <mesh position={[-0.04, 1.4, 0]}>
            <boxGeometry args={[0.08, 0.09, 5.2]} />
            <primitive object={warmOakMaterial} attach="material" />
          </mesh>
        </group>
      ))}

      {/* --- WARM IVORY VAULTED CEILING WITH TIMBER CROSSBEAMS (120m x 168m) --- */}
      <mesh position={[0, 8.2, -38]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[120, 168]} />
        <meshStandardMaterial color="#F8F4EA" roughness={0.92} />
      </mesh>
      {/* Central Glass Skylight pouring warm natural light down */}
      <mesh position={[0, 8.16, -38]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7.0, 156]} />
        <meshBasicMaterial color={outdoorSunLightColor} />
      </mesh>

      {/* Warm Timber Ceiling Beams and Hanging Brass Pendant Lanterns */}
      {pillarZPositions.map((z, idx) => (
        <group key={`ceiling-beam-${idx}`} position={[0, 8.0, z]}>
          <mesh>
            <boxGeometry args={[120, 0.45, 0.55]} />
            <primitive object={warmOakMaterial} attach="material" />
          </mesh>
          {/* Classical Brass Chandelier Pendant */}
          <group position={[0, -0.9, 0]}>
            <mesh>
              <cylinderGeometry args={[0.015, 0.015, 1.6]} />
              <primitive object={brassMaterial} attach="material" />
            </mesh>
            <mesh position={[0, -0.85, 0]}>
              <cylinderGeometry args={[0.9, 0.7, 0.28, 12]} />
              <primitive object={brassMaterial} attach="material" />
            </mesh>
            {/* Luminous warm frosted glass glow */}
            <mesh position={[0, -0.95, 0]}>
              <sphereGeometry args={[0.18, 16, 16]} />
              <meshBasicMaterial color="#FFFBEB" />
            </mesh>
          </group>
        </group>
      ))}

      {/* --- NEOCLASSICAL CREAM STONE COLONNADE PILLARS AT X = +-15 (100% COLLISION FREE) --- */}
      {pillarZPositions.map((z, idx) => (
        <group key={`pillars-${idx}`}>
          {/* Left Colonnade Pillar at X = -15 */}
          <group position={[-15, 0, z]}>
            <mesh position={[0, 0.3, 0]}>
              <boxGeometry args={[1.2, 0.6, 1.2]} />
              <primitive object={warmOakMaterial} attach="material" />
            </mesh>
            <mesh position={[0, 3.8, 0]}>
              <cylinderGeometry args={[0.42, 0.46, 7.0, 16]} />
              <primitive object={stonePillarMaterial} attach="material" />
            </mesh>
            <mesh position={[0, 7.35, 0]}>
              <boxGeometry args={[1.25, 0.35, 1.25]} />
              <primitive object={brassMaterial} attach="material" />
            </mesh>

            {/* Classical Antique Brass Wall Sconce facing Central Hall (+X) */}
            <group position={[0.44, 3.6, 0]}>
              <mesh position={[0.015, 0, 0]}>
                <boxGeometry args={[0.03, 0.36, 0.14]} />
                <primitive object={brassMaterial} attach="material" />
              </mesh>
              <mesh position={[0.12, -0.06, 0]} rotation={[0, 0, -Math.PI / 4]}>
                <cylinderGeometry args={[0.012, 0.012, 0.18, 8]} />
                <primitive object={brassMaterial} attach="material" />
              </mesh>
              <mesh position={[0.18, 0.02, 0]}>
                <cylinderGeometry args={[0.05, 0.03, 0.06, 12]} />
                <primitive object={brassMaterial} attach="material" />
              </mesh>
              <mesh position={[0.18, 0.1, 0]}>
                <sphereGeometry args={[0.065, 12, 12]} />
                <primitive object={sconceGlowMaterial} attach="material" />
              </mesh>
            </group>
          </group>

          {/* Right Colonnade Pillar at X = +15 */}
          <group position={[15, 0, z]}>
            <mesh position={[0, 0.3, 0]}>
              <boxGeometry args={[1.2, 0.6, 1.2]} />
              <primitive object={warmOakMaterial} attach="material" />
            </mesh>
            <mesh position={[0, 3.8, 0]}>
              <cylinderGeometry args={[0.42, 0.46, 7.0, 16]} />
              <primitive object={stonePillarMaterial} attach="material" />
            </mesh>
            <mesh position={[0, 7.35, 0]}>
              <boxGeometry args={[1.25, 0.35, 1.25]} />
              <primitive object={brassMaterial} attach="material" />
            </mesh>

            {/* Classical Antique Brass Wall Sconce facing Central Hall (-X) */}
            <group position={[-0.44, 3.6, 0]}>
              <mesh position={[-0.015, 0, 0]}>
                <boxGeometry args={[0.03, 0.36, 0.14]} />
                <primitive object={brassMaterial} attach="material" />
              </mesh>
              <mesh position={[-0.12, -0.06, 0]} rotation={[0, 0, Math.PI / 4]}>
                <cylinderGeometry args={[0.012, 0.012, 0.18, 8]} />
                <primitive object={brassMaterial} attach="material" />
              </mesh>
              <mesh position={[-0.18, 0.02, 0]}>
                <cylinderGeometry args={[0.05, 0.03, 0.06, 12]} />
                <primitive object={brassMaterial} attach="material" />
              </mesh>
              <mesh position={[-0.18, 0.1, 0]}>
                <sphereGeometry args={[0.065, 12, 12]} />
                <primitive object={sconceGlowMaterial} attach="material" />
              </mesh>
            </group>
          </group>
        </group>
      ))}

      {/* --- REALISTIC STUDY DESKS WITH BANKER LAMPS, LEATHER BLOTTERS & SCHOLARLY ACCESSORIES --- */}
      {studyTables.map((tbl, idx) => (
        <group key={`table-${idx}`} position={[tbl.x, 0, tbl.z]}>
          {/* Warm Oak Tabletop */}
          <mesh position={[0, 0.82, 0]}>
            <boxGeometry args={[2.5, 0.07, 1.4]} />
            <primitive object={warmOakMaterial} attach="material" />
          </mesh>
          {/* Beveled edge trim */}
          <mesh position={[0, 0.84, 0]}>
            <boxGeometry args={[2.52, 0.02, 1.42]} />
            <primitive object={wainscotingMaterial} attach="material" />
          </mesh>
          {/* Table Legs */}
          {[-1.1, 1.1].map((lx) =>
            [-0.55, 0.55].map((lz) => (
              <mesh key={`leg-${lx}-${lz}`} position={[lx, 0.4, lz]}>
                <boxGeometry args={[0.09, 0.8, 0.09]} />
                <primitive object={warmOakMaterial} attach="material" />
              </mesh>
            ))
          )}

          {/* Luxury Green Leather Blotter Pad with Gold Edge */}
          <mesh position={[0, 0.856, 0]}>
            <boxGeometry args={[1.5, 0.006, 0.88]} />
            <primitive object={deskLeatherMaterial} attach="material" />
          </mesh>
          <mesh position={[0, 0.857, 0]}>
            <boxGeometry args={[1.52, 0.003, 0.04]} />
            <primitive object={brassMaterial} attach="material" />
          </mesh>

          {/* Emerald Green Banker Desk Lamp */}
          <group position={[0, 0.86, 0]}>
            <mesh position={[0, 0.02, 0]}>
              <cylinderGeometry args={[0.09, 0.1, 0.04, 12]} />
              <primitive object={brassMaterial} attach="material" />
            </mesh>
            <mesh position={[0, 0.16, 0]}>
              <cylinderGeometry args={[0.014, 0.014, 0.28]} />
              <primitive object={brassMaterial} attach="material" />
            </mesh>
            <mesh position={[0, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.05, 0.05, 0.18, 12]} />
              <primitive object={bankerGlassMaterial} attach="material" />
            </mesh>
          </group>

          {/* Open Hardcover Academic Folio */}
          <group position={[-0.52, 0.865, 0.1]} rotation={[0, 0.15, 0]}>
            <mesh position={[0, 0.01, 0]}>
              <boxGeometry args={[0.42, 0.018, 0.28]} />
              <primitive object={parchmentMaterial} attach="material" />
            </mesh>
            <mesh position={[0, 0.005, 0]}>
              <boxGeometry args={[0.43, 0.01, 0.29]} />
              <primitive object={wainscotingMaterial} attach="material" />
            </mesh>
          </group>

          {/* Antique Brass Inkwell & Goose Feather Quill */}
          <group position={[0.55, 0.865, 0.25]}>
            <mesh position={[0, 0.025, 0]}>
              <cylinderGeometry args={[0.035, 0.04, 0.05, 12]} />
              <primitive object={brassMaterial} attach="material" />
            </mesh>
            <mesh position={[-0.02, 0.12, 0.02]} rotation={[0.3, 0, -0.4]}>
              <cylinderGeometry args={[0.003, 0.01, 0.22, 6]} />
              <primitive object={parchmentMaterial} attach="material" />
            </mesh>
          </group>

          {/* Rolled Parchment Scroll with Red Ribbon */}
          <group position={[-0.55, 0.87, -0.25]} rotation={[0, 0.35, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.028, 0.028, 0.32, 12]} />
              <primitive object={parchmentMaterial} attach="material" />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.03, 0.03, 0.04, 12]} />
              <meshStandardMaterial color="#991B1B" roughness={0.4} />
            </mesh>
          </group>

          {/* Stack of Scholarly Volumes & Reading Glasses */}
          <group position={[0.55, 0.865, -0.15]} rotation={[0, -0.2, 0]}>
            <mesh position={[0, 0.02, 0]}>
              <boxGeometry args={[0.34, 0.035, 0.24]} />
              <meshStandardMaterial color="#881337" roughness={0.4} /> {/* Burgundy leather */}
            </mesh>
            <mesh position={[0.02, 0.05, -0.01]} rotation={[0, 0.08, 0]}>
              <boxGeometry args={[0.31, 0.03, 0.22]} />
              <meshStandardMaterial color="#1E3A8A" roughness={0.4} /> {/* Navy leather */}
            </mesh>
            <mesh position={[0, 0.075, 0]} rotation={[-Math.PI / 2, 0, 0.2]}>
              <torusGeometry args={[0.028, 0.005, 8, 16]} />
              <primitive object={brassMaterial} attach="material" />
            </mesh>
          </group>

          {/* Ceramic Coffee Mug */}
          <mesh position={[0.7, 0.9, 0.35]}>
            <cylinderGeometry args={[0.04, 0.035, 0.08, 12]} />
            <meshStandardMaterial color="#FFFBEB" roughness={0.3} />
          </mesh>

          {/* Study Chairs */}
          <group position={[0, 0, 1.0]}>
            <mesh position={[0, 0.48, 0]}>
              <boxGeometry args={[0.56, 0.05, 0.52]} />
              <primitive object={warmOakMaterial} attach="material" />
            </mesh>
            <mesh position={[0, 0.84, 0.23]}>
              <boxGeometry args={[0.56, 0.68, 0.05]} />
              <primitive object={warmOakMaterial} attach="material" />
            </mesh>
          </group>
          <group position={[0, 0, -1.0]} rotation={[0, Math.PI, 0]}>
            <mesh position={[0, 0.48, 0]}>
              <boxGeometry args={[0.56, 0.05, 0.52]} />
              <primitive object={warmOakMaterial} attach="material" />
            </mesh>
            <mesh position={[0, 0.84, 0.23]}>
              <boxGeometry args={[0.56, 0.68, 0.05]} />
              <primitive object={warmOakMaterial} attach="material" />
            </mesh>
          </group>
        </group>
      ))}

      {/* --- CELESTIAL BRASS ARMILLARY GLOBE ON SCULPTED OAK PEDESTAL --- */}
      <group position={[-3.6, 0, 19]}>
        {/* Octagonal carved oak plinth base */}
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.38, 0.45, 1.1, 8]} />
          <primitive object={warmOakMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 1.12, 0]}>
          <cylinderGeometry args={[0.42, 0.38, 0.08, 8]} />
          <primitive object={brassMaterial} attach="material" />
        </mesh>
        {/* Brass globe meridian ring & axial rings */}
        <group position={[0, 1.58, 0]} rotation={[0.4, 0.3, 0]}>
          {/* Outer meridian ring */}
          <mesh>
            <torusGeometry args={[0.38, 0.02, 12, 32]} />
            <primitive object={brassMaterial} attach="material" />
          </mesh>
          {/* Inner celestial equatorial ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.36, 0.016, 12, 32]} />
            <primitive object={brassMaterial} attach="material" />
          </mesh>
          {/* Oblique ecliptic zodiac ring */}
          <mesh rotation={[0.42, 0, 0]}>
            <torusGeometry args={[0.34, 0.018, 12, 32]} />
            <primitive object={brassMaterial} attach="material" />
          </mesh>
          {/* Central polished brass Earth sphere */}
          <mesh>
            <sphereGeometry args={[0.12, 16, 16]} />
            <primitive object={brassMaterial} attach="material" />
          </mesh>
          {/* Axis rod */}
          <mesh>
            <cylinderGeometry args={[0.01, 0.01, 0.88, 8]} />
            <primitive object={brassMaterial} attach="material" />
          </mesh>
        </group>
      </group>

      {/* --- CLASSIC ROLLING LIBRARY SHELF LADDER --- */}
      <group position={[-11.2, 0, -5]} rotation={[0, 0, 0.12]}>
        {/* Left rail */}
        <mesh position={[-0.24, 2.8, 0]}>
          <boxGeometry args={[0.05, 5.6, 0.08]} />
          <primitive object={warmOakMaterial} attach="material" />
        </mesh>
        {/* Right rail */}
        <mesh position={[0.24, 2.8, 0]}>
          <boxGeometry args={[0.05, 5.6, 0.08]} />
          <primitive object={warmOakMaterial} attach="material" />
        </mesh>
        {/* Brass ladder rungs */}
        {Array.from({ length: 12 }).map((_, rIdx) => (
          <mesh key={`rung-${rIdx}`} position={[0, 0.5 + rIdx * 0.42, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.015, 0.015, 0.46, 8]} />
            <primitive object={brassMaterial} attach="material" />
          </mesh>
        ))}
        {/* Brass rolling wheel trucks at bottom */}
        {[-0.24, 0.24].map((rx, idx) => (
          <mesh key={`ladder-wheel-${idx}`} position={[rx, 0.06, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.06, 0.06, 0.04, 12]} />
            <primitive object={brassMaterial} attach="material" />
          </mesh>
        ))}
        {/* Top brass hook rail brackets */}
        {[-0.24, 0.24].map((rx, idx) => (
          <mesh key={`ladder-hook-${idx}`} position={[rx, 5.5, 0.06]}>
            <boxGeometry args={[0.04, 0.14, 0.12]} />
            <primitive object={brassMaterial} attach="material" />
          </mesh>
        ))}
      </group>

      {/* --- WHEELED WOODEN LIBRARY BOOK CARTS --- */}
      {bookCarts.map((cart, idx) => (
        <group key={`cart-${idx}`} position={[cart.x, 0, cart.z]} rotation={[0, cart.rot, 0]}>
          {/* Cart Frame */}
          <mesh position={[0, 0.55, 0]}>
            <boxGeometry args={[0.55, 0.85, 0.95]} />
            <primitive object={warmOakMaterial} attach="material" />
          </mesh>
          {/* Cart Wheels */}
          {[-0.22, 0.22].map((wx) =>
            [-0.4, 0.4].map((wz) => (
              <mesh key={`wheel-${wx}-${wz}`} position={[wx, 0.06, wz]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.06, 0.06, 0.04, 12]} />
                <primitive object={brassMaterial} attach="material" />
              </mesh>
            ))
          )}
          {/* Stacked colorful books on cart shelves */}
          <mesh position={[0, 0.78, 0]}>
            <boxGeometry args={[0.42, 0.22, 0.78]} />
            <meshStandardMaterial color="#2563EB" roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* --- DETAILED BOTANICAL CONSERVATORY TREES IN FLUTED STONE & BRASS URNS --- */}
      {planterLocations.map((p, idx) => (
        <DetailedIndoorTree
          key={`plant-${idx}`}
          position={[p.x, 0, p.z]}
          rotationY={p.rot}
          scale={p.scale}
          variant={p.variant}
        />
      ))}

      {/* --- GRAND ENTRANCE RECEPTION & INFORMATION DESK (Foyer at Z = +36) --- */}
      <group position={[0, 0, 36]}>
        <mesh position={[0, 0.52, 0]}>
          <boxGeometry args={[4.4, 1.04, 1.2]} />
          <primitive object={warmOakMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 1.06, 0]}>
          <boxGeometry args={[4.6, 0.08, 1.3]} />
          <primitive object={wainscotingMaterial} attach="material" />
        </mesh>
        {/* Brass Desk Lamp on Reception */}
        <group position={[1.5, 1.1, 0]}>
          <mesh position={[0, 0.16, 0]}>
            <cylinderGeometry args={[0.016, 0.016, 0.32]} />
            <primitive object={brassMaterial} attach="material" />
          </mesh>
          <mesh position={[0, 0.32, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.05, 0.05, 0.18, 12]} />
            <primitive object={bankerGlassMaterial} attach="material" />
          </mesh>
        </group>
        {/* Library Welcome Register Book */}
        <mesh position={[-0.4, 1.12, 0]} rotation={[0, 0.08, 0]}>
          <boxGeometry args={[0.42, 0.03, 0.32]} />
          <meshStandardMaterial color="#FDF8EA" roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
};
