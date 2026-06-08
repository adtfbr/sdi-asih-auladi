"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, Bell } from "lucide-react";

export default function SiswaPengumumanPage() {
  const announcements = [
    {
      id: 1,
      title: "Libur Nasional Maulid Nabi",
      date: "12 Okt 2025",
      content: "Diberitahukan kepada seluruh siswa bahwa kegiatan belajar mengajar diliburkan pada hari Kamis terkait libur nasional Maulid Nabi.",
    },
    {
      id: 2,
      title: "Jadwal Ujian Tengah Semester",
      date: "25 Sep 2025",
      content: "Ujian Tengah Semester (UTS) akan dilaksanakan mulai minggu depan. Siswa diharapkan mempersiapkan diri dengan baik dan mengecek jadwal ujian di portal.",
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Pengumuman Sekolah</h2>
        <p className="text-slate-500">Informasi terbaru dan papan buletin sekolah.</p>
      </div>

      <div className="grid gap-4">
        {announcements.map((item) => (
          <Card key={item.id} className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 border-b border-slate-50">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Bell className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {item.date}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-slate-700 leading-relaxed text-sm">
                {item.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
