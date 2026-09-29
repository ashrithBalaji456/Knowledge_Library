import React from 'react';
import * as THREE from 'three';
import { ShelfInfo } from '../../engine/placementEngine';

interface Bookshelf3DProps {
  shelf: ShelfInfo;
}

// Warm natural walnut and oak materials (#6B4226, #8B5A35, #A06B42)
const SHARED_WALNUT_FRAME_MATERIAL = new THREE.MeshStandardMaterial({
  color: '#6B4226', // Warm deep walnut
  roughness: 0.52,
  metalness: 0.04,
});

const SHARED_OAK_SHELF_MATERIAL = new THREE.MeshStandardMaterial({
  color: '#8B5A35', // Warm golden-brown oak
  roughness: 0.48,
  metalness: 0.04,
});

const SHARED_BACKBOARD_MATERIAL = new THREE.MeshStandardMaterial({
  color: '#A06B42', // Warm amber-tan interior wood backboard (makes books pop!)
  roughness: 0.6,
  metalness: 0.02,
});

// Antique brass / warm gold (#C69C3A)
const SHARED_BRASS_TRIM_MATERIAL = new THREE.MeshStandardMaterial({
  color: '#C69C3A',
  roughness: 0.28,
  metalness: 0.82,
});

// Luminous warm LED strip under each shelf tier (3000K warm glow)
const SHARED_SHELF_LIGHT_STRIP_MATERIAL = new THREE.MeshBasicMaterial({
  color: '#FEF3C7', // Warm incandescent golden-white
});

const ROW_BADGE_CACHE = new Map<string, THREE.CanvasTexture>();

function getOrCreateRowBadgeTexture(label: string): THREE.CanvasTexture {
  if (ROW_BADGE_CACHE.has(label)) return ROW_BADGE_CACHE.get(label)!;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  // Deep obsidian & brushed brass plaque background
  const bgGrad = ctx.createLinearGradient(0, 0, 1024, 0);
  bgGrad.addColorStop(0, '#1c1917');
  bgGrad.addColorStop(0.15, '#292524');
  bgGrad.addColorStop(0.5, '#1c1917');
  bgGrad.addColorStop(0.85, '#292524');
  bgGrad.addColorStop(1, '#1c1917');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 64);

  // Outer gold filigree border
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 3;
  ctx.strokeRect(4, 4, 1016, 56);

  ctx.strokeStyle = '#B45309';
  ctx.lineWidth = 1;
  ctx.strokeRect(8, 8, 1008, 48);

  // Left & right gold star accents
  ctx.fillStyle = '#FBBF24';
  ctx.font = 'bold 22px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('✦', 36, 32);
  ctx.fillText('✦', 1024 - 36, 32);

  // Clean bold title in warm ivory / gold
  ctx.font = '800 24px "Outfit", "Inter", sans-serif';
  ctx.fillStyle = '#FEF3C7';
  ctx.fillText(label.toUpperCase(), 512, 33);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  ROW_BADGE_CACHE.set(label, texture);
  return texture;
}

