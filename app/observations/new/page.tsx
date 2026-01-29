"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Input, Select, Textarea, Tag, PageHeader } from "@/components/ui";
import { loadStore, addObservation } from "@/lib/store";
import { seed } from "@/lib/seed";
import { MediaItem } from "@/lib/models";
import { uploadFile } from "@/lib/storage";

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
  const selectedChild = useMemo(() => snap.children.find((c) => c.id === childId), [snap, childId]);
  const selectedDomain = useMemo(() => snap.domains.find((d) => d.id === domainId), [snap, domainId]);

  function toggleIndicator(id: string) {
    setIndicatorIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const items: MediaItem[] = await Promise.all(
      files.map(async (f) => {
        const upload = await uploadFile(f);
        return {
          id: `m_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`,
          kind: f.type.startsWith("image/") ? "image" : f.type.startsWith("video/") ? "video" : f.type.startsWith("audio/") ? "audio" : "file",
          name: f.name,
          size: f.size,
          lastModified: f.lastModified,
          provider: upload.provider,
          storageKey: upload.storageKey,
          publicUrl: upload.publicUrl,
          uploadStatus: upload.status,
          uploadError: upload.error,
        };
      })
    );
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
      <PageHeader
        eyebrow="证据采集"
        title="新建观察"
        subtitle="选择幼儿与领域 → 记录情境 → 关联指标，快速完成一条可分析的证据。"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => history.back()}>
              返回
            </Button>
            <Button size="sm" onClick={save} disabled={snap.children.length === 0}>
              保存记录
            </Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <Card title="基本信息">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <div className="text-xs text-slate-500 mb-1">幼儿 *</div>
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
                <div className="text-xs text-slate-500 mb-1">发生时间</div>
                <Input value={occurredAt} onChange={(e) => setOccurredAt(e.target.value)} type="datetime-local" />
              </div>

              <div>
                <div className="text-xs text-slate-500 mb-1">领域 *</div>
                <Select value={domainId} onChange={(e) => { setDomainId(e.target.value); setIndicatorIds([]); }}>
                  {snap.domains.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </Select>
              </div>

              <div>
                <div className="text-xs text-slate-500 mb-1">附件（可选）</div>
                <Input type="file" multiple onChange={onFiles} />
            {media.length ? (
              <div className="mt-2 space-y-2">
                <div className="flex flex-wrap gap-2">
                  {media.map((m) => (
                    <Tag key={m.id}>
                      {m.kind}:{m.name} {m.uploadStatus === "pending" ? "· 待上传" : m.uploadStatus === "error" ? "· 上传失败" : ""}
                    </Tag>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {media
                    .filter((m) => m.kind === "image" && m.publicUrl)
                    .map((m) => (
                      <img
                        key={m.id}
                        src={m.publicUrl}
                        alt={m.name}
                        className="h-20 w-full rounded-xl object-cover"
                      />
                    ))}
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 mt-1">当前仅保存附件元数据；后续接存储后可上传与预览。</div>
            )}
          </div>

              <div className="md:col-span-2">
                <div className="text-xs text-slate-500 mb-1">文字记录</div>
                <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={5} placeholder="记录幼儿在活动中的具体表现、情境与教师反思（避免诊断性结论）" />
              </div>
            </div>
          </Card>

          <Card title="关联指标（点击选择）">
            {indicators.length === 0 ? (
              <div className="text-sm text-slate-500">该领域暂无指标。可去“指标库”新增园本指标。</div>
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
                        (active ? "bg-slate-900 text-white border-slate-900" : "bg-white/80 hover:bg-white border-slate-200")
                      }
                    >
                      {it.text}
                    </button>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="草稿摘要">
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-xs text-slate-500">幼儿</div>
                <div className="mt-1 font-medium">{selectedChild?.name ?? "未选择"}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">领域</div>
                <div className="mt-1 font-medium">{selectedDomain?.name ?? "未选择"}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">指标</div>
                <div className="mt-1 flex flex-wrap gap-2">
                  {indicatorIds.length ? indicatorIds.map((id) => (
                    <Tag key={id}>{snap.indicators.find((i) => i.id === id)?.text ?? "未知指标"}</Tag>
                  )) : <Tag>暂无</Tag>}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500">附件</div>
                <div className="mt-1">{media.length ? `${media.length} 个附件元数据` : "暂无"}</div>
              </div>
              <div className="rounded-xl border border-white/60 bg-white/80 p-3 text-xs text-slate-500">
                保存后可在“观察中心”进一步编辑、分享给家长或生成报告。
              </div>
            </div>
          </Card>

          <Card title="质量提示">
            <div className="space-y-2 text-xs text-slate-500">
              <div>建议记录：情境、行为、同伴互动、教师支持策略。</div>
              <div>避免诊断性结论，强调可观察行为与证据。</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
