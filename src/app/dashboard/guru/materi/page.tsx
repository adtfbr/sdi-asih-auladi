import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UploadCloud, FileText, Video, Trash2 } from "lucide-react";

export default function UploadMateriPage() {
  const recentUploads = [
    { id: 1, title: "Modul 1: Sistem Tata Surya", class: "Kelas 4B", subject: "Ilmu Pengetahuan Alam", type: "pdf", size: "2.4 MB", date: "Hari ini" },
    { id: 2, title: "Video Penjelasan: Pecahan", class: "Kelas 4B", subject: "Matematika", type: "video", size: "15 MB", date: "Kemarin" },
    { id: 3, title: "Tugas Bacaan: Sejarah Kemerdekaan", class: "Kelas 4B", subject: "B. Indonesia", type: "doc", size: "1.1 MB", date: "3 Hari yang lalu" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Upload Materi Pembelajaran</h2>
        <p className="text-slate-500">Bagikan modul, presentasi, atau video pembelajaran kepada siswa.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-100 shadow-sm bg-white">
            <CardHeader className="border-b border-slate-50 pb-4">
              <CardTitle className="text-lg">Form Upload Baru</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Pilih Kelas</Label>
                  <Select defaultValue="4B">
                    <SelectTrigger className="bg-slate-50 border-slate-200">
                      <SelectValue placeholder="Pilih Kelas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1A">Kelas 1A</SelectItem>
                      <SelectItem value="2B">Kelas 2B</SelectItem>
                      <SelectItem value="4B">Kelas 4B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Mata Pelajaran</Label>
                  <Select defaultValue="ipa">
                    <SelectTrigger className="bg-slate-50 border-slate-200">
                      <SelectValue placeholder="Pilih Mata Pelajaran" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pai">Pendidikan Agama Islam</SelectItem>
                      <SelectItem value="mtk">Matematika</SelectItem>
                      <SelectItem value="ipa">Ilmu Pengetahuan Alam</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="judul">Judul Materi</Label>
                <Input id="judul" placeholder="Contoh: Modul 2 - Ekosistem" className="bg-slate-50 border-slate-200" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deskripsi">Deskripsi Singkat (Opsional)</Label>
                <Textarea id="deskripsi" placeholder="Tuliskan instruksi atau ringkasan materi..." className="bg-slate-50 border-slate-200 min-h-[100px]" />
              </div>

              <div className="space-y-2">
                <Label>File Materi</Label>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 bg-slate-50 hover:bg-slate-100/50 hover:border-emerald-300 transition-colors flex flex-col items-center justify-center text-center">
                  <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-4">
                    <UploadCloud className="h-8 w-8" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-1">Klik untuk upload atau drag and drop</h4>
                  <p className="text-sm text-slate-500 max-w-xs mx-auto">
                    Mendukung format PDF, DOCX, PPTX, dan MP4 (Maks. 20MB)
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button className="bg-emerald-600 hover:bg-emerald-700 h-12 px-8 text-white rounded-full">
                  <UploadCloud className="mr-2 h-4 w-4" /> Upload Materi
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
              <div className="divide-y divide-slate-50">
                {recentUploads.map((file) => (
                  <div key={file.id} className="p-4 hover:bg-slate-50/80 transition-colors flex items-start gap-4">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${file.type === 'pdf' ? 'bg-rose-100 text-rose-600' :
                        file.type === 'video' ? 'bg-indigo-100 text-indigo-600' :
                          'bg-blue-100 text-blue-600'
                      }`}>
                      {file.type === 'video' ? <Video className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-slate-900 line-clamp-1">{file.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{file.subject} • {file.class}</p>
                      <div className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-2">
                        <span>{file.size}</span>
                        <span>•</span>
                        <span>{file.date}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 shrink-0">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-slate-50">
                <Button variant="outline" className="w-full text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                  Lihat Semua Materi
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
