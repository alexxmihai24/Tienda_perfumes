import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * NextAuth v5 middleware wrapper.
 *
 * Protects all /admin/* routes except /admin/login.
 * Unauthenticated requests are redirected to /admin/login.
 * Already-authenticated users visiting /admin/login are redirected to /admin.
 */
export default auth(function middleware(req) {
  const { pathname } = req.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";
  const isAuthenticated = !!req.auth;

  // Protect all /admin/* routes except the login page itself
  if (isAdminRoute && !isLoginPage && !isAuthenticated) {
    const loginUrl = new URL("/admin/login", req.url);
    // Preserve intended destination for post-login redirect
    loginUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from the login page
  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all /admin/* paths.
     * Explicitly exclude:
     *  - Static files (_next/static, _next/image, public assets)
     *  - The NextAuth API route itself (handled separately)
     * The regex avoids the trailing slash-only path so / is never matched.
     */
    "/admin/:path*",
  ],
};
