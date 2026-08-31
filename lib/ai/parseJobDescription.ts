import { callAi, parseJsonResponse, type AiResult } from "./client";

export interface ParsedJob {
  title: string;
  location: string;
  remote: "REMOTE" | "HYBRID" | "ONSITE";
  employment: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
  experience: "ENTRY" | "MID" | "SENIOR";
  salary: string | null;
  skills: string[];
  description: string;
}

const SYSTEM_PROMPT = `Extract structured job posting data from raw pasted text (which may be messy — copied from a doc, email, or old listing).

Return ONLY a JSON object, no other text, in exactly this shape:
{"title": string, "location": string, "remote": "REMOTE" | "HYBRID" | "ONSITE", "employment": "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP", "experience": "ENTRY" | "MID" | "SENIOR", "salary": string or null, "skills": [up to 8 short skill strings], "description": <a clear 2-3 sentence summary in your own words, not copied verbatim>}

If a field isn't clearly stated in the text, make a reasonable inference from context. If genuinely ambiguous, default remote to "ONSITE" and employment to "FULL_TIME" rather than guessing wildly.`;

export async function parseJobDescription(rawText: string): Promise<ParsedJob & { usage?: AiResult["usage"] }> {
  const { content, usage } = await callAi(SYSTEM_PROMPT, rawText);
  const result = parseJsonResponse<ParsedJob>(content);
  return { ...result, usage };
}