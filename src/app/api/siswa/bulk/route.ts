import { NextResponse } from "next/server";
import { db } from "@/db";
import { students, users, classStudents } from "@/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!Array.isArray(data)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    let successCount = 0;
    
    // Process each student
    for (const row of data) {
      if (!row.nis || !row.name) continue;

      // Create user account
      const passwordHash = await bcrypt.hash(row.nis, 10);
      const email = `${row.nis}@sdiasih.com`; // placeholder email

      // check if user exists
      let userRes = await db.select().from(users).where(eq(users.email, email)).limit(1);
      let userId;
      
      if (userRes.length === 0) {
        const newUser = await db.insert(users).values({
          name: row.name,
          email: email,
          password: passwordHash,
          role: "siswa",
        }).returning({ id: users.id });
        userId = newUser[0].id;
      } else {
        userId = userRes[0].id;
      }

      // Create student
      let studentRes = await db.select().from(students).where(eq(students.nis, row.nis)).limit(1);
      let studentId;

      if (studentRes.length === 0) {
        const newStudent = await db.insert(students).values({
          userId: userId,
          nis: row.nis,
          nisn: row.nisn || row.nis,
          name: row.name,
          gender: row.gender === "P" || row.gender?.toLowerCase() === "perempuan" ? "Perempuan" : "Laki-laki",
          birthDate: row.birthDate ? new Date(row.birthDate).toISOString().split('T')[0] : "2015-01-01",
          status: "Aktif",
        }).returning({ id: students.id });
        studentId = newStudent[0].id;
      } else {
        studentId = studentRes[0].id;
      }

      // Assign class if provided
      if (row.classId) {
        await db.delete(classStudents).where(eq(classStudents.studentId, studentId));
        await db.insert(classStudents).values({
          studentId: studentId,
          classId: Number(row.classId),
        });
      }

      successCount++;
    }

    return NextResponse.json({ success: true, count: successCount });
  } catch (error: any) {
    console.error("Bulk import error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
