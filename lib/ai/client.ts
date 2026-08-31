

const AGENTROUTER_URL = "https://agentrouter.org";

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
  const apiKey = process.env.AGENTROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("AGENTROUTER_API_KEY is not set.");
  }

  const res = await fetch(AGENTROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.AGENTROUTER_MODEL || "claude-sonnet-4-5-20250929",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`AgentRouter error ${res.status}: ${errText}`);
  }

  const data: ChatCompletionResponse = await res.json();
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