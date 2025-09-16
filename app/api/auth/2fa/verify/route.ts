import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verification } from '@/lib/db/schema';
import { and, eq, gt } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const identifier = String(body.identifier || '').toLowerCase();
    const code = String(body.code || '').trim();

    if (!identifier || !code) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const found = await db
      .select()
      .from(verification)
      .where(and(eq(verification.identifier, identifier), eq(verification.value, code), gt(verification.expiresAt, new Date())))
      .limit(1);

    if (!found || found.length === 0) {
      return NextResponse.json({ success: false, error: 'Invalid or expired code' }, { status: 400 });
    }

    // Delete used verification tokens
    await db.delete(verification).where(eq(verification.id, found[0].id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('2FA verify error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
