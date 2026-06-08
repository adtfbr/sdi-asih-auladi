"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Loader2, ArrowLeft } from "lucide-react";
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <GraduationCap className="h-10 w-10 text-emerald-600" />
            <span className="text-2xl font-bold tracking-tight text-emerald-900">
              SDI Asih Auladi
            </span>
          </Link>
        </div>

        <Card className="border-slate-200 shadow-xl shadow-slate-200/50">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-slate-900">Portal Login</CardTitle>
            <CardDescription className="text-center text-slate-500">
              Masukkan email dan password Anda untuk mengakses sistem informasi sekolah.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-6 p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-lg text-sm text-center">
                {error}
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@sdiasih.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-slate-50"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="text-xs font-medium text-emerald-600 hover:text-emerald-700">Lupa Password?</Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-slate-50"
                />
              </div>
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 h-11 text-base mt-2" disabled={loading}>
                {loading ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Memproses...</>
                ) : (
                  "Masuk"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-slate-100 pt-6">
            <Link href="/" className="text-sm font-medium text-slate-500 hover:text-emerald-600 flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Beranda
            </Link>
          </CardFooter>
        </Card>

        {/* Demo Credentials Helper */}
        <div className="mt-8 bg-blue-50 border border-blue-100 p-4 rounded-xl text-sm text-blue-800">
          <p className="font-bold mb-2">Akun Demo:</p>
          <ul className="space-y-1 list-disc pl-5">
            <li>Admin: admin@sdiasih.com</li>
            <li>Guru: ahmad@sdiasih.com</li>
            <li>Siswa: budi@siswa.sdiasih.com</li>
            <li>Wali: ayah.budi@gmail.com</li>
          </ul>
          <p className="mt-2 text-xs italic">Password: password123</p>
        </div>
      </div>
    </div>
  );
}
