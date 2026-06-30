"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";

interface Mapel {
  id: number;
  name: string;
  code: string;
}

const emptyForm = {
  name: "",
  code: "",
};

export default function AdminMapelPage() {
  const [mapelList, setMapelList] = useState<Mapel[]>([]);
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
  const [deletingMapel, setDeletingMapel] = useState<Mapel | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/mapel");
      const data = await res.json();
      setMapelList(Array.isArray(data) ? data : []);
    } catch {
      setMapelList([]);
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

  const openEdit = (mapel: Mapel) => {
    setFormData({
      name: mapel.name,
      code: mapel.code,
    });
    setDialogMode("edit");
    setEditingId(mapel.id);
    setError("");
    setDialogOpen(true);
  };

  const openDelete = (mapel: Mapel) => {
    setDeletingMapel(mapel);
    setDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const url = dialogMode === "create" ? "/api/mapel" : `/api/mapel/${editingId}`;
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
    if (!deletingMapel) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/mapel/${deletingMapel.id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal menghapus data");
      }
      setDeleteDialogOpen(false);
      setDeletingMapel(null);
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
          <h2 className="text-2xl font-bold tracking-tight text-stone-900">Mata Pelajaran</h2>
          <p className="text-stone-500">Kelola daftar mata pelajaran sekolah.</p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Mapel
        </Button>
      </div>

      <Card className="border-stone-100 shadow-sm">
        <CardContent className="p-0">
          {loading ? (
             <div className="flex items-center justify-center h-48 text-stone-400">
               <Loader2 className="h-6 w-6 animate-spin mr-2" /> Memuat data...
             </div>
          ) : mapelList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-stone-400">
              <p className="text-lg font-medium">Belum ada data mata pelajaran</p>
              <p className="text-sm">Klik "Tambah Mapel" untuk menambahkan data.</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-stone-50">
                <TableRow>
                  <TableHead className="w-[150px]">Kode</TableHead>
                  <TableHead>Nama Mata Pelajaran</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mapelList.map((m) => (
                  <TableRow key={m.id} className="hover:bg-stone-50/50">
                    <TableCell className="font-medium text-stone-900">{m.code}</TableCell>
                    <TableCell className="text-stone-600">{m.name}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="text-sky-600 hover:bg-sky-50" onClick={() => openEdit(m)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-rose-600 hover:bg-rose-50" onClick={() => openDelete(m)}>
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
            <DialogTitle>{dialogMode === "create" ? "Tambah Mapel Baru" : "Edit Mata Pelajaran"}</DialogTitle>
            <DialogDescription>Isi formulir untuk menyimpan data mata pelajaran.</DialogDescription>
          </DialogHeader>
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label>Kode Mata Pelajaran</Label>
              <Input value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} placeholder="Contoh: MP001" />
            </div>
            <div className="space-y-2">
              <Label>Nama Mata Pelajaran</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Contoh: Matematika" />
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
            <DialogTitle>Hapus Mapel</DialogTitle>
            <DialogDescription>
              Yakin ingin menghapus <strong>{deletingMapel?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
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
