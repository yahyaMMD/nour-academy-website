import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { isAdminUser } from "@/lib/api-auth";

const profileSchema = z.object({
  name: z.string().min(2),
  whatsappHref: z.string().url(),
  telegramHref: z.string().url(),
});

export async function GET() {
  try {
    if (!(await isAdminUser())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const profiles = await prisma.contactProfile.findMany({
      where: { isActive: true },
      orderBy: [{ updatedAt: "desc" }],
    });

    return NextResponse.json({ success: true, data: profiles });
  } catch (error) {
    console.error("[CONTACT_PROFILES_GET_ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch profiles" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAdminUser())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = profileSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ success: false, error: "Invalid data" }, { status: 400 });
    }

    const profile = await prisma.contactProfile.create({
      data: validation.data,
    });

    return NextResponse.json({ success: true, data: profile, message: "?? ??? ?????? ?????" }, { status: 201 });
  } catch (error) {
    console.error("[CONTACT_PROFILES_POST_ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to create profile" }, { status: 500 });
  }
}
