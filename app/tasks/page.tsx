import { Card, PageHeader, Tag, Button, Progress } from "@/components/ui";

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="家园共育"
        title="家庭任务"
        subtitle="把观察转为家长可执行的小任务，促进家庭场景中的持续支持。"
        actions={
          <Button size="sm">新建任务</Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card title="待完成">
          <div className="text-3xl font-semibold text-slate-900">6</div>
          <div className="text-xs text-slate-500 mt-1">近 7 天</div>
        </Card>
        <Card title="本周完成率">
          <div className="text-3xl font-semibold text-slate-900">72%</div>
          <div className="mt-2"><Progress value={72} /></div>
        </Card>
        <Card title="家长反馈">
          <div className="text-3xl font-semibold text-slate-900">19</div>
          <div className="text-xs text-slate-500 mt-1">含图片/视频</div>
        </Card>
        <Card title="高频任务">
          <div className="text-3xl font-semibold text-slate-900">3</div>
          <div className="text-xs text-slate-500 mt-1">需要优化模板</div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card title="任务列表" action={<Button variant="outline" size="sm">筛选</Button>}>
          <div className="space-y-3">
            {[
              {
                title: "合作搭建小任务",
                desc: "与孩子一起完成一次合作搭建，并记录沟通过程。",
                tags: ["社会", "合作"],
                due: "2 天后",
                status: "进行中",
              },
              {
                title: "科学观察记录",
                desc: "在家观察一件物品变化，拍照并留言。",
                tags: ["科学", "观察"],
                due: "今天",
                status: "待完成",
              },
              {
                title: "语言表达练习",
                desc: "让孩子复述一段故事并录音。",
                tags: ["语言", "表达"],
                due: "3 天后",
                status: "已完成",
              },
            ].map((task) => (
              <div key={task.title} className="rounded-xl border border-white/60 bg-white/80 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold">{task.title}</div>
                  <Tag className={task.status === "已完成" ? "bg-emerald-50 text-emerald-700" : ""}>{task.status}</Tag>
                </div>
                <div className="mt-2 text-xs text-slate-500">{task.desc}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {task.tags.map((t) => <Tag key={t}>{t}</Tag>)}
                  <Tag>截止：{task.due}</Tag>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <Card title="任务模板">
            <div className="space-y-2 text-sm text-slate-600">
              <div>协作游戏</div>
              <div>亲子阅读</div>
              <div>科学观察</div>
              <div>艺术创作</div>
              <div className="text-xs text-slate-500">后续支持一键引用与批量推送。</div>
            </div>
          </Card>

          <Card title="反馈维度">
            <div className="space-y-2 text-xs text-slate-500">
              <div>完成度 + 情境说明 + 家长感受。</div>
              <div>支持图片/音频/视频佐证。</div>
              <div>教师可在后台统一点评。</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
