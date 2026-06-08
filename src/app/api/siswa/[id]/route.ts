import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { students, classStudents, classes, grades, attendanceRecords } from "@/db/schema";
import { eq } from "drizzle-orm";
import { updateStudentSchema } from "@/lib/validations";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const studentId = Number(id);

    const result = await db
      .select({
        id: students.id,
        nis: students.nis,
        nisn: students.nisn,
        name: students.name,
        gender: students.gender,
        birthDate: students.birthDate,
        address: students.address,
        status: students.status,
        createdAt: students.createdAt,
        className: classes.name,
        classId: classes.id,
      })
      .from(students)
      .leftJoin(classStudents, eq(students.id, classStudents.studentId))
      .leftJoin(classes, eq(classStudents.classId, classes.id))
      .where(eq(students.id, studentId))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json({ error: "Siswa tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
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
    const studentId = Number(id);
    const body = await request.json();
    const parsed = updateStudentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { classId, ...studentData } = parsed.data;

    const [updated] = await db
      .update(students)
      .set(studentData)
      .where(eq(students.id, studentId))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Siswa tidak ditemukan" }, { status: 404 });
    }

    // Update class assignment if classId is provided
    if (classId !== undefined) {
      // Remove existing class assignment
      await db.delete(classStudents).where(eq(classStudents.studentId, studentId));
      // Add new class assignment
      if (classId) {
        await db.insert(classStudents).values({ classId, studentId });
      }
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
    const studentId = Number(id);

    // Delete related records first
    await db.delete(grades).where(eq(grades.studentId, studentId));
    await db.delete(attendanceRecords).where(eq(attendanceRecords.studentId, studentId));
    await db.delete(classStudents).where(eq(classStudents.studentId, studentId));

    const [deleted] = await db
      .delete(students)
      .where(eq(students.id, studentId))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: "Siswa tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ message: "Siswa berhasil dihapus" });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
