import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { computeJobMatch } from "@/lib/ai/matchJob";
import { logAiUsage } from "@/lib/ai/logUsage";

// POST /api/ai/match — powers "Check my match" on /jobs/[id].
// If the seeker has already applied to this job, the score gets saved
// onto their Application row too (so it shows up on /applications,
// the employer's applicant list, etc.) — not just returned once and lost.
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "SEEKER") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const { jobId } = await req.json();
  if (!jobId) {
    return NextResponse.json({ error: "Missing jobId." }, { status: 400 });
  }

  const [job, profile] = await Promise.all([
    prisma.job.findUnique({ where: { id: jobId } }),
    prisma.seekerProfile.findUnique({ where: { userId: session.user.id } }),
  ]);

  if (!job) {
    return NextResponse.json({ error: "Job not found." }, { status: 404 });
  }
  if (!profile || (!profile.bio && !profile.title && profile.skills.length === 0)) {
    return NextResponse.json(
      { error: "Complete your profile first — there's nothing to match against yet." },
      { status: 400 }
    );
  }

  try {
    const result = await computeJobMatch({ job, profile });
    await logAiUsage("JOB_MATCHING", result.usage, session.user.id);

    // Save onto the Application row if one exists — silent no-op if not applied yet
    await prisma.application.updateMany({
      where: { jobId, userId: session.user.id },
      data: { match: result.match, strengths: result.strengths, gaps: result.gaps },
    });

    return NextResponse.json({ match: result.match, strengths: result.strengths, gaps: result.gaps });
  } catch (err) {
    console.error("AI match failed:", err);
    return NextResponse.json({ error: "Couldn't compute your match right now. Try again in a moment." }, { status: 500 });
  }
}