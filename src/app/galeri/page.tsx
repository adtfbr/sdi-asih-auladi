import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Galeri Kegiatan | SDI Asih Auladi",
};

const DUMMY_GALLERY = [
  { id: 1, title: "Belajar Mengajar di Kelas", category: "Akademik", image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop" },
  { id: 2, title: "Lomba Cerdas Cermat", category: "Prestasi", image: "https://images.unsplash.com/photo-1544604862-2f3b92f444c1?q=80&w=800&auto=format&fit=crop" },
  { id: 3, title: "Ekskul Memanah", category: "Ekstrakurikuler", image: "https://images.unsplash.com/photo-1590409949688-6ea5ba3f350c?q=80&w=800&auto=format&fit=crop" },
  { id: 4, title: "Praktikum IPA", category: "Akademik", image: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800&auto=format&fit=crop" },
  { id: 5, title: "Upacara Bendera", category: "Kegiatan", image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop" },
  { id: 6, title: "Tadarus Pagi", category: "Keagamaan", image: "https://images.unsplash.com/photo-1584553421349-355fbac8c571?q=80&w=800&auto=format&fit=crop" },
];

export default function GaleriPage() {
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

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DUMMY_GALLERY.map((item) => (
            <div key={item.id} className="group relative rounded-3xl overflow-hidden aspect-square bg-slate-100 shadow-sm cursor-pointer">
              <img 
                src={item.image} 
                alt={item.title}
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <Badge className="w-fit mb-3 bg-emerald-500 hover:bg-emerald-500 border-none text-white">
                  {item.category}
                </Badge>
                <h3 className="text-white text-xl font-bold">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
