"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Card, Button, Select, Tag, PageHeader } from "@/components/ui";
import { loadStore, deleteObservation } from "@/lib/store";
import { seed } from "@/lib/seed";

export default function ObservationsPage() {
  const [snap, setSnap] = useState(seed);
  const [childId, setChildId] = useState("");
  const [domainId, setDomainId] = useState("");

  useEffect(() => {
    const s = loadStore();
    if (s) setSnap(s);
  }, []);

  function refresh() {
    const s = loadStore();
    if (s) setSnap(s);
  }

  const list = useMemo(() => {
    return snap.observations.filter((o) => (childId ? o.childId === childId : true) && (domainId ? o.domainId === domainId : true));
  }, [snap, childId, domainId]);

  const sharedCount = useMemo(() => list.filter((o) => o.sharedToFamily).length, [list]);

  function onDelete(id: string) {
    if (!confirm("确认删除这条观察记录吗？")) return;
    deleteObservation(id, seed);
    refresh();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="证据采集"
        title="观察中心"
        subtitle="快速记录 + 指标对照。让每条证据进入可分析、可汇总、可追踪的闭环。"
        actions={
          <Link className="rounded-full border border-slate-900 bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800" href="/observations/new">
            新建观察
          </Link>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <Card title="筛选">
          <div className="space-y-4">
            <div>
              <div className="text-xs text-slate-500 mb-1">幼儿</div>
              <Select value={childId} onChange={(e) => setChildId(e.target.value)}>
                <option value="">全部</option>
                {snap.children.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Select>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">领域</div>
              <Select value={domainId} onChange={(e) => setDomainId(e.target.value)}>
                <option value="">全部</option>
                {snap.domains.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </Select>
            </div>
            <div className="rounded-xl border border-white/60 bg-white/80 p-3 text-xs text-slate-600">
              当前 {list.length} 条 · 已分享 {sharedCount} 条
            </div>
            <div className="text-xs text-slate-500">建议：每周覆盖 3 个领域，情境尽量多样化。</div>
          </div>
        </Card>

        <Card title={`记录列表（${list.length}）`} action={<Link className="text-xs text-slate-500 hover:text-slate-700" href="/observations/new">+ 新建</Link>}>
          {list.length === 0 ? (
            <div className="text-sm text-slate-500">
              暂无记录。先去 <Link className="underline" href="/observations/new">新建观察</Link>。
            </div>
          ) : (
            <div className="space-y-3">
              {list.map((o) => {
                const child = snap.children.find((c) => c.id === o.childId);
                const domain = snap.domains.find((d) => d.id === o.domainId)?.name ?? "未知领域";
                return (
                  <div key={o.id} className="rounded-xl border border-white/60 bg-white/80 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-medium">
                        {child?.name ?? "未绑定幼儿"} · {domain}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-slate-500">{new Date(o.occurredAt).toLocaleString()}</div>
                        <Button variant="danger" size="sm" onClick={() => onDelete(o.id)}>删除</Button>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-slate-700">{o.note || "（无文字描述）"}</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {o.indicatorIds.map((id) => (
                        <Tag key={id}>{snap.indicators.find((i) => i.id === id)?.text ?? "未知指标"}</Tag>
                      ))}
                      {o.media.length ? <Tag>附件 x{o.media.length}</Tag> : null}
                      {o.sharedToFamily ? <Tag className="bg-emerald-50 text-emerald-700">已分享</Tag> : <Tag>未分享</Tag>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
