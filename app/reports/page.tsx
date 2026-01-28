"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, Button, Select, Textarea, Tag } from "@/components/ui";
import { loadStore, getDomainName, getIndicatorText } from "@/lib/store";
import { seed } from "@/lib/seed";

export default function ReportsPage() {
  const [snap, setSnap] = useState(seed);
  const [childId, setChildId] = useState("");
  const [report, setReport] = useState("");

  useEffect(() => {
    const s = loadStore();
    if (s) setSnap(s);
  }, []);

  const child = useMemo(() => snap.children.find((c) => c.id === childId), [snap, childId]);
  const obs = useMemo(() => snap.observations.filter((o) => o.childId === childId), [snap, childId]);

  function generate() {
    if (!childId) {
      alert("请先选择幼儿");
      return;
    }
    const byDomain = new Map<string, number>();
    const byIndicator = new Map<string, number>();

    for (const o of obs) {
      byDomain.set(o.domainId, (byDomain.get(o.domainId) ?? 0) + 1);
      for (const iid of o.indicatorIds) {
        byIndicator.set(iid, (byIndicator.get(iid) ?? 0) + 1);
      }
    }

    const topDomains = Array.from(byDomain.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3);
    const topIndicators = Array.from(byIndicator.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);

    const lines: string[] = [];
    lines.push(`【幼儿成长报告（原型）】`);
    lines.push(`幼儿：${child?.name ?? ""}`);
    lines.push(`生成时间：${new Date().toLocaleString()}`);
    lines.push("");
    lines.push(`一、观察概览`);
    lines.push(`- 观察记录数：${obs.length}`);
    if (topDomains.length) {
      lines.push(`- 主要领域：${topDomains.map(([d, n]) => `${getDomainName(snap.domains, d)}(${n})`).join("、")}`);
    } else {
      lines.push(`- 主要领域：暂无`);
    }
    lines.push("");
    lines.push(`二、表现线索（基于记录频次，仅作参考，不作诊断）`);
    if (topIndicators.length) {
      for (const [iid, n] of topIndicators) {
        lines.push(`- ${getIndicatorText(snap.indicators, iid)}（出现 ${n} 次）`);
      }
    } else {
      lines.push(`- 暂无可汇总指标。`);
    }
    lines.push("");
    lines.push(`三、教师反思与建议（可由教师手动完善）`);
    lines.push(`- 在活动中继续提供支持性情境，鼓励幼儿表达与合作。`);
    lines.push(`- 与家长沟通：分享具体事件与可执行的家庭支持建议。`);
    lines.push("");
    lines.push(`四、附：近期记录摘要（最近 5 条）`);
    obs.slice(0, 5).forEach((o, idx) => {
      const domain = getDomainName(snap.domains, o.domainId);
      lines.push(`${idx + 1}. ${new Date(o.occurredAt).toLocaleString()} · ${domain} · ${o.note ? o.note.slice(0, 30) : "（无文字）"}`);
    });

    setReport(lines.join("\n"));
  }

  async function copy() {
    if (!report) return;
    await navigator.clipboard.writeText(report);
    alert("已复制到剪贴板");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">成长报告</h1>
        <p className="text-sm text-zinc-500 mt-1">基于观察记录自动汇总（频次/领域），输出可编辑文本报告。</p>
      </div>

      <Card title="选择幼儿">
        <div className="grid gap-3 md:grid-cols-3 items-end">
          <div className="md:col-span-2">
            <div className="text-xs text-zinc-500 mb-1">幼儿</div>
            <Select value={childId} onChange={(e) => setChildId(e.target.value)}>
              <option value="">请选择</option>
              {snap.children.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </div>
          <div className="flex gap-2">
            <Button onClick={generate} disabled={!childId}>生成</Button>
            <Button variant="ghost" onClick={copy} disabled={!report}>复制</Button>
          </div>
        </div>

        {child ? (
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <Tag>{child.className ?? "未填班级"}</Tag>
            <Tag>{obs.length} 条记录</Tag>
          </div>
        ) : null}
      </Card>

      <Card title="报告文本（可直接复制粘贴）">
        <Textarea value={report} onChange={(e) => setReport(e.target.value)} rows={18} placeholder="点击“生成”后这里会出现报告文本..." />
      </Card>
    </div>
  );
}
