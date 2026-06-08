import { NextResponse } from "next/server";
import { db } from "@/db";
import { teachers, classes } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    // Hardcoded for demo: Fetch Ust. Ahmad
    const teacherData = await db.select({
      id: teachers.id,
      name: teachers.name,
    }).from(teachers).where(eq(teachers.name, 'Ust. Ahmad')).limit(1);

    const teacher = teacherData[0];
    
    // Get their classes (as homeroom teacher)
    let schedule: { id: number; time: string; subject: string; class: string; status: string }[] = [];
    if (teacher) {
       const homeroomClasses = await db.select({
         id: classes.id,
         name: classes.name,
       }).from(classes).where(eq(classes.homeroomTeacherId, teacher.id));
       
       // Just mapping the class to a mock schedule format since we don't have a schedules table
       schedule = homeroomClasses.map((c, i) => ({
         id: c.id,
         time: "07:30 - 09:00", // mock
         subject: "Pelajaran Umum", // mock
         class: c.name,
         status: i === 0 ? "completed" : "upcoming"
       }));
    }

    const data = {
      teacherInfo: {
        name: teacher ? teacher.name : "Ust. Ahmad",
        currentDate: new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      },
      schedule: schedule.length > 0 ? schedule : [
        { id: 1, time: "07:30 - 09:00", subject: "Pendidikan Agama Islam", class: "Kelas 1A", status: "completed" },
      ],
      announcements: [
        { 
          id: 1, 
          title: "Rapat Rutin", 
          content: "Rapat evaluasi bulanan akan diadakan pada hari Jumat di Ruang Guru.", 
          date: "2 hari yang lalu",
          type: "warning" 
        },
      ]
    };

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
