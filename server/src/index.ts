import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";

const getTimestamp = () => {
  return new Date().toLocaleTimeString("ko-KR");
};

const app = new Elysia()
  .use(cors())
  .ws("/chat", {
    body: t.String(),
    response: t.String(),
    message(ws, message) {
      console.log(`[${getTimestamp()}] 메시지 수신: ${message}`);
      ws.send(message);
    },
    open(ws) {
      console.log(`[${getTimestamp()}] 클라이언트 연결됨`);
    },
    close(ws) {
      console.log(`[${getTimestamp()}] 클라이언트 연결 종료됨`);
    },
  })
  .listen(3001);

console.log(`[${getTimestamp()}] 🚀 서버가 포트 3001에서 실행 중입니다`);

export type App = typeof app;
