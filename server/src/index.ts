import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { GameMessageUnionSchema } from "re-world-shared";

const getTimestamp = () => {
  return new Date().toLocaleTimeString("ko-KR");
};

const playerIdentifiers = new Map<string, string>();

export const app = new Elysia()
  .use(cors())
  .ws("/game", {
    body: GameMessageUnionSchema,
    open(websocket) {
      console.log(
        `[${getTimestamp()}] 게임 클라이언트 연결됨: ${websocket.id}`,
      );
      websocket.subscribe("global");
    },
    message(websocket, message) {
      if ("identifier" in message && typeof message.identifier === "string") {
        playerIdentifiers.set(websocket.id, message.identifier);
      }
      websocket.publish("global", message);
    },
    close(websocket) {
      console.log(
        `[${getTimestamp()}] 게임 클라이언트 연결 종료됨: ${websocket.id}`,
      );
      const identifier = playerIdentifiers.get(websocket.id);
      if (identifier) {
        websocket.publish("global", {
          type: "PLAYER_DISCONNECT",
          identifier,
        });
        playerIdentifiers.delete(websocket.id);
      }
      websocket.unsubscribe("global");
    },
  })
  .listen(3001);

console.log(`[${getTimestamp()}] 🚀 서버가 포트 3001에서 실행 중입니다`);

export type App = typeof app;
