"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, Bell, Loader2 } from "lucide-react";

interface Announcement {
  id: number;
  title: string;
  content: string;
  targetRole: string;
  createdAt: string;
}

export default function WaliPengumumanPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/pengumuman?targetRole=wali");
      const json = await res.json();
      setAnnouncements(Array.isArray(json) ? json : []);
    } catch {
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-stone-900">Pengumuman Sekolah</h2>
        <p className="text-stone-500">Informasi terbaru dan papan buletin untuk wali murid.</p>
      </div>

      <div className="grid gap-4">
        {loading ? (
           <div className="flex items-center justify-center h-48 text-stone-400">
             <Loader2 className="h-6 w-6 animate-spin mr-2" /> Memuat pengumuman...
           </div>
        ) : announcements.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-stone-400 bg-white rounded-xl border border-stone-100">
            <Bell className="h-10 w-10 mb-3 text-stone-300" />
            <p className="text-lg font-medium">Belum ada pengumuman</p>
          </div>
        ) : announcements.map((item) => (
          <Card key={item.id} className="border-stone-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 border-b border-stone-50">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
                    <Bell className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(item.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-stone-700 leading-relaxed text-sm whitespace-pre-wrap">
                {item.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
