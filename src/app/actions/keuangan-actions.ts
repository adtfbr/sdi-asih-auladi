"use server";

import { db } from "@/db";
import { invoices, classStudents, students, users } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createInvoiceForClass(data: {
  classId: number;
  title: string;
  amount: number;
  dueDate: string;
}) {
  try {
    // 1. Dapatkan semua studentId di class tersebut
    const studentsInClass = await db.select({
      studentId: classStudents.studentId
    })
    .from(classStudents)
    .where(eq(classStudents.classId, data.classId));

    if (studentsInClass.length === 0) {
      return { success: false, error: "Kelas ini belum memiliki siswa." };
    }

    // 2. Buat invoice bulk insert
    const insertData = studentsInClass.map((s) => ({
      studentId: s.studentId,
      title: data.title,
      amount: data.amount.toString(),
      dueDate: data.dueDate,
      status: "Unpaid"
    }));

    await db.insert(invoices).values(insertData);

    revalidatePath("/dashboard/admin/keuangan");
    return { success: true, count: insertData.length };
  } catch (error: any) {
    console.error("Error creating invoices:", error);
    return { success: false, error: error.message || "Terjadi kesalahan internal." };
  }
}

export async function uploadPaymentProof(invoiceId: number, proofBase64: string) {
  try {
    await db.update(invoices)
      .set({ 
        proofDocumentUrl: proofBase64,
        status: "Pending Verification",
        updatedAt: new Date()
      })
      .where(eq(invoices.id, invoiceId));

    revalidatePath("/dashboard/wali/keuangan");
    revalidatePath("/dashboard/admin/keuangan");
    return { success: true };
  } catch (error: any) {
    console.error("Error uploading payment proof:", error);
    return { success: false, error: error.message || "Gagal mengunggah bukti." };
  }
}

import { cookies } from "next/headers";

export async function verifyPayment(invoiceId: number, status: "Paid" | "Rejected") {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("auth_session");
    if (!sessionCookie) throw new Error("Unauthorized");
    const sessionData = JSON.parse(sessionCookie.value);
    const adminUserId = sessionData.id;
    await db.update(invoices)
      .set({
        status: status,
        verifiedBy: adminUserId,
        verifiedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(invoices.id, invoiceId));

    revalidatePath("/dashboard/admin/keuangan");
    revalidatePath("/dashboard/wali/keuangan");
    return { success: true };
  } catch (error: any) {
    console.error("Error verifying payment:", error);
    return { success: false, error: error.message || "Gagal verifikasi pembayaran." };
  }
}
