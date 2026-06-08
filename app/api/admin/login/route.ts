import { NextResponse } from "next/server";
import { makeToken } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  const username = String(body.username || "");
  const password = String(body.password || "");

  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "lrmhstzz123";

  if (username !== adminUsername || password !== adminPassword) {
    return NextResponse.json(
      { ok: false, message: "Username atau password salah" },
      { status: 401 }
    );
  }

  const token = makeToken(username);

  const res = NextResponse.json({
    ok: true,
    message: "Login berhasil",
  });

  res.cookies.set("admin_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
