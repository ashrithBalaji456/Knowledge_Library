import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useLibraryStore } from '../../store/useLibraryStore';
import { sound } from '../../engine/soundEngine';
import { INTERACTIVE_BOOK_OBJECTS } from './interactiveRegistry';

// Static pre-allocated 3D math primitives to completely prevent per-frame GC allocations
const STATIC_FORWARD = new THREE.Vector3();
const STATIC_RIGHT = new THREE.Vector3();
const STATIC_INPUT_DIR = new THREE.Vector3();
const STATIC_AXIS_Y = new THREE.Vector3(0, 1, 0);
const STATIC_LOOK_AT_VEC = new THREE.Vector3();
const STATIC_TARGET_ROT = new THREE.Matrix4();
const STATIC_TARGET_QUAT = new THREE.Quaternion();
const STATIC_EULER = new THREE.Euler(0, 0, 0, 'YXZ');

// Multi-level architectural height calculation
function getFloorElevation(x: number, z: number, currentCamY: number): number {
  // If player is on or transitioning to Upper Mezzanine / Skybridge Level (y = 5.2m)
  if (currentCamY > 3.5) {
    const distToAtrium = Math.hypot(x, z - (-14));
    // Rotunda Mezzanine ring around Atrium (0, -14)
    if (distToAtrium >= 10.0 && distToAtrium <= 18.0) {
      return 5.2;
    }
    // South Skybridge: z in [3.5, 8.5], x in [-24, 24]
    if (z >= 3.5 && z <= 8.5 && Math.abs(x) <= 24) {
      return 5.2;
    }
    // North Skybridge: z in [-36.5, -31.5], x in [-24, 24]
    if (z >= -36.5 && z <= -31.5 && Math.abs(x) <= 24) {
      return 5.2;
    }
    // Longitudinal promenades: x near +/-15, z in [-36, 8]
    if ((Math.abs(x - (-15)) <= 3.2 || Math.abs(x - 15) <= 3.2) && z >= -36 && z <= 8) {
      return 5.2;
    }
    return 0; // Walking off mezzanine safely steps down to ground level
  }

  // Entire ground concourse is a rock-solid flat 0m floor (no height snapping or stuck loops!)
  return 0;
}

