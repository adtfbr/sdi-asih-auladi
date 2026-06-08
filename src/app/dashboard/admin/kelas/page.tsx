"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function AdminKelasPage() {
  const dummyKelas = [
    { id: 1, name: "Kelas 1A", level: 1, teacher: "Ahmad Dahlan" },
    { id: 2, name: "Kelas 1B", level: 1, teacher: "Siti Aminah" },
    { id: 3, name: "Kelas 2A", level: 2, teacher: "Budi Santoso" },
    { id: 4, name: "Kelas 3A", level: 3, teacher: "Cut Nyak Dien" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Data Kelas</h2>
          <p className="text-slate-500">Kelola daftar kelas, tingkat, dan wali kelas.</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Plus className="mr-2 h-4 w-4" /> Tambah Kelas
        </Button>
      </div>

      <Card className="border-slate-100 shadow-sm">
        <CardHeader>
          <CardTitle>Daftar Kelas Aktif</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 bg-slate-50 uppercase border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-semibold">Nama Kelas</th>
                  <th className="px-6 py-4 font-semibold">Tingkat</th>
                  <th className="px-6 py-4 font-semibold">Wali Kelas</th>
                  <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dummyKelas.map((k) => (
                  <tr key={k.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{k.name}</td>
                    <td className="px-6 py-4 text-slate-600">{k.level}</td>
                    <td className="px-6 py-4 text-slate-600">{k.teacher}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-50">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-rose-600 hover:bg-rose-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
