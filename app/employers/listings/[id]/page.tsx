import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import ListingDetailClient from "./listing-detail-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) return { title: "Listing not found" };
  return { title: `${job.title} — Applicants` };
}

export default async function ListingDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();

  if (!session || session.user.role !== "EMPLOYER") {
    redirect("/login");
  }

  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      company: true,
      applications: {
        include: {
          user: {
            include: { seekerProfile: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!job || job.company.userId !== session.user.id) notFound();

  return <ListingDetailClient job={job} />;
}