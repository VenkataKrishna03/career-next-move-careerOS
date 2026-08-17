import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  History,
  Lightbulb,
  Loader2,
  TrendingUp,
  Upload,
  XCircle,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { BrandButton } from "@/components/ui/brand-button";
import { FormInput, FormTextarea } from "@/components/ui/form-input";
import { analyzeResume, listResumeAnalyses } from "@/lib/resume.functions";
import {
  extractResumeText,
  isAcceptedResume,
  MAX_RESUME_BYTES,
} from "@/lib/resume-extract";
import type { ResumeAnalysisRecord } from "@/lib/resume-types";

export const Route = createFileRoute("/dashboard/resume-analyzer")({
  head: () => ({
    meta: [
      { title: "Resume Analyzer — CareerOS" },
      {
        name: "description",
        content:
          "Upload your resume and get an AI score, matching and missing skills, keyword analysis and actionable improvements for your target role.",
      },
      { property: "og:title", content: "Resume Analyzer — CareerOS" },
      {
        property: "og:description",
        content: "AI feedback on your resume: score, skill match, keywords and fixes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResumeAnalyzerPage,
});

function Card({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof FileText;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/50">
      <h3 className="flex items-center gap-2 font-heading text-base font-bold text-card-foreground">
        <Icon className="size-4 text-primary" aria-hidden="true" />
        {title}
      </h3>
      <div className="mt-4 text-sm text-muted-foreground">{children}</div>
    </section>
  );
}

function Tags({ items, tone }: { items: string[]; tone: "good" | "bad" | "neutral" }) {
  if (items.length === 0) return <p className="text-sm text-muted-foreground">None found.</p>;
  const cls =
    tone === "good"
      ? "border-primary/50 bg-primary/10 text-primary"
      : tone === "bad"
        ? "border-destructive/50 text-destructive"
        : "border-border text-foreground";
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li key={item} className={`rounded-full border px-3 py-1 text-xs font-medium ${cls}`}>
          {item}
        </li>
      ))}
    </ul>
  );
}

