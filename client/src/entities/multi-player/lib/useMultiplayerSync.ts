import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { useSocketStore } from "@/shared/model/socket.store";
import { SESSION_IDENTIFIER } from "@/shared/config/session";

import { usePlayerStore } from "@/entities/player/model/player.store";
import type { GameMessage } from "re-world-shared";
import type { PlayerStateMessage } from "re-world-shared";

export const useMultiplayerSync = (
  rigidBodyRef: React.RefObject<RapierRigidBody | null>,
  meshRef: React.RefObject<THREE.Mesh | null>,
) => {
  const { isConnected } = useSocketStore();
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

    if (!isConnected || !rigidBodyRef.current || !meshRef.current) return;

    const gameWebsocket = useSocketStore.getState().gameWebsocket;
    if (!gameWebsocket) return;

    const position = rigidBodyRef.current.translation();
    const rotation = rigidBodyRef.current.rotation();

    if (currentTime - lastUpdateTime.current > 0.05) {
      const message: GameMessage = {
        type: "GAME",
        playerId: SESSION_IDENTIFIER,
        position: { x: position.x, y: position.y, z: position.z },
        rotation: {
          x: rotation.x,
          y: rotation.y,
          z: rotation.z,
          w: rotation.w,
        },
      };
      gameWebsocket.send(message);
      lastUpdateTime.current = currentTime;
    }

    if (currentTime - lastPlayerStateUpdateTime.current > 0.2) {
      const stateMessage: PlayerStateMessage = {
        type: "PLAYER_STATE",
        playerId: SESSION_IDENTIFIER,
        position: { x: position.x, y: position.y, z: position.z },
        rotation: {
          x: rotation.x,
          y: rotation.y,
          z: rotation.z,
          w: rotation.w,
        },
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
