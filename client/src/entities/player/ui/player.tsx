// 마지막 발사 시간이 반동 회복 딜레이를 초과했다면
import { useRef, useCallback, useEffect } from "react";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import { useThree } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import * as THREE from "three";
import Weapon from "../../weapon/ui/weapon";
import { WEAPONS } from "../../weapon/model/weapon.data";
import { usePlayerStore } from "../model/player.store";
import { usePlayerControls } from "../lib/usePlayerControls";
import { usePlayerPhysics } from "../lib/usePlayerPhysics";
import { usePlayerCamera } from "../lib/usePlayerCamera";
import { usePlayerWeapon } from "../lib/usePlayerWeapon";
import { usePlayerEquipment } from "../lib/usePlayerEquipment";
import { useMultiplayerSync } from "../../multi-player/lib/useMultiplayerSync";

export default function Player() {
  const { camera } = useThree();

  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  const controlsRef = useRef(null);

  const recoilRecoveryOffsetRef = useRef({ x: 0, y: 0 });
  const recoilQueueRef = useRef({ x: 0, y: 0 });

  const lastShotTimestampRef = useRef(0);

  const { equippedItems, cameraMode, isAiming } = usePlayerStore();
  const { isMouseDown } = usePlayerControls();

  const handleHitRef = useRef<(damage: number) => void>(null);

  // 플레이어가 맞았을 때
  useEffect(() => {
    handleHitRef.current = (damage: number) => {
      const { currentHealth, setHealth } = usePlayerStore.getState();
      const newHealth = Math.max(0, currentHealth - damage);
      setHealth(newHealth);
      console.log(
        `Player hit! Damage: ${damage}, Health: ${currentHealth} -> ${newHealth}`,
      );
      if (newHealth <= 0) {
        console.log("Player died!");
      }
    };
  });

  const handleHit = useCallback((damage: number) => {
    handleHitRef.current?.(damage);
  }, []);

  usePlayerPhysics(rigidBodyRef, meshRef, camera);
  usePlayerCamera(
    rigidBodyRef,
    recoilRecoveryOffsetRef,
    recoilQueueRef,
    lastShotTimestampRef,
  );
  usePlayerWeapon(
    rigidBodyRef,
    isMouseDown,
    recoilQueueRef,
    lastShotTimestampRef,
  );
  usePlayerEquipment();
  useMultiplayerSync(rigidBodyRef, meshRef);

  // 임시 테스트: M416을 슬롯 0에 배치
  useEffect(() => {
    const { setWeaponInSlot } = usePlayerStore.getState();
    const M416 = WEAPONS.find((w) => w.name === "M416");
    if (M416) {
      setWeaponInSlot(0, M416);
    }
  }, []);

  return (
    <>
      <PointerLockControls ref={controlsRef} />
      <RigidBody
        ref={rigidBodyRef}
        lockRotations
        userData={{ type: "player", onHit: handleHit, material: "concrete" }}
      >
        <mesh ref={meshRef}>
          <capsuleGeometry args={[0.5, 0.5]} />
          <meshStandardMaterial color="hotpink" />
        </mesh>
        {WEAPONS.map((weapon) => (
          <Weapon
            key={weapon.name}
            cameraMode={cameraMode}
            weapon={weapon}
            isAiming={isAiming}
            visible={equippedItems.some((item) => item.name === weapon.name)}
          />
        ))}
      </RigidBody>
    </>
  );
}
