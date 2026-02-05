import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 });
  }

  const dbToken = await prisma.token.findUnique({
    where: { token },
    include: { user: true }
  });

  if (!dbToken || dbToken.type !== 'EMAIL_CONFIRMATION' || dbToken.expiresAt < new Date()) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
  }

  // Activate user
  await prisma.user.update({
    where: { id: dbToken.userId },
    data: { isActive: true }
  });

  // Delete the token
  await prisma.token.delete({ where: { token } });

  return NextResponse.json({ message: 'Email confirmed successfully. You can now sign in.' });
} 