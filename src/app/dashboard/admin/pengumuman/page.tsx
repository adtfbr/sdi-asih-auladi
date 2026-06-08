"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Plus, Trash2, Edit2, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const INITIAL_DATA = [
  { id: 1, title: "Libur Awal Ramadhan 1447 H", target: "Semua", date: "10 Mar 2026", status: "Aktif", content: "Diberitahukan bahwa libur awal Ramadhan..." },
  { id: 2, margin: "Pengingat Pembayaran SPP", target: "Wali Murid", date: "05 Mar 2026", status: "Aktif", content: "Mohon segera melunasi administrasi..." },
  { id: 3, title: "Rapat Evaluasi Tengah Semester", target: "Guru", date: "01 Mar 2026", status: "Selesai", content: "Rapat akan diadakan di ruang guru..." }
];

export default function AdminPengumumanPage() {
  const [data, setData] = useState<any[]>(INITIAL_DATA);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Manajemen Pengumuman</h2>
          <p className="text-slate-500">Kelola informasi broadcast untuk guru, siswa, dan wali murid.</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Buat Pengumuman Baru
        </Button>
      </div>

      <Card className="border-slate-100 shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-emerald-600" />
            <CardTitle className="text-lg text-slate-900">Daftar Pengumuman</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Judul</TableHead>
                <TableHead>Target Penerima</TableHead>
                <TableHead>Tanggal Dibuat</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium text-slate-900">{item.title || item.margin}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      item.target === "Semua" ? "bg-slate-100 text-slate-800" :
                      item.target === "Guru" ? "bg-blue-50 text-blue-800 border-blue-200" :
                      item.target === "Wali Murid" ? "bg-purple-50 text-purple-800 border-purple-200" :
                      "bg-emerald-50 text-emerald-800 border-emerald-200"
                    }>
                      {item.target}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-500">
                    <div className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {item.date}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={item.status === "Aktif" ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none" : "bg-slate-100 text-slate-600 hover:bg-slate-200 border-none"}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600 hover:bg-blue-50">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-rose-600 hover:bg-rose-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Buat Pengumuman Baru</DialogTitle>
            <DialogDescription>
              Pengumuman ini akan muncul di dashboard target penerima yang dipilih.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Judul Pengumuman</Label>
              <Input id="title" placeholder="Masukkan judul..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target">Target Penerima</Label>
              <Select defaultValue="semua">
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
              <Textarea id="content" placeholder="Tuliskan isi pengumuman..." className="min-h-[120px]" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setIsDialogOpen(false)}>Kirim Pengumuman</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
