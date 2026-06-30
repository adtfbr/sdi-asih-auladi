import { pgTable, serial, text, varchar, date, integer, timestamp, boolean, time, numeric } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  role: varchar('role', { length: 50 }).notNull(), // admin, guru, siswa, wali
});

export const students = pgTable('students', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  nis: varchar('nis', { length: 50 }).notNull().unique(),
  nisn: varchar('nisn', { length: 50 }).notNull().unique(),
  name: text('name').notNull(),
  gender: varchar('gender', { length: 10 }).notNull(),
  birthDate: date('birth_date').notNull(),
  address: text('address'),
  status: varchar('status', { length: 20 }).notNull().default('Aktif'), // Aktif, Lulus, Pindah
  createdAt: timestamp('created_at').defaultNow(),
});

export const teachers = pgTable('teachers', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  nip: varchar('nip', { length: 50 }).notNull().unique(),
  name: text('name').notNull(),
  phone: varchar('phone', { length: 20 }),
  email: varchar('email', { length: 255 }).unique(),
  status: varchar('status', { length: 20 }).notNull().default('Aktif'), // Aktif, Cuti, Pensiun
  createdAt: timestamp('created_at').defaultNow(),
});

export const parents = pgTable('parents', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  studentId: integer('student_id').references(() => students.id).notNull(),
  name: text('name').notNull(),
  phone: varchar('phone', { length: 20 }),
  relationship: varchar('relationship', { length: 50 }).notNull(),
});

export const academicYears = pgTable('academic_years', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  semester: varchar('semester', { length: 20 }).notNull().default('Ganjil'), // Ganjil, Genap
  isActive: boolean('is_active').default(false).notNull(),
});

export const classes = pgTable('classes', {
  id: serial('id').primaryKey(),
  academicYearId: integer('academic_year_id').references(() => academicYears.id).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  level: integer('level').notNull(),
  capacity: integer('capacity').default(30).notNull(),
  homeroomTeacherId: integer('homeroom_teacher_id').references(() => teachers.id),
});

export const classStudents = pgTable('class_students', {
  id: serial('id').primaryKey(),
  classId: integer('class_id').references(() => classes.id).notNull(),
  studentId: integer('student_id').references(() => students.id).notNull(),
});

export const subjects = pgTable('subjects', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  code: varchar('code', { length: 20 }).notNull().unique(),
});

export const attendanceRecords = pgTable('attendance_records', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id).notNull(),
  classId: integer('class_id').references(() => classes.id).notNull(),
  date: date('date').notNull(),
  status: varchar('status', { length: 20 }).notNull(), // Hadir, Izin, Sakit, Alpha
});

export const grades = pgTable('grades', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id).notNull(),
  classId: integer('class_id').references(() => classes.id).notNull(),
  subjectId: integer('subject_id').references(() => subjects.id).notNull(),
  teacherId: integer('teacher_id').references(() => teachers.id).notNull(),
  semester: varchar('semester', { length: 20 }).notNull().default('Ganjil'), // Ganjil, Genap
  type: varchar('type', { length: 50 }).notNull(), // Tugas, Quiz, UTS, UAS, Rapor
  score: numeric('score').notNull(),
  notes: text('notes'),
});

export const ppdbApplications = pgTable('ppdb_applications', {
  id: serial('id').primaryKey(),
  registrationNumber: varchar('registration_number', { length: 50 }).notNull().unique(),
  studentName: text('student_name').notNull(),
  nik: varchar('nik', { length: 20 }),
  birthPlace: text('birth_place'),
  religion: varchar('religion', { length: 50 }),
  parentName: text('parent_name'),
  fatherName: text('father_name'),
  fatherJob: text('father_job'),
  fatherSalary: text('father_salary'),
  motherName: text('mother_name'),
  motherJob: text('mother_job'),
  parentPhone: varchar('parent_phone', { length: 20 }),
  birthDate: date('birth_date'),
  gender: varchar('gender', { length: 10 }),
  address: text('address'),
  kkDocumentUrl: text('kk_document_url'),
  aktaDocumentUrl: text('akta_document_url'),
  photoUrl: text('photo_url'),
  status: varchar('status', { length: 20 }).notNull(), // Draft, Submitted, Verified, Accepted, Rejected
  submittedAt: timestamp('submitted_at').defaultNow(),
});

export const announcements = pgTable('announcements', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  targetRole: varchar('target_role', { length: 50 }).notNull().default('semua'), // semua, guru, siswa, wali
  createdAt: timestamp('created_at').defaultNow(),
});

export const systemSettings = pgTable('system_settings', {
  id: serial('id').primaryKey(),
  schoolName: varchar('school_name', { length: 255 }).notNull().default('SDI Asih Auladi'),
  npsn: varchar('npsn', { length: 50 }),
  address: text('address'),
  ppdbStatus: varchar('ppdb_status', { length: 50 }).notNull().default('closed'), // open, closed
  ppdbWave: varchar('ppdb_wave', { length: 100 }),
});

export const news = pgTable('news', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  content: text('content').notNull(),
  imageUrl: text('image_url'),
  status: varchar('status', { length: 20 }).notNull().default('draft'), // draft, published
  authorId: integer('author_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const galleries = pgTable('galleries', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  imageUrl: text('image_url').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const schedules = pgTable('schedules', {
  id: serial('id').primaryKey(),
  classId: integer('class_id').references(() => classes.id).notNull(),
  subjectId: integer('subject_id').references(() => subjects.id).notNull(),
  teacherId: integer('teacher_id').references(() => teachers.id).notNull(),
  dayOfWeek: integer('day_of_week').notNull(), // 1=Senin, 2=Selasa, etc.
  startTime: time('start_time').notNull(),
  endTime: time('end_time').notNull(),
});

export const learningMaterials = pgTable('learning_materials', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  fileUrl: text('file_url').notNull(),
  classId: integer('class_id').references(() => classes.id),
  subjectId: integer('subject_id').references(() => subjects.id).notNull(),
  teacherId: integer('teacher_id').references(() => teachers.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const communicationBooks = pgTable('communication_books', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id).notNull(),
  teacherId: integer('teacher_id').references(() => teachers.id).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // Info, Teguran, Apresiasi, Izin
  message: text('message').notNull(),
  reply: text('reply'),
  senderRole: varchar('sender_role', { length: 20 }).notNull(), // guru, wali
  isReadByParent: boolean('is_read_by_parent').default(false).notNull(),
  isReadByTeacher: boolean('is_read_by_teacher').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const invoices = pgTable('invoices', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  amount: numeric('amount').notNull(),
  dueDate: date('due_date').notNull(),
  status: varchar('status', { length: 50 }).notNull().default('Unpaid'), // Unpaid, Pending Verification, Paid, Rejected
  proofDocumentUrl: text('proof_document_url'), // base64 string or public URL
  verifiedBy: integer('verified_by').references(() => users.id),
  verifiedAt: timestamp('verified_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
