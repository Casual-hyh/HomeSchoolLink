"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const routes = [
  "/dashboard",
  "/observations",
  "/observations/new",
  "/children",
  "/reports",
  "/family",
  "/tasks",
  "/insights",
  "/quality",
];

export default function RoutePrefetch() {
  const router = useRouter();

  useEffect(() => {
    routes.forEach((route) => {
      router.prefetch(route);
    });
  }, [router]);

  return null;
}
