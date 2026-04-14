import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdminUser } from "@/lib/api-auth";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    if (!(await isAdminUser())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await prisma.contactProfile.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "تم حذف الملف الشخصي" });
  } catch (error) {
    console.error("[CONTACT_PROFILE_DELETE_ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to delete profile" }, { status: 500 });
  }
}
