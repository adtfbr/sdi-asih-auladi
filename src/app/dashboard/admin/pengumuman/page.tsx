"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Plus, Trash2, Edit2, Clock, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Announcement {
  id: number;
  title: string;
  content: string;
  targetRole: string;
  createdAt: string;
}

const emptyForm = {
  title: "",
  content: "",
  targetRole: "semua",
};

export default function AdminPengumumanPage() {
  const [data, setData] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<Announcement | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/pengumuman");
      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
    } catch {
      setData([]);
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
    setIsDialogOpen(true);
  };

  const openEdit = (item: Announcement) => {
    setFormData({
      title: item.title,
      content: item.content,
      targetRole: item.targetRole,
    });
    setDialogMode("edit");
    setEditingId(item.id);
    setError("");
    setIsDialogOpen(true);
  };

  const openDelete = (item: Announcement) => {
    setDeletingItem(item);
    setDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.content) {
      setError("Judul dan Isi Pengumuman wajib diisi.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const url = dialogMode === "create" ? "/api/pengumuman" : `/api/pengumuman/${editingId}`;
      const method = dialogMode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Gagal menyimpan data");

      setIsDialogOpen(false);
      fetchData();
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/pengumuman/${deletingItem.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus data");
      setDeleteDialogOpen(false);
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
          <h2 className="text-2xl font-bold tracking-tight text-stone-900">Manajemen Pengumuman</h2>
          <p className="text-stone-500">Kelola informasi broadcast untuk guru, siswa, dan wali murid.</p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Buat Pengumuman Baru
        </Button>
      </div>

      <Card className="border-stone-100 shadow-sm">
        <CardHeader className="bg-stone-50/50 border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-teal-600" />
            <CardTitle className="text-lg text-stone-900">Daftar Pengumuman</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
             <div className="flex items-center justify-center h-48 text-stone-400">
               <Loader2 className="h-6 w-6 animate-spin mr-2" /> Memuat data...
             </div>
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-stone-400">
              <Megaphone className="h-10 w-10 mb-3 text-stone-300" />
              <p className="text-lg font-medium">Belum ada pengumuman</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-stone-50">
                <TableRow>
                  <TableHead>Judul</TableHead>
                  <TableHead>Target Penerima</TableHead>
                  <TableHead>Tanggal Dibuat</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item.id} className="hover:bg-stone-50/50">
                    <TableCell className="font-medium text-stone-900 max-w-[300px] truncate">{item.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        item.targetRole === "semua" ? "bg-stone-100 text-stone-800" :
                        item.targetRole === "guru" ? "bg-sky-50 text-sky-800 border-sky-200" :
                        item.targetRole === "wali" ? "bg-purple-50 text-purple-800 border-purple-200" :
                        "bg-teal-50 text-teal-800 border-teal-200"
                      }>
                        {item.targetRole}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-stone-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3" /> 
                        {new Date(item.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-sky-600 hover:bg-sky-50" onClick={() => openEdit(item)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-rose-600 hover:bg-rose-50" onClick={() => openDelete(item)}>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{dialogMode === "create" ? "Buat Pengumuman Baru" : "Edit Pengumuman"}</DialogTitle>
            <DialogDescription>
              Pengumuman ini akan muncul di dashboard target penerima yang dipilih.
            </DialogDescription>
          </DialogHeader>
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Judul Pengumuman</Label>
              <Input id="title" placeholder="Masukkan judul..." value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target">Target Penerima</Label>
              <Select value={formData.targetRole} onValueChange={(val) => setFormData({...formData, targetRole: val || "semua"})}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih target" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua Pengguna</SelectItem>
                  <SelectItem value="guru">Hanya Guru</SelectItem>
                  <SelectItem value="siswa">Hanya Siswa</SelectItem>
                  <SelectItem value="wali">Hanya Wali Murid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Isi Pengumuman</Label>
              <Textarea id="content" placeholder="Tuliskan isi pengumuman..." className="min-h-[120px]" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Kirim Pengumuman
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Hapus Pengumuman</DialogTitle>
            <DialogDescription>
              Yakin ingin menghapus <strong>{deletingItem?.title}</strong>? Tindakan ini tidak dapat dibatalkan.
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
