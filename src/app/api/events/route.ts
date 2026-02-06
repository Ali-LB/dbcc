import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import type { Session } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;
    let userId: string | undefined = undefined;
    if (session && typeof session === 'object' && 'user' in session && session.user && typeof session.user === 'object' && 'id' in session.user) {
      userId = (session.user as { id?: string }).id;
    }

    const events = await prisma.event.findMany({
      where: { 
        isActive: true,
        published: true // Only show published events to regular users
      },
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

    // Add hasRSVPed property for the current user
    const eventsWithRSVP = events.map(event => {
      let hasRSVPed = false;
      if (userId) {
        hasRSVPed = event.rsvps.some(rsvp => rsvp.userId === userId && rsvp.status === 'CONFIRMED');
      }
      return {
        ...event,
        hasRSVPed,
        rsvps: event.rsvps.map(({ id, status }) => ({ id, status }))
      };
    });

    return NextResponse.json({ events: eventsWithRSVP });
  } catch (error) {
    console.error('Get events error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = (await getServerSession(authOptions)) as Session | null;
  let isAdmin = false;
  if (session && typeof session === 'object' && 'user' in session && session.user && typeof session.user === 'object' && 'name' in session.user) {
    isAdmin = (session.user as { name?: string }).name === 'admin';
  }
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { title, description, location, date, maxAttendees, published } = await request.json();

    if (!title || !description || !location || !date) {
      return NextResponse.json(
        { error: 'Title, description, location, and date are required' },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        location,
        date: new Date(date),
        maxAttendees: maxAttendees || null,
        isActive: true,
        published: published || false
      }
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error('Create event error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const session = (await getServerSession(authOptions)) as Session | null;
  let isAdmin = false;
  if (session && typeof session === 'object' && 'user' in session && session.user && typeof session.user === 'object' && 'name' in session.user) {
    isAdmin = (session.user as { name?: string }).name === 'admin';
  }
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { id, title, description, location, date, maxAttendees, published, isActive } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    const event = await prisma.event.update({
      where: { id },
      data: {
        title,
        description,
        location,
        date: new Date(date),
        maxAttendees: maxAttendees || null,
        published,
        isActive
      }
    });

    return NextResponse.json({ event });
  } catch (error) {
    console.error('Update event error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const session = (await getServerSession(authOptions)) as Session | null;
  let isAdmin = false;
  if (session && typeof session === 'object' && 'user' in session && session.user && typeof session.user === 'object' && 'name' in session.user) {
    isAdmin = (session.user as { name?: string }).name === 'admin';
  }
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    await prisma.event.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
