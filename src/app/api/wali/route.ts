import { NextResponse } from "next/server";
import { db } from "@/db";
import { parents, students, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");

    // Fetch parents with linked student info
    let query = db.select({
      id: parents.id,
      name: parents.name,
      email: users.email,
      phone: parents.phone,
      studentName: students.name,
      studentNis: students.nis,
    })
    .from(parents)
    .leftJoin(users, eq(parents.userId, users.id))
    .leftJoin(students, eq(parents.studentId, students.id))
    .orderBy(desc(parents.id));

    // We can add search logic if needed, but for MVP returning all is fine
    const result = await query;
    return NextResponse.json(result);

  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
