"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

const navLinks = [
  { name: "Beranda", href: "/" },
  { name: "Profil", href: "#profil" },
  { name: "Akademik", href: "#akademik" },
  { name: "Berita", href: "#berita" },
  { name: "Galeri", href: "#galeri" },
  { name: "Kontak", href: "#kontak" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-emerald-600" />
          <span className="text-xl font-bold tracking-tight text-emerald-900">
            SDI Asih Auladi
          </span>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50">Login</Button>
          </Link>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6">
            PPDB Online
          </Button>
        </div>

        {/* Mobile Nav */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </SheetTrigger>
          <SheetContent side="right" className="flex flex-col justify-between">
            <SheetTitle className="sr-only">Navigasi Utama</SheetTitle>
            <div>
              <Link
                href="/"
                className="flex items-center gap-2 mb-8"
                onClick={() => setIsOpen(false)}
              >
                <GraduationCap className="h-8 w-8 text-emerald-600" />
                <span className="text-xl font-bold text-emerald-900">SDI Asih Auladi</span>
              </Link>
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-lg font-medium text-slate-700 hover:text-emerald-600"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex flex-col gap-2 mt-auto pb-6">
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full">Login Portal</Button>
              </Link>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                PPDB Online
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
