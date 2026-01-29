import { Card, PageHeader, Tag, Progress } from "@/components/ui";

export default function InsightsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="园所管理"
        title="数据看板"
        subtitle="班级与园所全局视角，关注指标覆盖与薄弱支持点。"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card title="观察总量">
          <div className="text-3xl font-semibold text-slate-900">128</div>
          <div className="text-xs text-slate-500 mt-1">近 30 天记录</div>
        </Card>
        <Card title="指标覆盖">
          <div className="text-3xl font-semibold text-slate-900">76%</div>
          <div className="text-xs text-slate-500 mt-1">覆盖 5 大领域</div>
        </Card>
        <Card title="薄弱支持点">
          <div className="text-3xl font-semibold text-slate-900">2</div>
          <div className="text-xs text-slate-500 mt-1">需要集中支持</div>
        </Card>
        <Card title="家长反馈">
          <div className="text-3xl font-semibold text-slate-900">42</div>
          <div className="text-xs text-slate-500 mt-1">本月互动条数</div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="领域覆盖情况">
          <div className="space-y-3 text-sm">
            <div>健康 <Progress value={78} /></div>
            <div>语言 <Progress value={64} /></div>
            <div>社会 <Progress value={82} /></div>
            <div>科学 <Progress value={58} /></div>
            <div>艺术 <Progress value={71} /></div>
          </div>
        </Card>

        <Card title="班级分布">
          <div className="flex flex-wrap gap-2">
            <Tag>大一班 · 32</Tag>
            <Tag>大二班 · 28</Tag>
            <Tag>中一班 · 18</Tag>
            <Tag>中二班 · 25</Tag>
            <Tag>小一班 · 25</Tag>
          </div>
          <div className="mt-3 text-xs text-slate-500">可下钻查看班级观察详情。</div>
        </Card>

        <Card title="改进提示">
          <div className="space-y-2 text-sm text-slate-600">
            <div>科学领域观察偏少，可安排探究活动。</div>
            <div>语言领域建议补充情境对话记录。</div>
            <div className="text-xs text-slate-500">建议每两周回顾一次看板趋势。</div>
          </div>
        </Card>
      </div>
    </div>
  );
}
