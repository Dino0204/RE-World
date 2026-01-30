import { useRef, useCallback, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";
import type { GameMessage } from "@/entities/player/model/player";
import type { RemotePlayerState } from "@/shared/store/multiplayer";
import { useMultiplayerStore } from "@/shared/store/multiplayer";

type OtherPlayerProps = Pick<
  RemotePlayerState,
  "playerId" | "position" | "rotation" | "direction" | "isJumping" | "equippedItems" | "isAiming" | "currentHealth" | "maxHealth"
>;

export default function OtherPlayer({
  playerId,
  position,
  rotation,
  direction,
  isJumping,
  equippedItems,
  isAiming,
  currentHealth = 100,
  maxHealth = 100,
}: OtherPlayerProps) {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const groupRef = useRef<THREE.Group>(null);
  const weaponRef = useRef<THREE.Mesh>(null);

  const handleHitRef = useRef<(damage: number) => void>(null);
  useEffect(() => {
    handleHitRef.current = (damage: number) => {
      const { players, updatePlayer } = useMultiplayerStore.getState();
      const player = players.get(playerId);
      const health = player?.currentHealth ?? currentHealth;
      const newHealth = Math.max(0, health - damage);
      console.log(`OtherPlayer ${playerId} hit! Damage: ${damage}, Health: ${health} -> ${newHealth}`);
      updatePlayer(playerId, { currentHealth: newHealth });
      if (newHealth <= 0) {
        console.log(`OtherPlayer ${playerId} died!`);
      }
    };
  });

  const handleHit = useCallback((damage: number) => {
    handleHitRef.current?.(damage);
  }, []);

  useFrame(() => {
    if (currentHealth <= 0) return;
    if (rigidBodyRef.current) {
      const baseY = position.y + (isJumping ? 0.3 : 0);
      const targetPosition = new THREE.Vector3(position.x, baseY, position.z);
      rigidBodyRef.current.setTranslation(targetPosition, true);
      
      const targetRotation = new THREE.Quaternion(rotation.x, rotation.y, rotation.z, rotation.w);
      rigidBodyRef.current.setRotation(targetRotation, true);
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

  if (currentHealth <= 0) return null;

  return (
    <RigidBody
      ref={rigidBodyRef}
      type="kinematicPosition"
      colliders="cuboid"
      position={[position.x, position.y, position.z]}
      userData={{ type: "player", onHit: handleHit, material: "concrete" }}
    >
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
    </RigidBody>
  );
}
