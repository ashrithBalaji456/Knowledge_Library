import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Resource } from '../../types/library';
import { useLibraryStore } from '../../store/useLibraryStore';
import { getOrCreateBookCoverTexture } from './coverTextureGenerator';

interface Book3DProps {
  resource: Resource;
  playerPos: [number, number, number];
}

// Single shared reusable geometries for ALL books
const SHARED_COVER_GEOMETRY = new THREE.BoxGeometry(1, 1, 1);
const SHARED_PAGE_GEOMETRY = new THREE.BoxGeometry(1, 1, 1);
const SHARED_PAGES_MATERIAL = new THREE.MeshStandardMaterial({
  color: '#FAF3E0', // Creamy warm ivory paper pages
  roughness: 0.85,
  metalness: 0.02,
});

const SHARED_GOLD_FOIL_MATERIAL = new THREE.MeshStandardMaterial({
  color: '#D4AF37', // Gold leaf foil on spine
  roughness: 0.25,
  metalness: 0.85,
});

// Cache for generated spine textures with crisp vertical typography
const SPINE_TEXTURE_CACHE = new Map<string, THREE.CanvasTexture>();

function getOrCreateBookSpineTexture(
  title: string,
  author: string,
  colorHex: string,
  priority: string
): THREE.CanvasTexture {
  const key = `${title}-${colorHex}-${priority}`;
  if (SPINE_TEXTURE_CACHE.has(key)) {
    return SPINE_TEXTURE_CACHE.get(key)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Base bookcloth color with subtle leather-grain texture
  ctx.fillStyle = colorHex;
  ctx.fillRect(0, 0, 128, 512);

  // Shading edges for 3D curved spine cylinder feel
  const edgeShade = ctx.createLinearGradient(0, 0, 128, 0);
  edgeShade.addColorStop(0, 'rgba(0, 0, 0, 0.35)');
  edgeShade.addColorStop(0.18, 'rgba(0, 0, 0, 0)');
  edgeShade.addColorStop(0.82, 'rgba(0, 0, 0, 0)');
  edgeShade.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
  ctx.fillStyle = edgeShade;
  ctx.fillRect(0, 0, 128, 512);

  // Gold foil horizontal decorative bands
  ctx.fillStyle = '#E5C158';
  ctx.fillRect(8, 20, 112, 3);
  ctx.fillRect(8, 26, 112, 1.5);
  ctx.fillRect(8, 484, 112, 1.5);
  ctx.fillRect(8, 489, 112, 3);

  // Priority emblem
  if (priority === 'MUST_LEARN') {
    ctx.fillStyle = '#FDE68A';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('★', 64, 62);
  } else if (priority === 'CURRENT_FOCUS') {
    ctx.fillStyle = '#FECACA';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('▲', 64, 62);
  }

  // Vertical spine title
  ctx.save();
  ctx.translate(64, 270);
  ctx.rotate(Math.PI / 2);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 20px "Outfit", "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  let displayTitle = title.toUpperCase();
  if (displayTitle.length > 24) {
    displayTitle = displayTitle.slice(0, 22) + '..';
  }
  ctx.fillText(displayTitle, 0, 0);

  // Author in smaller lettering
  ctx.font = '500 12px "Inter", sans-serif';
  ctx.fillStyle = '#E2E8F0';
  let displayAuthor = author;
  if (displayAuthor.length > 18) {
    displayAuthor = displayAuthor.slice(0, 16) + '..';
  }
  ctx.fillText(displayAuthor, 0, 22);

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  SPINE_TEXTURE_CACHE.set(key, texture);
  return texture;
}

export const Book3D: React.FC<Book3DProps> = ({ resource, playerPos }) => {
  const meshRef = useRef<THREE.Group>(null);
  const [isHoveredLocal, setIsHoveredLocal] = useState(false);

  const setHoveredResource = useLibraryStore((s) => s.setHoveredResource);
  const selectResource = useLibraryStore((s) => s.selectResource);
  const hoveredResourceId = useLibraryStore((s) => s.hoveredResourceId);
  const selectedResourceId = useLibraryStore((s) => s.selectedResourceId);
  const highlightedResourceId = useLibraryStore((s) => s.highlightedResourceId);
  const activeModal = useLibraryStore((s) => s.activeModal);

  const loc = resource.location;
  if (!loc) return null;

  const { height, width: depth, thickness } = loc.dimensions;
  const [origX, origY, origZ] = loc.position;

  // Spatial Distance Cull
  const dx = playerPos[0] - origX;
  const dy = playerPos[1] - origY;
  const dz = playerPos[2] - origZ;
  const distSq = dx * dx + dy * dy + dz * dz;
  const isNearby = distSq < 16; // within 4.0 meters

  const isSelected = selectedResourceId === resource.id;
  const isHovered = (isHoveredLocal || hoveredResourceId === resource.id) && isNearby;
  const isHighlighted = highlightedResourceId === resource.id;
  const isMustLearn = resource.priority === 'MUST_LEARN';
  const isCurrentFocus = resource.priority === 'CURRENT_FOCUS';

  const bookColor = loc.colorHex || '#1E40AF';

  // Spine texture with crisp title and gold foil lines
  const spineTexture = useMemo(() => {
    return getOrCreateBookSpineTexture(resource.title, resource.author, bookColor, resource.priority);
  }, [resource.title, resource.author, bookColor, resource.priority]);

  // Front/Back cover board material
  const coverMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: bookColor,
      roughness: 0.42,
      metalness: 0.05,
    });
  }, [bookColor]);

  // Front/Back high-res illustrated cover jacket
  const coverTexture = useMemo(() => {
    return getOrCreateBookCoverTexture(resource, bookColor);
  }, [resource, bookColor]);

  const coverArtMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: coverTexture,
      roughness: 0.38,
      metalness: 0.05,
      emissive: isMustLearn
        ? new THREE.Color('#D97706')
        : isCurrentFocus
        ? new THREE.Color('#DC2626')
        : new THREE.Color('#000000'),
      emissiveIntensity: isSelected ? 0.35 : isHovered ? 0.2 : 0.0,
    });
  }, [coverTexture, isMustLearn, isCurrentFocus, isSelected, isHovered]);

  // Spine material
  const spineMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: spineTexture,
      roughness: 0.38,
      metalness: 0.08,
      emissive: isMustLearn
        ? new THREE.Color('#D97706')
        : isCurrentFocus
        ? new THREE.Color('#DC2626')
        : new THREE.Color('#000000'),
      emissiveIntensity: isSelected ? 0.5 : isHovered ? 0.35 : isMustLearn || isCurrentFocus ? 0.18 : 0.0,
    });
  }, [spineTexture, isMustLearn, isCurrentFocus, isSelected, isHovered]);

  // Dynamic pull-out on hover or selection
  useFrame((_, delta) => {
    if (!meshRef.current) return;

    const shelfRotY = loc.rotation[1];
    const isLeft = Math.abs(shelfRotY - Math.PI / 2) < 0.1;

    // Pull outward towards the center aisle when hovered or selected
    const pullOutDistance = isSelected ? 0.24 : isHovered ? 0.15 : isHighlighted ? 0.2 : 0;
    const targetX = (isLeft ? origX + pullOutDistance : origX - pullOutDistance) + (loc.pushOffset || 0);

    meshRef.current.position.x = THREE.MathUtils.damp(
      meshRef.current.position.x,
      targetX,
      14,
      delta
    );
    meshRef.current.position.y = origY + height / 2;
    meshRef.current.position.z = origZ;

    // Natural tilt imperfection + hover tilt
    const targetRotZ = (loc.tiltZ || 0) + (isHovered ? (isLeft ? 0.06 : -0.06) : 0);
    meshRef.current.rotation.z = THREE.MathUtils.damp(
      meshRef.current.rotation.z,
      targetRotZ,
      10,
      delta
    );
  });

  const handlePointerOver = (e: any) => {
    if (!isNearby || activeModal) return;
    e.stopPropagation();
    setIsHoveredLocal(true);
    setHoveredResource(resource.id);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    setIsHoveredLocal(false);
    if (hoveredResourceId === resource.id) {
      setHoveredResource(null);
    }
    document.body.style.cursor = 'auto';
  };

  const handleClick = (e: any) => {
    if (!isNearby || activeModal) return;
    e.stopPropagation();
    selectResource(resource.id);
  };

  const coverThickness = 0.008;
  const pageDepth = depth - 0.016;
  const pageThickness = Math.max(0.022, thickness - coverThickness * 2);
  const pageHeight = height - 0.016;

  return (
    <group
      ref={meshRef}
      position={[origX, origY + height / 2, origZ]}
      rotation={[loc.rotation[0], loc.rotation[1], loc.tiltZ || 0]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {/* Front Cover Board (cardboard core) */}
      <mesh
        geometry={SHARED_COVER_GEOMETRY}
        material={coverMaterial}
        position={[0, 0, thickness / 2 - coverThickness / 2]}
        scale={[depth, height, coverThickness]}
      />

      {/* Front Cover Illustrated Jacket (Title, Author, Artwork & Emblems) */}
      <mesh
        position={[0, 0, thickness / 2 + 0.001]}
        rotation={[0, 0, 0]}
      >
        <planeGeometry args={[depth, height]} />
        <primitive object={coverArtMaterial} attach="material" />
      </mesh>

      {/* Back Cover Board (cardboard core) */}
      <mesh
        geometry={SHARED_COVER_GEOMETRY}
        material={coverMaterial}
        position={[0, 0, -thickness / 2 + coverThickness / 2]}
        scale={[depth, height, coverThickness]}
      />

      {/* Back Cover Illustrated Jacket */}
      <mesh
        position={[0, 0, -thickness / 2 - 0.001]}
        rotation={[0, Math.PI, 0]}
      >
        <planeGeometry args={[depth, height]} />
        <primitive object={coverArtMaterial} attach="material" />
      </mesh>

      {/* Spine with Crisp Title Typography & Gold Bands */}
      <mesh
        geometry={SHARED_COVER_GEOMETRY}
        material={spineMaterial}
        position={[depth / 2, 0, 0]}
        scale={[0.012, height, thickness]}
      />

      {/* Cream Ivory Pages */}
      <mesh
        geometry={SHARED_PAGE_GEOMETRY}
        material={SHARED_PAGES_MATERIAL}
        position={[-0.008, 0, 0]}
        scale={[pageDepth, pageHeight, pageThickness]}
      />

      {/* Gold Ribbon Bookmark hanging from bottom for Must Learn / Completed */}
      {(isMustLearn || resource.status === 'COMPLETED') && (
        <mesh position={[depth / 4, -height / 2 - 0.03, 0]}>
          <boxGeometry args={[0.012, 0.07, 0.003]} />
          <primitive object={SHARED_GOLD_FOIL_MATERIAL} attach="material" />
        </mesh>
      )}

      {/* Warm Golden Selection Halo when selected */}
      {(isSelected || isHighlighted) && (
        <mesh position={[0, -height / 2 + 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.08, 0.22, 16]} />
          <meshBasicMaterial
            color={isHighlighted ? '#F59E0B' : '#38BDF8'}
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
};
