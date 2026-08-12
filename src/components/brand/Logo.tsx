import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  asLink?: boolean;
};

function Mark() {
  return (
    <span
      aria-hidden="true"
      className="grid size-8 shrink-0 place-items-center rounded-md border border-primary/60 bg-primary/10"
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none" strokeLinecap="round">
        <path d="M4 17L10 11L13.5 14.5L20 8" stroke="currentColor" strokeWidth="2" />
        <path d="M15 7.5H20.5V13" stroke="currentColor" strokeWidth="2" />
      </svg>
    </span>
  );
}

export function Logo({ className, asLink = true }: LogoProps) {
  const content = (
    <span className={cn("inline-flex items-center gap-2.5 text-primary", className)}>
      <Mark />
      <span className="font-display text-xl font-bold tracking-tight text-foreground">
        Career<span className="text-primary">OS</span>
      </span>
    </span>
  );

  if (!asLink) return content;

  return (
    <Link to="/" aria-label="CareerOS home" className="rounded-md">
      {content}
    </Link>
  );
}
