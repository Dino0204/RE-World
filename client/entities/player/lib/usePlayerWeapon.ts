import { RefObject, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody } from "@react-three/rapier";
import { usePlayerStore } from "../model/store";
import { useBulletStore } from "../../bullet/model/store";

export const usePlayerWeapon = (
  rigidBodyRef: React.RefObject<RapierRigidBody | null>,
  camera: THREE.Camera,
  isMouseDownRef: RefObject<boolean>,
  pendingRecoilRef: RefObject<{ x: number; y: number }>,
  lastShotTimestampRef: RefObject<number>,
) => {
  const { equippedItems } = usePlayerStore();
  const addBullet = useBulletStore((state) => state.addBullet);
  const recoilPatternIndex = useRef(0);

  useFrame((state) => {
    if (!rigidBodyRef.current) return;

    const now = Date.now();
    // Reset recoil pattern if not fired for a while
    if (now - lastShotTimestampRef.current > 500) {
      recoilPatternIndex.current = 0;
    }

    const currentWeapon = equippedItems[0];
    if (currentWeapon) {
      const shootInterval = 60000 / currentWeapon.fireRate;
      if (
        isMouseDownRef.current &&
        now - lastShotTimestampRef.current >= shootInterval
      ) {
        const position = rigidBodyRef.current.translation();
        const cameraWorldDirection = new THREE.Vector3();
        state.camera.getWorldDirection(cameraWorldDirection);

        const bulletVelocity = cameraWorldDirection.clone().multiplyScalar(20);

        const spawnPosition = new THREE.Vector3(
          position.x,
          position.y + 0.5,
          position.z,
        ).add(cameraWorldDirection.clone().multiplyScalar(1.0));

        addBullet({
          id: crypto.randomUUID(),
          position: spawnPosition,
          velocity: bulletVelocity,
        });

        // Recoil Calculation
        const recoilConfig = currentWeapon.recoil;
        const pattern =
          recoilConfig.pattern[recoilPatternIndex.current] ||
          recoilConfig.pattern[recoilConfig.pattern.length - 1];

        const verticalKick = recoilConfig.vertical + pattern.y;
        const horizontalKick =
          (Math.random() - 0.5) * recoilConfig.horizontal + pattern.x;

        pendingRecoilRef.current.x += horizontalKick;
        pendingRecoilRef.current.y += verticalKick;

        recoilPatternIndex.current += 1;
        lastShotTimestampRef.current = now;
      }
    }
  });
};
