import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import type { Session } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const rsvps = await prisma.rSVP.findMany({
      where: {
        userId: session.user.id,
        status: 'CONFIRMED'
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            description: true,
            location: true,
            date: true,
            isActive: true
          }
        }
      },
      orderBy: {
        event: {
          date: 'asc'
        }
      }
    });

    return NextResponse.json({ rsvps });

  } catch (error) {
    console.error('Get RSVPs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
