import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, ArrowRight } from "lucide-react";
import Link from "next/link";
import { db } from "@/db";
import { news } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export const metadata = {
  title: "Berita & Pengumuman | SDI Asih Auladi",
};

// Revalidate every 60 seconds or make it dynamic
export const revalidate = 60;

export default async function BeritaPage() {
  const allNews = await db.select().from(news).where(eq(news.status, 'published')).orderBy(desc(news.createdAt));

  return (
    <div className="py-12 md:py-20 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 mb-4 border-emerald-200">
            Kabar Terkini
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            Berita & Pengumuman
          </h1>
          <p className="text-lg text-slate-600">
            Dapatkan informasi terbaru mengenai kegiatan, prestasi, dan pengumuman akademik SDI Asih Auladi.
          </p>
        </div>

        {allNews.length === 0 ? (
           <div className="text-center py-20 text-slate-500 text-lg">Belum ada berita yang dipublikasikan.</div>
        ) : (
          <>
            {/* Featured News */}
            <div className="mb-16">
              <Link href={`/berita/${allNews[0].slug}`} className="group block">
                <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 grid grid-cols-1 lg:grid-cols-2 group-hover:shadow-lg transition-all">
                  <div className="relative h-64 lg:h-full w-full overflow-hidden bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={allNews[0].imageUrl || "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1000"} 
                      alt={allNews[0].title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-4">
                      <Badge className="bg-emerald-500 text-white hover:bg-emerald-600">Berita</Badge>
                      <span className="text-sm text-slate-500 flex items-center gap-1">
                        <CalendarDays className="h-4 w-4" /> 
                        {allNews[0].createdAt ? new Date(allNews[0].createdAt).toLocaleDateString('id-ID') : '-'}
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mb-4 group-hover:text-emerald-700 transition-colors">
                      {allNews[0].title}
                    </h2>
                    <p className="text-slate-600 text-lg mb-8 leading-relaxed line-clamp-3">
                      {allNews[0].content}
                    </p>
                    <div className="text-emerald-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                      Baca Selengkapnya <ArrowRight className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Other News */}
            {allNews.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {allNews.slice(1).map((n) => (
                  <Link href={`/berita/${n.slug}`} key={n.id} className="group block">
                    <Card className="h-full border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden bg-white">
                      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={n.imageUrl || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1000"} 
                          alt={n.title}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-white/90 text-slate-800 hover:bg-white border-none shadow-sm backdrop-blur-sm">
                            Berita
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                          <CalendarDays className="h-4 w-4" />
                          <span>{n.createdAt ? new Date(n.createdAt).toLocaleDateString('id-ID') : '-'}</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors line-clamp-2">
                          {n.title}
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                          {n.content}
                        </p>
                        <div className="text-emerald-600 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                          Baca <ArrowRight className="h-4 w-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
