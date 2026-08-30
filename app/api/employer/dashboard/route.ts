import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/employer/dashboard — aggregated data for the employer
// dashboard: active listings with real applicant counts and average
// match (only from applications that actually have a score), plus
// recent applicants across every listing.
export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "EMPLOYER") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const company = await prisma.company.findUnique({ where: { userId: session.user.id } });
  if (!company) {
    return NextResponse.json({
      activeListings: [],
      totalApplicants: 0,
      autoDeclinedCount: 0,
      avgMatch: null,
      recentApplicants: [],
    });
  }

  const [jobs, totalApplicants, autoDeclinedCount, recentApplicants, scoredApplications] = await Promise.all([
    prisma.job.findMany({
      where: { companyId: company.id, status: "ACTIVE" },
      include: {
        _count: { select: { applications: true } },
        applications: { select: { match: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.application.count({ where: { job: { companyId: company.id } } }),
    prisma.application.count({ where: { job: { companyId: company.id }, status: "AUTO_DECLINED" } }),
    prisma.application.findMany({
      where: { job: { companyId: company.id } },
      include: { user: { select: { name: true } }, job: { select: { title: true } } },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.application.findMany({
      where: { job: { companyId: company.id }, match: { not: null } },
      select: { match: true },
    }),
  ]);

  const activeListings = jobs.map((job) => {
    const scored = job.applications.map((a) => a.match).filter((m): m is number => m !== null);
    const avgMatch = scored.length > 0 ? Math.round(scored.reduce((sum, m) => sum + m, 0) / scored.length) : null;
    return {
      id: job.id,
      title: job.title,
      applicants: job._count.applications,
      avgMatch,
      autoReject: job.autoReject,
      matchThreshold: job.matchThreshold,
      createdAt: job.createdAt,
    };
  });

  const overallAvgMatch =
    scoredApplications.length > 0
      ? Math.round(scoredApplications.reduce((sum, a) => sum + (a.match ?? 0), 0) / scoredApplications.length)
      : null;

  return NextResponse.json({
    activeListings,
    totalApplicants,
    autoDeclinedCount,
    avgMatch: overallAvgMatch,
    recentApplicants: recentApplicants.map((a) => ({
      id: a.id,
      name: a.user.name,
      jobTitle: a.job.title,
      match: a.match,
      status: a.status,
      createdAt: a.createdAt,
    })),
  });
}