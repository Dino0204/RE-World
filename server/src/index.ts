import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";

const getTimestamp = () => {
  return new Date().toLocaleTimeString("ko-KR");
};

export const app = new Elysia()
  .use(cors())
  .ws("/game", {
    body: t.Object({
      identifier: t.String(),
      position: t.Object({
        x: t.Number(),
        y: t.Number(),
        z: t.Number(),
      }),
      rotation: t.Object({
        x: t.Number(),
        y: t.Number(),
        z: t.Number(),
        w: t.Number(),
      }),
    }),
    open(websocket) {
      console.log(
        `[${getTimestamp()}] 게임 클라이언트 연결됨: ${websocket.id}`,
      );
      websocket.subscribe("global");
    },
    message(websocket, message) {
      websocket.publish("global", message);
    },
    close(websocket) {
      console.log(
        `[${getTimestamp()}] 게임 클라이언트 연결 종료됨: ${websocket.id}`,
      );
      websocket.unsubscribe("global");
    },
  })
  .listen(3001);

console.log(`[${getTimestamp()}] 🚀 서버가 포트 3001에서 실행 중입니다`);

export type App = typeof app;
