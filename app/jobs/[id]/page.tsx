import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getJobById, getSimilarJobs } from "@/lib/jobs";
import JobDetailClient from "./job-detail-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const job = getJobById(id);
  if (!job) return { title: "Job not found" };
  return {
    title: `${job.title} at ${job.company}`,
    description: job.description,
  };
}

export default async function JobDetailPage({ params }: PageProps) {
  const { id } = await params;
  const job = getJobById(id);

  if (!job) notFound();

  const similarJobs = getSimilarJobs(job);

  return <JobDetailClient job={job} similarJobs={similarJobs} />;
}