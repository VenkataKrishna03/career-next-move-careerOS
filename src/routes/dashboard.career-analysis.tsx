import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon, DashboardLayout } from "@/components/dashboard/DashboardLayout";

export const Route = createFileRoute("/dashboard/career-analysis")({
  head: () => ({
    meta: [
      { title: "Career Analysis — CareerOS" },
      {
        name: "description",
        content: "Analyze your career direction, strengths and role fit inside CareerOS.",
      },
      { property: "og:title", content: "Career Analysis — CareerOS" },
      { property: "og:description", content: "Analyze your career direction and role fit." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <DashboardLayout title="Career Analysis" subtitle="Understand your fit for your target role.">
      <ComingSoon
        title="Career Analysis is coming soon"
        description="This module will score your profile against real role requirements. Meanwhile, generate an AI roadmap to plan your next steps."
      />
    </DashboardLayout>
  ),
});
