export default function SkeletonCard() {
  return (
    <div
      className="rounded-2xl border p-0 overflow-hidden animate-pulse"
      style={{
        borderColor: "rgb(var(--border))",
        background: "rgb(var(--card))",
      }}
    >
      <div className="h-40 bg-black/10 dark:bg-white/10" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-3/4 bg-black/10 dark:bg-white/10 rounded" />
        <div className="h-3 w-full bg-black/10 dark:bg-white/10 rounded" />
        <div className="h-3 w-5/6 bg-black/10 dark:bg-white/10 rounded" />
        <div className="h-9 w-full bg-black/10 dark:bg-white/10 rounded-xl" />
      </div>
    </div>
  );
}
