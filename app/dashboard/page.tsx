"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card, Tag } from "@/components/ui";
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
    return { childrenCount, obsCount, sharedCount };
  }, [snapshot]);

  const recent = useMemo(() => snapshot.observations.slice(0, 6), [snapshot]);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">总览</h1>
          <p className="text-sm text-zinc-500 mt-1">用“记录 → 对照指标 → 汇总报告”的方式支持教师日常过程性评价。</p>
        </div>
        <div className="flex gap-2">
          <Link className="rounded-lg border px-3 py-2 text-sm hover:bg-zinc-100" href="/observations/new">+ 新建观察</Link>
          <Link className="rounded-lg border px-3 py-2 text-sm hover:bg-zinc-100" href="/children">管理幼儿</Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card title="幼儿数">
          <div className="text-3xl font-semibold">{stats.childrenCount}</div>
          <div className="text-xs text-zinc-500 mt-1">已建档幼儿数量</div>
        </Card>
        <Card title="观察记录数">
          <div className="text-3xl font-semibold">{stats.obsCount}</div>
          <div className="text-xs text-zinc-500 mt-1">包含文字/指标/附件元数据</div>
        </Card>
        <Card title="已分享给家长">
          <div className="text-3xl font-semibold">{stats.sharedCount}</div>
          <div className="text-xs text-zinc-500 mt-1">（家园共育功能后续增强）</div>
        </Card>
      </div>

      <Card title="最近记录">
        {recent.length === 0 ? (
          <div className="text-sm text-zinc-500">
            还没有记录。你可以从 <Link className="underline" href="/observations/new">新建观察</Link> 开始跑通流程。
          </div>
        ) : (
          <div className="space-y-3">
            {recent.map((o) => {
              const child = snapshot.children.find((c) => c.id === o.childId);
              const domain = snapshot.domains.find((d) => d.id === o.domainId)?.name ?? "未知领域";
              return (
                <div key={o.id} className="rounded-xl border p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-medium">{child?.name ?? "未绑定幼儿"} · {domain}</div>
                    <div className="text-xs text-zinc-500">{new Date(o.occurredAt).toLocaleString()}</div>
                  </div>
                  <div className="mt-2 text-sm text-zinc-700 line-clamp-2">{o.note || "（无文字描述）"}</div>
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
