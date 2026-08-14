import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon, DashboardLayout } from "@/components/dashboard/DashboardLayout";

export const Route = createFileRoute("/dashboard/ai-interview")({
  head: () => ({
    meta: [
      { title: "AI Interview — CareerOS" },
      {
        name: "description",
        content: "Practice role-specific interview questions with an AI interviewer and get instant feedback.",
      },
      { property: "og:title", content: "AI Interview — CareerOS" },
      { property: "og:description", content: "Practice interviews with AI and get instant feedback." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <DashboardLayout title="AI Interview" subtitle="Practice before the real thing.">
      <ComingSoon
        title="AI Interview is coming soon"
        description="Mock interviews tailored to your target role, with scoring and feedback after every answer."
      />
    </DashboardLayout>
  ),
});
