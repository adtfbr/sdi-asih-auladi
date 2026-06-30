import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { communicationBooks, students, users, parents, teachers } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("auth_session");
    
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionData = JSON.parse(sessionCookie.value);
    
    // In our simplified MVP, we use "siswa" for both student and parent logins
    // or maybe "wali" if the role is wali. Let's allow both or just "wali".
    // For now, let's assume the user has role 'wali'
    
    // Find parent profile(s) to get linked students
    const parentProfiles = await db.select().from(parents).where(eq(parents.userId, sessionData.id));
    
    // If not a parent, maybe it's a student trying to view? We will restrict this to 'wali' for now.
    // If we haven't implemented wali login yet, we can fallback to student login for demo purposes.
    // Let's check if the user is a student instead (for testing since Wali creation isn't fully built)
    let linkedStudentIds: number[] = [];
    
    if (sessionData.role === "siswa") {
      const [studentProfile] = await db.select().from(students).where(eq(students.userId, sessionData.id)).limit(1);
      if (studentProfile) linkedStudentIds.push(studentProfile.id);
    } else if (sessionData.role === "wali" && parentProfiles.length > 0) {
      linkedStudentIds = parentProfiles.map(p => p.studentId);
    }

    if (linkedStudentIds.length === 0) {
      return NextResponse.json({ error: "Tidak ada siswa yang terhubung" }, { status: 404 });
    }

    // Fetch the students data
    const linkedStudents = await db.select({
      id: students.id,
      name: students.name,
      nis: students.nis,
    }).from(students).where(eq(students.id, linkedStudentIds[0])); // MVP: handle first student

    if (linkedStudents.length === 0) {
      return NextResponse.json({ error: "Data siswa tidak ditemukan" }, { status: 404 });
    }

    const studentId = linkedStudents[0].id;

    // Fetch notes related to this student
    const notes = await db.select({
      id: communicationBooks.id,
      type: communicationBooks.type,
      message: communicationBooks.message,
      reply: communicationBooks.reply,
      senderRole: communicationBooks.senderRole,
      isReadByParent: communicationBooks.isReadByParent,
      isReadByTeacher: communicationBooks.isReadByTeacher,
      createdAt: communicationBooks.createdAt,
      teacherId: communicationBooks.teacherId,
      teacherName: teachers.name,
    })
    .from(communicationBooks)
    .leftJoin(teachers, eq(communicationBooks.teacherId, teachers.id))
    .where(eq(communicationBooks.studentId, studentId))
    .orderBy(desc(communicationBooks.createdAt));

    // For sending leave requests, the parent needs to know which teacher to send it to.
    // In MVP, we fetch all active teachers so the parent can pick the homeroom teacher,
    // or we just default to the first teacher. Let's fetch all teachers for the dropdown.
    const allTeachers = await db.select({
      id: teachers.id,
      name: teachers.name,
    }).from(teachers).where(eq(teachers.status, "Aktif"));

    return NextResponse.json({ 
      student: linkedStudents[0],
      notes,
      teachers: allTeachers
    });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
