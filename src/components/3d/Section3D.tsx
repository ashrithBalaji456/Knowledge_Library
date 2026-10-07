import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Section, Resource } from '../../types/library';
import { ShelfInfo } from '../../engine/placementEngine';
import { Bookshelf3D } from './Bookshelf3D';
import { Book3D } from './Book3D';

interface Section3DProps {
  section: Section;
  shelves: ShelfInfo[];
  resources: Resource[];
}

// Cached section sign textures with physical cyber dark-glass, glowing cyan/accent borders & sharp typography
const SIGN_TEXTURE_CACHE = new Map<string, THREE.CanvasTexture>();

function getOrCreatePhysicalSectionSign(
  name: string,
  icon: string,
  colorHex: string,
  bookCount: number
): THREE.CanvasTexture {
  const key = `${name}-${colorHex}-${bookCount}`;
  if (SIGN_TEXTURE_CACHE.has(key)) {
    return SIGN_TEXTURE_CACHE.get(key)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Deep obsidian/graphite glass panel background with cyber grid
  const bgGrad = ctx.createLinearGradient(0, 0, 1024, 256);
  bgGrad.addColorStop(0, '#040914');
  bgGrad.addColorStop(0.5, '#071022');
  bgGrad.addColorStop(1, '#040914');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 256);

  // Subtle interior grid lines
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
  ctx.lineWidth = 1;
  for (let x = 32; x < 1024; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 256);
    ctx.stroke();
  }
  for (let y = 32; y < 256; y += 48) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  // Outer glowing border in section accent color
  ctx.strokeStyle = colorHex;
  ctx.lineWidth = 6;
  ctx.strokeRect(10, 10, 1004, 236);

  // High-tech corner tech brackets
  ctx.fillStyle = '#06B6D4';
  const bLen = 28;
  const bThick = 5;
  // Top-left
  ctx.fillRect(10, 10, bLen, bThick);
  ctx.fillRect(10, 10, bThick, bLen);
  // Top-right
  ctx.fillRect(1014 - bLen, 10, bLen, bThick);
  ctx.fillRect(1014 - bThick, 10, bThick, bLen);
  // Bottom-left
  ctx.fillRect(10, 246 - bThick, bLen, bThick);
  ctx.fillRect(10, 246 - bLen, bThick, bLen);
  // Bottom-right
  ctx.fillRect(1014 - bLen, 246 - bThick, bLen, bThick);
  ctx.fillRect(1014 - bThick, 246 - bLen, bThick, bLen);

  // Inset subtle cyan neon trace line
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.45)';
  ctx.lineWidth = 2;
  ctx.strokeRect(26, 26, 972, 204);

  // Inner dark glass core backing
  ctx.fillStyle = 'rgba(10, 20, 42, 0.75)';
  ctx.fillRect(36, 36, 952, 184);

  // Section Icon & Name in crisp luminous typography
  ctx.shadowColor = '#06B6D4';
  ctx.shadowBlur = 14;
  ctx.fillStyle = '#F8FAFC';
  ctx.font = 'bold 54px "Outfit", "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${icon}  ${name.toUpperCase()}`, 512, 106);

  // Domain subtitle with volume count and glowing section accent color
  ctx.shadowBlur = 8;
  ctx.shadowColor = colorHex;
  ctx.font = '700 18px "Inter", monospace';
  ctx.fillStyle = '#38BDF8';
  ctx.fillText(`NEURAL ARCHIVE // ${bookCount} CATALOGED VOLUMES`, 512, 172);

  // Reset shadow
  ctx.shadowBlur = 0;

  const texture = new THREE.CanvasTexture(canvas);
  SIGN_TEXTURE_CACHE.set(key, texture);
  return texture;
}

