import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/profile — the signed-in seeker's own profile, powers the
// Profile tab on /settings.
export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "SEEKER") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { seekerProfile: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  return NextResponse.json({
    name: user.name,
    email: user.email,
    image: user.image,
    profile: user.seekerProfile,
  });
}

// PATCH /api/profile — update name (on User) and everything else
// (on SeekerProfile). Uses upsert for the profile half, not update —
// a Google OAuth signup never gets a SeekerProfile row created
// automatically (only the email/password signup flow creates one),
// so this has to handle "doesn't exist yet" gracefully rather than
// assuming every seeker already has one.
export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "SEEKER") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const body = await req.json();
  const {
    name,
    title,
    location,
    bio,
    skills,
    linkedinUrl,
    githubUrl,
    portfolioUrl,
    preferredJobType,
    preferredRemote,
  } = body;

  if (name) {
    await prisma.user.update({ where: { id: session.user.id }, data: { name } });
  }

  const profile = await prisma.seekerProfile.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      title,
      location,
      bio,
      skills: skills ?? [],
      linkedinUrl,
      githubUrl,
      portfolioUrl,
      preferredJobType,
      preferredRemote,
    },
    update: {
      title,
      location,
      bio,
      skills,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
      preferredJobType,
      preferredRemote,
    },
  });

  return NextResponse.json(profile);
}