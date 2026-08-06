import { NextResponse } from "next/server";
import { auth } from "@/auth";

const AUTH_PAGES = ["/login", "/register"];
const PROTECTED_PREFIXES = ["/dashboard", "/tickets", "/staff", "/admin"];
const STAFF_ROLES = ["IT_STAFF", "ADMIN"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthed = !!req.auth?.user;
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (!isAuthed && isProtected) {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (
    isAuthed &&
    pathname.startsWith("/staff") &&
    !STAFF_ROLES.includes(req.auth!.user.role)
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  if (
    isAuthed &&
    pathname.startsWith("/admin") &&
    req.auth!.user.role !== "ADMIN"
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  if (isAuthed && AUTH_PAGES.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/tickets/:path*",
    "/staff/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
