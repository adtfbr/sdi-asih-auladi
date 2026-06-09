"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Edit2, Trash2, CalendarDays, Loader2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Schedule {
  id: number;
  classId: number;
  className: string;
  classLevel: number;
  subjectId: number;
  subjectName: string;
  teacherId: number;
  teacherName: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

interface ClassOption { id: number; name: string; }
interface SubjectOption { id: number; name: string; }
interface TeacherOption { id: number; name: string; }

const emptyForm = {
  classId: "",
  subjectId: "",
  teacherId: "",
  dayOfWeek: "1",
  startTime: "07:30",
  endTime: "09:00",
};

const daysMap = ["", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

export default function JadwalAdminPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [teachers, setTeachers] = useState<TeacherOption[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedClassFilter, setSelectedClassFilter] = useState<string>("all");

  // Dialog State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingSchedule, setDeletingSchedule] = useState<Schedule | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMetadata = useCallback(async () => {
    try {
      const [resClass, resSubj, resTeacher] = await Promise.all([
        fetch("/api/kelas"),
        fetch("/api/mapel"),
        fetch("/api/guru")
      ]);
      const dataClass = await resClass.json();
      const dataSubj = await resSubj.json();
      const dataTeacher = await resTeacher.json();
      
      setClasses(Array.isArray(dataClass) ? dataClass : []);
      setSubjects(Array.isArray(dataSubj) ? dataSubj : []);
      setTeachers(Array.isArray(dataTeacher) ? dataTeacher : []);
    } catch {
      // ignore
    }
  }, []);

  const fetchSchedulesData = useCallback(async () => {
    setLoading(true);
    try {
      const resSched = await fetch(selectedClassFilter !== "all" ? `/api/jadwal?classId=${selectedClassFilter}` : "/api/jadwal");
      const dataSched = await resSched.json();
      setSchedules(Array.isArray(dataSched) ? dataSched : []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [selectedClassFilter]);

  useEffect(() => {
    fetchMetadata();
  }, [fetchMetadata]);

  useEffect(() => {
    fetchSchedulesData();
  }, [fetchSchedulesData]);

  const openCreate = () => {
    setFormData({ ...emptyForm, classId: selectedClassFilter !== "all" ? selectedClassFilter : "" });
    setDialogMode("create");
    setEditingId(null);
    setError("");
    setDialogOpen(true);
  };

  const openEdit = (s: Schedule) => {
    setFormData({
      classId: s.classId.toString(),
      subjectId: s.subjectId.toString(),
      teacherId: s.teacherId.toString(),
      dayOfWeek: s.dayOfWeek.toString(),
      startTime: s.startTime,
      endTime: s.endTime,
    });
    setDialogMode("edit");
    setEditingId(s.id);
    setError("");
    setDialogOpen(true);
  };

  const openDelete = (s: Schedule) => {
    setDeletingSchedule(s);
    setDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.classId || !formData.subjectId || !formData.teacherId) {
      setError("Semua field (Kelas, Mapel, Guru) wajib diisi.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        classId: Number(formData.classId),
        subjectId: Number(formData.subjectId),
        teacherId: Number(formData.teacherId),
        dayOfWeek: Number(formData.dayOfWeek),
        startTime: formData.startTime,
        endTime: formData.endTime,
      };

      const url = dialogMode === "create" ? "/api/jadwal" : `/api/jadwal/${editingId}`;
      const method = dialogMode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal menyimpan data");
      }

      setDialogOpen(false);
      fetchSchedulesData();
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingSchedule) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/jadwal/${deletingSchedule.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus data");
      setDeleteDialogOpen(false);
      setDeletingSchedule(null);
      fetchSchedulesData();
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Jadwal Pelajaran</h2>
          <p className="text-slate-500">Kelola dan susun jadwal mata pelajaran untuk setiap kelas.</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Sesi Jadwal
        </Button>
      </div>

      <Card className="border-slate-100 shadow-sm bg-white overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-slate-400" />
              <CardTitle className="text-lg text-slate-900">Daftar Jadwal</CardTitle>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">Filter Kelas:</span>
              <Select value={selectedClassFilter} onValueChange={(val) => setSelectedClassFilter(val || "all")}>
                <SelectTrigger className="w-[180px] bg-white border-slate-200 font-semibold text-emerald-700">
                  <SelectValue placeholder="Semua Kelas">
                    {selectedClassFilter === "all" ? "Semua Kelas" : classes.find(c => c.id.toString() === selectedClassFilter)?.name || selectedClassFilter}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kelas</SelectItem>
                  {classes.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
             <div className="flex items-center justify-center h-48 text-slate-400">
               <Loader2 className="h-6 w-6 animate-spin mr-2" /> Memuat jadwal...
             </div>
          ) : schedules.length === 0 && selectedClassFilter === "all" ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400">
              <CalendarDays className="h-10 w-10 mb-3 text-slate-300" />
              <p className="text-lg font-medium">Belum ada sesi jadwal</p>
              <p className="text-sm">Klik "Tambah Sesi Jadwal" untuk membuat jadwal baru.</p>
            </div>
          ) : selectedClassFilter === "all" ? (
            <Table>
              <TableHeader className="bg-slate-100">
                <TableRow>
                  <TableHead>Hari</TableHead>
                  <TableHead>Jam</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Mata Pelajaran</TableHead>
                  <TableHead>Guru Pengajar</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedules.map((s) => (
                  <TableRow key={s.id} className="hover:bg-slate-50/50 group">
                    <TableCell className="font-semibold text-slate-800">
                      {daysMap[s.dayOfWeek]}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-white border-slate-200 text-slate-600 font-medium">
                        <Clock className="w-3 h-3 mr-1 inline" /> {s.startTime.slice(0, 5)} - {s.endTime.slice(0, 5)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-emerald-700">{s.className}</TableCell>
                    <TableCell className="font-medium">{s.subjectName}</TableCell>
                    <TableCell className="text-slate-600">{s.teacherName}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-50" onClick={() => openEdit(s)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-rose-600 hover:bg-rose-50" onClick={() => openDelete(s)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
                        <TableCell key={dayIdx} className="border-r border-slate-100 last:border-0 p-3 align-top group hover:bg-emerald-50/50 transition-colors">
                          {session ? (
                            <div className="h-full flex flex-col justify-between">
                              <div>
                                <div className="font-bold text-slate-800 text-sm">{session.subjectName}</div>
                                <div className="text-xs text-slate-500 mt-1">{session.teacherName}</div>
                              </div>
                              <div className="mt-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="sm" variant="outline" onClick={() => openEdit(session)} className="h-6 w-full text-[10px] bg-white text-blue-600 border-blue-200 hover:bg-blue-50">
                                  <Edit2 className="h-3 w-3 mr-1" /> Edit
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="h-full w-full flex items-center justify-center min-h-[60px] opacity-0 group-hover:opacity-100 transition-opacity">
                               <Button size="sm" variant="ghost" onClick={() => {
                                 const [start, end] = timeLabel.split(' - ');
                                 setFormData({ ...emptyForm, classId: selectedClassFilter, dayOfWeek: dayIdx.toString(), startTime: start, endTime: end });
                                 setDialogMode("create");
                                 setEditingId(null);
                                 setError("");
                                 setDialogOpen(true);
                               }} className="text-emerald-600 hover:bg-emerald-50 h-8 text-xs border border-dashed border-emerald-300 w-full">
                                  <Plus className="h-3 w-3 mr-1" /> Isi Jadwal
                               </Button>
                            </div>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
                {schedules.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-slate-500">
                      Tidak ada jadwal untuk kelas ini. <Button variant="link" onClick={openCreate} className="text-emerald-600 p-0 h-auto">Buat jadwal baru</Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog Form */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{dialogMode === "create" ? "Tambah Sesi Jadwal" : "Edit Jadwal"}</DialogTitle>
            <DialogDescription>Masukkan detail jadwal mata pelajaran ke dalam sistem.</DialogDescription>
          </DialogHeader>
          
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Hari</Label>
                <Select value={formData.dayOfWeek} onValueChange={(v) => setFormData({ ...formData, dayOfWeek: v || "1" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {daysMap.map((d, i) => {
                      if (i === 0) return null;
                      return <SelectItem key={i} value={i.toString()}>{d}</SelectItem>;
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Kelas</Label>
                <Select value={formData.classId} onValueChange={(v) => setFormData({ ...formData, classId: v || "" })}>
                  <SelectTrigger><SelectValue placeholder="Pilih..." /></SelectTrigger>
                  <SelectContent>
                    {classes.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Jam Mulai</Label>
                <Input type="time" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Jam Selesai</Label>
                <Input type="time" value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Mata Pelajaran</Label>
              <Select value={formData.subjectId} onValueChange={(v) => setFormData({ ...formData, subjectId: v || "" })}>
                <SelectTrigger><SelectValue placeholder="Pilih Mapel..." /></SelectTrigger>
                <SelectContent>
                  {subjects.map(s => <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Guru Pengajar</Label>
              <Select value={formData.teacherId} onValueChange={(v) => setFormData({ ...formData, teacherId: v || "" })}>
                <SelectTrigger><SelectValue placeholder="Pilih Guru..." /></SelectTrigger>
                <SelectContent>
                  {teachers.map(t => <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {dialogMode === "create" ? "Simpan Jadwal" : "Perbarui Jadwal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Hapus Jadwal</DialogTitle>
            <DialogDescription>
              Yakin ingin menghapus jadwal <strong>{deletingSchedule?.subjectName}</strong> kelas <strong>{deletingSchedule?.className}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
