import { Clock, Flag } from "lucide-react";
import { BrandButton } from "@/components/ui/brand-button";

export function NextActionCard() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
        Next Best Action
      </p>
      <h3 className="mt-3 text-2xl font-bold text-foreground">Practice SQL JOINs</h3>

      <dl className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-border bg-background p-4">
          <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Flag className="size-3.5 text-primary" aria-hidden="true" /> Priority
          </dt>
          <dd className="mt-1 font-semibold text-primary">High</dd>
        </div>
        <div className="rounded-lg border border-border bg-background p-4">
          <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="size-3.5 text-primary" aria-hidden="true" /> Estimated Time
          </dt>
          <dd className="mt-1 font-semibold text-foreground">45 minutes</dd>
        </div>
      </dl>

      <div className="mt-6 space-y-4 text-sm">
        <div>
          <p className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
            Why this matters
          </p>
          <p className="mt-1.5 leading-relaxed text-foreground/85">
            SQL is important for your target role and your current evidence is weaker than
            other required skills.
          </p>
        </div>
        <div>
          <p className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
            Expected outcome
          </p>
          <p className="mt-1.5 text-foreground/85">Improve SQL readiness</p>
        </div>
      </div>

      <BrandButton className="mt-7" size="full" type="button" disabled>
        Start Action
      </BrandButton>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Static product preview
      </p>
    </div>
  );
}