const ShelfRowBadge: React.FC<{ text: string; width: number; position: [number, number, number] }> = ({
  text,
  width,
  position,
}) => {
  const texture = React.useMemo(() => getOrCreateRowBadgeTexture(text), [text]);
  const material = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.35,
        metalness: 0.45,
      }),
    [texture]
  );

  return (
    <mesh position={position}>
      <boxGeometry args={[width, 0.038, 0.008]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

export const Bookshelf3D: React.FC<Bookshelf3DProps> = ({ shelf }) => {
  const { width, height, depth, position, rotation } = shelf;
  const shelfYPositions = [0.38, 1.12, 1.86, 2.56];

  const sideThickness = 0.08;
  const shelfThickness = 0.045;

  return (
    <group position={position} rotation={rotation}>
      {/* Left Upright Side Panel */}
      <mesh position={[-width / 2 + sideThickness / 2, height / 2, 0]}>
        <boxGeometry args={[sideThickness, height, depth]} />
        <primitive object={SHARED_WALNUT_FRAME_MATERIAL} attach="material" />
      </mesh>

      {/* Right Upright Side Panel */}
      <mesh position={[width / 2 - sideThickness / 2, height / 2, 0]}>
        <boxGeometry args={[sideThickness, height, depth]} />
        <primitive object={SHARED_WALNUT_FRAME_MATERIAL} attach="material" />
      </mesh>

      {/* Warm Oak Interior Backboard Panel (Brightens the shelf cavity so colorful book spines pop!) */}
      <mesh position={[0, height / 2, -depth / 2 + 0.02]}>
        <boxGeometry args={[width, height, 0.03]} />
        <primitive object={SHARED_BACKBOARD_MATERIAL} attach="material" />
      </mesh>

      {/* Sturdy Bottom Base Plinth */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[width + 0.04, 0.3, depth + 0.06]} />
        <primitive object={SHARED_WALNUT_FRAME_MATERIAL} attach="material" />
      </mesh>

      {/* Decorative Crown Cornice (Top Moulding with Brass Filigree Accent) */}
      <mesh position={[0, height + 0.06, 0]}>
        <boxGeometry args={[width + 0.1, 0.12, depth + 0.1]} />
        <primitive object={SHARED_WALNUT_FRAME_MATERIAL} attach="material" />
      </mesh>
      <mesh position={[0, height + 0.11, depth / 2 + 0.03]}>
        <boxGeometry args={[width + 0.08, 0.02, 0.015]} />
        <primitive object={SHARED_BRASS_TRIM_MATERIAL} attach="material" />
      </mesh>

      {/* Horizontal Shelves, Brass Front Edges & Explicit Language/Topic Row Plaques */}
      {shelfYPositions.map((y, idx) => {
        let rowText: string | null = null;
        if (shelf.rowLabels && shelf.rowLabels.length >= 3) {
          if (idx === 2) rowText = `ROW 1: ${shelf.rowLabels[0]}`;
          else if (idx === 1) rowText = `ROW 2: ${shelf.rowLabels[1]}`;
          else if (idx === 0) rowText = `ROW 3: ${shelf.rowLabels[2]}`;
        }

        return (
          <group key={idx} position={[0, y, 0]}>
            {/* Wooden Shelf Plate */}
            <mesh>
              <boxGeometry args={[width - sideThickness * 2, shelfThickness, depth - 0.04]} />
              <primitive object={SHARED_OAK_SHELF_MATERIAL} attach="material" />
            </mesh>
            {/* Polished Brass Front Edge Trim */}
            <mesh position={[0, 0, depth / 2 - 0.02]}>
              <boxGeometry args={[width - sideThickness * 2, shelfThickness + 0.005, 0.012]} />
              <primitive object={SHARED_BRASS_TRIM_MATERIAL} attach="material" />
            </mesh>

            {/* Explicit Language & Topic Plaque mounted on this shelf row */}
            {rowText && (
              <ShelfRowBadge
                text={rowText}
                width={Math.min(2.5, width - 0.4)}
                position={[0, 0, depth / 2 - 0.012]}
              />
            )}

            {/* Warm Under-Shelf Integrated Lighting Strip (illuminates books below) */}
            {idx < shelfYPositions.length - 1 && (
              <mesh position={[0, -shelfThickness / 2 - 0.008, 0]}>
                <boxGeometry args={[width - sideThickness * 2 - 0.1, 0.012, 0.08]} />
                <primitive object={SHARED_SHELF_LIGHT_STRIP_MATERIAL} attach="material" />
              </mesh>
            )}
          </group>
        );
      })}

      {/* Endcap Brass Plaque for Shelf Identifiers */}
      <mesh position={[width / 2 + 0.002, height * 0.72, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.28, 0.14]} />
        <primitive object={SHARED_BRASS_TRIM_MATERIAL} attach="material" />
      </mesh>
      <mesh position={[-width / 2 - 0.002, height * 0.72, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[0.28, 0.14]} />
        <primitive object={SHARED_BRASS_TRIM_MATERIAL} attach="material" />
      </mesh>
    </group>
  );
};
