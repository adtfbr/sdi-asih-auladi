import { NextResponse } from "next/server";
import { db } from "@/db";
import { invoices, students, classes } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    // Fetch all classes for the dropdown
    const classList = await db.select({
      id: classes.id,
      name: classes.name,
      level: classes.level,
    }).from(classes).orderBy(classes.level, classes.name);

    // Fetch all invoices
    const allInvoices = await db.select({
      id: invoices.id,
      title: invoices.title,
      amount: invoices.amount,
      dueDate: invoices.dueDate,
      status: invoices.status,
      proofDocumentUrl: invoices.proofDocumentUrl,
      createdAt: invoices.createdAt,
      studentName: students.name,
      studentNis: students.nis,
    })
    .from(invoices)
    .innerJoin(students, eq(invoices.studentId, students.id))
    .orderBy(desc(invoices.createdAt));

    return NextResponse.json({
      classes: classList,
      invoices: allInvoices,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
