"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, Button, Input, PageHeader, Tag } from "@/components/ui";
import { supabase } from "@/lib/supabaseClient";

export default function LoginClient() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [checking, setChecking] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const hasSupabase = !!supabase;
  const router = useRouter();
  const params = useSearchParams();
  const next = useMemo(() => params.get("next") || "/dashboard", [params]);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      if (!supabase) {
        if (active) setChecking(false);
        return;
      }
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.replace(next);
        return;
      }
      if (active) setChecking(false);
    }

    checkSession();

    const { data: sub } = supabase
      ? supabase.auth.onAuthStateChange((_event, session) => {
          if (session) router.replace(next);
        })
      : { data: { subscription: null } };

    return () => {
      active = false;
      sub?.subscription?.unsubscribe();
    };
  }, [next, router]);

  async function signInWithEmail() {
    if (!supabase) {
      setStatus("未配置 Supabase 环境变量。");
      return;
    }
    if (!email.trim()) {
      setStatus("请输入邮箱。");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    setSubmitting(false);

    if (error) {
      setStatus("发送失败：" + error.message);
      return;
    }

    setStatus("已发送登录链接，请检查邮箱。若未收到，请检查垃圾邮箱。");
  }

  async function signInWithGoogle() {
    if (!supabase) {
      setStatus("未配置 Supabase 环境变量。");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    setSubmitting(false);

    if (error) {
      setStatus("登录失败：" + error.message);
    }
  }

  if (checking) {
    return (
      <div className="min-h-[60vh] grid place-items-center text-sm text-slate-500">
        正在检查登录状态...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="账号与同步"
        title="登录与身份认证"
        subtitle="登录后可同步数据并启用家园分享。"
      />

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card title="邮箱登录">
          <div className="space-y-3">
            <div>
              <div className="text-xs text-slate-500 mb-1">邮箱</div>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
            </div>
            <Button onClick={signInWithEmail} disabled={!hasSupabase || submitting}>
              {submitting ? "处理中..." : "发送登录链接"}
            </Button>
            <div className="text-xs text-slate-500">建议使用园所官方邮箱，便于权限识别。</div>
            <div className="text-xs text-slate-400">登录后将跳转到：{next}</div>
          </div>
        </Card>

        <Card title="第三方登录">
          <div className="space-y-3">
            <Button variant="outline" onClick={signInWithGoogle} disabled={!hasSupabase || submitting}>
              {submitting ? "处理中..." : "使用 Google 登录"}
            </Button>
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

      <Card title="常见问题">
        <div className="space-y-2 text-xs text-slate-500">
          <div>没收到邮件：请检查垃圾邮箱或稍后重试。</div>
          <div>访问被拦截：登录后会自动跳回原页面。</div>
          <div>内部演示：可创建测试账号邮箱进行体验。</div>
        </div>
      </Card>
    </div>
  );
}
