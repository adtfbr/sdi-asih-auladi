"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

interface PPDBApplication {
  id: number;
  registrationNumber: string;
  studentName: string;
  previousSchool: string;
  parentName: string;
  phone: string;
  status: "Pending" | "Reviewed" | "Accepted" | "Rejected";
  createdAt: string;
}

export default function AdminPPDBPage() {
  const [applications, setApplications] = useState<PPDBApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("semua");
  
  const [selectedApp, setSelectedApp] = useState<PPDBApplication | null>(null);
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<"Accepted" | "Rejected" | "Reviewed">("Reviewed");
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const url = new URL("/api/ppdb", window.location.origin);
      if (search) url.searchParams.set("q", search);
      if (statusFilter && statusFilter !== "semua") url.searchParams.set("status", statusFilter);
      
      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setApplications(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [search, statusFilter]);

  const handleVerify = async () => {
    if (!selectedApp) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/ppdb/${selectedApp.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: verifyStatus })
      });
      if (res.ok) {
        setIsVerifyDialogOpen(false);
        fetchApplications();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const openVerifyDialog = (app: PPDBApplication) => {
    setSelectedApp(app);
    setVerifyStatus(app.status !== "Pending" ? app.status : "Reviewed");
    setIsVerifyDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Accepted":
        return <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-200 border-none"><CheckCircle2 className="w-3 h-3 mr-1"/> Diterima</Badge>;
      case "Rejected":
        return <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-200 border-none"><XCircle className="w-3 h-3 mr-1"/> Ditolak</Badge>;
      case "Reviewed":
        return <Badge className="bg-sky-100 text-sky-800 hover:bg-sky-200 border-none"><Search className="w-3 h-3 mr-1"/> Direview</Badge>;
      default:
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-none"><Clock className="w-3 h-3 mr-1"/> Menunggu</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-stone-900">Verifikasi PPDB</h2>
        <p className="text-stone-500">Kelola dan verifikasi pendaftaran calon siswa baru.</p>
      </div>

      <Card className="border-stone-100 shadow-sm">
        <CardHeader className="bg-stone-50/50 border-b border-stone-100 pb-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex items-center gap-2 max-w-sm w-full">
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-stone-400" />
                <Input
                  placeholder="Cari nama calon siswa..."
                  className="pl-9 bg-white"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "semua")}>
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua Status</SelectItem>
                  <SelectItem value="Pending">Menunggu</SelectItem>
                  <SelectItem value="Reviewed">Direview</SelectItem>
                  <SelectItem value="Accepted">Diterima</SelectItem>
                  <SelectItem value="Rejected">Ditolak</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-stone-50">
              <TableRow>
                <TableHead>No. Daftar</TableHead>
                <TableHead>Nama Siswa</TableHead>
                <TableHead>Asal Sekolah</TableHead>
                <TableHead>Nama Orang Tua</TableHead>
                <TableHead>Kontak</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-teal-600 mb-2" />
                    <p className="text-sm text-stone-500">Memuat data...</p>
                  </TableCell>
                </TableRow>
              ) : applications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-stone-500">
                    Tidak ada data pendaftar yang ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium text-stone-700">{app.registrationNumber}</TableCell>
                    <TableCell className="font-bold text-stone-900">{app.studentName}</TableCell>
                    <TableCell>{app.previousSchool || "-"}</TableCell>
                    <TableCell>{app.parentName}</TableCell>
                    <TableCell>{app.phone}</TableCell>
                    <TableCell>{getStatusBadge(app.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-teal-200 text-teal-700 hover:bg-teal-50"
                        onClick={() => openVerifyDialog(app)}
                      >
                        Verifikasi
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isVerifyDialogOpen} onOpenChange={setIsVerifyDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Verifikasi Pendaftaran</DialogTitle>
            <DialogDescription>
              Ubah status pendaftaran untuk <strong>{selectedApp?.studentName}</strong> ({selectedApp?.registrationNumber}).
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="col-span-4 text-sm font-medium">Status Pendaftaran</label>
              <Select value={verifyStatus} onValueChange={(v: any) => setVerifyStatus(v)}>
                <SelectTrigger className="col-span-4">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Reviewed">Direview</SelectItem>
                  <SelectItem value="Accepted">Diterima</SelectItem>
                  <SelectItem value="Rejected">Ditolak</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {verifyStatus === "Accepted" && (
              <div className="bg-teal-50 text-teal-800 p-3 rounded-md text-sm border border-teal-100 flex gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                <p>Status Diterima akan memvalidasi calon siswa. Anda dapat meng-generate NIS nanti pada menu Manajemen Siswa.</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVerifyDialogOpen(false)} disabled={isUpdating}>
              Batal
            </Button>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={handleVerify} disabled={isUpdating}>
              {isUpdating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
