import * as THREE from 'three';

// Global interactive registry for zero-overhead crosshair raycasting
// Storing meshes here allows FirstPersonControls to raycast only against books
// without traversing thousands of non-book room and architectural meshes.
export const INTERACTIVE_BOOK_OBJECTS = new Map<THREE.Object3D, string>();
