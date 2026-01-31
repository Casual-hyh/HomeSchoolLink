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
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    async function check() {
      if (isPublic(pathname)) {
        if (!cancelled) setChecking(false);
        return;
      }

      if (!supabase) {
        if (!cancelled) setChecking(false);
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

    if (!isPublic(pathname)) {
      timeoutId = setTimeout(() => {
        if (!cancelled) setChecking(false);
      }, 2000);
    }

    const { data: sub } = supabase
      ? supabase.auth.onAuthStateChange((_event, session) => {
          if (session) {
            setAuthed(true);
            setChecking(false);
            return;
          }
          if (!isPublic(pathname)) {
            setAuthed(false);
            setChecking(false);
            const next = encodeURIComponent(pathname);
            router.replace(`/login?next=${next}`);
          }
        })
      : { data: { subscription: null } };

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
      sub?.subscription?.unsubscribe();
    };
  }, [pathname, router]);

  if (isPublic(pathname)) return <>{children}</>;

  if (checking) {
    return (
      <div className="min-h-screen grid place-items-center text-sm text-slate-500">
        正在校验登录状态...
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen grid place-items-center text-sm text-slate-500">
        未登录，正在跳转...
      </div>
    );
  }

  return <>{children}</>;
}
