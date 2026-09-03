import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

// POST /api/upload/logo — powers the Company profile tab on
// /employers/settings. Requires a Company row to already exist
// (normally created at signup) — if it doesn't, that's the Google
// OAuth employer edge case noted elsewhere, and this returns a clear
// error rather than silently creating a company with a placeholder name.
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "EMPLOYER") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const company = await prisma.company.findUnique({ where: { userId: session.user.id } });
  if (!company) {
    return NextResponse.json(
      { error: "Save your company name first, then upload a logo." },
      { status: 400 }
    );
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Only PNG, JPG, or WebP images are allowed." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Image must be under 5MB." }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const uploadResult = await cloudinary.uploader.upload(base64, {
      resource_type: "image",
      folder: "baseman/logos",
      public_id: `${session.user.id}-${Date.now()}`,
      transformation: [{ width: 256, height: 256, crop: "fill", gravity: "center" }],
    });

    await prisma.company.update({
      where: { userId: session.user.id },
      data: { logoUrl: uploadResult.secure_url },
    });

    return NextResponse.json({ logoUrl: uploadResult.secure_url });
  } catch (err) {
    console.error("Logo upload failed:", err);
    return NextResponse.json({ error: "Upload failed. Try again." }, { status: 500 });
  }
}