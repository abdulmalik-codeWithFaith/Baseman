import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// PATCH /api/applications/[id] — an employer moving an applicant's status
// (Move to Interview / Reject / Undo back to Applied). Only the employer
// who owns the job this application is for — or an admin — can do this.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const { id } = await params;
  const application = await prisma.application.findUnique({
    where: { id },
    include: { job: { include: { company: true } } },
  });

  if (!application) {
    return NextResponse.json({ error: "Application not found." }, { status: 404 });
  }

  const isOwner = application.job.company.userId === session.user.id;
  const isApplicant = application.userId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";
  if (!isOwner && !isApplicant && !isAdmin) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const { status } = await req.json();

  // A job seeker acting on their own application can only withdraw it —
  // they can't set themselves to Interview/Offer/Rejected.
  if (isApplicant && !isOwner && !isAdmin) {
    if (status !== "WITHDRAWN") {
      return NextResponse.json({ error: "You can only withdraw your own application." }, { status: 403 });
    }
    const updated = await prisma.application.update({ where: { id }, data: { status: "WITHDRAWN" } });
    return NextResponse.json(updated);
  }

  // Employer/admin path — moving an applicant through the hiring pipeline.
  // An employer/admin can't manually override an AUTO_DECLINED status here —
  // that's a job-level threshold decision, not a per-applicant one. They'd
  // need to adjust the job's matchThreshold instead, which recalculates
  // everyone under it.
  if (application.status === "AUTO_DECLINED") {
    return NextResponse.json(
      { error: "This applicant was auto-declined by the match threshold. Adjust the threshold to reconsider them." },
      { status: 400 }
    );
  }

  const allowed = ["APPLIED", "INTERVIEW", "OFFER", "REJECTED"];
  if (!allowed.includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const updated = await prisma.application.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json(updated);
}