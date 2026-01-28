"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Card, Button, Select, Tag } from "@/components/ui";
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

  function onDelete(id: string) {
    if (!confirm("确认删除这条观察记录吗？")) return;
    deleteObservation(id, seed);
    refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">观察记录</h1>
          <p className="text-sm text-zinc-500 mt-1">支持文字记录与关联指标（媒体附件先记元数据，后续接存储）。</p>
        </div>
        <Link className="rounded-lg border px-3 py-2 text-sm hover:bg-zinc-100" href="/observations/new">+ 新建观察</Link>
      </div>

      <Card title="筛选">
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <div className="text-xs text-zinc-500 mb-1">幼儿</div>
            <Select value={childId} onChange={(e) => setChildId(e.target.value)}>
              <option value="">全部</option>
              {snap.children.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </div>
          <div>
            <div className="text-xs text-zinc-500 mb-1">领域</div>
            <Select value={domainId} onChange={(e) => setDomainId(e.target.value)}>
              <option value="">全部</option>
              {snap.domains.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </Select>
          </div>
          <div className="text-xs text-zinc-500 flex items-end">
            当前共 {list.length} 条
          </div>
        </div>
      </Card>

      <Card title={`列表（${list.length}）`}>
        {list.length === 0 ? (
          <div className="text-sm text-zinc-500">
            暂无记录。先去 <Link className="underline" href="/observations/new">新建观察</Link>。
          </div>
        ) : (
          <div className="space-y-3">
            {list.map((o) => {
              const child = snap.children.find((c) => c.id === o.childId);
              const domain = snap.domains.find((d) => d.id === o.domainId)?.name ?? "未知领域";
              return (
                <div key={o.id} className="rounded-xl border p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-medium">{child?.name ?? "未绑定幼儿"} · {domain}</div>
                    <div className="flex items-center gap-2">
                      <div className="text-xs text-zinc-500">{new Date(o.occurredAt).toLocaleString()}</div>
                      <Button variant="danger" onClick={() => onDelete(o.id)}>删除</Button>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-zinc-700">{o.note || "（无文字描述）"}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {o.indicatorIds.map((id) => (
                      <Tag key={id}>{snap.indicators.find((i) => i.id === id)?.text ?? "未知指标"}</Tag>
                    ))}
                    {o.media.length ? <Tag>附件 x{o.media.length}</Tag> : null}
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
