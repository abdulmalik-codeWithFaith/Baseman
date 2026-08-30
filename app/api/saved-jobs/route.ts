import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/saved-jobs — every job the signed-in seeker has bookmarked,
// powers /saved.
export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "SEEKER") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const saved = await prisma.savedJob.findMany({
    where: { userId: session.user.id },
    include: { job: { include: { company: { select: { name: true } } } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(saved);
}

// POST /api/saved-jobs — bookmark a job. Powers the Save button on
// /jobs/[id]. Idempotent: saving an already-saved job just succeeds
// again rather than erroring, since a double-click shouldn't feel broken.
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "SEEKER") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const { jobId } = await req.json();
  if (!jobId) {
    return NextResponse.json({ error: "Missing jobId." }, { status: 400 });
  }

  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) {
    return NextResponse.json({ error: "Job not found." }, { status: 404 });
  }

  await prisma.savedJob.upsert({
    where: { userId_jobId: { userId: session.user.id, jobId } },
    create: { userId: session.user.id, jobId },
    update: {}, // already saved — no-op
  });

  return NextResponse.json({ success: true }, { status: 201 });
}