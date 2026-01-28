import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "HomeSchoolLink",
  description: "Early childhood formative assessment web app",
};

const nav = [
  { href: "/dashboard", label: "总览" },
  { href: "/children", label: "幼儿档案" },
  { href: "/observations", label: "观察记录" },
  { href: "/reports", label: "成长报告" },
  { href: "/family", label: "家园共育" },
  { href: "/settings/indicators", label: "指标库" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body
        style={{
          fontFamily:
            'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
        }}
        className="min-h-screen bg-zinc-50 text-zinc-900"
      >
        <Providers>
          <div className="min-h-screen flex">
            <aside className="w-64 border-r bg-white px-4 py-6 hidden md:block">
              <div className="text-lg font-semibold">HomeSchoolLink</div>
              <div className="mt-1 text-xs text-zinc-500">过程性评价（原型）</div>

              <nav className="mt-6 flex flex-col gap-1">
                {nav.map((n) => (
                  <Link
                    key={n.href}
                    href={n.href}
                    className="rounded-lg px-3 py-2 text-sm hover:bg-zinc-100"
                  >
                    {n.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-8 text-xs text-zinc-500 leading-5">
                当前为“可上线的界面原型”：数据保存在浏览器本地（localStorage）。
                后续接 Supabase 后即可多设备同步、家长端分享、音视频存储等。
              </div>
            </aside>

            <main className="flex-1">
              <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
                <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
                  <div className="md:hidden text-sm font-semibold">HomeSchoolLink</div>
                  <div className="text-xs text-zinc-500">可上线原型 · 先跑通流程</div>
                </div>
              </header>

              <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>

              <footer className="border-t bg-white">
                <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-zinc-500">
                  © {new Date().getFullYear()} HomeSchoolLink · Prototype
                </div>
              </footer>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
