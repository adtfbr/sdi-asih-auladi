import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { news } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { getServerSession } from "@/lib/auth";

export async function GET() {
  try {
    const data = await db.select().from(news).orderBy(desc(news.createdAt));
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
    const { title, content, imageUrl, status } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    // Basic slug generation
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

    const [inserted] = await db.insert(news).values({
      title,
      slug,
      content,
      imageUrl: imageUrl || null,
      status: status || 'draft',
      authorId: session.id
    }).returning();

    return NextResponse.json(inserted, { status: 201 });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
