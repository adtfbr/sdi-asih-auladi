import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { communicationBooks, students, users, teachers, classes, classStudents } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("auth_session");
    
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionData = JSON.parse(sessionCookie.value);
    
    if (sessionData.role !== "guru") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Find teacher profile
    const [teacher] = await db.select().from(teachers).where(eq(teachers.userId, sessionData.id)).limit(1);

    if (!teacher) {
      return NextResponse.json({ error: "Profil guru tidak ditemukan" }, { status: 404 });
    }

    // For simplicity, fetch all students if we can't determine their class, 
    // or fetch students in classes taught by this teacher.
    // Let's just fetch ALL students for the MVP (since teachers might teach multiple classes)
    const allStudents = await db.select({
      id: students.id,
      name: students.name,
      nis: students.nis,
    }).from(students).where(eq(students.status, "Aktif"));

    // Fetch notes related to this teacher
    const notes = await db.select().from(communicationBooks)
      .where(eq(communicationBooks.teacherId, teacher.id))
      .orderBy(desc(communicationBooks.createdAt));

    return NextResponse.json({ 
      teacherId: teacher.id,
      students: allStudents,
      notes 
    });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
