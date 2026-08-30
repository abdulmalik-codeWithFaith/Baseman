import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// PATCH /api/account/password — change password, requires the current
// one to be correct first. Only works for accounts that have a password
// at all (Google-only accounts have passwordHash: null — they'd need a
// "set a password" flow instead, which doesn't exist yet).
export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "Missing fields." }, { status: 400 });
  }
  if (newPassword.length < 8) {
    return NextResponse.json({ error: "New password must be at least 8 characters." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || !user.passwordHash) {
    return NextResponse.json(
      { error: "This account doesn't have a password set (likely signed up with Google)." },
      { status: 400 }
    );
  }

  const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isValid) {
    return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
  }

  const newHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: session.user.id }, data: { passwordHash: newHash } });

  return NextResponse.json({ success: true });
}