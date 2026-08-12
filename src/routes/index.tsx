import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Layers,
  Target,
  Compass,
  RefreshCw,
  Gauge,
  Brain,
  ShieldCheck,
  Briefcase,
  MessageSquare,
  ListChecks,
  GraduationCap,
  CalendarClock,
  Rocket,
} from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { BrandButton } from "@/components/ui/brand-button";
import { SectionHeading } from "@/components/ui/section-heading";
import { FeatureCard } from "@/components/ui/feature-card";
import { CTASection } from "@/components/ui/cta-section";
import { ProductPreview } from "@/components/product/ProductPreview";
import { NextActionCard } from "@/components/product/NextActionCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CareerOS — AI-Powered Career Intelligence for Students" },
      {
        name: "description",
        content:
          "CareerOS analyzes your skills, goals and job-market requirements to show students and fresh graduates the next best step toward their target role.",
      },
      {
        property: "og:title",
        content: "CareerOS — AI-Powered Career Intelligence for Students",
      },
      {
        property: "og:description",
        content:
          "Stop guessing what to do next in your career. CareerOS turns your career journey into an adaptive, evidence-based plan.",
      },
    ],
  }),
  component: HomePage,
});

const problems = [
  {
    icon: Layers,
    title: "Too Much Information",
    description:
      "Students have endless courses, tutorials and career advice but no clear priority.",
  },
  {
    icon: Target,
    title: "Unclear Skill Gaps",
    description: "Knowing a skill is different from proving that you can use it.",
  },
  {
    icon: Compass,
    title: "Generic Career Advice",
    description: "Most platforms give the same recommendations to everyone.",
  },
  {
    icon: RefreshCw,
    title: "No Feedback Loop",
    description:
      "Students apply, learn and interview, but rarely have a system that learns from their progress.",
  },
];

const steps = [
  { title: "Define Your Goal", description: "Choose the role you want." },
  {
    title: "Understand Your Current Position",
    description: "CareerOS analyzes your skills, projects and evidence.",
  },
  {
    title: "Find Your Gaps",
    description: "Identify the skills and abilities that matter most.",
  },
  {
    title: "Take the Next Best Action",
    description:
      "Focus on the highest-impact action instead of trying to do everything at once.",
  },
  {
    title: "Improve Through Feedback",
    description:
      "Your progress, assessments, applications and interviews continuously improve your career plan.",
  },
];

const features = [
  {
    icon: Gauge,
    title: "Career Readiness",
    description: "Track your overall career preparation.",
  },
  {
    icon: Brain,
    title: "Skill Intelligence",
    description: "Understand which skills matter for your target role.",
  },
  {
    icon: ShieldCheck,
    title: "Evidence-Based Progress",
    description: "Move beyond simply claiming skills.",
  },
  {
    icon: Briefcase,
    title: "Job Matching",
    description: "Understand how your profile aligns with opportunities.",
  },
  {
    icon: MessageSquare,
    title: "Interview Intelligence",
    description: "Learn from interview performance.",
  },
  {
    icon: ListChecks,
    title: "Adaptive Action Plans",
    description: "Know what to focus on next.",
  },
];

const audience = [
  {
    icon: GraduationCap,
    title: "Students",
    description: "Turn uncertainty into a structured career plan.",
  },
  {
    icon: CalendarClock,
    title: "Final-Year Students",
    description: "Identify gaps before graduation.",
  },
  {
    icon: Rocket,
    title: "Fresh Graduates",
    description: "Build evidence, improve readiness and apply strategically.",
  },
];

const struggles = [
  "What skills employers actually need",
  "What they should learn first",
  "Whether they are really job-ready",
  "Which applications to prioritize",
  "How interview performance affects their career readiness",
];

