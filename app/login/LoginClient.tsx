"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, Button, Input, PageHeader, Tag } from "@/components/ui";
import { supabase } from "@/lib/supabaseClient";

export default function LoginClient() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const hasSupabase = !!supabase;
  const params = useSearchParams();
  const next = useMemo(() => params.get("next") || "/dashboard", [params]);

  async function signInWithEmail() {
    if (!supabase) {
      setStatus("未配置 Supabase 环境变量。");
      return;
    }
    if (!email.trim()) {
      setStatus("请输入邮箱。");
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });

    if (error) {
      setStatus("发送失败：" + error.message);
      return;
    }

    setStatus("已发送登录链接，请检查邮箱。");
  }

  async function signInWithGoogle() {
    if (!supabase) {
      setStatus("未配置 Supabase 环境变量。");
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });

    if (error) {
      setStatus("登录失败：" + error.message);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="账号与同步"
        title="登录与身份认证"
        subtitle="连接 Supabase 后支持多端同步与家园分享。"
      />

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card title="邮箱登录">
          <div className="space-y-3">
            <div>
              <div className="text-xs text-slate-500 mb-1">邮箱</div>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
            </div>
            <Button onClick={signInWithEmail} disabled={!hasSupabase}>发送登录链接</Button>
            <div className="text-xs text-slate-500">建议使用园所官方邮箱，便于权限识别。</div>
          </div>
        </Card>

        <Card title="第三方登录">
          <div className="space-y-3">
            <Button variant="outline" onClick={signInWithGoogle} disabled={!hasSupabase}>使用 Google 登录</Button>
            <div className="text-xs text-slate-500">需在 Supabase 控制台启用 OAuth Provider。</div>
            <div className="flex flex-wrap gap-2">
              <Tag>RBAC 角色</Tag>
              <Tag>园所/班级隔离</Tag>
              <Tag>家长分享</Tag>
            </div>
          </div>
        </Card>
      </div>

      <Card title="配置提示">
        <div className="text-sm text-slate-600">
          {!hasSupabase ? (
            <div>
              尚未检测到 Supabase 环境变量。请在 <code className="rounded bg-slate-100 px-1">.env.local</code> 中设置
              <code className="rounded bg-slate-100 px-1">NEXT_PUBLIC_SUPABASE_URL</code> 与
              <code className="rounded bg-slate-100 px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>。
            </div>
          ) : (
            <div>已检测到 Supabase 配置，可进行登录。</div>
          )}
          {status ? <div className="mt-3 text-xs text-slate-500">{status}</div> : null}
        </div>
      </Card>
    </div>
  );
}
