import { NextRequest, NextResponse } from "next/server";
// In a real application, you'd use drizzle-orm to query a `schedules` table.
// Since the schema doesn't exist yet, we mock the validation logic.

export async function POST(request: NextRequest) {
  try {
    const { teacherId, day, timeStart, timeEnd } = await request.json();

    if (!teacherId || !day || !timeStart || !timeEnd) {
      return NextResponse.json(
        { error: "teacherId, day, timeStart, and timeEnd are required" },
        { status: 400 }
      );
    }

    // MOCK LOGIC: Assuming teacherId = 1 is busy on Senin at 07:30
    if (teacherId === 1 && day === "Senin" && timeStart === "07:30") {
      return NextResponse.json(
        { 
          isConflict: true, 
          message: "Jadwal bentrok: Guru sudah mengajar di Kelas 4B pada waktu tersebut." 
        },
        { status: 409 }
      );
    }

    return NextResponse.json({ 
      isConflict: false, 
      message: "Jadwal tersedia." 
    }, { status: 200 });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
