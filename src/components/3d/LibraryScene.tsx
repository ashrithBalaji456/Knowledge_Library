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

// Cyber Holographic Data Particles drifting calmly through architectural space
const AtmosphericDataDrift: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 220;

  const [positions, initialData] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const data: Array<{ baseSpeed: number; swaySpeed: number; seed: number }> = [];

    for (let i = 0; i < count; i++) {
      // Distributed widely across the entire library nave and wings
      pos[i * 3] = (Math.random() - 0.5) * 90;
      pos[i * 3 + 1] = Math.random() * 11.0 + 0.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 140 - 20;

      data.push({
        baseSpeed: 0.15 + Math.random() * 0.25,
        swaySpeed: 0.4 + Math.random() * 0.8,
        seed: Math.random() * Math.PI * 2,
      });
    }
    return [pos, data];
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const geom = pointsRef.current.geometry;
    const posAttr = geom.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const { baseSpeed, swaySpeed, seed } = initialData[i];

      // Gentle vertical floating drift
      array[idx + 1] += delta * baseSpeed;
      // Gentle lateral data packet swaying
      array[idx] += Math.sin(time * swaySpeed + seed) * 0.008;

      // Wrap around bounds so data stream is perpetual
      if (array[idx + 1] > 12.0) {
        array[idx + 1] = 0.5;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        color="#06B6D4"
        transparent
        opacity={0.42}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
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
          backgroundColor: '#0B1528', // Deep architectural navy sky
          fogColor: '#0E1B33', // Soft blue-gray depth mist
          fogNear: 85,
          fogFar: 290,
          ambientColor: '#E0F2FE',
          ambientIntensity: 1.15,
          hemiSky: '#38BDF8',
          hemiGround: '#1E293B',
          hemiIntensity: 0.55,
          sunColor: '#F0F9FF',
          sunIntensity: 1.35,
          sunPos: [15, 26, -10] as [number, number, number],
          hallAccentColor: '#06B6D4',
          hallAccentIntensity: 0.95,
        };
      case 'evening':
        return {
          backgroundColor: '#130E26', // Deep twilight violet-indigo
          fogColor: '#181230',
          fogNear: 80,
          fogFar: 275,
          ambientColor: '#EDE9FE',
          ambientIntensity: 1.05,
          hemiSky: '#A78BFA',
          hemiGround: '#1E1B4B',
          hemiIntensity: 0.50,
          sunColor: '#DDD6FE',
          sunIntensity: 1.15,
          sunPos: [-20, 20, -20] as [number, number, number],
          hallAccentColor: '#8B5CF6',
          hallAccentIntensity: 1.0,
        };
      case 'night':
      default:
        return {
          backgroundColor: '#0A1224', // Architectural midnight slate (clearly visible, never pitch black!)
          fogColor: '#0D162C',
          fogNear: 75,
          fogFar: 260,
          ambientColor: '#BAE6FD',
          ambientIntensity: 0.92,
          hemiSky: '#06B6D4',
          hemiGround: '#0F172A',
          hemiIntensity: 0.42,
          sunColor: '#38BDF8',
          sunIntensity: 0.95,
          sunPos: [0, 24, 0] as [number, number, number],
          hallAccentColor: '#06B6D4',
          hallAccentIntensity: 1.1,
        };
    }
  }, [atmosphere]);

  // Longitudinal aisle beacon positions along central nave
  const aisleBeaconZ = [18, -12, -42, -72, -102];

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
        {/* Futuristic Cyberpunk Fog & Sky */}
        <color attach="background" args={[lighting.backgroundColor]} />
        <fog attach="fog" args={[lighting.fogColor, lighting.fogNear, lighting.fogFar]} />

        {/* Global Cool Sci-Fi Ambient Fill Lighting */}
        <ambientLight intensity={lighting.ambientIntensity} color={lighting.ambientColor} />

        {/* Cyber Hemisphere Sky/Ground Light */}
        <hemisphereLight args={[lighting.hemiSky, lighting.hemiGround, lighting.hemiIntensity]} />

        {/* Directional Skylight / Sunlight Beam */}
        <directionalLight
          position={lighting.sunPos}
          intensity={lighting.sunIntensity}
          color={lighting.sunColor}
        />

        {/* Longitudinal Central Nave Accent Beacons */}
        {aisleBeaconZ.map((z, idx) => (
          <pointLight
            key={idx}
            position={[0, 5.2, z]}
            intensity={lighting.hallAccentIntensity * 0.45}
            color={lighting.hallAccentColor}
            distance={26}
            decay={2}
          />
        ))}

        {/* Grand Architecture */}
        <LibraryArchitecture />

        {/* Subtle Cyan Atmospheric Data Particle Drift */}
        <AtmosphericDataDrift />

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
