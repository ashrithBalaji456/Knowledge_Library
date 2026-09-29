import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useLibraryStore } from '../../store/useLibraryStore';
import { computeLibraryPlacements } from '../../engine/placementEngine';
import { LibraryArchitecture } from './LibraryArchitecture';
import { Section3D } from './Section3D';
import { FirstPersonControls } from './FirstPersonControls';

// Performance monitor component measuring real FPS, draw calls & triangles
const PerformanceTelemetry: React.FC = () => {
  const { gl, scene } = useThree();
  const setFpsMetrics = useLibraryStore((s) => s.setFpsMetrics);
  const showFpsMonitor = useLibraryStore((s) => s.preferences.showFpsMonitor);

  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  useFrame(() => {
    if (!showFpsMonitor) return;

    frameCount.current++;
    const now = performance.now();
    if (now - lastTime.current >= 600) {
      const deltaSec = (now - lastTime.current) / 1000;
      const currentFps = Math.round(frameCount.current / deltaSec);
      frameCount.current = 0;
      lastTime.current = now;

      const info = gl.info;
      setFpsMetrics({
        fps: currentFps,
        drawCalls: info.render.calls,
        triangles: info.render.triangles,
        activeObjects: scene.children.length,
      });
    }
  });

  return null;
};

// Subtle atmospheric dust motes floating in warm sunlight
const AmbientDustMotes: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 100;

  const [positions, initialY] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const initY = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      const y = Math.random() * 5.0 + 1.0;
      pos[i * 3 + 1] = y;
      initY[i] = y;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    return [pos, initY];
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime() * 0.25;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      array[i * 3 + 1] = initialY[i] + Math.sin(t + i) * 0.12;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#FEF3C7"
        transparent
        opacity={0.35}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export const LibraryScene: React.FC = () => {
  const sections = useLibraryStore((s) => s.sections);
  const resources = useLibraryStore((s) => s.resources);
  const atmosphere = useLibraryStore((s) => s.atmosphere);
  const playerLocation = useLibraryStore((s) => s.playerLocation);
  const activeModal = useLibraryStore((s) => s.activeModal);

  const placementResult = useMemo(() => {
    return computeLibraryPlacements(sections, resources);
  }, [sections, resources]);

  // Warm, inviting, and radiant library lighting setups
  const lighting = useMemo(() => {
    switch (atmosphere) {
      case 'day':
        return {
          backgroundColor: '#F3E8DC', // Warm sunlit cream
          fogColor: '#F0E2D2', // Soft warm haze (not dark!)
          fogNear: 38,
          fogFar: 140,
          ambientColor: '#FFF8EB', // 4000K warm white
          ambientIntensity: 1.15,
          sunColor: '#FFFBEB',
          sunIntensity: 1.35,
          sunPos: [15, 22, -10] as [number, number, number],
          hallAccentColor: '#FEF3C7',
          hallAccentIntensity: 0.9,
        };
      case 'evening':
        return {
          backgroundColor: '#45231E', // Warm sunset amber glow
          fogColor: '#4A2822',
          fogNear: 35,
          fogFar: 130,
          ambientColor: '#FED7AA', // 2800K golden hour
          ambientIntensity: 1.05,
          sunColor: '#F97316',
          sunIntensity: 1.25,
          sunPos: [-20, 14, -20] as [number, number, number],
          hallAccentColor: '#FBBF24',
          hallAccentIntensity: 1.2,
        };
      case 'night':
      default:
        return {
          backgroundColor: '#1E1B2E', // Deep indigo twilight outside
          fogColor: '#28233C',
          fogNear: 32,
          fogFar: 120,
          ambientColor: '#FEF3C7', // Warm 3000K indoor study lamps
          ambientIntensity: 0.85,
          sunColor: '#93C5FD',
          sunIntensity: 0.45,
          sunPos: [0, 20, 0] as [number, number, number],
          hallAccentColor: '#FDE68A',
          hallAccentIntensity: 1.4,
        };
    }
  }, [atmosphere]);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'absolute',
        top: 0,
        left: 0,
        overflow: 'hidden',
      }}
    >
      <Canvas
        camera={{ position: [0, 1.7, 24], fov: 65, near: 0.1, far: 200 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        frameloop={activeModal === 'pdf' ? 'demand' : 'always'}
      >
        {/* Warm Atmospheric Sky & Fog */}
        <color attach="background" args={[lighting.backgroundColor]} />
        <fog attach="fog" args={[lighting.fogColor, lighting.fogNear, lighting.fogFar]} />

        {/* Global Warm Ambient Fill Lighting */}
        <ambientLight intensity={lighting.ambientIntensity} color={lighting.ambientColor} />

        {/* Directional Warm Sunlight / Skylight */}
        <directionalLight
          position={lighting.sunPos}
          intensity={lighting.sunIntensity}
          color={lighting.sunColor}
        />

        {/* Warm Golden Hall Study Accent Lighting */}
        <pointLight
          position={[0, 5.0, 4]}
          intensity={lighting.hallAccentIntensity}
          color={lighting.hallAccentColor}
          distance={32}
        />

        {/* Grand Architecture: warm wood floor, cream walls, study tables, banker lamps, plants */}
        <LibraryArchitecture />

        {/* Ambient floating dust */}
        <AmbientDustMotes />

        {/* Sections, Shelves & Distance-Culled Books */}
        {sections.map((section) => {
          const secPlacement = placementResult.sectionPlacements.get(section.id);
          const shelves = secPlacement ? secPlacement.shelves : [];
          const secResources = resources.filter(
            (r) => r.location?.sectionId === section.id
          );

          return (
            <Section3D
              key={section.id}
              section={section}
              shelves={shelves}
              resources={secResources}
              playerPos={playerLocation}
            />
          );
        })}

        {/* First Person Controls */}
        <FirstPersonControls />

        {/* Performance telemetry tracker */}
        <PerformanceTelemetry />
      </Canvas>
    </div>
  );
};
