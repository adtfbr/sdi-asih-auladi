import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { announcements } from "@/db/schema";
import { desc } from "drizzle-orm";
import { createAnnouncementSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetRole = searchParams.get("targetRole");

    const baseQuery = db.select().from(announcements).orderBy(desc(announcements.createdAt));

    const result = await baseQuery;
    
    // Filter by targetRole if provided (also include 'semua')
    let filtered = result;
    if (targetRole) {
      filtered = result.filter(r => r.targetRole === targetRole || r.targetRole === 'semua');
    }

    return NextResponse.json(filtered);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createAnnouncementSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const [newAnnouncement] = await db.insert(announcements).values(parsed.data).returning();
    return NextResponse.json(newAnnouncement, { status: 201 });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
