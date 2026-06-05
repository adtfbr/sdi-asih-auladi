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
