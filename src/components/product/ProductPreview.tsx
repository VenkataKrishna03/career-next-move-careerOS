import { ArrowUpRight, Target } from "lucide-react";

const skills = [
  { name: "Python", value: 72 },
  { name: "SQL", value: 48 },
  { name: "Power BI", value: 61 },
];

export function ProductPreview() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <span className="rounded-full border border-primary/50 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">
          Product Preview
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Target className="size-3.5 text-primary" aria-hidden="true" />
          Target Role: <span className="text-foreground">Data Analyst</span>
        </span>
      </div>

      <div className="rounded-xl border border-border bg-background p-5">
        <p className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
          Career Readiness
        </p>
        <div className="mt-2 flex items-end gap-2">
          <span className="font-display text-5xl leading-none font-bold text-primary">
            67
          </span>
          <span className="pb-1 text-sm text-muted-foreground">/ 100</span>
        </div>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary" style={{ width: "67%" }} />
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-border bg-background p-5">
        <p className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
          Skill Progress
        </p>
        <ul className="mt-4 space-y-4">
          {skills.map((s) => (
            <li key={s.name}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground">{s.name}</span>
                <span className="text-muted-foreground">{s.value}%</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${s.value}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 rounded-xl border border-primary/50 bg-background p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.14em] text-primary uppercase">
              Next Best Action
            </p>
            <p className="mt-2 text-base font-semibold text-foreground">
              Complete SQL Interview Practice
            </p>
          </div>
          <ArrowUpRight className="size-5 shrink-0 text-primary" aria-hidden="true" />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Priority: <span className="font-semibold text-primary">High</span>
        </p>
      </div>
    </div>
  );
}
