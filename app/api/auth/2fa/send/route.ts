import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verification } from '@/lib/db/schema';
import { and, eq, gt } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import sendEmail from '@/lib/utils/email';

const CODE_TTL_MINUTES = 10;
const RATE_LIMIT_SECONDS = 60; // 1 per minute per identifier

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const identifier = String(body.identifier || '').toLowerCase();

    if (!identifier || !identifier.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    // rate limit: find recent verification for identifier
    const recentAll = await db
      .select()
      .from(verification)
      .where(and(eq(verification.identifier, identifier), gt(verification.expiresAt, new Date())));

    const recent = recentAll.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

    if (recent) {
      const last = recent;
      const ageSeconds = (Date.now() - new Date(last.createdAt).getTime()) / 1000;
      if (ageSeconds < RATE_LIMIT_SECONDS) {
        return NextResponse.json({ error: 'Please wait before requesting another code' }, { status: 429 });
      }
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const id = randomUUID();
    const expiresAt = new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000);

    await db.insert(verification).values({
      id,
      identifier,
      value: code,
      expiresAt,
    });

    // Send email
    try {
      await sendEmail({
        to: identifier,
        subject: 'Your verification code',
        text: `Your verification code is ${code}. It expires in ${CODE_TTL_MINUTES} minutes.`,
        html: `<p>Your verification code is <strong>${code}</strong>. It expires in ${CODE_TTL_MINUTES} minutes.</p>`,
      });
    } catch (err) {
      console.error('Failed to send 2FA email', err);
      // Still respond success to avoid leaking email deliverability; but return 202 to indicate queued
      return NextResponse.json({ success: true }, { status: 202 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('2FA send error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
