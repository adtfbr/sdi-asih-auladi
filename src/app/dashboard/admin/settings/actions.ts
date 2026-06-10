"use server";

import { db } from "@/db";
import { systemSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getSystemSettings() {
  try {
    const [settings] = await db.select().from(systemSettings).limit(1);
    return settings || null;
  } catch (error) {
    console.error("Failed to fetch system settings:", error);
    return null;
  }
}

export async function updateSystemSettings(data: {
  schoolName?: string;
  npsn?: string;
  address?: string;
  ppdbStatus?: string;
  ppdbWave?: string;
}) {
  try {
    const existing = await getSystemSettings();
    
    if (!existing) {
      await db.insert(systemSettings).values({
        schoolName: data.schoolName || "SDI Asih Auladi",
        npsn: data.npsn || "20212345",
        address: data.address || "Jl. Pendidikan No. 123",
        ppdbStatus: data.ppdbStatus || "open",
        ppdbWave: data.ppdbWave || "Gelombang 1",
        ...data
      });
    } else {
      await db.update(systemSettings)
        .set(data)
        .where(eq(systemSettings.id, existing.id));
    }
    
    // Revalidate paths that use these settings
    revalidatePath("/");
    revalidatePath("/profil");
    revalidatePath("/dashboard/admin/settings");
    
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update settings:", error);
    return { error: error.message || "Gagal menyimpan pengaturan" };
  }
}
