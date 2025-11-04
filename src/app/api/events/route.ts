import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'active';
    
    const events = await prisma.event.findMany({
      where: {
        status: status
      },
      include: {
        createdBy: {
          select: {
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            registrations: {
              where: {
                status: {
                  in: ['confirmed', 'pending']
                }
              }
            }
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    });

    // Transform to match expected format
    const eventsFormatted = events.map(event => ({
      ...event,
      created_by_name: event.createdBy.name,
      registered_count: event._count.registrations,
      event_date: event.date,
      registration_deadline: event.date, // Adjust based on your schema
      max_participants: event.maxParticipants,
      registration_fee: event.registrationFee
    }));

    return NextResponse.json({ events: eventsFormatted });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    
    if (!token || token.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      date,
      location,
      maxParticipants,
      registrationFee,
    } = body;

    // Validate required fields
    if (!title || !date || !location) {
      return NextResponse.json(
        { error: 'Title, date, and location are required' },
        { status: 400 }
      );
    }

    // Create event using Prisma
    const event = await prisma.event.create({
      data: {
        title,
        description: description || null,
        date: new Date(date),
        location,
        maxParticipants: maxParticipants || null,
        registrationFee: registrationFee || 0,
        createdById: token.sub!,
        status: 'active'
      },
      include: {
        createdBy: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({
      message: 'Event berhasil dibuat',
      event,
    });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}