import { RefObject, useCallback, useRef } from "react";
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
  const { setJump } = usePlayerStore();
  const { world, rapier } = useRapier();
  const [, get] = useKeyboardControls<Controls>();
  const prevJumpRef = useRef(false);
  const jumpAppliedRef = useRef(false);
  const prevVelocityYRef = useRef(0);

  useFrame(() => {
    if (!rigidBodyRef.current) return;

    prevVelocityYRef.current = rigidBodyRef.current.linvel().y;

    // console.log(prevVelocityYRef.current);

    const { forward, backward, left, right, jump } = get();

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
    const rayOrigin = {
      x: currentPos.x,
      y: currentPos.y + 0.95,
      z: currentPos.z,
    };
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

    const jumpJustPressed = jump && !prevJumpRef.current;
    prevJumpRef.current = jump;

    if (jumpJustPressed && isPlayerGrounded) {
      verticalVelocity = PLAYER_PHYSICS.JUMP_FORCE;
      setJump(true);
      jumpAppliedRef.current = true;
    } else if (jumpAppliedRef.current) {
      setJump(false);
      jumpAppliedRef.current = false;
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

  const handleCollisionEnter = useCallback(() => {
    if (prevVelocityYRef.current >= 0) return;

    const fallSpeed = Math.abs(prevVelocityYRef.current);

    if (fallSpeed <= PLAYER_PHYSICS.FALL_DAMAGE_THRESHOLD) return;

    const damage = Math.min(
      (fallSpeed - PLAYER_PHYSICS.FALL_DAMAGE_THRESHOLD) *
        PLAYER_PHYSICS.FALL_DAMAGE_MULTIPLIER,
      PLAYER_PHYSICS.FALL_DAMAGE_MAX,
    );

    console.log(fallSpeed, damage);

    const { currentHealth, setHealth } = usePlayerStore.getState();
    setHealth(Math.max(0, currentHealth - damage));
  }, []);

  return { handleCollisionEnter };
};
