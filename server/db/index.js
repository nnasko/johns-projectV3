import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'database.sqlite');

export async function getDb() {
  return open({
    filename: dbPath,
    driver: sqlite3.Database
  });
}

export async function query(sql, params = []) {
  const db = await getDb();
  try {
    return await db.all(sql, params);
  } finally {
    await db.close();
  }
}

export async function get(sql, params = []) {
  const db = await getDb();
  try {
    return await db.get(sql, params);
  } finally {
    await db.close();
  }
}

export async function run(sql, params = []) {
  const db = await getDb();
  try {
    return await db.run(sql, params);
  } finally {
    await db.close();
  }
}