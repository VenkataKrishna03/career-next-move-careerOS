import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { BrandButton } from "@/components/ui/brand-button";
import { UserAvatar } from "@/components/auth/UserMenu";
import { getDisplayName, useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — CareerOS" },
      {
        name: "description",
        content:
          "View your CareerOS account details, including the name and email linked to your career intelligence profile.",
      },
      { property: "og:title", content: "My Profile — CareerOS" },
      { property: "og:description", content: "Your CareerOS account details." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, loading } = useAuth();

  return (
    <SiteLayout>
      <section className="container-page py-16">
        <h1 className="font-heading text-3xl font-bold text-foreground">My Profile</h1>

        {loading ? (
          <p className="mt-6 text-sm text-muted-foreground">Loading your profile…</p>
        ) : user ? (
          <div className="mt-8 max-w-xl rounded-xl border border-border p-6">
            <div className="flex items-center gap-4">
              <UserAvatar user={user} size="size-14" />
              <div className="min-w-0">
                <p className="truncate text-lg font-semibold text-foreground">
                  {getDisplayName(user)}
                </p>
                <p className="truncate text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 max-w-xl rounded-xl border border-border p-6">
            <p className="text-sm text-muted-foreground">
              You need to be signed in to view your profile.
            </p>
            <div className="mt-4">
              <BrandButton asChild size="sm">
                <Link to="/signin">Sign In</Link>
              </BrandButton>
            </div>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
