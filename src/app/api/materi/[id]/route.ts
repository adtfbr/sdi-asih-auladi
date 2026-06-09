import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { learningMaterials } from "@/db/schema";
import { eq } from "drizzle-orm";
import { updateMaterialSchema } from "@/lib/validations";
import { getServerSession } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const [material] = await db
      .select()
      .from(learningMaterials)
      .where(eq(learningMaterials.id, Number(id)))
      .limit(1);

    if (!material) {
      return NextResponse.json({ error: "Materi tidak ditemukan" }, { status: 404 });
    }

    if (session.role === "guru" && material.teacherId !== session.teacherId) {
      return NextResponse.json({ error: "Forbidden: Cannot view other teacher's material" }, { status: 403 });
    }

    return NextResponse.json(material);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session || (session.role !== "admin" && session.role !== "guru")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    if (session.role === "guru") {
      const [existing] = await db.select().from(learningMaterials).where(eq(learningMaterials.id, Number(id))).limit(1);
      if (!existing || existing.teacherId !== session.teacherId) {
        return NextResponse.json({ error: "Forbidden: Cannot update other teacher's material" }, { status: 403 });
      }
    }

    const body = await request.json();
    const parsed = updateMaterialSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const [updated] = await db
      .update(learningMaterials)
      .set(parsed.data)
      .where(eq(learningMaterials.id, Number(id)))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Materi tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session || (session.role !== "admin" && session.role !== "guru")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    if (session.role === "guru") {
      const [existing] = await db.select().from(learningMaterials).where(eq(learningMaterials.id, Number(id))).limit(1);
      if (!existing || existing.teacherId !== session.teacherId) {
        return NextResponse.json({ error: "Forbidden: Cannot delete other teacher's material" }, { status: 403 });
      }
    }
    const [deleted] = await db
      .delete(learningMaterials)
      .where(eq(learningMaterials.id, Number(id)))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: "Materi tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ message: "Materi berhasil dihapus" });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
