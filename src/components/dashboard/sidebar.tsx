"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  CalendarDays,
  Settings,
  FileText,
  MessageSquare,
  ClipboardList,
  LogOut,
  Newspaper,
  Image as ImageIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

const roleMenus = {
  admin: [
    { name: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    { name: "Data Siswa", href: "/dashboard/admin/siswa", icon: Users },
    { name: "Data Wali Murid", href: "/dashboard/admin/wali", icon: Users },
    { name: "Data Guru", href: "/dashboard/admin/guru", icon: GraduationCap },
    { name: "Data Kelas", href: "/dashboard/admin/kelas", icon: Users },
    { name: "Mata Pelajaran", href: "/dashboard/admin/mapel", icon: BookOpen },
    { name: "Jadwal", href: "/dashboard/admin/jadwal", icon: CalendarDays },
    { name: "Pengumuman", href: "/dashboard/admin/pengumuman", icon: MessageSquare },
    { name: "Berita", href: "/dashboard/admin/berita", icon: Newspaper },
    { name: "Galeri", href: "/dashboard/admin/galeri", icon: ImageIcon },
    { name: "Tahun Ajaran", href: "/dashboard/admin/tahun-ajaran", icon: CalendarDays },
    { name: "Pengaturan", href: "/dashboard/admin/settings", icon: Settings },
  ],
  guru: [
    { name: "Dashboard", href: "/dashboard/guru", icon: LayoutDashboard },
    { name: "Jadwal Mengajar", href: "/dashboard/guru/jadwal", icon: CalendarDays },
    { name: "Absensi", href: "/dashboard/guru/absensi", icon: ClipboardList },
    { name: "Input Nilai", href: "/dashboard/guru/nilai", icon: FileText },
    { name: "Materi", href: "/dashboard/guru/materi", icon: BookOpen },
  ],
  siswa: [
    { name: "Dashboard", href: "/dashboard/siswa", icon: LayoutDashboard },
    { name: "Jadwal Pelajaran", href: "/dashboard/siswa/jadwal", icon: CalendarDays },
    { name: "Nilai & Rapor", href: "/dashboard/siswa/nilai", icon: FileText },
    { name: "Materi Belajar", href: "/dashboard/siswa/materi", icon: BookOpen },
    { name: "Pengumuman", href: "/dashboard/siswa/pengumuman", icon: MessageSquare },
  ],
  wali: [
    { name: "Dashboard", href: "/dashboard/wali", icon: LayoutDashboard },
    { name: "Absensi Anak", href: "/dashboard/wali/absensi", icon: ClipboardList },
    { name: "Nilai & Rapor", href: "/dashboard/wali/nilai", icon: FileText },
    { name: "Pengumuman", href: "/dashboard/wali/pengumuman", icon: MessageSquare },
  ]
};

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  
  // Determine role based on the URL path for mockup purposes
  let currentRole: keyof typeof roleMenus = "admin";
  if (pathname?.includes("/dashboard/guru")) currentRole = "guru";
  else if (pathname?.includes("/dashboard/siswa")) currentRole = "siswa";
  else if (pathname?.includes("/dashboard/wali")) currentRole = "wali";

  const [user, setUser] = React.useState<{name: string, role: string} | null>(null);

  React.useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.name) {
          setUser(data);
        }
      })
      .catch(() => {});
  }, []);

  const menuItems = roleMenus[currentRole];

  return (
    <aside className={cn("w-64 bg-white border-r border-stone-100 hidden md:flex flex-col h-full shadow-sm z-10 relative", className)}>
      <div className="h-16 flex items-center px-5 border-b border-stone-100 bg-white">
        <Link href="/" className="flex items-center gap-2 font-heading font-bold text-[17px] text-teal-800 tracking-tight">
          <img src="/logo-asih-auladi.png" alt="Logo" className="w-8 h-auto" />
          <span className="truncate">SDI Asih Auladi</span>
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-4">
        <div className="space-y-1">
          <p className="px-2 text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">
            Menu Utama
          </p>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                  isActive 
                    ? "bg-teal-50 text-teal-700 shadow-sm" 
                    : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                )}
              >
                <item.icon className={cn("h-5 w-5 transition-colors", isActive ? "text-teal-600" : "text-stone-400 group-hover:text-stone-600")} />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
      
      <div className="p-4 border-t border-stone-100 bg-white">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 px-2">
            <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold border border-teal-200">
              {user ? user.name.charAt(0).toUpperCase() : currentRole.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold text-stone-900 line-clamp-1">{user ? user.name : `${currentRole} User`}</span>
              <span className="text-[11px] text-stone-500 capitalize">{user ? user.role : currentRole}</span>
            </div>
          </div>
          <button 
            onClick={async () => { 
              await fetch('/api/auth/logout', { method: 'POST' }); 
              window.location.href = '/login';
            }} 
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-sm font-semibold text-rose-600 bg-white border border-rose-200 hover:bg-rose-50 rounded-xl transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </button>
        </div>
      </div>
    </aside>
  );
}
