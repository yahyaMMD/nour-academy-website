import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdminUser } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  try {
    const activeOnly = request.nextUrl.searchParams.get("activeOnly") === "true";

    const images = await prisma.image.findMany({
      where: activeOnly ? { isActive: true } : {},
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({
      success: true,
      data: images,
    });
  } catch (error) {
    console.error("[IMAGES_GET_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAdminUser())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, url, alt, order, isActive } = body;

    if (!title || !url) {
      return NextResponse.json(
        { success: false, error: "Title and URL are required" },
        { status: 400 }
      );
    }

    const image = await prisma.image.create({
      data: {
        title,
        description: description || null,
        url,
        alt: alt || title,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({
      success: true,
      data: image,
      message: "Image created successfully",
    });
  } catch (error) {
    console.error("[IMAGES_POST_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to create image" },
      { status: 500 }
    );
  }
}
