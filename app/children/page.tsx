"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Card, Button, Input, Textarea, PageHeader, Tag } from "@/components/ui";
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
  const classGroups = useMemo(() => {
    const map = new Map<string, number>();
    snap.children.forEach((child) => {
      const key = child.className || "未分班";
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return Array.from(map.entries());
  }, [snap]);

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
      <PageHeader
        eyebrow="基础档案"
        title="幼儿档案"
        subtitle="将幼儿信息与观察记录关联，形成持续发展的成长画像。"
        actions={
          <Link className="rounded-full border border-slate-900 bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800" href="/observations/new">
            直接新建观察
          </Link>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="概览">
          <div className="space-y-3">
            <div className="text-3xl font-semibold text-slate-900">{list.length}</div>
            <div className="text-xs text-slate-500">已建档幼儿数量</div>
            <div className="flex flex-wrap gap-2">
              {classGroups.length ? classGroups.map(([cls, count]) => (
                <Tag key={cls}>{cls} · {count}</Tag>
              )) : <Tag>暂无班级</Tag>}
            </div>
          </div>
        </Card>

        <Card title="批量准备">
          <div className="space-y-2 text-sm text-slate-600">
            <div>支持 Excel/CSV 导入幼儿名单（建议字段：姓名、班级、出生日期）。</div>
            <div className="text-xs text-slate-500">后续可在园所管理端统一维护。</div>
          </div>
        </Card>

        <Card title="档案质量提示">
          <div className="space-y-2 text-xs text-slate-500">
            <div>保持监护人信息与家庭联系方式完整，方便家园协作。</div>
            <div>备注中记录需要关注的支持策略，而非诊断结论。</div>
          </div>
        </Card>
      </div>

      <Card title="新增幼儿">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <div className="text-xs text-slate-500 mb-1">姓名 *</div>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="如：小明" />
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">出生日期</div>
            <Input value={birthDate} onChange={(e) => setBirthDate(e.target.value)} placeholder="YYYY-MM-DD" />
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">班级</div>
            <Input value={className} onChange={(e) => setClassName(e.target.value)} placeholder="如：大一班" />
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">监护人</div>
            <Input value={guardianName} onChange={(e) => setGuardianName(e.target.value)} placeholder="如：张先生/李女士" />
          </div>
          <div className="md:col-span-2">
            <div className="text-xs text-slate-500 mb-1">备注</div>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="可记录需要关注的情况（非诊断性）" />
          </div>
        </div>

        <div className="mt-3">
          <Button onClick={onAdd} disabled={!name.trim()}>保存</Button>
        </div>
      </Card>

      <Card title={`幼儿列表（${list.length}）`}>
        {list.length === 0 ? (
          <div className="text-sm text-slate-500">暂无幼儿档案。</div>
        ) : (
          <div className="divide-y divide-slate-200/70">
            {list.map((c) => (
              <div key={c.id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-medium">{c.name}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {c.className ? `${c.className} · ` : ""}{c.birthDate ? `出生：${c.birthDate}` : "未填出生日期"}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50" href={`/children/${c.id}`}>查看</Link>
                  <Button variant="danger" size="sm" onClick={() => onDelete(c.id)}>删除</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
