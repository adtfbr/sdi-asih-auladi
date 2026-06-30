import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, BookOpen, Presentation, CheckCircle2, ArrowRight, ShieldCheck, HeartHandshake } from "lucide-react";
import { db } from "@/db";
import { news, galleries, systemSettings } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export const revalidate = 60;

export default async function Home() {
  const latestNews = await db.select().from(news).where(eq(news.status, 'published')).orderBy(desc(news.createdAt)).limit(3);
  const latestGalleries = await db.select().from(galleries).orderBy(desc(galleries.createdAt)).limit(4);
  const [settingsResult] = await db.select().from(systemSettings).limit(1);
  const settings = settingsResult || { schoolName: "SDI Asih Auladi" };

  return (
    <div className="flex flex-col min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 md:pt-24 lg:pt-32 pb-32 md:pb-40">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left: Text & CTA */}
            <div className="flex flex-col space-y-8 max-w-2xl">
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 leading-[1.15]">
                Sistem Informasi <span className="text-teal-600">Terpadu</span> <br/>{settings.schoolName}
              </h1>

              <p className="text-lg text-stone-600 max-w-[500px] leading-relaxed">
                Platform manajemen sekolah berbasis web yang mendigitalisasi operasional sekolah dasar Islam dalam satu sistem cerdas, interaktif, dan terintegrasi.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4">
                <Link href="/login" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full h-14 rounded-xl text-base px-8 bg-teal-600 hover:bg-teal-700">
                    Masuk Portal
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/profil" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full h-14 rounded-xl text-base px-8 border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-stone-900">
                    Tentang Kami
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Right: Graphic / Placeholder */}
            <div className="relative hidden lg:flex items-center justify-center">
              <div className="absolute inset-0 bg-teal-600/5 rounded-[40px] transform rotate-3"></div>
              <div className="absolute inset-0 bg-stone-200/50 rounded-[40px] transform -rotate-2"></div>
              <div className="relative bg-white p-12 rounded-[40px] shadow-xl w-full max-w-md flex flex-col items-center justify-center min-h-[400px] border border-stone-100">
                <img src="/logo-asih-auladi.png" alt="Logo" className="w-48 h-auto opacity-90 relative z-10" />
                <div className="absolute inset-0 opacity-5 pointer-events-none rounded-[40px]" style={{ backgroundImage: 'radial-gradient(#0d9488 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistik Section (Negative Margin) */}
      <section className="relative z-20 container mx-auto px-4 md:px-6 -mt-20 md:-mt-24 mb-24">
        <Card className="bg-white shadow-lg shadow-stone-200/50 border-stone-100 p-2 md:p-4 rounded-[32px]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 divide-x divide-stone-100">
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <span className="font-heading text-3xl md:text-4xl font-bold text-teal-700 mb-2">450+</span>
              <span className="text-sm font-medium text-stone-500 uppercase tracking-wider">Siswa Aktif</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <span className="font-heading text-3xl md:text-4xl font-bold text-teal-700 mb-2">45</span>
              <span className="text-sm font-medium text-stone-500 uppercase tracking-wider">Guru & Staf</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <span className="font-heading text-3xl md:text-4xl font-bold text-teal-700 mb-2">18</span>
              <span className="text-sm font-medium text-stone-500 uppercase tracking-wider">Ruang Kelas</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <span className="font-heading text-3xl md:text-4xl font-bold text-teal-700 mb-2">14+</span>
              <span className="text-sm font-medium text-stone-500 uppercase tracking-wider">Tahun Berdiri</span>
            </div>
          </div>
        </Card>
      </section>

      {/* Visi Misi Highlight */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative rounded-[32px] overflow-hidden bg-stone-50 border border-stone-100 aspect-square lg:aspect-auto lg:h-[500px] flex items-center justify-center">
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='%230d9488' fill-rule='evenodd'/%3E%3C/svg%3E")` }}></div>
              <HeartHandshake className="w-32 h-32 text-teal-200 relative z-10" />
            </div>
            <div className="order-1 lg:order-2 space-y-8">
              <div>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-stone-900 mb-6 leading-tight">Membentuk Generasi Qur'ani</h2>
                <p className="text-lg text-stone-600 leading-relaxed">
                  Kami berkomitmen untuk menyelenggarakan pendidikan dasar yang memadukan kurikulum nasional dan nilai-nilai keislaman untuk mencetak generasi yang cerdas, berakhlak mulia, dan berwawasan global.
                </p>
              </div>
              <div className="grid gap-4">
                <Card className="bg-stone-50 border-none shadow-none rounded-2xl">
                  <CardContent className="flex items-start gap-4 p-6">
                    <CheckCircle2 className="w-6 h-6 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-heading text-lg font-bold text-stone-900 mb-2">Visi Kami</h4>
                      <p className="text-stone-600 leading-relaxed">Menjadi sekolah dasar unggulan yang melahirkan generasi Rabbani yang cerdas, terampil, dan berakhlak mulia.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Link href="/visi-misi">
                <Button variant="outline" className="h-12 px-6 rounded-xl border-stone-200">
                  Selengkapnya tentang Visi Misi
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Fitur Platform Section */}
      <section className="py-24 bg-stone-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-stone-900">Satu Platform, Beragam Kemudahan</h2>
            <p className="text-lg text-stone-600 leading-relaxed">
              Sistem kami menyediakan portal khusus untuk setiap peran, memastikan informasi mengalir dengan lancar dan transparan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Portal Guru */}
            <Card className="border border-stone-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 rounded-3xl bg-white">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center mb-6 border border-teal-100">
                  <Presentation className="h-8 w-8 text-teal-600" />
                </div>
                <h3 className="font-heading text-xl font-bold text-stone-900 mb-3">Portal Guru</h3>
                <p className="text-stone-600 leading-relaxed">
                  Manajemen kelas, input nilai, presensi siswa, dan berbagi materi pelajaran dengan mudah dalam satu dashboard terintegrasi.
                </p>
              </CardContent>
            </Card>

            {/* Portal Siswa */}
            <Card className="border border-stone-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 rounded-3xl bg-white">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-6 border border-amber-100">
                  <BookOpen className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="font-heading text-xl font-bold text-stone-900 mb-3">Portal Siswa</h3>
                <p className="text-stone-600 leading-relaxed">
                  Akses jadwal pelajaran, unduh materi belajar, lihat nilai dan rapor, serta terima pengumuman langsung dari sekolah.
                </p>
              </CardContent>
            </Card>

            {/* Portal Wali Murid */}
            <Card className="border border-stone-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 rounded-3xl bg-white">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-2xl bg-sky-50 flex items-center justify-center mb-6 border border-sky-100">
                  <ShieldCheck className="h-8 w-8 text-sky-600" />
                </div>
                <h3 className="font-heading text-xl font-bold text-stone-900 mb-3">Portal Wali Murid</h3>
                <p className="text-stone-600 leading-relaxed">
                  Pantau perkembangan akademik anak, histori absensi, nilai rapor, dan informasi tagihan sekolah secara real-time.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Berita Section */}
      <section className="py-24 bg-white border-t border-stone-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="max-w-2xl space-y-4">
              <h2 className="font-heading text-3xl font-bold text-stone-900">Berita & Informasi</h2>
              <p className="text-stone-600 text-lg">Ikuti perkembangan terbaru dan kegiatan-kegiatan menarik di SDI Asih Auladi.</p>
            </div>
            <Link href="/berita">
              <Button variant="outline" className="shrink-0 rounded-xl h-12 px-6">
                Lihat Semua Berita
              </Button>
            </Link>
          </div>

          {latestNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestNews.map((item) => (
                <Link href={`/berita/${item.slug}`} key={item.id} className="group block h-full">
                  <Card className="h-full border border-stone-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden bg-white rounded-3xl flex flex-col hover:-translate-y-1">
                    <div className="aspect-[16/9] w-full relative overflow-hidden bg-stone-50 flex items-center justify-center border-b border-stone-100">
                      {item.imageUrl ? (
                        <img 
                          src={item.imageUrl} 
                          alt={item.title}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <BookOpen className="w-12 h-12 text-stone-300" />
                      )}
                    </div>
                    <CardContent className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-xs font-semibold uppercase tracking-wider bg-stone-100 px-3 py-1 rounded-full text-stone-600">Berita</span>
                        <span className="text-xs text-stone-500 font-medium">{item.createdAt ? new Date(item.createdAt).toLocaleDateString('id-ID') : ''}</span>
                      </div>
                      <h3 className="font-heading text-xl font-bold text-stone-900 group-hover:text-teal-600 transition-colors line-clamp-2 mb-3 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-stone-600 line-clamp-2 text-sm leading-relaxed mt-auto">{item.content}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-stone-50 rounded-[32px] border border-stone-100">
              <p className="text-stone-500 font-medium">Belum ada berita yang diterbitkan.</p>
            </div>
          )}
        </div>
      </section>

      {/* Galeri Section */}
      <section className="py-24 bg-stone-50 border-t border-stone-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="max-w-2xl space-y-4">
              <h2 className="font-heading text-3xl font-bold text-stone-900">Galeri Kegiatan</h2>
              <p className="text-stone-600 text-lg">Momen-momen berharga dalam proses belajar mengajar kami.</p>
            </div>
            <Link href="/galeri">
              <Button variant="outline" className="shrink-0 rounded-xl h-12 px-6">Lihat Galeri Penuh</Button>
            </Link>
          </div>

          {latestGalleries.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {latestGalleries.map((item) => (
                <div key={item.id} className="group relative aspect-square rounded-[32px] overflow-hidden bg-stone-200 border border-stone-100">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <h3 className="text-white font-medium line-clamp-2 text-sm md:text-base leading-snug">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-[32px] border border-stone-100">
              <p className="text-stone-500 font-medium">Belum ada foto di galeri.</p>
            </div>
          )}
        </div>
      </section>
      
    </div>
  );
}
