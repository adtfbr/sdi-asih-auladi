"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TahunAjaran {
  id: number;
  name: string;
  semester: string;
  isActive: boolean;
}

const emptyForm = {
  name: "",
  semester: "Ganjil",
  isActive: false,
};

export default function AdminTahunAjaranPage() {
  const [tahunList, setTahunList] = useState<TahunAjaran[]>([]);
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
  const [deletingTahun, setDeletingTahun] = useState<TahunAjaran | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tahun-ajaran");
      const data = await res.json();
      setTahunList(Array.isArray(data) ? data : []);
    } catch {
      setTahunList([]);
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

  const openEdit = (tahun: TahunAjaran) => {
    setFormData({
      name: tahun.name,
      semester: tahun.semester,
      isActive: tahun.isActive,
    });
    setDialogMode("edit");
    setEditingId(tahun.id);
    setError("");
    setDialogOpen(true);
  };

  const openDelete = (tahun: TahunAjaran) => {
    setDeletingTahun(tahun);
    setDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const url = dialogMode === "create" ? "/api/tahun-ajaran" : `/api/tahun-ajaran/${editingId}`;
      const method = dialogMode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
    if (!deletingTahun) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/tahun-ajaran/${deletingTahun.id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal menghapus data");
      }
      setDeleteDialogOpen(false);
      setDeletingTahun(null);
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
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Tahun Ajaran</h2>
          <p className="text-slate-500">Kelola daftar tahun ajaran dan semester akademik.</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Tahun Ajaran
        </Button>
      </div>

      <Card className="border-slate-100 shadow-sm">
        <CardContent className="p-0">
          {loading ? (
             <div className="flex items-center justify-center h-48 text-slate-400">
               <Loader2 className="h-6 w-6 animate-spin mr-2" /> Memuat data...
             </div>
          ) : tahunList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400">
              <p className="text-lg font-medium">Belum ada data tahun ajaran</p>
              <p className="text-sm">Klik "Tambah Tahun Ajaran" untuk menambahkan data.</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Tahun Ajaran</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tahunList.map((t) => (
                  <TableRow key={t.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-medium text-slate-900">{t.name}</TableCell>
                    <TableCell className="text-slate-600">{t.semester}</TableCell>
                    <TableCell>
                      {t.isActive ? (
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50">Aktif</Badge>
                      ) : (
                        <Badge variant="outline" className="text-slate-500">Nonaktif</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-50" onClick={() => openEdit(t)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-rose-600 hover:bg-rose-50" onClick={() => openDelete(t)}>
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
            <DialogTitle>{dialogMode === "create" ? "Tambah Tahun Ajaran" : "Edit Tahun Ajaran"}</DialogTitle>
            <DialogDescription>Isi formulir untuk menyimpan tahun ajaran baru.</DialogDescription>
          </DialogHeader>
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label>Nama Tahun Ajaran</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Contoh: 2024/2025" />
            </div>
            <div className="space-y-2">
              <Label>Semester</Label>
              <Select value={formData.semester} onValueChange={(val) => setFormData({ ...formData, semester: val || "" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ganjil">Ganjil</SelectItem>
                  <SelectItem value="Genap">Genap</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between p-3 border border-slate-100 rounded-lg">
              <div className="space-y-0.5">
                <Label>Status Aktif</Label>
                <p className="text-sm text-slate-500">Jadikan sebagai tahun ajaran berjalan.</p>
              </div>
              <input type="checkbox" className="w-5 h-5 accent-emerald-600" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleSave} disabled={saving}>
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
            <DialogTitle>Hapus Tahun Ajaran</DialogTitle>
            <DialogDescription>
              Yakin ingin menghapus <strong>{deletingTahun?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
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
