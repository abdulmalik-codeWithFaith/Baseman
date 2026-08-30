import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/company — the signed-in employer's own company profile,
// powers the Company profile tab on /employers/settings.
export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "EMPLOYER") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const company = await prisma.company.findUnique({ where: { userId: session.user.id } });
  return NextResponse.json(company);
}

// PATCH /api/company — update company profile fields.
// Uses upsert, same reasoning as /api/profile: a Google OAuth employer
// signup never gets a Company row created automatically (only the
// email/password signup flow does that) — see auth.ts/signup route.
// Upsert's `create` branch needs at least a name, since that's the
// only required field on Company.
export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "EMPLOYER") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const body = await req.json();
  const { name, logoUrl, industry, size, website, headquarters, description } = body;

  if (!name) {
    return NextResponse.json({ error: "Company name is required." }, { status: 400 });
  }

  const company = await prisma.company.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, name, logoUrl, industry, size, website, headquarters, description },
    update: { name, logoUrl, industry, size, website, headquarters, description },
  });

  return NextResponse.json(company);
}