function HomePage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="border-b border-border bg-background py-16 sm:py-24">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="mb-5 inline-flex rounded-full border border-border px-3 py-1 text-xs font-semibold tracking-[0.16em] text-primary uppercase">
              Career Intelligence System
            </p>
            <h1 className="text-4xl leading-[1.08] font-bold text-foreground sm:text-5xl lg:text-6xl">
              Stop <span className="text-primary">Guessing</span> What to Do{" "}
              <span className="text-primary">Next</span> in Your Career.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              CareerOS continuously analyzes your skills, career goals, evidence and
              job-market requirements to help you take the next best step toward your
              target role.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <BrandButton asChild size="lg">
                <Link to="/signup">Get Started Free</Link>
              </BrandButton>
              <BrandButton asChild variant="outline" size="lg">
                <a href="#how-it-works">See How It Works</a>
              </BrandButton>
            </div>
          </div>

          <div className="lg:pl-4">
            <ProductPreview />
          </div>
        </div>
      </section>

      {/* Trust / positioning */}
      <section className="border-b border-border bg-surface py-16 sm:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:gap-16">
          <SectionHeading
            tone="light"
            eyebrow="Positioning"
            title={
              <>
                Built for the journey from student to{" "}
                <span className="text-surface-foreground underline decoration-primary decoration-4 underline-offset-4">
                  job-ready
                </span>
                .
              </>
            }
            description="CareerOS is designed specifically for students and fresh graduates who struggle to understand where they actually stand and what to do about it."
          />
          <ul className="space-y-3">
            {struggles.map((s) => (
              <li
                key={s}
                className="flex items-start gap-3 border-l-2 border-primary bg-surface-foreground/[0.03] px-4 py-3 text-sm font-medium text-surface-foreground"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Problem */}
      <section className="border-b border-border py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="The problem"
            title={
              <>
                The problem isn't a lack of information. It's knowing{" "}
                <span className="text-primary">what to do next</span>.
              </>
            }
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {problems.map((p) => (
              <FeatureCard key={p.title} {...p} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-b border-border py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading
            align="center"
            eyebrow="How CareerOS works"
            title={
              <>
                Your career journey becomes an{" "}
                <span className="text-primary">adaptive loop</span>.
              </>
            }
          />
          <ol className="relative mt-14 grid gap-8 lg:grid-cols-5">
            <div
              aria-hidden="true"
              className="absolute top-5 right-0 left-0 hidden h-px bg-primary/40 lg:block"
            />
            {steps.map((step, i) => (
              <li key={step.title} className="relative flex gap-4 lg:block">
                <div className="flex flex-col items-center lg:block">
                  <span className="relative z-10 grid size-10 shrink-0 place-items-center rounded-full border border-primary bg-background font-display text-sm font-bold text-primary">
                    {i + 1}
                  </span>
                  {i < steps.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className="mt-1 w-px flex-1 bg-primary/40 lg:hidden"
                    />
                  ) : null}
                </div>
                <div className="pb-6 lg:mt-5 lg:pb-0">
                  <h3 className="text-base font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Differentiator */}
      <section className="border-b border-border py-20 sm:py-24">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Core differentiator"
              title={
                <>
                  CareerOS doesn't just show your gaps. It{" "}
                  <span className="text-primary">prioritizes your next move</span>.
                </>
              }
            />
            <div className="mt-8 space-y-6">
              <div className="rounded-xl border border-border bg-card p-5">
                <p className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
                  Traditional career platforms say
                </p>
                <p className="mt-2 text-lg text-foreground">"You need to learn SQL."</p>
              </div>
              <div className="rounded-xl border border-primary/60 bg-card p-5">
                <p className="text-xs tracking-[0.14em] text-primary uppercase">
                  CareerOS aims to answer
                </p>
                <p className="mt-2 text-lg text-foreground">
                  "<span className="text-primary">Why</span> SQL,{" "}
                  <span className="text-primary">why now</span>, and{" "}
                  <span className="text-primary">what should you do after</span> learning
                  it?"
                </p>
              </div>
            </div>
          </div>
          <NextActionCard />
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-border py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Future product modules"
            title={
              <>
                Everything you need to move toward your{" "}
                <span className="text-primary">target role</span>.
              </>
            }
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* Audience */}
      <section className="border-b border-border py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading
            align="center"
            eyebrow="Who it's for"
            title={
              <>
                Built for <span className="text-primary">students</span> and{" "}
                <span className="text-primary">fresh graduates</span>.
              </>
            }
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {audience.map((a) => (
              <FeatureCard key={a.title} {...a} />
            ))}
          </div>
        </div>
      </section>

      <CTASection
        heading="Your career doesn't need another checklist."
        subheading="It needs a system that helps you decide what to do next."
        buttonLabel="Start Your Career Journey"
        to="/signup"
      />
    </SiteLayout>
  );
}
