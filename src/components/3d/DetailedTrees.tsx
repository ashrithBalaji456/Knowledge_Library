import React, { useMemo } from 'react';
import * as THREE from 'three';

// --- SHARED REUSABLE GEOMETRIES & MATERIALS FOR MAXIMUM 60FPS PERFORMANCE ---
const TRUNK_MATERIAL = new THREE.MeshStandardMaterial({
  color: '#4A3525', // Rich natural aged wood bark
  roughness: 0.88,
  metalness: 0.05,
});

const SOIL_MATERIAL = new THREE.MeshStandardMaterial({
  color: '#29180C', // Rich damp organic potting soil / peat moss
  roughness: 0.95,
  metalness: 0.02,
});

const PLANTER_CERAMIC_WHITE = new THREE.MeshStandardMaterial({
  color: '#FBF9F5', // Matte fluted architectural stone/ceramic
  roughness: 0.45,
  metalness: 0.06,
});

const PLANTER_BRASS_TRIM = new THREE.MeshStandardMaterial({
  color: '#C69C3A', // Polished warm brass base and rim
  roughness: 0.28,
  metalness: 0.82,
});

const LEAF_DARK_GREEN = new THREE.MeshStandardMaterial({
  color: '#14532D', // Deep emerald mature canopy
  roughness: 0.42,
  metalness: 0.04,
  side: THREE.DoubleSide,
});

const LEAF_MID_GREEN = new THREE.MeshStandardMaterial({
  color: '#15803D', // Vibrant rich botanical green
  roughness: 0.38,
  metalness: 0.04,
  side: THREE.DoubleSide,
});

const LEAF_LIGHT_GREEN = new THREE.MeshStandardMaterial({
  color: '#22C55E', // Fresh tender young leaf highlights
  roughness: 0.35,
  metalness: 0.04,
  side: THREE.DoubleSide,
});

const LEAF_OLIVE_GREEN = new THREE.MeshStandardMaterial({
  color: '#4D7C0F', // Warm olive/sage botanical tones
  roughness: 0.45,
  metalness: 0.03,
  side: THREE.DoubleSide,
});

// Single shared geometries
const GEOM_POT_BASE = new THREE.CylinderGeometry(0.55, 0.44, 0.9, 20);
const GEOM_POT_RIM = new THREE.TorusGeometry(0.56, 0.045, 12, 24);
const GEOM_POT_BRASS_FOOT = new THREE.CylinderGeometry(0.48, 0.5, 0.08, 20);
const GEOM_SOIL = new THREE.CylinderGeometry(0.51, 0.51, 0.06, 16);

// Shared trunk segment geometries
const GEOM_TRUNK_LOWER = new THREE.CylinderGeometry(0.09, 0.13, 1.4, 10);
const GEOM_TRUNK_MID = new THREE.CylinderGeometry(0.065, 0.09, 1.3, 10);
const GEOM_BRANCH = new THREE.CylinderGeometry(0.035, 0.06, 0.9, 8);

// Shared foliage canopy volumes
const GEOM_FOLIAGE_LG = new THREE.DodecahedronGeometry(0.55, 1);
const GEOM_FOLIAGE_MD = new THREE.DodecahedronGeometry(0.42, 1);
const GEOM_FOLIAGE_SM = new THREE.DodecahedronGeometry(0.32, 1);

export interface TreeProps {
  position: [number, number, number];
  rotationY?: number;
  scale?: number;
  variant?: 'fiddle-leaf' | 'olive' | 'monstera';
}

/**
 * High-detail indoor conservatory tree in luxury fluted stone & brass planter urn
 */
