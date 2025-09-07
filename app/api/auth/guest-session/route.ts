import { NextResponse } from 'next/server';
import { createGuestSession, getGuestSession } from '@/lib/auth/actions';

export async function POST() {
  try {
    const result = await createGuestSession();
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        sessionToken: result.sessionToken,
      });
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Guest session creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const guestSession = await getGuestSession();
    
    if (guestSession) {
      return NextResponse.json({
        success: true,
        guestSession,
      });
    } else {
      return NextResponse.json(
        { error: 'No active guest session found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Guest session retrieval error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
