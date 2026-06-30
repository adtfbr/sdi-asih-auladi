"use server";

import { db } from "@/db";
import { users, teachers, students, parents } from "@/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Helper to hash password
async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function createTeacherWithAccount(data: {
  name: string;
  nip: string;
  email: string;
  phone?: string;
}) {
  try {
    // Check if email or NIP already exists
    const existingTeacher = await db.select().from(teachers).where(eq(teachers.nip, data.nip)).limit(1);
    if (existingTeacher.length > 0) {
      return { success: false, error: "NIP sudah terdaftar." };
    }

    const existingUser = await db.select().from(users).where(eq(users.email, data.email)).limit(1);
    if (existingUser.length > 0) {
      return { success: false, error: "Email sudah digunakan." };
    }

    // Default password is nip
    const hashedPassword = await hashPassword(data.nip);

    // Create user
    const [newUser] = await db.insert(users).values({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: "guru",
    }).returning({ id: users.id });

    // Create teacher linked to user
    await db.insert(teachers).values({
      userId: newUser.id,
      name: data.name,
      nip: data.nip,
      email: data.email,
      phone: data.phone || null,
      status: "Aktif",
    });

    revalidatePath("/dashboard/admin/guru");
    return { success: true };
  } catch (error: any) {
    console.error("Error creating teacher:", error);
    return { success: false, error: error.message || "Terjadi kesalahan internal." };
  }
}

export async function createStudentWithAccount(data: {
  name: string;
  nis: string;
  nisn: string;
  gender: string;
  birthDate: string;
  address?: string;
}) {
  try {
    // Check if NIS or NISN already exists
    const existingStudentNIS = await db.select().from(students).where(eq(students.nis, data.nis)).limit(1);
    if (existingStudentNIS.length > 0) {
      return { success: false, error: "NIS sudah terdaftar." };
    }

    const existingStudentNISN = await db.select().from(students).where(eq(students.nisn, data.nisn)).limit(1);
    if (existingStudentNISN.length > 0) {
      return { success: false, error: "NISN sudah terdaftar." };
    }

    // Default email and password for student
    // We'll use nis@student.sdiasih-auladi.sch.id to guarantee uniqueness
    const email = `${data.nis}@student.sdiasih-auladi.sch.id`;
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) {
      return { success: false, error: "Akun login untuk NIS ini sudah ada." };
    }

    // Default password is NIS + birth date year (e.g. 12342015)
    // Or just format birthDate to YYYYMMDD
    const dateObj = new Date(data.birthDate);
    const pwdSuffix = dateObj.getFullYear().toString();
    const hashedPassword = await hashPassword(`${data.nis}${pwdSuffix}`);

    // Create user
    const [newUser] = await db.insert(users).values({
      name: data.name,
      email: email,
      password: hashedPassword,
      role: "siswa",
    }).returning({ id: users.id });

    // Create student linked to user
    await db.insert(students).values({
      userId: newUser.id,
      name: data.name,
      nis: data.nis,
      nisn: data.nisn,
      gender: data.gender,
      birthDate: data.birthDate,
      address: data.address || null,
      status: "Aktif",
    });

    revalidatePath("/dashboard/admin/siswa");
    return { success: true };
  } catch (error: any) {
    console.error("Error creating student:", error);
    return { success: false, error: error.message || "Terjadi kesalahan internal." };
  }
}

export async function createParentWithAccount(data: {
  name: string;
  email: string;
  studentId: number;
  phone?: string;
  address?: string;
}) {
  try {
    const existingUser = await db.select().from(users).where(eq(users.email, data.email)).limit(1);
    if (existingUser.length > 0) {
      return { success: false, error: "Email sudah terdaftar." };
    }

    const studentRecord = await db.select().from(students).where(eq(students.id, data.studentId)).limit(1);
    if (studentRecord.length === 0) {
      return { success: false, error: "Data siswa tidak ditemukan." };
    }

    // Default password for Wali is "orangtua[NIS]"
    const nis = studentRecord[0].nis;
    const hashedPassword = await hashPassword(`orangtua${nis}`);

    // Create user
    const [newUser] = await db.insert(users).values({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: "wali",
    }).returning({ id: users.id });

    // Create parent linked to user
    await db.insert(parents).values({
      userId: newUser.id,
      studentId: data.studentId,
      name: data.name,
      phone: data.phone || null,
      relationship: "Wali",
    });

    revalidatePath("/dashboard/admin/wali");
    return { success: true };
  } catch (error: any) {
    console.error("Error creating parent:", error);
    return { success: false, error: error.message || "Terjadi kesalahan internal." };
  }
}
