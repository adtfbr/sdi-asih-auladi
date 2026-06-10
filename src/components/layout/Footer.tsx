import Link from "next/link";
import { MapPin, Phone, Mail, GraduationCap } from "lucide-react";

export function Footer({ settings }: { settings?: any }) {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-8 w-8 text-emerald-400" />
              <span className="text-xl font-bold text-white">
                {settings?.schoolName || "SDI Asih Auladi"}
              </span>
            </Link>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Membentuk generasi qur&apos;ani yang cerdas, berakhlak mulia, dan siap menghadapi tantangan masa depan.
            </p>

          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Tautan Cepat</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="hover:text-emerald-400 transition-colors">Beranda</Link></li>
              <li><Link href="/profil" className="hover:text-emerald-400 transition-colors">Profil Sekolah</Link></li>
              <li><Link href="/berita" className="hover:text-emerald-400 transition-colors">Berita & Pengumuman</Link></li>
              <li><Link href="/galeri" className="hover:text-emerald-400 transition-colors">Galeri Kegiatan</Link></li>
              <li><Link href="/ppdb" className="hover:text-emerald-400 transition-colors">PPDB Online</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Portal Akademik</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/login" className="hover:text-emerald-400 transition-colors">Portal Guru</Link></li>
              <li><Link href="/login" className="hover:text-emerald-400 transition-colors">Portal Siswa</Link></li>
              <li><Link href="/login" className="hover:text-emerald-400 transition-colors">Portal Wali Murid</Link></li>
              <li><Link href="/login" className="hover:text-emerald-400 transition-colors">Admin Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Kontak Kami</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{settings?.address || "Jl. Pendidikan No. 123, Kota Cerdas"}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-emerald-400 shrink-0" />
                <span>+62 21 1234 5678</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-emerald-400 shrink-0" />
                <span>info@sdiasih-auladi.sch.id</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} {settings?.schoolName || "SDI Asih Auladi"}. Hak Cipta Dilindungi.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-emerald-400 transition-colors">Kebijakan Privasi</Link>
            <Link href="#" className="hover:text-emerald-400 transition-colors">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
