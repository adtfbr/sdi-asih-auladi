import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Berita & Pengumuman | SDI Asih Auladi",
};

const DUMMY_NEWS = [
  {
    id: 1,
    title: "Penerimaan Peserta Didik Baru (PPDB) Tahun Ajaran 2026/2027 Resmi Dibuka",
    excerpt: "SDI Asih Auladi membuka pendaftaran untuk calon siswa baru. Kuota terbatas untuk 120 siswa. Segera daftarkan putra/putri Anda.",
    category: "Pengumuman",
    date: "10 Juni 2026",
    slug: "ppdb-2026-dibuka",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Siswa SDI Asih Auladi Juara 1 Lomba Tahfidz Tingkat Provinsi",
    excerpt: "Alhamdulillah, ananda Budi Santoso dari Kelas 4B berhasil meraih Juara 1 pada MTQ Pelajar tingkat Provinsi Jawa Barat.",
    category: "Prestasi",
    date: "5 Juni 2026",
    slug: "juara-1-tahfidz-provinsi",
    image: "https://images.unsplash.com/photo-1544604862-2f3b92f444c1?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Pelaksanaan Penilaian Akhir Semester (PAS) Ganjil",
    excerpt: "Diberitahukan kepada seluruh wali murid bahwa PAS akan dilaksanakan mulai tanggal 20 Juni 2026. Mohon bimbingannya di rumah.",
    category: "Akademik",
    date: "1 Juni 2026",
    slug: "pelaksanaan-pas-ganjil",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Kunjungan Edukatif ke Museum Geologi Bandung",
    excerpt: "Siswa kelas 5 akan mengadakan field trip ke Museum Geologi untuk mempelajari lebih dalam tentang sejarah terbentuknya bumi.",
    category: "Kegiatan",
    date: "28 Mei 2026",
    slug: "kunjungan-museum-geologi",
    image: "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?q=80&w=1000&auto=format&fit=crop"
  }
];

export default function BeritaPage() {
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

        {/* Featured News */}
        <div className="mb-16">
          <Link href={`/berita/${DUMMY_NEWS[0].slug}`} className="group block">
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 grid grid-cols-1 lg:grid-cols-2 group-hover:shadow-lg transition-all">
              <div className="relative h-64 lg:h-full w-full overflow-hidden">
                <img 
                  src={DUMMY_NEWS[0].image} 
                  alt={DUMMY_NEWS[0].title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-4">
                  <Badge className="bg-emerald-500 text-white hover:bg-emerald-600">{DUMMY_NEWS[0].category}</Badge>
                  <span className="text-sm text-slate-500 flex items-center gap-1"><CalendarDays className="h-4 w-4" /> {DUMMY_NEWS[0].date}</span>
                </div>
                <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mb-4 group-hover:text-emerald-700 transition-colors">
                  {DUMMY_NEWS[0].title}
                </h2>
                <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                  {DUMMY_NEWS[0].excerpt}
                </p>
                <div className="text-emerald-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                  Baca Selengkapnya <ArrowRight className="h-5 w-5" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Other News */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DUMMY_NEWS.slice(1).map((news) => (
            <Link href={`/berita/${news.slug}`} key={news.id} className="group block">
              <Card className="h-full border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden bg-white">
                <div className="relative h-48 w-full overflow-hidden">
                  <img 
                    src={news.image} 
                    alt={news.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-slate-800 hover:bg-white border-none shadow-sm backdrop-blur-sm">
                      {news.category}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                    <CalendarDays className="h-4 w-4" />
                    <span>{news.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                    {news.excerpt}
                  </p>
                  <div className="text-emerald-600 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Baca <ArrowRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
