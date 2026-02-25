import { useRef, useCallback, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { SkeletonUtils } from "three/examples/jsm/Addons.js";
import type { RemotePlayerState } from "@/entities/multi-player/model/multi-player.store";
import { useMultiplayerStore } from "@/entities/multi-player/model/multi-player.store";
import { PLAYER_MODEL_PATH } from "@/entities/player/model/player.constants";

type OtherPlayerProps = Pick<
  RemotePlayerState,
  | "playerId"
  | "position"
  | "rotation"
  | "direction"
  | "isJumping"
  | "equippedItems"
  | "isAiming"
  | "currentHealth"
  | "maxHealth"
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
  const weaponRef = useRef<THREE.Mesh>(null);
  const cloneRef = useRef<THREE.Group>(null);
  const currentClipRef = useRef<string | null>(null);

  const { scene, animations } = useGLTF(PLAYER_MODEL_PATH);
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { actions } = useAnimations(animations, cloneRef);

  const handleHitRef = useRef<(damage: number) => void>(null);
  useEffect(() => {
    handleHitRef.current = (damage: number) => {
      const { players, updatePlayer } = useMultiplayerStore.getState();
      const player = players.get(playerId);
      const health = player?.currentHealth ?? currentHealth;
      const newHealth = Math.max(0, health - damage);
      console.log(
        `OtherPlayer ${playerId} hit! Damage: ${damage}, Health: ${health} -> ${newHealth}`,
      );
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

      const targetRotation = new THREE.Quaternion(
        rotation.x,
        rotation.y,
        rotation.z,
        rotation.w,
      );
      rigidBodyRef.current.setRotation(targetRotation, true);
    }
    if (weaponRef.current && equippedItems?.length) {
      const aimZ = isAiming ? -0.4 : -0.25;
      weaponRef.current.position.lerp(new THREE.Vector3(0.25, 0.4, aimZ), 0.15);
    }

    const clipName =
      !direction || (direction.x === 0 && direction.z === 0)
        ? "idle"
        : direction.z < 0
          ? "run_forward"
          : direction.z > 0
            ? "run_backward"
            : direction.x < 0
              ? "run_left"
              : "run_right";

    if (currentClipRef.current === null) {
      actions["idle"]?.play();
      currentClipRef.current = "idle";
    } else if (clipName !== currentClipRef.current) {
      actions[currentClipRef.current]?.fadeOut(0.2);
      actions[clipName]?.reset().fadeIn(0.2).play();
      currentClipRef.current = clipName;
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
      <group ref={cloneRef}>
        <primitive object={clonedScene} />
      </group>
      {hasWeapon && (
        <mesh ref={weaponRef} position={[0.25, 0.4, -0.25]}>
          <boxGeometry args={[0.15, 0.08, 0.35]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      )}
    </RigidBody>
  );
}

useGLTF.preload(PLAYER_MODEL_PATH);