export const Section3D = React.memo<Section3DProps>(({ section, shelves, resources }) => {
  const [secX, secY, secZ] = section.anchorPosition;

  const signTexture = useMemo(
    () => getOrCreatePhysicalSectionSign(section.name, section.icon, section.color, resources.length),
    [section.name, section.icon, section.color, resources.length]
  );

  const signMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: signTexture,
        roughness: 0.15,
        metalness: 0.85,
        emissive: new THREE.Color(section.color),
        emissiveIntensity: 0.18,
      }),
    [signTexture, section.color]
  );

  // Dark graphite titanium composite for portal pylons
  const titaniumMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#111827',
        roughness: 0.32,
        metalness: 0.85,
      }),
    []
  );

  // Smoked glass panel material with blue tint
  const smokedGlassMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#081226',
        roughness: 0.08,
        metalness: 0.2,
        transparent: true,
        opacity: 0.72,
        transmission: 0.45,
        reflectivity: 0.9,
      }),
    []
  );

  // Cyan laser edge trim
  const cyanGlowMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#06B6D4',
        emissive: new THREE.Color('#06B6D4'),
        emissiveIntensity: 0.85,
        roughness: 0.2,
      }),
    []
  );

  // Section accent light channel
  const accentLightMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: section.color,
        emissive: new THREE.Color(section.color),
        emissiveIntensity: 0.95,
        roughness: 0.2,
      }),
    [section.color]
  );

  // Determine front of the section aisle so archway never collides with any cupboard
  const maxShelfFrontZ = useMemo(() => {
    if (!shelves || shelves.length === 0) return secZ + 3.2;
    return shelves.reduce((max, s) => Math.max(max, s.position[2] + s.width / 2), secZ);
  }, [shelves, secZ]);

  const archZ = maxShelfFrontZ + 1.4;
  const archWidth = 7.4; // 7.4m wide portal so pillars stand completely clear of bookshelves
  const archHeight = 4.2;
  const pillarThickness = 0.42;

  return (
    <group>
      {/* --- CYBER HOLOGRAPHIC PORTAL AT SECTION AISLE ENTRANCE --- */}
      <group position={[secX, secY, archZ]}>
        {/* Ground guide threshold strip */}
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[archWidth - 0.2, 0.04, 0.3]} />
          <primitive object={titaniumMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 0.025, 0]}>
          <boxGeometry args={[archWidth - 0.6, 0.02, 0.04]} />
          <primitive object={accentLightMaterial} attach="material" />
        </mesh>

        {/* Left Titanium Pylon */}
        <mesh position={[-archWidth / 2 + pillarThickness / 2, 0.3, 0]}>
          <boxGeometry args={[pillarThickness + 0.12, 0.6, pillarThickness + 0.12]} />
          <primitive object={titaniumMaterial} attach="material" />
        </mesh>
        <mesh position={[-archWidth / 2 + pillarThickness / 2, archHeight / 2 + 0.2, 0]}>
          <boxGeometry args={[pillarThickness, archHeight - 0.2, pillarThickness]} />
          <primitive object={titaniumMaterial} attach="material" />
        </mesh>
        {/* Left vertical light channel */}
        <mesh position={[-archWidth / 2 + pillarThickness + 0.01, archHeight / 2 + 0.2, 0]}>
          <boxGeometry args={[0.03, archHeight - 0.4, 0.08]} />
          <primitive object={accentLightMaterial} attach="material" />
        </mesh>
        {/* Left Pylon Capital & Cyan Collar */}
        <mesh position={[-archWidth / 2 + pillarThickness / 2, archHeight + 0.05, 0]}>
          <boxGeometry args={[pillarThickness + 0.14, 0.15, pillarThickness + 0.14]} />
          <primitive object={cyanGlowMaterial} attach="material" />
        </mesh>

        {/* Right Titanium Pylon */}
        <mesh position={[archWidth / 2 - pillarThickness / 2, 0.3, 0]}>
          <boxGeometry args={[pillarThickness + 0.12, 0.6, pillarThickness + 0.12]} />
          <primitive object={titaniumMaterial} attach="material" />
        </mesh>
        <mesh position={[archWidth / 2 - pillarThickness / 2, archHeight / 2 + 0.2, 0]}>
          <boxGeometry args={[pillarThickness, archHeight - 0.2, pillarThickness]} />
          <primitive object={titaniumMaterial} attach="material" />
        </mesh>
        {/* Right vertical light channel */}
        <mesh position={[archWidth / 2 - pillarThickness - 0.01, archHeight / 2 + 0.2, 0]}>
          <boxGeometry args={[0.03, archHeight - 0.4, 0.08]} />
          <primitive object={accentLightMaterial} attach="material" />
        </mesh>
        {/* Right Pylon Capital & Cyan Collar */}
        <mesh position={[archWidth / 2 - pillarThickness / 2, archHeight + 0.05, 0]}>
          <boxGeometry args={[pillarThickness + 0.14, 0.15, pillarThickness + 0.14]} />
          <primitive object={cyanGlowMaterial} attach="material" />
        </mesh>

        {/* Cantilever Titanium Overhead Arch Beam */}
        <mesh position={[0, archHeight + 0.25, 0]}>
          <boxGeometry args={[archWidth + 0.3, 0.38, 0.42]} />
          <primitive object={titaniumMaterial} attach="material" />
        </mesh>
        {/* Glowing cyan underside beam ribbon */}
        <mesh position={[0, archHeight + 0.06, 0]}>
          <boxGeometry args={[archWidth - 0.2, 0.02, 0.12]} />
          <primitive object={cyanGlowMaterial} attach="material" />
        </mesh>
        {/* Upper accent light strip */}
        <mesh position={[0, archHeight + 0.45, 0]}>
          <boxGeometry args={[archWidth + 0.36, 0.04, 0.46]} />
          <primitive object={accentLightMaterial} attach="material" />
        </mesh>

        {/* Smoked glass backing plate for sign */}
        <mesh position={[0, archHeight + 0.25, 0]}>
          <boxGeometry args={[4.4, 1.15, 0.46]} />
          <primitive object={smokedGlassMaterial} attach="material" />
        </mesh>

        {/* Double-Sided Cyber Holographic Section Sign */}
        {/* Front */}
        <mesh position={[0, archHeight + 0.25, 0.24]}>
          <planeGeometry args={[4.2, 1.05]} />
          <primitive object={signMaterial} attach="material" />
        </mesh>
        {/* Back */}
        <mesh position={[0, archHeight + 0.25, -0.24]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[4.2, 1.05]} />
          <primitive object={signMaterial} attach="material" />
        </mesh>

        {/* Subtle Portal Threshold Downlight in Section Accent Color */}
        <pointLight
          position={[0, archHeight * 0.95, 0]}
          color={section.color}
          intensity={0.4}
          distance={7.5}
          decay={2}
        />
      </group>

      {/* --- BOOKSHELVES FOR THIS SECTION --- */}
      {shelves.map((shelf) => (
        <Bookshelf3D key={shelf.id} shelf={shelf} />
      ))}

      {/* --- 3D BOOKS FOR THIS SECTION --- */}
      {resources.map((res) => (
        <Book3D key={res.id} resource={res} />
      ))}
    </group>
  );
});
