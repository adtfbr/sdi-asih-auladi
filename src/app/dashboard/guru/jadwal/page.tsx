"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarDays, Clock, MapPin, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Schedule {
  id: number;
  classId: number;
  className: string;
  subjectName: string;
  teacherId: number;
  teacherName: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

interface TeacherOption { id: number; name: string; }
const daysMap = ["", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

export default function GuruJadwalPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [session, setSession] = useState<{teacherId?: number} | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setSession(data);
      })
      .catch(() => {});
  }, []);

  const fetchSchedules = useCallback(async () => {
    if (!session?.teacherId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/jadwal?teacherId=${session.teacherId}`);
      const data = await res.json();
      setSchedules(Array.isArray(data) ? data : []);
    } catch {
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  }, [session?.teacherId]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-900">Jadwal Mengajar</h2>
          <p className="text-stone-500">Lihat jadwal mengajar Anda untuk minggu ini.</p>
        </div>
      </div>

      <Card className="border-stone-100 shadow-sm bg-white overflow-hidden">
        <CardHeader className="bg-stone-50/50 border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-stone-400" />
            <CardTitle className="text-lg text-stone-900">Daftar Jadwal Mengajar</CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
             <div className="flex items-center justify-center h-48 text-stone-400">
               <Loader2 className="h-6 w-6 animate-spin mr-2" /> Memuat jadwal...
             </div>
          ) : schedules.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-stone-400">
              <CalendarDays className="h-10 w-10 mb-3 text-stone-300" />
              <p className="text-lg font-medium">Belum ada jadwal mengajar</p>
            </div>
          ) : (
            <Table className="min-w-[800px]">
              <TableHeader className="bg-stone-100">
                <TableRow>
                  <TableHead className="w-[140px] font-bold text-stone-700 border-r border-stone-200 text-center">Waktu</TableHead>
                  {[1, 2, 3, 4, 5, 6].map((dayIdx) => (
                    <TableHead key={dayIdx} className="text-center font-bold text-stone-700 border-r border-stone-200 last:border-0 w-[16%]">
                      {daysMap[dayIdx]}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from(new Set(schedules.map(s => `${s.startTime.slice(0,5)} - ${s.endTime.slice(0,5)}`))).sort().map((timeLabel, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-semibold text-stone-700 text-center border-r border-stone-200 whitespace-nowrap bg-stone-50">
                      {timeLabel}
                    </TableCell>
                    {[1, 2, 3, 4, 5, 6].map((dayIdx) => {
                      const session = schedules.find(s => s.dayOfWeek === dayIdx && `${s.startTime.slice(0,5)} - ${s.endTime.slice(0,5)}` === timeLabel);
                      return (
                        <TableCell key={dayIdx} className="border-r border-stone-100 last:border-0 p-3 align-top bg-white">
                          {session ? (
                            <div className="h-full flex flex-col">
                              <div className="font-bold text-stone-800 text-sm">{session.subjectName}</div>
                              <div className="text-xs text-teal-600 font-medium mt-1">Kelas {session.className}</div>
                            </div>
                          ) : (
                            <div className="h-full w-full min-h-[50px] bg-stone-50/50 rounded flex items-center justify-center">
                              <span className="text-xs text-stone-300">-</span>
                            </div>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
