const postgres = require('postgres');
require('dotenv').config();
require('dotenv').config({ path: '.env.local' });

async function seed() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("No DATABASE_URL found");
  
  const sql = postgres(url);
  try {
    console.log("Seeding users...");
    await sql`
      INSERT INTO users (name, email, password, role) VALUES
      ('Admin SDI', 'admin@sdiasih.com', 'password123', 'admin'),
      ('Guru Ahmad', 'ahmad@sdiasih.com', 'password123', 'guru'),
      ('Budi', 'budi@siswa.sdiasih.com', 'password123', 'siswa'),
      ('Ayah Budi', 'ayah.budi@gmail.com', 'password123', 'wali')
      ON CONFLICT (email) DO NOTHING;
    `;
    console.log("Users seeded successfully!");
    console.log("-----------------------");
    console.log("Credentials:");
    console.log("Admin: admin@sdiasih.com / password123");
    console.log("Guru : ahmad@sdiasih.com / password123");
    console.log("Siswa: budi@siswa.sdiasih.com / password123");
    console.log("Wali : ayah.budi@gmail.com / password123");
  } catch (err) {
    console.error(err);
  } finally {
    await sql.end();
  }
}

seed();
