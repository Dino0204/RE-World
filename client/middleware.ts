import { NextRequest } from "next/server";

export const middleware = (request: NextRequest) => {
  if (request.nextUrl.pathname.startsWith("/lobby")) {
    const token = request.cookies.get("auth")?.value;

    if (!token && !request.url.includes("/lobby")) {
      const signInUrl = new URL("/lobby", request.url);
      return Response.redirect(signInUrl);
    }

    return;
  }
  // 데이터 요청 시 로그인 여부 검사
  // 로그인이 되어 있지 않다면 로비 페이지로 이동
};
