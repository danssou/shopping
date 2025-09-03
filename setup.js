#!/usr/bin/env node
console.log('🚀 Setting up Nike Shopping App...\n');

console.log('📋 Prerequisites:');
console.log('1. Create a Neon PostgreSQL database at https://neon.tech');
console.log('2. Copy your DATABASE_URL connection string');
console.log('3. Create a .env.local file with:');
console.log('   DATABASE_URL="your-connection-string-here"');
console.log('   AUTH_SECRET="your-secret-key-here"');
console.log('');

console.log('🔧 Setup Commands:');
console.log('npm install              # Install dependencies');
console.log('npm run drizzle:push     # Push schema to database');
console.log('npm run db:seed          # Seed with Nike products');
console.log('npm run dev              # Start development server');
console.log('');

console.log('🎯 Your app will be available at: http://localhost:3000');
console.log('📊 Database studio: npm run drizzle:studio');
console.log('');
console.log('Happy coding! 👟✨');
