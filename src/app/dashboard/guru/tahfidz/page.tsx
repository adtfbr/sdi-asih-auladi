"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save, BookOpen, UserCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createTahfidzRecord } from "@/app/actions/penilaian-actions";

export default function GuruTahfidzPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);

  // Filter states
  const [selectedClass, setSelectedClass] = useState("");

  // Form states per student
  const [records, setRecords] = useState<Record<number, { surah: string, ayat: string, predicate: string, notes: string }>>({});
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    // Fetch classes
    fetch("/api/guru/penilaian/data")
      .then(res => res.json())
      .then(data => {
        if (data.classes) setClasses(data.classes);
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
            const initial: Record<number, any> = {};
            data.students.forEach((s: any) => {
              initial[s.id] = { surah: "", ayat: "", predicate: "", notes: "" };
            });
            setRecords(initial);
          }
          setLoadingStudents(false);
        });
    } else {
      setStudents([]);
    }
  }, [selectedClass]);

  const handleChange = (studentId: number, field: string, val: string) => {
    setRecords(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], [field]: val }
    }));
  };

  const handleSaveAll = async () => {
    if (!selectedClass) return;
    
    setSaving(true);
    setSuccessMsg("");
    
    // In real app, get teacherId from session.
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    let successCount = 0;
    for (const student of students) {
      const rec = records[student.id];
      if (rec.surah !== "" && rec.predicate !== "") {
        const res = await createTahfidzRecord({
          studentId: student.id,
          surah: rec.surah,
          ayat: rec.ayat,
          predicate: rec.predicate,
          date: today,
          notes: rec.notes
        });
        if (res.success) successCount++;
      }
    }
    
    setSaving(false);
    setSuccessMsg(`Berhasil menyimpan ${successCount} rekam mutaba'ah tahfidz.`);
    
    setTimeout(() => {
      setSuccessMsg("");
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-stone-900">Input Mutaba&apos;ah Tahfidz</h2>
        <p className="text-stone-500">Catat perkembangan hafalan Al-Quran siswa secara berkala.</p>
      </div>

      <Card className="border-stone-100 shadow-sm">
        <CardContent className="p-6">
          {loadingConfig ? (
            <div className="flex justify-center items-center h-20 text-stone-400">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="max-w-md space-y-2">
              <Label>Pilih Kelas</Label>
              <Select value={selectedClass} onValueChange={(val) => setSelectedClass(val || "")}>
                <SelectTrigger><SelectValue placeholder="Pilih Kelas untuk melihat daftar siswa" /></SelectTrigger>
                <SelectContent>
                  {classes.map(c => (
                    <SelectItem key={c.id} value={c.id.toString()}>Kelas {c.level} - {c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedClass ? (
        <Card className="border-stone-100 shadow-sm overflow-hidden">
          <CardHeader className="bg-stone-50 border-b border-stone-100 flex flex-row items-center justify-between">
            <h3 className="font-semibold text-stone-800 flex items-center">
              <BookOpen className="mr-2 h-4 w-4 text-teal-600" />
              Daftar Siswa (Setoran Hari Ini)
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
                      <div className="md:w-1/4 flex items-start gap-3">
                        <div className="bg-stone-100 p-2 rounded-full text-stone-400">
                          <UserCircle2 className="h-8 w-8" />
                        </div>
                        <div>
                          <h4 className="font-bold text-stone-900 leading-tight">{student.name}</h4>
                          <p className="text-xs text-stone-500">NIS: {student.nis}</p>
                        </div>
                      </div>
                      <div className="md:w-3/4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs text-stone-500">Nama Surah</Label>
                          <Input 
                            placeholder="Cth: Al-Mulk" 
                            className="bg-white"
                            value={records[student.id]?.surah || ""}
                            onChange={(e) => handleChange(student.id, "surah", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-stone-500">Ayat</Label>
                          <Input 
                            placeholder="Cth: 1-10" 
                            className="bg-white"
                            value={records[student.id]?.ayat || ""}
                            onChange={(e) => handleChange(student.id, "ayat", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-stone-500">Predikat</Label>
                          <Select 
                            value={records[student.id]?.predicate || ""} 
                            onValueChange={(val) => handleChange(student.id, "predicate", val || "")}
                          >
                            <SelectTrigger className="bg-white"><SelectValue placeholder="Pilih..." /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Mumtaz">Mumtaz (A)</SelectItem>
                              <SelectItem value="Jayyid Jiddan">Jayyid Jiddan (B)</SelectItem>
                              <SelectItem value="Jayyid">Jayyid (C)</SelectItem>
                              <SelectItem value="Maqbul">Maqbul (D/Ulang)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-stone-500">Catatan Tajwid (Opsional)</Label>
                          <Input 
                            placeholder="Cth: Mad kurang panjang" 
                            className="bg-white"
                            value={records[student.id]?.notes || ""}
                            onChange={(e) => handleChange(student.id, "notes", e.target.value)}
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
            <p className="text-lg font-medium text-stone-700">Pilih Kelas</p>
            <p className="text-sm mt-1">Silakan pilih kelas terlebih dahulu untuk melihat daftar siswa.</p>
          </div>
        )
      )}
    </div>
  );
}
