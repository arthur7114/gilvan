import { NextResponse } from "next/server";
import { ADMIN_COOKIE, ADMIN_MAX_AGE, createAdminToken, verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  if (!verifyPassword(String(body.password ?? ""))) {
    return NextResponse.json({ error: "Senha incorreta." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, createAdminToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_MAX_AGE,
  });
  return response;
}
