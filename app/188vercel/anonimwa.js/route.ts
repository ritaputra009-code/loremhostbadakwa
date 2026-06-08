import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { mapForApk, type DbUser } from "@/lib/mapUser";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("app_users")
    .select("id,username,password,is_active,is_vip,duration_days,expires_at,created_at")
    .order("id", { ascending: false });

  if (error) {
    return NextResponse.json([], {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  const users = ((data || []) as DbUser[]).map(mapForApk);

  return NextResponse.json(users, {
    status: 200,
    headers: {
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
