import { RefObject } from "react";
import { RapierRigidBody, useRapier } from "@react-three/rapier";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { usePlayerStore } from "../model/player.store";
import { PLAYER_PHYSICS } from "../model/player.constants";

export const usePlayerPhysics = (
  rigidBodyRef: RefObject<RapierRigidBody | null>,
  meshRef: RefObject<THREE.Mesh | null>,
  camera: THREE.Camera,
) => {
  const { direction, isJumping, isMoving, setJump } = usePlayerStore();
  const { world, rapier } = useRapier();

  useFrame(() => {
    // 플레이어가 없다면 리턴
    if (!rigidBodyRef.current) return;

    // 카메라 앞 방향 계산
    const cameraWorldDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraWorldDirection);
    cameraWorldDirection.y = 0;
    cameraWorldDirection.normalize();

    // 카메라 위와 앞을 기반으로 오른쪽 방향 계산
    const right = new THREE.Vector3();
    right.crossVectors(camera.up, cameraWorldDirection).normalize();

    // 카메라 방향을 기반으로 이동 방향 계산
    const moveDirection = new THREE.Vector3();

    // z축은 카메라 앞/뒤 방향
    moveDirection.addScaledVector(cameraWorldDirection, -direction.z);

    // x축은 카메라 왼쪽/오른쪽 방향
    moveDirection.addScaledVector(right, -direction.x);

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

    // 수직 속도 계산
    let verticalVelocity = rigidBodyRef.current.linvel().y;

    // 점프 중이라면
    if (isJumping) {
      // 땅에 닿아있다면 점프
      if (isPlayerGrounded) {
        verticalVelocity = PLAYER_PHYSICS.JUMP_FORCE;
      }
      setJump(false);
    }

    // 속도 계산, y축은 중력에 의한 속도 유지
    const velocity = {
      x: moveDirection.x * PLAYER_PHYSICS.SPEED,
      y: verticalVelocity,
      z: moveDirection.z * PLAYER_PHYSICS.SPEED,
    };

    // 선형 속도 적용
    rigidBodyRef.current.setLinvel(velocity, true);

    // 메쉬 회전
    const position = currentPos;

    if (meshRef.current) {
      // 이동 중이고 방향이 있다면
      if (isMoving && (moveDirection.x !== 0 || moveDirection.z !== 0)) {
        // 바라볼 방향 계산
        const lookTarget = new THREE.Vector3(
          position.x + moveDirection.x,
          position.y,
          position.z + moveDirection.z,
        );

        // 현재 쿼터니언과 바라볼 방향의 쿼터니언을 부드럽게 보간
        const currentQuaternion = meshRef.current.quaternion.clone();
        meshRef.current.lookAt(lookTarget);
        const targetQuaternion = meshRef.current.quaternion.clone();

        meshRef.current.quaternion.copy(currentQuaternion);
        meshRef.current.quaternion.slerp(targetQuaternion, 0.2);
      }
    }
  });
};
