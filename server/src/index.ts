import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { jwt } from "@elysiajs/jwt";
import { GameMessageUnionSchema } from "re-world-shared/game";
import { ROOM_MAX_PLAYERS } from "re-world-shared/room";
import { joinRoom, leaveRoom, getPlayerRoomId } from "./entities/room/lib/room";
import openapi from "@elysiajs/openapi";
import { PrismaClient } from "../../prisma/generated/prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import cookie from "@elysiajs/cookie";

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL!,
}).$extends(withAccelerate());

const getTimestamp = () => {
  return new Date().toLocaleTimeString("ko-KR");
};

const playerIdentifiers = new Map<string, string>();

export const app = new Elysia()
  .use(
    cors({
      credentials: true,
    }),
  )
  .use(cookie())
  .use(openapi({ provider: "swagger-ui", path: "/swagger" }))
  .use(
    jwt({
      name: "jwt",
      secret:
        process.env.JWT_SECRET ||
        "your-super-secret-jwt-key-change-in-production",
    }),
  )
  .post(
    "/auth/google",
    async ({ body, jwt, cookie: { auth } }) => {
      const { code } = body;

      // 1. Google OAuth code를 access token으로 교환
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: process.env.GOOGLE_CLIENT_ID || "",
          client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
          redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
          grant_type: "authorization_code",
        }),
      });

      if (!tokenResponse.ok) {
        const error = await tokenResponse.text();
        console.error(`[${getTimestamp()}] Google 토큰 교환 실패:`, error);
        return { success: false, error: "토큰 교환 실패" };
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      // 2. Access token으로 사용자 정보 가져오기
      const userInfoResponse = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      if (!userInfoResponse.ok) {
        console.error(`[${getTimestamp()}] 사용자 정보 조회 실패`);
        return { success: false, error: "사용자 정보 조회 실패" };
      }

      const googleUser = await userInfoResponse.json();

      // 3. DB에 사용자 저장 (upsert)
      const user = await prisma.user.upsert({
        where: {
          googleId: googleUser.id,
        },
        update: {
          email: googleUser.email,
          name: googleUser.name,
          picture: googleUser.picture,
        },
        create: {
          googleId: googleUser.id,
          email: googleUser.email,
          name: googleUser.name,
          picture: googleUser.picture,
        },
      });

      // 4. JWT 토큰 생성
      const token = await jwt.sign({
        userId: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      });

      // 5. 쿠키에 JWT 토큰 설정
      auth.set({
        value: token,
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          picture: user.picture,
        },
      };
    },
    {
      body: t.Object({
        code: t.String(),
      }),
    },
  )
  .get("/auth/me", async ({ jwt, cookie: { auth }, set }) => {
    const payload = await jwt.verify(auth.value as string | undefined);
    if (!payload) {
      set.status = 401;
      return { success: false };
    }
    return {
      success: true,
      user: {
        id: payload.userId,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      },
    };
  })
  .get("auth/signout", ({ cookie: { auth } }) => {
    auth.remove();

    return { success: true };
  })
  .ws("/game", {
    open(websocket) {
      console.log(
        `[${getTimestamp()}] 게임 클라이언트 연결됨: ${websocket.id}`,
      );
      websocket.subscribe("global");
    },
    message(websocket, rawMessage) {
      // Zod로 메시지 파싱
      const result = GameMessageUnionSchema.safeParse(rawMessage);
      if (!result.success) {
        console.error(`[${getTimestamp()}] 잘못된 메시지:`, result.error);
        return;
      }
      const message = result.data;

      // 룸 참여 요청 처리
      if (message.type === "JOIN_ROOM") {
        const playerId = message.playerId;
        playerIdentifiers.set(websocket.id, playerId);

        const room = joinRoom(playerId);

        // 룸 채널 구독
        websocket.subscribe(room.id);

        // 참여 응답 전송
        websocket.send({
          type: "ROOM_JOINED",
          roomId: room.id,
          playerCount: room.players.size,
          maxPlayers: ROOM_MAX_PLAYERS,
          success: true,
        });

        // 룸 내 다른 플레이어들에게 새 플레이어 알림
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

      // 룸 내 메시지 브로드캐스트
      const playerId = playerIdentifiers.get(websocket.id);
      const roomId = playerId ? getPlayerRoomId(playerId) : undefined;

      if (roomId) {
        // 룸 내 플레이어들에게만 전송
        websocket.publish(roomId, message);
      } else {
        // 룸이 없으면 글로벌 채널로 전송 (하위 호환성)
        websocket.publish("global", message);
      }
    },
    close(websocket) {
      console.log(
        `[${getTimestamp()}] 게임 클라이언트 연결 종료됨: ${websocket.id}`,
      );
      const identifier = playerIdentifiers.get(websocket.id);
      if (identifier) {
        // 룸에서 플레이어 제거
        const result = leaveRoom(identifier);
        if (result) {
          // 룸 내 다른 플레이어들에게 퇴장 알림
          websocket.publish(result.room.id, {
            type: "ROOM_PLAYER_LEFT",
            roomId: result.room.id,
            playerId: identifier,
            playerCount: result.playerCount,
          });
        }

        // 글로벌 채널에도 연결 해제 알림 (하위 호환성)
        websocket.publish("global", {
          type: "PLAYER_DISCONNECT",
          playerId: identifier,
        });
        playerIdentifiers.delete(websocket.id);
      }
      websocket.unsubscribe("global");
    },
  })
  .listen(3001);

console.log(`[${getTimestamp()}] 🚀 서버가 포트 3001에서 실행 중입니다`);

export type App = typeof app;
