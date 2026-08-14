import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { SkillGapPanel } from "@/components/dashboard/SkillGapPanel";
import { sampleDashboardData } from "@/lib/dashboard-data";

export const Route = createFileRoute("/dashboard/skill-gap")({
  head: () => ({
    meta: [
      { title: "Skill Gap — CareerOS" },
      {
        name: "description",
        content: "See the skills you already have, the ones you are missing and what to learn next.",
      },
      { property: "og:title", content: "Skill Gap — CareerOS" },
      { property: "og:description", content: "Skills you have, skills you are missing, what to learn next." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <DashboardLayout title="Skill Gap" subtitle="What you have, what you are missing.">
      <div className="max-w-2xl">
        <SkillGapPanel skills={sampleDashboardData.skills} />
      </div>
    </DashboardLayout>
  ),
});
