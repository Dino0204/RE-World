import { useRef, useCallback, useEffect } from "react";
import {
  RigidBody,
  RapierRigidBody,
  CapsuleCollider,
} from "@react-three/rapier";
import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls, useAnimations, useGLTF } from "@react-three/drei";
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
import { useInventoryStore } from "@/features/inventory/model/inventory.store";
import { usePlayerAnimation } from "../lib/usePlayerAnimation";
import { PLAYER_MODEL_PATH } from "../model/player.constants";

export default function Player() {
  const { camera } = useThree();

  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const groupRef = useRef<THREE.Group>(null);

  const controlsRef = useRef(null);

  const recoilRecoveryOffsetRef = useRef({ x: 0, y: 0 });
  const recoilQueueRef = useRef({ x: 0, y: 0 });

  const lastShotTimestampRef = useRef(0);

  const { scene, animations } = useGLTF(PLAYER_MODEL_PATH);
  const { actions } = useAnimations(animations, groupRef);

  const { equippedItems, cameraMode, isAiming, setPosition, setRotation } =
    usePlayerStore();
  const { isMouseDown } = usePlayerControls();
  const { isOpen } = useInventoryStore();

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

  usePlayerAnimation(actions);
  usePlayerPhysics(rigidBodyRef, groupRef, camera);
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
  useMultiplayerSync(rigidBodyRef, groupRef);

  const lastSyncTime = useRef(0);

  useFrame(({ clock }) => {
    if (!rigidBodyRef.current) return;

    // 100ms마다만 스토어 업데이트
    if (clock.elapsedTime - lastSyncTime.current > 0.1) {
      const { x, y, z } = rigidBodyRef.current.translation();
      setPosition(new THREE.Vector3(x, y, z));

      const direction = new THREE.Vector3();
      camera.getWorldDirection(direction);
      setRotation(direction);

      lastSyncTime.current = clock.elapsedTime;
    }
  });

  return (
    <>
      {!isOpen && <PointerLockControls ref={controlsRef} />}
      <RigidBody
        ref={rigidBodyRef}
        type="dynamic"
        colliders={false}
        lockRotations
        userData={{ type: "player", onHit: handleHit, material: "concrete" }}
      >
        <CapsuleCollider args={[0.5, 0.4]} position={[0, 0.95, 0]} />
        <group ref={groupRef} visible={cameraMode !== "FIRST_PERSON"}>
          <primitive object={scene} />
        </group>
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
