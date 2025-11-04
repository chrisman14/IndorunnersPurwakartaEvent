import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const registrations = await prisma.registration.findMany({
      include: {
        event: {
          select: {
            title: true,
            date: true,
            registrationFee: true
          }
        }
      },
      orderBy: {
        registeredAt: 'desc'
      }
    });

    // Transform to match expected format
    const registrationsFormatted = registrations.map(reg => ({
      id: reg.id,
      registration_id: reg.id, // Compatibility
      event_id: reg.eventId,
      event_title: reg.event.title,
      event_date: reg.event.date,
      registration_fee: reg.event.registrationFee,
      full_name: reg.fullName,
      email: reg.email,
      phone: reg.phone,
      emergency_contact_name: reg.emergencyContact,
      special_needs: reg.medicalInfo,
      payment_proof_url: reg.paymentProof,
      status: reg.status,
      registered_at: reg.registeredAt
    }));

    return NextResponse.json({
      registrations: registrationsFormatted
    });

  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { registration_id, status } = await request.json();

    if (!registration_id || !status) {
      return NextResponse.json(
        { error: 'Registration ID and status are required' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    await prisma.registration.update({
      where: {
        id: registration_id
      },
      data: {
        status: status
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Registration status updated successfully'
    });

  } catch (error) {
    console.error('Error updating registration status:', error);
    return NextResponse.json(
      { error: 'Failed to update registration status' },
      { status: 500 }
    );
  }
}