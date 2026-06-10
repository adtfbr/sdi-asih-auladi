import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PPDBForm } from "./PPDBForm";
import { db } from "@/db";
import { systemSettings } from "@/db/schema";

export const revalidate = 60; // Optional: cache for 60 seconds

export default async function PPDBPage() {
  const [settingsResult] = await db.select().from(systemSettings).limit(1);
  const settings = settingsResult || { ppdbWave: "Gelombang 1", ppdbStatus: "open" };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Banner */}
      <div className="bg-emerald-700 pb-24 pt-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <Link href="/" className="inline-flex items-center text-emerald-100 hover:text-white mb-8 transition-colors text-sm font-medium">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Beranda
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Formulir Pendaftaran Siswa Baru
          </h1>
          <p className="text-emerald-100 text-lg max-w-2xl">
            {settings.ppdbStatus === "closed" ? "Pendaftaran sedang ditutup." : `Pendaftaran PPDB ${settings.ppdbWave}. Silakan lengkapi data diri calon peserta didik, data orang tua, dan unggah dokumen yang diperlukan.`}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 relative z-20 -mt-16 pb-24">
        {settings.ppdbStatus === "closed" ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-xl shadow-slate-200/50 max-w-4xl mx-auto border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Mohon Maaf, Pendaftaran Ditutup</h2>
            <p className="text-slate-500">Saat ini kami tidak menerima pendaftaran siswa baru. Silakan pantau informasi selanjutnya.</p>
          </div>
        ) : (
          <PPDBForm />
        )}
      </div>
    </div>
  );
}
