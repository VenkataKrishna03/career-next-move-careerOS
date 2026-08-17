import { createServerFn } from "@tanstack/react-start";
import type { CareerRoadmap, RoadmapInput } from "./roadmap-types";

const SYSTEM_PROMPT = `You are a senior career coach and technical mentor.
Given a student's background, produce a realistic, personalized career roadmap.
Respond with ONLY valid JSON (no markdown fences) matching this shape:
{
  "careerPath": string,
  "summary": string,
  "readinessScore": number (0-100),
  "currentSkills": string[],
  "skillGaps": [{ "skill": string, "why": string, "priority": "high"|"medium"|"low" }],
  "phases": [{ "title": string, "duration": string, "focus": string, "tasks": string[] }],
  "weeklyPlan": string[],
  "projects": [{ "name": string, "description": string, "skills": string[] }],
  "jobReadinessTips": string[]
}
Rules: 5-8 skill gaps, 4-6 phases, 4-8 weekly plan lines, 3-4 projects, 5-7 tips.
Calibrate the timeline to the hours available per day. Be concrete and specific to the target role.`;

export const generateRoadmap = createServerFn({ method: "POST" })
  .inputValidator((data: RoadmapInput) => data)
  .handler(async ({ data }): Promise<CareerRoadmap> => {
    const googleKey = process.env["GOOGLE_API_KEY"];
    const lovableKey = process.env["LOVABLE_API_KEY"];
    if (!googleKey && !lovableKey) throw new Error("AI is not configured for this project.");

    const userPrompt = `Current education: ${data.education}
Current skills: ${data.skills}
Desired career / job role: ${data.targetRole}
Experience level: ${data.experienceLevel}
Hours available per day: ${data.hoursPerDay}`;

    let content = "";

    if (googleKey) {
      const res = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
        {
          method: "POST",
          headers: {
            "x-goog-api-key": googleKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: [{ role: "user", parts: [{ text: userPrompt }] }],
            generationConfig: { responseMimeType: "application/json" },
          }),
        },
      );

      if (res.status === 429)
        throw new Error("Rate limit reached. Please try again in a moment.");
      if (!res.ok) {
        const text = await res.text();
        console.error("Google AI error", res.status, text);
        throw new Error("The AI service could not generate your roadmap right now.");
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

      if (res.status === 429)
        throw new Error("Rate limit reached. Please try again in a moment.");
      if (res.status === 402)
        throw new Error("AI credits exhausted. Please add credits to continue.");
      if (!res.ok) {
        const text = await res.text();
        console.error("AI gateway error", res.status, text);
        throw new Error("The AI service could not generate your roadmap right now.");
      }

      const json = (await res.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      content = json.choices?.[0]?.message?.content ?? "";
    }

    const cleaned = content.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();

    let parsed: CareerRoadmap;
    try {
      parsed = JSON.parse(cleaned) as CareerRoadmap;
    } catch {
      const start = cleaned.indexOf("{");
      const end = cleaned.lastIndexOf("}");
      if (start === -1 || end === -1) throw new Error("The AI returned an unexpected response.");
      parsed = JSON.parse(cleaned.slice(start, end + 1)) as CareerRoadmap;
    }

    return {
      careerPath: parsed.careerPath ?? data.targetRole,
      summary: parsed.summary ?? "",
      readinessScore: Math.max(0, Math.min(100, Number(parsed.readinessScore) || 0)),
      currentSkills: parsed.currentSkills ?? [],
      skillGaps: parsed.skillGaps ?? [],
      phases: parsed.phases ?? [],
      weeklyPlan: parsed.weeklyPlan ?? [],
      projects: parsed.projects ?? [],
      jobReadinessTips: parsed.jobReadinessTips ?? [],
    };
  });
