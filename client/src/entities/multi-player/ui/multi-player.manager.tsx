import { useEffect } from "react";
import { useMultiplayerStore } from "@/entities/multi-player/model/multi-player.store";
import { useTargetStore } from "@/entities/target/model/target.store";
import { useSocketStore } from "@/shared/model/socket.store";
import OtherPlayer from "@/entities/multi-player/ui/multi-player";
import { SESSION_IDENTIFIER } from "@/shared/config/session";
import { useBulletStore } from "@/entities/bullet/model/bullet.store";
import { useImpactStore } from "@/entities/impact/model/impact.store";
import { GameMessageUnionSchema } from "re-world-shared/game";

export default function MultiplayerManager() {
  const { updatePlayer, updatePlayerFromAction, removePlayer, players } =
    useMultiplayerStore();

  const { gameWebsocket } = useSocketStore();

  useEffect(() => {
    if (!gameWebsocket) return;

    gameWebsocket.subscribe((websocketMessage) => {
      const result = GameMessageUnionSchema.safeParse(websocketMessage.data);
      if (!result.success) return;
      const data = result.data;

      switch (data.type) {
        case "BULLET": {
          if (data.playerId !== SESSION_IDENTIFIER) {
            useBulletStore.getState().addBulletFromRemote(data.data);
          }
          break;
        }
        case "IMPACT": {
          useImpactStore.getState().addImpactFromRemote(data.data);
          break;
        }
        case "WEAPON": {
          if (data.playerId !== SESSION_IDENTIFIER) {
            updatePlayer(data.playerId, { equippedItems: [data.weapon] });
          }
          break;
        }
        case "TARGET": {
          useTargetStore.getState().setTarget(data.data.id, {
            currentHealth: data.data.currentHealth,
            maxHealth: data.data.maxHealth,
          });
          break;
        }
        case "PLAYER_STATE": {
          if (data.playerId !== SESSION_IDENTIFIER) {
            updatePlayer(data.playerId, {
              playerId: data.playerId,
              position: data.position,
              rotation: data.rotation,
              currentHealth: data.currentHealth,
              maxHealth: data.maxHealth,
              isMoving: data.isMoving,
              isJumping: data.isJumping,
              direction: data.direction,
              equippedItems: data.equippedItems,
              isAiming: data.isAiming,
              cameraMode: data.cameraMode,
            });
          }
          break;
        }
        case "PLAYER_ACTION": {
          if (data.playerId !== SESSION_IDENTIFIER) {
            updatePlayerFromAction(data.playerId, data.action);
          }
          break;
        }
        case "PLAYER_DISCONNECT": {
          if (data.playerId !== SESSION_IDENTIFIER) {
            removePlayer(data.playerId);
          }
          break;
        }
        default: {
          if ("playerId" in data && "position" in data) {
            const { playerId, position, rotation } = data;
            if (playerId !== SESSION_IDENTIFIER) {
              updatePlayer(playerId, { playerId, position, rotation });
            }
          }
        }
      }
    });
  }, [updatePlayer, updatePlayerFromAction, removePlayer, gameWebsocket]);

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
