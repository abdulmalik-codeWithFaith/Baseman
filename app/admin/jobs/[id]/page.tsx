import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAdminJobById } from "@/lib/admin-jobs";
import { getJobById } from "@/lib/jobs";
import { ADMIN_APPLICATIONS } from "@/lib/admin-applications";
import AdminJobDetailClient from "./admin-job-detail-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const job = getAdminJobById(id);
  if (!job) return { title: "Job not found" };
  return { title: `${job.title} at ${job.company} — Admin` };
}

export default async function AdminJobDetailPage({ params }: PageProps) {
  const { id } = await params;
  const adminJob = getAdminJobById(id);

  if (!adminJob) notFound();

  // Cross-reference the public marketplace data (description, skills,
  // requirements) — admin-jobs.ts only holds the admin-specific fields
  // (status, views), so both sources are combined here.
  const publicJob = getJobById(id);
  const applications = ADMIN_APPLICATIONS.filter((a) => a.jobId === id);

  return <AdminJobDetailClient adminJob={adminJob} publicJob={publicJob} applications={applications} />;
}