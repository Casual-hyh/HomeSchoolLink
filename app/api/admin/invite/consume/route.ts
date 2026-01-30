import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function required(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();
    if (!email || !code) {
      return NextResponse.json("email and code required", { status: 400 });
    }

    const url = required("NEXT_PUBLIC_SUPABASE_URL");
    const serviceKey = required("SUPABASE_SERVICE_ROLE_KEY");

    const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

    const { data: invite, error: fetchError } = await admin
      .from("admin_invites")
      .select("code, expires_at, used_at")
      .eq("code", code)
      .single();

    if (fetchError || !invite) {
      return NextResponse.json("invalid invite", { status: 404 });
    }

    if (invite.used_at) {
      return NextResponse.json("invite already used", { status: 410 });
    }

    if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
      return NextResponse.json("invite expired", { status: 410 });
    }

    const { error: updateError } = await admin
      .from("admin_invites")
      .update({ used_at: new Date().toISOString(), used_by_email: email })
      .eq("code", code);

    if (updateError) {
      return NextResponse.json(updateError.message, { status: 500 });
    }

    await admin.from("admin_allowlist").upsert({ email });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json((error as Error).message, { status: 500 });
  }
}
