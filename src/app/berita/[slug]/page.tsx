import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, ArrowLeft, User, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { news } from "@/db/schema";
import { eq } from "drizzle-orm";

export const metadata = {
  title: "Detail Berita | SDI Asih Auladi",
};

export default async function BeritaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Fetch actual data from database
  const [beritaItem] = await db.select().from(news).where(eq(news.slug, slug)).limit(1);

  if (!beritaItem) {
    return (
      <div className="py-32 flex flex-col items-center justify-center min-h-[60vh] bg-stone-50">
        <h1 className="text-3xl font-bold text-stone-800 mb-6 font-heading">Berita Tidak Ditemukan</h1>
        <Link href="/berita">
          <Button variant="outline" className="h-12 px-6 rounded-xl border-stone-200">
            <ArrowLeft className="mr-2 h-4 w-4"/> Kembali ke Berita
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen py-10">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <Link href="/berita" className="inline-flex items-center text-stone-500 hover:text-teal-600 mb-8 transition-colors font-medium">
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Indeks Berita
        </Link>

        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-100">
          {/* Hero Image */}
          <div className="relative h-[300px] md:h-[450px] w-full bg-stone-100 flex items-center justify-center border-b border-stone-100">
            {beritaItem.imageUrl ? (
              <img 
                src={beritaItem.imageUrl} 
                alt={beritaItem.title}
                className="object-cover w-full h-full"
              />
            ) : (
              <ImageIcon className="h-16 w-16 text-stone-300" />
            )}
          </div>

          <div className="p-8 md:p-12 lg:p-16">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-200 border-none px-3 py-1">
                Berita
              </Badge>
              <div className="flex items-center text-stone-500 text-sm gap-4">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" /> 
                  {beritaItem.createdAt ? new Date(beritaItem.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                </span>
              </div>
            </div>

            <h1 className="font-heading text-3xl md:text-5xl font-bold text-stone-900 mb-10 leading-tight">
              {beritaItem.title}
            </h1>

            <div className="prose prose-lg prose-teal max-w-none text-stone-700
                prose-headings:text-stone-900 prose-headings:font-bold prose-h2:text-2xl
                prose-a:text-teal-600 prose-a:no-underline hover:prose-a:underline
                prose-li:marker:text-teal-500 whitespace-pre-line leading-relaxed">
              {beritaItem.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
