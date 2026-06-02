import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Admin route protection (Next.js 16 `proxy` convention — replaces the
 * deprecated `middleware` file).
 *
 * We deliberately do NOT use the NextAuth `auth()` wrapper: it auto-redirects
 * every matched, unauthenticated request to `pages.signIn` (/admin/login).
 * Since the login page lives under /admin, that produced an infinite 307 loop.
 *
 * Server-side protection also lives in `app/admin/(dashboard)/layout.tsx`
 * (the login page sits outside that route group). This proxy adds an
 * edge-level guard and the sign-in/sign-out redirect UX.
 */
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });
  const isLoggedIn = !!token;

  // Login page: always reachable when signed out; bounce to dashboard if in.
  if (pathname === "/admin/login") {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/admin", req.nextUrl));
    }
    return NextResponse.next();
  }

  // Every other /admin/* route requires a session.
  if (pathname.startsWith("/admin") && !isLoggedIn) {
    const loginUrl = new URL("/admin/login", req.nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
