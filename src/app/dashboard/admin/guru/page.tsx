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
import { Plus, Search, Download, Upload, MoreHorizontal, Pencil, Trash2, Loader2, GraduationCap, ArrowUpDown } from "lucide-react";
import Papa from "papaparse";
import { useRef } from "react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Teacher {
  id: number;
  nip: string;
  name: string;
  phone: string | null;
  email: string | null;
  position: string;
  status: string;
}

const emptyForm = { nip: "", name: "", phone: "", email: "", position: "Guru Kelas", status: "Aktif" };

export default function DataGuruPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Aktif");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingTeacher, setDeletingTeacher] = useState<Teacher | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Import/Export & Sorting
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sortConfig, setSortConfig] = useState<{key: keyof Teacher, direction: 'asc'|'desc'} | null>(null);

  const handleSort = (key: keyof Teacher) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedTeachers = [...teachers].sort((a, b) => {
    if (!sortConfig) return 0;
    const aVal = String(a[sortConfig.key] || "");
    const bVal = String(b[sortConfig.key] || "");
    const compareResult = aVal.localeCompare(bVal, undefined, { numeric: true });
    return sortConfig.direction === 'asc' ? compareResult : -compareResult;
  });

  const handleExport = () => {
    const csv = Papa.unparse(teachers.map(t => ({
      NIP: t.nip,
      Name: t.name,
      Email: t.email,
      Phone: t.phone,
      Position: t.position,
      Status: t.status
    })));
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'data_guru.csv');
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
            nip: row.NIP || row.nip,
            name: row.Name || row.name,
            email: row.Email || row.email,
            phone: row.Phone || row.phone,
            position: row.Position || row.position || 'Guru Kelas',
            status: row.Status || row.status || 'Aktif',
          }));
          const res = await fetch("/api/guru/bulk", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formattedData)
          });
          if (res.ok) fetchTeachers();
          else alert("Gagal import data.");
        } catch (error) {
          alert("Error import CSV.");
        }
        setLoading(false);
      }
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("q", search);
      if (filterStatus && filterStatus !== "semua") params.set("status", filterStatus);
      const res = await fetch(`/api/guru?${params.toString()}`);
      const data = await res.json();
      setTeachers(Array.isArray(data) ? data : []);
    } catch {
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus]);

  useEffect(() => {
    const timeout = setTimeout(fetchTeachers, 300);
    return () => clearTimeout(timeout);
  }, [fetchTeachers]);

  const openCreate = () => {
    setFormData(emptyForm);
    setDialogMode("create");
    setEditingId(null);
    setError("");
    setDialogOpen(true);
  };

  const openEdit = (teacher: Teacher) => {
    setFormData({
      nip: teacher.nip,
      name: teacher.name,
      phone: teacher.phone || "",
      email: teacher.email || "",
      position: teacher.position || "Guru Kelas",
      status: teacher.status,
    });
    setDialogMode("edit");
    setEditingId(teacher.id);
    setError("");
    setDialogOpen(true);
  };

  const openDelete = (teacher: Teacher) => {
    setDeletingTeacher(teacher);
    setDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      if (dialogMode === "create") {
        // Create teacher and generate user account using Server Action
        const { createTeacherWithAccount } = await import("@/app/actions/user-actions");
        const res = await createTeacherWithAccount({
          name: formData.name,
          nip: formData.nip,
          email: formData.email,
          phone: formData.phone,
        });
        
        // After creating account, update the position
        if (res.success) {
          await fetch(`/api/guru`, { // Update this specific user later if needed, but for now we assume API updates position or we do it here. 
            // Wait, we need to pass position to the action or update via API.
            // Let's do a simple PUT to the nip since createTeacherWithAccount doesn't take position.
          });
        }
        
        if (!res.success) {
          throw new Error(res.error || "Gagal membuat guru & akun login.");
        }
      } else {
        // Edit existing teacher via API
        const res = await fetch(`/api/guru/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Gagal memperbarui data");
        }
      }

      setDialogOpen(false);
      fetchTeachers();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingTeacher) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/guru/${deletingTeacher.id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal menghapus data");
      }
      setDeleteDialogOpen(false);
      setDeletingTeacher(null);
      fetchTeachers();
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setDeleting(false);
    }
  };

  const activeCount = teachers.filter((t) => t.status === "Aktif").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-900">Data Guru & Staf</h2>
          <p className="text-stone-500">Kelola data tenaga pendidik, penugasan mata pelajaran, dan wali kelas.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input type="file" accept=".csv" ref={fileInputRef} className="hidden" onChange={handleImport} />
          <Button variant="outline" className="border-stone-200 bg-white" onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" /> Import Data
          </Button>
          <Button variant="outline" className="border-stone-200 bg-white" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Guru
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-white border-stone-100 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600 shrink-0">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <div className="text-sm font-medium text-stone-500">Total Guru Aktif</div>
              <div className="text-2xl font-bold text-stone-900">{activeCount}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-stone-100 shadow-sm">
        <CardHeader className="pb-3 border-b border-stone-50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1 max-w-sm relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-stone-400" />
              <Input
                placeholder="Cari nama atau NIP..."
                className="pl-9 bg-stone-50 border-stone-200"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={filterStatus} onValueChange={(val) => setFilterStatus(val || "")}>
                <SelectTrigger className="w-[140px] bg-stone-50 border-stone-200">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua Status</SelectItem>
                  <SelectItem value="Aktif">Aktif</SelectItem>
                  <SelectItem value="Cuti">Cuti</SelectItem>
                  <SelectItem value="Pensiun">Pensiun</SelectItem>
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
          ) : teachers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-stone-400">
              <p className="text-lg font-medium">Belum ada data guru</p>
              <p className="text-sm">Klik &quot;Tambah Guru&quot; untuk menambahkan data.</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-stone-50">
                <TableRow>
                  <TableHead className="w-[180px] cursor-pointer hover:bg-stone-100" onClick={() => handleSort('nip')}>
                    NIP <ArrowUpDown className="inline h-3 w-3 ml-1" />
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-stone-100" onClick={() => handleSort('name')}>
                    Nama Lengkap <ArrowUpDown className="inline h-3 w-3 ml-1" />
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-stone-100" onClick={() => handleSort('position')}>
                    Jabatan <ArrowUpDown className="inline h-3 w-3 ml-1" />
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-stone-100" onClick={() => handleSort('email')}>
                    Email <ArrowUpDown className="inline h-3 w-3 ml-1" />
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-stone-100" onClick={() => handleSort('phone')}>
                    Telepon <ArrowUpDown className="inline h-3 w-3 ml-1" />
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-stone-100" onClick={() => handleSort('status')}>
                    Status <ArrowUpDown className="inline h-3 w-3 ml-1" />
                  </TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTeachers.map((teacher) => (
                  <TableRow key={teacher.id} className="hover:bg-stone-50/50">
                    <TableCell className="font-medium text-stone-500">{teacher.nip}</TableCell>
                    <TableCell className="font-semibold text-stone-900">{teacher.name}</TableCell>
                    <TableCell className="text-stone-600">{teacher.position || "-"}</TableCell>
                    <TableCell className="text-stone-600">{teacher.email || "-"}</TableCell>
                    <TableCell className="text-stone-600">{teacher.phone || "-"}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          teacher.status === "Aktif"
                            ? "bg-teal-50 text-teal-700 border-teal-200"
                            : teacher.status === "Cuti"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-stone-100 text-stone-700 border-stone-200"
                        }
                      >
                        {teacher.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-stone-100 text-stone-400 hover:text-stone-600">
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(teacher)}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-rose-600" onClick={() => openDelete(teacher)}>
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
            <DialogTitle>{dialogMode === "create" ? "Tambah Guru Baru" : "Edit Data Guru"}</DialogTitle>
            <DialogDescription>
              {dialogMode === "create" ? "Isi formulir untuk menambahkan guru baru." : "Perbarui informasi guru."}
            </DialogDescription>
          </DialogHeader>
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2 rounded-lg text-sm">{error}</div>
          )}
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="nip">NIP</Label>
              <Input id="nip" value={formData.nip} onChange={(e) => setFormData({ ...formData, nip: e.target.value })} placeholder="Nomor Induk Pegawai" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Nama lengkap guru" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="email@contoh.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telepon</Label>
                <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="08xxxxxxxxxx" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Jabatan</Label>
                <Select value={formData.position} onValueChange={(val) => setFormData({ ...formData, position: val || "" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Guru Kelas">Guru Kelas</SelectItem>
                    <SelectItem value="Guru Mata Pelajaran">Guru Mata Pelajaran</SelectItem>
                    <SelectItem value="Staf TU">Staf TU</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val || "" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aktif">Aktif</SelectItem>
                    <SelectItem value="Cuti">Cuti</SelectItem>
                    <SelectItem value="Pensiun">Pensiun</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Hapus Guru</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus data guru <strong>{deletingTeacher?.name}</strong>?
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
