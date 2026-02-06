import { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/", "/lobby"];

export const middleware = (request: NextRequest) => {
  const { pathname } = new URL(request.url);

  // 퍼블릭 라우트가 아닌 경우 인증 토큰 확인
  if (!PUBLIC_ROUTES.some((route) => pathname === route)) {
    const token = request.cookies.get("auth")?.value;

    // 토큰이 없다면 로비 페이지로 리디렉션
    if (!token) {
      const signInUrl = new URL("/lobby", request.url);
      return Response.redirect(signInUrl);
    }

    return;
  }
};

export const config = {
  matcher: [
    /*
     * 다음으로 시작하는 경로를 제외한 모든 요청 경로를 매칭합니다:
     * - api (API 라우트)
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화 파일)
     * - favicon.ico (파비콘 파일)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|models).*)",
  ],
};
