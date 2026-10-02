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

// Cached section sign textures with physical carved wood, brass border & elegant typography
const SIGN_TEXTURE_CACHE = new Map<string, THREE.CanvasTexture>();

function getOrCreatePhysicalSectionSign(
  name: string,
  icon: string,
  colorHex: string
): THREE.CanvasTexture {
  const key = `${name}-${colorHex}`;
  if (SIGN_TEXTURE_CACHE.has(key)) {
    return SIGN_TEXTURE_CACHE.get(key)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Warm dark walnut wooden plaque background
  ctx.fillStyle = '#3F2212';
  ctx.fillRect(0, 0, 1024, 256);

  // Outer polished brass frame
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 14;
  ctx.strokeRect(10, 10, 1004, 236);

  // Inset section accent color line
  ctx.strokeStyle = colorHex;
  ctx.lineWidth = 6;
  ctx.strokeRect(26, 26, 972, 204);

  // Inner parchment / cream label plate in center
  ctx.fillStyle = '#FAF5EB';
  ctx.fillRect(40, 40, 944, 176);

  // Section Icon & Name in crisp dark charcoal serif typography
  ctx.fillStyle = '#1E1B18';
  ctx.font = 'bold 56px "Outfit", "Inter", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${icon}  ${name.toUpperCase()}`, 512, 110);

  // Domain subtitle with section accent color
  ctx.font = '700 20px "Inter", sans-serif';
  ctx.fillStyle = colorHex;
  ctx.fillText('DEPARTMENT OF ADVANCED STUDIES & RESEARCH', 512, 175);

  const texture = new THREE.CanvasTexture(canvas);
  SIGN_TEXTURE_CACHE.set(key, texture);
  return texture;
}

export const Section3D = React.memo<Section3DProps>(({ section, shelves, resources }) => {
  const [secX, secY, secZ] = section.anchorPosition;

  const signTexture = useMemo(
    () => getOrCreatePhysicalSectionSign(section.name, section.icon, section.color),
    [section.name, section.icon, section.color]
  );

  const signMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: signTexture,
        roughness: 0.38,
        metalness: 0.2,
      }),
    [signTexture]
  );

  // Warm creamy sandstone for arch pillars
  const stoneMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#EFE7D8',
        roughness: 0.65,
        metalness: 0.05,
      }),
    []
  );

  // Warm walnut for arch beam
  const walnutMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#6B4226',
        roughness: 0.5,
        metalness: 0.05,
      }),
    []
  );

  // Brass trim
  const brassMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#C69C3A',
        roughness: 0.28,
        metalness: 0.8,
      }),
    []
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
      {/* --- PHYSICAL ARCHWAY AT SECTION AISLE ENTRANCE --- */}
      <group position={[secX, secY, archZ]}>
        {/* Left Stone Pillar with Oak Base */}
        <mesh position={[-archWidth / 2 + pillarThickness / 2, 0.3, 0]}>
          <boxGeometry args={[pillarThickness + 0.1, 0.6, pillarThickness + 0.1]} />
          <primitive object={walnutMaterial} attach="material" />
        </mesh>
        <mesh position={[-archWidth / 2 + pillarThickness / 2, archHeight / 2 + 0.2, 0]}>
          <boxGeometry args={[pillarThickness, archHeight - 0.2, pillarThickness]} />
          <primitive object={stoneMaterial} attach="material" />
        </mesh>
        {/* Left Brass Capital */}
        <mesh position={[-archWidth / 2 + pillarThickness / 2, archHeight + 0.05, 0]}>
          <boxGeometry args={[pillarThickness + 0.12, 0.15, pillarThickness + 0.12]} />
          <primitive object={brassMaterial} attach="material" />
        </mesh>

        {/* Right Stone Pillar with Oak Base */}
        <mesh position={[archWidth / 2 - pillarThickness / 2, 0.3, 0]}>
          <boxGeometry args={[pillarThickness + 0.1, 0.6, pillarThickness + 0.1]} />
          <primitive object={walnutMaterial} attach="material" />
        </mesh>
        <mesh position={[archWidth / 2 - pillarThickness / 2, archHeight / 2 + 0.2, 0]}>
          <boxGeometry args={[pillarThickness, archHeight - 0.2, pillarThickness]} />
          <primitive object={stoneMaterial} attach="material" />
        </mesh>
        {/* Right Brass Capital */}
        <mesh position={[archWidth / 2 - pillarThickness / 2, archHeight + 0.05, 0]}>
          <boxGeometry args={[pillarThickness + 0.12, 0.15, pillarThickness + 0.12]} />
          <primitive object={brassMaterial} attach="material" />
        </mesh>

        {/* Solid Walnut Header Beam */}
        <mesh position={[0, archHeight + 0.25, 0]}>
          <boxGeometry args={[archWidth + 0.3, 0.5, 0.45]} />
          <primitive object={walnutMaterial} attach="material" />
        </mesh>
        <mesh position={[0, archHeight + 0.52, 0]}>
          <boxGeometry args={[archWidth + 0.4, 0.06, 0.5]} />
          <primitive object={brassMaterial} attach="material" />
        </mesh>

        {/* Double-Sided Physical Wood & Brass Section Sign */}
        {/* Front */}
        <mesh position={[0, archHeight + 0.25, 0.23]}>
          <planeGeometry args={[4.2, 1.05]} />
          <primitive object={signMaterial} attach="material" />
        </mesh>
        {/* Back */}
        <mesh position={[0, archHeight + 0.25, -0.23]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[4.2, 1.05]} />
          <primitive object={signMaterial} attach="material" />
        </mesh>
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
