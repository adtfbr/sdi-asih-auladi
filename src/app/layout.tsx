import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { db } from "@/db";
import { systemSettings } from "@/db/schema";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-heading" });

export const metadata: Metadata = {
  title: "SDI Asih Auladi | Platform Manajemen Sekolah",
  description: "Platform manajemen sekolah berbasis web untuk mendigitalisasi operasional SDI Asih Auladi.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let settings = { schoolName: "SDI Asih Auladi", address: "Jl. Pendidikan No. 123", ppdbStatus: "open", ppdbWave: "Gelombang 1" };
  try {
    const [dbSettings] = await db.select().from(systemSettings).limit(1);
    if (dbSettings) {
      settings = {
        schoolName: dbSettings.schoolName || settings.schoolName,
        address: dbSettings.address || settings.address,
        ppdbStatus: dbSettings.ppdbStatus || settings.ppdbStatus,
        ppdbWave: dbSettings.ppdbWave || settings.ppdbWave
      };
    }
  } catch (error) {
    console.error("Layout failed to fetch systemSettings", error);
  }
  return (
    <html lang="id" className="scroll-smooth" data-scroll-behavior="smooth">
      <body className={`${inter.variable} ${jakarta.variable} font-sans antialiased flex flex-col min-h-screen`}>
        <ConditionalLayout settings={settings}>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}
