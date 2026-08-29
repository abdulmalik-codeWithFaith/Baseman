import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import JobDetailClient from "./job-detail-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const job = await prisma.job.findUnique({ where: { id }, include: { company: true } });
  if (!job) return { title: "Job not found" };
  return {
    title: `${job.title} at ${job.company.name}`,
    description: job.description,
  };
}

export default async function JobDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();

  // Increment the view count on every real page load, and pull the
  // company in the same query.
  const job = await prisma.job
    .update({
      where: { id },
      data: { views: { increment: 1 } },
      include: { company: true },
    })
    .catch(() => null);

  if (!job || job.status !== "ACTIVE") notFound();

  const similarJobs = await prisma.job.findMany({
    where: {
      id: { not: job.id },
      status: "ACTIVE",
      OR: [{ companyId: job.companyId }, { skills: { hasSome: job.skills } }],
    },
    include: { company: { select: { name: true } } },
    take: 3,
  });

  // If a seeker is logged in, check whether they've already applied,
  // so the button shows the right state on first load instead of
  // flashing "Apply" before flipping to "Applied".
  let alreadyApplied = false;
  if (session?.user?.role === "SEEKER") {
    const existing = await prisma.application.findUnique({
      where: { jobId_userId: { jobId: job.id, userId: session.user.id } },
    });
    alreadyApplied = !!existing;
  }

  return (
    <JobDetailClient
      job={job}
      similarJobs={similarJobs}
      alreadyApplied={alreadyApplied}
      isLoggedInSeeker={session?.user?.role === "SEEKER"}
    />
  );
}