import { useRef, useCallback, useEffect } from "react";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import { useThree } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import * as THREE from "three";
import Weapon from "../../weapon/ui/weapon";
import { WEAPONS } from "../../weapon/model/data";
import { usePlayerStore } from "../model/store";
import { usePlayerControls } from "../lib/usePlayerControls";
import { usePlayerPhysics } from "../lib/usePlayerPhysics";
import { usePlayerCamera } from "../lib/usePlayerCamera";
import { usePlayerWeapon } from "../lib/usePlayerWeapon";
import { useMultiplayerSync } from "../lib/useMultiplayerSync";

export default function Player() {
  const { camera } = useThree();

  const rigidBodyReference = useRef<RapierRigidBody>(null);
  const meshReference = useRef<THREE.Mesh>(null);
  const controlsReference = useRef(null);
  const recoilRecoveryOffsetReference = useRef({ x: 0, y: 0 });
  const pendingRecoilReference = useRef({ x: 0, y: 0 });
  const lastShotTimestampReference = useRef(0);

  const { equippedItems, cameraMode, isAiming } = usePlayerStore();
  const { isMouseDown } = usePlayerControls();

  const handleHitRef = useRef<(damage: number) => void>(null);
  useEffect(() => {
    handleHitRef.current = (damage: number) => {
      const { currentHealth, setHealth } = usePlayerStore.getState();
      const newHealth = Math.max(0, currentHealth - damage);
      setHealth(newHealth);
      console.log(`Player hit! Damage: ${damage}, Health: ${currentHealth} -> ${newHealth}`);
      if (newHealth <= 0) {
        console.log("Player died!");
      }
    };
  });

  const handleHit = useCallback((damage: number) => {
    handleHitRef.current?.(damage);
  }, []);

  const { handleCollisionEnter } = usePlayerPhysics(
    rigidBodyReference,
    meshReference,
    camera,
  );
  usePlayerCamera(
    camera,
    rigidBodyReference,
    recoilRecoveryOffsetReference,
    pendingRecoilReference,
    lastShotTimestampReference,
  );
  usePlayerWeapon(
    rigidBodyReference,
    camera,
    isMouseDown,
    pendingRecoilReference,
    lastShotTimestampReference,
  );
  useMultiplayerSync(rigidBodyReference, meshReference);

  return (
    <>
      <PointerLockControls ref={controlsReference} />
      <RigidBody
        ref={rigidBodyReference}
        lockRotations
        onCollisionEnter={handleCollisionEnter}
        userData={{ type: "player", onHit: handleHit, material: "concrete" }}
      >
        <mesh ref={meshReference}>
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
