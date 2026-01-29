import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import Providers from "./providers";
import AppNav from "@/components/AppNav";
import RoutePrefetch from "@/components/RoutePrefetch";
import UserMenu from "@/components/UserMenu";

export const metadata: Metadata = {
  title: "HomeSchoolLink · 过程性评价平台",
  description: "面向教师与园所的过程性评价工作台，支持观察记录、指标对照与家园共育闭环。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen text-slate-900">
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute -right-20 -top-40 h-[520px] w-[520px] rounded-full bg-gradient-to-br from-cyan-200/50 via-white/20 to-emerald-200/40 blur-3xl" />
          <div className="absolute -left-40 bottom-[-160px] h-[520px] w-[520px] rounded-full bg-gradient-to-br from-amber-200/40 via-white/10 to-sky-200/40 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:36px_36px] opacity-60" />
        </div>

        <Providers>
          <RoutePrefetch />
          <div className="min-h-screen md:flex">
            <AppNav />

            <main className="flex-1">
              <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/70 backdrop-blur">
                <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-emerald-400 text-white">
                      H
                    </div>
                    <div>
                      <div className="text-sm font-semibold tracking-wide">HomeSchoolLink</div>
                      <div className="text-xs text-slate-500">证据 → 对照 → 汇总 → 反思 → 共育</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
                      可上线原型
                    </span>
                    <Link
                      href="/observations/new"
                      className="rounded-full border border-slate-900 bg-slate-900 px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-slate-800"
                    >
                      新建观察
                    </Link>
                    <UserMenu />
                  </div>
                </div>
                <AppNav variant="mobile" />
              </header>

              <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>

              <footer className="border-t border-slate-200/70 bg-white/70">
                <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-slate-500">
                  © {new Date().getFullYear()} HomeSchoolLink · 可上线版本草案
                </div>
              </footer>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
