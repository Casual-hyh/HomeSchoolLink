"use client";

import { useMemo } from "react";

export function Card({
  title,
  action,
  children,
  className = "",
}: {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={
        "group relative overflow-hidden rounded-2xl p-4 backdrop-blur transition hover:-translate-y-0.5 " +
        "glass-edge " +
        className
      }
    >
      <div className="pointer-events-none absolute inset-x-0 -top-24 h-24 bg-gradient-to-r from-cyan-200/40 via-white/10 to-emerald-200/30 opacity-0 transition group-hover:opacity-100" />
      <span className="shimmer group-hover:opacity-100" />
      {title ? (
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold">{title}</div>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function Button(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "ghost" | "danger" | "outline";
    size?: "sm" | "md";
  }
) {
  const { variant = "primary", size = "md", className = "", ...rest } = props;
  const cls = useMemo(() => {
    const base =
      "inline-flex items-center justify-center rounded-full font-medium transition disabled:opacity-50 disabled:cursor-not-allowed";
    const sizeCls = size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";
    if (variant === "primary") {
      return (
        base +
        " " +
        sizeCls +
        " bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-[0_16px_40px_-24px_rgba(15,23,42,0.9)] hover:translate-y-[-1px] hover:shadow-[0_24px_60px_-30px_rgba(15,23,42,0.9)] " +
        className
      );
    }
    if (variant === "danger") {
      return base + " " + sizeCls + " bg-red-600 text-white hover:bg-red-500 " + className;
    }
    if (variant === "outline") {
      return base + " " + sizeCls + " border border-slate-300 bg-white/80 text-slate-700 hover:bg-white " + className;
    }
    return base + " " + sizeCls + " bg-transparent hover:bg-white/80 border border-white/70 text-slate-700 " + className;
  }, [variant, size, className]);

  return (
    <button className={cls} {...rest}>
      <span className="relative z-10">{props.children}</span>
      <span className="absolute inset-0 opacity-0 transition group-hover:opacity-100" />
    </button>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;
  return (
    <input
      className={
        "w-full rounded-xl border border-slate-200/70 bg-white/80 px-3 py-2 text-sm outline-none transition focus:-translate-y-0.5 focus:ring-2 focus:ring-slate-300/60 " +
        className
      }
      {...rest}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const { className = "", ...rest } = props;
  return (
    <select
      className={
        "w-full rounded-xl border border-slate-200/70 bg-white/80 px-3 py-2 text-sm outline-none transition focus:-translate-y-0.5 focus:ring-2 focus:ring-slate-300/60 " +
        className
      }
      {...rest}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = "", ...rest } = props;
  return (
    <textarea
      className={
        "w-full rounded-xl border border-slate-200/70 bg-white/80 px-3 py-2 text-sm outline-none transition focus:-translate-y-0.5 focus:ring-2 focus:ring-slate-300/60 " +
        className
      }
      {...rest}
    />
  );
}

export function Tag({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={
        "inline-flex items-center rounded-full border border-white/60 bg-white/70 px-2 py-0.5 text-xs text-slate-600 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.7)] " +
        className
      }
    >
      {children}
    </span>
  );
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow ? <div className="text-xs uppercase tracking-[0.3em] text-slate-400">{eyebrow}</div> : null}
        <h1 className="mt-1 text-2xl font-semibold">{title}</h1>
        {subtitle ? <p className="mt-2 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  className = "",
}: {
  label: string;
  value: string | number;
  hint?: string;
  className?: string;
}) {
  return (
    <Card className={"relative overflow-hidden " + className}>
      <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</div>
      <div className="mt-3 text-3xl font-semibold text-slate-900">{value}</div>
      {hint ? <div className="mt-2 text-xs text-slate-500">{hint}</div> : null}
      <div className="pointer-events-none absolute -right-8 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-cyan-200/40 via-white/10 to-emerald-200/30 blur-2xl" />
    </Card>
  );
}

export function Progress({ value }: { value: number }) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className="h-2 w-full rounded-full bg-slate-200/70">
      <div
        className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
