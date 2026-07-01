import { NextResponse } from "next/server";
import { db } from "@/db";
import { teachers, users } from "@/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!Array.isArray(data)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    let successCount = 0;
    
    // Process each teacher
    for (const row of data) {
      if (!row.nip || !row.name) continue;

      // Create user account
      const passwordHash = await bcrypt.hash(row.nip, 10);
      const email = row.email || `${row.nip}@sdiasih.com`; // fallback to nip email

      // check if user exists
      let userRes = await db.select().from(users).where(eq(users.email, email)).limit(1);
      let userId;
      
      if (userRes.length === 0) {
        const newUser = await db.insert(users).values({
          name: row.name,
          email: email,
          password: passwordHash,
          role: "guru",
        }).returning({ id: users.id });
        userId = newUser[0].id;
      } else {
        userId = userRes[0].id;
      }

      // Create teacher
      let teacherRes = await db.select().from(teachers).where(eq(teachers.nip, row.nip)).limit(1);

      if (teacherRes.length === 0) {
        await db.insert(teachers).values({
          userId: userId,
          nip: row.nip,
          name: row.name,
          email: email,
          phone: row.phone || null,
          position: row.position || 'Guru Kelas',
          status: row.status || 'Aktif',
        });
      }

      successCount++;
    }

    return NextResponse.json({ success: true, count: successCount });
  } catch (error: any) {
    console.error("Bulk import error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
