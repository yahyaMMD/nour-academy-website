import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { isAdminUser } from "@/lib/api-auth";

const settingsSchema = z.object({
  whatsappHref: z.string().url(),
  telegramHref: z.string().url(),
});

const DEFAULT_SETTINGS = {
  whatsappHref: "https://wa.me/213556268876",
  telegramHref: "https://t.me/+213556268876",
};

export async function GET() {
  try {
    if (!(await isAdminUser())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const settings = await prisma.registrationContactSettings.findUnique({
      where: { key: "registration-contact" },
    });

    return NextResponse.json({
      success: true,
      data: settings || { key: "registration-contact", ...DEFAULT_SETTINGS },
    });
  } catch (error) {
    console.error("[REGISTRATION_CONTACT_GET_ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    if (!(await isAdminUser())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = settingsSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ success: false, error: "Invalid data" }, { status: 400 });
    }

    const settings = await prisma.registrationContactSettings.upsert({
      where: { key: "registration-contact" },
      create: {
        key: "registration-contact",
        whatsappHref: validation.data.whatsappHref,
        telegramHref: validation.data.telegramHref,
      },
      update: {
        whatsappHref: validation.data.whatsappHref,
        telegramHref: validation.data.telegramHref,
      },
    });

    return NextResponse.json({ success: true, data: settings, message: "تم حفظ إعدادات التواصل" });
  } catch (error) {
    console.error("[REGISTRATION_CONTACT_PUT_ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to save settings" }, { status: 500 });
  }
}
