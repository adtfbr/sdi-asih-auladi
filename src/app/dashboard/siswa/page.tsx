"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, CalendarDays, Award, Clock, ArrowRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SiswaDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/dashboard/siswa')
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <div className="flex justify-center items-center h-64">Memuat data...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-emerald-600 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg shadow-emerald-900/10">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3">
          <div className="w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">{data.studentInfo.greeting}</h2>
            <p className="text-emerald-50 max-w-lg text-lg">
              {data.studentInfo.message}
            </p>
          </div>
          <div className="flex bg-white/10 backdrop-blur-md rounded-2xl p-4 gap-6 items-center border border-white/20">
             <div className="text-center">
               <div className="text-sm text-emerald-100 font-medium mb-1">Kelas</div>
               <div className="text-2xl font-bold text-white">{data.studentInfo.className}</div>
             </div>
             <div className="w-px h-10 bg-white/20"></div>
             <div className="text-center">
               <div className="text-sm text-emerald-100 font-medium mb-1">Semester</div>
               <div className="text-2xl font-bold text-white">{data.studentInfo.semester}</div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Quick Stats/Links */}
        <Card className="bg-white border-slate-100 shadow-sm hover:border-blue-200 transition-colors">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <CalendarDays className="h-6 w-6" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-500">Kehadiran</div>
              <div className="text-xl font-bold text-slate-900">{data.stats.attendance}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-100 shadow-sm hover:border-amber-200 transition-colors">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-500">Nilai Rata-rata</div>
              <div className="text-xl font-bold text-slate-900">{data.stats.averageScore}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-100 shadow-sm hover:border-purple-200 transition-colors lg:col-span-2">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <div className="text-sm font-medium text-slate-900 mb-1">Materi Baru Tersedia</div>
                <div className="text-xs text-slate-500">{data.newMaterial.subject}: {data.newMaterial.topic}</div>
              </div>
            </div>
            <Button size="sm" variant="outline" className="text-purple-700 border-purple-200 hover:bg-purple-50">
              Lihat Materi
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-slate-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg text-slate-900">Jadwal Pelajaran Hari Ini</CardTitle>
            </div>
            <div className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Selasa
            </div>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
              {data.schedule.map((schedule: any) => (
                <div key={schedule.id} className={`flex items-start gap-4 p-4 rounded-2xl border ${
                  schedule.status === 'current' ? 'border-emerald-200 bg-emerald-50/50' : 'border-slate-100 bg-white'
                }`}>
                  <div className={`p-3 rounded-xl flex flex-col items-center justify-center shrink-0 w-20 text-center ${
                    schedule.status === 'completed' ? 'bg-slate-100 text-slate-500' :
                    schedule.status === 'current' ? 'bg-emerald-600 text-white shadow-sm' :
                    'bg-slate-50 text-slate-600'
                  }`}>
                    <span className="text-xs font-semibold">{schedule.time.split(' - ')[0]}</span>
                    <span className="text-[10px] opacity-80">{schedule.time.split(' - ')[1]}</span>
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center h-full pt-1">
                    <h4 className={`text-base font-bold truncate ${
                       schedule.status === 'current' ? 'text-emerald-900' : 'text-slate-900'
                    }`}>{schedule.subject}</h4>
                    <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                      {schedule.teacher}
                    </p>
                  </div>
                  {schedule.status === 'current' && (
                    <div className="hidden sm:flex self-center shrink-0 items-center justify-center px-3 py-1 bg-white rounded-full text-xs font-semibold text-emerald-600 shadow-sm border border-emerald-100">
                      Sedang Berlangsung
                    </div>
                  )}
                </div>
              ))}
             </div>
          </CardContent>
        </Card>

        {/* Announcements */}
        <Card className="border-slate-100 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              Papan Pengumuman
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.announcements.map((announcement: any) => (
                <div key={announcement.id} className="group block space-y-1 border-b border-slate-100 pb-4 last:border-0">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="h-3 w-3" />
                    <span>{announcement.time}</span>
                  </div>
                  <h4 className="font-semibold text-sm text-slate-900 group-hover:text-emerald-600 transition-colors">
                    {announcement.title}
                  </h4>
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {announcement.content}
                  </p>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full text-emerald-600 mt-4 text-sm font-medium hover:text-emerald-700 hover:bg-emerald-50">
              Lihat Semua
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
