import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Brain,
  CheckCircle2,
  History,
  Lightbulb,
  Loader2,
  MessageSquare,
  RotateCcw,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { BrandButton } from "@/components/ui/brand-button";
import { FormInput, FormTextarea } from "@/components/ui/form-input";
import {
  generateInterviewQuestions,
  listInterviewSessions,
  submitInterview,
} from "@/lib/interview.functions";
import type {
  ExperienceLevel,
  InterviewQuestion,
  InterviewRecord,
  InterviewType,
} from "@/lib/interview-types";

export const Route = createFileRoute("/dashboard/ai-interview")({
  head: () => ({
    meta: [
      { title: "AI Interview — CareerOS" },
      {
        name: "description",
        content:
          "Practice role-specific HR and technical interview questions with an AI interviewer and get scored feedback on every answer.",
      },
      { property: "og:title", content: "AI Interview — CareerOS" },
      {
        property: "og:description",
        content: "Run an AI mock interview and get scores, feedback and model answers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AiInterviewPage,
});

const EXPERIENCE_LEVELS: ExperienceLevel[] = ["Fresher", "Intermediate", "Experienced"];
const INTERVIEW_TYPES: InterviewType[] = ["HR", "Technical", "Mixed"];
const QUESTION_COUNTS = [5, 10];

type Stage = "setup" | "interview" | "results";

function Card({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof Brain;
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

function ScoreCard({ label, score }: { label: string; score: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 font-heading text-3xl font-bold text-foreground">
        {score}
        <span className="text-base text-muted-foreground">/100</span>
      </p>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary" style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

function OptionGroup<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-foreground">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={String(option)}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={option === value}
            className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
              option === value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
            }`}
          >
            {String(option)}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function AiInterviewPage() {
  const runQuestions = useServerFn(generateInterviewQuestions);
  const runSubmit = useServerFn(submitInterview);
  const loadHistory = useServerFn(listInterviewSessions);

  const [stage, setStage] = useState<Stage>("setup");
  const [targetRole, setTargetRole] = useState("");
  const [roleError, setRoleError] = useState<string | undefined>(undefined);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>("Fresher");
  const [interviewType, setInterviewType] = useState<InterviewType>("Mixed");
  const [questionCount, setQuestionCount] = useState<number>(5);

  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [answerError, setAnswerError] = useState<string | null>(null);

  const [starting, setStarting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [record, setRecord] = useState<InterviewRecord | null>(null);
  const [history, setHistory] = useState<InterviewRecord[]>([]);

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

  async function handleStart(event: FormEvent) {
    event.preventDefault();
    if (!targetRole.trim()) {
      setRoleError("Please enter a target job role.");
      return;
    }
    setRoleError(undefined);
    setError(null);
    setStarting(true);
    try {
      const generated = await runQuestions({
        data: { targetRole: targetRole.trim(), experienceLevel, interviewType, questionCount },
      });
      setQuestions(generated);
      setAnswers(generated.map(() => ""));
      setIndex(0);
      setAnswerError(null);
      setStage("interview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't start your interview.");
    } finally {
      setStarting(false);
    }
  }

  function updateAnswer(value: string) {
    setAnswers((prev) => prev.map((a, i) => (i === index ? value : a)));
    if (value.trim()) setAnswerError(null);
  }

  function goNext() {
    if (!(answers[index] ?? "").trim()) {
      setAnswerError("Please write an answer before moving on.");
      return;
    }
    setAnswerError(null);
    setIndex((i) => Math.min(i + 1, questions.length - 1));
  }

  async function handleSubmitInterview() {
    if (answers.some((a) => !a.trim())) {
      setAnswerError("Please answer every question before submitting.");
      return;
    }
    setAnswerError(null);
    setError(null);
    setSubmitting(true);
    try {
      const result = await runSubmit({
        data: {
          targetRole: targetRole.trim(),
          experienceLevel,
          interviewType,
          questionCount: questions.length,
          answers: questions.map((q, i) => ({ question: q.question, answer: answers[i] ?? "" })),
        },
      });
      setRecord(result);
      setHistory((prev) => [result, ...prev]);
      setStage("results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't score your interview.");
    } finally {
      setSubmitting(false);
    }
  }

  function resetToSetup() {
    setStage("setup");
    setQuestions([]);
    setAnswers([]);
    setIndex(0);
    setRecord(null);
    setError(null);
    setAnswerError(null);
  }

  const current = questions[index];
  const isLast = index === questions.length - 1;
  const progress = questions.length ? ((index + 1) / questions.length) * 100 : 0;

  return (
    <DashboardLayout title="AI Interview" subtitle="Practice before the real thing.">
      <div className="mx-auto max-w-5xl space-y-6">
        {error ? (
          <div className="flex items-start gap-3 rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <p>{error}</p>
          </div>
        ) : null}

        {stage === "setup" ? (
          <>
            <form
              onSubmit={handleStart}
              className="space-y-6 rounded-xl border border-border bg-card p-6"
            >
              <div>
                <h2 className="font-heading text-lg font-bold text-card-foreground">
                  Set up your mock interview
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Questions are generated live for your role, level and interview type.
                </p>
              </div>

              <FormInput
                label="Target job role"
                name="target-role"
                placeholder="e.g. Frontend Developer"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                error={roleError}
                disabled={starting}
              />

              <OptionGroup
                label="Experience level"
                options={EXPERIENCE_LEVELS}
                value={experienceLevel}
                onChange={setExperienceLevel}
              />
              <OptionGroup
                label="Interview type"
                options={INTERVIEW_TYPES}
                value={interviewType}
                onChange={setInterviewType}
              />
              <OptionGroup
                label="Number of questions"
                options={QUESTION_COUNTS}
                value={questionCount}
                onChange={setQuestionCount}
              />

              <BrandButton type="submit" size="lg" disabled={starting}>
                {starting ? (
                  <>
                    <Loader2 className="animate-spin" aria-hidden="true" />
                    Generating questions…
                  </>
                ) : (
                  <>
                    <Sparkles aria-hidden="true" />
                    Start Interview
                  </>
                )}
              </BrandButton>
            </form>

            {history.length > 0 ? (
              <Card title="Previous attempts" icon={History}>
                <ul className="space-y-2">
                  {history.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setRecord(item);
                          setStage("results");
                        }}
                        className="flex w-full items-center justify-between gap-4 rounded-md border border-border px-4 py-3 text-left transition-colors hover:border-primary"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium text-foreground">
                            {item.targetRole}
                          </span>
                          <span className="block text-xs text-muted-foreground">
                            {item.interviewType} · {item.questionCount} questions ·{" "}
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </span>
                        <span className="font-heading text-lg font-bold text-primary">
                          {item.overallScore}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </Card>
            ) : null}
          </>
        ) : null}

        {stage === "interview" && current ? (
          <div className="space-y-5 rounded-xl border border-border bg-card p-6">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-foreground">
                  Question {index + 1} of {questions.length}
                </p>
                <span className="rounded-full border border-primary/50 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {current.category}
                </span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <h2 className="font-heading text-lg font-bold text-card-foreground sm:text-xl">
              {current.question}
            </h2>

            <FormTextarea
              label="Your answer"
              name={`answer-${index}`}
              rows={9}
              placeholder="Structure your answer: situation, what you did, and the outcome."
              value={answers[index] ?? ""}
              onChange={(e) => updateAnswer(e.target.value)}
              error={answerError ?? undefined}
              disabled={submitting}
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <BrandButton
                type="button"
                variant="outline"
                onClick={() => {
                  setAnswerError(null);
                  setIndex((i) => Math.max(0, i - 1));
                }}
                disabled={index === 0 || submitting}
              >
                <ArrowLeft aria-hidden="true" />
                Previous
              </BrandButton>

              {isLast ? (
                <BrandButton type="button" onClick={() => void handleSubmitInterview()} disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin" aria-hidden="true" />
                      Scoring your interview…
                    </>
                  ) : (
                    <>
                      <CheckCircle2 aria-hidden="true" />
                      Submit Interview
                    </>
                  )}
                </BrandButton>
              ) : (
                <BrandButton type="button" onClick={goNext} disabled={submitting}>
                  Next
                  <ArrowRight aria-hidden="true" />
                </BrandButton>
              )}
            </div>
          </div>
        ) : null}

        {stage === "results" && record ? (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-heading text-xl font-bold text-foreground">
                  {record.targetRole} · {record.interviewType} interview
                </h2>
                <p className="text-sm text-muted-foreground">
                  {record.experienceLevel} · {record.questionCount} questions ·{" "}
                  {new Date(record.createdAt).toLocaleString()}
                </p>
              </div>
              <BrandButton type="button" variant="outline" onClick={resetToSetup}>
                <RotateCcw aria-hidden="true" />
                New interview
              </BrandButton>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <ScoreCard label="Overall score" score={record.overallScore} />
              <ScoreCard label="Communication" score={record.communicationScore} />
              <ScoreCard label="Technical knowledge" score={record.technicalScore} />
            </div>

            {record.result.summary ? (
              <Card title="Summary" icon={Brain}>
                <p>{record.result.summary}</p>
              </Card>
            ) : null}

            <div className="grid gap-4 lg:grid-cols-2">
              <Card title="Strengths" icon={TrendingUp}>
                <Bullets items={record.result.strengths} />
              </Card>
              <Card title="Areas for improvement" icon={Lightbulb}>
                <Bullets items={record.result.improvements} />
              </Card>
            </div>

            <Card title="Answer-by-answer feedback" icon={MessageSquare}>
              <ol className="space-y-4">
                {record.result.answers.map((item, i) => (
                  <li key={`${item.question}-${i}`} className="rounded-lg border border-border p-4">
                    <div className="flex items-start justify-between gap-4">
                      <p className="font-medium text-foreground">
                        Q{i + 1}. {item.question}
                      </p>
                      <span className="shrink-0 font-heading text-base font-bold text-primary">
                        {item.score}/100
                      </span>
                    </div>
                    <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Your answer: </span>
                      {item.answer}
                    </p>
                    <p className="mt-3 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Feedback: </span>
                      {item.feedback}
                    </p>
                    {item.improvedAnswer ? (
                      <p className="mt-3 rounded-md border border-primary/40 bg-primary/5 p-3 text-sm text-muted-foreground">
                        <span className="font-medium text-primary">Suggested answer: </span>
                        {item.improvedAnswer}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ol>
            </Card>

            {record.result.recommendation ? (
              <Card title="Final recommendation" icon={Sparkles}>
                <p>{record.result.recommendation}</p>
              </Card>
            ) : null}
          </div>
        ) : null}
      </div>
    </DashboardLayout>
  );
}
