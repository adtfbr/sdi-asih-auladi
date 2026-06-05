import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { grades, students, subjects, teachers } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { bulkCreateGradeSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    const subjectId = searchParams.get("subjectId");
    const type = searchParams.get("type");

    const conditions = [];
    if (studentId) conditions.push(eq(grades.studentId, Number(studentId)));
    if (subjectId) conditions.push(eq(grades.subjectId, Number(subjectId)));
    if (type) conditions.push(eq(grades.type, type));

    const result = await db
      .select({
        id: grades.id,
        studentId: grades.studentId,
        studentName: students.name,
        subjectId: grades.subjectId,
        subjectName: subjects.name,
        teacherId: grades.teacherId,
        teacherName: teachers.name,
        score: grades.score,
        type: grades.type,
      })
      .from(grades)
      .leftJoin(students, eq(grades.studentId, students.id))
      .leftJoin(subjects, eq(grades.subjectId, subjects.id))
      .leftJoin(teachers, eq(grades.teacherId, teachers.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = bulkCreateGradeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { subjectId, teacherId, type, records } = parsed.data;

    const values = records.map((r) => ({
      studentId: r.studentId,
      subjectId,
      teacherId,
      score: r.score,
      type,
    }));

    const inserted = await db.insert(grades).values(values).returning();
    return NextResponse.json(inserted, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
