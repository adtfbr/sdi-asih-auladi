"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit2, CalendarDays } from "lucide-react";

interface ClassOption { id: number; name: string; }
interface AcademicYearOption { id: number; name: string; }

interface Session { subject: string; teacher: string; }
interface ScheduleRow {
  type?: string;
  name?: string;
  Senin?: Session;
  Selasa?: Session;
  Rabu?: Session;
  Kamis?: Session;
  Jumat?: Session;
}

export default function JadwalAdminPage() {
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYearOption[]>([]);

  useEffect(() => {
    fetch("/api/kelas").then(r => r.json()).then(d => setClasses(Array.isArray(d) ? d : []));
    fetch("/api/tahun-ajaran").then(r => r.json()).then(d => setAcademicYears(Array.isArray(d) ? d : []));
  }, []);
  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
  const times = [
    "07:30 - 09:00",
    "09:00 - 09:30", // Istirahat
    "09:30 - 11:00",
    "11:00 - 11:30", // Istirahat
    "11:30 - 13:00"
  ];

  // Dummy Schedule for Kelas 4B
  const schedule: Record<string, ScheduleRow> = {
    "07:30 - 09:00": {
      Senin: { subject: "Matematika", teacher: "Usth. Siti Aminah" },
      Selasa: { subject: "B. Indonesia", teacher: "Usth. Rina Wati" },
      Rabu: { subject: "Pend. Agama Islam", teacher: "Ust. Ahmad" },
      Kamis: { subject: "IPA", teacher: "Ust. Budi Santoso" },
      Jumat: { subject: "Senam & Krida", teacher: "Tim Guru" },
    },
    "09:00 - 09:30": { type: "break", name: "ISTIRAHAT PERTAMA" },
    "09:30 - 11:00": {
      Senin: { subject: "B. Arab", teacher: "Ust. Hasan Basri" },
      Selasa: { subject: "IPA", teacher: "Ust. Budi Santoso" },
      Rabu: { subject: "Matematika", teacher: "Usth. Siti Aminah" },
      Kamis: { subject: "IPS", teacher: "Usth. Dewi" },
      Jumat: { subject: "Membaca Al-Qur'an", teacher: "Ust. Ahmad" },
    },
    "11:00 - 11:30": { type: "break", name: "ISTIRAHAT KEDUA (SHOLAT)" },
    "11:30 - 13:00": {
      Senin: { subject: "Pend. Pancasila", teacher: "Usth. Dina" },
      Selasa: { subject: "Seni Budaya", teacher: "Usth. Ayu" },
      Rabu: { subject: "B. Inggris", teacher: "Mr. John" },
      Kamis: { subject: "Fiqih", teacher: "Ust. Hasan Basri" },
      Jumat: { subject: "-", teacher: "-" }, // Pulang lebih awal
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Jadwal Pelajaran</h2>
          <p className="text-slate-500">Kelola dan susun jadwal pelajaran untuk setiap kelas.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus className="mr-2 h-4 w-4" /> Tambah Sesi Kelas
          </Button>
        </div>
      </div>

      <Card className="border-slate-100 shadow-sm bg-white overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-slate-400" />
              <CardTitle className="text-lg text-slate-900">Jadwal Kelas Aktif</CardTitle>
            </div>
            <div className="flex gap-2">
              <Select defaultValue="">
                <SelectTrigger className="w-[180px] bg-white border-slate-200">
                  <SelectValue placeholder="Tahun Ajaran" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((y) => (
                    <SelectItem key={y.id} value={y.id.toString()}>{y.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select defaultValue="">
                <SelectTrigger className="w-[140px] bg-white border-slate-200 font-semibold text-emerald-700">
                  <SelectValue placeholder="Pilih Kelas" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>Kelas {c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader className="bg-slate-100">
              <TableRow>
                <TableHead className="w-[140px] font-bold text-slate-700 border-r border-slate-200 text-center">Waktu</TableHead>
                {days.map((day) => (
                  <TableHead key={day} className="text-center font-bold text-slate-700 border-r border-slate-200 last:border-0 w-[20%]">
                    {day}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {times.map((time, idx) => {
                const rowData = schedule[time];
                const isBreak = rowData?.type === "break";

                if (isBreak) {
                  return (
                    <TableRow key={idx} className="bg-slate-50/80">
                      <TableCell className="font-semibold text-slate-600 text-center border-r border-slate-200 whitespace-nowrap">
                        {time}
                      </TableCell>
                      <TableCell colSpan={5} className="text-center font-bold text-slate-400 tracking-widest bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-80">
                        {rowData.name}
                      </TableCell>
                    </TableRow>
                  );
                }

                return (
                  <TableRow key={idx}>
                    <TableCell className="font-semibold text-slate-700 text-center border-r border-slate-200 whitespace-nowrap bg-slate-50">
                      {time}
                    </TableCell>
                    {days.map((day) => {
                      const session = rowData[day];
                      return (
                        <TableCell key={day} className="border-r border-slate-100 last:border-0 p-3 align-top group hover:bg-emerald-50/50 transition-colors">
                          {session && session.subject !== "-" ? (
                            <div className="h-full flex flex-col justify-between">
                              <div>
                                <div className="font-bold text-slate-800 text-sm">{session.subject}</div>
                                <div className="text-xs text-slate-500 mt-1">{session.teacher}</div>
                              </div>
                              <div className="mt-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="sm" variant="outline" className="h-6 w-full text-[10px] bg-white text-blue-600 border-blue-200 hover:bg-blue-50">
                                  <Edit2 className="h-3 w-3 mr-1" /> Edit
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="h-full w-full flex items-center justify-center min-h-[60px] opacity-0 group-hover:opacity-100 transition-opacity">
                               <Button size="sm" variant="ghost" className="text-emerald-600 hover:bg-emerald-50 h-8 text-xs border border-dashed border-emerald-300 w-full">
                                  <Plus className="h-3 w-3 mr-1" /> Isi Jadwal
                               </Button>
                            </div>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
