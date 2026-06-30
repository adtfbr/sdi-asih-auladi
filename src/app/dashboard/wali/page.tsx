"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, ClipboardCheck, TrendingUp, AlertCircle, ChevronDown, CheckCircle2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Child {
  id: number;
  name: string;
  class: string;
  avatarSeed: string;
}

interface TodayStatus {
  status: string;
  time: string;
}

interface SelectedChildStats {
  attendance: string;
  averageScore: string;
  todayStatus: TodayStatus;
}

interface GradeItem {
  id: number;
  subject: string;
  type: string;
  date: string;
  score: number | string;
}

interface NotificationItem {
  id: number;
  type: string;
  title: string;
  content: string;
  time: string;
}

interface WaliDashboardData {
  children: Child[];
  selectedChildStats: SelectedChildStats;
  recentGrades: GradeItem[];
  notifications: NotificationItem[];
}

export default function WaliDashboard() {
  const [data, setData] = useState<WaliDashboardData | null>(null);

  useEffect(() => {
    fetch('/api/dashboard/wali')
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <div className="flex justify-center items-center h-64">Memuat data...</div>;

  const child = data.children[0]; // mock selected child

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-900">Portal Wali Murid</h2>
          <p className="text-stone-500">Pantau perkembangan dan aktivitas anak Anda.</p>
        </div>

        {/* Child Selector Mockup */}
        <div className="relative">
          <Button variant="outline" className="w-full sm:w-auto h-12 bg-white border-stone-200 justify-between gap-4 hover:bg-stone-50">
            <div className="flex items-center gap-3">
              <Avatar className="h-7 w-7 border border-stone-100">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${child.avatarSeed}`} />
                <AvatarFallback>{child.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="text-left flex flex-col">
                <span className="text-sm font-semibold leading-none mb-1">{child.name}</span>
                <span className="text-[10px] text-stone-500 leading-none">{child.class}</span>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-stone-400" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Info Column */}
        <div className="md:col-span-2 space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-teal-50 border-teal-100 shadow-sm">
              <CardContent className="p-4 sm:p-6 flex flex-col justify-between min-h-[120px]">
                <div className="flex justify-between items-start mb-2">
                  <div className="p-2 bg-teal-100 rounded-lg text-teal-600">
                    <ClipboardCheck className="h-5 w-5" />
                  </div>
                  <Badge variant="outline" className="bg-white/50 text-teal-700 border-teal-200 text-[10px] px-2 py-0.5">Semester Ini</Badge>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-teal-900">{data.selectedChildStats.attendance}</div>
                  <div className="text-xs sm:text-sm font-medium text-teal-700 mt-1">Kehadiran Siswa</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-sky-50 border-sky-100 shadow-sm">
              <CardContent className="p-4 sm:p-6 flex flex-col justify-between min-h-[120px]">
                <div className="flex justify-between items-start mb-2">
                  <div className="p-2 bg-sky-100 rounded-lg text-sky-600">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-sky-900">{data.selectedChildStats.averageScore}</div>
                  <div className="text-xs sm:text-sm font-medium text-sky-700 mt-1">Rata-rata Nilai UTS</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Grades */}
          <Card className="border-stone-100 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-stone-50">
              <CardTitle className="text-lg text-stone-900">Nilai Terbaru</CardTitle>
              <Button variant="link" className="text-teal-600 text-sm h-auto p-0">Lihat Rapor</Button>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {data.recentGrades.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-stone-50 hover:bg-stone-100/50 transition-colors">
                    <div>
                      <div className="font-semibold text-sm text-stone-900">{item.subject}</div>
                      <div className="text-xs text-stone-500 mt-1">{item.type} • {item.date}</div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-lg font-bold text-teal-600">{item.score}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* Daily Attendance Status */}
          <Card className="border-stone-100 shadow-sm overflow-hidden">
            <div className="bg-teal-600 p-4 text-white">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="h-5 w-5 text-teal-200" />
                <h3 className="font-semibold">Status Hari Ini</h3>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                  <User className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <div className="text-sm font-bold text-stone-900">{data.selectedChildStats.todayStatus.status}</div>
                  <div className="text-xs text-stone-500">{data.selectedChildStats.todayStatus.time}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="border-stone-100 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-stone-900">Notifikasi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.notifications.map((notification) => (
                  <div key={notification.id} className="flex gap-3">
                    <div className="mt-0.5 shrink-0">
                      {notification.type === 'warning' ? (
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-sky-500 mt-1 ml-1"></div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-stone-900 leading-tight">{notification.title}</h4>
                      <p className="text-xs text-stone-600 mt-1">{notification.content}</p>
                      <span className="text-[10px] text-stone-400 mt-1 block">{notification.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

