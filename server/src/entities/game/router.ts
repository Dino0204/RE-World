import { Elysia } from "elysia";
import { GameMessageUnionSchema } from "re-world-shared/game";
import { ROOM_MAX_PLAYERS } from "re-world-shared/room";
import { joinRoom, leaveRoom, getPlayerRoomId } from "../room/lib/room";

const getTimestamp = () => new Date().toLocaleTimeString("ko-KR");

const playerIdentifiers = new Map<string, string>();

export const gameRouter = new Elysia().ws("/game", {
  open(websocket) {
    console.log(`[${getTimestamp()}] 게임 클라이언트 연결됨: ${websocket.id}`);
    websocket.subscribe("global");
  },
  message(websocket, rawMessage) {
    const result = GameMessageUnionSchema.safeParse(rawMessage);
    if (!result.success) {
      console.error(`[${getTimestamp()}] 잘못된 메시지:`, result.error);
      return;
    }
    const message = result.data;

    if (message.type === "JOIN_ROOM") {
      const playerId = message.playerId;
      playerIdentifiers.set(websocket.id, playerId);

      const room = joinRoom(playerId);

      websocket.subscribe(room.id);

      websocket.send({
        type: "ROOM_JOINED",
        roomId: room.id,
        playerCount: room.players.size,
        maxPlayers: ROOM_MAX_PLAYERS,
        success: true,
      });

      websocket.publish(room.id, {
        type: "ROOM_PLAYER_JOINED",
        roomId: room.id,
        playerId,
        playerCount: room.players.size,
      });

      console.log(
        `[${getTimestamp()}] 플레이어 ${playerId}가 룸 ${room.id}에 입장 완료`,
      );
      return;
    }

    if ("identifier" in message && typeof message.identifier === "string") {
      playerIdentifiers.set(websocket.id, message.identifier);
    }

    const playerId = playerIdentifiers.get(websocket.id);
    const roomId = playerId ? getPlayerRoomId(playerId) : undefined;

    if (roomId) {
      websocket.publish(roomId, message);
    } else {
      websocket.publish("global", message);
    }
  },
  close(websocket) {
    console.log(
      `[${getTimestamp()}] 게임 클라이언트 연결 종료됨: ${websocket.id}`,
    );
    const identifier = playerIdentifiers.get(websocket.id);
    if (identifier) {
      const result = leaveRoom(identifier);
      if (result) {
        websocket.publish(result.room.id, {
          type: "ROOM_PLAYER_LEFT",
          roomId: result.room.id,
          playerId: identifier,
          playerCount: result.playerCount,
        });
      }

      websocket.publish("global", {
        type: "PLAYER_DISCONNECT",
        playerId: identifier,
      });
      playerIdentifiers.delete(websocket.id);
    }
    websocket.unsubscribe("global");
  },
});
