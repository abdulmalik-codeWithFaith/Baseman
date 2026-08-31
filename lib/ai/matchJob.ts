import { callAi, parseJsonResponse, type AiResult } from "./client";

interface MatchInput {
  job: {
    title: string;
    description: string;
    requirements: string[];
    skills: string[];
  };
  profile: {
    title: string | null;
    bio: string | null;
    skills: string[];
  };
}

export interface MatchResult {
  match: number;
  strengths: string[];
  gaps: string[];
}

const SYSTEM_PROMPT = `You are an AI hiring assistant scoring how well a candidate fits a job.

Return ONLY a JSON object, no other text, in exactly this shape:
{"match": <integer 0-100>, "strengths": [<up to 4 short strings — specific skills or qualifications that clearly match>], "gaps": [<up to 3 short strings — what's missing or unclear>]}

Rules:
- Be honestly calibrated. 90+ means clearly strong for this specific role. Below 40 means missing core requirements.
- Never invent skills, experience, or qualifications the candidate didn't provide. If their profile is thin, reflect that honestly with a lower score and gaps that say so — don't be generous to compensate for missing information.
- Base strengths and gaps only on what's actually stated in the job and the profile.`;

export async function computeJobMatch({ job, profile }: MatchInput): Promise<MatchResult & { usage?: AiResult["usage"] }> {
  const userPrompt = `JOB
Title: ${job.title}
Requirements: ${job.requirements.length ? job.requirements.join(", ") : "Not specified"}
Skills needed: ${job.skills.length ? job.skills.join(", ") : "Not specified"}
Description: ${job.description}

CANDIDATE PROFILE
Title: ${profile.title || "Not specified"}
Bio: ${profile.bio || "Not specified"}
Skills: ${profile.skills.length ? profile.skills.join(", ") : "None listed"}`;

  const { content, usage } = await callAi(SYSTEM_PROMPT, userPrompt);
  const result = parseJsonResponse<MatchResult>(content);

  // Defensive clamping — don't trust the model to stay in range
  const match = Math.max(0, Math.min(100, Math.round(result.match)));

  return { match, strengths: result.strengths?.slice(0, 4) ?? [], gaps: result.gaps?.slice(0, 3) ?? [], usage };
}