/* ---------------------------------------------------------------
   Shared OpenRouter client. Defaults to "openrouter/free", which
   auto-routes to whatever model is currently free — individual
   :free model IDs on OpenRouter rotate out fairly often, so
   pointing at a specific one risks it silently disappearing later.
   Override OPENROUTER_MODEL in .env for a specific (paid) model
   once you want more consistent quality than the free tier.
---------------------------------------------------------------- */

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

interface UsageInfo {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

interface ChatCompletionResponse {
  choices: { message: { content: string } }[];
  usage?: UsageInfo;
  model: string;
}

export interface AiResult {
  content: string;
  usage?: UsageInfo;
}

export async function callAi(systemPrompt: string, userPrompt: string): Promise<AiResult> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not set.");
  }

  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      // Optional but recommended by OpenRouter for their own leaderboard/analytics
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-Title": "Baseman",
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL || "openrouter/free",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenRouter error ${res.status}: ${errText}`);
  }

  const rawText = await res.text();
  let data: ChatCompletionResponse;
  try {
    data = JSON.parse(rawText);
  } catch {
    throw new Error(
      `OpenRouter returned a non-JSON response (status ${res.status}). First 200 chars: ${rawText.slice(0, 200)}`
    );
  }

  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("No content returned from the model.");

  return { content, usage: data.usage };
}

// Models sometimes wrap JSON in ```json fences despite instructions not to —
// strip those defensively before parsing rather than trusting raw output.
export function parseJsonResponse<T>(content: string): T {
  const cleaned = content.replace(/```json\s*|\s*```/g, "").trim();
  return JSON.parse(cleaned) as T;
}