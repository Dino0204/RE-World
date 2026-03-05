import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import openapi from "@elysiajs/openapi";
import { authRouter } from "./entities/auth/router";
import { gameRouter } from "./entities/game/router";

const getTimestamp = () => new Date().toLocaleTimeString("ko-KR");

export const app = new Elysia()
  .use(cors({ credentials: true }))
  .use(openapi({ provider: "swagger-ui", path: "/swagger" }))
  .use(authRouter)
  .use(gameRouter)
  .listen(3001);

console.log(`[${getTimestamp()}] 🚀 서버가 포트 3001에서 실행 중입니다`);

export type App = typeof app;
