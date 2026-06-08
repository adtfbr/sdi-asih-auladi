import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, Trophy, GraduationCap, Building2 } from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "Profil Sekolah | SDI Asih Auladi",
};

export default function ProfilPage() {
  return (
    <div className="py-12 md:py-20 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 mb-4 border-emerald-200">
            Sejarah & Profil
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            Mengenal Lebih Dekat SDI Asih Auladi
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Sejak didirikan, SDI Asih Auladi terus berkomitmen mencetak generasi yang unggul dalam ilmu pengetahuan dan kuat dalam karakter keislaman.
          </p>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="relative h-[400px] w-full rounded-3xl overflow-hidden shadow-xl ring-1 ring-slate-900/5">
            <div className="absolute inset-0 bg-emerald-900/20 mix-blend-multiply z-10" />
            <img 
              src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop" 
              alt="Gedung Sekolah"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-900">Sejarah Singkat</h2>
            <div className="prose prose-slate prose-lg">
              <p>
                SDI Asih Auladi didirikan pada tahun 2010 berawal dari kepedulian para tokoh masyarakat dan ulama setempat terhadap pentingnya pendidikan dasar yang mengintegrasikan nilai-nilai keislaman secara menyeluruh.
              </p>
              <p>
                Berawal dari hanya 2 ruang kelas dengan 45 siswa angkatan pertama, atas izin Allah SWT dan dukungan masyarakat, sekolah ini terus berkembang. Saat ini SDI Asih Auladi memiliki fasilitas yang lengkap dan representatif untuk mendukung proses kegiatan belajar mengajar yang nyaman dan modern.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-200">
              <div>
                <div className="text-4xl font-bold text-emerald-600 mb-2">14+</div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Tahun Pengalaman</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-emerald-600 mb-2">1200+</div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Alumni Sukses</div>
              </div>
            </div>
          </div>
        </div>

        {/* Keunggulan */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Mengapa Memilih Kami?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Kami menawarkan lingkungan pendidikan yang holistik, aman, dan memotivasi siswa untuk terus berkembang.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={<BookOpen className="h-6 w-6 text-emerald-600" />}
              title="Kurikulum Terpadu"
              desc="Menggabungkan kurikulum nasional merdeka belajar dengan kurikulum diniyah khas pesantren."
            />
            <FeatureCard 
              icon={<Users className="h-6 w-6 text-emerald-600" />}
              title="Pengajar Kompeten"
              desc="Dididik oleh guru-guru tersertifikasi yang ahli di bidangnya dan berdedikasi tinggi."
            />
            <FeatureCard 
              icon={<Building2 className="h-6 w-6 text-emerald-600" />}
              title="Fasilitas Modern"
              desc="Ruang kelas ber-AC, laboratorium komputer, perpustakaan digital, dan sarana olahraga."
            />
            <FeatureCard 
              icon={<Trophy className="h-6 w-6 text-emerald-600" />}
              title="Pembinaan Bakat"
              desc="Beragam kegiatan ekstrakurikuler untuk menggali dan mengembangkan potensi optimal siswa."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <Card className="border-slate-100 shadow-sm hover:shadow-md transition-all hover:border-emerald-200">
      <CardContent className="p-6">
        <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600 leading-relaxed text-sm">
          {desc}
        </p>
      </CardContent>
    </Card>
  );
}
