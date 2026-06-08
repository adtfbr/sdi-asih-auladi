import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Send, Clock } from "lucide-react";

export const metadata = {
  title: "Hubungi Kami | SDI Asih Auladi",
};

export default function KontakPage() {
  return (
    <div className="py-12 md:py-20 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 mb-4 border-emerald-200">
            Pusat Informasi
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            Hubungi Kami
          </h1>
          <p className="text-lg text-slate-600">
            Kami siap melayani dan menjawab pertanyaan Anda seputar informasi akademik, pendaftaran, maupun kerja sama.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-slate-100 shadow-sm bg-white">
              <CardContent className="p-8 space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Informasi Kontak</h3>
                  <ul className="space-y-6">
                    <li className="flex gap-4">
                      <div className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 mb-1">Alamat Sekolah</div>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          Jl. Pendidikan No. 123, Kota Islamic,<br />Provinsi Jawa Barat 12345
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 mb-1">Telepon & WhatsApp</div>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          +62 21 1234 5678<br />
                          +62 812 3456 7890 (WA)
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <div className="h-10 w-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 mb-1">Email</div>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          info@sdiasih-auladi.sch.id<br />
                          ppdb@sdiasih-auladi.sch.id
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <div className="h-10 w-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 mb-1">Jam Operasional</div>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          Senin - Jumat: 07.00 - 15.00 WIB<br />
                          Sabtu: 08.00 - 12.00 WIB
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-slate-100 shadow-sm bg-white h-full">
              <CardContent className="p-8 md:p-10">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Kirim Pesan</h3>
                <p className="text-slate-500 mb-8">Silakan isi formulir di bawah ini, tim kami akan membalas pesan Anda maksimal 1x24 jam.</p>
                
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nama Lengkap</Label>
                      <Input id="name" placeholder="Masukkan nama Anda" className="bg-slate-50 border-slate-200 h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Nomor HP/WhatsApp</Label>
                      <Input id="phone" placeholder="Contoh: 08123456789" className="bg-slate-50 border-slate-200 h-12" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Alamat Email</Label>
                    <Input id="email" type="email" placeholder="email@contoh.com" className="bg-slate-50 border-slate-200 h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subjek</Label>
                    <Input id="subject" placeholder="Topik pesan Anda" className="bg-slate-50 border-slate-200 h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Pesan</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Tuliskan pesan, pertanyaan, atau keluhan Anda di sini..." 
                      className="bg-slate-50 border-slate-200 min-h-[150px] resize-y"
                    />
                  </div>
                  <Button className="w-full md:w-auto px-8 h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-base">
                    <Send className="mr-2 h-5 w-5" /> Kirim Pesan Sekarang
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

        </div>

        {/* Maps Placeholder */}
        <div className="mt-12">
          <Card className="border-slate-100 shadow-sm overflow-hidden">
            <div className="h-[400px] w-full bg-slate-200 relative">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                <MapPin className="h-12 w-12 mb-4 text-slate-400" />
                <p className="font-medium text-lg">Peta Lokasi Interaktif (Google Maps iframe)</p>
                <p className="text-sm">Silakan integrasikan dengan Google Maps API</p>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
