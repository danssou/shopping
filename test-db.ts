import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const testConnection = async () => {
  try {
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('DATABASE_URL starts with:', process.env.DATABASE_URL?.substring(0, 20));
    
    const sql = neon(process.env.DATABASE_URL!);
    const result = await sql`SELECT version()`;
    console.log('✅ Database connection successful');
    console.log('PostgreSQL version:', result[0].version);
    
    // Test if products table exists
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'products'
    `;
    console.log('Products table exists:', tables.length > 0);
    
    if (tables.length > 0) {
      const count = await sql`SELECT COUNT(*) as count FROM products`;
      console.log('Number of products in table:', count[0].count);
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
};

testConnection();
