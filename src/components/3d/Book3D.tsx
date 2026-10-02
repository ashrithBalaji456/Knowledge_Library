import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Resource } from '../../types/library';
import { useLibraryStore } from '../../store/useLibraryStore';
import { getOrCreateBookCoverTexture } from './coverTextureGenerator';

interface Book3DProps {
  resource: Resource;
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
  // High-resolution 256x1024 spine canvas for razor-sharp title legibility
  canvas.width = 256;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Base bookcloth color with subtle leather-grain texture
  ctx.fillStyle = colorHex;
  ctx.fillRect(0, 0, 256, 1024);

  // Shading edges for 3D curved spine cylinder feel
  const edgeShade = ctx.createLinearGradient(0, 0, 256, 0);
  edgeShade.addColorStop(0, 'rgba(0, 0, 0, 0.45)');
  edgeShade.addColorStop(0.18, 'rgba(0, 0, 0, 0)');
  edgeShade.addColorStop(0.82, 'rgba(0, 0, 0, 0)');
  edgeShade.addColorStop(1, 'rgba(0, 0, 0, 0.55)');
  ctx.fillStyle = edgeShade;
  ctx.fillRect(0, 0, 256, 1024);

  // Gold foil horizontal decorative bands
  ctx.fillStyle = '#E5C158';
  ctx.fillRect(16, 40, 224, 6);
  ctx.fillRect(16, 52, 224, 3);
  ctx.fillRect(16, 968, 224, 3);
  ctx.fillRect(16, 978, 224, 6);

  // Priority emblem
  if (priority === 'MUST_LEARN') {
    ctx.fillStyle = '#FDE68A';
    ctx.font = 'bold 44px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('★', 128, 120);
  } else if (priority === 'CURRENT_FOCUS') {
    ctx.fillStyle = '#FECACA';
    ctx.font = 'bold 40px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('▲', 128, 120);
  }

  // Vertical spine title — Bold, Large, with Deep Drop Shadow
  ctx.save();
  ctx.translate(128, 540);
  ctx.rotate(Math.PI / 2);

  ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 4;

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 38px "Outfit", "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  let displayTitle = title.toUpperCase();
  if (displayTitle.length > 24) {
    displayTitle = displayTitle.slice(0, 22) + '..';
  }
  ctx.fillText(displayTitle, 0, 0);

  // Author in clear lettering
  ctx.font = '700 22px "Inter", sans-serif';
  ctx.fillStyle = '#FDE68A';
  let displayAuthor = author;
  if (displayAuthor.length > 20) {
    displayAuthor = displayAuthor.slice(0, 18) + '..';
  }
  ctx.fillText(displayAuthor, 0, 42);

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 16;
  SPINE_TEXTURE_CACHE.set(key, texture);
  return texture;
}

// Global interactive registry for zero-overhead crosshair raycasting (avoids traversing full scene graph)
export const INTERACTIVE_BOOK_OBJECTS = new Map<THREE.Object3D, string>();

