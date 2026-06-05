import { NextResponse } from "next/server";
import { db } from "@/db";
import { students, teachers, ppdbApplications, attendanceRecords } from "@/db/schema";
import { count, eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const totalStudents = await db.select({ value: count() }).from(students);
    const totalTeachers = await db.select({ value: count() }).from(teachers);
    const totalPpdb = await db.select({ value: count() }).from(ppdbApplications);
    const verifiedPpdb = await db.select({ value: count() }).from(ppdbApplications).where(eq(ppdbApplications.status, 'Verified'));
    
    // Calculate attendance roughly (Hadir / Total)
    const totalAttendance = await db.select({ value: count() }).from(attendanceRecords);
    const hadirAttendance = await db.select({ value: count() }).from(attendanceRecords).where(eq(attendanceRecords.status, 'Hadir'));
    
    let attendanceRate = 0;
    if (totalAttendance[0].value > 0) {
      attendanceRate = Math.round((hadirAttendance[0].value / totalAttendance[0].value) * 100);
    } else {
      attendanceRate = 100; // default mock if empty
    }

    const recentPpdb = await db.select({
      id: ppdbApplications.id,
      name: ppdbApplications.studentName,
      status: ppdbApplications.status,
      date: ppdbApplications.submittedAt
    }).from(ppdbApplications).orderBy(desc(ppdbApplications.id)).limit(4);

    const data = {
      stats: {
        totalStudents: {
          value: totalStudents[0].value,
          trend: "+0 dari tahun lalu"
        },
        totalTeachers: {
          value: totalTeachers[0].value,
          description: "Aktif mengajar semester ini"
        },
        attendanceRate: {
          value: `${attendanceRate}%`,
          trend: "+0% dari kemarin"
        },
        ppdbApplicants: {
          value: totalPpdb[0].value,
          verified: verifiedPpdb[0].value
        }
      },
      recentPpdb: recentPpdb.map(p => ({
        ...p,
        date: p.date ? p.date.toLocaleDateString('id-ID') : 'Hari ini'
      }))
    };

    return NextResponse.json(data);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
