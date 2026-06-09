import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { learningMaterials, classes, subjects, teachers } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { createMaterialSchema } from "@/lib/validations";
import { getServerSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const classId = searchParams.get("classId");
    const teacherId = searchParams.get("teacherId");

    // Extra Backend Protection
    if (session.role === "siswa" || session.role === "wali") {
      if (classId && Number(classId) !== session.classId) {
        return NextResponse.json({ error: "Forbidden: You cannot view other classes' materials." }, { status: 403 });
      }
    } else if (session.role === "guru") {
      if (teacherId && Number(teacherId) !== session.teacherId) {
        return NextResponse.json({ error: "Forbidden: You cannot view other teachers' materials." }, { status: 403 });
      }
    }

    const baseQuery = db
      .select({
        id: learningMaterials.id,
        title: learningMaterials.title,
        description: learningMaterials.description,
        fileUrl: learningMaterials.fileUrl,
        classId: learningMaterials.classId,
        className: classes.name,
        subjectId: learningMaterials.subjectId,
        subjectName: subjects.name,
        teacherId: learningMaterials.teacherId,
        teacherName: teachers.name,
        createdAt: learningMaterials.createdAt,
      })
      .from(learningMaterials)
      .leftJoin(classes, eq(learningMaterials.classId, classes.id))
      .leftJoin(subjects, eq(learningMaterials.subjectId, subjects.id))
      .leftJoin(teachers, eq(learningMaterials.teacherId, teachers.id))
      .orderBy(desc(learningMaterials.createdAt));

    let result = await baseQuery;

    if (classId) {
      result = result.filter(m => m.classId === null || m.classId === Number(classId));
    }
    if (teacherId) {
      result = result.filter(m => m.teacherId === Number(teacherId));
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || (session.role !== "admin" && session.role !== "guru")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = createMaterialSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    if (session.role === "guru" && parsed.data.teacherId !== session.teacherId) {
       return NextResponse.json({ error: "Forbidden: Cannot upload material for other teachers." }, { status: 403 });
    }

    const [newMaterial] = await db.insert(learningMaterials).values(parsed.data).returning();
    return NextResponse.json(newMaterial, { status: 201 });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
