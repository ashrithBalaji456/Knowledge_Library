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
  // High-resolution 2048x128 canvas for crisp, large, readable typography from any distance
  canvas.width = 2048;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  // Deep obsidian & brushed brass plaque background
  const bgGrad = ctx.createLinearGradient(0, 0, 2048, 0);
  bgGrad.addColorStop(0, '#0c0a09');
  bgGrad.addColorStop(0.12, '#292524');
  bgGrad.addColorStop(0.5, '#14110e');
  bgGrad.addColorStop(0.88, '#292524');
  bgGrad.addColorStop(1, '#0c0a09');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 2048, 128);

  // Outer polished gold frame
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 6;
  ctx.strokeRect(6, 6, 2036, 116);

  ctx.strokeStyle = '#FDE68A';
  ctx.lineWidth = 2;
  ctx.strokeRect(14, 14, 2020, 100);

  // Left & right decorative gold stars
  ctx.fillStyle = '#FBBF24';
  ctx.font = 'bold 44px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('✦', 60, 64);
  ctx.fillText('✦', 2048 - 60, 64);

  // High-contrast, large, bold typography with drop shadow
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 4;

  ctx.font = '900 58px "Outfit", "Inter", sans-serif';
  ctx.fillStyle = '#FFFBEB';
  ctx.fillText(label.toUpperCase(), 1024, 65);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 16;
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
        roughness: 0.3,
        metalness: 0.35,
        emissive: new THREE.Color('#261A05'),
        emissiveIntensity: 0.25,
      }),
    [texture]
  );

  return (
    <mesh position={position}>
      {/* Enlarged 7.4cm tall plaque for maximum legibility */}
      <boxGeometry args={[width, 0.074, 0.012]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

export const Bookshelf3D: React.FC<Bookshelf3DProps> = ({ shelf }) => {
  const { width, height, depth, position, rotation } = shelf;
  // Scaled shelf tier heights matching the enlarged 2.85m tall cupboard
  const shelfYPositions = [0.40, 1.22, 2.04, 2.80];

  const sideThickness = 0.09;
  const shelfThickness = 0.048;

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
      <mesh position={[0, 0.16, 0]}>
        <boxGeometry args={[width + 0.06, 0.32, depth + 0.08]} />
        <primitive object={SHARED_WALNUT_FRAME_MATERIAL} attach="material" />
      </mesh>

      {/* Decorative Crown Cornice (Top Moulding with Brass Filigree Accent) */}
      <mesh position={[0, height + 0.07, 0]}>
        <boxGeometry args={[width + 0.12, 0.14, depth + 0.12]} />
        <primitive object={SHARED_WALNUT_FRAME_MATERIAL} attach="material" />
      </mesh>
      <mesh position={[0, height + 0.13, depth / 2 + 0.04]}>
        <boxGeometry args={[width + 0.1, 0.025, 0.02]} />
        <primitive object={SHARED_BRASS_TRIM_MATERIAL} attach="material" />
      </mesh>

      {/* Horizontal Shelves, Brass Front Edges & Prominent Language/Topic Row Plaques */}
      {shelfYPositions.map((y, idx) => {
        let rowText: string | null = null;
        if (shelf.rowLabels && shelf.rowLabels.length >= 3) {
          if (idx === 2) rowText = `✦ ROW 1: ${shelf.rowLabels[0]} ✦`;
          else if (idx === 1) rowText = `✦ ROW 2: ${shelf.rowLabels[1]} ✦`;
          else if (idx === 0) rowText = `✦ ROW 3: ${shelf.rowLabels[2]} ✦`;
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
              <boxGeometry args={[width - sideThickness * 2, shelfThickness + 0.02, 0.014]} />
              <primitive object={SHARED_BRASS_TRIM_MATERIAL} attach="material" />
            </mesh>

            {/* Explicit Language & Topic Plaque mounted prominently on this shelf row */}
            {rowText && (
              <ShelfRowBadge
                text={rowText}
                width={Math.min(4.6, width - sideThickness * 2 - 0.15)}
                position={[0, -0.012, depth / 2 + 0.006]}
              />
            )}

            {/* Warm Under-Shelf Integrated Lighting Strip (illuminates books below) */}
            {idx < shelfYPositions.length - 1 && (
              <mesh position={[0, -shelfThickness / 2 - 0.01, 0]}>
                <boxGeometry args={[width - sideThickness * 2 - 0.1, 0.014, 0.1]} />
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
