import { useRef } from "react";
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

export default function Player() {
  const { camera } = useThree();

  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const controlsRef = useRef(null);
  const recoilRecoveryOffsetRef = useRef({ x: 0, y: 0 });
  const pendingRecoilRef = useRef({ x: 0, y: 0 });
  const lastShotTimestampRef = useRef(0);

  const { equippedItems, cameraMode, isAiming } = usePlayerStore();
  const { isMouseDown } = usePlayerControls();
  usePlayerPhysics(rigidBodyRef, meshRef, camera);
  usePlayerCamera(
    camera,
    rigidBodyRef,
    recoilRecoveryOffsetRef,
    pendingRecoilRef,
  );
  usePlayerWeapon(
    rigidBodyRef,
    camera,
    isMouseDown,
    pendingRecoilRef,
    lastShotTimestampRef,
  );

  return (
    <>
      <PointerLockControls ref={controlsRef} />
      <RigidBody ref={rigidBodyRef} lockRotations>
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
