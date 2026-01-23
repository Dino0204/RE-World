import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { getGameWebsocket } from "@/shared/api/gameSocket";
import { SESSION_IDENTIFIER } from "@/shared/config/session";
import { useMultiplayerStore } from "@/shared/store/multiplayer";

export const useMultiplayerSync = (
  rigidBodyReference: React.RefObject<RapierRigidBody | null>,
  meshReference: React.RefObject<THREE.Mesh | null>,
) => {
  const { isServerConnected } = useMultiplayerStore();
  const lastUpdateTime = useRef(0);

  useFrame(({ clock }) => {
    const currentTime = clock.getElapsedTime();

    if (currentTime - lastUpdateTime.current > 0.05 && isServerConnected) {
      if (rigidBodyReference.current && meshReference.current) {
        const position = rigidBodyReference.current.translation();
        const rotation = rigidBodyReference.current.rotation();

        const gameWebsocket = getGameWebsocket();

        gameWebsocket.send({
          identifier: SESSION_IDENTIFIER,
          position: {
            x: position.x,
            y: position.y,
            z: position.z,
          },
          rotation: {
            x: rotation.x,
            y: rotation.y,
            z: rotation.z,
            w: rotation.w,
          },
        });

        lastUpdateTime.current = currentTime;
      }
    }
  });

  return { sessionIdentifier: SESSION_IDENTIFIER };
};
