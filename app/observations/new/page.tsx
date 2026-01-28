"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Input, Select, Textarea, Tag } from "@/components/ui";
import { loadStore, addObservation } from "@/lib/store";
import { seed } from "@/lib/seed";
import { MediaItem } from "@/lib/models";

export default function NewObservationPage() {
  const router = useRouter();
  const [snap, setSnap] = useState(seed);

  const [childId, setChildId] = useState("");
  const [domainId, setDomainId] = useState("health");
  const [occurredAt, setOccurredAt] = useState(() => new Date().toISOString().slice(0, 16)); // yyyy-MM-ddTHH:mm
  const [note, setNote] = useState("");
  const [indicatorIds, setIndicatorIds] = useState<string[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);

  useEffect(() => {
    const s = loadStore();
    if (s) setSnap(s);
  }, []);

  const indicators = useMemo(() => snap.indicators.filter((i) => i.domainId === domainId), [snap, domainId]);

  function toggleIndicator(id: string) {
    setIndicatorIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const items: MediaItem[] = files.map((f) => ({
      id: `m_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`,
      kind: f.type.startsWith("image/") ? "image" : f.type.startsWith("video/") ? "video" : f.type.startsWith("audio/") ? "audio" : "file",
      name: f.name,
      size: f.size,
      lastModified: f.lastModified,
    }));
    setMedia((prev) => [...prev, ...items]);
    e.target.value = "";
  }

  function save() {
    if (!childId) {
      alert("请先选择幼儿");
      return;
    }
    if (!domainId) {
      alert("请选择领域");
      return;
    }
    const iso = new Date(occurredAt).toISOString();
    addObservation(
      {
        childId,
        domainId,
        occurredAt: iso,
        indicatorIds,
        note: note || undefined,
        media,
        sharedToFamily: false,
      },
      seed
    );
    router.push("/observations");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">新建观察</h1>
        <p className="text-sm text-zinc-500 mt-1">快速记录：选择幼儿 → 选择领域与指标 → 填写文字 →（可选）附件。</p>
      </div>

      <Card title="基本信息">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <div className="text-xs text-zinc-500 mb-1">幼儿 *</div>
            <Select value={childId} onChange={(e) => setChildId(e.target.value)}>
              <option value="">请选择</option>
              {snap.children.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
            {snap.children.length === 0 ? (
              <div className="text-xs text-red-600 mt-1">你还没有创建幼儿档案，请先去“幼儿档案”新增。</div>
            ) : null}
          </div>
          <div>
            <div className="text-xs text-zinc-500 mb-1">发生时间</div>
            <Input value={occurredAt} onChange={(e) => setOccurredAt(e.target.value)} type="datetime-local" />
          </div>

          <div>
            <div className="text-xs text-zinc-500 mb-1">领域 *</div>
            <Select value={domainId} onChange={(e) => { setDomainId(e.target.value); setIndicatorIds([]); }}>
              {snap.domains.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </Select>
          </div>

          <div>
            <div className="text-xs text-zinc-500 mb-1">附件（可选）</div>
            <Input type="file" multiple onChange={onFiles} />
            {media.length ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {media.map((m) => <Tag key={m.id}>{m.kind}:{m.name}</Tag>)}
              </div>
            ) : (
              <div className="text-xs text-zinc-500 mt-1">当前仅保存附件元数据；后续接存储后可真正上传与预览。</div>
            )}
          </div>

          <div className="md:col-span-2">
            <div className="text-xs text-zinc-500 mb-1">文字记录</div>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={5} placeholder="记录幼儿在活动中的具体表现、情境与教师反思（避免诊断性结论）" />
          </div>
        </div>
      </Card>

      <Card title="关联指标（点击选择）">
        {indicators.length === 0 ? (
          <div className="text-sm text-zinc-500">该领域暂无指标。可去“指标库”新增园本指标。</div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {indicators.map((it) => {
              const active = indicatorIds.includes(it.id);
              return (
                <button
                  key={it.id}
                  onClick={() => toggleIndicator(it.id)}
                  className={
                    "rounded-full border px-3 py-1 text-sm transition " +
                    (active ? "bg-zinc-900 text-white border-zinc-900" : "bg-white hover:bg-zinc-100 border-zinc-200")
                  }
                >
                  {it.text}
                </button>
              );
            })}
          </div>
        )}
      </Card>

      <div className="flex gap-2">
        <Button onClick={save} disabled={snap.children.length === 0}>保存记录</Button>
        <Button variant="ghost" onClick={() => history.back()}>返回</Button>
      </div>
    </div>
  );
}
