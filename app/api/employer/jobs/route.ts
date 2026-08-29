import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/employer/jobs — every listing owned by the signed-in employer,
// regardless of status (Active, Closed, Draft, Expired). This is
// deliberately separate from GET /api/jobs, which only returns public
// Active listings for job seekers browsing the marketplace.
export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "EMPLOYER") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const company = await prisma.company.findUnique({ where: { userId: session.user.id } });
  if (!company) {
    return NextResponse.json([]);
  }

  const jobs = await prisma.job.findMany({
    where: { companyId: company.id },
    include: { _count: { select: { applications: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(jobs);
}