export const DetailedIndoorTree: React.FC<TreeProps> = React.memo(
  ({ position, rotationY = 0, scale = 1.0, variant = 'fiddle-leaf' }) => {
    return (
      <group position={position} rotation={[0, rotationY, 0]} scale={scale}>
        {/* --- LUXURY FLUTED PLANTER URN --- */}
        <group position={[0, 0.45, 0]}>
          {/* Polished brass plinth foot */}
          <mesh position={[0, -0.42, 0]} geometry={GEOM_POT_BRASS_FOOT} material={PLANTER_BRASS_TRIM} />

          {/* Main fluted ceramic pot */}
          <mesh geometry={GEOM_POT_BASE} material={PLANTER_CERAMIC_WHITE} />

          {/* Top brass rim collar */}
          <mesh position={[0, 0.45, 0]} rotation={[Math.PI / 2, 0, 0]} geometry={GEOM_POT_RIM} material={PLANTER_BRASS_TRIM} />

          {/* Dark rich organic soil layer */}
          <mesh position={[0, 0.38, 0]} geometry={GEOM_SOIL} material={SOIL_MATERIAL} />

          {/* Spilling creeping moss & ivy over rim */}
          <mesh position={[0.42, 0.35, 0.2]} rotation={[0.4, 0.2, -0.3]}>
            <sphereGeometry args={[0.16, 8, 8]} />
            <primitive object={LEAF_DARK_GREEN} attach="material" />
          </mesh>
          <mesh position={[-0.4, 0.32, -0.22]} rotation={[-0.3, 0.5, 0.4]}>
            <sphereGeometry args={[0.18, 8, 8]} />
            <primitive object={LEAF_MID_GREEN} attach="material" />
          </mesh>
          <mesh position={[-0.15, 0.3, 0.44]} rotation={[0.5, -0.2, 0.1]}>
            <sphereGeometry args={[0.15, 8, 8]} />
            <primitive object={LEAF_OLIVE_GREEN} attach="material" />
          </mesh>
        </group>

        {/* --- ORGANIC TREE TRUNK WITH NATURAL TAPER & BRANCHES --- */}
        <group position={[0, 0.85, 0]}>
          {/* Lower organic trunk */}
          <mesh position={[0.02, 0.65, -0.01]} rotation={[0.04, 0, -0.03]} geometry={GEOM_TRUNK_LOWER} material={TRUNK_MATERIAL} />

          {/* Mid trunk node with natural organic sweep */}
          <mesh position={[-0.04, 1.8, 0.03]} rotation={[-0.08, 0.2, 0.06]} geometry={GEOM_TRUNK_MID} material={TRUNK_MATERIAL} />

          {/* Branch 1 — Left sweeping branch */}
          <mesh position={[-0.32, 2.15, 0.18]} rotation={[0.5, 0.2, 0.7]} geometry={GEOM_BRANCH} material={TRUNK_MATERIAL} />

          {/* Branch 2 — Right ascending branch */}
          <mesh position={[0.28, 2.3, -0.15]} rotation={[-0.4, -0.3, -0.6]} geometry={GEOM_BRANCH} material={TRUNK_MATERIAL} />

          {/* Branch 3 — Front arching branch */}
          <mesh position={[0.08, 2.45, 0.32]} rotation={[0.7, 0.1, 0.2]} geometry={GEOM_BRANCH} material={TRUNK_MATERIAL} />

          {/* Branch 4 — Rear crown branch */}
          <mesh position={[-0.12, 2.55, -0.28]} rotation={[-0.6, 0.4, -0.3]} geometry={GEOM_BRANCH} material={TRUNK_MATERIAL} />

          {/* --- LAYERED FULL BOTANICAL FOLIAGE CANOPY --- */}
          {/* Main central upper crown */}
          <mesh position={[0, 2.85, 0]} geometry={GEOM_FOLIAGE_LG} material={LEAF_DARK_GREEN} />
          <mesh position={[0.05, 3.15, 0.05]} geometry={GEOM_FOLIAGE_MD} material={LEAF_LIGHT_GREEN} />

          {/* Left lateral foliage tier */}
          <mesh position={[-0.65, 2.35, 0.32]} geometry={GEOM_FOLIAGE_MD} material={LEAF_MID_GREEN} />
          <mesh position={[-0.82, 2.52, 0.2]} geometry={GEOM_FOLIAGE_SM} material={LEAF_LIGHT_GREEN} />

          {/* Right lateral foliage tier */}
          <mesh position={[0.62, 2.5, -0.28]} geometry={GEOM_FOLIAGE_MD} material={LEAF_DARK_GREEN} />
          <mesh position={[0.78, 2.7, -0.15]} geometry={GEOM_FOLIAGE_SM} material={LEAF_MID_GREEN} />

          {/* Front forward foliage cluster */}
          <mesh position={[0.2, 2.65, 0.62]} geometry={GEOM_FOLIAGE_MD} material={variant === 'olive' ? LEAF_OLIVE_GREEN : LEAF_MID_GREEN} />
          <mesh position={[0.25, 2.9, 0.52]} geometry={GEOM_FOLIAGE_SM} material={LEAF_LIGHT_GREEN} />

          {/* Rear canopy backdrop cluster */}
          <mesh position={[-0.25, 2.78, -0.58]} geometry={GEOM_FOLIAGE_MD} material={LEAF_DARK_GREEN} />
          <mesh position={[-0.32, 3.02, -0.42]} geometry={GEOM_FOLIAGE_SM} material={variant === 'olive' ? LEAF_OLIVE_GREEN : LEAF_MID_GREEN} />

          {/* Lower leaf clusters for realistic lush body */}
          <mesh position={[0.38, 1.85, 0.28]} geometry={GEOM_FOLIAGE_SM} material={LEAF_DARK_GREEN} />
          <mesh position={[-0.42, 1.75, -0.22]} geometry={GEOM_FOLIAGE_SM} material={LEAF_MID_GREEN} />
        </group>
      </group>
    );
  }
);

