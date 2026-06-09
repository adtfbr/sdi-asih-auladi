import { cookies } from "next/headers";
import { db } from "@/db";
import { users, teachers, students, parents, classStudents } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getServerSession() {
  const cookieStore = await cookies();
  const authSession = cookieStore.get("auth_session");
  if (!authSession) return null;

  try {
    const sessionPayload = JSON.parse(authSession.value);
    const userId = sessionPayload.id;

    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) return null;

    let extraData: any = {};

    if (user.role === "guru") {
      const [teacher] = await db.select().from(teachers).where(eq(teachers.userId, user.id)).limit(1);
      if (teacher) extraData.teacherId = teacher.id;
    } else if (user.role === "siswa") {
      const [student] = await db.select().from(students).where(eq(students.userId, user.id)).limit(1);
      if (student) {
        extraData.studentId = student.id;
        const [cs] = await db.select().from(classStudents).where(eq(classStudents.studentId, student.id)).orderBy(desc(classStudents.id)).limit(1);
        if (cs) extraData.classId = cs.classId;
      }
    } else if (user.role === "wali") {
      const [parent] = await db.select().from(parents).where(eq(parents.userId, user.id)).limit(1);
      if (parent) {
        extraData.parentId = parent.id;
        extraData.studentId = parent.studentId;
        const [cs] = await db.select().from(classStudents).where(eq(classStudents.studentId, parent.studentId)).orderBy(desc(classStudents.id)).limit(1);
        if (cs) extraData.classId = cs.classId;
      }
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      ...extraData
    };
  } catch (error) {
    return null;
  }
}
