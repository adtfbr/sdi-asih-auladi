import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { attendanceRecords, students, classes } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { bulkCreateAttendanceSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get("classId");
    const date = searchParams.get("date");
    const studentId = searchParams.get("studentId");

    const conditions = [];
    if (classId) conditions.push(eq(attendanceRecords.classId, Number(classId)));
    if (date) conditions.push(eq(attendanceRecords.date, date));
    if (studentId) conditions.push(eq(attendanceRecords.studentId, Number(studentId)));

    const result = await db
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
      .leftJoin(classes, eq(attendanceRecords.classId, classes.id))
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
    const parsed = bulkCreateAttendanceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { classId, date, records } = parsed.data;

    // Delete existing attendance for this class/date before inserting
    await db
      .delete(attendanceRecords)
      .where(
        and(
          eq(attendanceRecords.classId, classId),
          eq(attendanceRecords.date, date)
        )
      );

    // Insert new records
    const values = records.map((r) => ({
      studentId: r.studentId,
      classId,
      date,
      status: r.status,
    }));

    const inserted = await db
      .insert(attendanceRecords)
      .values(values)
      .returning();

    return NextResponse.json(inserted, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
