import { Card, PageHeader, Tag, Button } from "@/components/ui";
import Link from "next/link";

export default function FamilyPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="家园共育"
        title="家园协作"
        subtitle="把可分享的观察转成家长可理解、可参与的共育任务。"
        actions={
          <Link className="rounded-full border border-slate-900 bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800" href="/tasks">
            查看家庭任务
          </Link>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="分享流程">
          <ol className="mt-2 list-decimal pl-5 text-sm text-slate-600 space-y-1">
            <li>选择观察记录并勾选“分享给家长”</li>
            <li>生成分享链接 / 二维码</li>
            <li>家长查看记录与建议</li>
            <li>家长上传反馈与佐证</li>
          </ol>
        </Card>

        <Card title="共享原则">
          <div className="space-y-2 text-xs text-slate-500">
            <div>分享内容应脱敏（隐藏其他幼儿信息）。</div>
            <div>强调观察事实，避免诊断性结论。</div>
            <div>提供可执行的家庭支持建议。</div>
          </div>
        </Card>

        <Card title="隐私与同意">
          <div className="space-y-2 text-xs text-slate-500">
            <div>监护人同意与撤回应记录在案。</div>
            <div>访问日志需可追溯。</div>
            <div>支持导出与删除申请。</div>
          </div>
        </Card>
      </div>

      <Card title="家长视角（示意）" action={<Button variant="outline" size="sm">预览分享页</Button>}>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-white/60 bg-white/80 p-4">
            <div className="text-sm font-semibold">观察摘要</div>
            <div className="mt-2 text-xs text-slate-500">幼儿在搭建活动中主动与同伴协作，能表达想法。</div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Tag>社会</Tag>
              <Tag>合作</Tag>
              <Tag>表达</Tag>
            </div>
          </div>
          <div className="rounded-xl border border-white/60 bg-white/80 p-4">
            <div className="text-sm font-semibold">家庭任务</div>
            <div className="mt-2 text-xs text-slate-500">和孩子一起完成“角色扮演合作游戏”，记录一次沟通过程。</div>
            <div className="mt-3 flex gap-2">
              <Tag>任务 2 天后到期</Tag>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
