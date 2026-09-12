import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/jobs — public job listing, powers the /jobs page.
// Supports the same filters the jobs listing page already has:
// ?q=search&remote=Remote&employment=Full-time&experience=Senior&sort=newest|match
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const remote = searchParams.get("remote");
  const employment = searchParams.getAll("employment"); // can repeat: ?employment=Full-time&employment=Contract
  const experience = searchParams.getAll("experience");
  const sort = searchParams.get("sort") || "newest";

  const jobs = await prisma.job.findMany({
    where: {
      status: "ACTIVE",
      ...(q && {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { company: { name: { contains: q, mode: "insensitive" } } },
          { skills: { has: q } },
        ],
      }),
      ...(remote && remote !== "All" && { remote: remote.toUpperCase().replace(/-/g, "") as any }),
      ...(employment.length > 0 && {
        employment: { in: employment.map((e) => e.toUpperCase().replace("-", "_")) as any },
      }),
      ...(experience.length > 0 && { experience: { in: experience.map((e) => e.toUpperCase()) as any } }),
    },
    include: {
      company: { select: { name: true, logoUrl: true } },
    },
    orderBy: sort === "newest" ? { createdAt: "desc" } : { createdAt: "desc" }, // match-sort needs a per-user score, handled client-side for now
  });

  return NextResponse.json(jobs);
}

// POST /api/jobs — create a job listing.
// Employers create under their own company automatically. Admins can
// create a listing on behalf of ANY company, since admin isn't tied
// to one the way an employer is — they must pass companyId explicitly.
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user.role !== "EMPLOYER" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const body = await req.json();

  let companyId: string;
  if (session.user.role === "ADMIN") {
    const { companyName, companyDetails } = body;
    if (!companyName || !companyName.trim()) {
      return NextResponse.json({ error: "Company name is required." }, { status: 400 });
    }

    const existing = await prisma.company.findFirst({
      where: { name: { equals: companyName.trim(), mode: "insensitive" } },
    });

    if (existing) {
      companyId = existing.id;
    } else {
      const created = await prisma.company.create({
        data: {
          name: companyName.trim(),
          industry: companyDetails?.industry || null,
          size: companyDetails?.size || null,
          website: companyDetails?.website || null,
          headquarters: companyDetails?.headquarters || null,
          description: companyDetails?.description || null,
          // userId intentionally omitted — standalone company, no employer account yet
        },
      });
      companyId = created.id;
    }
  } else {
    const company = await prisma.company.findUnique({ where: { userId: session.user.id } });
    if (!company) {
      return NextResponse.json({ error: "No company profile found for this account." }, { status: 400 });
    }
    companyId = company.id;
  }

  const {
    title,
    description,
    responsibilities = [],
    requirements = [],
    skills = [],
    location,
    remote,
    employment,
    experience,
    salary,
    applicationUrl,
    status = "DRAFT",
    autoReject = false,
    matchThreshold = 50,
  } = body;

  if (!title || !location || !remote || !employment || !experience) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const job = await prisma.job.create({
    data: {
      companyId,
      title,
      description: description || "",
      responsibilities,
      requirements,
      skills,
      location,
      remote,
      employment,
      experience,
      salary,
      applicationUrl,
      status,
      autoReject,
      matchThreshold,
    },
  });

  return NextResponse.json(job, { status: 201 });
}