"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallbackPage() {
  const [msg, setMsg] = useState("正在处理登录...");

  useEffect(() => {
    (async () => {
      if (!supabase) {
        setMsg("未配置 Supabase 环境变量，请先设置 NEXT_PUBLIC_SUPABASE_URL 与 NEXT_PUBLIC_SUPABASE_ANON_KEY。");
        return;
      }

      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      if (!code) {
        setMsg("未发现 code 参数，无法完成登录。");
        return;
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        setMsg("登录失败：" + error.message);
        return;
      }

      window.location.href = "/dashboard";
    })();
  }, []);

  return <div style={{ padding: 24 }}>{msg}</div>;
}
