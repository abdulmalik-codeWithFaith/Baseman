import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/applications — every application belonging to the signed-in
// job seeker, powers /applications (their tracker page).
export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "SEEKER") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const applications = await prisma.application.findMany({
    where: { userId: session.user.id },
    include: {
      job: { include: { company: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(applications);
}

// POST /api/applications — a job seeker applying to a job.
// Powers the "Apply" button on /jobs/[id].
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "SEEKER") {
    return NextResponse.json({ error: "Only job seekers can apply." }, { status: 403 });
  }

  const { jobId } = await req.json();
  if (!jobId) {
    return NextResponse.json({ error: "Missing jobId." }, { status: 400 });
  }

  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job || job.status !== "ACTIVE") {
    return NextResponse.json({ error: "This job isn't accepting applications." }, { status: 404 });
  }

  try {
    const application = await prisma.application.create({
      data: {
        jobId,
        userId: session.user.id,
        status: "APPLIED",
        // match/strengths/gaps stay null until the AI matching service exists
      },
    });
    return NextResponse.json(application, { status: 201 });
  } catch {
    // Unique constraint on [jobId, userId] — they've already applied
    return NextResponse.json({ error: "You've already applied to this job." }, { status: 409 });
  }
}