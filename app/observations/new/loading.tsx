export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="h-6 w-40 animate-pulse rounded-full bg-slate-200/80" />
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <div className="h-40 animate-pulse rounded-2xl bg-white/70" />
          <div className="h-32 animate-pulse rounded-2xl bg-white/70" />
        </div>
        <div className="space-y-4">
          <div className="h-40 animate-pulse rounded-2xl bg-white/70" />
          <div className="h-24 animate-pulse rounded-2xl bg-white/70" />
        </div>
      </div>
    </div>
  );
}
