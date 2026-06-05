import { pgTable, serial, text, varchar, date, integer, timestamp, boolean } from 'drizzle-orm/pg-core';

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
  isActive: boolean('is_active').default(false).notNull(),
});

export const classes = pgTable('classes', {
  id: serial('id').primaryKey(),
  academicYearId: integer('academic_year_id').references(() => academicYears.id).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  level: integer('level').notNull(),
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
  subjectId: integer('subject_id').references(() => subjects.id).notNull(),
  teacherId: integer('teacher_id').references(() => teachers.id).notNull(),
  score: integer('score').notNull(),
  type: varchar('type', { length: 50 }).notNull(), // Tugas, Quiz, UTS, UAS, Rapor
});

export const ppdbApplications = pgTable('ppdb_applications', {
  id: serial('id').primaryKey(),
  registrationNumber: varchar('registration_number', { length: 50 }).notNull().unique(),
  studentName: text('student_name').notNull(),
  parentName: text('parent_name'),
  parentPhone: varchar('parent_phone', { length: 20 }),
  birthDate: date('birth_date'),
  gender: varchar('gender', { length: 10 }),
  address: text('address'),
  status: varchar('status', { length: 20 }).notNull(), // Draft, Submitted, Verified, Accepted, Rejected
  submittedAt: timestamp('submitted_at').defaultNow(),
});
