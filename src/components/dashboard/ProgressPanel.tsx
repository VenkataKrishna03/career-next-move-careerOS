import { Link } from "@tanstack/react-router";
import { BrandButton } from "@/components/ui/brand-button";
import type { CareerProgress } from "@/lib/dashboard-data";

export function ProgressPanel({ progress }: { progress: CareerProgress }) {
  return (
    <section aria-labelledby="career-progress" className="rounded-xl border border-border p-6">
      <h2 id="career-progress" className="font-heading text-lg font-bold text-foreground">
        Career Progress
      </h2>

      <dl className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">Current goal</dt>
          <dd className="mt-1 text-sm text-foreground">{progress.goal}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">Target role</dt>
          <dd className="mt-1 text-sm font-semibold text-primary">{progress.targetRole}</dd>
        </div>
      </dl>

      <div className="mt-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Overall progress</span>
          <span className="font-semibold text-foreground">{progress.progress}%</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={progress.progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Overall career progress"
          className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-muted"
        >
          <div className="h-full rounded-full bg-primary" style={{ width: `${progress.progress}%` }} />
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-primary/40 bg-primary/10 p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Next recommended action</p>
        <p className="mt-1 font-heading text-base font-semibold text-foreground">{progress.nextStep}</p>
        <div className="mt-3">
          <BrandButton asChild size="sm">
            <Link to="/roadmap">Continue</Link>
          </BrandButton>
        </div>
      </div>
    </section>
  );
}
