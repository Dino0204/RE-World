import { RefObject, useRef } from "react";
import { RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { usePlayerStore } from "../model/store";

export const usePlayerPhysics = (
  rigidBodyRef: RefObject<RapierRigidBody | null>,
  meshRef: RefObject<THREE.Mesh | null>,
  camera: THREE.Camera,
) => {
  const { direction, isJumping, isMoving, setJump } = usePlayerStore();
  const isPlayerGrounded = useRef(true);
  const speed = 5;
  const jumpForce = 6;

  useFrame(() => {
    if (!rigidBodyRef.current) return;

    // Calculate movement direction relative to camera
    const cameraWorldDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraWorldDirection);
    cameraWorldDirection.y = 0;
    cameraWorldDirection.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(camera.up, cameraWorldDirection).normalize();

    const moveDirection = new THREE.Vector3();
    moveDirection.addScaledVector(cameraWorldDirection, -direction.z);
    moveDirection.addScaledVector(right, -direction.x);

    let verticalVelocity = rigidBodyRef.current.linvel().y;

    if (isJumping) {
      if (isPlayerGrounded.current) {
        verticalVelocity = jumpForce;
        isPlayerGrounded.current = false;
      }
      setJump(false);
    }

    const velocity = {
      x: moveDirection.x * speed,
      y: verticalVelocity,
      z: moveDirection.z * speed,
    };

    rigidBodyRef.current.setLinvel(velocity, true);

    const position = rigidBodyRef.current.translation();

    // Rotate character mesh to face movement direction
    if (meshRef.current) {
      if (isMoving && (moveDirection.x !== 0 || moveDirection.z !== 0)) {
        const lookTarget = new THREE.Vector3(
          position.x + moveDirection.x,
          position.y,
          position.z + moveDirection.z,
        );

        const currentQuaternion = meshRef.current.quaternion.clone();
        meshRef.current.lookAt(lookTarget);
        const targetQuaternion = meshRef.current.quaternion.clone();

        meshRef.current.quaternion.copy(currentQuaternion);
        meshRef.current.quaternion.slerp(targetQuaternion, 0.2);
      }
    }
  });

  const handleCollisionEnter = () => {
    isPlayerGrounded.current = true;
  };

  return { handleCollisionEnter };
};
