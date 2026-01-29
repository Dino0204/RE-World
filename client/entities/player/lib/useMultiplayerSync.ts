import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { getGameWebsocket } from "@/shared/api/gameSocket";
import { SESSION_IDENTIFIER } from "@/shared/config/session";
import { useMultiplayerStore } from "@/shared/store/multiplayer";
import { usePlayerStore } from "@/entities/player/model/store";
import type { GameMessage } from "@/entities/player/model/player";
import type { PlayerStateMessage } from "re-world-shared";

export const useMultiplayerSync = (
  rigidBodyReference: React.RefObject<RapierRigidBody | null>,
  meshReference: React.RefObject<THREE.Mesh | null>,
) => {
  const { isServerConnected } = useMultiplayerStore();
  const {
    currentHealth,
    maxHealth,
    isMoving,
    isJumping,
    direction,
    equippedItems,
    isAiming,
    cameraMode,
  } = usePlayerStore();
  const lastUpdateTime = useRef(0);
  const lastPlayerStateUpdateTime = useRef(0);

  useFrame(({ clock }) => {
    const currentTime = clock.getElapsedTime();

    if (!isServerConnected || !rigidBodyReference.current || !meshReference.current) return;

    const gameWebsocket = getGameWebsocket();
    const position = rigidBodyReference.current.translation();
    const rotation = rigidBodyReference.current.rotation();

    if (currentTime - lastUpdateTime.current > 0.05) {
      const message: GameMessage = {
        identifier: SESSION_IDENTIFIER,
        position: { x: position.x, y: position.y, z: position.z },
        rotation: { x: rotation.x, y: rotation.y, z: rotation.z, w: rotation.w },
      };
      gameWebsocket.send(message);
      lastUpdateTime.current = currentTime;
    }

    if (currentTime - lastPlayerStateUpdateTime.current > 0.2) {
      const stateMessage: PlayerStateMessage = {
        type: "PLAYER_STATE",
        identifier: SESSION_IDENTIFIER,
        position: { x: position.x, y: position.y, z: position.z },
        rotation: { x: rotation.x, y: rotation.y, z: rotation.z, w: rotation.w },
        currentHealth,
        maxHealth,
        isMoving,
        isJumping,
        direction,
        equippedItems,
        isAiming,
        cameraMode,
      };
      gameWebsocket.send(stateMessage);
      lastPlayerStateUpdateTime.current = currentTime;
    }
  });

  return { sessionIdentifier: SESSION_IDENTIFIER };
};
