"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

const navLinks = [
  { name: "Beranda", href: "/" },
  { name: "Profil", href: "/profil" },
  { name: "Visi Misi", href: "/visi-misi" },
  { name: "Berita", href: "/berita" },
  { name: "Galeri", href: "/galeri" },
  { name: "Kontak", href: "/kontak" },
];

export function Navbar({ settings }: { settings?: any }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200/60 bg-white/90 backdrop-blur-lg shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex flex-1 items-center justify-start">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo-asih-auladi.png" alt="Logo SDI Asih Auladi" className="h-8 w-auto shrink-0" />
            <span className="font-heading text-xl font-bold tracking-tight text-teal-800 truncate max-w-[200px] lg:max-w-xs">
              {settings?.schoolName || "SDI Asih Auladi"}
            </span>
          </Link>
        </div>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-none gap-6 items-center justify-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-stone-600 hover:text-teal-600 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-4">
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-teal-700 hover:text-teal-800 hover:bg-teal-50">Login</Button>
            </Link>
            {false && (!settings || settings.ppdbStatus === "open") && (
              <Link href="/ppdb">
                <Button className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl px-6">
                  PPDB Online
                </Button>
              </Link>
            )}
          </div>

        {/* Mobile Nav */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger render={
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6 text-stone-700" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          } />
          <SheetContent side="right" className="flex flex-col w-[300px] sm:w-[350px] p-6 pt-16 bg-white overflow-y-auto">
            <SheetTitle className="sr-only">Navigasi Utama</SheetTitle>
            <div className="flex-1">
              <Link
                href="/"
                className="flex items-center gap-3 mb-10"
                onClick={() => setIsOpen(false)}
              >
                <img src="/logo-asih-auladi.png" alt="Logo SDI Asih Auladi" className="h-10 w-auto" />
                <span className="font-heading text-xl font-bold text-teal-800 leading-tight">SDI Asih Auladi</span>
              </Link>
              <nav className="flex flex-col space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-lg font-medium text-stone-700 hover:text-teal-600 transition-colors py-3 border-b border-stone-100 last:border-0"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex flex-col gap-3 mt-10">
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full h-12 text-base rounded-xl border-stone-200">Login Portal</Button>
              </Link>
              {false && (!settings || settings.ppdbStatus === "open") && (
                <Link href="/ppdb" onClick={() => setIsOpen(false)}>
                  <Button className="w-full h-12 text-base rounded-xl bg-teal-600 hover:bg-teal-700 text-white">
                    PPDB Online
                  </Button>
                </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>
        </div>
      </div>
    </header>
  );
}
