"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, Send, CheckCircle2, AlertCircle, Heart, FileText, CornerDownRight, Plus } from "lucide-react";
import { createParentLeaveRequest, replyToNote, markNoteAsRead } from "@/app/actions/buku-penghubung-actions";

export default function BukuPenghubungWaliPage() {
  const [student, setStudent] = useState<any>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Izin Dialog
  const [izinOpen, setIzinOpen] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [izinMessage, setIzinMessage] = useState("");
  const [saving, setSaving] = useState(false);

  // Reply Dialog
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [selectedNote, setSelectedNote] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/wali/buku-penghubung");
      const data = await res.json();
      if (res.ok) {
        setStudent(data.student);
        setNotes(data.notes);
        setTeachers(data.teachers);
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

  const handleSendIzin = async () => {
    if (!student || !selectedTeacherId || !izinMessage) return;
    setSaving(true);
    const res = await createParentLeaveRequest({
      studentId: student.id,
      teacherId: Number(selectedTeacherId),
      message: izinMessage,
    });
    
    if (res.success) {
      setIzinOpen(false);
      setIzinMessage("");
      setSelectedTeacherId("");
      fetchData();
    }
    setSaving(false);
  };

  const handleReply = async () => {
    if (!selectedNote || !replyMessage) return;
    setSaving(true);
    const res = await replyToNote(selectedNote.id, replyMessage, "wali");
    if (res.success) {
      setReplyOpen(false);
      setReplyMessage("");
      fetchData();
    }
    setSaving(false);
  };

  const handleMarkAsRead = async (noteId: number) => {
    await markNoteAsRead(noteId, "wali");
    fetchData();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "Apresiasi": return <Heart className="h-5 w-5 text-rose-500" />;
      case "Teguran": return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case "Izin": return <FileText className="h-5 w-5 text-sky-500" />;
      default: return <FileText className="h-5 w-5 text-stone-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)] text-stone-400">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)] text-stone-400">
        <p>Data siswa tidak ditemukan atau belum terhubung.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-900">Buku Penghubung</h2>
          <p className="text-stone-500">Catatan dari wali kelas dan pengajuan izin ananda {student.name}.</p>
        </div>
        <Button className="bg-sky-600 hover:bg-sky-700 text-white" onClick={() => setIzinOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Ajukan Izin / Sakit
        </Button>
      </div>

      <Card className="border-stone-100 shadow-sm max-w-4xl mx-auto">
        <CardContent className="p-6 space-y-6 bg-stone-50/30">
          {notes.length === 0 ? (
            <div className="text-center text-stone-400 py-10">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
              Belum ada catatan di buku penghubung.
            </div>
          ) : (
            notes.map((note) => {
              const isFromMe = note.senderRole === "wali";
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
                          {!isFromMe && <Badge className="bg-teal-50 text-teal-700 border-none">Dari Guru: {note.teacherName}</Badge>}
                          {isFromMe && <Badge className="bg-stone-100 text-stone-600 border-none">Pengajuan Anda</Badge>}
                        </div>
                        <div className="text-xs text-stone-400 mt-1">
                          {new Date(note.createdAt).toLocaleString('id-ID')}
                        </div>
                      </div>
                    </div>
                    {!isFromMe && !note.isReadByParent && (
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
                          Balasan dari {note.senderRole === "wali" ? `Guru (${note.teacherName})` : "Anda"}:
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
                        {isFromMe && !note.isReadByTeacher && (
                          <span className="text-xs text-stone-400 italic">Belum dibaca oleh guru.</span>
                        )}
                        {isFromMe && note.isReadByTeacher && (
                          <span className="text-xs text-teal-600 italic">✔ Dibaca oleh guru.</span>
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

      {/* Dialog Ajukan Izin */}
      <Dialog open={izinOpen} onOpenChange={setIzinOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajukan Izin / Sakit</DialogTitle>
            <DialogDescription>
              Kirimkan pemberitahuan izin atau sakit ananda {student?.name} kepada guru terkait.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Tujuan (Pilih Guru)</Label>
              <Select value={selectedTeacherId} onValueChange={(val) => setSelectedTeacherId(val || "")}>
                <SelectTrigger><SelectValue placeholder="Pilih Guru" /></SelectTrigger>
                <SelectContent>
                  {teachers.map(t => (
                    <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Keterangan Izin</Label>
              <Textarea
                placeholder="Jelaskan alasan izin / sakit..."
                className="min-h-[120px]"
                value={izinMessage}
                onChange={(e) => setIzinMessage(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIzinOpen(false)}>Batal</Button>
            <Button onClick={handleSendIzin} disabled={saving || !izinMessage || !selectedTeacherId} className="bg-sky-600 hover:bg-sky-700 text-white">
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Kirim Pengajuan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Balas Pesan */}
      <Dialog open={replyOpen} onOpenChange={setReplyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Balas Catatan Guru</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-stone-50 p-3 rounded-lg text-sm text-stone-600 mb-4">
              <strong>Catatan Guru:</strong><br/>
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
