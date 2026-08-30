import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// DELETE /api/saved-jobs/[jobId] — unbookmark a job. Powers the Save
// toggle on /jobs/[id] and the "Remove" action on /saved.
export async function DELETE(_req: Request, { params }: { params: Promise<{ jobId: string }> }) {
  const session = await auth();
  if (!session || session.user.role !== "SEEKER") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const { jobId } = await params;

  await prisma.savedJob
    .delete({ where: { userId_jobId: { userId: session.user.id, jobId } } })
    .catch(() => null); // idempotent — already unsaved is fine, not an error

  return NextResponse.json({ success: true });
}