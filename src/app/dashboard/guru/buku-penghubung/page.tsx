"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Search, Loader2, Send, CheckCircle2, AlertCircle, Heart, FileText, CornerDownRight } from "lucide-react";
import { createTeacherNote, replyToNote, markNoteAsRead } from "@/app/actions/buku-penghubung-actions";

export default function BukuPenghubungGuruPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [teacherId, setTeacherId] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [search, setSearch] = useState("");
  
  // Create Note Dialog
  const [createOpen, setCreateOpen] = useState(false);
  const [noteType, setNoteType] = useState("Info");
  const [noteMessage, setNoteMessage] = useState("");
  const [saving, setSaving] = useState(false);

  // Reply Dialog
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [selectedNote, setSelectedNote] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/guru/buku-penghubung");
      const data = await res.json();
      if (res.ok) {
        setTeacherId(data.teacherId);
        setStudents(data.students);
        setNotes(data.notes);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateNote = async () => {
    if (!selectedStudent || !noteMessage) return;
    setSaving(true);
    const res = await createTeacherNote({
      teacherId,
      studentId: selectedStudent.id,
      type: noteType,
      message: noteMessage,
    });
    
    if (res.success) {
      setCreateOpen(false);
      setNoteMessage("");
      fetchData();
    }
    setSaving(false);
  };

  const handleReply = async () => {
    if (!selectedNote || !replyMessage) return;
    setSaving(true);
    const res = await replyToNote(selectedNote.id, replyMessage, "guru");
    if (res.success) {
      setReplyOpen(false);
      setReplyMessage("");
      fetchData();
    }
    setSaving(false);
  };

  const handleMarkAsRead = async (noteId: number) => {
    await markNoteAsRead(noteId, "guru");
    fetchData();
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.nis.includes(search)
  );

  const studentNotes = notes.filter(n => selectedStudent && n.studentId === selectedStudent.id);

  const getIcon = (type: string) => {
    switch (type) {
      case "Apresiasi": return <Heart className="h-5 w-5 text-rose-500" />;
      case "Teguran": return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case "Izin": return <FileText className="h-5 w-5 text-sky-500" />;
      default: return <FileText className="h-5 w-5 text-stone-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-900">Buku Penghubung Digital</h2>
          <p className="text-stone-500">Kirim catatan harian ke wali murid dan terima pengajuan izin siswa.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Sidebar: List Siswa */}
        <div className="md:col-span-4 lg:col-span-3 space-y-4">
          <Card className="border-stone-100 shadow-sm overflow-hidden h-[calc(100vh-200px)] flex flex-col">
            <CardHeader className="p-4 border-b border-stone-50 bg-stone-50/50">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-stone-400" />
                <Input
                  placeholder="Cari Siswa..."
                  className="pl-9 bg-white"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </CardHeader>
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full text-stone-400">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="divide-y divide-stone-50">
                  {filteredStudents.map(student => {
                    const unreadNotes = notes.filter(n => n.studentId === student.id && !n.isReadByTeacher).length;
                    return (
                      <button
                        key={student.id}
                        onClick={() => setSelectedStudent(student)}
                        className={`w-full text-left p-4 hover:bg-stone-50 transition-colors flex items-center justify-between ${
                          selectedStudent?.id === student.id ? "bg-teal-50 border-l-2 border-teal-600" : ""
                        }`}
                      >
                        <div>
                          <div className={`font-medium ${selectedStudent?.id === student.id ? "text-teal-900" : "text-stone-900"}`}>
                            {student.name}
                          </div>
                          <div className="text-xs text-stone-500">NIS: {student.nis}</div>
                        </div>
                        {unreadNotes > 0 && (
                          <Badge className="bg-rose-500 hover:bg-rose-600 text-white border-none rounded-full px-2">
                            {unreadNotes}
                          </Badge>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Main Area: Percakapan */}
        <div className="md:col-span-8 lg:col-span-9">
          {!selectedStudent ? (
            <Card className="border-stone-100 shadow-sm h-[calc(100vh-200px)] flex items-center justify-center">
              <div className="text-center text-stone-400">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>Pilih siswa di daftar untuk melihat Buku Penghubung</p>
              </div>
            </Card>
          ) : (
            <Card className="border-stone-100 shadow-sm h-[calc(100vh-200px)] flex flex-col">
              <CardHeader className="p-4 border-b border-stone-100 bg-white flex flex-row items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-stone-900">{selectedStudent.name}</h3>
                  <p className="text-sm text-stone-500">Riwayat Catatan & Komunikasi</p>
                </div>
                <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={() => setCreateOpen(true)}>
                  <Send className="mr-2 h-4 w-4" /> Tulis Catatan
                </Button>
              </CardHeader>
              
              <CardContent className="flex-1 p-6 overflow-y-auto space-y-6 bg-stone-50/30">
                {studentNotes.length === 0 ? (
                  <div className="text-center text-stone-400 pt-10">Belum ada catatan untuk siswa ini.</div>
                ) : (
                  studentNotes.map((note) => {
                    const isFromMe = note.senderRole === "guru";
                    return (
                      <div key={note.id} className="bg-white border border-stone-100 rounded-xl p-4 shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className="bg-stone-50 p-2 rounded-lg">
                              {getIcon(note.type)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-stone-900">{note.type}</span>
                                {!isFromMe && <Badge className="bg-sky-100 text-sky-700 border-none">Dari Wali</Badge>}
                                {isFromMe && <Badge className="bg-stone-100 text-stone-600 border-none">Dari Anda</Badge>}
                              </div>
                              <div className="text-xs text-stone-400 mt-1">
                                {new Date(note.createdAt).toLocaleString('id-ID')}
                              </div>
                            </div>
                          </div>
                          {!note.isReadByTeacher && (
                            <Button size="sm" variant="outline" className="text-xs" onClick={() => handleMarkAsRead(note.id)}>
                              <CheckCircle2 className="mr-1 h-3 w-3" /> Tandai Dibaca
                            </Button>
                          )}
                        </div>
                        
                        <div className="pl-12">
                          <p className="text-stone-700 whitespace-pre-wrap">{note.message}</p>
                          
                          {note.reply ? (
                            <div className="mt-4 bg-stone-50 p-3 rounded-lg border border-stone-100 relative">
                              <CornerDownRight className="absolute -left-2 top-3 h-4 w-4 text-stone-300" />
                              <p className="text-xs font-semibold text-stone-500 mb-1">
                                Balasan dari {note.senderRole === "guru" ? "Wali Murid" : "Anda"}:
                              </p>
                              <p className="text-stone-700 text-sm">{note.reply}</p>
                            </div>
                          ) : (
                            <div className="mt-4">
                              {!isFromMe && (
                                <Button size="sm" variant="secondary" onClick={() => { setSelectedNote(note); setReplyOpen(true); }}>
                                  Balas Pesan Ini
                                </Button>
                              )}
                              {isFromMe && !note.isReadByParent && (
                                <span className="text-xs text-stone-400 italic">Belum dibaca oleh wali murid.</span>
                              )}
                              {isFromMe && note.isReadByParent && (
                                <span className="text-xs text-teal-600 italic">✔ Dibaca oleh wali murid.</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Dialog Tulis Catatan Baru */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tulis Catatan untuk Wali {selectedStudent?.name}</DialogTitle>
            <DialogDescription>
              Catatan ini akan muncul di dasbor wali murid dan mereka dapat memberikan respons.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Kategori Catatan</Label>
              <Select value={noteType} onValueChange={(val) => setNoteType(val || "")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Info">Informasi / Pemberitahuan</SelectItem>
                  <SelectItem value="Apresiasi">Apresiasi / Pujian</SelectItem>
                  <SelectItem value="Teguran">Teguran / Catatan Perilaku</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Isi Catatan</Label>
              <Textarea
                placeholder="Tulis pesan Anda di sini..."
                className="min-h-[120px]"
                value={noteMessage}
                onChange={(e) => setNoteMessage(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Batal</Button>
            <Button onClick={handleCreateNote} disabled={saving || !noteMessage} className="bg-teal-600 hover:bg-teal-700 text-white">
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Kirim Catatan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Balas Pesan */}
      <Dialog open={replyOpen} onOpenChange={setReplyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Balas Pengajuan / Pesan Wali</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-stone-50 p-3 rounded-lg text-sm text-stone-600 mb-4">
              <strong>Pesan Wali:</strong><br/>
              {selectedNote?.message}
            </div>
            <div className="space-y-2">
              <Label>Isi Balasan Anda</Label>
              <Textarea
                placeholder="Tulis balasan..."
                className="min-h-[120px]"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReplyOpen(false)}>Batal</Button>
            <Button onClick={handleReply} disabled={saving || !replyMessage} className="bg-teal-600 hover:bg-teal-700 text-white">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Kirim Balasan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
