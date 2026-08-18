import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { callInterviewAI } from "./interview.server";
import type {
  InterviewQuestion,
  InterviewRecord,
  InterviewResult,
  InterviewSetup,
  SubmitInterviewInput,
} from "./interview-types";

const QUESTIONS_PROMPT = `You are an experienced interviewer conducting a mock interview.
Generate interview questions tailored to the candidate's target role, experience level and interview type.
Respond with ONLY valid JSON (no markdown fences) matching this shape:
{ "questions": [{ "question": string, "category": string }] }
Rules: exactly the requested number of questions, ordered from warm-up to hardest.
"category" is a short label such as "Behavioural", "SQL", "System Design", "Culture Fit".
HR type = behavioural/motivational only. Technical type = role-specific technical only.
Mixed = roughly half of each. Calibrate difficulty to the experience level. No numbering in the text.`;

const REVIEW_PROMPT = `You are a senior interviewer and career coach grading a mock interview.
Grade every answer honestly; empty or vague answers must score low.
Respond with ONLY valid JSON (no markdown fences) matching this shape:
{
  "overallScore": number (0-100),
  "communicationScore": number (0-100),
  "technicalScore": number (0-100),
  "summary": string (3-5 sentences),
  "strengths": string[],
  "improvements": string[],
  "answers": [{ "question": string, "answer": string, "score": number (0-100), "feedback": string, "improvedAnswer": string }],
  "recommendation": string (2-4 sentences of final advice with next steps)
}
Rules: one entry in "answers" for EVERY question in the same order, 3-6 strengths,
3-6 improvements, and an "improvedAnswer" that is a strong model answer for that question.`;

function parseJson<T>(content: string): T {
  const cleaned = content.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1) throw new Error("The AI returned an unexpected response.");
    return JSON.parse(cleaned.slice(start, end + 1)) as T;
  }
}

function clampScore(value: unknown): number {
  return Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
}

export const generateInterviewQuestions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: InterviewSetup) => {
    const targetRole = String(data.targetRole ?? "").trim().slice(0, 150);
    if (!targetRole) throw new Error("Please enter a target job role.");
    const questionCount = data.questionCount === 10 ? 10 : 5;
    return {
      targetRole,
      experienceLevel: data.experienceLevel,
      interviewType: data.interviewType,
      questionCount,
    };
  })
  .handler(async ({ data }): Promise<InterviewQuestion[]> => {
    const content = await callInterviewAI(
      QUESTIONS_PROMPT,
      `Target role: ${data.targetRole}
Experience level: ${data.experienceLevel}
Interview type: ${data.interviewType}
Number of questions: ${data.questionCount}`,
    );

    const parsed = parseJson<{ questions?: Array<{ question?: string; category?: string }> }>(content);
    const questions = (parsed.questions ?? [])
      .map((q, i) => ({
        id: i + 1,
        question: String(q.question ?? "").trim(),
        category: String(q.category ?? "General").trim(),
      }))
      .filter((q) => q.question.length > 0)
      .slice(0, data.questionCount);

    if (questions.length === 0) throw new Error("The AI could not generate questions. Please try again.");
    return questions;
  });

export const submitInterview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: SubmitInterviewInput) => {
    const targetRole = String(data.targetRole ?? "").trim().slice(0, 150);
    if (!targetRole) throw new Error("Missing target job role.");
    const answers = (data.answers ?? []).map((a) => ({
      question: String(a.question ?? "").trim(),
      answer: String(a.answer ?? "").trim().slice(0, 4000),
    }));
    if (answers.length === 0) throw new Error("No answers to review.");
    if (answers.some((a) => a.answer.length === 0))
      throw new Error("Please answer every question before submitting.");
    return {
      targetRole,
      experienceLevel: data.experienceLevel,
      interviewType: data.interviewType,
      questionCount: answers.length,
      answers,
    };
  })
  .handler(async ({ data, context }): Promise<InterviewRecord> => {
    const transcript = data.answers
      .map((a, i) => `Q${i + 1}: ${a.question}\nAnswer: ${a.answer}`)
      .join("\n\n");

    const content = await callInterviewAI(
      REVIEW_PROMPT,
      `Target role: ${data.targetRole}
Experience level: ${data.experienceLevel}
Interview type: ${data.interviewType}

Transcript:
${transcript}`,
    );

    const parsed = parseJson<Partial<InterviewResult>>(content);
    const answers = data.answers.map((a, i) => {
      const graded = parsed.answers?.[i];
      return {
        question: a.question,
        answer: a.answer,
        score: clampScore(graded?.score),
        feedback: graded?.feedback ?? "No feedback was returned for this answer.",
        improvedAnswer: graded?.improvedAnswer ?? "",
      };
    });

    const result: InterviewResult = {
      overallScore: clampScore(parsed.overallScore),
      communicationScore: clampScore(parsed.communicationScore),
      technicalScore: clampScore(parsed.technicalScore),
      summary: parsed.summary ?? "",
      strengths: parsed.strengths ?? [],
      improvements: parsed.improvements ?? [],
      answers,
      recommendation: parsed.recommendation ?? "",
    };

    const { data: row, error } = await context.supabase
      .from("interview_sessions")
      .insert({
        user_id: context.userId,
        target_role: data.targetRole,
        experience_level: data.experienceLevel,
        interview_type: data.interviewType,
        question_count: data.questionCount,
        overall_score: result.overallScore,
        communication_score: result.communicationScore,
        technical_score: result.technicalScore,
        result: result as unknown as import("@/integrations/supabase/types").Json,
      })
      .select("id, created_at")
      .single();

    if (error || !row) {
      console.error("interview session insert failed", error);
      throw new Error("Your interview was scored but we couldn't save it. Please try again.");
    }

    return {
      id: row.id,
      targetRole: data.targetRole,
      experienceLevel: data.experienceLevel,
      interviewType: data.interviewType,
      questionCount: data.questionCount,
      overallScore: result.overallScore,
      communicationScore: result.communicationScore,
      technicalScore: result.technicalScore,
      createdAt: row.created_at,
      result,
    };
  });

export const listInterviewSessions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<InterviewRecord[]> => {
    const { data, error } = await context.supabase
      .from("interview_sessions")
      .select(
        "id, target_role, experience_level, interview_type, question_count, overall_score, communication_score, technical_score, created_at, result",
      )
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("interview history load failed", error);
      throw new Error("We couldn't load your interview history.");
    }

    return (data ?? []).map((row) => ({
      id: row.id,
      targetRole: row.target_role,
      experienceLevel: row.experience_level,
      interviewType: row.interview_type,
      questionCount: row.question_count,
      overallScore: row.overall_score,
      communicationScore: row.communication_score,
      technicalScore: row.technical_score,
      createdAt: row.created_at,
      result: row.result as unknown as InterviewResult,
    }));
  });
