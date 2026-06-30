"use server";

import { db } from "@/db";
import { communicationBooks } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createTeacherNote(data: {
  teacherId: number;
  studentId: number;
  type: string;
  message: string;
}) {
  try {
    await db.insert(communicationBooks).values({
      teacherId: data.teacherId,
      studentId: data.studentId,
      type: data.type,
      message: data.message,
      senderRole: "guru",
      isReadByTeacher: true, // sender already read it
      isReadByParent: false,
    });

    revalidatePath("/dashboard/guru/buku-penghubung");
    revalidatePath("/dashboard/wali/buku-penghubung");
    return { success: true };
  } catch (error: any) {
    console.error("Error creating teacher note:", error);
    return { success: false, error: error.message || "Gagal mengirim catatan." };
  }
}

export async function createParentLeaveRequest(data: {
  teacherId: number;
  studentId: number;
  message: string;
}) {
  try {
    await db.insert(communicationBooks).values({
      teacherId: data.teacherId,
      studentId: data.studentId,
      type: "Izin",
      message: data.message,
      senderRole: "wali",
      isReadByTeacher: false,
      isReadByParent: true,
    });

    revalidatePath("/dashboard/guru/buku-penghubung");
    revalidatePath("/dashboard/wali/buku-penghubung");
    return { success: true };
  } catch (error: any) {
    console.error("Error creating leave request:", error);
    return { success: false, error: error.message || "Gagal mengirim pengajuan izin." };
  }
}

export async function replyToNote(noteId: number, replyMessage: string, replierRole: "guru" | "wali") {
  try {
    const isTeacher = replierRole === "guru";
    
    await db.update(communicationBooks)
      .set({ 
        reply: replyMessage,
        isReadByTeacher: isTeacher ? true : false,
        isReadByParent: isTeacher ? false : true,
      })
      .where(eq(communicationBooks.id, noteId));

    revalidatePath("/dashboard/guru/buku-penghubung");
    revalidatePath("/dashboard/wali/buku-penghubung");
    return { success: true };
  } catch (error: any) {
    console.error("Error replying to note:", error);
    return { success: false, error: error.message || "Gagal mengirim balasan." };
  }
}

export async function markNoteAsRead(noteId: number, role: "guru" | "wali") {
  try {
    if (role === "guru") {
      await db.update(communicationBooks).set({ isReadByTeacher: true }).where(eq(communicationBooks.id, noteId));
    } else {
      await db.update(communicationBooks).set({ isReadByParent: true }).where(eq(communicationBooks.id, noteId));
    }
    
    // We don't necessarily revalidate path here if we update UI optimistically, 
    // but it's safer to revalidate to ensure sync.
    revalidatePath("/dashboard/guru/buku-penghubung");
    revalidatePath("/dashboard/wali/buku-penghubung");
    return { success: true };
  } catch (error: any) {
    console.error("Error marking as read:", error);
    return { success: false, error: "Gagal mengupdate status." };
  }
}
