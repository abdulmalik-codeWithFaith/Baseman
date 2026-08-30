import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/dashboard — aggregated data for the seeker dashboard.
// Profile completion is computed here from real fields (no AI needed
// for that part). "Latest jobs" is just recent Active listings, not
// an AI-ranked recommendation — that distinction matters, see the
// dashboard page for why it's labeled that way.
export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "SEEKER") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const [user, applications, savedCount, latestJobs] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id }, include: { seekerProfile: true } }),
    prisma.application.findMany({
      where: { userId: session.user.id },
      include: { job: { include: { company: { select: { name: true } } } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.savedJob.count({ where: { userId: session.user.id } }),
    prisma.job.findMany({
      where: { status: "ACTIVE" },
      include: { company: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  const p = user?.seekerProfile;
  const checks = [
    { label: "Add a professional title", done: !!p?.title },
    { label: "Add your location", done: !!p?.location },
    { label: "Add a bio", done: !!p?.bio },
    { label: "Add at least 3 skills", done: (p?.skills?.length ?? 0) >= 3 },
    { label: "Add a LinkedIn, GitHub, or portfolio link", done: !!(p?.linkedinUrl || p?.githubUrl || p?.portfolioUrl) },
    { label: "Upload your resume", done: !!p?.resumeFileName },
  ];
  const profileCompletion = Math.round((checks.filter((c) => c.done).length / checks.length) * 100);
  const missingItems = checks.filter((c) => !c.done).map((c) => c.label);

  return NextResponse.json({
    name: user?.name ?? "",
    profileCompletion,
    missingItems,
    stats: {
      applications: applications.length,
      interviews: applications.filter((a) => a.status === "INTERVIEW").length,
      savedJobs: savedCount,
    },
    recentApplications: applications.slice(0, 4),
    latestJobs,
  });
}