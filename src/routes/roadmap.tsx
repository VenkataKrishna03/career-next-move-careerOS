import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  AlertCircle,
  CheckCircle2,
  Compass,
  FolderGit2,
  Loader2,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { BrandButton } from "@/components/ui/brand-button";
import { FormInput, FormTextarea } from "@/components/ui/form-input";
import { generateRoadmap } from "@/lib/roadmap.functions";
import type { CareerRoadmap } from "@/lib/roadmap-types";

export const Route = createFileRoute("/roadmap")({
  head: () => ({
    meta: [
      { title: "AI Career Roadmap Generator — CareerOS" },
      {
        name: "description",
        content:
          "Generate a personalized, AI-powered career roadmap with skill gap analysis, a phase-wise learning plan, projects and job readiness tips.",
      },
      { property: "og:title", content: "AI Career Roadmap Generator — CareerOS" },
      {
        property: "og:description",
        content: "Turn your current skills into a step-by-step plan for your target role.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RoadmapPage,
});

type Errors = Partial<Record<keyof typeof initialValues, string>>;

const initialValues = {
  education: "",
  skills: "",
  targetRole: "",
  experienceLevel: "Beginner",
  hoursPerDay: "2",
};

const levels = ["Beginner", "Intermediate", "Advanced"];

function RoadmapPage() {
  const run = useServerFn(generateRoadmap);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CareerRoadmap | null>(null);

  const update = (key: keyof typeof initialValues) => (v: string) =>
    setValues((prev) => ({ ...prev, [key]: v }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next: Errors = {};
    if (!values.education.trim()) next.education = "Please enter your current education.";
    if (!values.skills.trim()) next.skills = "Please list at least one skill.";
    if (!values.targetRole.trim()) next.targetRole = "Please enter your desired role.";
    const hours = Number(values.hoursPerDay);
    if (!values.hoursPerDay.trim() || Number.isNaN(hours) || hours <= 0 || hours > 24)
      next.hoursPerDay = "Enter a number between 1 and 24.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setError(null);
    setLoading(true);
    try {
      const data = await run({ data: values });
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong generating your roadmap. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <SiteLayout>
      <section className="border-b border-border py-14 md:py-20">
        <div className="container-page">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="size-3.5" /> AI Career Roadmap Generator
          </div>
          <h1 className="mt-4 max-w-3xl text-3xl font-bold text-foreground md:text-5xl">
            Turn what you know into a plan for where you're going.
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">
            Tell CareerOS about your background and target role. You'll get a skill gap
            analysis, a phase-wise learning roadmap, project ideas and job readiness tips.
          </p>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="container-page grid gap-8 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="h-fit space-y-5 rounded-xl border border-border bg-card p-6"
          >
            <h2 className="text-lg font-semibold text-card-foreground">Your details</h2>

            <FormInput
              label="Current Education"
              name="education"
              placeholder="B.Tech CSE, 3rd year"
              value={values.education}
              onChange={(e) => update("education")(e.target.value)}
              error={errors.education}
            />

            <FormTextarea
              label="Current Skills"
              name="skills"
              rows={3}
              placeholder="Basic Python, HTML/CSS"
              value={values.skills}
              onChange={(e) => update("skills")(e.target.value)}
              error={errors.skills}
            />

            <FormInput
              label="Desired Career / Job Role"
              name="targetRole"
              placeholder="Data Analyst"
              value={values.targetRole}
              onChange={(e) => update("targetRole")(e.target.value)}
              error={errors.targetRole}
            />

            <div className="space-y-2">
              <label
                htmlFor="experienceLevel"
                className="block text-sm font-medium text-foreground"
              >
                Experience Level
              </label>
              <select
                id="experienceLevel"
                name="experienceLevel"
                value={values.experienceLevel}
                onChange={(e) => update("experienceLevel")(e.target.value)}
                className="h-11 w-full rounded-md border border-input bg-background px-3.5 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                {levels.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <FormInput
              label="Hours Available Per Day"
              name="hoursPerDay"
              type="number"
              min={1}
              max={24}
              value={values.hoursPerDay}
              onChange={(e) => update("hoursPerDay")(e.target.value)}
              error={errors.hoursPerDay}
            />

            <BrandButton type="submit" size="full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Generating your roadmap…
                </>
              ) : (
                "Generate My Career Roadmap"
              )}
            </BrandButton>

            {error ? (
              <p className="flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                {error}
              </p>
            ) : null}
          </form>

          <div>
            {loading ? <RoadmapSkeleton /> : null}
            {!loading && result ? <RoadmapResult data={result} /> : null}
            {!loading && !result ? (
              <div className="grid h-full min-h-64 place-items-center rounded-xl border border-dashed border-border p-10 text-center">
                <div>
                  <Compass className="mx-auto size-8 text-primary" />
                  <p className="mt-3 text-sm text-muted-foreground">
                    Your personalized roadmap will appear here.
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function RoadmapSkeleton() {
  return (
    <div className="space-y-4" aria-live="polite" aria-busy="true">
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 text-sm text-primary">
          <Loader2 className="size-4 animate-spin" /> Analyzing your profile…
        </div>
      </div>
      {[0, 1, 2].map((i) => (
        <div key={i} className="space-y-3 rounded-xl border border-border bg-card p-6">
          <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
          <div className="h-3 w-full animate-pulse rounded bg-muted" />
          <div className="h-3 w-4/5 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}

function Card({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="flex items-center gap-2 text-base font-semibold text-card-foreground">
        <Icon className="size-4 text-primary" />
        {title}
      </h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function priorityClass(priority: string) {
  if (priority === "high") return "border-primary/50 text-primary";
  if (priority === "medium") return "border-foreground/40 text-foreground";
  return "border-border text-muted-foreground";
}

function RoadmapResult({ data }: { data: CareerRoadmap }) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-primary/40 bg-card p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-primary">
          Recommended career path
        </p>
        <h2 className="mt-2 text-2xl font-bold text-card-foreground">{data.careerPath}</h2>
        {data.summary ? (
          <p className="mt-3 text-sm text-muted-foreground">{data.summary}</p>
        ) : null}

        <div className="mt-5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Career readiness</span>
            <span className="font-semibold text-primary">{data.readinessScore}/100</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${data.readinessScore}%` }}
            />
          </div>
        </div>
      </div>

      {data.currentSkills.length > 0 ? (
        <Card title="Current Skills" icon={CheckCircle2}>
          <ul className="flex flex-wrap gap-2">
            {data.currentSkills.map((s) => (
              <li
                key={s}
                className="rounded-full border border-border px-3 py-1 text-xs text-foreground"
              >
                {s}
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      {data.skillGaps.length > 0 ? (
        <Card title="Skill Gap Analysis" icon={Target}>
          <ul className="space-y-3">
            {data.skillGaps.map((g) => (
              <li
                key={g.skill}
                className="rounded-lg border border-border p-4 sm:flex sm:items-start sm:gap-4"
              >
                <span
                  className={`inline-block shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize ${priorityClass(g.priority)}`}
                >
                  {g.priority}
                </span>
                <div className="mt-2 sm:mt-0">
                  <p className="text-sm font-semibold text-card-foreground">{g.skill}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{g.why}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      {data.phases.length > 0 ? (
        <Card title="Step-by-Step Learning Roadmap" icon={TrendingUp}>
          <ol className="relative space-y-6 border-l border-border pl-6">
            {data.phases.map((p, i) => (
              <li key={`${p.title}-${i}`} className="relative">
                <span className="absolute -left-[31px] grid size-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <p className="text-sm font-semibold text-card-foreground">{p.title}</p>
                  <span className="rounded-full border border-primary/40 px-2 py-0.5 text-[11px] text-primary">
                    {p.duration}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{p.focus}</p>
                <ul className="mt-2 space-y-1">
                  {p.tasks?.map((t) => (
                    <li key={t} className="flex gap-2 text-xs text-foreground">
                      <span className="text-primary">•</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </Card>
      ) : null}

      {data.weeklyPlan.length > 0 ? (
        <Card title="Weekly / Phase-wise Plan" icon={Compass}>
          <ul className="grid gap-2 sm:grid-cols-2">
            {data.weeklyPlan.map((w) => (
              <li
                key={w}
                className="rounded-lg border border-border px-3 py-2 text-xs text-foreground"
              >
                {w}
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      {data.projects.length > 0 ? (
        <Card title="Recommended Projects" icon={FolderGit2}>
          <div className="grid gap-3 sm:grid-cols-2">
            {data.projects.map((p) => (
              <div key={p.name} className="rounded-lg border border-border p-4">
                <p className="text-sm font-semibold text-card-foreground">{p.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{p.description}</p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {p.skills?.map((s) => (
                    <li
                      key={s}
                      className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-foreground"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      {data.jobReadinessTips.length > 0 ? (
        <Card title="Job Readiness Tips" icon={Sparkles}>
          <ul className="space-y-2">
            {data.jobReadinessTips.map((t) => (
              <li key={t} className="flex gap-2 text-sm text-foreground">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                {t}
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
    </div>
  );
}
