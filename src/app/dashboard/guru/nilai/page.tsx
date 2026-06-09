"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Save, UploadCloud, Loader2, CheckCircle2 } from "lucide-react";

interface ClassOption { id: number; name: string; }
interface SubjectOption { id: number; name: string; code: string; }
interface TeacherOption { id: number; name: string; }
interface StudentRow { id: number; nis: string; name: string; }

export default function InputNilaiPage() {
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [session, setSession] = useState<{teacherId?: number} | null>(null);

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [gradeType, setGradeType] = useState("Tugas");

  const [scoresMap, setScoresMap] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setSession(data);
      })
      .catch(() => {});
      
    Promise.all([
      fetch("/api/kelas").then((r) => r.json()),
      fetch("/api/mapel").then((r) => r.json()),
    ]).then(([classData, subjectData]) => {
      setClasses(Array.isArray(classData) ? classData : []);
      setSubjects(Array.isArray(subjectData) ? subjectData : []);
    });
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchStudents = async () => {
      if (!selectedClass) {
        setStudents([]);
        setScoresMap({});
        return;
      }

      setLoading(true);
      setSaved(false);
      try {
        const res = await fetch(`/api/kelas/${selectedClass}/siswa`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        if (!isMounted) return;
        
        setStudents(list);
        const map: Record<number, string> = {};
        
        // Fetch existing grades
        const gradesRes = await fetch(`/api/nilai?classId=${selectedClass}&semester=Ganjil`);
        const gradesData = await gradesRes.json();
        const existingGrades = Array.isArray(gradesData) ? gradesData : [];

        list.forEach((s: StudentRow) => { 
          // If we had a specific subject and type we could filter here, 
          // but for now we just initialize empty
          map[s.id] = ""; 
        });
        setScoresMap(map);
      } catch {
        if (!isMounted) return;
        setStudents([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchStudents();

    return () => {
      isMounted = false;
    };
  }, [selectedClass]);

  const handleSave = async () => {
    if (!selectedSubject || !session?.teacherId) {
      alert("Pilih mata pelajaran dan guru terlebih dahulu.");
      return;
    }

    setSaving(true);
    try {
      const records = students
        .filter((s) => scoresMap[s.id] !== "" && scoresMap[s.id] !== undefined)
        .map((s) => ({
          studentId: s.id,
          score: Number(scoresMap[s.id]),
        }));

      if (records.length === 0) {
        alert("Masukkan minimal satu nilai.");
        setSaving(false);
        return;
      }

      const res = await fetch("/api/nilai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classId: Number(selectedClass),
          subjectId: Number(selectedSubject),
          teacherId: session?.teacherId,
          semester: "Ganjil",
          type: gradeType,
          records,
        }),
      });

      if (!res.ok) throw new Error("Gagal menyimpan");
      setSaved(true);
    } catch {
      alert("Gagal menyimpan nilai. Coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Input Nilai</h2>
          <p className="text-slate-500">Kelola dan masukkan nilai siswa untuk berbagai jenis evaluasi.</p>
        </div>
        <Button variant="outline" className="border-slate-200 w-full md:w-auto">
          <UploadCloud className="mr-2 h-4 w-4" /> Import Nilai (Excel)
        </Button>
      </div>

      <Card className="border-slate-100 shadow-sm bg-white">
        <CardHeader className="pb-4 border-b border-slate-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>Pilih Kelas</Label>
              <Select value={selectedClass} onValueChange={(val) => setSelectedClass(val || "")}>
                <SelectTrigger className="bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Pilih Kelas">
                    {classes.find(c => c.id.toString() === selectedClass)?.name ? `Kelas ${classes.find(c => c.id.toString() === selectedClass)?.name}` : selectedClass || "Pilih Kelas"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {classes.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>Kelas {c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Mata Pelajaran</Label>
              <Select value={selectedSubject} onValueChange={(val) => setSelectedSubject(val || "")}>
                <SelectTrigger className="bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Pilih Mapel">
                    {subjects.find(s => s.id.toString() === selectedSubject)?.name || selectedSubject || "Pilih Mapel"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Jenis Penilaian</Label>
              <Select value={gradeType} onValueChange={(val) => setGradeType(val || "")}>
                <SelectTrigger className="bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Pilih Jenis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tugas">Tugas Harian</SelectItem>
                  <SelectItem value="Quiz">Quiz</SelectItem>
                  <SelectItem value="UTS">Ujian Tengah Semester (UTS)</SelectItem>
                  <SelectItem value="UAS">Ujian Akhir Semester (UAS)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {!selectedClass ? (
            <div className="flex items-center justify-center h-48 text-slate-400">
              Pilih kelas untuk menampilkan daftar siswa.
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center h-48 text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin mr-2" /> Memuat data siswa...
            </div>
          ) : students.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-slate-400">
              Tidak ada siswa di kelas ini.
            </div>
          ) : (
            <>
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="w-[60px]">No</TableHead>
                    <TableHead className="w-[120px]">NIS</TableHead>
                    <TableHead>Nama Lengkap</TableHead>
                    <TableHead className="w-[150px]">Nilai (0-100)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student, index) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium text-slate-500">{index + 1}</TableCell>
                      <TableCell className="text-slate-600">{student.nis}</TableCell>
                      <TableCell className="font-semibold text-slate-900">{student.name}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={scoresMap[student.id] || ""}
                          onChange={(e) => {
                            setScoresMap((prev) => ({ ...prev, [student.id]: e.target.value }));
                            setSaved(false);
                          }}
                          className="h-10 text-center font-medium border-slate-200 bg-white"
                          placeholder="0"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6 flex items-center justify-end gap-3">
                {saved && (
                  <span className="flex items-center text-sm text-emerald-600 font-medium">
                    <CheckCircle2 className="h-4 w-4 mr-1" /> Nilai tersimpan!
                  </span>
                )}
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white h-10 px-8 rounded-full"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Simpan Nilai
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
