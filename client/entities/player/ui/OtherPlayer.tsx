import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { GameMessage } from "@/entities/player/model/player";
import type { RemotePlayerState } from "@/shared/store/multiplayer";

type OtherPlayerProps = Pick<
  RemotePlayerState,
  "position" | "rotation" | "direction" | "isJumping" | "equippedItems" | "isAiming"
>;

export default function OtherPlayer({
  position,
  rotation,
  direction,
  isJumping,
  equippedItems,
  isAiming,
}: OtherPlayerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const weaponRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (groupRef.current) {
      const baseY = position.y + (isJumping ? 0.3 : 0);
      groupRef.current.position.lerp(
        new THREE.Vector3(position.x, baseY, position.z),
        0.1,
      );
      groupRef.current.quaternion.slerp(
        new THREE.Quaternion(rotation.x, rotation.y, rotation.z, rotation.w),
        0.1,
      );
    }
    if (weaponRef.current && equippedItems?.length) {
      const aimZ = isAiming ? -0.4 : -0.25;
      weaponRef.current.position.lerp(
        new THREE.Vector3(0.25, 0.4, aimZ),
        0.15,
      );
    }
  });

  const hasWeapon = equippedItems && equippedItems.length > 0;

  return (
    <group ref={groupRef}>
      <mesh>
        <capsuleGeometry args={[0.5, 0.5]} />
        <meshStandardMaterial color="cyan" />
      </mesh>
      {hasWeapon && (
        <mesh ref={weaponRef} position={[0.25, 0.4, -0.25]}>
          <boxGeometry args={[0.15, 0.08, 0.35]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      )}
    </group>
  );
}
