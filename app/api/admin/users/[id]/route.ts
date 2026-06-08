import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  if (!(await isAdmin())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const update: Record<string, unknown> = {};

  if (body.username !== undefined) update.username = String(body.username).trim();
  if (body.password !== undefined) update.password = String(body.password).trim();
  if (body.isActive !== undefined) update.is_active = Boolean(body.isActive);
  if (body.isVip !== undefined) update.is_vip = Boolean(body.isVip);
  if (body.durationDays !== undefined) update.duration_days = Number(body.durationDays || 30);
  if (body.expiresAt !== undefined) update.expires_at = body.expiresAt ? new Date(body.expiresAt).toISOString() : null;

  const { data, error } = await supabaseAdmin()
    .from("app_users")
    .update(update)
    .eq("id", id)
    .select("id,username,password,is_active,is_vip,duration_days,expires_at,created_at")
    .single();

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ user: data });
}

export async function DELETE(_req: Request, { params }: Params) {
  if (!(await isAdmin())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { error } = await supabaseAdmin().from("app_users").delete().eq("id", id);
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
