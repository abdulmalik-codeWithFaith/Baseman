import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// POST /api/upload/resume — powers the Resume tab on /settings.
// Stored as resource_type "raw" (not "image") since it's a document,
// not something Cloudinary should try to transform/rasterize.
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "SEEKER") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Only PDF and Word documents are allowed." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File must be under 10MB." }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const uploadResult = await cloudinary.uploader.upload(base64, {
      resource_type: "raw",
      folder: "baseman/resumes",
      public_id: `${session.user.id}-${Date.now()}`,
    });

    await prisma.seekerProfile.upsert({
      where: { userId: session.user.id },
      create: { userId: session.user.id, resumeUrl: uploadResult.secure_url, resumeFileName: file.name },
      update: { resumeUrl: uploadResult.secure_url, resumeFileName: file.name },
    });

    return NextResponse.json({ resumeUrl: uploadResult.secure_url, resumeFileName: file.name });
  } catch (err) {
    console.error("Resume upload failed:", err);
    return NextResponse.json({ error: "Upload failed. Try again." }, { status: 500 });
  }
}