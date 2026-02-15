import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody } from "@react-three/rapier";
import { usePlayerStore } from "../model/player.store";
import { CAMERA_CONFIG, RECOIL_CONFIG } from "../model/player.constants";

export const usePlayerCamera = (
  rigidBodyRef: React.RefObject<RapierRigidBody | null>,
  recoilRecoveryOffsetRef: React.RefObject<{ x: number; y: number }>,
  recoilQueueRef: React.RefObject<{ x: number; y: number }>,
  lastShotTimestampRef: React.RefObject<number>,
) => {
  const { isAiming, cameraMode } = usePlayerStore();
  const cameraRotation = useRef({ pitch: 0, yaw: 0 });

  const backVector = useRef(new THREE.Vector3());
  const targetPosition = useRef(new THREE.Vector3());

  const isInitialized = useRef(false);

  useFrame((threeState) => {
    // 플레이어가 없다면 반환
    if (!rigidBodyRef.current) return;

    // 초기화가 되어 있지 않다면
    if (!isInitialized.current) {
      // 짐벌락 방지
      threeState.camera.rotation.order = "YXZ";
      isInitialized.current = true;
    }

    // 반동 회복을 위한 시간 계산
    const now = Date.now();

    // Y, Z 축 회전값 동기화
    cameraRotation.current.pitch = threeState.camera.rotation.x;
    cameraRotation.current.yaw = threeState.camera.rotation.y;

    // 적용해야할 반동이 있다면
    if (recoilQueueRef.current.x !== 0 || recoilQueueRef.current.y !== 0) {
      // 반동 적용
      cameraRotation.current.pitch += recoilQueueRef.current.y;
      cameraRotation.current.yaw += recoilQueueRef.current.x;

      // 반동량 저장
      recoilRecoveryOffsetRef.current.x += recoilQueueRef.current.x;
      recoilRecoveryOffsetRef.current.y += recoilQueueRef.current.y;

      // 반동 초기화
      recoilQueueRef.current.x = 0;
      recoilQueueRef.current.y = 0;
    }

    // 마지막 발사 시간이 반동 회복 딜레이를 초과했다면
    if (now - lastShotTimestampRef.current > RECOIL_CONFIG.RECOVERY_DELAY_MS) {
      // 반동 회복량 계산
      const recoverX =
        recoilRecoveryOffsetRef.current.x * RECOIL_CONFIG.RECOVERY_FACTOR;
      const recoverY =
        recoilRecoveryOffsetRef.current.y * RECOIL_CONFIG.RECOVERY_FACTOR;

      // 반동 회복
      cameraRotation.current.pitch -= recoverY;
      cameraRotation.current.yaw -= recoverX;

      // 회복된 반동량만큼 반동량 차감
      recoilRecoveryOffsetRef.current.x -= recoverX;
      recoilRecoveryOffsetRef.current.y -= recoverY;

      // X축 반동 회복량 임계값보다 작으면 0으로 초기화
      if (
        Math.abs(recoilRecoveryOffsetRef.current.x) <
        RECOIL_CONFIG.RECOVERY_THRESHOLD
      )
        recoilRecoveryOffsetRef.current.x = 0;

      // Y축 반동 회복량 임계값보다 작으면 0으로 초기화
      if (
        Math.abs(recoilRecoveryOffsetRef.current.y) <
        RECOIL_CONFIG.RECOVERY_THRESHOLD
      )
        recoilRecoveryOffsetRef.current.y = 0;
    }

    // 카메라가 뒤집히지 않도록 위아래 각도 제한 -90 ~ 90
    cameraRotation.current.pitch = THREE.MathUtils.clamp(
      cameraRotation.current.pitch,
      -Math.PI / 2,
      Math.PI / 2,
    );

    // 최종 카메라 회전값 적용
    threeState.camera.rotation.x = cameraRotation.current.pitch;
    threeState.camera.rotation.y = cameraRotation.current.yaw;
    threeState.camera.rotation.z = 0;

    const perspectiveCamera = threeState.camera as THREE.PerspectiveCamera;

    if (perspectiveCamera.isPerspectiveCamera) {
      // 조준 시 FOV 변경
      const targetFov = isAiming
        ? CAMERA_CONFIG.FOV_ADS
        : CAMERA_CONFIG.FOV_NORMAL;

      // 카메라 전환을 부드럽게 하기 위해 FOV 선형 보간
      // 남은 거리를 속도만큼 이동
      perspectiveCamera.fov = THREE.MathUtils.lerp(
        perspectiveCamera.fov,
        targetFov,
        CAMERA_CONFIG.FOV_LERP_SPEED,
      );

      // 3D 물체를 2D 화면에 투영하는 행렬 업데이트
      perspectiveCamera.updateProjectionMatrix();
    }

    const position = rigidBodyRef.current.translation();

    if (cameraMode === "FIRST_PERSON") {
      // 1인칭 시점
      threeState.camera.position.set(
        position.x,
        position.y + CAMERA_CONFIG.FIRST_PERSON_HEIGHT,
        position.z,
      );
    } else {
      // 3인칭 시점
      const cameraDistance = CAMERA_CONFIG.THIRD_PERSON_DISTANCE;
      const cameraHeight = CAMERA_CONFIG.THIRD_PERSON_HEIGHT;

      // 플레이어의 뒤쪽 방향 벡터 계산
      backVector.current.set(0, 0, 1);
      backVector.current.applyQuaternion(threeState.camera.quaternion);

      // 카메라가 바라볼 지점 계산
      targetPosition.current.set(
        position.x,
        position.y + cameraHeight,
        position.z,
      );

      // 카메라를 플레이어 위치로 이동
      threeState.camera.position.copy(targetPosition.current);

      // 카메라를 플레이어 뒤로 이동
      threeState.camera.position.addScaledVector(
        backVector.current,
        cameraDistance,
      );
    }
  });
};
