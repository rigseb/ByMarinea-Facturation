import { NextResponse } from "next/server";

export function middleware(request) {

  const isLogged = request.cookies.get("auth")?.value === "true";

  // ✅ autoriser la page login
  if (request.nextUrl.pathname === "/login") {
    return NextResponse.next();
  }

  // ✅ si pas connecté → redirection
  if (!isLogged) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};