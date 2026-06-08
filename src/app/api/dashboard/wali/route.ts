import { NextResponse } from "next/server";
import { db } from "@/db";
import { parents, students, grades, subjects } from "@/db/schema";
import { eq, avg, desc } from "drizzle-orm";

export async function GET() {
  try {
    // Find parent Bapak Santoso
    const parentData = await db.select().from(parents).where(eq(parents.name, 'Bapak Santoso')).limit(1);
    const parent = parentData[0];
    
    const children: { id: number; name: string; class: string; avatarSeed: string }[] = [];
    let recentGrades: { id: number; subject: string | null; type: string; score: number | null; date: string }[] = [];
    let avgScore = 0;
    
    if (parent) {
      // Get child
      const childData = await db.select().from(students).where(eq(students.id, parent.studentId)).limit(1);
      const child = childData[0];
      
      if (child) {
        children.push({
          id: child.id,
          name: child.name,
          class: "Kelas 4B", // Hardcoded
          avatarSeed: child.name.split(' ')[0]
        });
        
        const avgQuery = await db.select({ value: avg(grades.score) }).from(grades).where(eq(grades.studentId, child.id));
        if (avgQuery[0].value) avgScore = parseFloat(Number(avgQuery[0].value).toFixed(1));
        
        // Get grades joined with subject
        const gradesList = await db.select({
          id: grades.id,
          subject: subjects.name,
          type: grades.type,
          score: grades.score,
        })
        .from(grades)
        .leftJoin(subjects, eq(grades.subjectId, subjects.id))
        .where(eq(grades.studentId, child.id))
        .orderBy(desc(grades.id))
        .limit(3);
        
        recentGrades = gradesList.map(g => ({
          ...g,
          date: 'Tercatat'
        }));
      }
    }

    const data = {
      children: children.length > 0 ? children : [{ id: 1, name: "Budi Santoso", class: "Kelas 4B", avatarSeed: "Budi" }],
      selectedChildStats: {
        attendance: "100%",
        averageScore: avgScore,
        todayStatus: {
          status: "Hadir di Sekolah",
          time: "Tiba pada 06:45 WIB"
        }
      },
      recentGrades: recentGrades.length > 0 ? recentGrades : [
        { id: 1, subject: "Matematika", type: "Ulangan Harian 2", score: 92, date: "Kemarin" },
      ],
      notifications: [
        {
          id: 1,
          title: "Pengingat Pembayaran SPP",
          content: "Pembayaran SPP bulan Juli paling lambat tanggal 10.",
          time: "1 jam yang lalu",
          type: "warning"
        }
      ]
    };

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
