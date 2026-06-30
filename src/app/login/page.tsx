"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, HeartHandshake } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login gagal. Periksa kembali email dan password Anda.");
      }

      // Redirect based on role
      if (data.role === "admin") {
        router.push("/dashboard/admin");
      } else if (data.role === "guru") {
        router.push("/dashboard/guru");
      } else if (data.role === "siswa") {
        router.push("/dashboard/siswa");
      } else if (data.role === "wali") {
        router.push("/dashboard/wali");
      } else {
        router.push("/");
      }
      
    } catch (err: unknown) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col px-4 md:px-8 lg:px-16 xl:px-24 justify-center relative">
        <Link href="/" className="absolute top-8 left-4 md:left-8 lg:left-16 inline-flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-teal-600 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Link>

        <div className="w-full max-w-sm mx-auto mt-16 lg:mt-0">
          <div className="mb-10">
            <img src="/logo-asih-auladi.png" alt="SDI Asih Auladi" className="h-12 w-auto mb-6" />
            <h1 className="font-heading text-3xl font-bold text-stone-900 mb-2">Selamat Datang</h1>
            <p className="text-stone-500">Masuk ke portal akademik SDI Asih Auladi.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm flex items-start gap-3">
              <div className="mt-0.5">⚠️</div>
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2.5">
              <Label htmlFor="email" className="text-stone-700">Alamat Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="email@contoh.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-stone-50 border-stone-200"
              />
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-stone-700">Password</Label>
                <Link href="#" className="text-sm font-medium text-teal-600 hover:text-teal-700">Lupa Password?</Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-stone-50 border-stone-200"
              />
            </div>
            <Button type="submit" className="w-full h-12 text-[15px] font-semibold mt-4" disabled={loading}>
              {loading ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Memproses...</>
              ) : (
                "Masuk ke Portal"
              )}
            </Button>
          </form>

          {/* Demo Credentials Helper */}
          <div className="mt-12 bg-sky-50 border border-sky-100 p-5 rounded-2xl text-sm text-sky-900">
            <p className="font-bold mb-3 font-heading text-[15px]">Data Akses Demo:</p>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
              <div><span className="font-semibold">Admin:</span><br/>admin@sdiasih.com</div>
              <div><span className="font-semibold">Guru:</span><br/>ahmad@sdiasih.com</div>
              <div><span className="font-semibold">Siswa:</span><br/>budi@siswa.sdiasih.com</div>
              <div><span className="font-semibold">Wali:</span><br/>ayah.budi@gmail.com</div>
            </div>
            <p className="mt-4 pt-3 border-t border-sky-200/50 text-xs italic font-medium">Password universal: password123</p>
          </div>
        </div>
      </div>

      {/* Right Image Section */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-stone-100 overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-teal-900/90 mix-blend-multiply z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="absolute inset-0 z-20 opacity-30" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '40px 40px' }} />
        
        <div className="relative z-30 p-12 max-w-lg text-center flex flex-col items-center">
          <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mb-8 border border-white/20">
            <HeartHandshake className="w-12 h-12 text-teal-100" />
          </div>
          <h2 className="font-heading text-4xl font-bold text-white mb-6 leading-tight">
            Membangun Generasi Rabbani
          </h2>
          <p className="text-teal-50 text-lg leading-relaxed">
            Sistem Informasi Terpadu SDI Asih Auladi memfasilitasi komunikasi dan kolaborasi yang efektif antara sekolah, siswa, dan orang tua.
          </p>
        </div>
      </div>
    </div>
  );
}
