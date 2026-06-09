import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { schedules, classes, subjects, teachers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createScheduleSchema } from "@/lib/validations";
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
        return NextResponse.json({ error: "Forbidden: You cannot view other classes' schedules." }, { status: 403 });
      }
    } else if (session.role === "guru") {
      if (teacherId && Number(teacherId) !== session.teacherId) {
        return NextResponse.json({ error: "Forbidden: You cannot view other teachers' schedules." }, { status: 403 });
      }
    }

    const baseQuery = db
      .select({
        id: schedules.id,
        classId: schedules.classId,
        className: classes.name,
        classLevel: classes.level,
        subjectId: schedules.subjectId,
        subjectName: subjects.name,
        teacherId: schedules.teacherId,
        teacherName: teachers.name,
        dayOfWeek: schedules.dayOfWeek,
        startTime: schedules.startTime,
        endTime: schedules.endTime,
      })
      .from(schedules)
      .leftJoin(classes, eq(schedules.classId, classes.id))
      .leftJoin(subjects, eq(schedules.subjectId, subjects.id))
      .leftJoin(teachers, eq(schedules.teacherId, teachers.id));

    let result = await baseQuery;

    if (classId) {
      result = result.filter(s => s.classId === Number(classId));
    }
    if (teacherId) {
      result = result.filter(s => s.teacherId === Number(teacherId));
    }

    // Sort by dayOfWeek and startTime
    result.sort((a, b) => {
      if (a.dayOfWeek !== b.dayOfWeek) return a.dayOfWeek - b.dayOfWeek;
      return a.startTime.localeCompare(b.startTime);
    });

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
    const parsed = createScheduleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const [newSchedule] = await db.insert(schedules).values(parsed.data).returning();
    return NextResponse.json(newSchedule, { status: 201 });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
