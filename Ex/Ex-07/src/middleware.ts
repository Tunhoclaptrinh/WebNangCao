import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "@/auth.config";
import { routeAccess } from "@/features/auth/permissions";
const { auth } = NextAuth(authConfig);
export default auth((request) => {
  const result = routeAccess(request.nextUrl.pathname, request.auth?.user.role);
  if (result === "login") {
    const url = new URL("/login", request.nextUrl);
    url.searchParams.set(
      "callbackUrl",
      request.nextUrl.pathname + request.nextUrl.search,
    );
    return NextResponse.redirect(url);
  }
  if (result === "forbidden")
    return NextResponse.redirect(new URL("/403", request.nextUrl));
  return NextResponse.next();
});
export const config = {
  runtime: "nodejs",
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
