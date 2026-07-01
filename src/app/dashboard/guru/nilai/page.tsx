"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save, BookOpen, UserCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createGrade } from "@/app/actions/penilaian-actions";

export default function GuruNilaiPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);

  // Filter states
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("2026/2027");
  const [selectedType, setSelectedType] = useState("Formatif");
  const [selectedSemester, setSelectedSemester] = useState("Ganjil");

  // Form states per student
  const [grades, setGrades] = useState<Record<number, { score: string, notes: string }>>({});
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    // Fetch classes & subjects
    fetch("/api/guru/penilaian/data")
      .then(res => res.json())
      .then(data => {
        if (data.classes) setClasses(data.classes);
        if (data.subjects) setSubjects(data.subjects);
        setLoadingConfig(false);
      });
  }, []);

  useEffect(() => {
    if (selectedClass) {
      setLoadingStudents(true);
      fetch(`/api/guru/penilaian/data?classId=${selectedClass}`)
        .then(res => res.json())
        .then(data => {
          if (data.students) {
            setStudents(data.students);
            // Inisialisasi state form
            const initialGrades: Record<number, any> = {};
            data.students.forEach((s: any) => {
              initialGrades[s.id] = { score: "", notes: "" };
            });
            setGrades(initialGrades);
          }
          setLoadingStudents(false);
        });
    } else {
      setStudents([]);
    }
  }, [selectedClass]);

  const handleScoreChange = (studentId: number, val: string) => {
    setGrades(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], score: val }
    }));
  };

  const handleNotesChange = (studentId: number, val: string) => {
    setGrades(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], notes: val }
    }));
  };

  const handleSaveAll = async () => {
    if (!selectedClass || !selectedSubject) return;
    
    setSaving(true);
    setSuccessMsg("");
    
    let successCount = 0;
    for (const student of students) {
      const g = grades[student.id];
      if (g.score !== "") {
        const res = await createGrade({
          studentId: student.id,
          classId: Number(selectedClass),
          subjectId: Number(selectedSubject),
          academicYear: selectedAcademicYear,
          semester: selectedSemester,
          type: selectedType,
          score: Number(g.score),
          notes: g.notes
        });
        if (res.success) successCount++;
      }
    }
    
    setSaving(false);
    setSuccessMsg(`Berhasil menyimpan ${successCount} data nilai.`);
    
    // Reset form after 3s
    setTimeout(() => {
      setSuccessMsg("");
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-stone-900">Input Nilai Akademik</h2>
        <p className="text-stone-500">Masukkan nilai Formatif/Sumatif dan Capaian Pembelajaran.</p>
      </div>

      <Card className="border-stone-100 shadow-sm">
        <CardContent className="p-6">
          {loadingConfig ? (
            <div className="flex justify-center items-center h-20 text-stone-400">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label>Kelas</Label>
                <Select value={selectedClass} onValueChange={(val) => setSelectedClass(val || "")}>
                  <SelectTrigger>
                    <SelectValue>
                      {selectedClass ? `Kelas ${classes.find(c => c.id.toString() === selectedClass)?.level} - ${classes.find(c => c.id.toString() === selectedClass)?.name}` : "Pilih Kelas"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map(c => (
                      <SelectItem key={c.id} value={c.id.toString()}>Kelas {c.level} - {c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Mata Pelajaran</Label>
                <Select value={selectedSubject} onValueChange={(val) => setSelectedSubject(val || "")}>
                  <SelectTrigger>
                    <SelectValue>
                      {selectedSubject ? subjects.find(s => s.id.toString() === selectedSubject)?.name : "Pilih Mapel"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map(s => (
                      <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tahun Ajaran</Label>
                <Select value={selectedAcademicYear} onValueChange={(val) => setSelectedAcademicYear(val || "2026/2027")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025/2026">2025/2026</SelectItem>
                    <SelectItem value="2026/2027">2026/2027</SelectItem>
                    <SelectItem value="2027/2028">2027/2028</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Jenis Penilaian</Label>
                <Select value={selectedType} onValueChange={(val) => setSelectedType(val || "Formatif")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Formatif">Formatif (Harian)</SelectItem>
                    <SelectItem value="Sumatif STS">Sumatif STS (UTS)</SelectItem>
                    <SelectItem value="Sumatif SAS">Sumatif SAS (UAS)</SelectItem>
                    <SelectItem value="Proyek">Proyek (P5)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Semester</Label>
                <Select value={selectedSemester} onValueChange={(val) => setSelectedSemester(val || "Ganjil")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ganjil">Ganjil</SelectItem>
                    <SelectItem value="Genap">Genap</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedClass && selectedSubject ? (
        <Card className="border-stone-100 shadow-sm overflow-hidden">
          <CardHeader className="bg-stone-50 border-b border-stone-100 flex flex-row items-center justify-between">
            <h3 className="font-semibold text-stone-800 flex items-center">
              <BookOpen className="mr-2 h-4 w-4 text-teal-600" />
              Daftar Siswa
            </h3>
            <Button onClick={handleSaveAll} disabled={saving || students.length === 0} className="bg-teal-600 hover:bg-teal-700 text-white">
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Simpan Semua
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {successMsg && (
              <div className="m-4 p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-sm font-medium">
                {successMsg}
              </div>
            )}
            
            {loadingStudents ? (
              <div className="flex justify-center items-center h-40 text-stone-400">
                <Loader2 className="h-6 w-6 animate-spin mr-2" /> Memuat siswa...
              </div>
            ) : students.length === 0 ? (
              <div className="p-8 text-center text-stone-500">
                Belum ada siswa di kelas ini.
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {students.map((student) => (
                  <div key={student.id} className="p-4 md:p-6 hover:bg-stone-50/50 transition-colors">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/3 flex items-start gap-3">
                        <div className="bg-stone-100 p-2 rounded-full text-stone-400">
                          <UserCircle2 className="h-8 w-8" />
                        </div>
                        <div>
                          <h4 className="font-bold text-stone-900">{student.name}</h4>
                          <p className="text-xs text-stone-500">NIS: {student.nis}</p>
                        </div>
                      </div>
                      <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2 md:col-span-1">
                          <Label className="text-xs text-stone-500">Nilai Angka (0-100)</Label>
                          <Input 
                            type="number" 
                            placeholder="Cth: 85" 
                            className="font-bold text-teal-700 text-lg"
                            value={grades[student.id]?.score || ""}
                            onChange={(e) => handleScoreChange(student.id, e.target.value)}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-3">
                          <Label className="text-xs text-stone-500">Deskripsi Capaian Pembelajaran</Label>
                          <Textarea 
                            placeholder="Cth: Ananda sangat baik dalam memahami konsep pecahan..."
                            className="resize-none h-20 text-sm"
                            value={grades[student.id]?.notes || ""}
                            onChange={(e) => handleNotesChange(student.id, e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        !loadingConfig && (
          <div className="text-center py-12 text-stone-500 bg-stone-50 rounded-xl border border-dashed border-stone-200">
            <BookOpen className="mx-auto h-12 w-12 text-stone-300 mb-4" />
            <p className="text-lg font-medium text-stone-700">Pilih Kelas dan Mata Pelajaran</p>
            <p className="text-sm mt-1">Silakan pilih filter di atas untuk mulai menginput nilai.</p>
          </div>
        )
      )}
    </div>
  );
}
