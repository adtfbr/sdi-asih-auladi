"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarDays, Clock, User, Loader2 } from "lucide-react";
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

interface ClassOption { id: number; name: string; }
const daysMap = ["", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

export default function SiswaJadwalPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [session, setSession] = useState<{classId?: number} | null>(null);
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
    if (!session?.classId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/jadwal?classId=${session.classId}`);
      const data = await res.json();
      setSchedules(Array.isArray(data) ? data : []);
    } catch {
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  }, [session?.classId]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Jadwal Pelajaran</h2>
          <p className="text-slate-500">Lihat jadwal mata pelajaran kelas Anda untuk minggu ini.</p>
        </div>
      </div>

      <Card className="border-slate-100 shadow-sm bg-white overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-slate-400" />
            <CardTitle className="text-lg text-slate-900">Jadwal Kelas Aktif</CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
             <div className="flex items-center justify-center h-48 text-slate-400">
               <Loader2 className="h-6 w-6 animate-spin mr-2" /> Memuat jadwal...
             </div>
          ) : schedules.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400">
              <CalendarDays className="h-10 w-10 mb-3 text-slate-300" />
              <p className="text-lg font-medium">Belum ada jadwal pelajaran</p>
            </div>
          ) : (
            <Table className="min-w-[800px]">
              <TableHeader className="bg-slate-100">
                <TableRow>
                  <TableHead className="w-[140px] font-bold text-slate-700 border-r border-slate-200 text-center">Waktu</TableHead>
                  {[1, 2, 3, 4, 5, 6].map((dayIdx) => (
                    <TableHead key={dayIdx} className="text-center font-bold text-slate-700 border-r border-slate-200 last:border-0 w-[16%]">
                      {daysMap[dayIdx]}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from(new Set(schedules.map(s => `${s.startTime.slice(0,5)} - ${s.endTime.slice(0,5)}`))).sort().map((timeLabel, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-semibold text-slate-700 text-center border-r border-slate-200 whitespace-nowrap bg-slate-50">
                      {timeLabel}
                    </TableCell>
                    {[1, 2, 3, 4, 5, 6].map((dayIdx) => {
                      const session = schedules.find(s => s.dayOfWeek === dayIdx && `${s.startTime.slice(0,5)} - ${s.endTime.slice(0,5)}` === timeLabel);
                      return (
                        <TableCell key={dayIdx} className="border-r border-slate-100 last:border-0 p-3 align-top bg-white">
                          {session ? (
                            <div className="h-full flex flex-col">
                              <div className="font-bold text-slate-800 text-sm">{session.subjectName}</div>
                              <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                <User className="h-3 w-3" /> {session.teacherName}
                              </div>
                            </div>
                          ) : (
                            <div className="h-full w-full min-h-[50px] bg-slate-50/50 rounded flex items-center justify-center">
                              <span className="text-xs text-slate-300">-</span>
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