export const Book3D = React.memo<Book3DProps>(({ resource }) => {
  const meshRef = useRef<THREE.Group>(null);
  const [isHoveredLocal, setIsHoveredLocal] = useState(false);

  const setHoveredResource = useLibraryStore((s) => s.setHoveredResource);
  const selectResource = useLibraryStore((s) => s.selectResource);

  // Micro-optimized boolean selectors: only this specific book re-renders when hovered/selected,
  // preventing all 200+ books from re-rendering simultaneously!
  const isSelected = useLibraryStore((s) => s.selectedResourceId === resource.id);
  const isHoveredFromStore = useLibraryStore((s) => s.hoveredResourceId === resource.id);
  const isHighlighted = useLibraryStore((s) => s.highlightedResourceId === resource.id);
  const activeModal = useLibraryStore((s) => s.activeModal);

  // Register interactive mesh in registry for instant raycasting
  useEffect(() => {
    const mesh = meshRef.current;
    if (mesh) {
      INTERACTIVE_BOOK_OBJECTS.set(mesh, resource.id);
      return () => {
        INTERACTIVE_BOOK_OBJECTS.delete(mesh);
      };
    }
  }, [resource.id]);

  const loc = resource.location;
  if (!loc) return null;

  const { height, width: depth, thickness } = loc.dimensions;
  const [origX, origY, origZ] = loc.position;

  const isHovered = isHoveredLocal || isHoveredFromStore;
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
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      emissive: isMustLearn
        ? new THREE.Color('#D97706')
        : isCurrentFocus
        ? new THREE.Color('#DC2626')
        : new THREE.Color('#000000'),
      emissiveIntensity: 0,
    });
  }, [coverTexture, isMustLearn, isCurrentFocus]);

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
      emissiveIntensity: isMustLearn || isCurrentFocus ? 0.18 : 0.0,
    });
  }, [spineTexture, isMustLearn, isCurrentFocus]);

  // Update emissive intensity directly on material without shader re-compilation
  coverArtMaterial.emissiveIntensity = isSelected ? 0.35 : isHovered ? 0.2 : 0.0;
  spineMaterial.emissiveIntensity = isSelected ? 0.5 : isHovered ? 0.35 : isMustLearn || isCurrentFocus ? 0.18 : 0.0;

  // Dynamic pull-out on hover or selection (with high-perf early exit for resting books)
  useFrame((_, delta) => {
    if (!meshRef.current) return;

    const shelfRotY = loc.rotation[1];
    const isLeft = Math.abs(shelfRotY - Math.PI / 2) < 0.1;

    // Pull outward towards the center aisle when hovered or selected
    const pullOutDistance = isSelected ? 0.24 : isHovered ? 0.15 : isHighlighted ? 0.2 : 0;
    const targetX = (isLeft ? origX + pullOutDistance : origX - pullOutDistance) + (loc.pushOffset || 0);

    const curX = meshRef.current.position.x;
    const isStationary = Math.abs(curX - targetX) < 0.001;

    // If resting and not interacting, skip per-frame damp math completely!
    if (isStationary && !isSelected && !isHovered && !isHighlighted) {
      return;
    }

    meshRef.current.position.x = THREE.MathUtils.damp(
      curX,
      targetX,
      14,
      delta
    );
    meshRef.current.position.y = origY + height / 2;
    meshRef.current.position.z = origZ;

    // Natural tilt imperfection + hover tilt
    const targetRotZ = (loc.tiltZ || 0) + (isHovered ? (isLeft ? 0.05 : -0.05) : 0);
    const curRotZ = meshRef.current.rotation.z;
    if (Math.abs(curRotZ - targetRotZ) > 0.001) {
      meshRef.current.rotation.z = THREE.MathUtils.damp(
        curRotZ,
        targetRotZ,
        10,
        delta
      );
    }
  });

  const handlePointerOver = (e: any) => {
    if (activeModal) return;
    if (e.distance && e.distance > 16) return;
    e.stopPropagation();
    (window as any).__mouseHoveredBookId = resource.id;
    setIsHoveredLocal(true);
    setHoveredResource(resource.id);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerMove = (e: any) => {
    if (activeModal) return;
    if (e.distance && e.distance > 16) return;
    e.stopPropagation();
    (window as any).__mouseHoveredBookId = resource.id;
    if (useLibraryStore.getState().hoveredResourceId !== resource.id) {
      setHoveredResource(resource.id);
    }
  };

  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    if ((window as any).__mouseHoveredBookId === resource.id) {
      (window as any).__mouseHoveredBookId = null;
    }
    setIsHoveredLocal(false);
    if (useLibraryStore.getState().hoveredResourceId === resource.id) {
      setHoveredResource(null);
    }
    document.body.style.cursor = 'auto';
  };

  const handleClick = (e: any) => {
    if (activeModal) return;
    if (e.distance && e.distance > 16) return;
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
      userData={{ bookId: resource.id }}
      onPointerOver={handlePointerOver}
      onPointerMove={handlePointerMove}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {/* Dedicated high-hit-rate interaction collider box covering the book */}
      <mesh
        position={[0, 0, 0]}
        userData={{ bookId: resource.id }}
        onPointerOver={handlePointerOver}
        onPointerMove={handlePointerMove}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <boxGeometry args={[depth + 0.02, height + 0.02, thickness + 0.01]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Front Cover Board (cardboard core) */}
      <mesh
        geometry={SHARED_COVER_GEOMETRY}
        material={coverMaterial}
        position={[0, 0, thickness / 2 - coverThickness / 2]}
        scale={[depth, height, coverThickness]}
        userData={{ bookId: resource.id }}
      />

      {/* Front Cover Illustrated Jacket (Title, Author, Artwork & Emblems) */}
      <mesh
        position={[0, 0, thickness / 2 + 0.001]}
        rotation={[0, 0, 0]}
        userData={{ bookId: resource.id }}
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
        userData={{ bookId: resource.id }}
      />

      {/* Back Cover Illustrated Jacket */}
      <mesh
        position={[0, 0, -thickness / 2 - 0.001]}
        rotation={[0, Math.PI, 0]}
        userData={{ bookId: resource.id }}
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
        userData={{ bookId: resource.id }}
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
});

