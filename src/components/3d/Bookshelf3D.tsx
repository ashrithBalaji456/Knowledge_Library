import React from 'react';
import * as THREE from 'three';
import { ShelfInfo } from '../../engine/placementEngine';

interface Bookshelf3DProps {
  shelf: ShelfInfo;
}

// Sleek dark graphite, titanium and smoked glass materials
const SHARED_GRAPHITE_FRAME_MATERIAL = new THREE.MeshStandardMaterial({
  color: '#0A101D', // Deep obsidian-graphite alloy
  roughness: 0.38,
  metalness: 0.62,
});

const SHARED_TITANIUM_TRIM_MATERIAL = new THREE.MeshStandardMaterial({
  color: '#1E293B', // Brushed titanium
  roughness: 0.3,
  metalness: 0.78,
});

const SHARED_CYBER_SHELF_MATERIAL = new THREE.MeshStandardMaterial({
  color: '#0E1726', // Dark carbon composite shelf tier plate
  roughness: 0.32,
  metalness: 0.45,
});

const SHARED_CYBER_BACKBOARD_MATERIAL = new THREE.MeshStandardMaterial({
  color: '#060B14', // Deep midnight carbon backboard (makes colorful book spines pop!)
  roughness: 0.8,
  metalness: 0.15,
});

// Smoked glass side panels
const SHARED_SMOKED_SIDE_GLASS = new THREE.MeshStandardMaterial({
  color: '#0F1E38',
  roughness: 0.18,
  metalness: 0.2,
  transparent: true,
  opacity: 0.65,
});

// Recessed cyan architectural LED strip under each shelf tier
const SHARED_SHELF_LIGHT_STRIP_MATERIAL = new THREE.MeshBasicMaterial({
  color: '#22D3EE', // Calm electric cyan
});

// Row badge texture cache
const ROW_BADGE_CACHE = new Map<string, THREE.CanvasTexture>();

