import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/jobs/[id] — a single job's full detail, powers /jobs/[id].
// Increments the view count on every real page load.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const job = await prisma.job.update({
    where: { id },
    data: { views: { increment: 1 } },
    include: { company: true },
  }).catch(() => null);

  if (!job) {
    return NextResponse.json({ error: "Job not found." }, { status: 404 });
  }

  return NextResponse.json(job);
}

// PATCH /api/jobs/[id] — edit a listing (employer editing their own,
// or admin editing any listing) or update status (e.g. Active <-> Closed
// from /employers/listings).
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || (session.user.role !== "EMPLOYER" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const { id } = await params;
  const job = await prisma.job.findUnique({ where: { id }, include: { company: true } });

  if (!job) {
    return NextResponse.json({ error: "Job not found." }, { status: 404 });
  }

  const isOwner = job.company.userId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";
  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const body = await req.json();
  const updated = await prisma.job.update({
    where: { id },
    data: body, // trusted fields only — see note below
  });

  return NextResponse.json(updated);
}

// DELETE /api/jobs/[id] — remove a listing.
// Called by both the employer's own "close" action and the admin
// moderation "Remove" action — the role check below allows either.
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const { id } = await params;
  const job = await prisma.job.findUnique({ where: { id }, include: { company: true } });

  if (!job) {
    return NextResponse.json({ error: "Job not found." }, { status: 404 });
  }

  const isOwner = job.company.userId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";
  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  await prisma.job.delete({ where: { id } });
  return NextResponse.json({ success: true });
}