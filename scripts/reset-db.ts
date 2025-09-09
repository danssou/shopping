import { db } from '../lib/db';
import { sql } from 'drizzle-orm';

async function resetDatabase() {
  try {
    console.log('Dropping all tables...');
    
    // Drop all tables in the correct order (reverse of foreign key dependencies)
    await db.execute(sql`DROP TABLE IF EXISTS "session" CASCADE;`);
    await db.execute(sql`DROP TABLE IF EXISTS "account" CASCADE;`);
    await db.execute(sql`DROP TABLE IF EXISTS "verification" CASCADE;`);
    await db.execute(sql`DROP TABLE IF EXISTS "guest" CASCADE;`);
    await db.execute(sql`DROP TABLE IF EXISTS "user" CASCADE;`);
    await db.execute(sql`DROP TABLE IF EXISTS "products" CASCADE;`);
    
    console.log('All tables dropped successfully!');
  } catch (error) {
    console.error('Error resetting database:', error);
  }
}

resetDatabase().then(() => process.exit(0)).catch((error) => {
  console.error(error);
  process.exit(1);
});
