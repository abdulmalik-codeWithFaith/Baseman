import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { parseJobDescription } from "@/lib/ai/parseJobDescription";
import { logAiUsage } from "@/lib/ai/logUsage";

// POST /api/ai/parse-job — powers "Paste with AI" on /employers/post.
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "EMPLOYER") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const { text } = await req.json();
  if (!text || text.trim().length < 20) {
    return NextResponse.json({ error: "Paste more of the job description — that's too short to work with." }, { status: 400 });
  }

  try {
    const result = await parseJobDescription(text);
    await logAiUsage("JOB_PARSING", result.usage, session.user.id);
    const { usage, ...parsed } = result;
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("parse-job failed:", err);
    return NextResponse.json(
      { error: "Couldn't parse this job description. Try again, or fill it in manually instead." },
      { status: 500 }
    );
  }
}