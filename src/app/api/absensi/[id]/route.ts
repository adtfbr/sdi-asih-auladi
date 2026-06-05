import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { attendanceRecords } from "@/db/schema";
import { eq } from "drizzle-orm";
import { updateAttendanceSchema } from "@/lib/validations";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateAttendanceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const [updated] = await db
      .update(attendanceRecords)
      .set(parsed.data)
      .where(eq(attendanceRecords.id, Number(id)))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Record tidak ditemukan" }, { status: 404 });
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
      .delete(attendanceRecords)
      .where(eq(attendanceRecords.id, Number(id)))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: "Record tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ message: "Record berhasil dihapus" });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
