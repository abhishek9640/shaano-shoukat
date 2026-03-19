import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;
  const isAdmin = req.auth?.user?.role === "admin";

  // Protected user routes
  const protectedRoutes = ["/profile", "/checkout"];
  const isProtected = protectedRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  if (isProtected && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // Admin routes
  if (nextUrl.pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  // Redirect logged-in users away from auth pages
  if (
    isAuthenticated &&
    (nextUrl.pathname === "/login" || nextUrl.pathname === "/signup")
  ) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/profile/:path*",
    "/checkout/:path*",
    "/login",
    "/signup",
  ],
};
