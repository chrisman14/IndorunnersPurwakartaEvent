import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get total events (past year)
    const totalEvents = await prisma.event.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) // 1 year ago
        }
      }
    });

    // Get total registrations
    const totalRegistrations = await prisma.registration.count();

    // Get pending registrations
    const pendingRegistrations = await prisma.registration.count({
      where: {
        status: 'pending'
      }
    });

    // Get confirmed registrations
    const confirmedRegistrations = await prisma.registration.count({
      where: {
        status: 'confirmed'
      }
    });

    // Get recent registrations with event details
    const recentRegistrations = await prisma.registration.findMany({
      take: 5,
      orderBy: {
        registeredAt: 'desc'
      },
      include: {
        event: {
          select: {
            title: true
          }
        }
      }
    });

    // Transform to match expected format
    const recentRegistrationsFormatted = recentRegistrations.map(reg => ({
      id: reg.id,
      full_name: reg.fullName,
      event_title: reg.event.title,
      status: reg.status,
      registered_at: reg.registeredAt
    }));

    return NextResponse.json({
      totalEvents,
      totalRegistrations,
      pendingRegistrations,
      confirmedRegistrations,
      recentRegistrations: recentRegistrationsFormatted,
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}