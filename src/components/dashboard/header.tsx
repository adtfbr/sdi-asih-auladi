"use client";

import { usePathname } from "next/navigation";
import { Bell, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import Link from "next/link";

export function Header() {
  const pathname = usePathname();
  
  // Determine role based on the URL path for mockup purposes
  let currentRole = "admin";
  if (pathname?.includes("/dashboard/guru")) currentRole = "guru";
  else if (pathname?.includes("/dashboard/siswa")) currentRole = "siswa";
  else if (pathname?.includes("/dashboard/wali")) currentRole = "wali";

  // Simple title mapping
  const titleMap: Record<string, string> = {
    "/dashboard/admin": "Dashboard Akademik",
    "/dashboard/guru": "Portal Guru",
    "/dashboard/siswa": "Portal Siswa",
    "/dashboard/wali": "Portal Wali Murid",
  };
  const title = titleMap[pathname || ""] || "Dashboard";

  return (
    <header className="h-16 border-b border-slate-100 bg-white flex items-center justify-between px-4 md:px-6 sticky top-0 z-20 shadow-sm shadow-slate-100/50">
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger */}
        <Sheet>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
            <Menu className="h-5 w-5 text-slate-600" />
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar />
          </SheetContent>
        </Sheet>
        
        <h1 className="text-xl font-bold text-slate-900 tracking-tight hidden sm:block">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari..." 
            className="pl-9 pr-4 py-2 w-64 rounded-full bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>
        
        <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-slate-900">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </Button>
        
        <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" className="relative h-10 w-10 rounded-full" />}>
            <Avatar className="h-10 w-10 border-2 border-emerald-100">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${currentRole}&backgroundColor=10b981`} alt="User" />
              <AvatarFallback className="bg-emerald-100 text-emerald-700">
                {currentRole.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none capitalize">{currentRole} User</p>
                <p className="text-xs leading-none text-slate-500">
                  {currentRole}@sdi-asih-auladi.sch.id
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href={`/dashboard/${currentRole}/profile`} className="cursor-pointer" />}>
              Profil Saya
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href={`/dashboard/${currentRole}/settings`} className="cursor-pointer" />}>
              Pengaturan
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href="/" className="cursor-pointer text-red-600 focus:text-red-600" />}>
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
