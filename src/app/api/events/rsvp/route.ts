import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import type { Session } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { eventId } = await request.json();

    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    // Check if event exists and is active
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { rsvps: true }
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    if (!event.isActive) {
      return NextResponse.json(
        { error: 'Event is not active' },
        { status: 400 }
      );
    }

    // Check if user already has an RSVP
    const existingRSVP = await prisma.rSVP.findUnique({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId
        }
      }
    });

    if (existingRSVP) {
      return NextResponse.json(
        { error: 'You have already RSVPed to this event' },
        { status: 409 }
      );
    }

    // Check if event is full
    if (event.maxAttendees && event.rsvps.length >= event.maxAttendees) {
      return NextResponse.json(
        { error: 'Event is full' },
        { status: 400 }
      );
    }

    // Create RSVP
    const rsvp = await prisma.rSVP.create({
      data: {
        userId: session.user.id,
        eventId,
        status: 'CONFIRMED'
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            date: true,
            location: true
          }
        }
      }
    });

    return NextResponse.json(
      { 
        message: 'RSVP successful',
        rsvp 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('RSVP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');

    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    // Find and delete RSVP
    const rsvp = await prisma.rSVP.findUnique({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId
        }
      }
    });

    if (!rsvp) {
      return NextResponse.json(
        { error: 'RSVP not found' },
        { status: 404 }
      );
    }

    await prisma.rSVP.delete({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId
        }
      }
    });

    return NextResponse.json(
      { message: 'RSVP cancelled successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Cancel RSVP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
