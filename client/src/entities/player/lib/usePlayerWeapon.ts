import { RefObject, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody } from "@react-three/rapier";
import { usePlayerStore } from "../model/player.store";
import { useBulletStore } from "../../bullet/model/bullet.store";
import { WEAPON_CONFIG, RECOIL_CONFIG } from "../model/player.constants";

export const usePlayerWeapon = (
  rigidBodyRef: React.RefObject<RapierRigidBody | null>,
  isMouseDownRef: RefObject<boolean>,
  recoilQueueRef: RefObject<{ x: number; y: number }>,
  lastShotTimestampRef: RefObject<number>,
) => {
  const { equippedItems } = usePlayerStore();
  const addBullet = useBulletStore((state) => state.addBullet);
  const recoilPatternIndex = useRef(0);

  useFrame((state) => {
    // 플레이어가 없다면 리턴
    if (!rigidBodyRef.current) return;

    // 현재 시간
    const now = Date.now();

    // 마지막 발사 시간이 반동 회복 간격을 초과했다면
    if (now - lastShotTimestampRef.current > RECOIL_CONFIG.RESET_INTERVAL_MS) {
      // 반동 패턴 초기화
      recoilPatternIndex.current = 0;
    }

    // 현재 장착된 무기
    const currentWeapon = equippedItems[0];

    // 무기가 있다면
    if (currentWeapon) {
      // 발사 간격 계산
      const shootInterval = 60000 / currentWeapon.fireRate;

      // 마우스 클릭 중이고 발사 간격이 지났다면
      if (
        isMouseDownRef.current &&
        now - lastShotTimestampRef.current >= shootInterval
      ) {
        const position = rigidBodyRef.current.translation();
        const cameraWorldDirection = new THREE.Vector3();
        state.camera.getWorldDirection(cameraWorldDirection);

        // 총알 속도 계산
        const vel = cameraWorldDirection
          .clone()
          .multiplyScalar(WEAPON_CONFIG.BULLET_VELOCITY_MULTIPLIER);

        // 총알 생성 위치 계산
        const spawn = new THREE.Vector3(
          position.x,
          position.y + WEAPON_CONFIG.BULLET_HEIGHT_OFFSET,
          position.z,
        ).add(
          cameraWorldDirection
            .clone()
            .multiplyScalar(WEAPON_CONFIG.BULLET_SPAWN_OFFSET),
        );

        // 총알 추가
        addBullet({
          id: crypto.randomUUID(),
          position: { x: spawn.x, y: spawn.y, z: spawn.z },
          velocity: { x: vel.x, y: vel.y, z: vel.z },
          damage: currentWeapon.damage,
          category: "BULLET",
          itemType: currentWeapon.ammo.type,
          name: "bullet",
          weight: 1,
          stackSize: 64,
        });

        // 반동 정보
        const recoilConfig = currentWeapon.recoil;

        // 반동 패턴
        const pattern =
          recoilConfig.pattern[recoilPatternIndex.current] ||
          recoilConfig.pattern[recoilConfig.pattern.length - 1];

        // 수직 반동 계산
        const verticalKick = recoilConfig.vertical + pattern.y;

        // 수평 반동 계산
        const horizontalKick =
          (Math.random() - 0.5) * recoilConfig.horizontal + pattern.x;

        // 반동 누적
        recoilQueueRef.current.x += horizontalKick;
        recoilQueueRef.current.y += verticalKick;

        // 반동 패턴 인덱스 증가
        recoilPatternIndex.current += 1;

        // 마지막 발사 시간 업데이트
        lastShotTimestampRef.current = now;
      }
    }
  });
};
