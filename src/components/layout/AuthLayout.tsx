import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
  note?: string;
};

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
  note,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background px-5 py-10">
      <div className="mx-auto w-full max-w-md flex-1">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-4" aria-hidden="true" /> Back to home
        </Link>

        <main className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="flex justify-center">
            <Logo asLink={false} />
          </div>
          <h1 className="mt-7 text-center text-2xl font-bold text-foreground">{title}</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </main>

        <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
        {note ? (
          <p className="mt-6 text-center text-xs text-muted-foreground">{note}</p>
        ) : null}
      </div>
    </div>
  );
}
