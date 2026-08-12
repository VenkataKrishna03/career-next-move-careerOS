import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { BrandButton } from "@/components/ui/brand-button";
import { FormInput } from "@/components/ui/form-input";


export const Route = createFileRoute("/signin")({
  head: () => ({
    meta: [
      { title: "Sign In — CareerOS" },
      {
        name: "description",
        content:
          "Sign in to CareerOS and continue building your career with clarity and a clear next step.",
      },
      { property: "og:title", content: "Sign In — CareerOS" },
      {
        property: "og:description",
        content: "Continue building your career with clarity.",
      },
    ],
  }),
  component: SignInPage,
});

type Errors = Partial<Record<"email" | "password", string>>;


function SignInPage() {
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [notice, setNotice] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next: Errors = {};
    if (!values.email.trim()) next.email = "Please enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
      next.email = "Please enter a valid email address.";
    if (!values.password) next.password = "Please enter your password.";

    setErrors(next);
    setNotice(
      Object.keys(next).length === 0
        ? "Authentication will be connected in a future version."
        : "",
    );
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Continue building your career with clarity."
      note="Your career information should always remain yours."
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/signup" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form noValidate onSubmit={handleSubmit} className="space-y-5">
        <FormInput
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@university.edu"
          value={values.email}
          error={errors.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
        />
        <FormInput
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={values.password}
          error={errors.password}
          onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
        />

        <div className="flex items-center justify-between gap-4 text-sm">
          <label className="inline-flex items-center gap-2 text-muted-foreground">
            <input
              type="checkbox"
              name="remember"
              className="size-4 accent-[oklch(0.8752_0.1707_92.42)]"
            />
            Remember me
          </label>
          <button type="button" className="text-primary hover:underline">
            Forgot password?
          </button>
        </div>

        {notice ? (
          <p role="status" className="rounded-md border border-primary/50 px-4 py-3 text-sm text-foreground">
            {notice}
          </p>
        ) : null}

        <BrandButton type="submit" size="full">
          Sign In
        </BrandButton>
      </form>

      <div className="my-6 flex items-center gap-4">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
          Or
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <GoogleAuthButton />

    </AuthLayout>
  );
}
