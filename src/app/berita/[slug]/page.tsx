import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, ArrowLeft, User } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Detail Berita | SDI Asih Auladi",
};

// Dummy data detail
const DUMMY_CONTENT: Record<string, any> = {
  "ppdb-2026-dibuka": {
    title: "Penerimaan Peserta Didik Baru (PPDB) Tahun Ajaran 2026/2027 Resmi Dibuka",
    category: "Pengumuman",
    date: "10 Juni 2026",
    author: "Panitia PPDB",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2000&auto=format&fit=crop",
    content: `
      <p>Assalamu'alaikum Warahmatullahi Wabarakatuh.</p>
      <p>Kabar gembira bagi para orang tua yang sedang mencari sekolah dasar Islam berkualitas untuk putra/putrinya. SDI Asih Auladi secara resmi membuka Pendaftaran Peserta Didik Baru (PPDB) untuk Tahun Ajaran 2026/2027.</p>
      <h2>Kuota Terbatas</h2>
      <p>Untuk menjaga kualitas pembelajaran dan efektivitas pendidikan, kami membatasi penerimaan siswa baru tahun ini hanya sebanyak 120 siswa (terbagi dalam 4 kelas).</p>
      <h2>Syarat Pendaftaran</h2>
      <ul>
        <li>Berusia minimal 6 tahun pada bulan Juli 2026.</li>
        <li>Mengisi formulir pendaftaran secara online melalui website.</li>
        <li>Menyerahkan fotokopi Akta Kelahiran dan Kartu Keluarga (KK).</li>
        <li>Membayar biaya pendaftaran sebesar Rp 250.000,-.</li>
      </ul>
      <p>Untuk informasi lebih lanjut dan pendaftaran, silakan kunjungi halaman <a href="/ppdb" class="text-emerald-600 font-semibold underline">PPDB Online</a> atau hubungi nomor admin kami.</p>
      <p>Wassalamu'alaikum Warahmatullahi Wabarakatuh.</p>
    `
  }
};

export default function BeritaDetailPage({ params }: { params: { slug: string } }) {
  const news = DUMMY_CONTENT[params.slug];

  if (!news) {
    // For demo purposes, if slug not found, we just show a generic one
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Berita belum tersedia (Demo)</h1>
        <Link href="/berita">
          <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/> Kembali ke Berita</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <Link href="/berita" className="inline-flex items-center text-slate-500 hover:text-emerald-600 mb-8 transition-colors font-medium">
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Indeks Berita
        </Link>

        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
          {/* Hero Image */}
          <div className="relative h-[300px] md:h-[450px] w-full">
            <img 
              src={news.image} 
              alt={news.title}
              className="object-cover w-full h-full"
            />
          </div>

          <div className="p-8 md:p-12 lg:p-16">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none px-3 py-1">
                {news.category}
              </Badge>
              <div className="flex items-center text-slate-500 text-sm gap-4">
                <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4" /> {news.date}</span>
                <span className="flex items-center gap-1.5"><User className="h-4 w-4" /> {news.author}</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-10 leading-tight">
              {news.title}
            </h1>

            <div 
              className="prose prose-lg prose-emerald max-w-none text-slate-700
                prose-headings:text-slate-900 prose-headings:font-bold prose-h2:text-2xl
                prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline
                prose-li:marker:text-emerald-500"
              dangerouslySetInnerHTML={{ __html: news.content }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
