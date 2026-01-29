import { useEffect } from "react";
import { useMultiplayerStore } from "@/shared/store/multiplayer";
import { getGameWebsocket } from "@/shared/api/gameSocket";
import OtherPlayer from "@/entities/player/ui/OtherPlayer";
import { SESSION_IDENTIFIER } from "@/shared/config/session";
import type { GameMessage } from "@/entities/player/model/player";

export default function MultiplayerManager() {
  const { updatePlayer, players, setServerConnected } = useMultiplayerStore();

  useEffect(() => {
    const websocket = getGameWebsocket();

    websocket.on("open", () => {
      setServerConnected(true);
    });

    websocket.subscribe((websocketMessage) => {
      const playerStateData = websocketMessage.data as GameMessage | undefined;

      if (
        playerStateData &&
        typeof playerStateData === "object" &&
        "identifier" in playerStateData
      ) {
        const { identifier, position, rotation } = playerStateData;
        if (identifier !== SESSION_IDENTIFIER) {
          updatePlayer(identifier, { identifier, position, rotation });
        }
      }
    });
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
