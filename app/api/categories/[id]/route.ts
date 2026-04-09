import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { isAdminUser } from "@/lib/api-auth";

const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  description: z.string().optional(),
});

// GET /api/categories/[id]
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Adjusted for Promise
) {
    const { id } = await params;

  try {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('[GET_CATEGORY_ERROR]', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PUT /api/categories/[id]
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Adjusted for Promise
) {
  const { id } = await params;

  try {
    if (!(await isAdminUser())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = categorySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.format() },
        { status: 400 }
      );
    }

    const category = await prisma.category.update({
      where: { id },
      data: validation.data,
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('[UPDATE_CATEGORY_ERROR]', error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

// DELETE /api/categories/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    if (!(await isAdminUser())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Category deleted' });
  } catch (error) {
    console.error('[DELETE_CATEGORY_ERROR]', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
