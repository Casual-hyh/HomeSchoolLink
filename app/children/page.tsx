"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Card, Button, Input, Textarea } from "@/components/ui";
import { loadStore, addChild, deleteChild } from "@/lib/store";
import { seed } from "@/lib/seed";

export default function ChildrenPage() {
  const [snap, setSnap] = useState(seed);

  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [className, setClassName] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    const s = loadStore();
    if (s) setSnap(s);
  }, []);

  const list = useMemo(() => snap.children, [snap]);

  function refresh() {
    const s = loadStore();
    if (s) setSnap(s);
  }

  function onAdd() {
    if (!name.trim()) return;
    addChild(
      { name: name.trim(), birthDate: birthDate || undefined, className: className || undefined, guardianName: guardianName || undefined, note: note || undefined },
      seed
    );
    setName(""); setBirthDate(""); setClassName(""); setGuardianName(""); setNote("");
    refresh();
  }

  function onDelete(id: string) {
    if (!confirm("删除幼儿档案将同时删除其所有观察记录，确认吗？")) return;
    deleteChild(id, seed);
    refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">幼儿档案</h1>
        <p className="text-sm text-zinc-500 mt-1">先把班级幼儿建档，后续观察记录才能关联到具体幼儿。</p>
      </div>

      <Card title="新增幼儿">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <div className="text-xs text-zinc-500 mb-1">姓名 *</div>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="如：小明" />
          </div>
          <div>
            <div className="text-xs text-zinc-500 mb-1">出生日期</div>
            <Input value={birthDate} onChange={(e) => setBirthDate(e.target.value)} placeholder="YYYY-MM-DD" />
          </div>
          <div>
            <div className="text-xs text-zinc-500 mb-1">班级</div>
            <Input value={className} onChange={(e) => setClassName(e.target.value)} placeholder="如：大一班" />
          </div>
          <div>
            <div className="text-xs text-zinc-500 mb-1">监护人</div>
            <Input value={guardianName} onChange={(e) => setGuardianName(e.target.value)} placeholder="如：张先生/李女士" />
          </div>
          <div className="md:col-span-2">
            <div className="text-xs text-zinc-500 mb-1">备注</div>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="可记录需要关注的情况（非诊断性）" />
          </div>
        </div>

        <div className="mt-3">
          <Button onClick={onAdd} disabled={!name.trim()}>保存</Button>
        </div>
      </Card>

      <Card title={`幼儿列表（${list.length}）`}>
        {list.length === 0 ? (
          <div className="text-sm text-zinc-500">暂无幼儿档案。</div>
        ) : (
          <div className="divide-y">
            {list.map((c) => (
              <div key={c.id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-medium">{c.name}</div>
                  <div className="text-xs text-zinc-500 mt-1">
                    {c.className ? `${c.className} · ` : ""}{c.birthDate ? `出生：${c.birthDate}` : "未填出生日期"}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link className="rounded-lg border px-3 py-2 text-sm hover:bg-zinc-100" href={`/children/${c.id}`}>查看</Link>
                  <Button variant="danger" onClick={() => onDelete(c.id)}>删除</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
