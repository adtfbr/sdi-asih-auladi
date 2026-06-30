"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CalendarDays, Save, Loader2, CheckCircle2 } from "lucide-react";

interface ClassOption {
  id: number;
  name: string;
}

interface StudentRow {
  id: number;
  nis: string;
  name: string;
  status: string;
}

export default function InputAbsensiPage() {
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendanceMap, setAttendanceMap] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/kelas")
      .then((res) => res.json())
      .then((data) => setClasses(Array.isArray(data) ? data : []));
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchStudents = async () => {
      if (!selectedClass) {
        setStudents([]);
        setAttendanceMap({});
        return;
      }

      setLoading(true);
      setSaved(false);
      try {
        const res = await fetch(`/api/kelas/${selectedClass}/siswa`);
        const data = await res.json();
        const studentList = Array.isArray(data) ? data : [];
        if (!isMounted) return;
        
        setStudents(studentList);
        
        // Default all to "Hadir"
        const map: Record<number, string> = {};
        studentList.forEach((s: StudentRow) => { map[s.id] = "Hadir"; });

        // Fetch existing attendance for this class+date
        const attRes = await fetch(`/api/absensi?classId=${selectedClass}&date=${date}`);
        const attData = await attRes.json();
        if (!isMounted) return;

        if (Array.isArray(attData)) {
          attData.forEach((a: { studentId: number; status: string }) => { map[a.studentId] = a.status; });
        }

        setAttendanceMap(map);
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
  }, [selectedClass, date]);

  const handleStatusChange = (studentId: number, status: string) => {
    setAttendanceMap((prev) => ({ ...prev, [studentId]: status }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const records = students.map((s) => ({
        studentId: s.id,
        status: attendanceMap[s.id] || "Hadir",
      }));

      const res = await fetch("/api/absensi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classId: Number(selectedClass),
          date,
          records,
        }),
      });

      if (!res.ok) throw new Error("Gagal menyimpan");
      setSaved(true);
    } catch {
      alert("Gagal menyimpan absensi. Coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-stone-900">Input Absensi</h2>
        <p className="text-stone-500">Catat kehadiran harian siswa untuk kelas yang Anda ajar.</p>
      </div>

      <Card className="border-stone-100 shadow-sm bg-white">
        <CardHeader className="pb-4 border-b border-stone-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>Pilih Kelas</Label>
              <Select value={selectedClass} onValueChange={(val) => setSelectedClass(val || "")}>
                <SelectTrigger className="bg-stone-50 border-stone-200">
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
              <Label>Tanggal Absensi</Label>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="pl-10 bg-stone-50 border-stone-200"
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {!selectedClass ? (
            <div className="flex items-center justify-center h-48 text-stone-400">
              Pilih kelas untuk menampilkan daftar siswa.
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center h-48 text-stone-400">
              <Loader2 className="h-6 w-6 animate-spin mr-2" /> Memuat data siswa...
            </div>
          ) : students.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-stone-400">
              Tidak ada siswa di kelas ini.
            </div>
          ) : (
            <>
              <Table>
                <TableHeader className="bg-stone-50">
                  <TableRow>
                    <TableHead className="w-[60px]">No</TableHead>
                    <TableHead className="w-[120px]">NIS</TableHead>
                    <TableHead>Nama Lengkap</TableHead>
                    <TableHead className="w-[300px]">Status Kehadiran</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student, index) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium text-stone-500">{index + 1}</TableCell>
                      <TableCell className="text-stone-600">{student.nis}</TableCell>
                      <TableCell className="font-semibold text-stone-900">{student.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {["Hadir", "Izin", "Sakit", "Alpha"].map((s) => (
                            <label key={s} className="flex items-center gap-1.5 cursor-pointer">
                              <input
                                type="radio"
                                name={`status-${student.id}`}
                                value={s}
                                checked={attendanceMap[student.id] === s}
                                onChange={() => handleStatusChange(student.id, s)}
                                className={
                                  s === "Hadir" ? "text-teal-600" :
                                    s === "Izin" ? "text-sky-600" :
                                      s === "Sakit" ? "text-amber-600" : "text-rose-600"
                                }
                              />
                              <span className="text-sm">{s}</span>
                            </label>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6 flex items-center justify-end gap-3">
                {saved && (
                  <span className="flex items-center text-sm text-teal-600 font-medium">
                    <CheckCircle2 className="h-4 w-4 mr-1" /> Absensi tersimpan!
                  </span>
                )}
                <Button
                  className="bg-teal-600 hover:bg-teal-700 text-white h-10 px-8 rounded-full"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Simpan Absensi
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
