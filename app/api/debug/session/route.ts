import { auth } from '@/lib/auth';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ 
      headers: request.headers,
    });
    
    console.log('🔍 Debug session endpoint - Raw session:', session);
    
    return Response.json({ 
      success: true,
      session,
      hasSession: !!session,
      hasUser: !!session?.user,
      cookies: request.headers.get('cookie'),
    });
  } catch (error) {
    console.error('🔍 Debug session endpoint error:', error);
    return Response.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      cookies: request.headers.get('cookie'),
    });
  }
}
