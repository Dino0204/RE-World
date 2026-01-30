import { useEffect } from "react";
import { useMultiplayerStore } from "@/shared/store/multiplayer";
import { useTargetStore } from "@/entities/target/model/store";
import { getGameWebsocket } from "@/shared/api/gameSocket";
import OtherPlayer from "@/entities/player/ui/OtherPlayer";
import { SESSION_IDENTIFIER } from "@/shared/config/session";
import { useBulletStore } from "@/entities/bullet/model/store";
import { useImpactStore } from "@/entities/impact/model/store";
import type { GameMessage } from "@/entities/player/model/player";
import type {
  GameMessageUnion,
  BulletMessage,
  ImpactMessage,
  WeaponMessage,
  TargetMessage,
  PlayerStateMessage,
  PlayerActionMessage,
  PlayerDisconnectMessage,
} from "re-world-shared";

export default function MultiplayerManager() {
  const { updatePlayer, updatePlayerFromAction, removePlayer, players, setServerConnected } =
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
        if (msg.playerId !== SESSION_IDENTIFIER) {
          useBulletStore.getState().addBulletFromRemote(msg.data);
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
        if (msg.playerId !== SESSION_IDENTIFIER) {
          updatePlayer(msg.playerId, { equippedItems: [msg.weapon] });
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
        if (msg.playerId !== SESSION_IDENTIFIER) {
          updatePlayer(msg.playerId, {
            playerId: msg.playerId,
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
        if (msg.playerId !== SESSION_IDENTIFIER) {
          updatePlayerFromAction(msg.playerId, msg.action);
        }
        return;
      }
      if ("type" in data && data.type === "PLAYER_DISCONNECT") {
        const msg = data as PlayerDisconnectMessage;
        if (msg.playerId !== SESSION_IDENTIFIER) {
          removePlayer(msg.playerId);
        }
        return;
      }

      const playerStateData = data as GameMessage;
      if ("playerId" in playerStateData && "position" in playerStateData) {
        const { playerId, position, rotation } = playerStateData;
        if (playerId !== SESSION_IDENTIFIER) {
          updatePlayer(playerId, { playerId, position, rotation });
        }
      }
    });
  }, [updatePlayer, updatePlayerFromAction, removePlayer, setServerConnected]);

  return (
    <>
      {Array.from(players.entries()).map(([playerId, state]) => (
        <OtherPlayer
          key={playerId}
          playerId={playerId}
          position={state.position}
          rotation={state.rotation}
          direction={state.direction}
          isJumping={state.isJumping}
          equippedItems={state.equippedItems}
          isAiming={state.isAiming}
          currentHealth={state.currentHealth}
          maxHealth={state.maxHealth}
        />
      ))}
    </>
  );
}
