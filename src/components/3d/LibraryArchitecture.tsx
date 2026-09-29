import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useLibraryStore } from '../../store/useLibraryStore';

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
  cachedFloorTexture.repeat.set(16, 16);
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

  // Plants & Pots
  const plantLeafMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#15803D',
        roughness: 0.4,
        metalness: 0.02,
      }),
    []
  );

  const terracottaMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#C25E34', // Rich terracotta clay
        roughness: 0.85,
        metalness: 0.02,
      }),
    []
  );

  // Outside sky & landscape visible through windows
  const skyColor =
    atmosphere === 'day' ? '#60A5FA' : atmosphere === 'evening' ? '#F97316' : '#1E1B4B';

  const outdoorSunLightColor =
    atmosphere === 'day' ? '#FFFBEB' : atmosphere === 'evening' ? '#FED7AA' : '#38BDF8';

  const pillarZPositions = [20, 10, 0, -10, -20, -30, -40, -50];

  // Reading table locations
  const studyTables = [
    { x: -5.5, z: 4 },
    { x: 5.5, z: 4 },
    { x: -5.5, z: -20 },
    { x: 5.5, z: -20 },
  ];

  // Book cart locations
  const bookCarts = [
    { x: -2.8, z: 12, rot: 0.25 },
    { x: 2.8, z: -10, rot: -0.18 },
  ];

  // Planter locations
  const planterLocations = [
    { x: -8.8, z: 22 },
    { x: 8.8, z: 22 },
    { x: -8.8, z: -52 },
    { x: 8.8, z: -52 },
    { x: -8.8, z: -15 },
    { x: 8.8, z: -15 },
  ];

  return (
    <group>
      {/* --- WARM NATURAL OAK WOOD FLOOR --- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -15]} receiveShadow>
        <planeGeometry args={[94, 116]} />
        <primitive object={floorMaterial} attach="material" />
      </mesh>

      {/* --- MAIN AISLE CARPET RUNNER (Rich Burgundy / Emerald with Gold Trim) --- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, -15]}>
        <planeGeometry args={[4.2, 98]} />
        <meshStandardMaterial color="#7F1D1D" roughness={0.88} /> {/* Rich warm burgundy runner */}
      </mesh>
      {/* Warm Brass Carpet Trim Rails */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2.1, 0.008, -15]}>
        <planeGeometry args={[0.09, 98]} />
        <primitive object={brassMaterial} attach="material" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2.1, 0.008, -15]}>
        <planeGeometry args={[0.09, 98]} />
        <primitive object={brassMaterial} attach="material" />
      </mesh>

      {/* --- WARM IVORY WALLS WITH OAK WAINSCOTING --- */}
      {/* South Wall (Entrance Doorway) */}
      <group position={[0, 0, 30]}>
        {/* Upper Cream Wall */}
        <mesh position={[0, 5.2, 0]}>
          <boxGeometry args={[94, 5.6, 0.8]} />
          <primitive object={wallMaterial} attach="material" />
        </mesh>
        {/* Lower Oak Wainscoting */}
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[94, 2.4, 0.9]} />
          <primitive object={wainscotingMaterial} attach="material" />
        </mesh>
        {/* Wainscoting Chair Rail Moulding */}
        <mesh position={[0, 2.42, 0.06]}>
          <boxGeometry args={[94, 0.12, 1.0]} />
          <primitive object={warmOakMaterial} attach="material" />
        </mesh>
      </group>

      {/* North Far Wall */}
      <group position={[0, 0, -62]}>
        <mesh position={[0, 5.2, 0]}>
          <boxGeometry args={[94, 5.6, 0.8]} />
          <primitive object={wallMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[94, 2.4, 0.9]} />
          <primitive object={wainscotingMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 2.42, 0.06]}>
          <boxGeometry args={[94, 0.12, 1.0]} />
          <primitive object={warmOakMaterial} attach="material" />
        </mesh>
      </group>

      {/* West Wall */}
      <group position={[-44, 0, -15]}>
        <mesh position={[0, 5.2, 0]}>
          <boxGeometry args={[0.8, 5.6, 102]} />
          <primitive object={wallMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[0.9, 2.4, 102]} />
          <primitive object={wainscotingMaterial} attach="material" />
        </mesh>
        <mesh position={[0.06, 2.42, 0]}>
          <boxGeometry args={[1.0, 0.12, 102]} />
          <primitive object={warmOakMaterial} attach="material" />
        </mesh>
      </group>

      {/* East Wall */}
      <group position={[44, 0, -15]}>
        <mesh position={[0, 5.2, 0]}>
          <boxGeometry args={[0.8, 5.6, 102]} />
          <primitive object={wallMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[0.9, 2.4, 102]} />
          <primitive object={wainscotingMaterial} attach="material" />
        </mesh>
        <mesh position={[-0.06, 2.42, 0]}>
          <boxGeometry args={[1.0, 0.12, 102]} />
          <primitive object={warmOakMaterial} attach="material" />
        </mesh>
      </group>

      {/* --- LARGE SUNLIT ARCHED LIBRARY WINDOWS (With Green Garden / Campus View Outside) --- */}
      {[-30, -10, 10].map((z, i) => (
        <group key={`win-w-${i}`} position={[-43.4, 4.6, z]}>
          {/* Outdoor Sky & Tree Garden View */}
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[5.2, 4.8]} />
            <meshBasicMaterial color={skyColor} />
          </mesh>
          {/* Outdoor lush green tree silhouettes at bottom of window */}
          <mesh position={[0.02, -1.2, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[5.2, 2.2]} />
            <meshBasicMaterial color="#166534" />
          </mesh>
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

      {[-30, -10, 10].map((z, i) => (
        <group key={`win-e-${i}`} position={[43.4, 4.6, z]}>
          <mesh rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[5.2, 4.8]} />
            <meshBasicMaterial color={skyColor} />
          </mesh>
          <mesh position={[-0.02, -1.2, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[5.2, 2.2]} />
            <meshBasicMaterial color="#166534" />
          </mesh>
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

      {/* --- WARM IVORY VAULTED CEILING WITH TIMBER CROSSBEAMS --- */}
      <mesh position={[0, 8.2, -15]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[94, 102]} />
        <meshStandardMaterial color="#F8F4EA" roughness={0.92} /> {/* Warm ivory ceiling */}
      </mesh>
      {/* Central Glass Skylight pouring warm natural light down */}
      <mesh position={[0, 8.16, -15]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6.5, 94]} />
        <meshBasicMaterial color={outdoorSunLightColor} />
      </mesh>

      {/* Warm Timber Ceiling Beams and Hanging Brass Pendant Lanterns */}
      {pillarZPositions.map((z, idx) => (
        <group key={`ceiling-beam-${idx}`} position={[0, 8.0, z]}>
          <mesh>
            <boxGeometry args={[94, 0.45, 0.55]} />
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

      {/* --- NEOCLASSICAL CREAM STONE PILLARS WITH BRASS TRIM --- */}
      {pillarZPositions.map((z, idx) => (
        <group key={`pillars-${idx}`}>
          {/* Left Pillar */}
          <group position={[-10, 0, z]}>
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
          </group>

          {/* Right Pillar */}
          <group position={[10, 0, z]}>
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
          </group>
        </group>
      ))}

      {/* --- REALISTIC STUDY DESKS WITH BANKER LAMPS & BOOKS --- */}
      {studyTables.map((tbl, idx) => (
        <group key={`table-${idx}`} position={[tbl.x, 0, tbl.z]}>
          {/* Warm Oak Tabletop */}
          <mesh position={[0, 0.82, 0]}>
            <boxGeometry args={[2.5, 0.07, 1.4]} />
            <primitive object={warmOakMaterial} attach="material" />
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

          {/* Emerald Green Banker Desk Lamp */}
          <group position={[0, 0.85, 0]}>
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

          {/* Open Hardcover Book on Table */}
          <mesh position={[-0.55, 0.87, 0.12]} rotation={[0, 0.18, 0]}>
            <boxGeometry args={[0.36, 0.022, 0.26]} />
            <meshStandardMaterial color="#FDF8EA" roughness={0.8} />
          </mesh>
          {/* Closed Colorful Book and Pen */}
          <mesh position={[0.55, 0.87, -0.1]} rotation={[0, -0.25, 0]}>
            <boxGeometry args={[0.32, 0.03, 0.22]} />
            <meshStandardMaterial color="#DC2626" roughness={0.4} /> {/* Crimson tome */}
          </mesh>
          {/* Coffee Mug */}
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

      {/* --- POTTED FICUS / MONSTERA TREES IN TERRACOTTA PLANTERS --- */}
      {planterLocations.map((p, idx) => (
        <group key={`plant-${idx}`} position={[p.x, 0, p.z]}>
          {/* Terracotta Planter Pot */}
          <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.4, 0.28, 0.8, 16]} />
            <primitive object={terracottaMaterial} attach="material" />
          </mesh>
          {/* Lush Green Foliage */}
          <mesh position={[0, 1.05, 0]}>
            <dodecahedronGeometry args={[0.62]} />
            <primitive object={plantLeafMaterial} attach="material" />
          </mesh>
          <mesh position={[0.12, 1.45, -0.08]}>
            <dodecahedronGeometry args={[0.44]} />
            <primitive object={plantLeafMaterial} attach="material" />
          </mesh>
        </group>
      ))}

      {/* --- GRAND ENTRANCE RECEPTION & INFORMATION DESK --- */}
      <group position={[0, 0, 24]}>
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
