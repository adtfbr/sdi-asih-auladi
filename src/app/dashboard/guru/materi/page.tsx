"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UploadCloud, FileText, Video, Trash2, Link, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface ClassOption { id: number; name: string; }
interface SubjectOption { id: number; name: string; }
interface TeacherOption { id: number; name: string; }

interface Material {
  id: number;
  title: string;
  description: string;
  fileUrl: string;
  className: string;
  subjectName: string;
  createdAt: string;
}

export default function UploadMateriPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [session, setSession] = useState<{teacherId?: number} | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    classId: "",
    subjectId: "",
  });
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<Material | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setSession(data);
      })
      .catch(() => {});
  }, []);

  const fetchMetadata = useCallback(async () => {
    try {
      const [resClass, resSubj] = await Promise.all([
        fetch("/api/kelas"),
        fetch("/api/mapel"),
      ]);
      setClasses(await resClass.json());
      setSubjects(await resSubj.json());
    } catch {
      // ignore
    }
  }, []);

  const fetchMaterials = useCallback(async () => {
    if (!session?.teacherId) return;
    setLoading(true);
    try {
      const resMat = await fetch(`/api/materi?teacherId=${session.teacherId}`);
      setMaterials(await resMat.json());
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [session?.teacherId]);

  useEffect(() => {
    fetchMetadata();
  }, [fetchMetadata]);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  const handleSave = async () => {
    if (!formData.title || !fileToUpload || !formData.subjectId || !session?.teacherId) {
      setError("Judul, File, Mata Pelajaran, dan Guru wajib diisi.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      // 1. Upload the file first
      const uploadFormData = new FormData();
      uploadFormData.append("file", fileToUpload);
      
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });
      
      if (!uploadRes.ok) {
        throw new Error("Gagal mengunggah file");
      }
      
      const uploadData = await uploadRes.json();
      const uploadedFileUrl = uploadData.fileUrl;
      const payload = {
        title: formData.title,
        description: formData.description,
        fileUrl: uploadData.fileUrl,
        classId: formData.classId ? parseInt(formData.classId) : null,
        subjectId: parseInt(formData.subjectId),
        teacherId: session.teacherId
      };

      const res = await fetch("/api/materi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error("Gagal menyimpan data");
      
      setFormData({
        title: "",
        description: "",
        classId: "",
        subjectId: "",
      });
      setFileToUpload(null);
      fetchMaterials();
      const fileInput = document.getElementById('materi-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const openDelete = (item: Material) => {
    setDeletingItem(item);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/materi/${deletingItem.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus data");
      setDeleteDialogOpen(false);
      setDeletingItem(null);
      fetchMaterials();
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setDeleting(false);
    }
  };

  // Determine icon based on URL
  const getIcon = (url: string) => {
    if (url.includes('youtube') || url.includes('youtu.be') || url.endsWith('.mp4')) return <Video className="h-5 w-5" />;
    return <FileText className="h-5 w-5" />;
  };
  const getIconBg = (url: string) => {
    if (url.includes('youtube') || url.includes('youtu.be') || url.endsWith('.mp4')) return 'bg-indigo-100 text-indigo-600';
    return 'bg-rose-100 text-rose-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Upload Materi Pembelajaran</h2>
          <p className="text-slate-500">Bagikan modul, presentasi, atau video pembelajaran kepada siswa.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-100 shadow-sm bg-white">
            <CardHeader className="border-b border-slate-50 pb-4">
              <CardTitle className="text-lg">Form Upload Baru</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Pilih Kelas (Opsional)</Label>
                  <Select value={formData.classId} onValueChange={(val) => setFormData({...formData, classId: val === "all" ? "" : (val || "")})}>
                    <SelectTrigger className="bg-slate-50 border-slate-200">
                      <SelectValue placeholder="Semua Kelas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kelas</SelectItem>
                      {classes.map((c) => (
                        <SelectItem key={c.id} value={c.id.toString()}>Kelas {c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-[11px] text-slate-500">Kosongkan jika materi berlaku untuk semua kelas yang Anda ajar.</p>
                </div>
                <div className="space-y-2">
                  <Label>Mata Pelajaran <span className="text-rose-500">*</span></Label>
                  <Select value={formData.subjectId} onValueChange={(val) => setFormData({...formData, subjectId: val || ""})}>
                    <SelectTrigger className="bg-slate-50 border-slate-200">
                      <SelectValue placeholder="Pilih Mata Pelajaran" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((s) => (
                        <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="judul">Judul Materi <span className="text-rose-500">*</span></Label>
                <Input id="judul" placeholder="Contoh: Modul 2 - Ekosistem" className="bg-slate-50 border-slate-200" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deskripsi">Deskripsi Singkat (Opsional)</Label>
                <Textarea id="deskripsi" placeholder="Tuliskan instruksi atau ringkasan materi..." className="bg-slate-50 border-slate-200 min-h-[100px]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>

              <div className="space-y-2">
                <Label>File Materi (PDF/Doc/Video)</Label>
                <Input 
                  id="materi-file"
                  type="file" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFileToUpload(e.target.files[0]);
                    }
                  }} 
                  required
                />
                <p className="text-xs text-slate-500">Pilih file materi yang ingin dibagikan.</p>
              </div>

              <div className="flex justify-end pt-4">
                <Button className="bg-emerald-600 hover:bg-emerald-700 h-12 px-8 text-white rounded-full" onClick={handleSave} disabled={saving}>
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                  {saving ? "Menyimpan..." : "Upload Materi"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: Recent Uploads */}
        <div className="space-y-6">
          <Card className="border-slate-100 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-50">
              <CardTitle className="text-lg">Riwayat Upload Terakhir</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 p-0">
              {loading ? (
                <div className="p-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-slate-300" /></div>
              ) : materials.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm">Belum ada materi.</div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {materials.map((file) => (
                    <div key={file.id} className="p-4 hover:bg-slate-50/80 transition-colors flex items-start gap-4">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${getIconBg(file.fileUrl)}`}>
                        {getIcon(file.fileUrl)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-slate-900 line-clamp-1" title={file.title}>{file.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">{file.subjectName} • {file.className || 'Semua Kelas'}</p>
                        <div className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-2">
                          <span>{new Date(file.createdAt).toLocaleDateString('id-ID')}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 shrink-0" onClick={() => openDelete(file)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Hapus Materi</DialogTitle>
            <DialogDescription>
              Yakin ingin menghapus materi <strong>{deletingItem?.title}</strong>?
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
