// // middleware.js
// import { NextResponse } from "next/server";
// import { jwtVerify } from "jose";

// // Routes you want to protect
// const PROTECTED_ROUTES = ["/"]; // protect homepage

// export async function middleware(req) {
//   const token = req.cookies.get("token")?.value;

//   // Check if the request path is protected
//   if (PROTECTED_ROUTES.some((p) => req.nextUrl.pathname.startsWith(p))) {
//     if (!token) {
//       // No token → redirect to signin
//       const url = req.nextUrl.clone();
//       url.pathname = "/signin";
//       return NextResponse.redirect(url);
//     }

//     try {
//       // Verify JWT
//       await jwtVerify(token, new TextEncoder().encode("sanauaransari"));
//       return NextResponse.next(); // token valid → allow
//     } catch (err) {
//       // Invalid token → redirect to signin
//       const url = req.nextUrl.clone();
//       url.pathname = "/signin";
//       return NextResponse.redirect(url);
//     }
//   }

//   // Not a protected route → continue normally
//   return NextResponse.next();
// }



// middleware.js
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Protect only the routes you want
const PROTECTED_ROUTES = ["/"]; // your homepage

// Public routes (signin/signup)
const PUBLIC_ROUTES = ["/signin", "/signup", "/_next/"];

export async function middleware(req) {
  const path = req.nextUrl.pathname;

  // Skip public routes
  if (PUBLIC_ROUTES.some(route => path.startsWith(route))) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  if (PROTECTED_ROUTES.some((p) => path.startsWith(p))) {
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/signin";
      return NextResponse.redirect(url);
    }

    try {
      await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
      return NextResponse.next();
    } catch (err) {
      const url = req.nextUrl.clone();
      url.pathname = "/signin";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}
