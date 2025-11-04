import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const token = await getToken({ req: request });
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: eventId } = await params;
    
    const event = await prisma.event.findUnique({
      where: {
        id: eventId
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
      }
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Transform to match expected format
    const eventFormatted = {
      ...event,
      created_by_name: event.createdBy.name,
      registered_count: event._count.registrations,
      event_date: event.date,
      max_participants: event.maxParticipants,
      registration_fee: event.registrationFee
    };

    return NextResponse.json({ event: eventFormatted });
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const token = await getToken({ req: request });
    
    if (!token || token.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: eventId } = await params;
    const body = await request.json();
    const {
      title,
      description,
      date,
      location,
      maxParticipants,
      registrationFee,
      status,
    } = body;

    // Update event using Prisma
    const event = await prisma.event.update({
      where: {
        id: eventId,
        createdById: token.sub! // Ensure only creator can update
      },
      data: {
        title,
        description: description || null,
        date: date ? new Date(date) : undefined,
        location,
        maxParticipants: maxParticipants || null,
        registrationFee: registrationFee || 0,
        status: status || 'active'
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
      message: 'Event berhasil diupdate',
      event,
    });
  } catch (error: any) {
    console.error('Error updating event:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Event not found or unauthorized' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const token = await getToken({ req: request });
    
    if (!token || token.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: eventId } = await params;
    
    // Delete event using Prisma (cascades to registrations due to onDelete: Cascade)
    await prisma.event.delete({
      where: {
        id: eventId,
        createdById: token.sub! // Ensure only creator can delete
      }
    });

    return NextResponse.json({
      message: 'Event berhasil dihapus',
    });
  } catch (error: any) {
    console.error('Error deleting event:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Event not found or unauthorized' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}