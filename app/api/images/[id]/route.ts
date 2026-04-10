import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdminUser } from "@/lib/api-auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const image = await prisma.image.findUnique({
      where: { id },
    });

    if (!image) {
      return NextResponse.json(
        { success: false, error: "Image not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: image,
    });
  } catch (error) {
    console.error("[IMAGE_GET_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch image" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    if (!(await isAdminUser())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, url, alt, order, isActive, courseId } = body;

    const image = await prisma.image.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(url && { url }),
        ...(alt !== undefined && { alt }),
        ...(courseId !== undefined && { courseId: courseId || null }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json({
      success: true,
      data: image,
      message: "Image updated successfully",
    });
  } catch (error) {
    console.error("[IMAGE_PATCH_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to update image" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    if (!(await isAdminUser())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await prisma.image.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("[IMAGE_DELETE_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
