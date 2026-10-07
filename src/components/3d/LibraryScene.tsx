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

// Subtle atmospheric data motes floating in calm architectural space
const AmbientDustMotes: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 120;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = Math.random() * 6.0 + 1.0;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    return pos;
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.015;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#38BDF8"
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export const LibraryScene: React.FC = () => {
  const sections = useLibraryStore((s) => s.sections);
  const resources = useLibraryStore((s) => s.resources);
  const atmosphere = useLibraryStore((s) => s.atmosphere);
  const activeModal = useLibraryStore((s) => s.activeModal);
  const preferences = useLibraryStore((s) => s.preferences);

  const placementResult = useMemo(() => {
    return computeLibraryPlacements(sections, resources);
  }, [sections, resources]);

  // Premium Futuristic Cyberpunk lighting setups
  const lighting = useMemo(() => {
    switch (atmosphere) {
      case 'day':
        return {
          backgroundColor: '#040814',
          fogColor: '#060D1A',
          fogNear: 60,
          fogFar: 220,
          ambientColor: '#D8ECF8',
          ambientIntensity: 0.95,
          sunColor: '#A5F3FC',
          sunIntensity: 1.15,
          sunPos: [15, 22, -10] as [number, number, number],
          hallAccentColor: '#22D3EE',
          hallAccentIntensity: 0.85,
        };
      case 'evening':
        return {
          backgroundColor: '#080514',
          fogColor: '#0B081C',
          fogNear: 55,
          fogFar: 210,
          ambientColor: '#DDD6FE',
          ambientIntensity: 0.85,
          sunColor: '#C084FC',
          sunIntensity: 1.05,
          sunPos: [-20, 14, -20] as [number, number, number],
          hallAccentColor: '#8B5CF6',
          hallAccentIntensity: 1.0,
        };
      case 'night':
      default:
        return {
          backgroundColor: '#02040A',
          fogColor: '#030612',
          fogNear: 50,
          fogFar: 200,
          ambientColor: '#67E8F9',
          ambientIntensity: 0.70,
          sunColor: '#38BDF8',
          sunIntensity: 0.60,
          sunPos: [0, 20, 0] as [number, number, number],
          hallAccentColor: '#06B6D4',
          hallAccentIntensity: 1.2,
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
        dpr={preferences.targetFps120 ? [1, 1.25] : [1, 1.5]}
        camera={{ position: [0, 1.7, 24], fov: 65, near: 0.1, far: 260 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
          alpha: false,
          precision: 'highp',
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
          // Use the freshly computed resources for this section so every book is strictly on its shelf
          const secResources = secPlacement ? secPlacement.resources : [];

          return (
            <Section3D
              key={section.id}
              section={section}
              shelves={shelves}
              resources={secResources}
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
