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

  // 재사용 가능한 벡터들 (GC 압박 제거)
  const backVector = useRef(new THREE.Vector3());
  const targetPosition = useRef(new THREE.Vector3());

  // 카메라 회전 순서 초기화 플래그
  const isInitialized = useRef(false);

  useFrame((threeState) => {
    if (!rigidBodyRef.current) return;

    // 카메라 회전 순서 초기화 (한 번만)
    if (!isInitialized.current) {
      threeState.camera.rotation.order = "YXZ";
      isInitialized.current = true;
    }

    const now = Date.now();

    // 현재 카메라 회전 동기화 (마우스 입력 반영)
    cameraRotation.current.pitch = threeState.camera.rotation.x;
    cameraRotation.current.yaw = threeState.camera.rotation.y;

    // ===== 반동 적용 =====
    if (pendingRecoilRef.current.x !== 0 || pendingRecoilRef.current.y !== 0) {
      cameraRotation.current.pitch += pendingRecoilRef.current.y;
      cameraRotation.current.yaw += pendingRecoilRef.current.x;

      recoilRecoveryOffsetRef.current.x += pendingRecoilRef.current.x;
      recoilRecoveryOffsetRef.current.y += pendingRecoilRef.current.y;

      pendingRecoilRef.current.x = 0;
      pendingRecoilRef.current.y = 0;
    }

    // ===== 반동 복구 =====
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

    // ===== Pitch 제한 =====
    cameraRotation.current.pitch = THREE.MathUtils.clamp(
      cameraRotation.current.pitch,
      -Math.PI / 2,
      Math.PI / 2,
    );

    // ===== 카메라 회전 적용 (핵심 수정!) =====
    threeState.camera.rotation.x = cameraRotation.current.pitch;
    threeState.camera.rotation.y = cameraRotation.current.yaw;
    threeState.camera.rotation.z = 0; // Roll 고정

    // ===== ADS FOV =====
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

    // ===== 카메라 위치 =====
    const position = rigidBodyRef.current.translation();

    if (cameraMode === "FIRST_PERSON") {
      threeState.camera.position.set(position.x, position.y + 0.5, position.z);
    } else {
      // 3인칭 카메라 (벡터 재사용)
      const cameraDistance = 3;
      const cameraHeight = 1.6;

      // 카메라 뒤쪽 방향 계산 (벡터 재사용)
      backVector.current.set(0, 0, 1);
      backVector.current.applyQuaternion(threeState.camera.quaternion);

      // 타겟 위치 (캐릭터 머리)
      targetPosition.current.set(
        position.x,
        position.y + cameraHeight,
        position.z,
      );

      // 최종 카메라 위치
      threeState.camera.position.copy(targetPosition.current);
      threeState.camera.position.addScaledVector(
        backVector.current,
        cameraDistance,
      );
    }
  });

  return { lastShotTimestamp };
};
