"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Loader2, ArrowUpDown } from "lucide-react";

interface Kelas {
  id: number;
  name: string;
  level: number;
  academicYearId: number;
  academicYearName: string | null;
  homeroomTeacherId: number | null;
  homeroomTeacherName: string | null;
  studentCount?: number;
}

interface AcademicYearOption {
  id: number;
  name: string;
  semester: string;
}

interface TeacherOption {
  id: number;
  name: string;
}

const emptyForm = {
  name: "",
  level: "",
  capacity: "30",
  academicYearId: "",
  homeroomTeacherId: "",
};

export default function AdminKelasPage() {
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYearOption[]>([]);
  const [teachers, setTeachers] = useState<TeacherOption[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingKelas, setDeletingKelas] = useState<Kelas | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [sortConfig, setSortConfig] = useState<{key: keyof Kelas, direction: 'asc'|'desc'} | null>(null);

  const handleSort = (key: keyof Kelas) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedKelasList = [...kelasList].sort((a, b) => {
    if (!sortConfig) return 0;
    const aVal = String(a[sortConfig.key] || "");
    const bVal = String(b[sortConfig.key] || "");
    const compareResult = aVal.localeCompare(bVal, undefined, { numeric: true });
    return sortConfig.direction === 'asc' ? compareResult : -compareResult;
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [resKelas, resTahun, resGuru] = await Promise.all([
        fetch("/api/kelas"),
        fetch("/api/tahun-ajaran"),
        fetch("/api/guru")
      ]);
      const dataKelas = await resKelas.json();
      const dataTahun = await resTahun.json();
      const dataGuru = await resGuru.json();
      
      setKelasList(Array.isArray(dataKelas) ? dataKelas : []);
      setAcademicYears(Array.isArray(dataTahun) ? dataTahun : []);
      setTeachers(Array.isArray(dataGuru) ? dataGuru : []);
    } catch {
      setKelasList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openCreate = () => {
    setFormData(emptyForm);
    setDialogMode("create");
    setEditingId(null);
    setError("");
    setDialogOpen(true);
  };

  const openEdit = (kelas: Kelas) => {
    setFormData({
      name: kelas.name,
      level: kelas.level.toString(),
      capacity: "30", // default or fetch from detail if needed
      academicYearId: kelas.academicYearId.toString(),
      homeroomTeacherId: kelas.homeroomTeacherId?.toString() || "none",
    });
    setDialogMode("edit");
    setEditingId(kelas.id);
    setError("");
    setDialogOpen(true);
  };

  const openDelete = (kelas: Kelas) => {
    setDeletingKelas(kelas);
    setDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.academicYearId || formData.academicYearId === "") {
      setError("Pilih Tahun Ajaran terlebih dahulu.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        name: formData.name,
        level: Number(formData.level),
        capacity: Number(formData.capacity),
        academicYearId: Number(formData.academicYearId),
        homeroomTeacherId: formData.homeroomTeacherId && formData.homeroomTeacherId !== "none" ? Number(formData.homeroomTeacherId) : undefined,
      };

      const url = dialogMode === "create" ? "/api/kelas" : `/api/kelas/${editingId}`;
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
      fetchData();
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingKelas) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/kelas/${deletingKelas.id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal menghapus data");
      }
      setDeleteDialogOpen(false);
      setDeletingKelas(null);
      fetchData();
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
          <h2 className="text-2xl font-bold tracking-tight text-stone-900">Data Kelas</h2>
          <p className="text-stone-500">Kelola daftar kelas, tingkat, dan wali kelas.</p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Kelas
        </Button>
      </div>

      <Card className="border-stone-100 shadow-sm">
        <CardContent className="p-0">
          {loading ? (
             <div className="flex items-center justify-center h-48 text-stone-400">
               <Loader2 className="h-6 w-6 animate-spin mr-2" /> Memuat data...
             </div>
          ) : kelasList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-stone-400">
              <p className="text-lg font-medium">Belum ada data kelas</p>
              <p className="text-sm">Klik "Tambah Kelas" untuk menambahkan data.</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-stone-50">
                <TableRow>
                  <TableHead className="cursor-pointer hover:bg-stone-100" onClick={() => handleSort('name')}>
                    Nama Kelas <ArrowUpDown className="inline h-3 w-3 ml-1" />
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-stone-100" onClick={() => handleSort('level')}>
                    Tingkat <ArrowUpDown className="inline h-3 w-3 ml-1" />
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-stone-100" onClick={() => handleSort('homeroomTeacherName')}>
                    Wali Kelas <ArrowUpDown className="inline h-3 w-3 ml-1" />
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-stone-100" onClick={() => handleSort('academicYearName')}>
                    Tahun Ajaran <ArrowUpDown className="inline h-3 w-3 ml-1" />
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-stone-100" onClick={() => handleSort('studentCount')}>
                    Siswa <ArrowUpDown className="inline h-3 w-3 ml-1" />
                  </TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedKelasList.map((k) => (
                  <TableRow key={k.id} className="hover:bg-stone-50/50">
                    <TableCell className="font-medium text-stone-900">{k.name}</TableCell>
                    <TableCell>Kelas {k.level}</TableCell>
                    <TableCell>{k.homeroomTeacherName || "-"}</TableCell>
                    <TableCell>{k.academicYearName || "-"}</TableCell>
                    <TableCell>{k.studentCount || 0} Siswa</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="text-sky-600 hover:bg-sky-50" onClick={() => openEdit(k)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-rose-600 hover:bg-rose-50" onClick={() => openDelete(k)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{dialogMode === "create" ? "Tambah Kelas Baru" : "Edit Data Kelas"}</DialogTitle>
            <DialogDescription>Isi formulir untuk menyimpan data kelas.</DialogDescription>
          </DialogHeader>
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nama Kelas</Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Contoh: 1A" />
              </div>
              <div className="space-y-2">
                <Label>Tingkat</Label>
                <Select value={formData.level} onValueChange={(val) => setFormData({ ...formData, level: val || "" })}>
                  <SelectTrigger><SelectValue placeholder="Pilih Tingkat" /></SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5,6].map(lvl => (
                      <SelectItem key={lvl} value={lvl.toString()}>Kelas {lvl}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tahun Ajaran</Label>
              <Select value={formData.academicYearId} onValueChange={(val) => setFormData({ ...formData, academicYearId: val || "" })}>
                <SelectTrigger>
                  <SelectValue>
                    {formData.academicYearId ? (() => {
                      const ay = academicYears.find(ay => ay.id.toString() === formData.academicYearId);
                      return ay ? `${ay.name} (${ay.semester})` : "Pilih Tahun Ajaran";
                    })() : "Pilih Tahun Ajaran"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map(ay => (
                    <SelectItem key={ay.id} value={ay.id.toString()}>{ay.name} ({ay.semester})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Wali Kelas (Opsional)</Label>
              <Select value={formData.homeroomTeacherId} onValueChange={(val) => setFormData({ ...formData, homeroomTeacherId: val || "" })}>
                <SelectTrigger>
                  <SelectValue>
                    {formData.homeroomTeacherId && formData.homeroomTeacherId !== "none" 
                      ? teachers.find(t => t.id.toString() === formData.homeroomTeacherId)?.name 
                      : "Pilih Guru Wali"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Belum Ditentukan</SelectItem>
                  {teachers.map(t => (
                    <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Kapasitas Siswa</Label>
              <Input type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} placeholder="30" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {dialogMode === "create" ? "Simpan" : "Perbarui"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Hapus Kelas</DialogTitle>
            <DialogDescription>
              Yakin ingin menghapus <strong>{deletingKelas?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
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
