import { NextResponse } from "next/server";
import { db } from "@/db";
import { students, grades, attendanceRecords } from "@/db/schema";
import { eq, avg, count, and } from "drizzle-orm";

export async function GET() {
  try {
    const studentData = await db.select().from(students).where(eq(students.name, 'Budi Santoso')).limit(1);
    const student = studentData[0];
    
    let averageScore = 0;
    let attendanceRate = 100;
    
    if (student) {
      const avgQuery = await db.select({ value: avg(grades.score) }).from(grades).where(eq(grades.studentId, student.id));
      if (avgQuery[0].value) averageScore = parseFloat(Number(avgQuery[0].value).toFixed(1));
      
      const totalAtt = await db.select({ value: count() }).from(attendanceRecords).where(eq(attendanceRecords.studentId, student.id));
      const hadirAtt = await db.select({ value: count() }).from(attendanceRecords).where(and(eq(attendanceRecords.studentId, student.id), eq(attendanceRecords.status, 'Hadir')));
      
      if (totalAtt[0].value > 0) {
        attendanceRate = Math.round((hadirAtt[0].value / totalAtt[0].value) * 100);
      }
    }

    const data = {
      studentInfo: {
        name: student?.name || "Siswa",
        className: "4B", // Hardcoded mock
        semester: "Ganjil",
        greeting: `Halo, ${student?.name.split(' ')[0] || "Siswa"}! 👋`,
        message: "Siap untuk belajar hari ini? Semangat!"
      },
      stats: {
        attendance: `${attendanceRate}%`,
        averageScore: averageScore
      },
      newMaterial: {
        subject: "IPA",
        topic: "Sistem Tata Surya"
      },
      schedule: [
        { id: 1, time: "07:30 - 09:00", subject: "Matematika", teacher: "Ust. Ahmad", status: "completed" },
        { id: 2, time: "09:30 - 11:00", subject: "Ilmu Pengetahuan Alam", teacher: "Usth. Siti", status: "current" },
      ],
      announcements: [
        { id: 1, title: "Persiapan UTS", content: "UTS dimulai tanggal 25 Juli.", time: "2 Jam yang lalu" }
      ]
    };

    return NextResponse.json(data);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
