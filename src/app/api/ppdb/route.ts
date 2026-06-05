import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { ppdbApplications } from "@/db/schema";
import { eq, ilike, and, desc } from "drizzle-orm";
import { createPpdbSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    const status = searchParams.get("status");

    const conditions = [];
    if (q) {
      conditions.push(ilike(ppdbApplications.studentName, `%${q}%`));
    }
    if (status && status !== "semua") {
      conditions.push(eq(ppdbApplications.status, status));
    }

    const result =
      conditions.length > 0
        ? await db
            .select()
            .from(ppdbApplications)
            .where(and(...conditions))
            .orderBy(desc(ppdbApplications.id))
        : await db
            .select()
            .from(ppdbApplications)
            .orderBy(desc(ppdbApplications.id));

    return NextResponse.json(result);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createPpdbSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Generate unique registration number
    const now = new Date();
    const year = now.getFullYear();
    const seq = Date.now().toString().slice(-4);
    const registrationNumber = `PPDB-${year}-${seq}`;

    const [newApp] = await db
      .insert(ppdbApplications)
      .values({
        ...parsed.data,
        registrationNumber,
      })
      .returning();

    return NextResponse.json(newApp, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
