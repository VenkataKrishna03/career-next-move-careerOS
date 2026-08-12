import { createFileRoute } from "@tanstack/react-router";
import { UserRound, FileCheck2, RefreshCw, ArrowRightCircle } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { SectionHeading } from "@/components/ui/section-heading";
import { FeatureCard } from "@/components/ui/feature-card";
import { CTASection } from "@/components/ui/cta-section";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About CareerOS — A Smarter Way to Navigate Careers" },
      {
        name: "description",
        content:
          "CareerOS helps students and fresh graduates make better career decisions through personalized, evidence-based and adaptive career intelligence.",
      },
      { property: "og:title", content: "About CareerOS" },
      {
        property: "og:description",
        content:
          "Our mission, vision and principles behind an adaptive career intelligence system for students.",
      },
    ],
  }),
  component: AboutPage,
});

const principles = [
  {
    icon: UserRound,
    title: "Personalized",
    description: "Every career journey is different.",
  },
  {
    icon: FileCheck2,
    title: "Evidence-Based",
    description: "Skills should be supported by meaningful evidence.",
  },
  {
    icon: RefreshCw,
    title: "Adaptive",
    description: "Recommendations should change as the user progresses.",
  },
  {
    icon: ArrowRightCircle,
    title: "Action-Oriented",
    description: "Career advice should lead to a clear next step.",
  },
];

const timeline = [
  { phase: "Today", title: "Understand your skills" },
  { phase: "Next", title: "Build evidence" },
  { phase: "Then", title: "Improve readiness" },
  { phase: "Next", title: "Target the right opportunities" },
  { phase: "Eventually", title: "Build a career" },
];

function AboutPage() {
  return (
    <SiteLayout>
      <section className="border-b border-border py-20 sm:py-28">
        <div className="container-page max-w-4xl">
          <p className="mb-5 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            About CareerOS
          </p>
          <h1 className="text-4xl leading-tight font-bold text-foreground sm:text-5xl">
            We're building a <span className="text-primary">smarter way</span> to navigate{" "}
            <span className="text-primary">careers</span>.
          </h1>
          <div className="mt-8 space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>CareerOS was created around a simple observation:</p>
            <p className="border-l-2 border-primary pl-5 text-foreground">
              Students don't necessarily lack career resources. They lack a system that
              understands where they are, where they want to go and what they should do
              next.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-border py-20 sm:py-24">
        <div className="container-page grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-8">
            <h2 className="text-2xl font-bold text-foreground">Our Mission</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              "Help every student and fresh graduate make better career decisions through{" "}
              <span className="text-primary">personalized</span>,{" "}
              <span className="text-primary">evidence-based</span> and{" "}
              <span className="text-primary">adaptive</span> career intelligence."
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-8">
            <h2 className="text-2xl font-bold text-foreground">Our Vision</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              "A world where students don't have to navigate their careers through{" "}
              <span className="text-primary">guesswork</span>."
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-border py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Principles"
            title={
              <>
                Why <span className="text-primary">CareerOS</span>
              </>
            }
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((p) => (
              <FeatureCard key={p.title} {...p} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading
            align="center"
            eyebrow="Long-term vision"
            title={
              <>
                From first skill to a <span className="text-primary">real career</span>.
              </>
            }
          />
          <ol className="relative mt-14 grid gap-8 lg:grid-cols-5">
            <div
              aria-hidden="true"
              className="absolute top-5 right-0 left-0 hidden h-px bg-primary/40 lg:block"
            />
            {timeline.map((item, i) => (
              <li key={item.title} className="relative flex gap-4 lg:block">
                <div className="flex flex-col items-center lg:block">
                  <span className="relative z-10 size-10 shrink-0 rounded-full border border-primary bg-background" />
                  {i < timeline.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className="mt-1 w-px flex-1 bg-primary/40 lg:hidden"
                    />
                  ) : null}
                </div>
                <div className="pb-6 lg:mt-5 lg:pb-0">
                  <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                    {item.phase}
                  </p>
                  <h3 className="mt-2 text-base font-semibold text-foreground">
                    {item.title}
                  </h3>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CTASection
        heading="Ready to build your career with clarity?"
        subheading="Create your CareerOS account and start with a clear next step."
        buttonLabel="Get Started"
        to="/signup"
      />
    </SiteLayout>
  );
}
