import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { ProgressPanel } from "@/components/dashboard/ProgressPanel";
import { SkillGapPanel } from "@/components/dashboard/SkillGapPanel";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { sampleDashboardData } from "@/lib/dashboard-data";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [
      { title: "Dashboard — CareerOS" },
      {
        name: "description",
        content:
          "Your CareerOS dashboard: career match score, skill gaps, roadmap progress and AI recommendations in one place.",
      },
      { property: "og:title", content: "Dashboard — CareerOS" },
      {
        property: "og:description",
        content: "Track your career readiness, skill gaps and next best actions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { overview, progress, skills, recommendations } = sampleDashboardData;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <section aria-label="Career overview" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {overview.map((stat) => (
            <StatCard key={stat.key} stat={stat} />
          ))}
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <ProgressPanel progress={progress} />
          <SkillGapPanel skills={skills} />
        </div>

        <section aria-labelledby="ai-recs">
          <h2 id="ai-recs" className="font-heading text-lg font-bold text-foreground">
            AI Career Recommendations
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {recommendations.map((rec) => (
              <article
                key={rec.title}
                className="rounded-xl border border-border p-5 transition-colors hover:border-primary"
              >
                <Sparkles className="size-5 text-primary" aria-hidden="true" />
                <h3 className="mt-3 font-heading text-base font-semibold text-foreground">
                  {rec.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{rec.description}</p>
                <span className="mt-4 inline-block rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                  {rec.impact}
                </span>
              </article>
            ))}
          </div>
        </section>

        <QuickActions />

        <Link
          to="/roadmap"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          Open the AI Roadmap Generator
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </DashboardLayout>
  );
}
