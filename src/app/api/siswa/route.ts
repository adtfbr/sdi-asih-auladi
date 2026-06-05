import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { students, classStudents, classes } from "@/db/schema";
import { eq, ilike, and, count, sql } from "drizzle-orm";
import { createStudentSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    const status = searchParams.get("status");
    const classId = searchParams.get("classId");

    let query = db
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
      .leftJoin(classes, eq(classStudents.classId, classes.id));

    const conditions = [];
    if (q) {
      conditions.push(ilike(students.name, `%${q}%`));
    }
    if (status && status !== "semua") {
      conditions.push(eq(students.status, status));
    }
    if (classId) {
      conditions.push(eq(classStudents.classId, Number(classId)));
    }

    const result =
      conditions.length > 0
        ? await query.where(and(...conditions))
        : await query;

    return NextResponse.json(result);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createStudentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { classId, ...studentData } = parsed.data;

    const [newStudent] = await db
      .insert(students)
      .values(studentData)
      .returning();

    // Assign to class if classId is provided
    if (classId) {
      await db.insert(classStudents).values({
        classId,
        studentId: newStudent.id,
      });
    }

    return NextResponse.json(newStudent, { status: 201 });
  } catch (error: any) {
    console.error(error);
    if (error.message?.includes("unique")) {
      return NextResponse.json(
        { error: "NIS atau NISN sudah terdaftar" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
