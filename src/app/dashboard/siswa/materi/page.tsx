"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Video, ExternalLink, PlayCircle, Clock, Loader2 } from "lucide-react";

interface Material {
  id: number;
  title: string;
  description: string;
  fileUrl: string;
  className: string;
  subjectName: string;
  teacherName: string;
  createdAt: string;
}

interface ClassOption { id: number; name: string; }

export default function SiswaMateriPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [session, setSession] = useState<{classId?: number} | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setSession(data);
      })
      .catch(() => {});
  }, []);

  const fetchMaterials = useCallback(async () => {
    if (!session?.classId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/materi?classId=${session.classId}`);
      const data = await res.json();
      setMaterials(Array.isArray(data) ? data : []);
    } catch {
      setMaterials([]);
    } finally {
      setLoading(false);
    }
  }, [session?.classId]);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  // Extract unique subjects for filter dropdown
  const uniqueSubjects = useMemo(() => {
    const subjects = new Set<string>();
    materials.forEach(m => subjects.add(m.subjectName));
    return Array.from(subjects);
  }, [materials]);

  const filteredMaterials = useMemo(() => {
    return materials.filter(m => {
      const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            m.subjectName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = subjectFilter === "all" || m.subjectName === subjectFilter;
      return matchesSearch && matchesSubject;
    });
  }, [materials, searchQuery, subjectFilter]);

  const getIcon = (url: string) => {
    if (url.includes('youtube') || url.includes('youtu.be') || url.endsWith('.mp4')) return <Video className="h-6 w-6" />;
    return <FileText className="h-6 w-6" />;
  };
  const getIconBgClass = (url: string) => {
    if (url.includes('youtube') || url.includes('youtu.be') || url.endsWith('.mp4')) return 'bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white';
    return 'bg-rose-100 text-rose-600 group-hover:bg-rose-600 group-hover:text-white';
  };
  const isVideo = (url: string) => url.includes('youtube') || url.includes('youtu.be') || url.endsWith('.mp4');

  const isNew = (dateString: string) => {
    const d = new Date(dateString);
    const now = new Date();
    const diffDays = (now.getTime() - d.getTime()) / (1000 * 3600 * 24);
    return diffDays <= 3; // within 3 days is considered NEW
  };

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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Select value={subjectFilter} onValueChange={(val) => setSubjectFilter(val || "all")}>
              <SelectTrigger className="w-full md:w-[200px] h-10 bg-slate-50 border-slate-200">
                <SelectValue placeholder="Semua Mata Pelajaran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Mata Pelajaran</SelectItem>
                {uniqueSubjects.map(sub => (
                   <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Materials Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-48 text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin mr-2" /> Memuat materi...
        </div>
      ) : filteredMaterials.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-slate-400 bg-white rounded-xl border border-slate-100">
          <FileText className="h-10 w-10 mb-3 text-slate-300" />
          <p className="text-lg font-medium">Belum ada materi pembelajaran</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMaterials.map((materi) => (
            <Card key={materi.id} className="border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group overflow-hidden flex flex-col">
              <CardHeader className="pb-3 flex flex-row items-start justify-between gap-4">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${getIconBgClass(materi.fileUrl)}`}>
                  {getIcon(materi.fileUrl)}
                </div>
                {isNew(materi.createdAt) && (
                  <Badge className="bg-emerald-500 hover:bg-emerald-600 text-[10px] font-bold px-2 py-0.5">BARU</Badge>
                )}
              </CardHeader>
              <CardContent className="pb-4 flex-1">
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">{materi.subjectName}</p>
                  <h3 className="text-lg font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors" title={materi.title}>
                    {materi.title}
                  </h3>
                  {materi.description && (
                    <p className="text-sm text-slate-600 mt-2 line-clamp-2">{materi.description}</p>
                  )}
                  <p className="text-sm text-slate-500 mt-3 flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-slate-300"></span>
                    Oleh {materi.teacherName}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t border-slate-50 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(materi.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}</span>
                </div>
                <Button size="sm" variant={isVideo(materi.fileUrl) ? 'default' : 'outline'} className={
                  isVideo(materi.fileUrl)
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                    : 'text-emerald-700 border-emerald-200 hover:bg-emerald-50 shadow-sm'
                } onClick={() => window.open(materi.fileUrl, '_blank')}>
                  {isVideo(materi.fileUrl) ? (
                    <><PlayCircle className="mr-1.5 h-4 w-4" /> Tonton</>
                  ) : (
                    <><ExternalLink className="mr-1.5 h-4 w-4" /> Buka Materi</>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
