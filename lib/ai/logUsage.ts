import { prisma } from "@/lib/prisma";
import type { AiResult } from "./client";

type AiOperation = "JOB_MATCHING" | "RESUME_OPTIMIZATION" | "JOB_PARSING" | "INTERVIEW_GENERATION" | "INTERVIEW_EVALUATION";

// Rough placeholder per-token rates — these are NOT pulled from
// OpenRouter's actual pricing for whatever model you configure.
// For exact billing accuracy, query OpenRouter's generation endpoint
// (GET /api/v1/generation?id=...) after each call instead. This
// estimate exists so /admin/ai-usage has real numbers to show at all,
// not to be trusted as your actual bill.
const ESTIMATED_RATE_PER_TOKEN = { prompt: 0.0000003, completion: 0.0000015 };

export async function logAiUsage(operation: AiOperation, usage: AiResult["usage"], userId: string | null) {
  if (!usage) return; // some providers don't return usage — nothing to log
  const cost = usage.prompt_tokens * ESTIMATED_RATE_PER_TOKEN.prompt + usage.completion_tokens * ESTIMATED_RATE_PER_TOKEN.completion;

  await prisma.aiUsageLog.create({
    data: { operation, cost, userId },
  });
}