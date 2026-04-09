import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PATCH - Bulk update images (useful for reordering)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { updates } = body;

    if (!Array.isArray(updates)) {
      return NextResponse.json(
        { success: false, error: 'Updates must be an array' },
        { status: 400 }
      );
    }

    // Perform bulk updates using transactions
    const results = await prisma.$transaction(
      updates.map((update: { id: string; order?: number; isActive?: boolean }) =>
        prisma.image.update({
          where: { id: update.id },
          data: {
            ...(update.order !== undefined && { order: update.order }),
            ...(update.isActive !== undefined && { isActive: update.isActive }),
          },
        })
      )
    );

    return NextResponse.json({
      success: true,
      data: results,
      message: `${results.length} images updated successfully`,
    });
  } catch (error) {
    console.error('Error bulk updating images:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to bulk update images' },
      { status: 500 }
    );
  }
}

// DELETE - Bulk delete images
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'IDs must be a non-empty array' },
        { status: 400 }
      );
    }

    const result = await prisma.image.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `${result.count} images deleted successfully`,
    });
  } catch (error) {
    console.error('Error bulk deleting images:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to bulk delete images' },
      { status: 500 }
    );
  }
}