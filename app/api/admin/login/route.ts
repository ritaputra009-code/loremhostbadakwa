import { NextResponse } from "next/server";
import { makeToken, setAdminCookie } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const username = String(body.username || "");
  const password = String(body.password || "");

  const adminUser = process.env.ADMIN_USERNAME || "admin";
  const adminPass = process.env.ADMIN_PASSWORD || "lrmhstzz123";

  if (username !== adminUser || password !== adminPass) {
    return NextResponse.json({ ok: false, message: "Login admin salah" }, { status: 401 });
  }

  await setAdminCookie(makeToken());
  return NextResponse.json({ ok: true });
}
