import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import cookie from "@elysiajs/cookie";
import { prisma } from "../../shared/prisma";

const getTimestamp = () => new Date().toLocaleTimeString("ko-KR");

export const authRouter = new Elysia({ prefix: "/auth" })
  .use(cookie())
  .use(
    jwt({
      name: "jwt",
      secret:
        process.env.JWT_SECRET ||
        "your-super-secret-jwt-key-change-in-production",
    }),
  )
  .post(
    "/google",
    async ({ body, jwt, cookie: { auth } }) => {
      const { code } = body;

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

      const user = await prisma.user.upsert({
        where: { googleId: googleUser.id },
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

      const token = await jwt.sign({
        userId: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      });

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
  .get("/me", async ({ jwt, cookie: { auth }, set }) => {
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
  .get("/signout", ({ cookie: { auth } }) => {
    auth.remove();
    return { success: true };
  });
