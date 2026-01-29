"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  desc?: string;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const navSections: NavSection[] = [
  {
    title: "教师端",
    items: [
      { href: "/dashboard", label: "工作台", desc: "今日重点与快捷入口" },
      { href: "/observations", label: "观察中心", desc: "证据采集与指标关联" },
      { href: "/children", label: "幼儿档案", desc: "个体档案与成长线索" },
      { href: "/reports", label: "成长报告", desc: "自动汇总与导出" },
    ],
  },
  {
    title: "园所管理",
    items: [
      { href: "/insights", label: "数据看板", desc: "班级/园所全局视角" },
      { href: "/quality", label: "园本自评", desc: "质量改进闭环" },
      { href: "/settings/indicators", label: "指标库", desc: "园本化与映射" },
    ],
  },
  {
    title: "家园共育",
    items: [
      { href: "/family", label: "家园协作", desc: "分享观察与互动" },
      { href: "/tasks", label: "家庭任务", desc: "任务推送与反馈" },
    ],
  },
  {
    title: "系统",
    items: [
      { href: "/admin", label: "组织与权限", desc: "角色、班级、家长" },
      { href: "/login", label: "登录入口", desc: "账号与同步" },
    ],
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function AppNav({ variant = "sidebar" }: { variant?: "sidebar" | "mobile" }) {
  const pathname = usePathname() || "/";
  const flatItems = navSections.flatMap((s) => s.items);

  if (variant === "mobile") {
    return (
      <div className="md:hidden px-4 pb-3">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {flatItems.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "whitespace-nowrap rounded-full border px-3 py-1 text-xs transition " +
                  (active
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-white/60 bg-white/70 text-slate-700 hover:bg-white")
                }
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <aside className="hidden md:flex w-72 flex-col border-r border-slate-200/70 bg-white/60 backdrop-blur-xl">
      <div className="px-6 pt-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-cyan-400 via-sky-500 to-emerald-400" />
          <div>
            <div className="text-sm font-semibold tracking-wide">HomeSchoolLink</div>
            <div className="text-[11px] text-slate-500">可上线原型 · 过程性评价系统</div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex-1 overflow-y-auto px-4 pb-6">
        {navSections.map((section) => (
          <div key={section.title} className="mb-6">
            <div className="px-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              {section.title}
            </div>
            <div className="mt-2 space-y-1">
              {section.items.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      "group flex items-start gap-3 rounded-xl px-3 py-2 text-sm transition " +
                      (active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-white")
                    }
                  >
                    <span
                      className={
                        "mt-2 h-2 w-2 rounded-full " +
                        (active ? "bg-emerald-300" : "bg-slate-300 group-hover:bg-slate-400")
                      }
                    />
                    <span>
                      <span className="font-medium">{item.label}</span>
                      {item.desc ? <span className="block text-[11px] text-slate-500 group-hover:text-slate-600">{item.desc}</span> : null}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 py-5 text-xs text-slate-500">
        数据模式：本地草稿 · 可切换至 Supabase
      </div>
    </aside>
  );
}
