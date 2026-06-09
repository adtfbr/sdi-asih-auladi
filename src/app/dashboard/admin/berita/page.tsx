"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Edit, Trash2, Image as ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface NewsItem {
  id: number;
  title: string;
  slug: string;
  content: string;
  imageUrl: string | null;
  status: string;
  createdAt: string;
}

export default function AdminBeritaPage() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [currentItem, setCurrentItem] = useState<Partial<NewsItem> | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/berita");
      const data = await res.json();
      setNewsList(Array.isArray(data) ? data : []);
    } catch {
      setNewsList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleOpenDialog = (item?: NewsItem) => {
    setError("");
    setFileToUpload(null);
    if (item) {
      setCurrentItem(item);
    } else {
      setCurrentItem({ title: "", content: "", status: "draft" });
    }
    setIsDialogOpen(true);
  };

  const handleOpenDelete = (item: NewsItem) => {
    setCurrentItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    if (!currentItem?.title || !currentItem?.content) {
      setError("Judul dan Konten wajib diisi.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      let imageUrl = currentItem.imageUrl;

      // Upload file if selected
      if (fileToUpload) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", fileToUpload);
        
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });
        
        if (!uploadRes.ok) throw new Error("Gagal mengunggah gambar");
        
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      }

      const payload = {
        ...currentItem,
        imageUrl
      };

      const method = currentItem.id ? "PUT" : "POST";
      const url = currentItem.id ? `/api/berita/${currentItem.id}` : "/api/berita";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Gagal menyimpan berita");

      setIsDialogOpen(false);
      fetchNews();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!currentItem?.id) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/berita/${currentItem.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus berita");
      setIsDeleteDialogOpen(false);
      fetchNews();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Kelola Berita</h2>
          <p className="text-slate-500">Tambahkan dan atur berita atau artikel untuk website.</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Berita
        </Button>
      </div>

      <Card className="border-slate-100 shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-slate-300" /></div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-[80px]">Gambar</TableHead>
                  <TableHead>Judul</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {newsList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-slate-500 py-8">Belum ada berita.</TableCell>
                  </TableRow>
                ) : (
                  newsList.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {item.imageUrl ? (
                          <div className="w-12 h-12 rounded bg-slate-100 overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.imageUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded bg-slate-100 flex items-center justify-center text-slate-400">
                            <ImageIcon className="h-5 w-5" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium text-slate-900">{item.title}</TableCell>
                      <TableCell>
                        <Badge className={item.status === 'published' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none' : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border-none'}>
                          {item.status === 'published' ? 'Dipublikasi' : 'Draft'}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(item.createdAt).toLocaleDateString("id-ID")}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(item)} className="text-slate-500 hover:text-blue-600">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleOpenDelete(item)} className="text-slate-500 hover:text-rose-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog Form Berita */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentItem?.id ? "Edit Berita" : "Tambah Berita Baru"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {error && <div className="bg-rose-50 text-rose-600 p-3 rounded-md text-sm">{error}</div>}
            
            <div className="space-y-2">
              <Label>Judul Berita</Label>
              <Input value={currentItem?.title || ""} onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value } as any)} placeholder="Masukkan judul..." />
            </div>

            <div className="space-y-2">
              <Label>Isi Berita</Label>
              <Textarea value={currentItem?.content || ""} onChange={(e) => setCurrentItem({ ...currentItem, content: e.target.value } as any)} placeholder="Tulis konten di sini..." className="min-h-[150px]" />
            </div>

            <div className="space-y-2">
              <Label>Gambar Thumbnail</Label>
              <Input type="file" accept="image/*" onChange={(e) => setFileToUpload(e.target.files?.[0] || null)} />
              {currentItem?.imageUrl && !fileToUpload && (
                <p className="text-xs text-slate-500 mt-1">Gambar saat ini: <a href={currentItem.imageUrl || undefined} target="_blank" className="text-blue-600 hover:underline">Lihat Gambar</a></p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={currentItem?.status || "draft"} onValueChange={(val) => setCurrentItem({ ...currentItem, status: val } as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft (Disembunyikan)</SelectItem>
                  <SelectItem value="published">Publikasi (Ditampilkan)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Delete Berita */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Hapus Berita</DialogTitle>
            <DialogDescription>
              Yakin ingin menghapus berita <strong>{currentItem?.title}</strong>? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
