import { db } from "../src/db";
import { sql } from "drizzle-orm";
import { 
  users, teachers, students, parents, academicYears, classes, classStudents, 
  subjects, schedules 
} from "../src/db/schema";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("Menghapus data lama (Resetting Database)...");
  
  // Truncate all tables with CASCADE to ignore foreign key restraints during reset
  // and RESTART IDENTITY to reset auto-incrementing IDs back to 1.
  await db.execute(
    sql`TRUNCATE TABLE tahfidz_records, invoices, communication_books, notifications, schedules, learning_materials, grades, attendance_records, class_students, classes, academic_years, subjects, parents, students, teachers, users RESTART IDENTITY CASCADE;`
  );

  console.log("Database berhasil dibersihkan. Memasukkan data awal (Dummy Data)...");

  // 1. ADMIN USER
  const adminHash = await bcrypt.hash("admin123", 10);
  await db.insert(users).values({
    name: "Administrator",
    email: "admin@sdiasih.com",
    password: adminHash,
    role: "admin",
  });
  console.log("✅ Admin terbuat (admin@sdiasih.com / admin123)");

  // 2. TEACHERS
  const guruData = [
    { name: "Ahmad Dahlan, S.Pd", nip: "198001", position: "Guru Kelas", email: "ahmad@sdiasih.com" },
    { name: "Siti Hajar, M.Pd", nip: "198002", position: "Guru Kelas", email: "siti@sdiasih.com" },
    { name: "Budi Santoso, S.Kom", nip: "198003", position: "Guru Mata Pelajaran", email: "budi@sdiasih.com" }
  ];

  const teacherIds = [];
  for (const g of guruData) {
    const pw = await bcrypt.hash(`guru${g.nip}`, 10);
    const [u] = await db.insert(users).values({
      name: g.name, email: g.email, password: pw, role: "guru"
    }).returning({ id: users.id });
    
    const [t] = await db.insert(teachers).values({
      userId: u.id, nip: g.nip, name: g.name, email: g.email, position: g.position, status: "Aktif", phone: "081200000000"
    }).returning({ id: teachers.id });
    teacherIds.push(t.id);
  }
  console.log("✅ 3 Guru terbuat (Password: guru[NIP])");

  // 3. ACADEMIC YEAR & CLASSES
  const [ay] = await db.insert(academicYears).values({
    name: "2025/2026", semester: "Ganjil", isActive: true
  }).returning({ id: academicYears.id });

  const [class1, class2] = await db.insert(classes).values([
    { name: "1A - Abu Bakar", level: 1, academicYearId: ay.id, homeroomTeacherId: teacherIds[0], capacity: 30 },
    { name: "2A - Umar", level: 2, academicYearId: ay.id, homeroomTeacherId: teacherIds[1], capacity: 30 }
  ]).returning({ id: classes.id });
  console.log("✅ Tahun Ajaran dan 2 Kelas terbuat");

  // 4. SUBJECTS
  const [subMath, subPAI] = await db.insert(subjects).values([
    { name: "Matematika", code: "MTK" },
    { name: "Pendidikan Agama Islam", code: "PAI" }
  ]).returning({ id: subjects.id });

  // 5. STUDENTS
  const studentIds = [];
  for (let i = 1; i <= 10; i++) {
    const nis = `202500${i}`;
    const pw = await bcrypt.hash(`siswa${nis}`, 10);
    const [u] = await db.insert(users).values({
      name: `Siswa ${i}`, email: `siswa${i}@sdiasih.com`, password: pw, role: "siswa"
    }).returning({ id: users.id });

    const [s] = await db.insert(students).values({
      userId: u.id, nis, nisn: `001234560${i}`, name: `Siswa ${i}`, gender: i % 2 === 0 ? "Perempuan" : "Laki-laki", 
      birthDate: `2015-05-0${i % 9 + 1}`, status: "Aktif", address: `Jl. Melati No. ${i}`
    }).returning({ id: students.id });
    studentIds.push(s.id);

    // Assign class (1-5 to class 1, 6-10 to class 2)
    const assignedClass = i <= 5 ? class1.id : class2.id;
    await db.insert(classStudents).values({ studentId: s.id, classId: assignedClass });

    // 6. PARENTS
    const pwParent = await bcrypt.hash(`orangtua${nis}`, 10);
    const [uParent] = await db.insert(users).values({
      name: `Bpk/Ibu Siswa ${i}`, email: `ortu${i}@sdiasih.com`, password: pwParent, role: "wali"
    }).returning({ id: users.id });

    await db.insert(parents).values({
      userId: uParent.id, studentId: s.id, name: `Bpk/Ibu Siswa ${i}`, relationship: "Ayah", phone: `08570000000${i}`
    });
  }
  console.log("✅ 10 Siswa, 10 Wali Murid, beserta Kelasnya terbuat");

  // 7. SCHEDULES
  await db.insert(schedules).values([
    { classId: class1.id, subjectId: subMath.id, teacherId: teacherIds[0], dayOfWeek: 1, startTime: "07:30:00", endTime: "09:00:00" },
    { classId: class1.id, subjectId: subPAI.id, teacherId: teacherIds[2], dayOfWeek: 2, startTime: "07:30:00", endTime: "09:00:00" },
    { classId: class2.id, subjectId: subMath.id, teacherId: teacherIds[1], dayOfWeek: 1, startTime: "09:15:00", endTime: "10:45:00" },
  ]);
  console.log("✅ Jadwal Mata Pelajaran terbuat");

  console.log("🎉 SEEDING SELESAI!");
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
