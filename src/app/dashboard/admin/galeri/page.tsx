"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Edit, Trash2, Image as ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
}

export default function AdminGaleriPage() {
  const [galleryList, setGalleryList] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [currentItem, setCurrentItem] = useState<Partial<GalleryItem> | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/galeri");
      const data = await res.json();
      setGalleryList(Array.isArray(data) ? data : []);
    } catch {
      setGalleryList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleOpenDialog = (item?: GalleryItem) => {
    setError("");
    setFileToUpload(null);
    if (item) {
      setCurrentItem(item);
    } else {
      setCurrentItem({ title: "", description: "" });
    }
    setIsDialogOpen(true);
  };

  const handleOpenDelete = (item: GalleryItem) => {
    setCurrentItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    if (!currentItem?.title) {
      setError("Judul wajib diisi.");
      return;
    }
    if (!currentItem?.id && !fileToUpload && !currentItem?.imageUrl) {
      setError("Gambar wajib diunggah untuk foto baru.");
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
      const url = currentItem.id ? `/api/galeri/${currentItem.id}` : "/api/galeri";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Gagal menyimpan foto");

      setIsDialogOpen(false);
      fetchGallery();
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
      const res = await fetch(`/api/galeri/${currentItem.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus foto");
      setIsDeleteDialogOpen(false);
      fetchGallery();
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
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Kelola Galeri Foto</h2>
          <p className="text-slate-500">Tambahkan foto kegiatan sekolah untuk ditampilkan di halaman depan.</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Foto
        </Button>
      </div>

      <Card className="border-slate-100 shadow-sm">
        <CardContent className="p-6">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            </div>
          ) : galleryList.length === 0 ? (
            <div className="text-center text-slate-500 py-8">Belum ada foto galeri.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {galleryList.map((item) => (
                <div key={item.id} className="relative group rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-slate-100 flex items-center justify-center overflow-hidden">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.imageUrl} alt={item.title} className="object-cover w-full h-full" />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-slate-300" />
                    )}
                  </div>
                  <div className="p-4">
                    <div className="font-semibold text-slate-900 truncate" title={item.title}>{item.title}</div>
                    <div className="text-sm text-slate-500 truncate mt-1" title={item.description}>{item.description || "Tidak ada deskripsi"}</div>
                  </div>
                  {/* Action Overlay */}
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="secondary" size="icon" className="h-8 w-8 bg-white/90 hover:bg-white shadow-sm text-blue-600" onClick={() => handleOpenDialog(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" className="h-8 w-8 shadow-sm" onClick={() => handleOpenDelete(item)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog Form Galeri */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{currentItem?.id ? "Edit Foto Galeri" : "Tambah Foto Baru"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {error && <div className="bg-rose-50 text-rose-600 p-3 rounded-md text-sm">{error}</div>}
            
            <div className="space-y-2">
              <Label>Judul Foto</Label>
              <Input value={currentItem?.title || ""} onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value } as any)} placeholder="Contoh: Kegiatan Pramuka" />
            </div>

            <div className="space-y-2">
              <Label>Deskripsi Singkat</Label>
              <Textarea value={currentItem?.description || ""} onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value } as any)} placeholder="Opsional..." rows={3} />
            </div>

            <div className="space-y-2">
              <Label>Unggah Gambar</Label>
              <Input type="file" accept="image/*" onChange={(e) => setFileToUpload(e.target.files?.[0] || null)} />
              {currentItem?.imageUrl && !fileToUpload && (
                <p className="text-xs text-slate-500 mt-1">Gambar saat ini: <a href={currentItem.imageUrl} target="_blank" className="text-blue-600 hover:underline">Lihat Gambar</a></p>
              )}
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

      {/* Dialog Delete Galeri */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Hapus Foto</DialogTitle>
            <DialogDescription>
              Yakin ingin menghapus foto <strong>{currentItem?.title}</strong> dari galeri? Tindakan ini tidak dapat dibatalkan.
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