/**
 * Towering 3D Outdoor Courtyard & Garden Tree (Visible outside through the large library arched windows)
 */
export const DetailedCourtyardTree: React.FC<{ position: [number, number, number]; scale?: number; rotationY?: number }> = React.memo(
  ({ position, scale = 1.0, rotationY = 0 }) => {
    return (
      <group position={position} rotation={[0, rotationY, 0]} scale={scale}>
        {/* Massive organic trunk */}
        <mesh position={[0, 3.5, 0]}>
          <cylinderGeometry args={[0.38, 0.65, 7.0, 12]} />
          <primitive object={TRUNK_MATERIAL} attach="material" />
        </mesh>

        {/* Tree Root Flare on Grass */}
        {[-0.4, 0.4].map((rx, idx) => (
          <mesh key={`root-${idx}`} position={[rx, 0.4, rx * 0.5]} rotation={[0, idx * 1.5, 0.3 * (idx === 0 ? 1 : -1)]}>
            <cylinderGeometry args={[0.15, 0.28, 1.2, 8]} />
            <primitive object={TRUNK_MATERIAL} attach="material" />
          </mesh>
        ))}

        {/* Heavy Secondary Branches */}
        <mesh position={[-0.8, 6.2, 0.5]} rotation={[0.4, 0.3, 0.65]}>
          <cylinderGeometry args={[0.18, 0.28, 2.8, 8]} />
          <primitive object={TRUNK_MATERIAL} attach="material" />
        </mesh>
        <mesh position={[0.9, 6.6, -0.4]} rotation={[-0.3, -0.4, -0.6]}>
          <cylinderGeometry args={[0.16, 0.26, 2.9, 8]} />
          <primitive object={TRUNK_MATERIAL} attach="material" />
        </mesh>
        <mesh position={[0.1, 7.1, 0.8]} rotation={[0.6, -0.1, 0.2]}>
          <cylinderGeometry args={[0.14, 0.22, 2.4, 8]} />
          <primitive object={TRUNK_MATERIAL} attach="material" />
        </mesh>

        {/* Dense, Multi-Tiered Outdoor Forest Canopy */}
        {/* Main upper crown */}
        <mesh position={[0, 9.2, 0]}>
          <dodecahedronGeometry args={[2.8, 1]} />
          <primitive object={LEAF_DARK_GREEN} attach="material" />
        </mesh>
        <mesh position={[0.4, 10.5, 0.2]}>
          <dodecahedronGeometry args={[2.1, 1]} />
          <primitive object={LEAF_MID_GREEN} attach="material" />
        </mesh>
        <mesh position={[-0.3, 11.4, -0.2]}>
          <dodecahedronGeometry args={[1.5, 1]} />
          <primitive object={LEAF_LIGHT_GREEN} attach="material" />
        </mesh>

        {/* Outreaching Branch Foliage Clouds */}
        <mesh position={[-2.2, 7.8, 0.9]}>
          <dodecahedronGeometry args={[1.9, 1]} />
          <primitive object={LEAF_MID_GREEN} attach="material" />
        </mesh>
        <mesh position={[2.4, 8.2, -0.8]}>
          <dodecahedronGeometry args={[2.0, 1]} />
          <primitive object={LEAF_DARK_GREEN} attach="material" />
        </mesh>
        <mesh position={[0.5, 8.4, 2.2]}>
          <dodecahedronGeometry args={[1.8, 1]} />
          <primitive object={LEAF_OLIVE_GREEN} attach="material" />
        </mesh>
        <mesh position={[-0.8, 8.6, -2.1]}>
          <dodecahedronGeometry args={[1.85, 1]} />
          <primitive object={LEAF_MID_GREEN} attach="material" />
        </mesh>
      </group>
    );
  }
);
