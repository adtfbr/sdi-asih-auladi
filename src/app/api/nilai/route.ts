import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { grades, classes, subjects, students } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { bulkGradeSchema } from "@/lib/validations";
import { getServerSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const classId = searchParams.get("classId");
    const subjectId = searchParams.get("subjectId");
    const studentId = searchParams.get("studentId");
    const semester = searchParams.get("semester");
    const type = searchParams.get("type");

    // Extra Backend Protection
    if (session.role === "siswa" || session.role === "wali") {
      if (studentId && Number(studentId) !== session.studentId) {
        return NextResponse.json({ error: "Forbidden: You cannot view other students' grades." }, { status: 403 });
      }
    }

    const baseQuery = db
      .select({
        id: grades.id,
        studentId: grades.studentId,
        studentName: students.name,
        classId: grades.classId,
        className: classes.name,
        subjectId: grades.subjectId,
        subjectName: subjects.name,
        teacherId: grades.teacherId,
        semester: grades.semester,
        type: grades.type,
        score: grades.score,
        notes: grades.notes,
      })
      .from(grades)
      .leftJoin(students, eq(grades.studentId, students.id))
      .leftJoin(classes, eq(grades.classId, classes.id))
      .leftJoin(subjects, eq(grades.subjectId, subjects.id));

    let conditions = [];
    if (classId) conditions.push(eq(grades.classId, Number(classId)));
    if (subjectId) conditions.push(eq(grades.subjectId, Number(subjectId)));
    if (studentId) conditions.push(eq(grades.studentId, Number(studentId)));
    if (semester) conditions.push(eq(grades.semester, semester));
    if (type) conditions.push(eq(grades.type, type));

    let result;
    if (conditions.length > 0) {
      result = await baseQuery.where(and(...conditions));
    } else {
      result = await baseQuery;
    }

    // sort by studentName mostly
    result.sort((a, b) => (a.studentName || "").localeCompare(b.studentName || ""));

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || (session.role !== "admin" && session.role !== "guru")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = bulkGradeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { classId, subjectId, teacherId, semester, type, records } = parsed.data;

    // We do bulk upsert by deleting existing records for the same class+subject+semester+type
    await db
      .delete(grades)
      .where(
        and(
          eq(grades.classId, classId),
          eq(grades.subjectId, subjectId),
          eq(grades.semester, semester),
          eq(grades.type, type)
        )
      );

    if (records.length === 0) {
      return NextResponse.json({ message: "No records to insert, existing cleared." });
    }

    const recordsToInsert = records.map(r => ({
      classId,
      subjectId,
      teacherId,
      semester,
      type,
      studentId: r.studentId,
      score: r.score.toString(), // numeric maps to string in Postgres usually, but Drizzle might accept number
      notes: r.notes
    }));

    await db.insert(grades).values(recordsToInsert as any);

    return NextResponse.json({ message: "Grades saved successfully" }, { status: 201 });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
