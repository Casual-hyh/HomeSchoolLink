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
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      if (isPublic(pathname)) {
        setChecking(false);
        return;
      }

      if (!supabase) {
        setAuthed(false);
        setChecking(false);
        const next = encodeURIComponent(pathname);
        router.replace(`/login?next=${next}`);
        return;
      }

      try {
        const { data, error } = await supabase.auth.getSession();
        if (cancelled) return;
        if (error || !data.session) {
          setAuthed(false);
          setChecking(false);
          const next = encodeURIComponent(pathname);
          router.replace(`/login?next=${next}`);
          return;
        }

        setAuthed(true);
        setChecking(false);
      } catch {
        if (!cancelled) {
          setAuthed(false);
          setChecking(false);
        }
      }
    }

    check();

    const { data: sub } = supabase
      ? supabase.auth.onAuthStateChange((_event, session) => {
          if (!session && !isPublic(pathname)) {
            setAuthed(false);
            const next = encodeURIComponent(pathname);
            router.replace(`/login?next=${next}`);
            return;
          }
          if (session) setAuthed(true);
        })
      : { data: { subscription: null } };

    return () => {
      cancelled = true;
      sub?.subscription?.unsubscribe();
    };
  }, [pathname, router]);

  if (!isPublic(pathname) && (checking || !authed)) {
    return (
      <div className="min-h-screen grid place-items-center text-sm text-slate-500">
        正在校验登录状态...
      </div>
    );
  }

  return <>{children}</>;
}
