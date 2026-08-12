import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type FeatureCardProps = {
  icon?: LucideIcon;
  title: string;
  description: string;
  index?: string;
  className?: string;
};

export function FeatureCard({
  icon: Icon,
  title,
  description,
  index,
  className,
}: FeatureCardProps) {
  return (
    <article
      className={cn(
        "group h-full rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/60",
        className,
      )}
    >
      <div className="mb-5 flex items-center justify-between">
        {Icon ? (
          <span className="grid size-10 place-items-center rounded-md border border-border bg-background text-primary transition-colors group-hover:border-primary/60">
            <Icon className="size-5" aria-hidden="true" />
          </span>
        ) : null}
        {index ? (
          <span className="font-display text-sm font-semibold text-primary">{index}</span>
        ) : null}
      </div>
      <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </article>
  );
}
