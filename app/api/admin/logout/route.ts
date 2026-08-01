import { NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/auth";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/admin", request.url));
  response.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return response;
}
