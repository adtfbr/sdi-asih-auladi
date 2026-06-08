"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function GuruJadwalPage() {
  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
  const times = [
    "07:30 - 09:00",
    "09:00 - 09:30", // Istirahat
    "09:30 - 11:00",
    "11:00 - 11:30", // Istirahat
    "11:30 - 13:00"
  ];

  // Dummy Schedule for Guru (Ust. Ahmad)
  const schedule: Record<string, any> = {
    "07:30 - 09:00": {
      Senin: { subject: "-", class: "-" },
      Selasa: { subject: "-", class: "-" },
      Rabu: { subject: "Pend. Agama Islam", class: "Kelas 4B" },
      Kamis: { subject: "Pend. Agama Islam", class: "Kelas 3A" },
      Jumat: { subject: "Senam & Krida", class: "Lapangan" },
    },
    "09:00 - 09:30": { type: "break", name: "ISTIRAHAT PERTAMA" },
    "09:30 - 11:00": {
      Senin: { subject: "B. Arab", class: "Kelas 5A" },
      Selasa: { subject: "B. Arab", class: "Kelas 5B" },
      Rabu: { subject: "-", class: "-" },
      Kamis: { subject: "-", class: "-" },
      Jumat: { subject: "Membaca Al-Qur'an", class: "Kelas 4B" },
    },
    "11:00 - 11:30": { type: "break", name: "ISTIRAHAT KEDUA (SHOLAT)" },
    "11:30 - 13:00": {
      Senin: { subject: "Tahfidz", class: "Kelas 6A" },
      Selasa: { subject: "Tahfidz", class: "Kelas 6B" },
      Rabu: { subject: "Tahfidz", class: "Kelas 4A" },
      Kamis: { subject: "Tahfidz", class: "Kelas 4B" },
      Jumat: { subject: "-", class: "-" },
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Jadwal Mengajar</h2>
          <p className="text-slate-500">Lihat jadwal mengajar Anda untuk minggu ini.</p>
        </div>
        <Badge className="bg-emerald-100 text-emerald-800 border-none px-4 py-1.5 text-sm">
          Semester Genap 2025/2026
        </Badge>
      </div>

      <Card className="border-slate-100 shadow-sm bg-white overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-slate-400" />
            <CardTitle className="text-lg text-slate-900">Jadwal Ust. Ahmad</CardTitle>
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
                    <TableRow key={idx} className="bg-amber-50/50">
                      <TableCell className="font-medium text-slate-500 text-center border-r border-slate-200 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1"><Clock className="w-3 h-3"/> {time}</div>
                      </TableCell>
                      <TableCell colSpan={5} className="text-center font-bold text-amber-700 tracking-widest bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-80">
                        {rowData.name}
                      </TableCell>
                    </TableRow>
                  );
                }

                return (
                  <TableRow key={idx}>
                    <TableCell className="font-semibold text-slate-600 text-center border-r border-slate-200 whitespace-nowrap bg-slate-50">
                      {time}
                    </TableCell>
                    {days.map((day) => {
                      const session = rowData[day];
                      return (
                        <TableCell key={day} className="border-r border-slate-100 last:border-0 p-3 align-top group hover:bg-emerald-50/30 transition-colors">
                          {session && session.subject !== "-" ? (
                            <div className="flex flex-col h-full">
                              <div className="font-bold text-slate-800 text-sm">{session.subject}</div>
                              <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {session.class}
                              </div>
                            </div>
                          ) : (
                            <div className="text-slate-300 text-center italic text-sm mt-2">-</div>
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
