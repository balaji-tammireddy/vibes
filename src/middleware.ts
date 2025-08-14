import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath = 
    path === "/" ||
    path === "/login" ||
    path === "/register" ||
    path === "/verify" ||
    path === "/forgot-password" ||
    path === "/forgot-password/verify" ||
    path === "/forgot-password/reset";

  const token = request.cookies.get("token")?.value;

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/", 
    "/home",
    "/upload",
    "/messages/:path*",
    "/search/:path*",
    "/profile/:path*",
    "/login",
    "/register",
    "/verify",
    "/forgot-password",
    "/forgot-password/verify",
    "/forgot-password/reset",
  ],
};