import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AuthState = {
  user: User | null;
  session: Session | null;
  loading: boolean;
};

/**
 * Reads the Lovable Cloud auth session and keeps it in sync with
 * sign-in, sign-up, token refresh and sign-out events.
 */
export function useAuth(): AuthState {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  return { user: session?.user ?? null, session, loading };
}

export function getDisplayName(user: User | null): string {
  if (!user) return "";
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const name = (meta['full_name'] || meta['name'] || meta['user_name']) as string | undefined;
  return name || user.email?.split("@")[0] || "Account";
}

export function getAvatarUrl(user: User | null): string | undefined {
  const meta = (user?.user_metadata ?? {}) as Record<string, unknown>;
  return (meta['avatar_url'] || meta['picture']) as string | undefined;
}

export function getInitials(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "U"
  );
}
