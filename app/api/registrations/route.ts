import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { isAdminUser } from "@/lib/api-auth";
import { sheets } from "@/lib/google";

const registrationSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(6, "Phone is required"),
  email: z.string().email("A valid email is required"),
  wilaya: z.string().min(2, "Wilaya is required"),
  role: z.string().optional().or(z.literal("")),
  courseId: z.string().min(1, "Course ID is required"),
});

async function appendRegistrationToSheet(data: {
  fullName: string;
  phone: string;
  email: string;
  wilaya: string;
  role?: string;
  courseTitle: string;
}) {
  if (
    !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
    !process.env.GOOGLE_PRIVATE_KEY ||
    !process.env.GOOGLE_SHEET_ID
  ) {
    return;
  }

  try {
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
    });

    const availableSheets = spreadsheet.data.sheets || [];
    const targetSheet =
      availableSheets.find((sheet) => sheet.properties?.title === "Registrations")?.properties?.title ||
      availableSheets[0]?.properties?.title ||
      "Sheet1";

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `${targetSheet}!A1`,
      valueInputOption: "RAW",
      requestBody: {
        values: [
          [
            data.fullName,
            data.phone,
            data.email,
            data.wilaya,
            data.role || "Student",
            data.courseTitle,
            new Date().toISOString(),
          ],
        ],
      },
    });
  } catch (error) {
    console.error("[REGISTRATION_SHEET_SYNC_ERROR]", error);
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!(await isAdminUser())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const status = request.nextUrl.searchParams.get("status");
    const courseId = request.nextUrl.searchParams.get("courseId");

    const registrations = await prisma.registration.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(courseId ? { courseId } : {}),
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        registeredAt: "desc",
      },
    });

    return NextResponse.json(registrations);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch registrations",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = registrationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const course = await prisma.course.findUnique({
      where: { id: validation.data.courseId },
      select: { id: true, title: true },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const registration = await prisma.registration.create({
      data: {
        ...validation.data,
        role: validation.data.role || "Student",
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    await appendRegistrationToSheet({
      fullName: validation.data.fullName,
      phone: validation.data.phone,
      email: validation.data.email,
      wilaya: validation.data.wilaya,
      role: validation.data.role || "Student",
      courseTitle: course.title,
    });

    return NextResponse.json(registration, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to create registration",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
