"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, CheckCircle2, AlertCircle, Clock, XCircle, Loader2 } from "lucide-react";

interface AttendanceRecord {
  id: number;
  studentId: number;
  studentName: string;
  classId: number;
  className: string;
  date: string;
  status: string;
}

export default function WaliAbsensiPage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [session, setSession] = useState<{studentId?: number} | null>(null);

  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setSession(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!session?.studentId) return;
    setLoading(true);
    const url = `/api/absensi?studentId=${session.studentId}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => setRecords(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [session?.studentId]);

  // Count stats
  const hadirCount = records.filter((r) => r.status === "Hadir").length;
  const izinCount = records.filter((r) => r.status === "Izin").length;
  const sakitCount = records.filter((r) => r.status === "Sakit").length;
  const alphaCount = records.filter((r) => r.status === "Alpha").length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Hadir": return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case "Izin": return <Clock className="h-5 w-5 text-blue-500" />;
      case "Sakit": return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case "Alpha": return <XCircle className="h-5 w-5 text-rose-500" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Hadir": return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none">Hadir</Badge>;
      case "Izin": return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-none">Izin</Badge>;
      case "Sakit": return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-none">Sakit</Badge>;
      case "Alpha": return <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-200 border-none">Alpha</Badge>;
      default: return null;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  const getDayName = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("id-ID", { weekday: "long" });
    } catch {
      return "-";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Rekap Kehadiran Anak</h2>
          <p className="text-slate-500">Pantau absensi harian anak Anda di sekolah.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-100 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <CheckCircle2 className="h-16 w-16 text-emerald-600" />
          </div>
          <CardContent className="p-4 sm:p-6 relative z-10">
            <div className="text-3xl font-bold text-slate-900">{hadirCount}</div>
            <div className="text-sm font-medium text-emerald-600 mt-1">Hadir</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-100 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Clock className="h-16 w-16 text-blue-600" />
          </div>
          <CardContent className="p-4 sm:p-6 relative z-10">
            <div className="text-3xl font-bold text-slate-900">{izinCount}</div>
            <div className="text-sm font-medium text-blue-600 mt-1">Izin</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-100 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <AlertCircle className="h-16 w-16 text-amber-600" />
          </div>
          <CardContent className="p-4 sm:p-6 relative z-10">
            <div className="text-3xl font-bold text-slate-900">{sakitCount}</div>
            <div className="text-sm font-medium text-amber-600 mt-1">Sakit</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-100 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <XCircle className="h-16 w-16 text-rose-600" />
          </div>
          <CardContent className="p-4 sm:p-6 relative z-10">
            <div className="text-3xl font-bold text-slate-900">{alphaCount}</div>
            <div className="text-sm font-medium text-rose-600 mt-1">Alpha</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-100 shadow-sm bg-white">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
          <CardTitle className="text-lg text-slate-900">Riwayat Kehadiran</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-48 text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin mr-2" /> Memuat data...
            </div>
          ) : records.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-slate-400">
              Belum ada data kehadiran.
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-[180px]">Tanggal</TableHead>
                  <TableHead className="w-[120px]">Hari</TableHead>
                  <TableHead className="w-[150px]">Status</TableHead>
                  <TableHead>Kelas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-medium text-slate-700">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-slate-400" />
                        {formatDate(record.date)}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">{getDayName(record.date)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(record.status)}
                        {getStatusBadge(record.status)}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-500">{record.className || "-"}</TableCell>
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
