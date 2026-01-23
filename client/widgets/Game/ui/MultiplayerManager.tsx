import { useEffect } from "react";
import { useMultiplayerStore } from "@/shared/store/multiplayer";
import { getGameWebsocket } from "@/shared/api/gameSocket";
import OtherPlayer from "@/entities/player/ui/OtherPlayer";
import { SESSION_IDENTIFIER } from "@/shared/config/session";

export default function MultiplayerManager() {
  const { updatePlayer, players, setServerConnected } = useMultiplayerStore();

  useEffect(() => {
    const websocket = getGameWebsocket();

    const connectionCheckInterval = setInterval(() => {
      // Eden Treaty는 내부적으로 소켓을 열기 때문에 수동 체크
      setServerConnected(true);
      clearInterval(connectionCheckInterval);
    }, 500);

    websocket.subscribe((websocketMessage) => {
      const playerStateData = websocketMessage.data;

      if (
        playerStateData &&
        typeof playerStateData === "object" &&
        "identifier" in playerStateData
      ) {
        const { identifier, position, rotation } = playerStateData as {
          identifier: string;
          position: { x: number; y: number; z: number };
          rotation: { x: number; y: number; z: number; w: number };
        };
        if (identifier !== SESSION_IDENTIFIER) {
          updatePlayer(identifier, {
            identifier,
            position,
            rotation,
          });
        }
      }
    });

    return () => {
      clearInterval(connectionCheckInterval);
    };
  }, [updatePlayer, setServerConnected]);

  return (
    <>
      {Array.from(players.entries()).map(([identifier, state]) => (
        <OtherPlayer
          key={identifier}
          position={state.position}
          rotation={state.rotation}
        />
      ))}
    </>
  );
}
