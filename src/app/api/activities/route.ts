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
    
    const activities = await prisma.activity.findMany({
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
            attendances: true
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    });

    // Transform to match expected format
    const activitiesFormatted = activities.map(activity => ({
      ...activity,
      created_by_name: activity.createdBy.name,
      attendance_count: activity._count.attendances,
      activity_date: activity.date
    }));

    return NextResponse.json({ activities: activitiesFormatted });
  } catch (error) {
    console.error('Error fetching activities:', error);
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
      type,
    } = body;

    // Validate required fields
    if (!title || !date) {
      return NextResponse.json(
        { error: 'Title and date are required' },
        { status: 400 }
      );
    }

    // Create activity using Prisma
    const activity = await prisma.activity.create({
      data: {
        title,
        description: description || null,
        date: new Date(date),
        location: location || null,
        type: type || 'routine',
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
      message: 'Aktivitas berhasil dibuat',
      activity,
    });
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}