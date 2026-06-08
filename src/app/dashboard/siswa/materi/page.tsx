import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Video, Download, PlayCircle, Clock } from "lucide-react";

export default function SiswaMateriPage() {
  const materials = [
    { id: 1, title: "Sistem Tata Surya & Planet", subject: "Ilmu Pengetahuan Alam", teacher: "Ust. Budi Santoso", type: "pdf", size: "2.4 MB", date: "Hari ini", isNew: true },
    { id: 2, title: "Video Pembelajaran: Pecahan Dasar", subject: "Matematika", teacher: "Usth. Siti Aminah", type: "video", size: "15 MB", date: "Kemarin", isNew: true },
    { id: 3, title: "Sejarah Kemerdekaan Indonesia", subject: "Bahasa Indonesia", teacher: "Usth. Rina Wati", type: "doc", size: "1.1 MB", date: "3 Hari lalu", isNew: false },
    { id: 4, title: "Kosakata: Anggota Keluarga", subject: "Bahasa Arab", teacher: "Ust. Hasan Basri", type: "pdf", size: "500 KB", date: "Minggu lalu", isNew: false },
    { id: 5, title: "Makna Sila-Sila Pancasila", subject: "Pendidikan Pancasila", teacher: "Usth. Dina", type: "pdf", size: "1.8 MB", date: "Minggu lalu", isNew: false },
    { id: 6, title: "Rukun Iman dan Islam", subject: "Pendidikan Agama Islam", teacher: "Ust. Ahmad", type: "pdf", size: "3.2 MB", date: "2 Minggu lalu", isNew: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Materi Pembelajaran</h2>
          <p className="text-slate-500">Akses dan pelajari modul, presentasi, serta video dari guru-guru.</p>
        </div>
      </div>

      {/* Filter and Search */}
      <Card className="border-slate-100 shadow-sm bg-white">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-2 flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Cari judul materi atau mata pelajaran..."
              className="pl-10 h-10 bg-slate-50 border-slate-200"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Select defaultValue="semua-mapel">
              <SelectTrigger className="w-full md:w-[200px] h-10 bg-slate-50 border-slate-200">
                <SelectValue placeholder="Semua Mata Pelajaran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua-mapel">Semua Mata Pelajaran</SelectItem>
                <SelectItem value="ipa">Ilmu Pengetahuan Alam</SelectItem>
                <SelectItem value="mtk">Matematika</SelectItem>
                <SelectItem value="pai">Pendidikan Agama Islam</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="terbaru">
              <SelectTrigger className="w-full md:w-[160px] h-10 bg-slate-50 border-slate-200">
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="terbaru">Paling Baru</SelectItem>
                <SelectItem value="terlama">Paling Lama</SelectItem>
                <SelectItem value="az">A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {materials.map((materi) => (
          <Card key={materi.id} className="border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group overflow-hidden flex flex-col">
            <CardHeader className="pb-3 flex flex-row items-start justify-between gap-4">
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${materi.type === 'pdf' ? 'bg-rose-100 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors' :
                  materi.type === 'video' ? 'bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors' :
                    'bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors'
                }`}>
                {materi.type === 'video' ? <Video className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
              </div>
              {materi.isNew && (
                <Badge className="bg-emerald-500 hover:bg-emerald-600 text-[10px] font-bold px-2 py-0.5">BARU</Badge>
              )}
            </CardHeader>
            <CardContent className="pb-4 flex-1">
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">{materi.subject}</p>
                <h3 className="text-lg font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors">
                  {materi.title}
                </h3>
                <p className="text-sm text-slate-500 mt-2 flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-slate-300"></span>
                  Oleh {materi.teacher}
                </p>
              </div>
            </CardContent>
            <CardFooter className="pt-4 border-t border-slate-50 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {materi.date}</span>
                <span>•</span>
                <span>{materi.size}</span>
              </div>
              <Button size="sm" variant={materi.type === 'video' ? 'default' : 'outline'} className={
                materi.type === 'video'
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                  : 'text-emerald-700 border-emerald-200 hover:bg-emerald-50 shadow-sm'
              }>
                {materi.type === 'video' ? (
                  <><PlayCircle className="mr-1.5 h-4 w-4" /> Tonton</>
                ) : (
                  <><Download className="mr-1.5 h-4 w-4" /> Unduh</>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
