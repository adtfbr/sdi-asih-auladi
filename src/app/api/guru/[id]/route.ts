import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { teachers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { updateTeacherSchema } from "@/lib/validations";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [teacher] = await db
      .select()
      .from(teachers)
      .where(eq(teachers.id, Number(id)))
      .limit(1);

    if (!teacher) {
      return NextResponse.json({ error: "Guru tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(teacher);
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
    const { id } = await params;
    const body = await request.json();
    const parsed = updateTeacherSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const [updated] = await db
      .update(teachers)
      .set(parsed.data)
      .where(eq(teachers.id, Number(id)))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Guru tidak ditemukan" }, { status: 404 });
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
    const { id } = await params;
    const [deleted] = await db
      .delete(teachers)
      .where(eq(teachers.id, Number(id)))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: "Guru tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ message: "Guru berhasil dihapus" });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
