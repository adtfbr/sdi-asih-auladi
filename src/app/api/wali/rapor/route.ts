import { NextResponse } from "next/server";
import { db } from "@/db";
import { parents, students, grades, tahfidzRecords, subjects } from "@/db/schema";
import { eq, desc, inArray } from "drizzle-orm";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("auth_session");
    if (!sessionCookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const sessionData = JSON.parse(sessionCookie.value);
    
    // Untuk MVP, kita abaikan check role agar bisa dites mudah, tapi aslinya ini untuk wali atau siswa.
    const userId = sessionData.id;

    // Cari siswa yang terhubung (bisa siswa itu sendiri jika login sbg siswa, atau anak jika wali)
    let studentIds: number[] = [];
    
    if (sessionData.role === "siswa") {
      // Jika siswa, dia hanya punya 1 profil student yang userId nya sama
      const studentProfiles = await db.select().from(students).where(eq(students.userId, userId));
      studentIds = studentProfiles.map(s => s.id);
    } else {
      // Jika wali
      const parentProfiles = await db.select().from(parents).where(eq(parents.userId, userId));
      studentIds = parentProfiles.map(p => p.studentId);
    }

    if (studentIds.length === 0) {
      return NextResponse.json({ students: [], grades: [], tahfidz: [] });
    }

    const linkedStudents = await db.select().from(students).where(inArray(students.id, studentIds));

    // Ambil nilai akademik
    const studentGrades = await db.select({
      id: grades.id,
      studentId: grades.studentId,
      subjectName: subjects.name,
      academicYear: grades.academicYear,
      type: grades.type,
      semester: grades.semester,
      score: grades.score,
      notes: grades.notes,
    })
    .from(grades)
    .innerJoin(subjects, eq(grades.subjectId, subjects.id))
    .where(inArray(grades.studentId, studentIds))
    .orderBy(desc(grades.id));

    // Ambil catatan tahfidz
    const studentTahfidz = await db.select()
      .from(tahfidzRecords)
      .where(inArray(tahfidzRecords.studentId, studentIds))
      .orderBy(desc(tahfidzRecords.date));

    return NextResponse.json({
      students: linkedStudents,
      grades: studentGrades,
      tahfidz: studentTahfidz,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
