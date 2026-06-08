import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";

const COOKIE_NAME = "admin_token";

function secret() {
  return process.env.ADMIN_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "lrmhstzz-secret";
}

function sign(data: string) {
  return crypto.createHmac("sha256", secret()).update(data).digest("hex");
}

export function makeToken(username = process.env.ADMIN_USERNAME || "admin") {
  const payload = Buffer.from(
    JSON.stringify({
      username,
      time: Date.now(),
    })
  ).toString("base64url");

  return `${payload}.${sign(payload)}`;
}

export function verifyToken(token?: string | null) {
  if (!token || !token.includes(".")) return false;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  return sign(payload) === signature;
}

export function setAdminCookie(...args: any[]) {
  const response =
    args.find((arg) => arg && arg.cookies && typeof arg.cookies.set === "function") ||
    NextResponse.json({ ok: true });

  const token =
    args.find((arg) => typeof arg === "string") ||
    makeToken();

  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}

export function clearAdminCookie(...args: any[]) {
  const response =
    args.find((arg) => arg && arg.cookies && typeof arg.cookies.set === "function") ||
    NextResponse.json({ ok: true });

  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}

export async function isAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return verifyToken(token);
}
