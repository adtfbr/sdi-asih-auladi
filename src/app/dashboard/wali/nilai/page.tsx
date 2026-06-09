"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Award, Download, TrendingUp, GraduationCap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Grade {
  id: number;
  subjectName: string;
  teacherName: string;
  score: number;
  type: string;
}

export default function WaliNilaiPage() {
  const [grades, setGrades] = useState<Grade[]>([]);
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
    const url = `/api/nilai?studentId=${session.studentId}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => setGrades(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [session?.studentId]);

  // Group grades by subject
  const subjectMap = new Map<string, { subject: string; teacher: string; grades: Record<string, number> }>();
  grades.forEach((g) => {
    const key = g.subjectName || "Unknown";
    if (!subjectMap.has(key)) {
      subjectMap.set(key, { subject: key, teacher: g.teacherName || "-", grades: {} });
    }
    subjectMap.get(key)!.grades[g.type] = g.score;
  });

  const subjectList = Array.from(subjectMap.values()).map((entry) => {
    const scores = Object.values(entry.grades);
    const average = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    return { ...entry, average };
  });

  const overallAvg = subjectList.length > 0
    ? subjectList.reduce((a, b) => a + b.average, 0) / subjectList.length
    : 0;

  const bestSubject = subjectList.reduce(
    (best, curr) => (curr.average > best.average ? curr : best),
    { subject: "-", average: 0 } as { subject: string; average: number }
  );

  return (
    <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Nilai Akademik Anak</h2>
          <p className="text-slate-500">Pantau perkembangan akademik anak Anda.</p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="semester-ganjil">
            <SelectTrigger className="w-[180px] bg-white border-slate-200">
              <SelectValue placeholder="Pilih Semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semester-ganjil">Semester Ganjil 2026</SelectItem>
              <SelectItem value="semester-genap-25">Semester Genap 2025</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-slate-200 bg-white text-blue-600 hover:text-blue-700 hover:bg-blue-50">
            <Download className="mr-2 h-4 w-4" /> Download PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none shadow-md">
          <CardContent className="p-6 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold">{overallAvg.toFixed(1)}</div>
              <div className="text-blue-100 font-medium mt-1">Nilai Rata-rata Anak</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-100 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4 h-full">
            <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-500">Perkembangan Terbaik</div>
              <div className="text-lg font-bold text-slate-900 line-clamp-1">{bestSubject.subject}</div>
              <div className="text-xs text-emerald-600 font-medium mt-0.5">Nilai: {bestSubject.average.toFixed(1)}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-100 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4 h-full">
            <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-500">Total Mata Pelajaran</div>
              <div className="text-2xl font-bold text-slate-900">{subjectList.length}</div>
              <div className="text-xs text-slate-500 mt-0.5">Semester Ganjil</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-100 shadow-sm bg-white overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
          <CardTitle className="text-lg text-slate-900">Daftar Nilai per Mata Pelajaran</CardTitle>
          <CardDescription>Berdasarkan rentang nilai 0-100. KKM: 75.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-48 text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin mr-2" /> Memuat data...
            </div>
          ) : subjectList.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-slate-400">
              Belum ada data nilai.
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-[280px]">Mata Pelajaran</TableHead>
                  <TableHead className="text-center">Tugas</TableHead>
                  <TableHead className="text-center">Quiz</TableHead>
                  <TableHead className="text-center">UTS</TableHead>
                  <TableHead className="text-center">UAS</TableHead>
                  <TableHead className="text-right">Rata-rata</TableHead>
                  <TableHead className="text-center">Predikat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjectList.map((entry, idx) => (
                  <TableRow key={idx} className="hover:bg-slate-50/50">
                    <TableCell>
                      <div className="font-semibold text-slate-900">{entry.subject}</div>
                      <div className="text-xs text-slate-500 mt-1">Guru: {entry.teacher}</div>
                    </TableCell>
                    <TableCell className="text-center font-medium text-slate-700">{entry.grades["Tugas"] ?? "-"}</TableCell>
                    <TableCell className="text-center font-medium text-slate-700">{entry.grades["Quiz"] ?? "-"}</TableCell>
                    <TableCell className="text-center font-medium text-slate-700">{entry.grades["UTS"] ?? "-"}</TableCell>
                    <TableCell className="text-center text-slate-400">{entry.grades["UAS"] ?? "-"}</TableCell>
                    <TableCell className={`text-right font-bold ${entry.average < 75 ? "text-rose-600" : "text-slate-900"}`}>
                      {entry.average.toFixed(1)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={
                          entry.average >= 90
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : entry.average >= 80
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : entry.average >= 75
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }
                      >
                        {entry.average >= 90 ? "A (Sangat Baik)" : entry.average >= 80 ? "B (Baik)" : entry.average >= 75 ? "C (Cukup)" : "D (Kurang)"}
                      </Badge>
                    </TableCell>
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
