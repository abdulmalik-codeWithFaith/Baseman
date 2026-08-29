import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

// Uses ONLY the Edge-safe config (no Prisma, no bcrypt) — this is what
// makes middleware able to run without crashing the Edge Runtime build.
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isEmployerRoute = [
    "/employers/dashboard",
    "/employers/listings",
    "/employers/post",
    "/employers/settings",
  ].some((p) => nextUrl.pathname.startsWith(p));
  const isSeekerRoute = ["/dashboard", "/applications", "/saved", "/settings"].some((p) =>
    nextUrl.pathname.startsWith(p)
  );

  if (isAdminRoute && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }
  if (isEmployerRoute && role !== "EMPLOYER") {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }
  if (isSeekerRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/employers/dashboard/:path*",
    "/employers/listings/:path*",
    "/employers/post/:path*",
    "/employers/settings/:path*",
    "/dashboard/:path*",
    "/applications/:path*",
    "/saved/:path*",
    "/settings/:path*",
  ],
};