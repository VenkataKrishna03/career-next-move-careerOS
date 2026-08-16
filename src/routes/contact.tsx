import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { CheckCircle2, GraduationCap, MessageSquare, Building2 } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { BrandButton } from "@/components/ui/brand-button";
import { FormInput, FormTextarea } from "@/components/ui/form-input";
import { FeatureCard } from "@/components/ui/feature-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { submitContact } from "@/lib/contact.functions";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact CareerOS — Questions, Feedback and Partnerships" },
      {
        name: "description",
        content:
          "Get in touch with the CareerOS team about the product, feedback, or partnerships with universities and organizations.",
      },
      { property: "og:title", content: "Contact CareerOS" },
      {
        property: "og:description",
        content: "Questions, feedback or partnership ideas? Reach out to the CareerOS team.",
      },
    ],
  }),
  component: ContactPage,
});

type Errors = Partial<Record<"name" | "email" | "subject" | "message", string>>;

const topics = [
  {
    icon: GraduationCap,
    title: "Students",
    description: "Questions about CareerOS.",
  },
  {
    icon: MessageSquare,
    title: "Feedback",
    description: "Ideas for improving the platform.",
  },
  {
    icon: Building2,
    title: "Partnerships",
    description: "Universities, organizations and companies.",
  },
];

function ContactPage() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const update = (key: keyof typeof values) => (v: string) =>
    setValues((prev) => ({ ...prev, [key]: v }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next: Errors = {};
    if (!values.name.trim()) next.name = "Please enter your full name.";
    if (!values.email.trim()) next.email = "Please enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
      next.email = "Please enter a valid email address.";
    if (!values.subject.trim()) next.subject = "Please enter a subject.";
    if (values.message.trim().length < 10)
      next.message = "Please write at least 10 characters.";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitError(null);
    setSending(true);
    const { error } = await supabase.from("contact_messages").insert({
      full_name: values.name.trim().slice(0, 100),
      email: values.email.trim().slice(0, 255),
      subject: values.subject.trim().slice(0, 200),
      message: values.message.trim().slice(0, 2000),
    });
    setSending(false);

    if (error) {
      setSubmitError("Something went wrong while sending your message. Please try again.");
      return;
    }

    setValues({ name: "", email: "", subject: "", message: "" });
    setSubmitted(true);
  }

  return (
    <SiteLayout>
      <section className="border-b border-border py-16 sm:py-20">
        <div className="container-page max-w-3xl">
          <h1 className="text-4xl leading-tight font-bold text-foreground sm:text-5xl">
            Have a question? <span className="text-primary">We'd love to hear</span> from
            you.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            Whether you're a student exploring CareerOS, interested in partnering with us,
            or simply want to share feedback, get in touch.
          </p>
        </div>
      </section>

      <section className="border-b border-border py-16 sm:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            {submitted ? (
              <div className="flex flex-col items-start gap-4">
                <CheckCircle2 className="size-8 text-primary" aria-hidden="true" />
                <h2 className="text-xl font-semibold text-foreground">
                  Message sent successfully!
                </h2>
                <p role="status" className="text-sm leading-relaxed text-muted-foreground">
                  Thanks for reaching out. We'll get back to you soon.
                </p>
                <BrandButton
                  variant="outline"
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setValues({ name: "", email: "", subject: "", message: "" });
                  }}
                >
                  Send another message
                </BrandButton>
              </div>
            ) : (
              <form noValidate onSubmit={handleSubmit} className="space-y-5">
                <FormInput
                  label="Full Name"
                  name="name"
                  autoComplete="name"
                  placeholder="Aditi Sharma"
                  value={values.name}
                  error={errors.name}
                  onChange={(e) => update("name")(e.target.value)}
                />
                <FormInput
                  label="Email Address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@university.edu"
                  value={values.email}
                  error={errors.email}
                  onChange={(e) => update("email")(e.target.value)}
                />
                <FormInput
                  label="Subject"
                  name="subject"
                  placeholder="Feedback on career readiness"
                  value={values.subject}
                  error={errors.subject}
                  onChange={(e) => update("subject")(e.target.value)}
                />
                <FormTextarea
                  label="Message"
                  name="message"
                  rows={6}
                  placeholder="Tell us what's on your mind."
                  value={values.message}
                  error={errors.message}
                  onChange={(e) => update("message")(e.target.value)}
                />
                {submitError ? (
                  <p
                    role="alert"
                    className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                  >
                    {submitError}
                  </p>
                ) : null}
                <BrandButton type="submit" size="full" disabled={sending}>
                  {sending ? "Sending..." : "Send Message"}
                </BrandButton>
              </form>
            )}
          </div>

          <div>
            <SectionHeading title="What can you contact us about?" className="max-w-none" />
            <div className="mt-6 grid gap-4">
              {topics.map((t) => (
                <FeatureCard key={t.title} {...t} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
