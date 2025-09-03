import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { Client } from 'pg';

async function runMigrations() {
  const migrationsDir = path.join(process.cwd(), 'drizzle', 'migrations');
  const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();
  const sql = files.map((f) => fs.readFileSync(path.join(migrationsDir, f), 'utf8')).join('\n');

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('Missing DATABASE_URL');

  const client = new Client({ connectionString });
  await client.connect();
  try {
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log('Migrations applied successfully');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration failed', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations();
