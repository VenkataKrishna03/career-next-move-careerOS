/** Server-only AI helper for the AI Interview feature. */
export async function callInterviewAI(systemPrompt: string, userPrompt: string): Promise<string> {
  const googleKey = process.env["GOOGLE_API_KEY"];
  const lovableKey = process.env["LOVABLE_API_KEY"];
  if (!googleKey && !lovableKey) throw new Error("AI is not configured for this project.");

  if (googleKey) {
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: { "x-goog-api-key": googleKey, "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: "user", parts: [{ text: userPrompt }] }],
          generationConfig: { responseMimeType: "application/json" },
        }),
      },
    );
    if (res.status === 429) throw new Error("Rate limit reached. Please try again shortly.");
    if (!res.ok) {
      console.error("Google AI error", res.status, await res.text());
      throw new Error("The AI service is unavailable right now. Please try again.");
    }
    const json = (await res.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    return json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
  }

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${lovableKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    }),
  });
  if (res.status === 429) throw new Error("Rate limit reached. Please try again shortly.");
  if (res.status === 402) throw new Error("AI credits exhausted. Please add credits to continue.");
  if (!res.ok) {
    console.error("AI gateway error", res.status, await res.text());
    throw new Error("The AI service is unavailable right now. Please try again.");
  }
  const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  return json.choices?.[0]?.message?.content ?? "";
}
