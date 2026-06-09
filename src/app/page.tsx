import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, BookOpen, Presentation, CheckCircle2, ArrowRight } from "lucide-react";
import { db } from "@/db";
import { news, galleries } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export const revalidate = 60;

export default async function Home() {
  const latestNews = await db.select().from(news).where(eq(news.status, 'published')).orderBy(desc(news.createdAt)).limit(3);
  const latestGalleries = await db.select().from(galleries).orderBy(desc(galleries.createdAt)).limit(8);
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-emerald-50 pt-16 md:pt-24 lg:pt-32 pb-24 md:pb-32">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
          <div className="w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        </div>
        <div className="absolute top-0 left-0 translate-y-24 -translate-x-1/3">
          <div className="w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-8">
            <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-100/50 px-3 py-1 text-sm text-emerald-800 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-600 mr-2"></span>
              Pendaftaran Tahun Ajaran 2026/2027 Dibuka
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
              Sistem Informasi <span className="text-emerald-600">Terpadu</span> SDI Asih Auladi
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-2xl">
              Platform manajemen sekolah berbasis web yang mendigitalisasi operasional sekolah dasar Islam dalam satu sistem cerdas, interaktif, dan terintegrasi.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/ppdb" className="w-full sm:w-auto">
                <Button size="lg" className="w-full h-12 px-8 text-base bg-emerald-600 hover:bg-emerald-700 text-white rounded-full">
                  Daftar PPDB Online
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#profil" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full h-12 px-8 text-base border-emerald-200 text-emerald-800 hover:bg-emerald-50 rounded-full">
                  Pelajari Lebih Lanjut
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 bg-white relative z-20 -mt-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 bg-white p-8 rounded-3xl shadow-xl shadow-emerald-900/5 border border-slate-100">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-2">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900">450+</h3>
              <p className="text-sm font-medium text-slate-500">Siswa Aktif</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-2">
                <Presentation className="h-6 w-6" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900">45</h3>
              <p className="text-sm font-medium text-slate-500">Guru & Staf</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-2">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900">18</h3>
              <p className="text-sm font-medium text-slate-500">Ruang Kelas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Visi Misi Section */}
      <section id="profil" className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-square md:aspect-[4/3] bg-emerald-100 rounded-3xl overflow-hidden relative">
                {/* Placeholder for real image */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 opacity-20 mix-blend-multiply"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <GraduationCap className="h-32 w-32 text-emerald-300 opacity-50" />
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 h-48 w-48 bg-emerald-50 rounded-full -z-10 blur-2xl"></div>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Membentuk Generasi Qur&apos;ani</h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  SDI Asih Auladi berkomitmen untuk menyelenggarakan pendidikan dasar Islam yang berkualitas dengan mengintegrasikan kurikulum nasional dan kurikulum keislaman.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Visi</h4>
                    <p className="text-sm text-slate-600">Menjadi lembaga pendidikan dasar unggulan yang melahirkan generasi cerdas, mandiri, dan berakhlakul karimah.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Misi</h4>
                    <p className="text-sm text-slate-600">Mengembangkan minat dan bakat peserta didik melalui pembelajaran aktif, inovatif, kreatif, efektif, dan menyenangkan.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fitur Platform Section */}
      <section className="py-20 md:py-32 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Satu Platform, Beragam Kemudahan</h2>
            <p className="text-slate-600 text-lg">Platform ini dirancang khusus untuk memenuhi kebutuhan seluruh ekosistem sekolah, dari guru hingga wali murid.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white border-slate-100 shadow-md shadow-slate-200/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <CardHeader>
                <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                  <Presentation className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Portal Guru</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600">
                Mengelola absensi, menginput nilai secara real-time, mengunggah materi pembelajaran, dan melihat jadwal mengajar dengan mudah.
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-100 shadow-md shadow-slate-200/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <CardHeader>
                <div className="h-12 w-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Portal Siswa</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600">
                Mengakses materi pelajaran, melihat nilai ujian, mengecek jadwal pelajaran, dan menerima pengumuman terbaru dari sekolah.
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-100 shadow-md shadow-slate-200/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <CardHeader>
                <div className="h-12 w-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Portal Wali Murid</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600">
                Memantau perkembangan akademik anak, mengecek rekap absensi harian, dan mendapatkan notifikasi informasi penting sekolah.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Berita Section */}
      <section id="berita" className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Berita & Pengumuman</h2>
              <p className="text-slate-600 text-lg max-w-2xl">Ikuti perkembangan terbaru dan informasi penting dari SDI Asih Auladi.</p>
            </div>
            <Link href="#berita" className="hidden md:block">
              <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-full">
                Lihat Semua
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {latestNews.length === 0 ? (
              <div className="col-span-3 text-center text-slate-500 py-10">Belum ada berita yang dipublikasikan.</div>
            ) : (
              latestNews.map((item) => (
                <Link href={`/berita/${item.slug}`} key={item.id} className="group block">
                  <Card className="overflow-hidden border-slate-100 shadow-sm hover:shadow-md transition-all h-full flex flex-col">
                    <div className="relative h-48 sm:h-56 overflow-hidden bg-slate-100 group">
                      {item.imageUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={item.imageUrl} alt={item.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-emerald-600/5 group-hover:bg-transparent transition-colors z-10"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <BookOpen className="h-12 w-12 text-emerald-200" />
                          </div>
                        </>
                      )}
                    </div>
                    <CardContent className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 mb-3">
                        <span className="bg-emerald-50 px-2 py-1 rounded-md">Berita</span>
                        <span className="text-slate-400">• {item.createdAt ? new Date(item.createdAt).toLocaleDateString('id-ID') : '-'}</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-slate-600 text-sm line-clamp-3 mt-auto">
                        {item.content}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
          <Button variant="outline" className="w-full mt-8 md:hidden border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-full">
            Lihat Semua Berita
          </Button>
        </div>
      </section>

      {/* Galeri Section */}
      <section id="galeri" className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Galeri Kegiatan</h2>
            <p className="text-slate-600 text-lg">Momen-momen berharga dalam proses pembelajaran dan kegiatan siswa di SDI Asih Auladi.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {latestGalleries.length === 0 ? (
               <div className="col-span-2 md:col-span-4 text-center text-slate-500 py-10">Belum ada foto galeri.</div>
            ) : (
              latestGalleries.map((item) => (
                <div key={item.id} className="aspect-square bg-slate-100 rounded-3xl overflow-hidden relative group border border-slate-100 shadow-sm cursor-pointer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.imageUrl} alt={item.title} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <h4 className="text-white font-medium text-sm md:text-base truncate">{item.title}</h4>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-12 text-center">
            <Link href="#galeri">
              <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-full px-8">
                Lihat Galeri Lengkap
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-600"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="bg-emerald-700/30 backdrop-blur-sm border border-emerald-500/30 rounded-3xl p-8 md:p-16 text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Bergabunglah Bersama Kami</h2>
            <p className="text-emerald-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Pendaftaran Peserta Didik Baru (PPDB) Tahun Ajaran 2026/2027 telah dibuka. Daftarkan putra/putri Anda sekarang melalui sistem online kami.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/ppdb">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg bg-white text-emerald-700 hover:bg-emerald-50 rounded-full">
                  Daftar PPDB Sekarang
                </Button>
              </Link>
              <Link href="#kontak">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg border-emerald-400 bg-transparent text-white hover:bg-emerald-600 hover:border-emerald-600 hover:text-white rounded-full">
                  Hubungi Panitia
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
