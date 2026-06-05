import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { subjects } from "@/db/schema";
import { ilike } from "drizzle-orm";
import { createSubjectSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");

    const result = q
      ? await db.select().from(subjects).where(ilike(subjects.name, `%${q}%`))
      : await db.select().from(subjects);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createSubjectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const [newSubject] = await db.insert(subjects).values(parsed.data).returning();
    return NextResponse.json(newSubject, { status: 201 });
  } catch (error: any) {
    console.error(error);
    if (error.message?.includes("unique")) {
      return NextResponse.json(
        { error: "Kode mata pelajaran sudah terdaftar" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
