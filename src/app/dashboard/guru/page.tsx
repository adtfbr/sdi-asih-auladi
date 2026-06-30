"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, ClipboardList, BookOpen, Clock, FileText, ArrowRight, Users } from "lucide-react";

interface ScheduleItem {
  id: number;
  subject: string;
  class: string;
  time: string;
  status: string;
}

interface AnnouncementItem {
  id: number;
  type: string;
  title: string;
  content: string;
  date: string;
}

interface GuruDashboardData {
  teacherInfo: {
    name: string;
    currentDate: string;
  };
  schedule: ScheduleItem[];
  announcements: AnnouncementItem[];
}

export default function GuruDashboard() {
  const [data, setData] = useState<GuruDashboardData | null>(null);

  useEffect(() => {
    fetch('/api/dashboard/guru')
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <div className="flex justify-center items-center h-64">Memuat data...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-900">Selamat Datang, {data.teacherInfo.name}</h2>
          <p className="text-stone-500">Semoga hari ini penuh berkah. Berikut adalah ringkasan aktivitas Anda.</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-teal-700 bg-teal-50 px-4 py-2 rounded-full border border-teal-100">
          <Clock className="h-4 w-4" />
          {data.teacherInfo.currentDate}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border-stone-100 shadow-sm hover:shadow-md hover:border-teal-200 transition-all group">
          <CardHeader className="pb-3">
            <div className="h-10 w-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 mb-2 group-hover:scale-110 transition-transform">
              <ClipboardList className="h-5 w-5" />
            </div>
            <CardTitle className="text-lg text-stone-900">Input Absensi</CardTitle>
            <CardDescription>Catat kehadiran siswa hari ini</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-sky-50 text-sky-700 hover:bg-sky-100" variant="secondary">
              Mulai Absensi <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white border-stone-100 shadow-sm hover:shadow-md hover:border-teal-200 transition-all group">
          <CardHeader className="pb-3">
            <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 mb-2 group-hover:scale-110 transition-transform">
              <FileText className="h-5 w-5" />
            </div>
            <CardTitle className="text-lg text-stone-900">Input Nilai</CardTitle>
            <CardDescription>Masukkan nilai tugas & ujian</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-amber-50 text-amber-700 hover:bg-amber-100" variant="secondary">
              Kelola Nilai <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white border-stone-100 shadow-sm hover:shadow-md hover:border-teal-200 transition-all group">
          <CardHeader className="pb-3">
            <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 mb-2 group-hover:scale-110 transition-transform">
              <BookOpen className="h-5 w-5" />
            </div>
            <CardTitle className="text-lg text-stone-900">Upload Materi</CardTitle>
            <CardDescription>Bagikan bahan ajar ke siswa</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-purple-50 text-purple-700 hover:bg-purple-100" variant="secondary">
              Unggah File <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-stone-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg text-stone-900">Jadwal Mengajar Hari Ini</CardTitle>
              <CardDescription>Anda memiliki {data.schedule.length} kelas hari ini</CardDescription>
            </div>
            <CalendarDays className="h-5 w-5 text-stone-400" />
          </CardHeader>
          <CardContent>
            <div className="relative border-l-2 border-stone-100 ml-3 md:ml-4 space-y-6 pb-4">
              {data.schedule.map((schedule) => (
                <div key={schedule.id} className="relative pl-6 md:pl-8">
                  <div className={`absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 border-white ${schedule.status === 'completed' ? 'bg-stone-300' :
                      schedule.status === 'current' ? 'bg-teal-500 shadow-[0_0_0_4px_rgba(16,185,129,0.2)]' :
                        'bg-white border-2 border-stone-300'
                    }`}></div>

                  <div className={`p-4 rounded-xl border ${schedule.status === 'current' ? 'bg-teal-50/50 border-teal-200 shadow-sm' :
                      'bg-white border-stone-100'
                    }`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div>
                        <div className="text-sm font-semibold text-stone-900">{schedule.subject}</div>
                        <div className="text-xs text-stone-500 mt-1 flex items-center gap-2">
                          <Users className="h-3 w-3" /> {schedule.class}
                        </div>
                      </div>
                      <div className={`text-sm font-medium flex items-center gap-1.5 ${schedule.status === 'current' ? 'text-teal-700' : 'text-stone-600'
                        }`}>
                        <Clock className="h-3.5 w-3.5" />
                        {schedule.time}
                      </div>
                    </div>
                    {schedule.status === 'current' && (
                      <div className="mt-4 pt-3 border-t border-teal-100/50 flex gap-2">
                        <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-xs">Mulai Kelas</Button>
                        <Button size="sm" variant="outline" className="text-teal-700 border-teal-200 text-xs">Isi Absen</Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifications / Announcements */}
        <Card className="border-stone-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-stone-900">Pengumuman Guru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.announcements.map((announcement) => (
                <div key={announcement.id} className={`p-3 rounded-xl border ${announcement.type === 'warning' ? 'bg-amber-50 border-amber-100' : 'bg-sky-50 border-sky-100'}`}>
                  <div className={`text-xs font-semibold mb-1 ${announcement.type === 'warning' ? 'text-amber-800' : 'text-sky-800'}`}>{announcement.title}</div>
                  <div className="text-sm text-stone-700">{announcement.content}</div>
                  <div className="text-xs text-stone-500 mt-2">{announcement.date}</div>
                </div>
              ))}
            </div>
            <Button variant="link" className="w-full text-teal-600 mt-2">Lihat Semua Pengumuman</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