export const FirstPersonControls: React.FC = () => {
  const { camera, gl } = useThree();

  // Optimized store selectors (avoids subscribing to playerLocation/playerRotationY which caused component to re-render during movement!)
  const setPlayerTransform = useLibraryStore((s) => s.setPlayerTransform);
  const setHoveredResource = useLibraryStore((s) => s.setHoveredResource);
  const selectResource = useLibraryStore((s) => s.selectResource);
  const closeModal = useLibraryStore((s) => s.closeModal);
  const openModal = useLibraryStore((s) => s.openModal);
  const sections = useLibraryStore((s) => s.sections);
  const setActiveChunk = useLibraryStore((s) => s.setActiveChunk);
  const cameraTarget = useLibraryStore((s) => s.cameraTarget);
  const cameraLookAt = useLibraryStore((s) => s.cameraLookAt);
  const isNavigatingCamera = useLibraryStore((s) => s.isNavigatingCamera);

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

  // Keyboard listeners - static subscription that never tears down on hover / minimap changes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (
        document.activeElement &&
        (document.activeElement.tagName === 'INPUT' ||
          document.activeElement.tagName === 'TEXTAREA')
      ) {
        return;
      }

      keys.current[e.code] = true;
      if (e.key) keys.current[e.key.toLowerCase()] = true;
      const curModal = useLibraryStore.getState().activeModal;

      // 'E' to interact with hovered book
      if (e.code === 'KeyE') {
        const curHovered = useLibraryStore.getState().hoveredResourceId;
        if (curHovered && !curModal) {
          e.preventDefault();
          selectResource(curHovered);
        }
      }

      // 'Escape' to close active modals
      if (e.code === 'Escape' && curModal) {
        e.preventDefault();
        closeModal();
      }

      // '/' to open search
      if (e.code === 'Slash' && !curModal) {
        e.preventDefault();
        openModal('search');
      }

      // 'KeyM' to toggle minimap
      if (e.code === 'KeyM' && !curModal) {
        const curPref = useLibraryStore.getState().preferences;
        useLibraryStore.getState().updatePreferences({
          showMinimap: !curPref.showMinimap,
        });
      }

      // 'KeyG' for knowledge graph
      if (e.code === 'KeyG' && !curModal) {
        openModal('graph');
      }

      // 'KeyP' for learning paths
      if (e.code === 'KeyP' && !curModal) {
        openModal('paths');
      }

      // 'KeyB' for section browser drawer
      if (e.code === 'KeyB' && !curModal) {
        openModal('sectionBrowser');
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
      if (e.key) keys.current[e.key.toLowerCase()] = false;
    };

    // Prevent keys getting stuck if user switches tabs / windows
    const handleWindowBlur = () => {
      keys.current = {};
      isDragging.current = false;
      velocity.current.set(0, 0, 0);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [selectResource, closeModal, openModal]);

  // Pointer lock / Drag look listeners
  useEffect(() => {
    const dom = gl.domElement;
    let mouseDownPos = { x: 0, y: 0 };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault(); // Prevent browser right-click menu so right-drag look is seamless
    };

    const handlePointerLockChange = () => {
      const isLocked = document.pointerLockElement === dom;
      if (!isLocked && isDragging.current) {
        isDragging.current = false;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (useLibraryStore.getState().activeModal) return;

      // Blur any active input so WASD controls work immediately
      if (document.activeElement instanceof HTMLElement && document.activeElement !== dom) {
        document.activeElement.blur();
      }

      // Allow both Left click (0) and Right click (2) for dragging/looking
      if (e.button === 0 || e.button === 2) {
        isDragging.current = true;
        mouseDownPos = { x: e.clientX, y: e.clientY };
        previousMousePosition.current = { x: e.clientX, y: e.clientY };

        const pref = useLibraryStore.getState().preferences;
        if (pref.pointerLock && dom.requestPointerLock && document.pointerLockElement !== dom) {
          dom.requestPointerLock().catch(() => {});
        }
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      isDragging.current = false;
      const curModal = useLibraryStore.getState().activeModal;
      // If user performed a stationary left click (dragged less than 6px) while pointing at a book
      const dragDist = Math.hypot(e.clientX - mouseDownPos.x, e.clientY - mouseDownPos.y);
      if (e.button === 0 && dragDist < 6 && !curModal) {
        const curHovered = useLibraryStore.getState().hoveredResourceId;
        if (curHovered) {
          selectResource(curHovered);
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (useLibraryStore.getState().activeModal) return;

      const isLocked = document.pointerLockElement === dom;
      if (!isDragging.current && !isLocked) return;

      const movementX = isLocked ? e.movementX : e.clientX - previousMousePosition.current.x;
      const movementY = isLocked ? e.movementY : e.clientY - previousMousePosition.current.y;

      if (!isLocked) {
        previousMousePosition.current = { x: e.clientX, y: e.clientY };
      }

      const pref = useLibraryStore.getState().preferences;
      const baseSens = isLocked ? 0.0032 : 0.0050;
      const sensitivity = baseSens * pref.lookSensitivity;
      targetYaw.current -= movementX * sensitivity;
      targetPitch.current -= movementY * sensitivity;

      // Clamp vertical look between -80 and +80 degrees
      targetPitch.current = Math.max(-Math.PI / 2.25, Math.min(Math.PI / 2.25, targetPitch.current));
    };

    dom.addEventListener('contextmenu', handleContextMenu);
    dom.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('pointerlockchange', handlePointerLockChange);

    return () => {
      dom.removeEventListener('contextmenu', handleContextMenu);
      dom.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
    };
  }, [gl.domElement, selectResource]);

  // Main per-frame smooth physics & movement update
  useFrame((_, delta) => {
    // If smooth camera transition is active
    if (isNavigatingCamera && cameraTarget) {
      camera.position.x = THREE.MathUtils.damp(camera.position.x, cameraTarget[0], 6.5, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, cameraTarget[1], 6.5, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, cameraTarget[2], 6.5, delta);

      if (cameraLookAt) {
        STATIC_LOOK_AT_VEC.set(cameraLookAt[0], cameraLookAt[1], cameraLookAt[2]);
        STATIC_TARGET_ROT.lookAt(camera.position, STATIC_LOOK_AT_VEC, STATIC_AXIS_Y);
        STATIC_TARGET_QUAT.setFromRotationMatrix(STATIC_TARGET_ROT);
        camera.quaternion.slerp(STATIC_TARGET_QUAT, 0.12);

        STATIC_EULER.setFromQuaternion(camera.quaternion, 'YXZ');
        yaw.current = STATIC_EULER.y;
        pitch.current = STATIC_EULER.x;
        targetYaw.current = STATIC_EULER.y;
        targetPitch.current = STATIC_EULER.x;
      }
      return;
    }

    // Clamp delta to prevent sudden spikes if a frame takes long
    const safeDelta = Math.min(delta, 0.05);

    // Zero-latency rotational tracking (eliminates heavy lag or feeling stuck)
    yaw.current = targetYaw.current;
    pitch.current = targetPitch.current;

    camera.rotation.x = pitch.current;
    camera.rotation.y = yaw.current;

    const curModal = useLibraryStore.getState().activeModal;
    if (curModal) return;

    // Smooth keyboard camera rotation using Arrow keys or Q (effortless turning without mouse dragging!)
    const kbTurnSpeed = 2.4; // Radians per second
    if (keys.current['ArrowLeft'] || (keys.current['KeyQ'] && !keys.current['KeyA'] && !keys.current['a'])) {
      targetYaw.current += kbTurnSpeed * safeDelta;
    }
    if (keys.current['ArrowRight']) {
      targetYaw.current -= kbTurnSpeed * safeDelta;
    }

    const curPref = useLibraryStore.getState().preferences;

    // Movement physics: instant linear velocity (zero startup delay!)
    const isSprint = keys.current['ShiftLeft'] || keys.current['ShiftRight'];
    const maxSpeed = isSprint ? 16.5 : (curPref.moveSpeed || 9.5);

    STATIC_FORWARD.set(0, 0, -1).applyAxisAngle(STATIC_AXIS_Y, yaw.current);
    STATIC_RIGHT.set(1, 0, 0).applyAxisAngle(STATIC_AXIS_Y, yaw.current);

    STATIC_INPUT_DIR.set(0, 0, 0);
    if (keys.current['KeyW'] || keys.current['ArrowUp'] || keys.current['w']) STATIC_INPUT_DIR.add(STATIC_FORWARD);
    if (keys.current['KeyS'] || keys.current['ArrowDown'] || keys.current['s']) STATIC_INPUT_DIR.sub(STATIC_FORWARD);
    if (keys.current['KeyD'] || keys.current['d']) STATIC_INPUT_DIR.add(STATIC_RIGHT);
    if (keys.current['KeyA'] || keys.current['a']) STATIC_INPUT_DIR.sub(STATIC_RIGHT);

    const isMoving = STATIC_INPUT_DIR.lengthSq() > 0;
    if (isMoving) {
      STATIC_INPUT_DIR.normalize();
      // Zero startup delay: full velocity on frame 1
      velocity.current.copy(STATIC_INPUT_DIR).multiplyScalar(maxSpeed);
    } else {
      // Immediate clean stop
      velocity.current.set(0, 0, 0);
    }

    // Apply movement if moving
    const speed = velocity.current.length();
    if (speed > 0) {
      const nextX = camera.position.x + velocity.current.x * safeDelta;
      const nextZ = camera.position.z + velocity.current.z * safeDelta;

      // Library boundary clamping
      const clampedX = Math.max(-55, Math.min(55, nextX));
      const clampedZ = Math.max(-116, Math.min(40, nextZ));

      camera.position.x = clampedX;
      camera.position.z = clampedZ;

      walkDistance.current += speed * safeDelta;

      // Footstep audio
      if (curPref.footstepsEnabled) {
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

    // Smooth multi-level architectural floor elevation + human eye height + subtle head-bob
    const targetFloorY = getFloorElevation(camera.position.x, camera.position.z, camera.position.y);
    const headBobY = speed > 0.05 ? Math.sin(walkDistance.current * 4.5) * 0.025 : 0;
    const targetCameraY = targetFloorY + 1.7 + headBobY;
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCameraY, 14, safeDelta);

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
    if (!curModal && raycastTimer.current >= 0.033) {
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

      const curHovered = useLibraryStore.getState().hoveredResourceId;
      if (hitBookId) {
        if (hitBookId !== curHovered) {
          setHoveredResource(hitBookId);
        }
      } else if (curHovered && !(window as any).__mouseHoveredBookId) {
        setHoveredResource(null);
      }
    }
  });

  return null;
};
