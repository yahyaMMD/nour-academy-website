import path from "path";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { isAdminUser } from "@/lib/api-auth";

const hasCloudinaryConfig =
  !!process.env.CLOUDINARY_CLOUD_NAME &&
  !!process.env.CLOUDINARY_API_KEY &&
  !!process.env.CLOUDINARY_API_SECRET;

if (hasCloudinaryConfig) {
  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

function sanitizeFilename(filename: string) {
  const extension = path.extname(filename) || ".bin";
  const base = path.basename(filename, extension).replace(/[^a-zA-Z0-9-_]/g, "-");
  return `${base || "upload"}-${randomUUID()}${extension}`;
}

export async function POST(req: Request) {
  try {
    if (!(await isAdminUser())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (hasCloudinaryConfig) {
      const fileUri = `data:${file.type};base64,${buffer.toString("base64")}`;
      const result = await cloudinary.v2.uploader.upload(fileUri, {
        folder: "nour-academy",
        resource_type: "auto",
      });

      return NextResponse.json({ url: result.secure_url });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const safeName = sanitizeFilename(file.name);
    const absolutePath = path.join(uploadDir, safeName);
    await writeFile(absolutePath, buffer);

    return NextResponse.json({ url: `/uploads/${safeName}` });
  } catch (error) {
    console.error("[UPLOAD_ERROR]", error);
    return NextResponse.json(
      {
        error: "Failed to upload file",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
