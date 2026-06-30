import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Target, Heart } from "lucide-react";

export const metadata = {
  title: "Visi Misi & Tujuan | SDI Asih Auladi",
};

export default function VisiMisiPage() {
  return (
    <div className="py-12 md:py-20 bg-white min-h-screen">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="bg-teal-100 text-teal-700 hover:bg-teal-100 mb-4 border-teal-200">
            Arah & Tujuan
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-stone-900 mb-6 tracking-tight">
            Visi, Misi, & Tujuan
          </h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Menjadi kompas panduan seluruh aktivitas pembelajaran dan pembinaan karakter di SDI Asih Auladi.
          </p>
        </div>

        <div className="space-y-16">
          {/* Visi */}
          <div className="relative bg-stone-50 rounded-3xl p-8 md:p-12 border border-stone-100 shadow-sm overflow-hidden">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 opacity-5">
              <Target className="h-64 w-64 text-teal-900" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 rounded-xl bg-teal-600 flex items-center justify-center text-white shrink-0">
                  <Target className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-bold text-stone-900">Visi Sekolah</h2>
              </div>
              <p className="text-2xl md:text-3xl font-medium text-teal-800 leading-relaxed italic border-l-4 border-teal-500 pl-6">
                "Menjadi lembaga pendidikan dasar Islam terdepan yang mencetak generasi qur'ani, cerdas, mandiri, dan berwawasan global."
              </p>
            </div>
          </div>

          {/* Misi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0">
                  <Heart className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-bold text-stone-900">Misi Kami</h2>
              </div>
              <div className="space-y-4">
                {[
                  "Menyelenggarakan pendidikan dasar yang mengintegrasikan nilai-nilai Islam dalam setiap aspek pembelajaran.",
                  "Membentuk karakter siswa yang berakhlak mulia, disiplin, dan memiliki kepedulian sosial tinggi.",
                  "Meningkatkan kualitas akademik melalui pembelajaran aktif, inovatif, kreatif, dan menyenangkan (PAIKEM).",
                  "Mengembangkan potensi minat, bakat, dan kreativitas siswa melalui kegiatan ekstrakurikuler yang beragam.",
                  "Membangun kemitraan yang kuat antara sekolah, orang tua, dan masyarakat."
                ].map((misi, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1 shrink-0">
                      <CheckCircle2 className="h-5 w-5 text-teal-500" />
                    </div>
                    <p className="text-stone-700 leading-relaxed text-lg">{misi}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tujuan */}
            <div className="bg-stone-900 rounded-3xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden">
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2132&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-overlay" />
               <div className="relative z-10">
                <h2 className="text-3xl font-bold text-white mb-8 border-b border-stone-700 pb-4">Tujuan Lulusan</h2>
                <ul className="space-y-6">
                  <li className="flex flex-col gap-2">
                    <span className="font-semibold text-teal-400 text-lg">1. Aqidah Kuat & Akhlak Mulia</span>
                    <span className="text-stone-300">Siswa memiliki keyakinan yang lurus dan mengaplikasikan adab islami dalam kehidupan sehari-hari.</span>
                  </li>
                  <li className="flex flex-col gap-2">
                    <span className="font-semibold text-teal-400 text-lg">2. Hafal Juz 30</span>
                    <span className="text-stone-300">Target kelulusan adalah siswa mampu menghafal dengan lancar Juz 30 beserta tajwidnya.</span>
                  </li>
                  <li className="flex flex-col gap-2">
                    <span className="font-semibold text-teal-400 text-lg">3. Berprestasi Akademik</span>
                    <span className="text-stone-300">Meraih nilai rata-rata ujian di atas standar nasional dan mampu bersaing masuk ke jenjang berikutnya yang favorit.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
