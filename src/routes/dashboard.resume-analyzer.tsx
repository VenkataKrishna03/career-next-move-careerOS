import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon, DashboardLayout } from "@/components/dashboard/DashboardLayout";

export const Route = createFileRoute("/dashboard/resume-analyzer")({
  head: () => ({
    meta: [
      { title: "Resume Analyzer — CareerOS" },
      {
        name: "description",
        content: "Upload your resume and get AI feedback on structure, keywords and role alignment.",
      },
      { property: "og:title", content: "Resume Analyzer — CareerOS" },
      { property: "og:description", content: "AI feedback on your resume structure and keywords." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <DashboardLayout title="Resume Analyzer" subtitle="Make your resume match the role.">
      <ComingSoon
        title="Resume Analyzer is coming soon"
        description="You'll be able to upload a resume and get targeted AI feedback on wording, keywords and gaps."
      />
    </DashboardLayout>
  ),
});
