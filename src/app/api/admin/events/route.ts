import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import type { Session } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = (await getServerSession(authOptions)) as Session | null;
  let isAdmin = false;
  if (session && typeof session === 'object' && 'user' in session && session.user && typeof session.user === 'object' && 'name' in session.user) {
    isAdmin = (session.user as { name?: string }).name === 'admin';
  }
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const events = await prisma.event.findMany({
      include: {
        rsvps: {
          select: {
            id: true,
            status: true,
            userId: true
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Get admin events error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
