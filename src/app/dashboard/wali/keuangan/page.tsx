"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, DollarSign, UploadCloud, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { uploadPaymentProof } from "@/app/actions/keuangan-actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function WaliKeuanganPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Upload Dialog
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [proofImage, setProofImage] = useState<string>("");
  const [saving, setSaving] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/wali/keuangan");
      const data = await res.json();
      if (res.ok) {
        setStudents(data.students);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedInvoice || !proofImage) return;
    
    setSaving(true);
    const res = await uploadPaymentProof(selectedInvoice.id, proofImage);
    if (res.success) {
      setUploadOpen(false);
      setProofImage("");
      fetchData();
    }
    setSaving(false);
  };

  const openUploadDialog = (inv: any) => {
    setSelectedInvoice(inv);
    setProofImage("");
    setUploadOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)] text-stone-400">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)] text-stone-400">
        <p>Data siswa tidak ditemukan atau belum terhubung.</p>
      </div>
    );
  }

  // Pisahkan tagihan Unpaid + Pending vs Paid
  const activeInvoices = invoices.filter(i => i.status === "Unpaid" || i.status === "Pending Verification" || i.status === "Rejected");
  const paidInvoices = invoices.filter(i => i.status === "Paid");

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-stone-900">Tagihan & SPP</h2>
        <p className="text-stone-500">Lihat tagihan berjalan dan riwayat pembayaran ananda.</p>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg text-stone-800">Tagihan Belum Lunas</h3>
        {activeInvoices.length === 0 ? (
          <Card className="border-stone-100 shadow-sm bg-stone-50/50">
            <CardContent className="p-8 text-center text-stone-500 flex flex-col items-center">
              <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-3 opacity-20" />
              <p>Alhamdulillah, tidak ada tagihan yang belum dibayar.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeInvoices.map((inv) => (
              <Card key={inv.id} className="border-stone-200 shadow-sm overflow-hidden flex flex-col">
                <CardHeader className={`p-4 border-b border-stone-100 ${
                  inv.status === "Pending Verification" ? "bg-amber-50/50" : 
                  inv.status === "Rejected" ? "bg-rose-50/50" : "bg-stone-50/50"
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={
                      inv.status === "Unpaid" ? "bg-stone-500" :
                      inv.status === "Pending Verification" ? "bg-amber-500" : "bg-rose-500"
                    }>
                      {inv.status === "Unpaid" ? "Belum Dibayar" : 
                       inv.status === "Pending Verification" ? "Menunggu Verifikasi" : "Ditolak"}
                    </Badge>
                    <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">{inv.studentName}</span>
                  </div>
                  <h3 className="font-bold text-lg text-stone-900 leading-tight">{inv.title}</h3>
                </CardHeader>
                <CardContent className="p-5 flex-1 space-y-4">
                  <div>
                    <p className="text-sm text-stone-500 mb-1">Total Tagihan</p>
                    <div className="text-3xl font-bold text-teal-700">Rp {Number(inv.amount).toLocaleString('id-ID')}</div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-rose-600 bg-rose-50 p-2 rounded-lg">
                    <AlertCircle className="h-4 w-4" />
                    <span>Jatuh Tempo: <strong>{new Date(inv.dueDate).toLocaleDateString('id-ID')}</strong></span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 border-t border-stone-100 bg-white">
                  {inv.status === "Pending Verification" ? (
                    <Button variant="outline" className="w-full text-amber-600 border-amber-200 bg-amber-50 hover:bg-amber-100 pointer-events-none">
                      <Clock className="mr-2 h-4 w-4" /> Sedang Diproses Admin
                    </Button>
                  ) : (
                    <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white" onClick={() => openUploadDialog(inv)}>
                      <UploadCloud className="mr-2 h-4 w-4" /> Upload Bukti Bayar
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4 pt-4 border-t border-stone-100">
        <h3 className="font-semibold text-lg text-stone-800">Riwayat Pembayaran (Lunas)</h3>
        {paidInvoices.length === 0 ? (
          <p className="text-sm text-stone-500 italic">Belum ada riwayat pembayaran.</p>
        ) : (
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
            <div className="divide-y divide-stone-100">
              {paidInvoices.map((inv) => (
                <div key={inv.id} className="p-4 flex items-center justify-between hover:bg-stone-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-emerald-100 p-3 rounded-full text-emerald-600 hidden sm:block">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900">{inv.title}</h4>
                      <p className="text-sm text-stone-500">{inv.studentName} • Dibayar pada {new Date(inv.updatedAt).toLocaleDateString('id-ID')}</p>
                    </div>
                  </div>
                  <div className="font-bold text-emerald-700">
                    Rp {Number(inv.amount).toLocaleString('id-ID')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dialog Upload Bukti */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Bukti Pembayaran</DialogTitle>
            <DialogDescription>
              Silakan unggah foto struk transfer atau _screenshot m-banking_ untuk tagihan <strong>{selectedInvoice?.title}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-stone-50 p-4 rounded-lg border border-stone-200 text-center space-y-1">
              <p className="text-sm text-stone-500">Nominal yang harus ditransfer:</p>
              <p className="text-2xl font-bold text-teal-700">Rp {Number(selectedInvoice?.amount || 0).toLocaleString('id-ID')}</p>
              <p className="text-xs text-stone-400 mt-2">Rek. BSI: 1234567890 a.n. SDI Asih Auladi</p>
            </div>
            
            <div className="space-y-2">
              <Label>File Bukti Transfer (Gambar)</Label>
              <Input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef}
                onChange={handleFileChange}
                className="cursor-pointer"
              />
            </div>

            {proofImage && (
              <div className="mt-4 border border-stone-200 rounded-lg overflow-hidden h-48 flex items-center justify-center bg-stone-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={proofImage} alt="Preview Bukti" className="max-h-full max-w-full object-contain" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadOpen(false)}>Batal</Button>
            <Button onClick={handleUpload} disabled={saving || !proofImage} className="bg-teal-600 hover:bg-teal-700 text-white">
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
              Upload & Ajukan Verifikasi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
