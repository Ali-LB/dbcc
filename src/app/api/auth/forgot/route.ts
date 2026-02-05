import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';

export async function POST(request: NextRequest) {
  const { email } = await request.json();
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // Do not reveal if user exists
    return NextResponse.json({ message: 'If an account exists, a reset link will be sent.' });
  }
  // Generate token
  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
  await prisma.token.create({
    data: {
      type: 'PASSWORD_RESET',
      token,
      userId: user.id,
      expiresAt
    }
  });
  // Log reset link (simulate email)
  const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset?token=${token}`;
  console.log('Password reset link:', resetUrl);
  return NextResponse.json({ message: 'If an account exists, a reset link will be sent.' });
} 