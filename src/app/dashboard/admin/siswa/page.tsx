"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Search, Download, Upload, MoreHorizontal, Pencil, Trash2, Loader2, ArrowUpDown } from "lucide-react";
import Papa from "papaparse";
import { useRef } from "react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Student {
  id: number;
  nis: string;
  nisn: string;
  name: string;
  gender: string;
  birthDate: string;
  address: string | null;
  status: string;
  className: string | null;
  classId: number | null;
}

interface ClassOption {
  id: number;
  name: string;
}

const emptyForm = {
  nis: "", nisn: "", name: "", gender: "Laki-laki", birthDate: "", address: "", status: "Aktif", classId: "",
};

export default function DataSiswaPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("all-class");
  const [filterStatus, setFilterStatus] = useState("Aktif");

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Import/Export & Sorting
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sortConfig, setSortConfig] = useState<{key: keyof Student, direction: 'asc'|'desc'} | null>(null);

  const handleSort = (key: keyof Student) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedStudents = [...students].sort((a, b) => {
    if (!sortConfig) return 0;
    const aVal = String(a[sortConfig.key] || "");
    const bVal = String(b[sortConfig.key] || "");
    const compareResult = aVal.localeCompare(bVal, undefined, { numeric: true });
    return sortConfig.direction === 'asc' ? compareResult : -compareResult;
    return 0;
  });

  const handleExport = () => {
    const csv = Papa.unparse(students.map(s => ({
      NIS: s.nis,
      NISN: s.nisn,
      Name: s.name,
      Gender: s.gender,
      BirthDate: s.birthDate,
      Class: s.className || '',
      Status: s.status
    })));
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'data_siswa.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        setLoading(true);
        try {
          const formattedData = results.data.map((row: any) => ({
            nis: row.NIS || row.nis,
            nisn: row.NISN || row.nisn,
            name: row.Name || row.name,
            gender: row.Gender || row.gender,
            birthDate: row.BirthDate || row.birthDate,
            status: row.Status || row.status || 'Aktif',
            classId: classes.find(c => c.name === (row.Class || row.class || row.className))?.id
          }));
          const res = await fetch("/api/siswa/bulk", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formattedData)
          });
          if (res.ok) fetchStudents();
          else alert("Gagal import data.");
        } catch (error) {
          alert("Error import CSV.");
        }
        setLoading(false);
      }
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("q", search);
      if (filterStatus && filterStatus !== "semua") params.set("status", filterStatus);
      if (filterClass && filterClass !== "all-class") params.set("classId", filterClass);
      const res = await fetch(`/api/siswa?${params.toString()}`);
      const data = await res.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch {
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus, filterClass]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch("/api/kelas");
        const data = await res.json();
        setClasses(Array.isArray(data) ? data : []);
      } catch {
        setClasses([]);
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(fetchStudents, 300);
    return () => clearTimeout(timeout);
  }, [fetchStudents]);

  const openCreate = () => {
    setFormData(emptyForm);
    setDialogMode("create");
    setEditingId(null);
    setError("");
    setDialogOpen(true);
  };

  const openEdit = (student: Student) => {
    setFormData({
      nis: student.nis,
      nisn: student.nisn,
      name: student.name,
      gender: student.gender,
      birthDate: student.birthDate,
      address: student.address || "",
      status: student.status,
      classId: student.classId?.toString() || "",
    });
    setDialogMode("edit");
    setEditingId(student.id);
    setError("");
    setDialogOpen(true);
  };

  const openDelete = (student: Student) => {
    setDeletingStudent(student);
    setDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...formData,
        classId: formData.classId ? Number(formData.classId) : undefined,
      };

      if (dialogMode === "create") {
        const { createStudentWithAccount } = await import("@/app/actions/user-actions");
        const res = await createStudentWithAccount({
          name: payload.name,
          nis: payload.nis,
          nisn: payload.nisn,
          gender: payload.gender,
          birthDate: payload.birthDate,
          address: payload.address,
        });

        if (!res.success) {
          throw new Error(res.error || "Gagal membuat siswa & akun login.");
        }
      } else {
        const res = await fetch(`/api/siswa/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Gagal menyimpan data");
        }
      }

      setDialogOpen(false);
      fetchStudents();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingStudent) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/siswa/${deletingStudent.id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal menghapus data");
      }
      setDeleteDialogOpen(false);
      setDeletingStudent(null);
      fetchStudents();
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
          <h2 className="text-2xl font-bold tracking-tight text-stone-900">Data Siswa</h2>
          <p className="text-stone-500">Kelola data induk siswa, kelas, dan status akademik.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input type="file" accept=".csv" ref={fileInputRef} className="hidden" onChange={handleImport} />
          <Button variant="outline" className="border-stone-200" onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" /> Import CSV
          </Button>
          <Button variant="outline" className="border-stone-200" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Siswa
          </Button>
        </div>
      </div>

      <Card className="border-stone-100 shadow-sm">
        <CardHeader className="pb-3 border-b border-stone-50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1 max-w-sm relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-stone-400" />
              <Input
                placeholder="Cari nama atau NIS..."
                className="pl-9 bg-stone-50 border-stone-200"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={filterClass} onValueChange={(val) => setFilterClass(val || "")}>
                <SelectTrigger className="w-[140px] bg-stone-50 border-stone-200">
                  <SelectValue placeholder="Pilih Kelas">
                    {filterClass === "all-class" ? "Semua Kelas" : filterClass ? `Kelas ${classes.find(c => c.id.toString() === filterClass)?.name || filterClass}` : "Pilih Kelas"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-class">Semua Kelas</SelectItem>
                  {classes.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      Kelas {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={(val) => setFilterStatus(val || "")}>
                <SelectTrigger className="w-[140px] bg-stone-50 border-stone-200">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua Status</SelectItem>
                  <SelectItem value="Aktif">Aktif</SelectItem>
                  <SelectItem value="Lulus">Lulus</SelectItem>
                  <SelectItem value="Pindah">Pindah</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-48 text-stone-400">
              <Loader2 className="h-6 w-6 animate-spin mr-2" /> Memuat data...
            </div>
          ) : students.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-stone-400">
              <p className="text-lg font-medium">Belum ada data siswa</p>
              <p className="text-sm">Klik &quot;Tambah Siswa&quot; untuk menambahkan data.</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-stone-50">
                  <TableRow>
                    <TableHead className="cursor-pointer hover:bg-stone-100" onClick={() => handleSort('nis')}>
                      NIS <ArrowUpDown className="inline h-3 w-3 ml-1" />
                    </TableHead>
                    <TableHead className="cursor-pointer hover:bg-stone-100" onClick={() => handleSort('name')}>
                      Nama Lengkap <ArrowUpDown className="inline h-3 w-3 ml-1" />
                    </TableHead>
                    <TableHead className="cursor-pointer hover:bg-stone-100" onClick={() => handleSort('className')}>
                      Kelas <ArrowUpDown className="inline h-3 w-3 ml-1" />
                    </TableHead>
                    <TableHead className="cursor-pointer hover:bg-stone-100" onClick={() => handleSort('gender')}>
                      L/P <ArrowUpDown className="inline h-3 w-3 ml-1" />
                    </TableHead>
                    <TableHead className="cursor-pointer hover:bg-stone-100" onClick={() => handleSort('status')}>
                      Status <ArrowUpDown className="inline h-3 w-3 ml-1" />
                    </TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
              </TableHeader>
              <TableBody>
                {sortedStudents.map((student) => (
                  <TableRow key={student.id} className="hover:bg-stone-50/50">
                    <TableCell className="font-medium text-stone-600">{student.nis}</TableCell>
                    <TableCell className="font-semibold text-stone-900">{student.name}</TableCell>
                    <TableCell>{student.className || "-"}</TableCell>
                    <TableCell>{student.gender === "Laki-laki" ? "L" : "P"}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          student.status === "Aktif"
                            ? "bg-teal-50 text-teal-700 border-teal-200"
                            : student.status === "Lulus"
                            ? "bg-sky-50 text-sky-700 border-sky-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }
                      >
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-stone-100 text-stone-400 hover:text-stone-600">
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(student)}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-rose-600" onClick={() => openDelete(student)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{dialogMode === "create" ? "Tambah Siswa Baru" : "Edit Data Siswa"}</DialogTitle>
            <DialogDescription>
              {dialogMode === "create" ? "Isi formulir untuk menambahkan siswa baru." : "Perbarui informasi siswa."}
            </DialogDescription>
          </DialogHeader>
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nis">NIS</Label>
                <Input id="nis" value={formData.nis} onChange={(e) => setFormData({ ...formData, nis: e.target.value })} placeholder="Nomor Induk Siswa" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nisn">NISN</Label>
                <Input id="nisn" value={formData.nisn} onChange={(e) => setFormData({ ...formData, nisn: e.target.value })} placeholder="NISN Nasional" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Nama lengkap siswa" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Jenis Kelamin</Label>
                <Select value={formData.gender} onValueChange={(val) => setFormData({ ...formData, gender: val || "" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                    <SelectItem value="Perempuan">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate">Tanggal Lahir</Label>
                <Input id="birthDate" type="date" value={formData.birthDate} onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Kelas</Label>
                <Select value={formData.classId} onValueChange={(val) => setFormData({ ...formData, classId: val || "" })}>
                  <SelectTrigger>
                    <SelectValue>
                      {formData.classId ? `Kelas ${classes.find(c => c.id.toString() === formData.classId)?.name}` : "Pilih Kelas"}
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
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val || "" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aktif">Aktif</SelectItem>
                    <SelectItem value="Lulus">Lulus</SelectItem>
                    <SelectItem value="Pindah">Pindah</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Alamat</Label>
              <Input id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Alamat lengkap (opsional)" />
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Hapus Siswa</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus data siswa <strong>{deletingStudent?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
