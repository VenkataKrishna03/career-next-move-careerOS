import { useState } from "react";
import { Loader2 } from "lucide-react";
import { lovable } from "@/integrations/lovable/index";
import { BrandButton } from "@/components/ui/brand-button";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true" fill="currentColor">
      <path d="M21.35 11.1H12v3.2h5.35c-.25 1.5-1.85 4.4-5.35 4.4a6.1 6.1 0 1 1 0-12.2c1.75 0 2.92.74 3.59 1.38l2.45-2.36C16.46 3.9 14.42 3 12 3a9 9 0 1 0 0 18c5.2 0 8.63-3.65 8.63-8.79 0-.59-.06-1.04-.28-1.11Z" />
    </svg>
  );
}

export function GoogleAuthButton({ label = "Continue with Google" }: { label?: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    setError("");
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });

      if (result.error) {
        setError("We couldn't sign you in with Google. Please try again.");
        setLoading(false);
        return;
      }

      if (result.redirected) return;

      window.location.href = "/";
    } catch {
      setError("We couldn't sign you in with Google. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <BrandButton
        type="button"
        variant="outline"
        size="full"
        disabled={loading}
        aria-busy={loading}
        onClick={handleClick}
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <GoogleIcon />
        )}
        {loading ? "Connecting to Google…" : label}
      </BrandButton>
      {error ? (
        <p role="alert" className="text-center text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
