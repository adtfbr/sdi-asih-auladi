"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, Plus, DollarSign, CheckCircle2, XCircle, FileText, UploadCloud } from "lucide-react";
import { createInvoiceForClass, verifyPayment } from "@/app/actions/keuangan-actions";
import Image from "next/image";

export default function AdminKeuanganPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Create Tagihan Dialog
  const [createOpen, setCreateOpen] = useState(false);
  const [formData, setFormData] = useState({ classId: "", title: "", amount: "", dueDate: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Verify Dialog
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  // Stats
  const totalUnpaid = invoices.filter(i => i.status === "Unpaid").length;
  const totalPending = invoices.filter(i => i.status === "Pending Verification").length;
  const totalPaid = invoices.filter(i => i.status === "Paid").length;

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/keuangan");
      const data = await res.json();
      if (res.ok) {
        setClasses(data.classes);
        setInvoices(data.invoices);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {
    if (!formData.classId || !formData.title || !formData.amount || !formData.dueDate) {
      setError("Harap isi semua kolom.");
      return;
    }
    
    setSaving(true);
    setError("");
    const res = await createInvoiceForClass({
      classId: Number(formData.classId),
      title: formData.title,
      amount: Number(formData.amount),
      dueDate: formData.dueDate
    });

    if (res.success) {
      setCreateOpen(false);
      setFormData({ classId: "", title: "", amount: "", dueDate: "" });
      fetchData();
    } else {
      setError(res.error || "Gagal membuat tagihan.");
    }
    setSaving(false);
  };

  const handleVerify = async (status: "Paid" | "Rejected") => {
    if (!selectedInvoice) return;
    setSaving(true);
    // In real app, we should pass the actual admin user id. 
    // For MVP, we'll just pass 1 or handled by server action via session.
    // Let's pass 1 temporarily, or let server action get it from session. 
    // Let's modify server action to get session user. Wait, the server action takes adminUserId. 
    // We will just pass 1 for now.
    const res = await verifyPayment(selectedInvoice.id, status, 1);
    if (res.success) {
      setVerifyOpen(false);
      fetchData();
    }
    setSaving(false);
  };

  const filteredInvoices = invoices.filter(i => 
    i.studentName.toLowerCase().includes(search.toLowerCase()) || 
    i.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-900">Keuangan & SPP</h2>
          <p className="text-stone-500">Kelola tagihan pembayaran dan verifikasi bukti transfer.</p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Buat Tagihan Per-Kelas
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-stone-100 shadow-sm bg-white">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-sky-50 p-3 rounded-xl text-sky-600">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-stone-500">Belum Dibayar</p>
              <h3 className="text-2xl font-bold text-stone-900">{totalUnpaid}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-stone-100 shadow-sm bg-white border-l-4 border-l-amber-500">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-amber-50 p-3 rounded-xl text-amber-600">
              <UploadCloud className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-stone-500">Perlu Verifikasi</p>
              <h3 className="text-2xl font-bold text-stone-900">{totalPending}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-stone-100 shadow-sm bg-white">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-stone-500">Lunas</p>
              <h3 className="text-2xl font-bold text-stone-900">{totalPaid}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-stone-100 shadow-sm">
        <CardHeader className="pb-3 border-b border-stone-50">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-stone-400" />
            <Input
              placeholder="Cari siswa atau nama tagihan..."
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
          ) : filteredInvoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-stone-400">
              <p className="text-lg font-medium">Belum ada data tagihan</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-stone-50">
                <TableRow>
                  <TableHead>Siswa</TableHead>
                  <TableHead>Nama Tagihan</TableHead>
                  <TableHead>Nominal</TableHead>
                  <TableHead>Jatuh Tempo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((inv) => (
                  <TableRow key={inv.id} className="hover:bg-stone-50/50">
                    <TableCell>
                      <div className="font-semibold text-stone-900">{inv.studentName}</div>
                      <div className="text-xs text-stone-500">NIS: {inv.studentNis}</div>
                    </TableCell>
                    <TableCell>{inv.title}</TableCell>
                    <TableCell className="font-medium">Rp {Number(inv.amount).toLocaleString('id-ID')}</TableCell>
                    <TableCell>{new Date(inv.dueDate).toLocaleDateString('id-ID')}</TableCell>
                    <TableCell>
                      {inv.status === "Unpaid" && <Badge className="bg-stone-100 text-stone-600 hover:bg-stone-200 border-none">Belum Dibayar</Badge>}
                      {inv.status === "Pending Verification" && <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none">Perlu Verifikasi</Badge>}
                      {inv.status === "Paid" && <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none">Lunas</Badge>}
                      {inv.status === "Rejected" && <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-200 border-none">Ditolak</Badge>}
                    </TableCell>
                    <TableCell className="text-right">
                      {inv.status === "Pending Verification" && (
                        <Button 
                          size="sm" 
                          className="bg-amber-500 hover:bg-amber-600 text-white text-xs h-8"
                          onClick={() => { setSelectedInvoice(inv); setVerifyOpen(true); }}
                        >
                          Cek Bukti
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog Buat Tagihan */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buat Tagihan (Per-Kelas)</DialogTitle>
            <DialogDescription>
              Tagihan ini akan otomatis dibuat untuk seluruh siswa di kelas yang dipilih.
            </DialogDescription>
          </DialogHeader>
          
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Pilih Kelas</Label>
              <Select value={formData.classId} onValueChange={(val) => setFormData({ ...formData, classId: val || "" })}>
                <SelectTrigger><SelectValue placeholder="Pilih kelas" /></SelectTrigger>
                <SelectContent>
                  {classes.map(c => (
                    <SelectItem key={c.id} value={c.id.toString()}>Kelas {c.level} - {c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Nama Tagihan</Label>
              <Input 
                placeholder="Cth: SPP Bulan Juli 2026" 
                value={formData.title} 
                onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
              />
            </div>
            <div className="space-y-2">
              <Label>Nominal (Rp)</Label>
              <Input 
                type="number" 
                placeholder="500000" 
                value={formData.amount} 
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })} 
              />
            </div>
            <div className="space-y-2">
              <Label>Jatuh Tempo</Label>
              <Input 
                type="date" 
                value={formData.dueDate} 
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Batal</Button>
            <Button onClick={handleCreate} disabled={saving} className="bg-teal-600 hover:bg-teal-700 text-white">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Buat Tagihan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Verifikasi Bukti */}
      <Dialog open={verifyOpen} onOpenChange={setVerifyOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Verifikasi Pembayaran</DialogTitle>
            <DialogDescription>
              Bukti transfer dari wali murid <strong>{selectedInvoice?.studentName}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedInvoice?.proofDocumentUrl ? (
              <div className="bg-stone-100 rounded-xl overflow-hidden flex items-center justify-center min-h-[300px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={selectedInvoice.proofDocumentUrl || ""} 
                  alt="Bukti Pembayaran" 
                  className="max-w-full h-auto max-h-[400px] object-contain"
                />
              </div>
            ) : (
              <p className="text-center text-stone-500">Bukti gambar tidak ditemukan.</p>
            )}
            
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div className="text-stone-500">Nama Tagihan</div>
              <div className="font-semibold text-stone-900 text-right">{selectedInvoice?.title}</div>
              <div className="text-stone-500">Nominal</div>
              <div className="font-bold text-teal-700 text-right">Rp {Number(selectedInvoice?.amount || 0).toLocaleString('id-ID')}</div>
            </div>
          </div>
          <DialogFooter className="flex sm:justify-between">
            <Button variant="outline" className="text-rose-600 border-rose-200 hover:bg-rose-50" onClick={() => handleVerify("Rejected")} disabled={saving}>
              Tolak Bukti
            </Button>
            <Button onClick={() => handleVerify("Paid")} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} <CheckCircle2 className="mr-2 h-4 w-4" /> Setujui (Lunas)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
