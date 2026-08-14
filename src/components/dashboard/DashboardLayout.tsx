import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Brain,
  FileText,
  Gauge,
  LayoutDashboard,
  LogOut,
  Map as MapIcon,
  Menu,
  Settings,
  Target,
  User as UserIcon,
  X,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { BrandButton } from "@/components/ui/brand-button";
import { UserAvatar } from "@/components/auth/UserMenu";
import { getDisplayName, useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export const dashboardNav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/profile", label: "My Profile", icon: UserIcon, exact: true },
  { to: "/dashboard/career-analysis", label: "Career Analysis", icon: Target, exact: true },
  { to: "/dashboard/skill-gap", label: "Skill Gap", icon: Gauge, exact: true },
  { to: "/roadmap", label: "Learning Roadmap", icon: MapIcon, exact: true },
  { to: "/dashboard/resume-analyzer", label: "Resume Analyzer", icon: FileText, exact: true },
  { to: "/dashboard/ai-interview", label: "AI Interview", icon: Brain, exact: true },
  { to: "/dashboard/settings", label: "Settings", icon: Settings, exact: true },
] as const;

export function DashboardLayout({
  title,
  subtitle,
  children,
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/signin", replace: true });
  }, [loading, user, navigate]);

  async function handleSignOut() {
    setOpen(false);
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

  if (loading || !user) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <p className="text-sm text-muted-foreground">Loading your dashboard…</p>
      </div>
    );
  }

  const name = getDisplayName(user);

  const sidebar = (
    <div className="flex h-full flex-col gap-6 p-5">
      <Logo />
      <nav aria-label="Dashboard" className="flex flex-1 flex-col gap-1">
        {dashboardNav.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: item.exact }}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground data-[status=active]:bg-primary data-[status=active]:text-primary-foreground"
          >
            <item.icon className="size-4 shrink-0" aria-hidden="true" />
            {item.label}
          </Link>
        ))}
      </nav>
      <button
        type="button"
        onClick={() => void handleSignOut()}
        className="flex items-center gap-3 rounded-md border border-border px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
      >
        <LogOut className="size-4" aria-hidden="true" />
        Logout
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="sticky top-0 hidden h-screen border-r border-border lg:block">{sidebar}</aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/70"
          />
          <div className="absolute inset-y-0 left-0 w-72 border-r border-border bg-background">
            {sidebar}
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
          <div className="flex items-center justify-between gap-4 px-5 py-4">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                className="grid size-10 shrink-0 place-items-center rounded-md border border-border lg:hidden"
              >
                <Menu className="size-5" />
              </button>
              <div className="min-w-0">
                <h1 className="truncate font-heading text-xl font-bold text-foreground sm:text-2xl">
                  {title ?? `Welcome back, ${name} 👋`}
                </h1>
                <p className="truncate text-sm text-muted-foreground">
                  {subtitle ?? "Let's continue building your career."}
                </p>
              </div>
            </div>
            <Link
              to="/profile"
              className="flex shrink-0 items-center gap-2 rounded-full border border-border px-2 py-1.5 transition-colors hover:border-primary"
            >
              <UserAvatar user={user} />
              <span className="hidden max-w-[10rem] truncate text-sm font-medium text-foreground sm:block">
                {name}
              </span>
            </Link>
          </div>
        </header>

        <main className="flex-1 px-5 py-6">{children}</main>
      </div>
    </div>
  );
}

export function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <div className={cn("mx-auto max-w-xl rounded-xl border border-border p-8 text-center")}>
      <X className="mx-auto size-6 text-primary" aria-hidden="true" />
      <h2 className="mt-4 font-heading text-xl font-bold text-foreground">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <div className="mt-6 flex justify-center">
        <BrandButton asChild size="sm">
          <Link to="/dashboard">Back to Dashboard</Link>
        </BrandButton>
      </div>
    </div>
  );
}
