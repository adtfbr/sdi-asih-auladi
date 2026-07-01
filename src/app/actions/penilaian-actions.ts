"use server";

import { db } from "@/db";
import { grades, tahfidzRecords } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createGrade(data: {
  studentId: number;
  classId: number;
  subjectId: number;
  teacherId: number;
  semester: string;
  type: string; // Formatif, Sumatif
  score: number;
  notes: string;
}) {
  try {
    await db.insert(grades).values({
      studentId: data.studentId,
      classId: data.classId,
      subjectId: data.subjectId,
      teacherId: data.teacherId,
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
  teacherId: number;
  surah: string;
  ayat: string;
  predicate: string;
  date: string;
  notes: string;
}) {
  try {
    await db.insert(tahfidzRecords).values({
      studentId: data.studentId,
      teacherId: data.teacherId,
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
