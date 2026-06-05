import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import 'dotenv/config';

// Ensure the DATABASE_URL is available
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set in .env');
  process.exit(1);
}

const queryClient = postgres(process.env.DATABASE_URL);
const db = drizzle(queryClient, { schema });

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Clear existing data to avoid conflicts on re-runs (cascade delete manually)
  console.log('Cleaning up existing data...');
  await db.delete(schema.ppdbApplications);
  await db.delete(schema.grades);
  await db.delete(schema.attendanceRecords);
  await db.delete(schema.classStudents);
  await db.delete(schema.parents);
  await db.delete(schema.students);
  await db.delete(schema.classes);
  await db.delete(schema.academicYears);
  await db.delete(schema.subjects);
  await db.delete(schema.teachers);
  await db.delete(schema.users);

  // 2. Insert Users
  console.log('Inserting users...');
  const insertedUsers = await db.insert(schema.users).values([
    { name: 'Admin Sekolah', email: 'admin@sdiasih.com', password: 'password123', role: 'admin' },
    { name: 'Ust. Ahmad', email: 'ahmad@sdiasih.com', password: 'password123', role: 'guru' },
    { name: 'Usth. Siti Aminah', email: 'siti@sdiasih.com', password: 'password123', role: 'guru' },
    { name: 'Budi Santoso', email: 'budi@siswa.sdiasih.com', password: 'password123', role: 'siswa' },
    { name: 'Ayah Budi', email: 'ayah.budi@gmail.com', password: 'password123', role: 'wali' },
  ]).returning();

  const [adminUser, guruUser, guruUser2, siswaUser, waliUser] = insertedUsers;

  // 3. Insert Academic Year
  console.log('Inserting academic years...');
  const insertedYears = await db.insert(schema.academicYears).values([
    { name: '2026/2027 Ganjil', isActive: true },
    { name: '2025/2026 Genap', isActive: false },
  ]).returning();
  const activeYear = insertedYears[0];

  // 4. Insert Subjects
  console.log('Inserting subjects...');
  const insertedSubjects = await db.insert(schema.subjects).values([
    { name: 'Pendidikan Agama Islam', code: 'PAI' },
    { name: 'Matematika', code: 'MTK' },
    { name: 'Ilmu Pengetahuan Alam', code: 'IPA' },
    { name: 'Bahasa Arab', code: 'ARB' },
    { name: 'Bahasa Indonesia', code: 'BIN' },
    { name: 'Ilmu Pengetahuan Sosial', code: 'IPS' },
  ]).returning();

  // 5. Insert Teachers
  console.log('Inserting teachers...');
  const insertedTeachers = await db.insert(schema.teachers).values([
    { userId: guruUser.id, nip: '198001012010011001', name: 'Ust. Ahmad', phone: '081234567890', email: 'ahmad@sdiasih.com', status: 'Aktif' },
    { userId: guruUser2.id, nip: '198205122008012003', name: 'Usth. Siti Aminah', phone: '081234567891', email: 'siti@sdiasih.com', status: 'Aktif' },
    { nip: '197903252006041002', name: 'Ust. Budi Santoso', phone: '081234567892', email: 'budis@sdiasih.com', status: 'Aktif' },
    { nip: '198511082010012005', name: 'Usth. Rina Wati', phone: '081234567893', email: 'rina@sdiasih.com', status: 'Cuti' },
    { nip: '198807192014021004', name: 'Ust. Hasan Basri', phone: '081234567894', email: 'hasan@sdiasih.com', status: 'Aktif' },
  ]).returning();
  const [ustAhmad, usthSiti] = insertedTeachers;

  // 6. Insert Classes
  console.log('Inserting classes...');
  const insertedClasses = await db.insert(schema.classes).values([
    { academicYearId: activeYear.id, name: '1A', level: 1, homeroomTeacherId: ustAhmad.id },
    { academicYearId: activeYear.id, name: '2B', level: 2, homeroomTeacherId: insertedTeachers[2].id },
    { academicYearId: activeYear.id, name: '3A', level: 3 },
    { academicYearId: activeYear.id, name: '4B', level: 4, homeroomTeacherId: insertedTeachers[4].id },
  ]).returning();
  const [class1A, class2B, class3A, class4B] = insertedClasses;

  // 7. Insert Students
  console.log('Inserting students...');
  const insertedStudents = await db.insert(schema.students).values([
    { userId: siswaUser.id, nis: '2026001', nisn: '0101234567', name: 'Budi Santoso', gender: 'Laki-laki', birthDate: '2016-05-14', address: 'Jl. Merdeka No. 10', status: 'Aktif' },
    { nis: '2026002', nisn: '0101234568', name: 'Ahmad Rayhan', gender: 'Laki-laki', birthDate: '2020-03-22', address: 'Jl. Melati No. 5', status: 'Aktif' },
    { nis: '2026003', nisn: '0101234569', name: 'Siti Fatimah', gender: 'Perempuan', birthDate: '2020-07-15', address: 'Jl. Anggrek No. 12', status: 'Aktif' },
    { nis: '2025045', nisn: '0101234570', name: 'Aisyah Putri', gender: 'Perempuan', birthDate: '2019-01-08', address: 'Jl. Kenanga No. 3', status: 'Aktif' },
    { nis: '2024102', nisn: '0101234571', name: 'Reza Rahadian', gender: 'Laki-laki', birthDate: '2018-11-20', address: 'Jl. Dahlia No. 7', status: 'Aktif' },
    { nis: '2024103', nisn: '0101234572', name: 'Nadia Safira', gender: 'Perempuan', birthDate: '2018-04-05', address: 'Jl. Mawar No. 9', status: 'Pindah' },
    { nis: '2023088', nisn: '0101234573', name: 'Kevin Sanjaya', gender: 'Laki-laki', birthDate: '2017-09-30', address: 'Jl. Flamboyan No. 2', status: 'Aktif' },
  ]).returning();
  const [budi, ahmad, siti, aisyah, reza, nadia, kevin] = insertedStudents;

  // 8. Assign Students to Classes
  console.log('Assigning students to classes...');
  await db.insert(schema.classStudents).values([
    { classId: class1A.id, studentId: ahmad.id },
    { classId: class1A.id, studentId: siti.id },
    { classId: class2B.id, studentId: aisyah.id },
    { classId: class3A.id, studentId: reza.id },
    { classId: class4B.id, studentId: budi.id },
    { classId: class4B.id, studentId: kevin.id },
  ]);

  // 9. Insert Parent
  console.log('Inserting parents...');
  await db.insert(schema.parents).values([
    { userId: waliUser.id, studentId: budi.id, name: 'Bapak Santoso', phone: '081987654321', relationship: 'Ayah' },
  ]);

  // 10. Insert Attendance
  console.log('Inserting attendance...');
  const today = new Date().toISOString().split('T')[0];
  await db.insert(schema.attendanceRecords).values([
    { studentId: budi.id, classId: class4B.id, date: today, status: 'Hadir' },
    { studentId: kevin.id, classId: class4B.id, date: today, status: 'Hadir' },
    { studentId: ahmad.id, classId: class1A.id, date: today, status: 'Hadir' },
    { studentId: siti.id, classId: class1A.id, date: today, status: 'Izin' },
  ]);

  // 11. Insert Grades
  console.log('Inserting grades...');
  await db.insert(schema.grades).values([
    { studentId: budi.id, subjectId: insertedSubjects[0].id, teacherId: ustAhmad.id, score: 88, type: 'Tugas' },
    { studentId: budi.id, subjectId: insertedSubjects[0].id, teacherId: ustAhmad.id, score: 90, type: 'Quiz' },
    { studentId: budi.id, subjectId: insertedSubjects[0].id, teacherId: ustAhmad.id, score: 85, type: 'UTS' },
    { studentId: budi.id, subjectId: insertedSubjects[1].id, teacherId: usthSiti.id, score: 92, type: 'Tugas' },
    { studentId: budi.id, subjectId: insertedSubjects[1].id, teacherId: usthSiti.id, score: 85, type: 'Quiz' },
    { studentId: budi.id, subjectId: insertedSubjects[1].id, teacherId: usthSiti.id, score: 94, type: 'UTS' },
    { studentId: budi.id, subjectId: insertedSubjects[2].id, teacherId: insertedTeachers[2].id, score: 90, type: 'Tugas' },
    { studentId: budi.id, subjectId: insertedSubjects[2].id, teacherId: insertedTeachers[2].id, score: 92, type: 'Quiz' },
    { studentId: kevin.id, subjectId: insertedSubjects[1].id, teacherId: usthSiti.id, score: 78, type: 'Tugas' },
    { studentId: kevin.id, subjectId: insertedSubjects[1].id, teacherId: usthSiti.id, score: 82, type: 'UTS' },
  ]);

  // 12. Insert PPDB Applications
  console.log('Inserting PPDB applications...');
  await db.insert(schema.ppdbApplications).values([
    { registrationNumber: 'PPDB-2026-001', studentName: 'Ahmad Rayhan', parentName: 'Bp. Rayhan', parentPhone: '081111222333', gender: 'Laki-laki', status: 'Verified' },
    { registrationNumber: 'PPDB-2026-002', studentName: 'Siti Fatimah', parentName: 'Ibu Fatimah', parentPhone: '081444555666', gender: 'Perempuan', status: 'Submitted' },
    { registrationNumber: 'PPDB-2026-003', studentName: 'Dian Permata', parentName: 'Bp. Permata', parentPhone: '081777888999', gender: 'Perempuan', status: 'Accepted' },
    { registrationNumber: 'PPDB-2026-004', studentName: 'Farhan Rizki', parentName: 'Ibu Rizki', gender: 'Laki-laki', status: 'Draft' },
  ]);

  console.log('✅ Seeding finished successfully!');
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Seeding failed:');
  console.error(err);
  process.exit(1);
});
