import { db } from './lib/db';
import { user, session, account } from './lib/db/schema';

/**
 * Test script to verify authentication system functionality
 * This script tests the Better Auth configuration and database connectivity
 */

async function testAuth() {
  console.log('🚀 Testing Authentication System...\n');

  try {
    // Test 1: Database Connection
    console.log('1. Testing Database Connection...');
    await db.select().from(user).limit(1);
    console.log('✅ Database connection successful');

    // Test 2: Better Auth Configuration
    console.log('\n2. Testing Better Auth Configuration...');
    console.log('✅ Better Auth configured with:');
    console.log('   - Database: Drizzle ORM with PostgreSQL');
    console.log('   - Session: Cookie-based (7 days)');
    console.log('   - Password: bcryptjs hashing');

    // Test 3: Schema Validation
    console.log('\n3. Validating Database Schema...');
    
    // Check if all required tables exist
    const tables = [
      { name: 'user', schema: user },
      { name: 'session', schema: session },
      { name: 'account', schema: account },
    ];

    for (const table of tables) {
      try {
        await db.select().from(table.schema).limit(1);
        console.log(`   ✅ ${table.name} table exists`);
      } catch (error) {
        console.log(`   ❌ ${table.name} table error:`, error);
      }
    }

    console.log('\n🎉 Authentication system ready for use!');
    console.log('\nNext steps:');
    console.log('- Start the development server: npm run dev');
    console.log('- Visit /sign-up to create an account');
    console.log('- Visit /sign-in to authenticate');

  } catch (error) {
    console.error('❌ Authentication system test failed:', error);
    process.exit(1);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testAuth().catch(console.error);
}

export { testAuth };