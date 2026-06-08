import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email dan password wajib diisi" }, { status: 400 });
    }

    // 1. Find user by email
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (!user) {
      return NextResponse.json({ error: "Email tidak ditemukan" }, { status: 401 });
    }

    // 2. Simple password check (in real app, use bcrypt)
    if (user.password !== password) {
      return NextResponse.json({ error: "Password salah" }, { status: 401 });
    }

    // 3. Create simple cookie payload
    const sessionData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    // 4. Set cookie
    const response = NextResponse.json({ 
      success: true, 
      role: user.role 
    });

    response.cookies.set({
      name: 'auth_session',
      value: JSON.stringify(sessionData),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 1 day
    });

    return response;

  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
