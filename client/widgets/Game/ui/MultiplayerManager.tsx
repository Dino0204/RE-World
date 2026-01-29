import { useEffect } from "react";
import { useMultiplayerStore } from "@/shared/store/multiplayer";
import { useTargetStore } from "@/shared/store/target";
import { getGameWebsocket } from "@/shared/api/gameSocket";
import OtherPlayer from "@/entities/player/ui/OtherPlayer";
import { SESSION_IDENTIFIER } from "@/shared/config/session";
import { useBulletStore } from "@/entities/bullet/model/store";
import { useImpactStore } from "@/entities/bullet/model/impactStore";
import type { GameMessage } from "@/entities/player/model/player";
import type {
  GameMessageUnion,
  BulletMessage,
  ImpactMessage,
  WeaponMessage,
  TargetMessage,
  PlayerStateMessage,
  PlayerActionMessage,
} from "re-world-shared";

export default function MultiplayerManager() {
  const { updatePlayer, updatePlayerFromAction, players, setServerConnected } =
    useMultiplayerStore();

  useEffect(() => {
    const websocket = getGameWebsocket();

    websocket.on("open", () => {
      setServerConnected(true);
    });

    websocket.subscribe((websocketMessage) => {
      const data = websocketMessage.data as GameMessageUnion | undefined;
      if (!data || typeof data !== "object") return;

      if ("type" in data && data.type === "BULLET") {
        const msg = data as BulletMessage;
        if (msg.identifier !== SESSION_IDENTIFIER) {
          useBulletStore.getState().addBullet(msg.data);
        }
        return;
      }
      if ("type" in data && data.type === "IMPACT") {
        const msg = data as ImpactMessage;
        useImpactStore.getState().addImpactFromRemote(msg.data);
        return;
      }
      if ("type" in data && data.type === "WEAPON") {
        const msg = data as WeaponMessage;
        if (msg.identifier !== SESSION_IDENTIFIER) {
          updatePlayer(msg.identifier, { equippedItems: [msg.weapon] });
        }
        return;
      }
      if ("type" in data && data.type === "TARGET") {
        const msg = data as TargetMessage;
        useTargetStore.getState().setTarget(msg.data.id, {
          currentHealth: msg.data.currentHealth,
          maxHealth: msg.data.maxHealth,
        });
        return;
      }
      if ("type" in data && data.type === "PLAYER_STATE") {
        const msg = data as PlayerStateMessage;
        if (msg.identifier !== SESSION_IDENTIFIER) {
          updatePlayer(msg.identifier, {
            identifier: msg.identifier,
            position: msg.position,
            rotation: msg.rotation,
            currentHealth: msg.currentHealth,
            maxHealth: msg.maxHealth,
            isMoving: msg.isMoving,
            isJumping: msg.isJumping,
            direction: msg.direction,
            equippedItems: msg.equippedItems,
            isAiming: msg.isAiming,
            cameraMode: msg.cameraMode,
          });
        }
        return;
      }
      if ("type" in data && data.type === "PLAYER_ACTION") {
        const msg = data as PlayerActionMessage;
        if (msg.identifier !== SESSION_IDENTIFIER) {
          updatePlayerFromAction(msg.identifier, msg.action);
        }
        return;
      }

      const playerStateData = data as GameMessage;
      if ("identifier" in playerStateData && "position" in playerStateData) {
        const { identifier, position, rotation } = playerStateData;
        if (identifier !== SESSION_IDENTIFIER) {
          updatePlayer(identifier, { identifier, position, rotation });
        }
      }
    });
  }, [updatePlayer, updatePlayerFromAction, setServerConnected]);

  return (
    <>
      {Array.from(players.entries()).map(([identifier, state]) => (
        <OtherPlayer
          key={identifier}
          position={state.position}
          rotation={state.rotation}
          direction={state.direction}
          isJumping={state.isJumping}
          equippedItems={state.equippedItems}
          isAiming={state.isAiming}
        />
      ))}
    </>
  );
}
