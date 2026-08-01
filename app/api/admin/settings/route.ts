import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { updatePixelId } from "@/lib/db";
import { pixelSchema } from "@/lib/validation";

export async function PUT(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Acesso não autorizado." }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const parsed = pixelSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  await updatePixelId(parsed.data.pixelId);
  return NextResponse.json({ ok: true });
}
