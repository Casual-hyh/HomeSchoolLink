"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, Button, Input, Select, Tag } from "@/components/ui";
import { loadStore, addIndicator, deleteIndicator } from "@/lib/store";
import { seed } from "@/lib/seed";

export default function IndicatorsPage() {
  const [snap, setSnap] = useState(seed);
  const [domainId, setDomainId] = useState("health");
  const [text, setText] = useState("");

  useEffect(() => {
    const s = loadStore();
    if (s) setSnap(s);
  }, []);

  function refresh() {
    const s = loadStore();
    if (s) setSnap(s);
  }

  const list = useMemo(() => snap.indicators.filter((i) => i.domainId === domainId), [snap, domainId]);

  function onAdd() {
    if (!text.trim()) return;
    addIndicator({ domainId, text: text.trim() }, seed);
    setText("");
    refresh();
  }

  function onDelete(id: string, isSystem: boolean) {
    if (isSystem) {
      alert("内置指标不允许删除（原型阶段可保留）。如需可扩展为“禁用/归档”。");
      return;
    }
    deleteIndicator(id, seed);
    refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">指标库</h1>
        <p className="text-sm text-zinc-500 mt-1">内置指标 + 园本化自定义指标。观察记录可直接关联这些指标。</p>
      </div>

      <Card title="新增园本指标">
        <div className="grid gap-3 md:grid-cols-3 items-end">
          <div>
            <div className="text-xs text-zinc-500 mb-1">领域</div>
            <Select value={domainId} onChange={(e) => setDomainId(e.target.value)}>
              {snap.domains.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </Select>
          </div>
          <div className="md:col-span-2">
            <div className="text-xs text-zinc-500 mb-1">指标描述</div>
            <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="如：能主动整理玩具并归位" />
          </div>
        </div>
        <div className="mt-3">
          <Button onClick={onAdd} disabled={!text.trim()}>添加</Button>
        </div>
      </Card>

      <Card title="指标列表">
        <div className="mb-3">
          <div className="text-xs text-zinc-500 mb-1">查看领域</div>
          <Select value={domainId} onChange={(e) => setDomainId(e.target.value)}>
            {snap.domains.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </Select>
        </div>

        {list.length === 0 ? (
          <div className="text-sm text-zinc-500">该领域暂无指标。</div>
        ) : (
          <div className="space-y-2">
            {list.map((i) => (
              <div key={i.id} className="rounded-xl border p-3 flex items-center justify-between gap-3">
                <div className="text-sm">
                  {i.text} {i.isSystem ? <Tag>内置</Tag> : <Tag>园本</Tag>}
                </div>
                <Button variant="danger" onClick={() => onDelete(i.id, i.isSystem)}>删除</Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
