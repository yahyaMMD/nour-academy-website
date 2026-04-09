import { NextRequest, NextResponse } from "next/server";
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

const courseSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  image: imageSchema.optional().or(z.literal("")).nullable(),
  categoryId: z.string().min(1, "Category is required"),
  instructor: z.string().min(2, "Instructor name must be at least 2 characters"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  price: z.coerce.number().min(0, "Price must be positive"),
  phone: z.string().min(6, "Phone must be at least 6 characters").optional().or(z.literal("")),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  featured: z.boolean().optional().default(false),
  inFront: z.boolean().optional().default(false),
});

export async function GET(request: NextRequest) {
  try {
    const showAll = request.nextUrl.searchParams.get("all") === "true";
    const includeAll = showAll && (await isAdminUser());

    const courses = await prisma.course.findMany({
      where: includeAll ? {} : { inFront: true },
      include: { category: true },
      orderBy: { date: "asc" },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error("[COURSES_GET_ERROR]", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAdminUser())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = courseSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { date, time, ...rest } = validation.data;
    const dateTime = new Date(`${date}T${time}:00`);

    if (dateTime < new Date()) {
      return NextResponse.json(
        {
          success: false,
          error: "Course date must be in the future",
        },
        { status: 400 }
      );
    }

    const categoryExists = await prisma.category.findUnique({
      where: { id: rest.categoryId },
    });

    if (!categoryExists) {
      return NextResponse.json(
        {
          success: false,
          error: "Category does not exist",
        },
        { status: 404 }
      );
    }

    const course = await prisma.course.create({
      data: {
        ...rest,
        date: dateTime,
        image: rest.image || null,
        phone: rest.phone ?? "",
        email: rest.email ?? "",
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: course,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[COURSES_POST]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  );
}
