"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Award, BookOpen, Download, TrendingUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Grade {
  id: number;
  studentId: number;
  studentName: string;
  subjectId: number;
  subjectName: string;
  teacherId: number;
  teacherName: string;
  score: number;
  type: string;
}

export default function ViewNilaiPage() {
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
      .then((data) => {
        setGrades(Array.isArray(data) ? data : []);
      })
      .finally(() => setLoading(false));
  }, [session?.studentId]);

  // Group grades by subject
  const subjectMap = new Map<string, { subject: string; teacher: string; grades: Record<string, number> }>();
  grades.forEach((g) => {
    const key = g.subjectName || `Subject ${g.subjectId}`;
    if (!subjectMap.has(key)) {
      subjectMap.set(key, { subject: key, teacher: g.teacherName || "-", grades: {} });
    }
    const entry = subjectMap.get(key)!;
    entry.grades[g.type] = g.score;
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
          <h2 className="text-2xl font-bold tracking-tight text-stone-900">Transkrip Nilai</h2>
          <p className="text-stone-500">Pantau perkembangan akademik dan hasil evaluasi belajar.</p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="semester-ganjil">
            <SelectTrigger className="w-[180px] bg-white border-stone-200">
              <SelectValue placeholder="Pilih Semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semester-ganjil">Semester Ganjil 2026</SelectItem>
              <SelectItem value="semester-genap-25">Semester Genap 2025</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-stone-200 bg-white">
            <Download className="mr-2 h-4 w-4" /> Cetak
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-teal-500 to-teal-700 text-white border-none shadow-md">
          <CardContent className="p-6 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Award className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold">{overallAvg.toFixed(1)}</div>
              <div className="text-teal-100 font-medium mt-1">Rata-rata Nilai Keseluruhan</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-stone-100 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4 h-full">
            <div className="h-12 w-12 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 shrink-0">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <div className="text-sm font-medium text-stone-500">Mata Pelajaran Terbaik</div>
              <div className="text-lg font-bold text-stone-900 line-clamp-1">{bestSubject.subject}</div>
              <div className="text-xs text-teal-600 font-medium mt-0.5">Nilai: {bestSubject.average.toFixed(1)}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-stone-100 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4 h-full">
            <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <div className="text-sm font-medium text-stone-500">Total Mata Pelajaran</div>
              <div className="text-2xl font-bold text-stone-900">{subjectList.length}</div>
              <div className="text-xs text-stone-500 mt-0.5">Semester Ganjil</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-stone-100 shadow-sm bg-white overflow-hidden">
        <CardHeader className="bg-stone-50/50 border-b border-stone-100 pb-4">
          <CardTitle className="text-lg text-stone-900">Rincian Nilai per Mata Pelajaran</CardTitle>
          <CardDescription>Data nilai dari database.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-48 text-stone-400">
              <Loader2 className="h-6 w-6 animate-spin mr-2" /> Memuat data...
            </div>
          ) : subjectList.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-stone-400">
              Belum ada data nilai.
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-stone-50">
                <TableRow>
                  <TableHead className="w-[300px]">Mata Pelajaran</TableHead>
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
                  <TableRow key={idx} className="hover:bg-stone-50/50">
                    <TableCell>
                      <div className="font-semibold text-stone-900">{entry.subject}</div>
                      <div className="text-xs text-stone-500 mt-1">{entry.teacher}</div>
                    </TableCell>
                    <TableCell className="text-center font-medium text-stone-700">{entry.grades["Tugas"] ?? "-"}</TableCell>
                    <TableCell className="text-center font-medium text-stone-700">{entry.grades["Quiz"] ?? "-"}</TableCell>
                    <TableCell className="text-center font-medium text-stone-700">{entry.grades["UTS"] ?? "-"}</TableCell>
                    <TableCell className="text-center text-stone-400">{entry.grades["UAS"] ?? "-"}</TableCell>
                    <TableCell className="text-right font-bold text-stone-900">{entry.average.toFixed(1)}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={
                          entry.average >= 90
                            ? "bg-teal-50 text-teal-700 border-teal-200"
                            : entry.average >= 80
                            ? "bg-sky-50 text-sky-700 border-sky-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }
                      >
                        {entry.average >= 90 ? "A" : entry.average >= 80 ? "B" : "C"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="bg-sky-50 border border-sky-100 p-4 rounded-xl flex gap-3">
        <div className="shrink-0 mt-0.5">
          <div className="h-5 w-5 rounded-full bg-sky-200 flex items-center justify-center text-sky-700 font-bold text-xs">i</div>
        </div>
        <div className="text-sm text-sky-800">
          <p className="font-semibold mb-1">Informasi Penilaian</p>
          <p className="opacity-90">Nilai akhir semester (Rapor) akan dihitung berdasarkan bobot: Tugas (30%), Kuis (20%), UTS (20%), dan UAS (30%).</p>
        </div>
      </div>
    </div>
  );
}
