import { useEffect } from "react";
import { useMultiplayerStore } from "@/entities/multi-player/model/multi-player.store";
import { useTargetStore } from "@/entities/target/model/target.store";
import { useSocketStore } from "@/shared/model/socket.store";
import OtherPlayer from "@/entities/multi-player/ui/multi-player";
import { SESSION_IDENTIFIER } from "@/shared/config/session";
import { useBulletStore } from "@/entities/bullet/model/bullet.store";
import { useImpactStore } from "@/entities/impact/model/impact.store";
import type { GameMessageUnion } from "re-world-shared";

export default function MultiplayerManager() {
  const {
    updatePlayer,
    updatePlayerFromAction,
    removePlayer,
    players,
    setServerConnected,
  } = useMultiplayerStore();

  const { gameWebsocket } = useSocketStore();

  useEffect(() => {
    if (!gameWebsocket) return;

    // 이 부분에서 isConnected 상태가 아닌 websocket 객체 자체의 이벤트를 사용할 것이므로
    // store의 isConnected를 사용하는 대신 직접 리스너를 확인하거나
    // 이미 store에서 open 이벤트를 처리하므로 여기서는 단순 연결 여부만 확인해도 됨.
    // 하지만 기존 로직을 최대한 유지하기 위해 websocket 객체에 직접 접근.

    gameWebsocket.ws.addEventListener("open", () => {
      setServerConnected(true);
    });

    // 이미 연결된 상태라면 바로 true로 설정
    if (gameWebsocket.ws.readyState === WebSocket.OPEN) {
      setServerConnected(true);
    }

    gameWebsocket.subscribe((websocketMessage) => {
      const data = websocketMessage.data as GameMessageUnion | undefined;
      if (!data || typeof data !== "object") return;

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
  }, [
    updatePlayer,
    updatePlayerFromAction,
    removePlayer,
    setServerConnected,
    gameWebsocket,
  ]);

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
