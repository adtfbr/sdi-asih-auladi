import { Badge } from "@/components/ui/badge";
import { db } from "@/db";
import { galleries } from "@/db/schema";
import { desc } from "drizzle-orm";

export const metadata = {
  title: "Galeri Kegiatan | SDI Asih Auladi",
};

export const revalidate = 60;

export default async function GaleriPage() {
  const allGalleries = await db.select().from(galleries).orderBy(desc(galleries.createdAt));

  return (
    <div className="py-12 md:py-20 bg-white min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 mb-4 border-emerald-200">
            Dokumentasi
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            Galeri Kegiatan Siswa
          </h1>
          <p className="text-lg text-slate-600">
            Momen-momen berharga dan aktivitas edukatif siswa-siswi SDI Asih Auladi.
          </p>
        </div>

        {allGalleries.length === 0 ? (
          <div className="text-center py-20 text-slate-500 text-lg">Belum ada dokumentasi galeri.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allGalleries.map((item) => (
              <div key={item.id} className="group relative rounded-3xl overflow-hidden aspect-square bg-slate-100 shadow-sm cursor-pointer border border-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={item.imageUrl} 
                  alt={item.title}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <Badge className="w-fit mb-3 bg-emerald-500 hover:bg-emerald-500 border-none text-white">
                    Kegiatan
                  </Badge>
                  <h3 className="text-white text-xl font-bold">{item.title}</h3>
                  {item.description && (
                    <p className="text-slate-200 text-sm mt-2 line-clamp-2">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
