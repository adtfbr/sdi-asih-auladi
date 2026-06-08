import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { classes, academicYears, teachers, classStudents } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createClassSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const academicYearId = searchParams.get("academicYearId");

    const baseQuery = db
      .select({
        id: classes.id,
        name: classes.name,
        level: classes.level,
        academicYearId: classes.academicYearId,
        academicYearName: academicYears.name,
        homeroomTeacherId: classes.homeroomTeacherId,
        homeroomTeacherName: teachers.name,
        studentCount: count(classStudents.id),
      })
      .from(classes)
      .leftJoin(academicYears, eq(classes.academicYearId, academicYears.id))
      .leftJoin(teachers, eq(classes.homeroomTeacherId, teachers.id))
      .leftJoin(classStudents, eq(classes.id, classStudents.classId))
      .groupBy(classes.id, academicYears.name, teachers.name);

    const result = academicYearId
      ? await baseQuery.where(eq(classes.academicYearId, Number(academicYearId)))
      : await baseQuery;

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createClassSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const [newClass] = await db.insert(classes).values(parsed.data).returning();
    return NextResponse.json(newClass, { status: 201 });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
