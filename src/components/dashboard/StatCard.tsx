import type { OverviewStat } from "@/lib/dashboard-data";

export function StatCard({ stat }: { stat: OverviewStat }) {
  return (
    <article className="rounded-xl border border-border p-5 transition-colors hover:border-primary">
      <span aria-hidden="true" className="text-xl">
        {stat.emoji}
      </span>
      <p className="mt-3 text-sm font-medium text-muted-foreground">{stat.label}</p>
      <p className="mt-1 font-heading text-3xl font-bold text-primary">{stat.value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{stat.hint}</p>
    </article>
  );
}
