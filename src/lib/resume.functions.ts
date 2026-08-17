import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type {
  ResumeAnalysisInput,
  ResumeAnalysisRecord,
  ResumeAnalysisResult,
} from "./resume-types";

const SYSTEM_PROMPT = `You are an expert technical recruiter and resume reviewer.
Analyze the candidate's resume against the target role (and job description when provided).
Respond with ONLY valid JSON (no markdown fences) matching this shape:
{
  "score": number (0-100),
  "summary": string (3-5 sentences on how well the resume matches the role),
  "matchingSkills": string[],
  "missingSkills": string[],
  "keywords": { "presentKeywords": string[], "missingKeywords": string[] },
  "strengths": string[],
  "improvements": string[],
  "suggestions": string[]
}
Rules: 5-12 matching skills, 4-10 missing skills, 5-12 keywords per list, 3-6 strengths,
3-6 improvements, 4-7 concrete actionable suggestions. Be specific and reference the
resume's real content. Never invent experience the resume does not contain.`;

export const analyzeResume = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: ResumeAnalysisInput) => {
    const fileName = String(data.fileName ?? "").trim().slice(0, 200);
    const resumeText = String(data.resumeText ?? "").trim();
    const targetRole = String(data.targetRole ?? "").trim().slice(0, 150);
    const jobDescription = String(data.jobDescription ?? "").trim().slice(0, 6000);
    if (!fileName) throw new Error("Please upload a resume file.");
    if (resumeText.length < 100)
      throw new Error("We couldn't read enough text from that file. Try another resume.");
    if (!targetRole) throw new Error("Please enter a target job role.");
    return { fileName, resumeText: resumeText.slice(0, 24000), targetRole, jobDescription };
  })
  .handler(async ({ data, context }): Promise<ResumeAnalysisRecord> => {
    const googleKey = process.env["GOOGLE_API_KEY"];
    const lovableKey = process.env["LOVABLE_API_KEY"];
    if (!googleKey && !lovableKey) throw new Error("AI is not configured for this project.");

    const userPrompt = `Target role: ${data.targetRole}
${data.jobDescription ? `Job description:\n${data.jobDescription}\n` : ""}
Resume text:
${data.resumeText}`;

    let content = "";

    if (googleKey) {
      const res = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
        {
          method: "POST",
          headers: { "x-goog-api-key": googleKey, "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: [{ role: "user", parts: [{ text: userPrompt }] }],
            generationConfig: { responseMimeType: "application/json" },
          }),
        },
      );
      if (res.status === 429) throw new Error("Rate limit reached. Please try again shortly.");
      if (!res.ok) {
        console.error("Google AI error", res.status, await res.text());
        throw new Error("The AI service could not analyze your resume right now.");
      }
      const json = (await res.json()) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      };
      content = json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
    } else {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lovableKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
          ],
          response_format: { type: "json_object" },
        }),
      });
      if (res.status === 429) throw new Error("Rate limit reached. Please try again shortly.");
      if (res.status === 402) throw new Error("AI credits exhausted. Please add credits.");
      if (!res.ok) {
        console.error("AI gateway error", res.status, await res.text());
        throw new Error("The AI service could not analyze your resume right now.");
      }
      const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
      content = json.choices?.[0]?.message?.content ?? "";
    }

    const cleaned = content.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
    let parsed: Partial<ResumeAnalysisResult>;
    try {
      parsed = JSON.parse(cleaned) as Partial<ResumeAnalysisResult>;
    } catch {
      const start = cleaned.indexOf("{");
      const end = cleaned.lastIndexOf("}");
      if (start === -1 || end === -1) throw new Error("The AI returned an unexpected response.");
      parsed = JSON.parse(cleaned.slice(start, end + 1)) as Partial<ResumeAnalysisResult>;
    }

    const result: ResumeAnalysisResult = {
      score: Math.max(0, Math.min(100, Math.round(Number(parsed.score) || 0))),
      summary: parsed.summary ?? "",
      matchingSkills: parsed.matchingSkills ?? [],
      missingSkills: parsed.missingSkills ?? [],
      keywords: {
        presentKeywords: parsed.keywords?.presentKeywords ?? [],
        missingKeywords: parsed.keywords?.missingKeywords ?? [],
      },
      strengths: parsed.strengths ?? [],
      improvements: parsed.improvements ?? [],
      suggestions: parsed.suggestions ?? [],
    };

    const { data: row, error } = await context.supabase
      .from("resume_analyses")
      .insert({
        user_id: context.userId,
        file_name: data.fileName,
        target_role: data.targetRole,
        job_description: data.jobDescription || null,
        score: result.score,
        result: result as unknown as Record<string, unknown>,
      })
      .select("id, created_at")
      .single();

    if (error || !row) {
      console.error("resume analysis insert failed", error);
      throw new Error("Analysis finished but we couldn't save it. Please try again.");
    }

    return {
      id: row.id,
      fileName: data.fileName,
      targetRole: data.targetRole,
      score: result.score,
      createdAt: row.created_at,
      result,
    };
  });

export const listResumeAnalyses = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ResumeAnalysisRecord[]> => {
    const { data, error } = await context.supabase
      .from("resume_analyses")
      .select("id, file_name, target_role, score, created_at, result")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("resume analysis list failed", error);
      throw new Error("We couldn't load your analysis history.");
    }

    return (data ?? []).map((row) => ({
      id: row.id,
      fileName: row.file_name,
      targetRole: row.target_role,
      score: row.score,
      createdAt: row.created_at,
      result: row.result as unknown as ResumeAnalysisResult,
    }));
  });
