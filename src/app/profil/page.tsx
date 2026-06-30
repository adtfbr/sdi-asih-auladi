import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, Trophy, Building2, HeartHandshake } from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "Profil Sekolah | SDI Asih Auladi",
};

export default function ProfilPage() {
  return (
    <div className="py-16 md:py-24 bg-stone-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <Badge variant="success" className="px-4 py-1.5 text-[13px]">
            Sejarah & Profil
          </Badge>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-stone-900 tracking-tight leading-tight">
            Mengenal Lebih Dekat SDI Asih Auladi
          </h1>
          <p className="text-lg text-stone-600 leading-relaxed">
            Sejak didirikan, SDI Asih Auladi terus berkomitmen mencetak generasi yang unggul dalam ilmu pengetahuan dan kuat dalam karakter keislaman.
          </p>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="relative aspect-[4/3] w-full rounded-[32px] overflow-hidden shadow-2xl ring-1 ring-stone-900/5">
            <div className="absolute inset-0 bg-teal-900/20 mix-blend-multiply z-10" />
            <img 
              src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop" 
              alt="Kegiatan Sekolah"
              className="object-cover w-full h-full"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-[24px] shadow-xl z-20 hidden md:flex items-center gap-4">
              <div className="bg-teal-50 p-3 rounded-2xl text-teal-600">
                <HeartHandshake className="w-8 h-8" />
              </div>
              <div>
                <div className="font-heading font-bold text-2xl text-stone-900">14+</div>
                <div className="text-sm text-stone-500 font-medium">Tahun Mengabdi</div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-stone-900 leading-snug">Berakar pada Nilai, Tumbuh untuk Masa Depan</h2>
            <div className="prose prose-stone prose-lg max-w-none text-stone-600">
              <p className="leading-relaxed">
                SDI Asih Auladi didirikan pada tahun 2010 berawal dari kepedulian para tokoh masyarakat dan ulama setempat terhadap pentingnya pendidikan dasar yang mengintegrasikan nilai-nilai keislaman secara menyeluruh ke dalam kurikulum pendidikan formal.
              </p>
              <p className="leading-relaxed">
                Berawal dari hanya 2 ruang kelas dengan 45 siswa angkatan pertama, atas izin Allah SWT dan dukungan masyarakat, sekolah ini terus berkembang. Saat ini SDI Asih Auladi memiliki belasan ruang kelas dan fasilitas yang lengkap untuk mendukung proses kegiatan belajar mengajar yang nyaman, modern, dan islami.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 pt-8 mt-4 border-t border-stone-200">
              <div>
                <div className="font-heading text-4xl font-bold text-teal-600 mb-2">450+</div>
                <div className="text-sm font-semibold text-stone-500 uppercase tracking-wider">Siswa Aktif</div>
              </div>
              <div>
                <div className="font-heading text-4xl font-bold text-teal-600 mb-2">1200+</div>
                <div className="text-sm font-semibold text-stone-500 uppercase tracking-wider">Alumni Lulus</div>
              </div>
            </div>
          </div>
        </div>

        {/* Keunggulan */}
        <div className="mb-20 pt-10">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-stone-900">Mengapa Memilih Kami?</h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
              Kami menawarkan lingkungan pendidikan yang holistik, aman, dan memotivasi siswa untuk terus berkembang di bawah bimbingan nilai Islami.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <FeatureCard 
              icon={<BookOpen className="h-7 w-7 text-teal-600" />}
              title="Kurikulum Terpadu"
              desc="Menggabungkan kurikulum nasional merdeka belajar dengan kurikulum diniyah khas kepesantrenan."
            />
            <FeatureCard 
              icon={<Users className="h-7 w-7 text-teal-600" />}
              title="Pengajar Kompeten"
              desc="Dididik oleh guru-guru tersertifikasi yang ahli di bidangnya dan berdedikasi tinggi."
            />
            <FeatureCard 
              icon={<Building2 className="h-7 w-7 text-teal-600" />}
              title="Fasilitas Modern"
              desc="Ruang kelas representatif, lab komputer, perpustakaan digital, dan sarana olahraga memadai."
            />
            <FeatureCard 
              icon={<Trophy className="h-7 w-7 text-teal-600" />}
              title="Pembinaan Bakat"
              desc="Beragam kegiatan ekstrakurikuler untuk menggali dan mengembangkan potensi optimal setiap siswa."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <Card className="border-none shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-[24px] bg-white">
      <CardContent className="p-8 flex flex-col items-center text-center">
        <div className="h-16 w-16 rounded-[20px] bg-teal-50 flex items-center justify-center mb-6 border border-teal-100">
          {icon}
        </div>
        <h3 className="font-heading text-xl font-bold text-stone-900 mb-3">{title}</h3>
        <p className="text-stone-600 leading-relaxed text-[15px]">
          {desc}
        </p>
      </CardContent>
    </Card>
  );
}
