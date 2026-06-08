"use client";

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
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

const roleMenus = {
  admin: [
    { name: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    { name: "Data Siswa", href: "/dashboard/admin/siswa", icon: Users },
    { name: "Data Guru", href: "/dashboard/admin/guru", icon: GraduationCap },
    { name: "Data Kelas", href: "/dashboard/admin/kelas", icon: Users },
    { name: "Mata Pelajaran", href: "/dashboard/admin/mapel", icon: BookOpen },
    { name: "Jadwal", href: "/dashboard/admin/jadwal", icon: CalendarDays },
    { name: "PPDB", href: "/dashboard/admin/ppdb", icon: FileText },
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

  const menuItems = roleMenus[currentRole];

  return (
    <aside className={cn("w-64 bg-white border-r border-slate-100 hidden md:flex flex-col h-full shadow-sm z-10 relative", className)}>
      <div className="h-16 flex items-center px-6 border-b border-slate-100 bg-emerald-50/50">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-emerald-800 tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
            <GraduationCap className="h-5 w-5" />
          </div>
          SDI Asih Auladi
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-4">
        <div className="space-y-1">
          <p className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Menu Utama
          </p>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-emerald-50 text-emerald-700 shadow-sm shadow-emerald-100" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-emerald-600" : "text-slate-400")} />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
      
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 px-2">
            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
              {currentRole.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-900 capitalize">{currentRole} User</span>
              <span className="text-xs text-slate-500 capitalize">{currentRole}</span>
            </div>
          </div>
          <Link 
            href="/login" 
            onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); }} 
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 hover:text-rose-700 rounded-xl transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </Link>
        </div>
      </div>
    </aside>
  );
}