function Bullets({ items }: { items: string[] }) {
  if (items.length === 0) return <p>Nothing to show.</p>;
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ResumeAnalyzerPage() {
  const run = useServerFn(analyzeResume);
  const loadHistory = useServerFn(listResumeAnalyses);

  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ file?: string; role?: string }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResumeAnalysisRecord | null>(null);
  const [history, setHistory] = useState<ResumeAnalysisRecord[]>([]);

  useEffect(() => {
    let active = true;
    loadHistory({})
      .then((rows) => {
        if (active) setHistory(rows);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [loadHistory]);

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const next = e.target.files?.[0] ?? null;
    setFieldErrors((prev) => ({ ...prev, file: undefined }));
    if (!next) return setFile(null);
    if (!isAcceptedResume(next)) {
      setFile(null);
      setFieldErrors((prev) => ({ ...prev, file: "Please upload a PDF or DOCX file." }));
      return;
    }
    if (next.size > MAX_RESUME_BYTES) {
      setFile(null);
      setFieldErrors((prev) => ({ ...prev, file: "File is too large (max 5 MB)." }));
      return;
    }
    setFile(next);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next: { file?: string; role?: string } = {};
    if (!file) next.file = "Please upload your resume (PDF or DOCX).";
    if (!targetRole.trim()) next.role = "Please enter your target job role.";
    setFieldErrors(next);
    if (Object.keys(next).length > 0 || !file) return;

    setError(null);
    setLoading(true);
    try {
      const resumeText = await extractResumeText(file);
      if (resumeText.trim().length < 100) {
        throw new Error(
          "We couldn't read enough text from that file. If it's a scanned resume, try a text-based PDF or DOCX.",
        );
      }
      const record = await run({
        data: {
          fileName: file.name,
          resumeText,
          targetRole: targetRole.trim(),
          jobDescription: jobDescription.trim(),
        },
      });
      setResult(record);
      setHistory((prev) => [record, ...prev].slice(0, 20));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong analyzing your resume. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  const analysis = result?.result;

  return (
    <DashboardLayout
      title="Resume Analyzer"
      subtitle="Upload your resume and see how well it matches your target role."
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="h-fit space-y-5 rounded-xl border border-border bg-card p-6"
        >
          <div className="space-y-2">
            <span className="block text-sm font-medium text-foreground">Resume (PDF or DOCX)</span>
            <label
              htmlFor="resume-file"
              className="flex cursor-pointer items-center gap-3 rounded-md border border-dashed border-input px-4 py-4 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
            >
              <Upload className="size-4 text-primary" aria-hidden="true" />
              <span className="truncate">{file ? file.name : "Choose a file (max 5 MB)"}</span>
            </label>
            <input
              id="resume-file"
              type="file"
              accept=".pdf,.docx"
              className="sr-only"
              onChange={onFileChange}
            />
            {fieldErrors.file ? (
              <p className="text-xs text-destructive">{fieldErrors.file}</p>
            ) : null}
          </div>

          <FormInput
            label="Job Role / Target Position"
            name="targetRole"
            placeholder="e.g. Data Analyst"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            error={fieldErrors.role}
          />

          <FormTextarea
            label="Job Description (optional)"
            name="jobDescription"
            rows={6}
            placeholder="Paste the job description for a sharper keyword match."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />

          <BrandButton type="submit" size="full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Analyzing…
              </>
            ) : (
              "Analyze Resume"
            )}
          </BrandButton>

          {error ? (
            <p
              role="alert"
              className="flex items-start gap-2 rounded-md border border-destructive/50 p-3 text-xs text-destructive"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              {error}
            </p>
          ) : null}

          {history.length > 0 ? (
            <div className="border-t border-border pt-5">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <History className="size-4 text-primary" aria-hidden="true" /> Previous analyses
              </h2>
              <ul className="mt-3 space-y-2">
                {history.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setResult(item);
                        setError(null);
                      }}
                      className="w-full rounded-md border border-border px-3 py-2 text-left transition-colors hover:border-primary"
                    >
                      <span className="flex items-center justify-between gap-3">
                        <span className="min-w-0 truncate text-xs font-medium text-foreground">
                          {item.targetRole}
                        </span>
                        <span className="shrink-0 text-xs font-bold text-primary">
                          {item.score}/100
                        </span>
                      </span>
                      <span className="mt-1 block truncate text-[11px] text-muted-foreground">
                        {item.fileName} · {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </form>

        <div className="min-w-0 space-y-6">
          {loading ? (
            <div className="grid place-items-center rounded-xl border border-border p-16 text-center">
              <Loader2 className="size-6 animate-spin text-primary" aria-hidden="true" />
              <p className="mt-4 text-sm text-muted-foreground">
                Reading your resume and scoring it against the role…
              </p>
            </div>
          ) : null}

          {!loading && !analysis ? (
            <div className="grid place-items-center rounded-xl border border-border p-16 text-center">
              <FileText className="size-6 text-primary" aria-hidden="true" />
              <h2 className="mt-4 font-heading text-lg font-bold text-foreground">
                No analysis yet
              </h2>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Upload a PDF or DOCX resume, add your target role, and CareerOS will score it and
                show exactly what to fix.
              </p>
            </div>
          ) : null}

          {!loading && analysis && result ? (
            <>
              <section className="rounded-xl border border-border bg-card p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Resume score for {result.targetRole}
                    </p>
                    <p className="mt-1 truncate text-sm text-muted-foreground">
                      {result.fileName}
                    </p>
                  </div>
                  <p className="font-heading text-4xl font-bold text-primary">
                    {analysis.score}
                    <span className="text-lg text-muted-foreground">/100</span>
                  </p>
                </div>
                <div
                  className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted"
                  role="progressbar"
                  aria-valuenow={analysis.score}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Resume score"
                >
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${analysis.score}%` }}
                  />
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{analysis.summary}</p>
              </section>

              <div className="grid gap-6 md:grid-cols-2">
                <Card title="Matching Skills" icon={CheckCircle2}>
                  <Tags items={analysis.matchingSkills} tone="good" />
                </Card>
                <Card title="Missing Skills" icon={XCircle}>
                  <Tags items={analysis.missingSkills} tone="bad" />
                </Card>
                <Card title="Keywords Found" icon={TrendingUp}>
                  <Tags items={analysis.keywords.presentKeywords} tone="neutral" />
                </Card>
                <Card title="Missing Keywords" icon={AlertCircle}>
                  <Tags items={analysis.keywords.missingKeywords} tone="bad" />
                </Card>
                <Card title="Strengths" icon={CheckCircle2}>
                  <Bullets items={analysis.strengths} />
                </Card>
                <Card title="Areas for Improvement" icon={AlertCircle}>
                  <Bullets items={analysis.improvements} />
                </Card>
              </div>

              <Card title="Actionable Suggestions" icon={Lightbulb}>
                <Bullets items={analysis.suggestions} />
              </Card>
            </>
          ) : null}
        </div>
      </div>
    </DashboardLayout>
  );
}
