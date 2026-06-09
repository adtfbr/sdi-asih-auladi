import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { attendanceRecords, classes, students } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { bulkAttendanceSchema } from "@/lib/validations";
import { getServerSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const classId = searchParams.get("classId");
    const date = searchParams.get("date");
    const studentId = searchParams.get("studentId");

    // Extra Backend Protection
    if (session.role === "siswa" || session.role === "wali") {
      if (studentId && Number(studentId) !== session.studentId) {
        return NextResponse.json({ error: "Forbidden: You cannot view other students' attendance." }, { status: 403 });
      }
    }

    const baseQuery = db
      .select({
        id: attendanceRecords.id,
        studentId: attendanceRecords.studentId,
        studentName: students.name,
        classId: attendanceRecords.classId,
        className: classes.name,
        date: attendanceRecords.date,
        status: attendanceRecords.status,
      })
      .from(attendanceRecords)
      .leftJoin(students, eq(attendanceRecords.studentId, students.id))
      .leftJoin(classes, eq(attendanceRecords.classId, classes.id));

    let conditions = [];
    if (classId) conditions.push(eq(attendanceRecords.classId, Number(classId)));
    if (date) conditions.push(eq(attendanceRecords.date, date));
    if (studentId) conditions.push(eq(attendanceRecords.studentId, Number(studentId)));

    let result;
    if (conditions.length > 0) {
      result = await baseQuery.where(and(...conditions));
    } else {
      result = await baseQuery;
    }

    // sort by date descending
    result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
    const parsed = bulkAttendanceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { classId, date, records } = parsed.data;

    await db
      .delete(attendanceRecords)
      .where(
        and(
          eq(attendanceRecords.classId, classId),
          eq(attendanceRecords.date, date)
        )
      );

    if (records.length === 0) {
      return NextResponse.json({ message: "No records to insert, existing cleared." });
    }

    const recordsToInsert = records.map(r => ({
      classId,
      date,
      studentId: r.studentId,
      status: r.status
    }));

    await db.insert(attendanceRecords).values(recordsToInsert);

    return NextResponse.json({ message: "Attendance saved successfully" }, { status: 201 });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
