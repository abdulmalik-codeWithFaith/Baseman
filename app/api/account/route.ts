import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// PATCH /api/account — update email.
// NOTE: this updates the email immediately with no re-verification step.
// A real product would send a confirmation link to the new address
// before switching it — flagging that as a known gap, not silently
// pretending this is production-safe.
export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: "Missing email." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing && existing.id !== session.user.id) {
    return NextResponse.json({ error: "That email is already in use." }, { status: 409 });
  }

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: { email },
  });

  return NextResponse.json({ email: updated.email });
}

// DELETE /api/account — permanently delete the signed-in user's account.
// Cascades to SeekerProfile/Company, Applications, SavedJobs, Sessions,
// and Accounts automatically via onDelete: Cascade in the schema.
export async function DELETE() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  await prisma.user.delete({ where: { id: session.user.id } });
  return NextResponse.json({ success: true });
}