import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/lib/schema';
import { sql } from 'drizzle-orm';

const testDatabaseConnection = async () => {
  try {
    console.log('🔍 Testing database connection...');
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('DATABASE_URL prefix:', process.env.DATABASE_URL?.substring(0, 30));
    
    // Test simple query first
    const result = await db.execute(sql`SELECT 1 as test`);
    console.log('✅ Basic query works:', result);
    
    // Test table exists
    const tableCheck = await db.execute(sql`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'products'
    `);
    console.log('📋 Table check:', tableCheck);
    
    // Try to select from products table
    const allProducts = await db.select().from(products);
    console.log('🛍️ Products count:', allProducts.length);
    
    return NextResponse.json({
      success: true,
      databaseConnected: true,
      tableExists: tableCheck.rows.length > 0,
      productCount: allProducts.length,
      products: allProducts.slice(0, 2) // Just first 2 products
    });
  } catch (error) {
    console.error('❌ Error in test endpoint:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        databaseUrl: !!process.env.DATABASE_URL
      },
      { status: 500 }
    );
  }
};

export { testDatabaseConnection as GET };
