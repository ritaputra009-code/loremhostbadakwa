import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "lrmhstzz_admin_session";

function secret() {
  return process.env.ADMIN_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "change-this-secret";
}

function b64url(input: Buffer | string) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function sign(data: string) {
  return b64url(crypto.createHmac("sha256", secret()).update(data).digest());
}

export function makeToken() {
  const payload = b64url(JSON.stringify({ exp: Date.now() + 1000 * 60 * 60 * 8 }));
  return `${payload}.${sign(payload)}`;
}

export function verifyToken(token?: string) {
  if (!token || !token.includes(".")) return false;
  const [payload, sig] = token.split(".");
  if (sign(payload) !== sig) return false;

  try {
    const json = JSON.parse(Buffer.from(payload.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8"));
    return typeof json.exp === "number" && json.exp > Date.now();
  } catch {
    return false;
  }
}

export async function isAdmin() {
  const cookieStore = await cookies();
  return verifyToken(cookieStore.get(COOKIE_NAME)?.value);
}

export async function setAdminCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 8
  });
}

export async function clearAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 0
  });
}
