"use client";

import { useEffect } from "react";
import { ensureSeed } from "@/lib/seed";

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    ensureSeed();
  }, []);

  return <>{children}</>;
}
