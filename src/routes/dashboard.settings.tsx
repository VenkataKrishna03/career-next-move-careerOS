import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon, DashboardLayout } from "@/components/dashboard/DashboardLayout";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({
    meta: [
      { title: "Settings — CareerOS" },
      {
        name: "description",
        content: "Manage your CareerOS account preferences, notifications and career goals.",
      },
      { property: "og:title", content: "Settings — CareerOS" },
      { property: "og:description", content: "Manage your CareerOS account preferences." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <DashboardLayout title="Settings" subtitle="Manage your CareerOS account.">
      <ComingSoon
        title="Settings are coming soon"
        description="Account preferences, notification controls and career goal management will live here."
      />
    </DashboardLayout>
  ),
});
