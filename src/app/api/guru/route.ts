import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { teachers } from "@/db/schema";
import { eq, ilike, and } from "drizzle-orm";
import { createTeacherSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    const status = searchParams.get("status");

    const conditions = [];
    if (q) {
      conditions.push(ilike(teachers.name, `%${q}%`));
    }
    if (status && status !== "semua") {
      conditions.push(eq(teachers.status, status));
    }

    const result =
      conditions.length > 0
        ? await db.select().from(teachers).where(and(...conditions))
        : await db.select().from(teachers);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createTeacherSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const [newTeacher] = await db
      .insert(teachers)
      .values(parsed.data)
      .returning();

    return NextResponse.json(newTeacher, { status: 201 });
  } catch (error: any) {
    console.error(error);
    if (error.message?.includes("unique")) {
      return NextResponse.json(
        { error: "NIP atau email sudah terdaftar" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
