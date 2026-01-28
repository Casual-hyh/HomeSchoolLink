export default function FamilyPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">家园共育</h1>
      <p className="text-sm text-zinc-500">
        这是家长协作入口的界面占位。后续接入：选择观察记录→生成分享链接/二维码→家长查看与反馈→推送家庭任务与建议。
      </p>

      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="text-sm font-semibold">下一步可做（按优先级）</div>
        <ol className="mt-2 list-decimal pl-5 text-sm text-zinc-700 space-y-1">
          <li>教师端：对某条观察记录点击“分享给家长”</li>
          <li>生成 shareCode（短码）与有效期</li>
          <li>家长端：/p/{'{'}shareCode{'}'} 查看记录与建议（只读）</li>
          <li>家长反馈：简单表单（完成/照片/留言）</li>
        </ol>
      </div>
    </div>
  );
}
