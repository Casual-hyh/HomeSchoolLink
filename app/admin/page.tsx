import { Card, PageHeader, Tag, Button } from "@/components/ui";

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="系统配置"
        title="组织与权限"
        subtitle="园所、班级与角色管理，确保数据隔离与最小授权。"
        actions={
          <>
            <Button variant="outline" size="sm">导入成员</Button>
            <Button size="sm">新建角色</Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="组织结构">
          <div className="space-y-2 text-sm text-slate-600">
            <div>园所：示例幼儿园</div>
            <div>班级：大一班 / 大二班 / 中一班</div>
            <div>教师：12 人</div>
            <div>家长：168 人</div>
          </div>
        </Card>

        <Card title="角色与权限">
          <div className="space-y-2 text-sm text-slate-600">
            <div>园长：全局管理与自评</div>
            <div>教师：观察记录与报告</div>
            <div>家长：查看分享与反馈</div>
            <div className="text-xs text-slate-500">支持 RBAC 与分租户隔离。</div>
          </div>
        </Card>

        <Card title="安全合规">
          <div className="space-y-2 text-xs text-slate-500">
            <div>监护人同意、撤回与审计日志。</div>
            <div>数据导出 / 删除申请。</div>
            <div>最小化采集与分级授权。</div>
          </div>
        </Card>
      </div>

      <Card title="成员列表" action={<Button variant="outline" size="sm">筛选</Button>}>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            { name: "李园长", role: "园长", scope: "全园" },
            { name: "王老师", role: "教师", scope: "大一班" },
            { name: "张老师", role: "教师", scope: "中一班" },
            { name: "陈老师", role: "教师", scope: "大二班" },
          ].map((m) => (
            <div key={m.name} className="rounded-xl border border-white/60 bg-white/80 p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">{m.name}</div>
                <Tag>{m.role}</Tag>
              </div>
              <div className="mt-2 text-xs text-slate-500">权限范围：{m.scope}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
