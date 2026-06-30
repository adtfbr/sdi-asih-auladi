import { NextResponse } from "next/server";
import { db } from "@/db";
import { invoices, parents, students } from "@/db/schema";
import { eq, desc, inArray } from "drizzle-orm";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("auth_session");
    
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionData = JSON.parse(sessionCookie.value);
    if (!sessionData || sessionData.role !== "wali") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Ambil data siswa yang terhubung dengan wali ini
    const parentProfiles = await db.select().from(parents).where(eq(parents.userId, sessionData.id));
    if (parentProfiles.length === 0) {
      return NextResponse.json({ students: [], invoices: [] });
    }

    const studentIds = parentProfiles.map(p => p.studentId);
    
    // Ambil detail siswa
    const linkedStudents = await db.select().from(students).where(inArray(students.id, studentIds));

    // Ambil tagihan untuk siswa-siswa ini
    const allInvoices = await db.select({
      id: invoices.id,
      title: invoices.title,
      amount: invoices.amount,
      dueDate: invoices.dueDate,
      status: invoices.status,
      proofDocumentUrl: invoices.proofDocumentUrl,
      createdAt: invoices.createdAt,
      studentId: invoices.studentId,
      studentName: students.name,
    })
    .from(invoices)
    .innerJoin(students, eq(invoices.studentId, students.id))
    .where(inArray(invoices.studentId, studentIds))
    .orderBy(desc(invoices.createdAt));

    return NextResponse.json({
      students: linkedStudents,
      invoices: allInvoices,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
