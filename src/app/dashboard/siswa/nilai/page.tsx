"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, FileText, BookOpen, Award, CheckCircle2 } from "lucide-react";

export default function NilaiRaporPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [tahfidz, setTahfidz] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStudent, setActiveStudent] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/wali/rapor")
      .then(res => res.json())
      .then(data => {
        if (data.students) {
          setStudents(data.students);
          if (data.students.length > 0) {
            setActiveStudent(data.students[0].id);
          }
        }
        if (data.grades) setGrades(data.grades);
        if (data.tahfidz) setTahfidz(data.tahfidz);
        setLoading(false);
      });
  }, []);

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
        <p>Data siswa tidak ditemukan.</p>
      </div>
    );
  }

  const studentGrades = grades.filter(g => g.studentId === activeStudent);
  const studentTahfidz = tahfidz.filter(t => t.studentId === activeStudent);

  // Pisahkan nilai akademik berdasarkan mata pelajaran
  const subjectsSet = new Set(studentGrades.map(g => g.subjectName));
  const subjectsArray = Array.from(subjectsSet);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-stone-900">Rapor & Tahfidz</h2>
        <p className="text-stone-500">Pantau perkembangan akademik Kurikulum Merdeka dan hafalan Al-Quran.</p>
      </div>

      <Tabs defaultValue="akademik" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md bg-stone-100 p-1 rounded-xl">
          <TabsTrigger value="akademik" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-sm">
            <FileText className="mr-2 h-4 w-4" /> Rapor Akademik
          </TabsTrigger>
          <TabsTrigger value="tahfidz" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-sm">
            <BookOpen className="mr-2 h-4 w-4" /> Mutaba&apos;ah Tahfidz
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="akademik" className="mt-6 space-y-6">
          {studentGrades.length === 0 ? (
            <Card className="border-stone-100 shadow-sm bg-stone-50/50">
              <CardContent className="p-12 text-center text-stone-500">
                <FileText className="mx-auto h-12 w-12 text-stone-300 mb-4" />
                <p>Belum ada nilai akademik yang diinput oleh Guru.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {subjectsArray.map(subj => {
                const subjGrades = studentGrades.filter(g => g.subjectName === subj);
                return (
                  <Card key={subj} className="border-stone-200 shadow-sm overflow-hidden flex flex-col">
                    <CardHeader className="bg-stone-50 border-b border-stone-100 p-4">
                      <h3 className="font-bold text-lg text-stone-800">{subj}</h3>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 divide-y divide-stone-100">
                      {subjGrades.map((g, idx) => (
                        <div key={idx} className="p-4 bg-white hover:bg-stone-50 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">
                              {g.type}
                            </Badge>
                            <div className="text-2xl font-black text-stone-900">{Number(g.score)}</div>
                          </div>
                          {g.notes && (
                            <div className="text-sm text-stone-600 bg-stone-50 p-3 rounded-lg mt-2 border border-stone-100 leading-relaxed italic">
                              &quot;{g.notes}&quot;
                            </div>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="tahfidz" className="mt-6">
          {studentTahfidz.length === 0 ? (
            <Card className="border-stone-100 shadow-sm bg-stone-50/50">
              <CardContent className="p-12 text-center text-stone-500">
                <BookOpen className="mx-auto h-12 w-12 text-stone-300 mb-4" />
                <p>Belum ada rekaman setoran hafalan Tahfidz.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
              <div className="bg-emerald-50 border-b border-emerald-100 p-4 sm:p-6 flex items-start gap-4">
                <div className="bg-emerald-100 p-3 rounded-full text-emerald-600 shrink-0">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-stone-900 leading-tight">Capaian Hafalan Terakhir</h3>
                  <p className="text-stone-600 text-sm mt-1">
                    Ananda terakhir menyetorkan <strong className="text-emerald-700">{studentTahfidz[0].surah} ayat {studentTahfidz[0].ayat}</strong> dengan predikat <strong className="text-emerald-700">{studentTahfidz[0].predicate}</strong>.
                  </p>
                </div>
              </div>
              
              <div className="divide-y divide-stone-100">
                {studentTahfidz.map((t, idx) => (
                  <div key={idx} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50">
                    <div>
                      <div className="text-sm font-medium text-stone-500 mb-1">{new Date(t.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                      <h4 className="font-bold text-stone-900 text-lg">Surat {t.surah}</h4>
                      <p className="text-stone-600">Ayat {t.ayat}</p>
                      {t.notes && <p className="text-sm text-stone-500 mt-2 bg-stone-100 inline-block px-3 py-1 rounded-md">Catatan: {t.notes}</p>}
                    </div>
                    <div className="shrink-0">
                      <Badge className={`text-sm px-4 py-1.5 ${
                        t.predicate === 'Mumtaz' ? 'bg-emerald-500 hover:bg-emerald-600' :
                        t.predicate === 'Jayyid Jiddan' ? 'bg-teal-500 hover:bg-teal-600' :
                        t.predicate === 'Jayyid' ? 'bg-sky-500 hover:bg-sky-600' :
                        'bg-amber-500 hover:bg-amber-600'
                      }`}>
                        {t.predicate}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
