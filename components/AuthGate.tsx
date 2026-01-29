"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const publicRoutes = new Set<string>(["/", "/login", "/auth/callback"]);

function isPublic(pathname: string) {
  if (publicRoutes.has(pathname)) return true;
  return pathname.startsWith("/_next") || pathname.startsWith("/favicon") || pathname.startsWith("/api");
}

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;

    async function check() {
      if (!supabase || isPublic(pathname)) {
        if (active) setChecking(false);
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        const next = encodeURIComponent(pathname);
        router.replace(`/login?next=${next}`);
        return;
      }

      if (active) setChecking(false);
    }

    check();

    const { data: sub } = supabase
      ? supabase.auth.onAuthStateChange((_event, session) => {
          if (!session && !isPublic(pathname)) {
            const next = encodeURIComponent(pathname);
            router.replace(`/login?next=${next}`);
          }
        })
      : { data: { subscription: null } };

    return () => {
      active = false;
      sub?.subscription?.unsubscribe();
    };
  }, [pathname, router]);

  if (checking && !isPublic(pathname)) {
    return (
      <div className="min-h-screen grid place-items-center text-sm text-slate-500">
        正在校验登录状态...
      </div>
    );
  }

  return <>{children}</>;
}
