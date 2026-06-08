"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, CheckCircle2, FileText, Upload, User, Users } from "lucide-react";
import Link from "next/link";

export default function PPDBPage() {
  const [activeTab, setActiveTab] = useState("data-diri");
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Banner */}
      <div className="bg-emerald-700 pb-24 pt-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <Link href="/" className="inline-flex items-center text-emerald-100 hover:text-white mb-8 transition-colors text-sm font-medium">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Beranda
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Formulir Pendaftaran Siswa Baru
          </h1>
          <p className="text-emerald-100 text-lg max-w-2xl">
            Tahun Ajaran 2026/2027. Silakan lengkapi data diri calon peserta didik, data orang tua, dan unggah dokumen yang diperlukan.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 relative z-20 -mt-16 pb-24">
        <Card className="border-slate-100 shadow-xl shadow-slate-200/50 max-w-4xl mx-auto rounded-3xl overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="bg-white border-b border-slate-100 px-6 pt-6">
              <TabsList className="flex flex-row overflow-x-auto justify-start md:grid md:grid-cols-3 bg-slate-100 p-1 rounded-xl h-auto w-full no-scrollbar">
                <TabsTrigger value="data-diri" className="shrink-0 rounded-lg py-3 data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm">
                  <div className="flex flex-col md:flex-row items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-semibold">Data Diri</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="data-ortu" className="shrink-0 rounded-lg py-3 data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm">
                  <div className="flex flex-col md:flex-row items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="text-sm font-semibold">Data Orang Tua</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="dokumen" className="shrink-0 rounded-lg py-3 data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm">
                  <div className="flex flex-col md:flex-row items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm font-semibold">Dokumen</span>
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>

            <CardContent className="p-6 md:p-8 bg-white">
              <TabsContent value="data-diri" className="mt-0 space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Data Pribadi Calon Siswa</h3>
                    <p className="text-sm text-slate-500">Pastikan data yang diisi sesuai dengan Akta Kelahiran dan Kartu Keluarga.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="namaLengkap">Nama Lengkap</Label>
                      <Input id="namaLengkap" placeholder="Masukkan nama lengkap" className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-emerald-500" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nik">NIK (Nomor Induk Kependudukan)</Label>
                      <Input id="nik" placeholder="16 digit angka NIK" className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-emerald-500" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tempatLahir">Tempat Lahir</Label>
                      <Input id="tempatLahir" placeholder="Kota/Kabupaten kelahiran" className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-emerald-500" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tanggalLahir">Tanggal Lahir</Label>
                      <Input id="tanggalLahir" type="date" className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-emerald-500" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="jenisKelamin">Jenis Kelamin</Label>
                      <Select>
                        <SelectTrigger id="jenisKelamin" className="h-12 bg-slate-50 border-slate-200 focus:ring-emerald-500">
                          <SelectValue placeholder="Pilih jenis kelamin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="L">Laki-laki</SelectItem>
                          <SelectItem value="P">Perempuan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agama">Agama</Label>
                      <Select defaultValue="islam">
                        <SelectTrigger id="agama" className="h-12 bg-slate-50 border-slate-200 focus:ring-emerald-500">
                          <SelectValue placeholder="Pilih agama" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="islam">Islam</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="alamat">Alamat Lengkap</Label>
                      <Textarea id="alamat" placeholder="Masukkan alamat lengkap sesuai Kartu Keluarga" className="min-h-[100px] bg-slate-50 border-slate-200 focus-visible:ring-emerald-500" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button onClick={() => setActiveTab("data-ortu")} className="bg-emerald-600 hover:bg-emerald-700 h-12 px-8 text-white rounded-full">
                    Selanjutnya: Data Orang Tua
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="data-ortu" className="mt-0 space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Data Orang Tua / Wali</h3>
                    <p className="text-sm text-slate-500">Informasi orang tua atau wali untuk keperluan administrasi dan komunikasi.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Ayah */}
                    <div className="md:col-span-2 mt-4">
                      <h4 className="font-medium text-slate-900 border-b pb-2">Data Ayah</h4>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="namaAyah">Nama Ayah</Label>
                      <Input id="namaAyah" placeholder="Nama lengkap ayah" className="h-12 bg-slate-50 border-slate-200" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pekerjaanAyah">Pekerjaan Ayah</Label>
                      <Input id="pekerjaanAyah" placeholder="Pekerjaan saat ini" className="h-12 bg-slate-50 border-slate-200" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="noHpAyah">Nomor HP/WhatsApp Ayah</Label>
                      <Input id="noHpAyah" placeholder="08xxxxxxxxxx" className="h-12 bg-slate-50 border-slate-200" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="penghasilanAyah">Penghasilan Per Bulan</Label>
                      <Select>
                        <SelectTrigger id="penghasilanAyah" className="h-12 bg-slate-50 border-slate-200">
                          <SelectValue placeholder="Pilih rentang penghasilan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="<2m">&lt; Rp 2.000.000</SelectItem>
                          <SelectItem value="2-5m">Rp 2.000.000 - Rp 5.000.000</SelectItem>
                          <SelectItem value=">5m">&gt; Rp 5.000.000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Ibu */}
                    <div className="md:col-span-2 mt-4">
                      <h4 className="font-medium text-slate-900 border-b pb-2">Data Ibu</h4>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="namaIbu">Nama Ibu</Label>
                      <Input id="namaIbu" placeholder="Nama lengkap ibu" className="h-12 bg-slate-50 border-slate-200" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pekerjaanIbu">Pekerjaan Ibu</Label>
                      <Input id="pekerjaanIbu" placeholder="Pekerjaan saat ini" className="h-12 bg-slate-50 border-slate-200" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="noHpIbu">Nomor HP/WhatsApp Ibu</Label>
                      <Input id="noHpIbu" placeholder="08xxxxxxxxxx" className="h-12 bg-slate-50 border-slate-200" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setActiveTab("data-diri")} className="h-12 px-8 rounded-full border-slate-200">
                    Sebelumnya
                  </Button>
                  <Button onClick={() => setActiveTab("dokumen")} className="bg-emerald-600 hover:bg-emerald-700 h-12 px-8 text-white rounded-full">
                    Selanjutnya: Dokumen
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="dokumen" className="mt-0 space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Upload Dokumen Persyaratan</h3>
                    <p className="text-sm text-slate-500">Unggah file dokumen yang dibutuhkan dalam format PDF atau JPG/PNG (Maks 2MB).</p>
                  </div>

                  <div className="space-y-4">
                    {/* Dokumen 1 */}
                    <div className="p-4 sm:p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 flex flex-col sm:flex-row items-center gap-4 hover:border-emerald-300 transition-colors">
                      <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                        <Upload className="h-5 w-5" />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h4 className="font-semibold text-slate-900">Kartu Keluarga (KK)</h4>
                        <p className="text-xs text-slate-500 mt-1">Format JPG/PNG/PDF maks 2MB</p>
                      </div>
                      <Button variant="outline" className="bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200">
                        Pilih File
                      </Button>
                    </div>

                    {/* Dokumen 2 */}
                    <div className="p-4 sm:p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 flex flex-col sm:flex-row items-center gap-4 hover:border-emerald-300 transition-colors">
                      <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                        <Upload className="h-5 w-5" />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h4 className="font-semibold text-slate-900">Akta Kelahiran</h4>
                        <p className="text-xs text-slate-500 mt-1">Format JPG/PNG/PDF maks 2MB</p>
                      </div>
                      <Button variant="outline" className="bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200">
                        Pilih File
                      </Button>
                    </div>

                    {/* Dokumen 3 */}
                    <div className="p-4 sm:p-6 border-2 border-dashed border-emerald-500 rounded-2xl bg-emerald-50/50 flex flex-col sm:flex-row items-center gap-4 transition-colors">
                      <div className="h-12 w-12 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
                        <CheckCircle2 className="h-6 w-6" />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h4 className="font-semibold text-emerald-900">Pas Foto 3x4</h4>
                        <p className="text-xs text-emerald-600 mt-1">pas_foto_budi.jpg (150KB)</p>
                      </div>
                      <Button variant="ghost" className="text-rose-500 hover:text-rose-700 hover:bg-rose-50">
                        Hapus
                      </Button>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-800 text-sm flex gap-3">
                    <div className="shrink-0 mt-0.5">
                      <CheckCircle2 className="h-4 w-4 text-amber-600" />
                    </div>
                    <p>Dengan menekan tombol &quot;Kirim Pendaftaran&quot;, saya menyatakan bahwa seluruh data yang diisikan adalah benar dan dapat dipertanggungjawabkan.</p>
                  </div>
                </div>
                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <Button variant="outline" onClick={() => setActiveTab("data-ortu")} className="h-12 px-8 rounded-full border-slate-200">
                    Sebelumnya
                  </Button>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 h-12 px-8 text-white rounded-full font-semibold">
                    Kirim Pendaftaran
                  </Button>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
