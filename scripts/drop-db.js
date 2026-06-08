const postgres = require('postgres');
require('dotenv').config();

async function dropDB() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("No DATABASE_URL found in .env");
  
  const sql = postgres(url);
  try {
    console.log("Dropping public schema...");
    await sql`DROP SCHEMA public CASCADE`;
    console.log("Creating public schema...");
    await sql`CREATE SCHEMA public`;
    console.log("Database tables dropped successfully!");
  } catch (err) {
    console.error(err);
  } finally {
    await sql.end();
  }
}

dropDB();
