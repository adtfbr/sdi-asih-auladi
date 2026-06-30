"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save } from "lucide-react";
import { updateSystemSettings } from "./actions";
import { useState } from "react";

export function SettingsForm({ initialData }: { initialData: any }) {
  const s = initialData || {};
  const [loading, setLoading] = useState(false);
  const [formDataState, setFormDataState] = useState({
    schoolName: s.schoolName || "SDI Asih Auladi",
    npsn: s.npsn || "20212345",
    address: s.address || "Jl. Pendidikan No. 123",
    ppdbStatus: s.ppdbStatus || "open",
    ppdbWave: s.ppdbWave || "Gelombang 1"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormDataState(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    const res = await updateSystemSettings(data);
    
    setLoading(false);
    if (res?.error) {
      alert("Error: " + res.error);
    } else {
      alert("Pengaturan berhasil disimpan!");
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-stone-100 p-1 rounded-xl">
          <TabsTrigger value="general" className="rounded-lg">Umum</TabsTrigger>
          <TabsTrigger value="academic" className="rounded-lg">Akademik</TabsTrigger>
          <TabsTrigger value="ppdb" className="rounded-lg">PPDB</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <form onSubmit={handleSave}>
            <Card className="border-stone-100 shadow-sm">
              <CardHeader>
                <CardTitle>Profil Sekolah</CardTitle>
                <CardDescription>Informasi dasar mengenai institusi.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="schoolName">Nama Sekolah</Label>
                  <Input name="schoolName" id="schoolName" value={formDataState.schoolName} onChange={handleChange} className="bg-stone-50 border-stone-200" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="npsn">NPSN</Label>
                  <Input name="npsn" id="npsn" value={formDataState.npsn} onChange={handleChange} className="bg-stone-50 border-stone-200" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Alamat Lengkap</Label>
                  <Input name="address" id="address" value={formDataState.address} onChange={handleChange} className="bg-stone-50 border-stone-200" required />
                </div>
                <div className="pt-4 flex justify-end">
                  <Button type="submit" disabled={loading} className="bg-teal-600 hover:bg-teal-700 text-white">
                    <Save className="mr-2 h-4 w-4" /> {loading ? "Menyimpan..." : "Simpan Profil"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </TabsContent>

        <TabsContent value="academic" className="mt-6">
          <Card className="border-stone-100 shadow-sm">
            <CardHeader>
              <CardTitle>Tahun Ajaran Aktif</CardTitle>
              <CardDescription>Atur tahun ajaran dan semester yang sedang berjalan (Saat ini diatur via menu Tahun Ajaran).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-stone-500">Silakan gunakan menu Tahun Ajaran untuk mengubah status aktif.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ppdb" className="mt-6">
          <form onSubmit={handleSave}>
            <Card className="border-stone-100 shadow-sm">
              <CardHeader>
                <CardTitle>Konfigurasi PPDB</CardTitle>
                <CardDescription>Buka atau tutup gelombang pendaftaran PPDB.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ppdbStatus">Status Pendaftaran</Label>
                  <select name="ppdbStatus" id="ppdbStatus" value={formDataState.ppdbStatus} onChange={handleChange} className="flex h-10 w-full items-center justify-between rounded-md border border-stone-200 bg-stone-50 px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option value="open">Buka (Menerima Siswa Baru)</option>
                    <option value="closed">Tutup</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ppdbWave">Gelombang Aktif</Label>
                  <Input name="ppdbWave" id="ppdbWave" value={formDataState.ppdbWave} onChange={handleChange} className="bg-stone-50 border-stone-200" />
                </div>
                <div className="pt-4 flex justify-end">
                  <Button type="submit" disabled={loading} className="bg-teal-600 hover:bg-teal-700 text-white">
                    <Save className="mr-2 h-4 w-4" /> {loading ? "Menyimpan..." : "Simpan PPDB"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
