import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { useSocketStore } from "@/shared/model/socket.store";
import { SESSION_IDENTIFIER } from "@/shared/config/session";

import { usePlayerStore } from "@/entities/player/model/player.store";
import { GameMessage } from "re-world-shared/game";
import { PlayerStateMessage } from "re-world-shared/player";

export const useMultiplayerSync = (
  rigidBodyRef: React.RefObject<RapierRigidBody | null>,
  meshRef: React.RefObject<THREE.Group | null>,
) => {
  const { isConnected } = useSocketStore();
  const {
    currentHealth,
    maxHealth,
    isJumping,
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
    const { x: rx, y: ry, z: rz, w: rw } = meshRef.current.quaternion;

    if (currentTime - lastUpdateTime.current > 0.05) {
      const message: GameMessage = {
        type: "GAME",
        playerId: SESSION_IDENTIFIER,
        position: { x: position.x, y: position.y, z: position.z },
        rotation: { x: rx, y: ry, z: rz, w: rw },
      };
      gameWebsocket.send(message);
      lastUpdateTime.current = currentTime;
    }

    if (currentTime - lastPlayerStateUpdateTime.current > 0.2) {
      const stateMessage: PlayerStateMessage = {
        type: "PLAYER_STATE",
        playerId: SESSION_IDENTIFIER,
        position: { x: position.x, y: position.y, z: position.z },
        rotation: { x: rx, y: ry, z: rz, w: rw },
        currentHealth,
        maxHealth,
        isJumping,
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
