"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, Button, Input, Select, Tag, PageHeader } from "@/components/ui";
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
      alert("内置指标不允许删除。如需可扩展为“禁用/归档”。");
      return;
    }
    deleteIndicator(id, seed);
    refresh();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="园本指标"
        title="指标库"
        subtitle="内置指标 + 园本化指标。支持导入、版本管理与映射。"
      />

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card title="新增园本指标">
          <div className="grid gap-3 md:grid-cols-3 items-end">
            <div>
              <div className="text-xs text-slate-500 mb-1">领域</div>
              <Select value={domainId} onChange={(e) => setDomainId(e.target.value)}>
                {snap.domains.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </Select>
            </div>
            <div className="md:col-span-2">
              <div className="text-xs text-slate-500 mb-1">指标描述</div>
              <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="如：能主动整理玩具并归位" />
            </div>
          </div>
          <div className="mt-3">
            <Button onClick={onAdd} disabled={!text.trim()}>添加</Button>
          </div>
        </Card>

        <Card title="园本化策略">
          <div className="space-y-2 text-sm text-slate-600">
            <div>支持 Excel/JSON 模板批量导入指标。</div>
            <div>可建立园本指标与国家指标映射关系。</div>
            <div className="text-xs text-slate-500">后续支持版本管理与指标归档。</div>
          </div>
        </Card>
      </div>

      <Card title="指标列表">
        <div className="mb-3">
          <div className="text-xs text-slate-500 mb-1">查看领域</div>
          <Select value={domainId} onChange={(e) => setDomainId(e.target.value)}>
            {snap.domains.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </Select>
        </div>

        {list.length === 0 ? (
          <div className="text-sm text-slate-500">该领域暂无指标。</div>
        ) : (
          <div className="space-y-2">
            {list.map((i) => (
              <div key={i.id} className="rounded-xl border border-white/60 bg-white/80 p-3 flex items-center justify-between gap-3">
                <div className="text-sm">
                  {i.text} {i.isSystem ? <Tag>内置</Tag> : <Tag>园本</Tag>}
                </div>
                <Button variant="danger" size="sm" onClick={() => onDelete(i.id, i.isSystem)}>删除</Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
