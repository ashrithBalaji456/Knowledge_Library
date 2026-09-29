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

      {/* Horizontal Shelves, Brass Front Edges & Warm Under-Shelf Light Strips */}
      {shelfYPositions.map((y, idx) => (
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
          {/* Warm Under-Shelf Integrated Lighting Strip (illuminates books below) */}
          {idx < shelfYPositions.length - 1 && (
            <mesh position={[0, -shelfThickness / 2 - 0.008, 0]}>
              <boxGeometry args={[width - sideThickness * 2 - 0.1, 0.012, 0.08]} />
              <primitive object={SHARED_SHELF_LIGHT_STRIP_MATERIAL} attach="material" />
            </mesh>
          )}
        </group>
      ))}

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
