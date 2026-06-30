"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, ClipboardCheck, FileText, ArrowUpRight, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StatValue {
  value: string | number;
  trend?: string;
  description?: string;
  verified?: number;
}

interface AdminDashboardData {
  stats: {
    totalStudents: StatValue;
    totalTeachers: StatValue;
    attendanceRate: StatValue;
    ppdbApplicants: StatValue;
  };
  recentPpdb: { id: number; name: string; date: string; status: string }[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<AdminDashboardData | null>(null);

  useEffect(() => {
    fetch('/api/dashboard/admin')
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <div className="flex justify-center items-center h-64">Memuat data...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-stone-900">Ikhtisar Akademik</h2>
        <p className="text-stone-500">Pantau statistik dan aktivitas sekolah hari ini.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-stone-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-stone-600">Total Siswa</CardTitle>
            <div className="h-8 w-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-stone-900">{data.stats.totalStudents.value}</div>
            <div className="flex items-center text-xs text-teal-600 mt-1 font-medium">
              <TrendingUp className="h-3 w-3 mr-1" />
              {data.stats.totalStudents.trend}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-stone-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-stone-600">Total Guru</CardTitle>
            <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
              <GraduationCap className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-stone-900">{data.stats.totalTeachers.value}</div>
            <div className="flex items-center text-xs text-stone-500 mt-1">
              {data.stats.totalTeachers.description}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-stone-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-stone-600">Kehadiran Harian</CardTitle>
            <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <ClipboardCheck className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-stone-900">{data.stats.attendanceRate.value}</div>
            <div className="flex items-center text-xs text-teal-600 mt-1 font-medium">
              <TrendingUp className="h-3 w-3 mr-1" />
              {data.stats.attendanceRate.trend}
            </div>
          </CardContent>
        </Card>

        {false && (
        <Card className="bg-white border-stone-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-stone-600">Pendaftar PPDB</CardTitle>
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
              <FileText className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-stone-900">{data?.stats?.ppdbApplicants?.value}</div>
            <div className="flex items-center text-xs text-stone-500 mt-1">
              <span className="text-teal-600 font-medium mr-1">{data?.stats?.ppdbApplicants?.verified}</span> Terverifikasi
            </div>
          </CardContent>
        </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area (Placeholder) */}
        <Card className="lg:col-span-2 border-stone-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-stone-900">Tren Kehadiran Siswa</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[300px] bg-stone-50/50 rounded-xl border border-dashed border-stone-200 m-6 mt-0">
            <div className="text-center text-stone-400">
              <div className="h-16 w-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-8 w-8 text-stone-300" />
              </div>
              <p>Grafik Tren Kehadiran</p>
              <p className="text-sm">Akan diimplementasikan dengan chart library</p>
            </div>
          </CardContent>
        </Card>

        {/* Recent PPDB List */}
        {false && (
        <Card className="border-stone-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-stone-900">PPDB Terbaru</CardTitle>
            <a href="#" className="text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center">
              Lihat Semua <ArrowUpRight className="h-3 w-3 ml-1" />
            </a>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.recentPpdb?.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b border-stone-50 pb-4 last:border-0 last:pb-0">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-stone-900">{item.name}</span>
                    <span className="text-xs text-stone-500">{item.date}</span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={
                      item.status === 'Verified' ? 'bg-teal-50 text-teal-700 border-teal-200' : 
                      item.status === 'Submitted' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                      'bg-stone-100 text-stone-700 border-stone-200'
                    }
                  >
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        )}
      </div>
    </div>
  );
}
