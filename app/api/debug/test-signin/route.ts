import { auth } from '@/lib/auth';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Test Sign-In Endpoint: Starting test authentication...');
    
    // Test authentication
    const result = await auth.api.signInEmail({
      body: {
        email: 'test@example.com',
        password: 'password123',
      },
      headers: request.headers,
    });
    
    console.log('🧪 Test Sign-In Result:', result);
    
    // Check session after sign-in
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    
    console.log('🧪 Test Session after sign-in:', session);
    
    return Response.json({
      success: true,
      signInResult: result,
      session: session,
    });
    
  } catch (error) {
    console.error('🧪 Test Sign-In Error:', error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
