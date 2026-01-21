import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody } from "@react-three/rapier";
import { usePlayerStore } from "../model/store";

export const usePlayerCamera = (
  camera: THREE.Camera,
  rigidBodyRef: React.RefObject<RapierRigidBody | null>,
  recoilRecoveryOffsetRef: React.RefObject<{ x: number; y: number }>,
  pendingRecoilRef: React.RefObject<{ x: number; y: number }>,
) => {
  const { isAiming, cameraMode } = usePlayerStore();
  const cameraRotation = useRef({ pitch: 0, yaw: 0 });
  const lastShotTimestamp = useRef(0);

  useFrame((threeState) => {
    if (!rigidBodyRef.current) return;

    // Camera rotation order
    if (threeState.camera.rotation.order !== "YXZ") {
      threeState.camera.rotation.order = "YXZ";
    }

    // Sync rotation
    cameraRotation.current.pitch = threeState.camera.rotation.x;
    cameraRotation.current.yaw = threeState.camera.rotation.y;

    const now = Date.now();

    // Recoil application
    if (pendingRecoilRef.current.x !== 0 || pendingRecoilRef.current.y !== 0) {
      cameraRotation.current.pitch += pendingRecoilRef.current.y;
      cameraRotation.current.yaw += pendingRecoilRef.current.x;

      recoilRecoveryOffsetRef.current.x += pendingRecoilRef.current.x;
      recoilRecoveryOffsetRef.current.y += pendingRecoilRef.current.y;

      pendingRecoilRef.current.x = 0;
      pendingRecoilRef.current.y = 0;
    }

    // Recoil Recovery
    if (now - lastShotTimestamp.current > 100) {
      const recoveryFactor = 0.1;
      const recoverX = recoilRecoveryOffsetRef.current.x * recoveryFactor;
      const recoverY = recoilRecoveryOffsetRef.current.y * recoveryFactor;

      cameraRotation.current.pitch -= recoverY;
      cameraRotation.current.yaw -= recoverX;

      recoilRecoveryOffsetRef.current.x -= recoverX;
      recoilRecoveryOffsetRef.current.y -= recoverY;

      if (Math.abs(recoilRecoveryOffsetRef.current.x) < 0.001)
        recoilRecoveryOffsetRef.current.x = 0;
      if (Math.abs(recoilRecoveryOffsetRef.current.y) < 0.001)
        recoilRecoveryOffsetRef.current.y = 0;
    }

    // Clamp Pitch
    cameraRotation.current.pitch = Math.max(
      -Math.PI / 2,
      Math.min(Math.PI / 2, cameraRotation.current.pitch),
    );

    threeState.camera.rotation.x = cameraRotation.current.pitch;
    threeState.camera.rotation.y = cameraRotation.current.yaw;

    // ADS FOV
    const perspectiveCamera = threeState.camera as THREE.PerspectiveCamera;
    if (perspectiveCamera.isPerspectiveCamera) {
      const targetFov = isAiming ? 45 : 75;
      perspectiveCamera.fov = THREE.MathUtils.lerp(
        perspectiveCamera.fov,
        targetFov,
        0.2,
      );
      perspectiveCamera.updateProjectionMatrix();
    }

    // Camera Position
    const position = rigidBodyRef.current.translation();
    if (cameraMode === "FIRST_PERSON") {
      camera.position.set(position.x, position.y + 0.5, position.z);
    } else {
      const cameraDistance = 3;
      const cameraHeight = 1.6;

      const backVector = new THREE.Vector3(0, 0, 1).applyQuaternion(
        camera.quaternion,
      );

      const targetPosition = new THREE.Vector3(
        position.x,
        position.y + cameraHeight,
        position.z,
      );
      const cameraPosition = targetPosition
        .clone()
        .add(backVector.multiplyScalar(cameraDistance));

      camera.position.copy(cameraPosition);
    }
  });

  return { lastShotTimestamp };
};
