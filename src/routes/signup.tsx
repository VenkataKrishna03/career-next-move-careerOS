import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { BrandButton } from "@/components/ui/brand-button";
import { FormInput } from "@/components/ui/form-input";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create Your CareerOS Account" },
      {
        name: "description",
        content:
          "Create your CareerOS account and begin a personalized, evidence-based career journey toward your target role.",
      },
      { property: "og:title", content: "Create Your CareerOS Account" },
      {
        property: "og:description",
        content: "Start building your career with clarity.",
      },
    ],
  }),
  component: SignUpPage,
});

type Errors = Partial<
  Record<"name" | "email" | "password" | "confirmPassword" | "terms", string>
>;

function SignUpPage() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [notice, setNotice] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next: Errors = {};
    if (!values.name.trim()) next.name = "Please enter your full name.";
    if (!values.email.trim()) next.email = "Please enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
      next.email = "Please enter a valid email address.";
    if (values.password.length < 8)
      next.password = "Password must be at least 8 characters.";
    if (values.confirmPassword !== values.password)
      next.confirmPassword = "Passwords do not match.";
    if (!terms) next.terms = "Please accept the Terms of Service and Privacy Policy.";

    setErrors(next);
    setNotice(
      Object.keys(next).length === 0
        ? "Account creation will be connected in a future version."
        : "",
    );
  }

  return (
    <AuthLayout
      title="Start building your career with clarity."
      subtitle="Create your CareerOS account and begin your personalized career journey."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/signin" className="font-medium text-primary hover:underline">
            Sign In
          </Link>
        </>
      }
    >
      <form noValidate onSubmit={handleSubmit} className="space-y-5">
        <FormInput
          label="Full Name"
          name="name"
          autoComplete="name"
          placeholder="Aditi Sharma"
          value={values.name}
          error={errors.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
        />
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
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={values.password}
          error={errors.password}
          onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
        />
        <FormInput
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          value={values.confirmPassword}
          error={errors.confirmPassword}
          onChange={(e) => setValues((v) => ({ ...v, confirmPassword: e.target.value }))}
        />

        <div>
          <label className="flex items-start gap-3 text-sm text-muted-foreground">
            <input
              type="checkbox"
              name="terms"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              aria-invalid={errors.terms ? true : undefined}
              className="mt-0.5 size-4 shrink-0 accent-[oklch(0.8752_0.1707_92.42)]"
            />
            <span>
              I agree to the <span className="text-primary">Terms of Service</span> and{" "}
              <span className="text-primary">Privacy Policy</span>.
            </span>
          </label>
          {errors.terms ? (
            <p className="mt-2 text-xs text-destructive">{errors.terms}</p>
          ) : null}
        </div>

        {notice ? (
          <p
            role="status"
            className="rounded-md border border-primary/50 px-4 py-3 text-sm text-foreground"
          >
            {notice}
          </p>
        ) : null}

        <BrandButton type="submit" size="full">
          Create Account
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
