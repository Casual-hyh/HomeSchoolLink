import { Suspense } from "react";
import LoginClient from "./LoginClient";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-sm text-slate-500">加载中...</div>}>
      <LoginClient />
    </Suspense>
  );
}
