import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { subjects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { updateSubjectSchema } from "@/lib/validations";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [subject] = await db
      .select()
      .from(subjects)
      .where(eq(subjects.id, Number(id)))
      .limit(1);

    if (!subject) {
      return NextResponse.json({ error: "Mapel tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(subject);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateSubjectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const [updated] = await db
      .update(subjects)
      .set(parsed.data)
      .where(eq(subjects.id, Number(id)))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Mapel tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [deleted] = await db
      .delete(subjects)
      .where(eq(subjects.id, Number(id)))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: "Mapel tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ message: "Mapel berhasil dihapus" });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
