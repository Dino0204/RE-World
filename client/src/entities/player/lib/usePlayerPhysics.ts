import { RefObject } from "react";
import { RapierRigidBody, useRapier } from "@react-three/rapier";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { usePlayerStore } from "../model/player.store";
import { Controls, PLAYER_PHYSICS } from "../model/player.constants";

export const usePlayerPhysics = (
  rigidBodyRef: RefObject<RapierRigidBody | null>,
  meshRef: RefObject<THREE.Group | null>,
  camera: THREE.Camera,
) => {
  const { isJumping, setJump } = usePlayerStore();
  const { world, rapier } = useRapier();
  const [, get] = useKeyboardControls<Controls>();

  useFrame(() => {
    if (!rigidBodyRef.current) return;

    const { forward, backward, left, right } = get();

    const cameraWorldDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraWorldDirection);
    cameraWorldDirection.y = 0;
    cameraWorldDirection.normalize();

    const rightVec = new THREE.Vector3();
    rightVec.crossVectors(camera.up, cameraWorldDirection).normalize();

    const moveDirection = new THREE.Vector3();
    const dz = (backward ? 1 : 0) - (forward ? 1 : 0);
    const dx = (right ? 1 : 0) - (left ? 1 : 0);
    moveDirection.addScaledVector(cameraWorldDirection, -dz);
    moveDirection.addScaledVector(rightVec, -dx);

    const currentPos = rigidBodyRef.current.translation();
    const rayOrigin = currentPos;
    const rayDirection = { x: 0, y: -1, z: 0 };
    const ray = new rapier.Ray(rayOrigin, rayDirection);
    const hit = world.castRay(
      ray,
      1.0,
      false,
      undefined,
      undefined,
      undefined,
      rigidBodyRef.current,
    );
    const isPlayerGrounded = hit !== null;

    let verticalVelocity = rigidBodyRef.current.linvel().y;

    if (isJumping) {
      if (isPlayerGrounded) {
        verticalVelocity = PLAYER_PHYSICS.JUMP_FORCE;
      }
      setJump(false);
    }

    const velocity = {
      x: moveDirection.x * PLAYER_PHYSICS.SPEED,
      y: verticalVelocity,
      z: moveDirection.z * PLAYER_PHYSICS.SPEED,
    };

    rigidBodyRef.current.setLinvel(velocity, true);

    const position = currentPos;

    if (meshRef.current) {
      const lookTarget = new THREE.Vector3(
        position.x + cameraWorldDirection.x,
        position.y,
        position.z + cameraWorldDirection.z,
      );

      const currentQuaternion = meshRef.current.quaternion.clone();
      meshRef.current.lookAt(lookTarget);
      const targetQuaternion = meshRef.current.quaternion.clone();

      meshRef.current.quaternion.copy(currentQuaternion);
      meshRef.current.quaternion.slerp(targetQuaternion, 0.2);
    }
  });
};
