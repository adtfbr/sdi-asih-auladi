import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { galleries } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { getServerSession } from "@/lib/auth";

export async function GET() {
  try {
    const data = await db.select().from(galleries).orderBy(desc(galleries.createdAt));
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, imageUrl } = body;

    if (!title || !imageUrl) {
      return NextResponse.json({ error: "Title and imageUrl are required" }, { status: 400 });
    }

    const [inserted] = await db.insert(galleries).values({
      title,
      description: description || null,
      imageUrl
    }).returning();

    return NextResponse.json(inserted, { status: 201 });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
