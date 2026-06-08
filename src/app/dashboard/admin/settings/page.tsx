"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Pengaturan Sistem</h2>
        <p className="text-slate-500">Konfigurasi data institusi dan preferensi aplikasi.</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-slate-100 p-1 rounded-xl">
          <TabsTrigger value="general" className="rounded-lg">Umum</TabsTrigger>
          <TabsTrigger value="academic" className="rounded-lg">Akademik</TabsTrigger>
          <TabsTrigger value="ppdb" className="rounded-lg">PPDB</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Card className="border-slate-100 shadow-sm">
            <CardHeader>
              <CardTitle>Profil Sekolah</CardTitle>
              <CardDescription>Informasi dasar mengenai institusi.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="schoolName">Nama Sekolah</Label>
                <Input id="schoolName" defaultValue="SDI Asih Auladi" className="bg-slate-50 border-slate-200" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="npsn">NPSN</Label>
                <Input id="npsn" defaultValue="20212345" className="bg-slate-50 border-slate-200" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Alamat Lengkap</Label>
                <Input id="address" defaultValue="Jl. Pendidikan No. 123, Kota Cerdas" className="bg-slate-50 border-slate-200" />
              </div>
              <div className="pt-4 flex justify-end">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Save className="mr-2 h-4 w-4" /> Simpan Profil
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academic" className="mt-6">
          <Card className="border-slate-100 shadow-sm">
            <CardHeader>
              <CardTitle>Tahun Ajaran Aktif</CardTitle>
              <CardDescription>Atur tahun ajaran dan semester yang sedang berjalan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="activeYear">Tahun Ajaran</Label>
                <Input id="activeYear" defaultValue="2025/2026" className="bg-slate-50 border-slate-200" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Input id="semester" defaultValue="Genap" className="bg-slate-50 border-slate-200" />
              </div>
              <div className="pt-4 flex justify-end">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Save className="mr-2 h-4 w-4" /> Simpan Akademik
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ppdb" className="mt-6">
          <Card className="border-slate-100 shadow-sm">
            <CardHeader>
              <CardTitle>Konfigurasi PPDB</CardTitle>
              <CardDescription>Buka atau tutup gelombang pendaftaran PPDB.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ppdbStatus">Status Pendaftaran</Label>
                <select id="ppdbStatus" className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value="open">Buka (Menerima Siswa Baru)</option>
                  <option value="closed">Tutup</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gelombang">Gelombang Aktif</Label>
                <Input id="gelombang" defaultValue="Gelombang 2" className="bg-slate-50 border-slate-200" />
              </div>
              <div className="pt-4 flex justify-end">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Save className="mr-2 h-4 w-4" /> Simpan PPDB
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
