import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { galleries } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [item] = await db
      .select()
      .from(galleries)
      .where(eq(galleries.id, Number(id)))
      .limit(1);

    if (!item) {
      return NextResponse.json({ error: "Galeri tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, description, imageUrl } = body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

    const [updated] = await db
      .update(galleries)
      .set(updateData)
      .where(eq(galleries.id, Number(id)))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Galeri tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const [deleted] = await db
      .delete(galleries)
      .where(eq(galleries.id, Number(id)))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: "Galeri tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ message: "Galeri berhasil dihapus" });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
