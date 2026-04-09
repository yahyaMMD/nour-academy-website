import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { isAdminUser } from "@/lib/api-auth";

const imageSchema = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || value.startsWith("/") || /^https?:\/\//i.test(value),
    "Image must be a valid URL or a public path starting with /"
  );

const updateSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  image: imageSchema.optional().or(z.literal("")).nullable(),
  categoryId: z.string().min(1).optional(),
  instructor: z.string().min(2).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  location: z.string().min(2).optional(),
  price: z.coerce.number().min(0).optional(),
  phone: z.string().min(6).optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  featured: z.boolean().optional(),
  inFront: z.boolean().optional(),
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
    }

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        category: {
          select: { name: true },
        },
        Registration: {
          select: { id: true },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        data: {
          ...course,
          registrationsCount: course.Registration.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[COURSE_GET_ERROR]", message);
    return NextResponse.json(
      { error: "Failed to fetch course", details: message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    if (!(await isAdminUser())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
    }

    const body = await request.json();
    const validation = updateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { date, time, image, ...rest } = validation.data;
    const updateData: Record<string, unknown> = {
      ...rest,
      ...(image !== undefined ? { image: image || null } : {}),
    };

    if (date && time) {
      updateData.date = new Date(`${date}T${time}:00`);
    } else if (date || time) {
      return NextResponse.json(
        { error: "Date and time must be updated together" },
        { status: 400 }
      );
    }

    if (rest.categoryId) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: rest.categoryId },
      });

      if (!categoryExists) {
        return NextResponse.json({ error: "Category does not exist" }, { status: 400 });
      }
    }

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: updateData,
      include: {
        category: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json({ data: updatedCourse }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[COURSE_PATCH_ERROR]", message);
    return NextResponse.json(
      { error: "Failed to update course", details: message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    if (!(await isAdminUser())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
    }

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        Registration: {
          select: { id: true },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (course.Registration.length > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete course with existing registrations",
          registrationsCount: course.Registration.length,
        },
        { status: 400 }
      );
    }

    await prisma.course.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Course deleted successfully" }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[COURSE_DELETE_ERROR]", message);
    return NextResponse.json(
      { error: "Failed to delete course", details: message },
      { status: 500 }
    );
  }
}
