// middleware.js
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Routes you want to protect
const PROTECTED_ROUTES = ["/"]; // protect homepage

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;

  // Check if the request path is protected
  if (PROTECTED_ROUTES.some((p) => req.nextUrl.pathname.startsWith(p))) {
    if (!token) {
      // No token → redirect to signin
      const url = req.nextUrl.clone();
      url.pathname = "/signin";
      return NextResponse.redirect(url);
    }

    try {
      // Verify JWT
      await jwtVerify(token, new TextEncoder().encode("sanauaransari"));
      return NextResponse.next(); // token valid → allow
    } catch (err) {
      // Invalid token → redirect to signin
      const url = req.nextUrl.clone();
      url.pathname = "/signin";
      return NextResponse.redirect(url);
    }
  }

  // Not a protected route → continue normally
  return NextResponse.next();
}
