import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-white/70 bg-white/70 p-8 shadow-[0_30px_80px_-60px_rgba(15,23,42,0.6)] backdrop-blur">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200/70 bg-cyan-50 px-3 py-1 text-xs text-cyan-700">
              可上线版 · Supabase + Vercel
            </div>
            <h1 className="mt-4 text-3xl font-semibold leading-tight">
              HomeSchoolLink
              <span className="block text-slate-500">面向教师、园所、家长的过程性评价闭环</span>
            </h1>
            <p className="mt-4 text-sm text-slate-600">
              用“证据采集 → 指标对照 → 汇总报告 → 教师反思 → 家园共育”的路径，把幼儿发展过程可视化、可追踪、可改进。
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href="/dashboard"
                className="rounded-full border border-slate-900 bg-slate-900 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
              >
                进入工作台
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                登录与同步
              </Link>
            </div>
          </div>
          <div className="grid gap-3">
            {[
              { title: "教师端", desc: "高频记录、对照指标、个体/班级报告" },
              { title: "园所管理端", desc: "园本指标、教师自评、质量改进闭环" },
              { title: "家长端", desc: "观察分享、家庭任务、互动反馈" },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/60 bg-white/80 p-4">
                <div className="text-sm font-semibold">{item.title}</div>
                <div className="mt-2 text-xs text-slate-500">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-5">
        {[
          { title: "证据采集", desc: "图文音视频+情境标签" },
          { title: "指标对照", desc: "五大领域+园本指标" },
          { title: "汇总分析", desc: "频次、趋势、覆盖" },
          { title: "反思改进", desc: "教师自评与支持策略" },
          { title: "家园共育", desc: "任务推送与反馈" },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-white/60 bg-white/80 p-4">
            <div className="text-sm font-semibold">{item.title}</div>
            <div className="mt-2 text-xs text-slate-500">{item.desc}</div>
          </div>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {[
          {
            title: "数据与合规",
            desc: "RBAC、分租户隔离、监护人同意、访问审计、导出与删除请求。",
          },
          {
            title: "可上线架构",
            desc: "Next.js + Supabase + 对象存储 + Docker，模块化单体起步，后续可拆分。",
          },
          {
            title: "AI 辅助",
            desc: "仅做归类/摘要/润色，必须人工确认，提供可解释依据。",
          },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-white/60 bg-white/80 p-4">
            <div className="text-sm font-semibold">{item.title}</div>
            <div className="mt-2 text-xs text-slate-500">{item.desc}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
