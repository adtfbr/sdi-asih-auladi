import { NextResponse } from "next/server";
import { db } from "@/db";
import { classes, subjects, classStudents, students } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get("classId");

    // Jika ada classId, ambil daftar siswanya
    if (classId) {
      const studentsList = await db.select({
        id: students.id,
        nis: students.nis,
        name: students.name,
      })
      .from(classStudents)
      .innerJoin(students, eq(classStudents.studentId, students.id))
      .where(eq(classStudents.classId, Number(classId)))
      .orderBy(students.name);

      return NextResponse.json({ students: studentsList });
    }

    // Jika tidak ada classId, ambil referensi master (kelas & mapel)
    const classList = await db.select().from(classes).orderBy(classes.level, classes.name);
    const subjectList = await db.select().from(subjects).orderBy(subjects.name);

    return NextResponse.json({ classes: classList, subjects: subjectList });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
