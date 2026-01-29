"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card, PageHeader, StatCard, Tag, Progress } from "@/components/ui";
import { loadStore } from "@/lib/store";
import { seed } from "@/lib/seed";

export default function DashboardPage() {
  const [snapshot, setSnapshot] = useState(() => seed);

  useEffect(() => {
    const s = loadStore();
    if (s) setSnapshot(s);
  }, []);

  const stats = useMemo(() => {
    const childrenCount = snapshot.children.length;
    const obsCount = snapshot.observations.length;
    const sharedCount = snapshot.observations.filter((o) => o.sharedToFamily).length;
    const usedIndicators = new Set(snapshot.observations.flatMap((o) => o.indicatorIds));
    const indicatorCoverage = snapshot.indicators.length
      ? Math.round((usedIndicators.size / snapshot.indicators.length) * 100)
      : 0;
    return { childrenCount, obsCount, sharedCount, indicatorCoverage };
  }, [snapshot]);

  const recent = useMemo(() => snapshot.observations.slice(0, 6), [snapshot]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="教师端"
        title="工作台"
        subtitle="用证据驱动的过程性评价，把观察、指标、报告与家园协作连接起来。"
        actions={
          <>
            <Link className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50" href="/observations">
              查看观察
            </Link>
            <Link className="rounded-full border border-slate-900 bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800" href="/observations/new">
              新建观察
            </Link>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="幼儿" value={stats.childrenCount} hint="已建档幼儿" />
        <StatCard label="观察记录" value={stats.obsCount} hint="包含文字、指标与附件" />
        <StatCard label="家园分享" value={stats.sharedCount} hint="已分享记录数量" />
        <StatCard label="指标覆盖" value={`${stats.indicatorCoverage}%`} hint="已被使用指标占比" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="闭环流程">
          <div className="grid gap-3">
            {[
              "证据采集：图文音视频 + 情境标签",
              "指标对照：五大领域 + 园本指标",
              "汇总分析：频次/趋势/覆盖",
              "教师反思：支持策略与计划",
              "家园共育：分享观察与任务",
            ].map((item) => (
              <div key={item} className="rounded-xl border border-white/60 bg-white/80 px-3 py-2 text-sm text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </Card>

        <Card title="指标覆盖进度">
          <div className="space-y-3">
            <div className="text-sm text-slate-600">当前覆盖度：{stats.indicatorCoverage}%</div>
            <Progress value={stats.indicatorCoverage} />
            <div className="text-xs text-slate-500">
              建议每周至少覆盖 3 个领域指标，保持情境多样性与趋势观察。
            </div>
          </div>
        </Card>

        <Card title="下一步推荐">
          <div className="space-y-2 text-sm text-slate-700">
            <div className="rounded-xl border border-white/60 bg-white/80 px-3 py-2">补齐未覆盖领域的观察记录</div>
            <div className="rounded-xl border border-white/60 bg-white/80 px-3 py-2">从最近 2 周记录生成成长摘要</div>
            <div className="rounded-xl border border-white/60 bg-white/80 px-3 py-2">挑选 1 条记录分享给家长</div>
          </div>
        </Card>
      </div>

      <Card title="最近记录" action={<Link className="text-xs text-slate-500 hover:text-slate-700" href="/observations">查看全部</Link>}>
        {recent.length === 0 ? (
          <div className="text-sm text-slate-500">
            还没有记录。你可以从 <Link className="underline" href="/observations/new">新建观察</Link> 开始跑通流程。
          </div>
        ) : (
          <div className="space-y-3">
            {recent.map((o) => {
              const child = snapshot.children.find((c) => c.id === o.childId);
              const domain = snapshot.domains.find((d) => d.id === o.domainId)?.name ?? "未知领域";
              return (
                <div key={o.id} className="rounded-xl border border-white/60 bg-white/80 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-medium">
                      {child?.name ?? "未绑定幼儿"} · {domain}
                    </div>
                    <div className="text-xs text-slate-500">{new Date(o.occurredAt).toLocaleString()}</div>
                  </div>
                  <div className="mt-2 text-sm text-slate-700 line-clamp-2">{o.note || "（无文字描述）"}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {o.indicatorIds.slice(0, 4).map((id) => (
                      <Tag key={id}>{snapshot.indicators.find((i) => i.id === id)?.text ?? "未知指标"}</Tag>
                    ))}
                    {o.indicatorIds.length > 4 ? <Tag>+{o.indicatorIds.length - 4}</Tag> : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
