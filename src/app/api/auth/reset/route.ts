import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  const { token, password } = await request.json();
  if (!token || !password) {
    return NextResponse.json({ error: 'Token and password are required' }, { status: 400 });
  }
  const dbToken = await prisma.token.findUnique({ where: { token }, include: { user: true } });
  if (!dbToken || dbToken.type !== 'PASSWORD_RESET' || dbToken.expiresAt < new Date()) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  await prisma.user.update({ where: { id: dbToken.userId }, data: { password: hashedPassword } });
  await prisma.token.delete({ where: { token } });
  return NextResponse.json({ message: 'Password reset successfully. You can now sign in.' });
} 