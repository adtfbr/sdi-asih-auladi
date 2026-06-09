import { z } from 'zod';

// ─── Student ─────────────────────────────────────────────────
export const createStudentSchema = z.object({
  nis: z.string().min(1, 'NIS wajib diisi'),
  nisn: z.string().min(1, 'NISN wajib diisi'),
  name: z.string().min(1, 'Nama wajib diisi'),
  gender: z.enum(['Laki-laki', 'Perempuan'], { message: 'Gender wajib dipilih' }),
  birthDate: z.string().min(1, 'Tanggal lahir wajib diisi'),
  address: z.string().optional(),
  status: z.enum(['Aktif', 'Lulus', 'Pindah']).default('Aktif'),
  classId: z.number().optional(),
});

export const updateStudentSchema = createStudentSchema.partial();

// ─── Teacher ─────────────────────────────────────────────────
export const createTeacherSchema = z.object({
  nip: z.string().min(1, 'NIP wajib diisi'),
  name: z.string().min(1, 'Nama wajib diisi'),
  phone: z.string().optional(),
  email: z.string().email('Email tidak valid').optional().or(z.literal('')),
  status: z.enum(['Aktif', 'Cuti', 'Pensiun']).default('Aktif'),
});

export const updateTeacherSchema = createTeacherSchema.partial();

// ─── Class ───────────────────────────────────────────────────
export const createClassSchema = z.object({
  name: z.string().min(1, 'Nama kelas wajib diisi'),
  level: z.number().min(1).max(6),
  academicYearId: z.number({ message: 'Tahun ajaran wajib dipilih' }),
  homeroomTeacherId: z.number().optional().nullable(),
});

export const updateClassSchema = createClassSchema.partial();

// ─── Subject ─────────────────────────────────────────────────
export const createSubjectSchema = z.object({
  name: z.string().min(1, 'Nama mata pelajaran wajib diisi'),
  code: z.string().min(1, 'Kode mata pelajaran wajib diisi'),
});

export const updateSubjectSchema = createSubjectSchema.partial();

// ─── Academic Year ───────────────────────────────────────────
export const createAcademicYearSchema = z.object({
  name: z.string().min(1, 'Nama tahun ajaran wajib diisi'),
  semester: z.enum(['Ganjil', 'Genap']).default('Ganjil'),
  isActive: z.boolean().default(false),
});

export const updateAcademicYearSchema = createAcademicYearSchema.partial();

// ─── Attendance ──────────────────────────────────────────────
export const createAttendanceSchema = z.object({
  studentId: z.number({ message: 'Student ID wajib' }),
  classId: z.number({ message: 'Class ID wajib' }),
  date: z.string().min(1, 'Tanggal wajib diisi'),
  status: z.enum(['Hadir', 'Izin', 'Sakit', 'Alpha'], { message: 'Status wajib dipilih' }),
});

export const bulkCreateAttendanceSchema = z.object({
  classId: z.number(),
  date: z.string().min(1),
  records: z.array(z.object({
    studentId: z.number(),
    status: z.enum(['Hadir', 'Izin', 'Sakit', 'Alpha']),
  })),
});

export const updateAttendanceSchema = z.object({
  status: z.enum(['Hadir', 'Izin', 'Sakit', 'Alpha']).optional(),
});

// ─── Grade ───────────────────────────────────────────────────
export const createGradeSchema = z.object({
  studentId: z.number({ message: 'Student ID wajib' }),
  subjectId: z.number({ message: 'Subject ID wajib' }),
  teacherId: z.number({ message: 'Teacher ID wajib' }),
  score: z.number().min(0).max(100),
  type: z.enum(['Tugas', 'Quiz', 'UTS', 'UAS', 'Rapor'], { message: 'Jenis penilaian wajib' }),
});

export const bulkCreateGradeSchema = z.object({
  subjectId: z.number(),
  teacherId: z.number(),
  type: z.string().min(1),
  records: z.array(z.object({
    studentId: z.number(),
    score: z.number().min(0).max(100),
  })),
});

export const updateGradeSchema = z.object({
  score: z.number().min(0).max(100).optional(),
  type: z.enum(['Tugas', 'Quiz', 'UTS', 'UAS', 'Rapor']).optional(),
});

// ─── PPDB Application ───────────────────────────────────────
export const createPpdbSchema = z.object({
  studentName: z.string().min(1, 'Nama calon siswa wajib diisi'),
  parentName: z.string().optional(),
  parentPhone: z.string().optional(),
  birthDate: z.string().optional(),
  gender: z.enum(['Laki-laki', 'Perempuan']).optional(),
  address: z.string().optional(),
  status: z.enum(['Draft', 'Submitted', 'Verified', 'Accepted', 'Rejected']).default('Submitted'),
});

export const updatePpdbSchema = createPpdbSchema.partial();

// ─── Schedule ───────────────────────────────────────────────
export const createScheduleSchema = z.object({
  classId: z.number({ message: 'Kelas wajib dipilih' }),
  subjectId: z.number({ message: 'Mata pelajaran wajib dipilih' }),
  teacherId: z.number({ message: 'Guru wajib dipilih' }),
  dayOfWeek: z.number().min(1).max(7),
  startTime: z.string().min(5, 'Waktu mulai wajib diisi (HH:MM)'),
  endTime: z.string().min(5, 'Waktu selesai wajib diisi (HH:MM)'),
});

export const updateScheduleSchema = createScheduleSchema.partial();

// ─── Announcement ─────────────────────────────────────────────
export const createAnnouncementSchema = z.object({
  title: z.string().min(1, 'Judul wajib diisi'),
  content: z.string().min(1, 'Konten wajib diisi'),
  targetRole: z.enum(['semua', 'guru', 'siswa', 'wali']).default('semua'),
});

export const updateAnnouncementSchema = createAnnouncementSchema.partial();

// ─── Learning Material ─────────────────────────────────────────
export const createMaterialSchema = z.object({
  title: z.string().min(1, 'Judul materi wajib diisi'),
  description: z.string().optional(),
  fileUrl: z.string().min(1, 'URL File wajib diisi'),
  classId: z.number().optional().nullable(),
  subjectId: z.number({ message: 'Mata pelajaran wajib dipilih' }),
  teacherId: z.number({ message: 'Guru wajib dipilih' }),
});

export const updateMaterialSchema = createMaterialSchema.partial();

// ─── Attendance ────────────────────────────────────────────────
export const attendanceRecordSchema = z.object({
  studentId: z.number(),
  status: z.enum(['Hadir', 'Izin', 'Sakit', 'Alpha']),
});

export const bulkAttendanceSchema = z.object({
  classId: z.number(),
  date: z.string(), // YYYY-MM-DD
  records: z.array(attendanceRecordSchema),
});

// ─── Grades / Nilai ────────────────────────────────────────────
export const gradeRecordSchema = z.object({
  studentId: z.number(),
  score: z.number().min(0).max(100),
  notes: z.string().optional().nullable(),
});

export const bulkGradeSchema = z.object({
  classId: z.number(),
  subjectId: z.number(),
  teacherId: z.number(),
  semester: z.string(),
  type: z.string(),
  records: z.array(gradeRecordSchema),
});


