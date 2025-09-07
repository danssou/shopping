import { NextResponse } from 'next/server';

const checkServerHealth = async () => {
  const now = new Date().toISOString();
  console.log('🕒 Health check endpoint called at:', now);
  return NextResponse.json({ 
    message: 'Server is running!', 
    timestamp: now,
    env: process.env.NODE_ENV
  });
};

export { checkServerHealth as GET };
