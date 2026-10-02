import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useLibraryStore } from '../../store/useLibraryStore';
import { sound } from '../../engine/soundEngine';
import { INTERACTIVE_BOOK_OBJECTS } from './interactiveRegistry';

export const FirstPersonControls: React.FC = () => {
  const { camera, gl } = useThree();

  // Optimized store selectors (avoids subscribing to playerLocation/playerRotationY which caused component to re-render during movement!)
  const setPlayerTransform = useLibraryStore((s) => s.setPlayerTransform);
  const setHoveredResource = useLibraryStore((s) => s.setHoveredResource);
  const preferences = useLibraryStore((s) => s.preferences);
  const cameraTarget = useLibraryStore((s) => s.cameraTarget);
  const cameraLookAt = useLibraryStore((s) => s.cameraLookAt);
  const isNavigatingCamera = useLibraryStore((s) => s.isNavigatingCamera);
  const hoveredResourceId = useLibraryStore((s) => s.hoveredResourceId);
  const selectResource = useLibraryStore((s) => s.selectResource);
  const activeModal = useLibraryStore((s) => s.activeModal);
  const closeModal = useLibraryStore((s) => s.closeModal);
  const openModal = useLibraryStore((s) => s.openModal);
  const sections = useLibraryStore((s) => s.sections);
  const setActiveChunk = useLibraryStore((s) => s.setActiveChunk);

  // Keyboard state
  const keys = useRef<{ [key: string]: boolean }>({});
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });

  // Camera angles (yaw and pitch) with target smoothing (default 0 faces forward into the nave towards -Z)
  const initialYaw = useLibraryStore.getState().playerRotationY ?? 0;
  const yaw = useRef(initialYaw);
  const pitch = useRef(0);
  const targetYaw = useRef(initialYaw);
  const targetPitch = useRef(0);

  // Velocity vector for smooth physical acceleration and deceleration
  const velocity = useRef(new THREE.Vector3());
  const stepTimer = useRef(0);
  const walkDistance = useRef(0);

  // Center-screen crosshair raycasting
  const centerRaycaster = useRef(new THREE.Raycaster());
  const centerPoint = useRef(new THREE.Vector2(0, 0));
  const raycastTimer = useRef(0);

  // Performance throttled store updates
  const lastStoreUpdate = useRef(0);
  const lastStorePos = useRef<[number, number, number]>([0, 0, 0]);
  const lastStoreYaw = useRef(0);

  // Initialize camera position
  useEffect(() => {
    const initialPos = useLibraryStore.getState().playerLocation;
    camera.position.set(initialPos[0], initialPos[1], initialPos[2]);
    camera.rotation.order = 'YXZ';
  }, []);

  // Keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement &&
        (document.activeElement.tagName === 'INPUT' ||
          document.activeElement.tagName === 'TEXTAREA')
      ) {
        return;
      }

      keys.current[e.code] = true;

      // 'E' to interact with hovered book
      if (e.code === 'KeyE' && hoveredResourceId) {
        e.preventDefault();
        selectResource(hoveredResourceId);
      }

      // 'Escape' to close active modals
      if (e.code === 'Escape' && activeModal) {
        e.preventDefault();
        closeModal();
      }

      // '/' to open search
      if (e.code === 'Slash' && !activeModal) {
        e.preventDefault();
        openModal('search');
      }

      // 'KeyM' to toggle minimap
      if (e.code === 'KeyM' && !activeModal) {
        useLibraryStore.getState().updatePreferences({
          showMinimap: !preferences.showMinimap,
        });
      }

      // 'KeyG' for knowledge graph
      if (e.code === 'KeyG' && !activeModal) {
        openModal('graph');
      }

      // 'KeyP' for learning paths
      if (e.code === 'KeyP' && !activeModal) {
        openModal('paths');
      }

      // 'KeyB' for section browser drawer
      if (e.code === 'KeyB' && !activeModal) {
        openModal('sectionBrowser');
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [hoveredResourceId, activeModal, preferences.showMinimap]);

  // Pointer lock / Drag look listeners
  useEffect(() => {
    const dom = gl.domElement;
    let mouseDownPos = { x: 0, y: 0 };

    const handleMouseDown = (e: MouseEvent) => {
      if (activeModal) return;
      if (e.button === 0) {
        isDragging.current = true;
        mouseDownPos = { x: e.clientX, y: e.clientY };
        previousMousePosition.current = { x: e.clientX, y: e.clientY };

        if (preferences.pointerLock && dom.requestPointerLock) {
          dom.requestPointerLock();
        }
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      isDragging.current = false;
      // If user performed a stationary click (dragged less than 8px) while pointing at a book
      const dragDist = Math.hypot(e.clientX - mouseDownPos.x, e.clientY - mouseDownPos.y);
      if (dragDist < 8 && !activeModal) {
        const curHovered = useLibraryStore.getState().hoveredResourceId;
        if (curHovered) {
          selectResource(curHovered);
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (activeModal) return;

      const isLocked = document.pointerLockElement === dom;
      if (!isDragging.current && !isLocked) return;

      const movementX = isLocked ? e.movementX : e.clientX - previousMousePosition.current.x;
      const movementY = isLocked ? e.movementY : e.clientY - previousMousePosition.current.y;

      if (!isLocked) {
        previousMousePosition.current = { x: e.clientX, y: e.clientY };
      }

      const sensitivity = 0.0022 * preferences.lookSensitivity;
      targetYaw.current -= movementX * sensitivity;
      targetPitch.current -= movementY * sensitivity;

      // Clamp vertical look between -80 and +80 degrees
      targetPitch.current = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, targetPitch.current));
    };

    dom.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      dom.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [gl.domElement, preferences.lookSensitivity, preferences.pointerLock, activeModal, selectResource]);

  // Main per-frame smooth physics & movement update
  useFrame((_, delta) => {
    // If smooth camera transition is active
    if (isNavigatingCamera && cameraTarget) {
      camera.position.x = THREE.MathUtils.damp(camera.position.x, cameraTarget[0], 6.5, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, cameraTarget[1], 6.5, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, cameraTarget[2], 6.5, delta);

      if (cameraLookAt) {
        const targetRot = new THREE.Matrix4().lookAt(
          camera.position,
          new THREE.Vector3(...cameraLookAt),
          new THREE.Vector3(0, 1, 0)
        );
        const targetQuat = new THREE.Quaternion().setFromRotationMatrix(targetRot);
        camera.quaternion.slerp(targetQuat, 0.12);

        const euler = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ');
        yaw.current = euler.y;
        pitch.current = euler.x;
        targetYaw.current = euler.y;
        targetPitch.current = euler.x;
      }
      return;
    }

    // Clamp delta to prevent sudden spikes if a frame takes long
    const safeDelta = Math.min(delta, 0.05);

    // Ultra-smooth rotational damping tuned for 120 FPS high refresh
    // Damping at 52 (instead of 22) eliminates trailing mouse drag / lag on sudden turns!
    const lookDamping = preferences.targetFps120 ? 52 : 36;
    yaw.current = THREE.MathUtils.damp(yaw.current, targetYaw.current, lookDamping, safeDelta);
    pitch.current = THREE.MathUtils.damp(pitch.current, targetPitch.current, lookDamping, safeDelta);

    camera.rotation.x = pitch.current;
    camera.rotation.y = yaw.current;

    if (activeModal) return;

    // Movement acceleration & friction physics (snappy athletic response for 120 FPS)
    const isSprint = keys.current['ShiftLeft'] || keys.current['ShiftRight'];
    const maxSpeed = isSprint ? (preferences.targetFps120 ? 11.5 : 10.5) : preferences.moveSpeed;
    const accelRate = preferences.targetFps120 ? 68.0 : 48.0; // Instant responsive acceleration
    const friction = preferences.targetFps120 ? 16.0 : 12.0; // Crisp deceleration without slide lag

    const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw.current);
    const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw.current);

    const inputDir = new THREE.Vector3();
    if (keys.current['KeyW'] || keys.current['ArrowUp']) inputDir.add(forward);
    if (keys.current['KeyS'] || keys.current['ArrowDown']) inputDir.sub(forward);
    if (keys.current['KeyD'] || keys.current['ArrowRight']) inputDir.add(right);
    if (keys.current['KeyA'] || keys.current['ArrowLeft']) inputDir.sub(right);

    if (inputDir.lengthSq() > 0) {
      inputDir.normalize();
      velocity.current.addScaledVector(inputDir, accelRate * safeDelta);
      // Cap speed
      if (velocity.current.length() > maxSpeed) {
        velocity.current.setLength(maxSpeed);
      }
    } else {
      // Natural deceleration friction
      velocity.current.multiplyScalar(Math.max(0, 1 - friction * safeDelta));
    }

    // Apply movement if moving
    const speed = velocity.current.length();
    if (speed > 0.05) {
      const nextX = camera.position.x + velocity.current.x * safeDelta;
      const nextZ = camera.position.z + velocity.current.z * safeDelta;

      // Library boundary clamping
      const clampedX = Math.max(-41, Math.min(41, nextX));
      const clampedZ = Math.max(-58, Math.min(27, nextZ));

      camera.position.x = clampedX;
      camera.position.z = clampedZ;

      // Subtle human head-bobbing
      walkDistance.current += speed * safeDelta;
      const headBobY = 1.7 + Math.sin(walkDistance.current * 4.5) * 0.025;
      camera.position.y = headBobY;

      // Footstep audio
      if (preferences.footstepsEnabled) {
        stepTimer.current += safeDelta;
        const stepInterval = isSprint ? 0.28 : 0.42;
        if (stepTimer.current > stepInterval) {
          sound.playFootstep();
          stepTimer.current = 0;
        }
      }

      // Section chunk detection (identify which section the user is physically closest to)
      let closestSection = 'central';
      let closestDistSq = 999999;
      sections.forEach((sec) => {
        const dX = camera.position.x - sec.anchorPosition[0];
        const dZ = camera.position.z - sec.anchorPosition[2];
        const dSq = dX * dX + dZ * dZ;
        if (dSq < closestDistSq) {
          closestDistSq = dSq;
          closestSection = sec.id;
        }
      });

      const nextChunk = closestDistSq < 144 ? closestSection : 'central';
      if (nextChunk !== useLibraryStore.getState().activeChunk) {
        setActiveChunk(nextChunk);
      }
    }

    // High-performance throttled store update for 2D Minimap (~10 Hz)
    // Completely eliminates 60-144 FPS React re-renders while walking!
    const now = performance.now();
    if (now - lastStoreUpdate.current > 100) {
      const dX = camera.position.x - lastStorePos.current[0];
      const dZ = camera.position.z - lastStorePos.current[2];
      const dYaw = Math.abs(yaw.current - lastStoreYaw.current);
      if (dX * dX + dZ * dZ > 0.02 || dYaw > 0.03) {
        lastStoreUpdate.current = now;
        lastStorePos.current = [camera.position.x, camera.position.y, camera.position.z];
        lastStoreYaw.current = yaw.current;
        setPlayerTransform(lastStorePos.current, yaw.current);
      }
    }

    // Center-screen crosshair raycasting throttled to ~30 Hz (33ms)
    // Micro-optimized to raycast ONLY against registered book colliders,
    // avoiding traversal of thousands of non-book room and architecture meshes!
    raycastTimer.current += safeDelta;
    if (!activeModal && raycastTimer.current >= 0.033) {
      raycastTimer.current = 0;
      centerRaycaster.current.setFromCamera(centerPoint.current, camera);
      centerRaycaster.current.far = 14.0; // 14-meter interaction range

      const bookObjects = Array.from(INTERACTIVE_BOOK_OBJECTS.keys());
      const hits = centerRaycaster.current.intersectObjects(bookObjects, true);
      let hitBookId: string | null = null;

      if (hits.length > 0) {
        let cur: THREE.Object3D | null = hits[0].object;
        while (cur) {
          if (INTERACTIVE_BOOK_OBJECTS.has(cur)) {
            hitBookId = INTERACTIVE_BOOK_OBJECTS.get(cur)!;
            break;
          }
          if (cur.userData && cur.userData.bookId) {
            hitBookId = cur.userData.bookId;
            break;
          }
          cur = cur.parent;
        }
      }

      if (hitBookId) {
        if (hitBookId !== hoveredResourceId) {
          setHoveredResource(hitBookId);
        }
      } else if (hoveredResourceId && !(window as any).__mouseHoveredBookId) {
        setHoveredResource(null);
      }
    }
  });

  return null;
};
