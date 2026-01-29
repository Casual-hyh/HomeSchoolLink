"use client";

import { useEffect } from "react";
import { ensureSeed } from "@/lib/seed";
import AuthGate from "@/components/AuthGate";

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    ensureSeed();
  }, []);

  return <AuthGate>{children}</AuthGate>;
}