function getOrCreateRowBadgeTexture(label: string): THREE.CanvasTexture {
  if (ROW_BADGE_CACHE.has(label)) return ROW_BADGE_CACHE.get(label)!;

  const canvas = document.createElement('canvas');
  // High-resolution 2048x128 canvas for crisp typography from any distance
  canvas.width = 2048;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  // Deep obsidian glass plaque background
  const bgGrad = ctx.createLinearGradient(0, 0, 2048, 0);
  bgGrad.addColorStop(0, '#040711');
  bgGrad.addColorStop(0.12, '#0B1528');
  bgGrad.addColorStop(0.5, '#070E1C');
  bgGrad.addColorStop(0.88, '#0B1528');
  bgGrad.addColorStop(1, '#040711');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 2048, 128);

  // Outer glowing cyan cyber border
  ctx.strokeStyle = '#22D3EE';
  ctx.lineWidth = 4;
  ctx.strokeRect(6, 6, 2036, 116);

  ctx.strokeStyle = 'rgba(85, 223, 255, 0.4)';
  ctx.lineWidth = 2;
  ctx.strokeRect(14, 14, 2020, 100);

  // Left & right cyan cyber diamond glyphs
  ctx.fillStyle = '#55DFFF';
  ctx.font = 'bold 44px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('◈', 60, 64);
  ctx.fillText('◈', 2048 - 60, 64);

  // High-contrast, large, bold typography with drop shadow
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 4;

  ctx.font = '900 56px "Outfit", "Inter", sans-serif';
  ctx.fillStyle = '#F4F8FF';
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
        roughness: 0.25,
        metalness: 0.45,
        emissive: new THREE.Color('#082F49'),
        emissiveIntensity: 0.35,
      }),
    [texture]
  );

  return (
    <mesh position={position}>
      <boxGeometry args={[width, 0.074, 0.012]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

export const Bookshelf3D: React.FC<Bookshelf3DProps> = ({ shelf }) => {
  const { width, height, depth, position, rotation } = shelf;
  // Scaled shelf tier heights matching the enlarged 2.85m tall cupboard (strictly identical!)
  const shelfYPositions = [0.40, 1.22, 2.04, 2.80];

  const sideThickness = 0.09;
  const shelfThickness = 0.048;

  return (
    <group position={position} rotation={rotation}>
      {/* Left Upright Side Panel (Titanium Frame + Inset Smoked Glass Window) */}
      <group position={[-width / 2 + sideThickness / 2, height / 2, 0]}>
        <mesh>
          <boxGeometry args={[sideThickness, height, depth]} />
          <primitive object={SHARED_GRAPHITE_FRAME_MATERIAL} attach="material" />
        </mesh>
        <mesh position={[-0.01, 0, 0]}>
          <boxGeometry args={[0.02, height - 0.2, depth - 0.1]} />
          <primitive object={SHARED_SMOKED_SIDE_GLASS} attach="material" />
        </mesh>
      </group>

      {/* Right Upright Side Panel (Titanium Frame + Inset Smoked Glass Window) */}
      <group position={[width / 2 - sideThickness / 2, height / 2, 0]}>
        <mesh>
          <boxGeometry args={[sideThickness, height, depth]} />
          <primitive object={SHARED_GRAPHITE_FRAME_MATERIAL} attach="material" />
        </mesh>
        <mesh position={[0.01, 0, 0]}>
          <boxGeometry args={[0.02, height - 0.2, depth - 0.1]} />
          <primitive object={SHARED_SMOKED_SIDE_GLASS} attach="material" />
        </mesh>
      </group>

      {/* Midnight Carbon Backboard Panel */}
      <mesh position={[0, height / 2, -depth / 2 + 0.02]}>
        <boxGeometry args={[width, height, 0.03]} />
        <primitive object={SHARED_CYBER_BACKBOARD_MATERIAL} attach="material" />
      </mesh>

      {/* Sleek Beveled Base Plinth with Recessed Cyan Underglow */}
      <mesh position={[0, 0.16, 0]}>
        <boxGeometry args={[width + 0.06, 0.32, depth + 0.08]} />
        <primitive object={SHARED_GRAPHITE_FRAME_MATERIAL} attach="material" />
      </mesh>
      <mesh position={[0, 0.02, depth / 2 + 0.04]}>
        <boxGeometry args={[width, 0.02, 0.02]} />
        <primitive object={SHARED_SHELF_LIGHT_STRIP_MATERIAL} attach="material" />
      </mesh>

      {/* Crown Cornice (Upper Titanium Canopy with Cyan Edge Accent) */}
      <mesh position={[0, height + 0.07, 0]}>
        <boxGeometry args={[width + 0.12, 0.14, depth + 0.12]} />
        <primitive object={SHARED_GRAPHITE_FRAME_MATERIAL} attach="material" />
      </mesh>
      <mesh position={[0, height + 0.13, depth / 2 + 0.04]}>
        <boxGeometry args={[width + 0.1, 0.018, 0.02]} />
        <primitive object={SHARED_TITANIUM_TRIM_MATERIAL} attach="material" />
      </mesh>
      <mesh position={[0, height + 0.13, depth / 2 + 0.055]}>
        <boxGeometry args={[width + 0.06, 0.008, 0.008]} />
        <primitive object={SHARED_SHELF_LIGHT_STRIP_MATERIAL} attach="material" />
      </mesh>

      {/* Horizontal Shelves, Brushed Titanium Front Edges & Cyber Row Plaques */}
      {shelfYPositions.map((y, idx) => {
        let rowText: string | null = null;
        if (shelf.rowLabels && shelf.rowLabels.length >= 3) {
          if (idx === 2) rowText = `✦ ROW 1: ${shelf.rowLabels[0]} ✦`;
          else if (idx === 1) rowText = `✦ ROW 2: ${shelf.rowLabels[1]} ✦`;
          else if (idx === 0) rowText = `✦ ROW 3: ${shelf.rowLabels[2]} ✦`;
        }

        return (
          <group key={idx} position={[0, y, 0]}>
            {/* Shelf Plate */}
            <mesh>
              <boxGeometry args={[width - sideThickness * 2, shelfThickness, depth - 0.04]} />
              <primitive object={SHARED_CYBER_SHELF_MATERIAL} attach="material" />
            </mesh>
            {/* Brushed Titanium Front Edge Trim */}
            <mesh position={[0, 0, depth / 2 - 0.02]}>
              <boxGeometry args={[width - sideThickness * 2, shelfThickness + 0.015, 0.014]} />
              <primitive object={SHARED_TITANIUM_TRIM_MATERIAL} attach="material" />
            </mesh>

            {/* Language & Topic Cyber Plaque */}
            {rowText && (
              <ShelfRowBadge
                text={rowText}
                width={Math.min(4.6, width - sideThickness * 2 - 0.15)}
                position={[0, -0.012, depth / 2 + 0.006]}
              />
            )}

            {/* Recessed Cyan Under-Shelf Illumination Strip (casts soft downlight on books below) */}
            {idx > 0 && (
              <mesh position={[0, -shelfThickness / 2 - 0.008, 0]}>
                <boxGeometry args={[width - sideThickness * 2 - 0.1, 0.012, 0.08]} />
                <primitive object={SHARED_SHELF_LIGHT_STRIP_MATERIAL} attach="material" />
              </mesh>
            )}
          </group>
        );
      })}

      {/* Endcap Metallic Plaque for Shelf Identifiers */}
      <mesh position={[width / 2 + 0.002, height * 0.72, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.28, 0.14]} />
        <primitive object={SHARED_TITANIUM_TRIM_MATERIAL} attach="material" />
      </mesh>
      <mesh position={[-width / 2 - 0.002, height * 0.72, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[0.28, 0.14]} />
        <primitive object={SHARED_TITANIUM_TRIM_MATERIAL} attach="material" />
      </mesh>
    </group>
  );
};
