"use server";

import { db } from "@/db";
import { grades, tahfidzRecords } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { cookies } from "next/headers";
import { teachers } from "@/db/schema";

export async function createGrade(data: {
  studentId: number;
  classId: number;
  subjectId: number;
  academicYear: string;
  semester: string;
  type: string; // Formatif, Sumatif
  score: number;
  notes: string;
}) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("auth_session");
    if (!sessionCookie) throw new Error("Unauthorized");
    const sessionData = JSON.parse(sessionCookie.value);
    
    const teacherProfile = await db.select().from(teachers).where(eq(teachers.userId, sessionData.id)).limit(1);
    if (teacherProfile.length === 0) throw new Error("Teacher profile not found");
    const teacherId = teacherProfile[0].id;

    await db.insert(grades).values({
      studentId: data.studentId,
      classId: data.classId,
      subjectId: data.subjectId,
      teacherId: teacherId,
      academicYear: data.academicYear,
      semester: data.semester,
      type: data.type,
      score: data.score.toString(),
      notes: data.notes,
    });

    revalidatePath("/dashboard/guru/nilai");
    return { success: true };
  } catch (error: any) {
    console.error("Error creating grade:", error);
    return { success: false, error: error.message || "Gagal menyimpan nilai." };
  }
}

export async function createTahfidzRecord(data: {
  studentId: number;
  surah: string;
  ayat: string;
  predicate: string;
  date: string;
  notes: string;
}) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("auth_session");
    if (!sessionCookie) throw new Error("Unauthorized");
    const sessionData = JSON.parse(sessionCookie.value);
    
    const teacherProfile = await db.select().from(teachers).where(eq(teachers.userId, sessionData.id)).limit(1);
    if (teacherProfile.length === 0) throw new Error("Teacher profile not found");
    const teacherId = teacherProfile[0].id;

    await db.insert(tahfidzRecords).values({
      studentId: data.studentId,
      teacherId: teacherId,
      surah: data.surah,
      ayat: data.ayat,
      predicate: data.predicate,
      date: data.date,
      notes: data.notes,
    });

    revalidatePath("/dashboard/guru/tahfidz");
    return { success: true };
  } catch (error: any) {
    console.error("Error creating tahfidz record:", error);
    return { success: false, error: error.message || "Gagal menyimpan tahfidz." };
  }
}
