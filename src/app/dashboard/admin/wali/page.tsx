"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Search, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createParentWithAccount } from "@/app/actions/user-actions";

export default function DataWaliPage() {
  const [walis, setWalis] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", address: "", studentId: ""
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [resWali, resSiswa] = await Promise.all([
        fetch(`/api/wali`),
        fetch(`/api/siswa`)
      ]);
      const dataWali = await resWali.json();
      const dataSiswa = await resSiswa.json();
      
      setWalis(Array.isArray(dataWali) ? dataWali : []);
      setStudents(Array.isArray(dataSiswa) ? dataSiswa : []);
    } catch {
      setWalis([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openCreate = () => {
    setFormData({ name: "", email: "", phone: "", address: "", studentId: "" });
    setError("");
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email || !formData.studentId) {
      setError("Nama, Email, dan Anak harus diisi.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const res = await createParentWithAccount({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        studentId: Number(formData.studentId),
      });

      if (!res.success) {
        throw new Error(res.error || "Gagal membuat akun wali.");
      }

      setDialogOpen(false);
      fetchData();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setSaving(false);
    }
  };

  const filteredWalis = walis.filter(w => 
    w.name.toLowerCase().includes(search.toLowerCase()) || 
    (w.studentName && w.studentName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-900">Data Wali Murid</h2>
          <p className="text-stone-500">Kelola akun wali murid dan tautan dengan data siswa.</p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Wali Murid
        </Button>
      </div>

      <Card className="border-stone-100 shadow-sm">
        <CardHeader className="pb-3 border-b border-stone-50">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-stone-400" />
            <Input
              placeholder="Cari nama wali atau siswa..."
              className="pl-9 bg-stone-50 border-stone-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-48 text-stone-400">
              <Loader2 className="h-6 w-6 animate-spin mr-2" /> Memuat data...
            </div>
          ) : filteredWalis.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-stone-400">
              <p className="text-lg font-medium">Belum ada data wali murid</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-stone-50">
                <TableRow>
                  <TableHead>Nama Wali</TableHead>
                  <TableHead>Email Login</TableHead>
                  <TableHead>No. HP</TableHead>
                  <TableHead>Anak (Siswa)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWalis.map((wali) => (
                  <TableRow key={wali.id} className="hover:bg-stone-50/50">
                    <TableCell className="font-semibold text-stone-900">{wali.name}</TableCell>
                    <TableCell>{wali.email}</TableCell>
                    <TableCell>{wali.phone || "-"}</TableCell>
                    <TableCell>
                      {wali.studentName} <span className="text-stone-400 text-xs">({wali.studentNis})</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Wali Murid</DialogTitle>
            <DialogDescription>
              Akun otomatis dibuat. Password default adalah <strong>orangtua[NIS]</strong> anak.
            </DialogDescription>
          </DialogHeader>
          
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label>Hubungkan dengan Siswa (Anak)</Label>
              <Select value={formData.studentId} onValueChange={(val) => setFormData({ ...formData, studentId: val || "" })}>
                <SelectTrigger><SelectValue placeholder="Pilih Siswa" /></SelectTrigger>
                <SelectContent>
                  {students.map((s) => (
                    <SelectItem key={s.id} value={s.id.toString()}>{s.name} (NIS: {s.nis})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Nama Wali</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Nama lengkap wali" />
            </div>
            <div className="space-y-2">
              <Label>Email (Untuk Login)</Label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="contoh@email.com" />
            </div>
            <div className="space-y-2">
              <Label>Nomor HP / WhatsApp</Label>
              <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="0812xxx" />
            </div>
            <div className="space-y-2">
              <Label>Alamat</Label>
              <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Alamat rumah" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan & Buat Akun
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
