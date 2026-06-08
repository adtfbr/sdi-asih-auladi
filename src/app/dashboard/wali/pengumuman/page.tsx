"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, Bell } from "lucide-react";

export default function WaliPengumumanPage() {
  const announcements = [
    {
      id: 1,
      title: "Pengambilan Rapor Semester Ganjil",
      date: "15 Des 2025",
      content: "Yth. Bapak/Ibu Wali Murid, pengambilan rapor semester ganjil akan dilaksanakan pada hari Sabtu pukul 08:00 - 11:30 WIB bertempat di ruang kelas masing-masing. Kehadiran sangat kami harapkan.",
    },
    {
      id: 2,
      title: "Libur Nasional Maulid Nabi",
      date: "12 Okt 2025",
      content: "Kegiatan belajar mengajar diliburkan pada hari Kamis terkait libur nasional Maulid Nabi. Siswa kembali masuk pada hari Jumat.",
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Pengumuman & Informasi</h2>
        <p className="text-slate-500">Pemberitahuan resmi dari pihak sekolah untuk Wali Murid.</p>
      </div>

      <div className="grid gap-4">
        {announcements.map((item) => (
          <Card key={item.id} className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 border-b border-slate-50">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
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
