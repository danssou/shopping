import { NextResponse } from 'next/server';

export async function GET() {
  const now = new Date().toISOString();
  console.log('🕒 Health check endpoint called at:', now);
  return NextResponse.json({ 
    message: 'Server is running!', 
    timestamp: now,
    env: process.env.NODE_ENV
  });
}
