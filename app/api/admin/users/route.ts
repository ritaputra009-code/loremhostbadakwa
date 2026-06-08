import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("app_users")
    .select("id,username,password,is_active,is_vip,duration_days,expires_at,created_at")
    .order("id", { ascending: false });

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ users: data || [] });
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const username = String(body.username || "").trim();
  const password = String(body.password || "").trim();
  const isActive = Boolean(body.isActive ?? true);
  const isVip = Boolean(body.isVip ?? false);
  const durationDays = Number(body.durationDays || 30);
  const expiresAt = body.expiresAt ? new Date(body.expiresAt).toISOString() : null;

  if (!username || !password) {
    return NextResponse.json({ message: "Username dan password wajib diisi" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("app_users")
    .insert({
      username,
      password,
      is_active: isActive,
      is_vip: isVip,
      duration_days: durationDays,
      expires_at: expiresAt
    })
    .select("id,username,password,is_active,is_vip,duration_days,expires_at,created_at")
    .single();

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ user: data });
}
