"use client";

import * as React from "react";
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
  
  const [user, setUser] = React.useState<{name: string, email: string, role: string} | null>(null);

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

  // Simple title mapping
  const titleMap: Record<string, string> = {
    "/dashboard/admin": "Dashboard Akademik",
    "/dashboard/guru": "Portal Guru",
    "/dashboard/siswa": "Portal Siswa",
    "/dashboard/wali": "Portal Wali Murid",
  };
  const title = titleMap[pathname || ""] || "Dashboard";

  return (
    <header className="h-16 border-b border-stone-100 bg-white flex items-center justify-between px-4 md:px-6 sticky top-0 z-20 shadow-sm shadow-stone-100/50">
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger */}
        <Sheet>
          <SheetTrigger render={
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5 text-stone-600" />
            </Button>
          } />
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar className="flex border-none w-full" />
          </SheetContent>
        </Sheet>
        
        <h1 className="text-xl font-bold text-stone-900 tracking-tight hidden sm:block">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-stone-400" />
          <input 
            type="text" 
            placeholder="Cari..." 
            className="pl-9 pr-4 py-2 w-64 rounded-full bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
          />
        </div>
        
        <Button variant="ghost" size="icon" className="relative text-stone-500 hover:text-stone-900">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </Button>
        
        <div className="h-8 w-px bg-stone-200 hidden sm:block"></div>

        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" className="relative h-10 w-10 rounded-full" />}>
            <Avatar className="h-10 w-10 border-2 border-teal-100">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user ? user.name : 'User'}&backgroundColor=10b981`} alt="User" />
              <AvatarFallback className="bg-teal-100 text-teal-700">
                {user ? user.name.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none line-clamp-1">{user ? user.name : "User"}</p>
                <p className="text-xs leading-none text-stone-500">
                  {user ? user.email : "user@sdi-asih-auladi.sch.id"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href={`/dashboard/${user ? user.role : 'admin'}/profile`} className="cursor-pointer" />}>
              Profil Saya
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href={`/dashboard/${user ? user.role : 'admin'}/settings`} className="cursor-pointer" />}>
              Pengaturan
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={async () => {
                await fetch('/api/auth/logout', { method: 'POST' });
                window.location.href = '/login';
              }}
              className="cursor-pointer text-red-600 focus:text-red-600"
            >
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
