import { Card, PageHeader, Tag, Progress, Button } from "@/components/ui";

export default function QualityPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="园所管理"
        title="园本自评"
        subtitle="以证据为基础的质量改进闭环，追踪过程性指标与支持策略。"
        actions={
          <>
            <Button variant="outline" size="sm">导出自评报告</Button>
            <Button size="sm">新建自评周期</Button>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card title="当前周期">
          <div className="text-3xl font-semibold text-slate-900">2025 Q4</div>
          <div className="text-xs text-slate-500 mt-1">本周进行中</div>
        </Card>
        <Card title="证据覆盖度">
          <div className="text-3xl font-semibold text-slate-900">68%</div>
          <div className="mt-2"><Progress value={68} /></div>
        </Card>
        <Card title="薄弱维度">
          <div className="text-3xl font-semibold text-slate-900">3</div>
          <div className="text-xs text-slate-500 mt-1">需重点改进</div>
        </Card>
        <Card title="改进任务">
          <div className="text-3xl font-semibold text-slate-900">7</div>
          <div className="text-xs text-slate-500 mt-1">已生成行动项</div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="质量维度">
          <div className="space-y-3 text-sm">
            <div>过程性支持 <Progress value={72} /></div>
            <div>环境支持 <Progress value={61} /></div>
            <div>师幼互动 <Progress value={79} /></div>
            <div>家园协作 <Progress value={56} /></div>
          </div>
        </Card>

        <Card title="证据分布">
          <div className="flex flex-wrap gap-2">
            <Tag>观察记录 · 86</Tag>
            <Tag>活动设计 · 23</Tag>
            <Tag>家长反馈 · 42</Tag>
            <Tag>教师反思 · 28</Tag>
          </div>
          <div className="mt-3 text-xs text-slate-500">建议每项维度至少匹配 3 类证据。</div>
        </Card>

        <Card title="改进闭环">
          <div className="space-y-2 text-sm text-slate-600">
            <div>识别薄弱维度 → 制定支持策略</div>
            <div>跟踪执行 → 收集反馈</div>
            <div>复盘调整 → 进入下一周期</div>
            <div className="text-xs text-slate-500">强调过程可追踪与证据可复用。</div>
          </div>
        </Card>
      </div>

      <Card title="行动清单" action={<Button variant="outline" size="sm">查看全部</Button>}>
        <div className="space-y-3">
          {[
            {
              title: "提升家园协作活动频次",
              owner: "园所管理",
              due: "2 周内",
            },
            {
              title: "补齐科学领域探究活动记录",
              owner: "中一班",
              due: "1 周内",
            },
            {
              title: "优化观察记录模板字段",
              owner: "教研组",
              due: "本周",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-white/60 bg-white/80 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold">{item.title}</div>
                <Tag>{item.due}</Tag>
              </div>
              <div className="mt-2 text-xs text-slate-500">负责人：{item.owner}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
