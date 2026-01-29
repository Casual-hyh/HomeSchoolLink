"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function UserMenu() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!supabase) return;
      const { data } = await supabase.auth.getUser();
      if (active) setEmail(data.user?.email ?? null);
    }

    load();

    const { data: sub } = supabase
      ? supabase.auth.onAuthStateChange((_event, session) => {
          setEmail(session?.user?.email ?? null);
        })
      : { data: { subscription: null } };

    return () => {
      active = false;
      sub?.subscription?.unsubscribe();
    };
  }, []);

  async function signOut() {
    if (!supabase) {
      router.push("/login");
      return;
    }
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (!email) {
    return (
      <button
        className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
        onClick={() => router.push("/login")}
      >
        去登录
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="hidden sm:inline text-xs text-slate-500">当前账号</span>
      <span className="max-w-[160px] truncate rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
        {email}
      </span>
      <button
        className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
        onClick={signOut}
      >
        退出
      </button>
    </div>
  );
}
