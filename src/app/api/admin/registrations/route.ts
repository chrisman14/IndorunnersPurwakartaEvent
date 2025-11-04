import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const result = await sql`
      SELECT 
        er.id,
        er.registration_id,
        er.event_id,
        e.title as event_title,
        e.event_date,
        e.registration_fee,
        er.full_name,
        er.email,
        er.phone,
        er.birth_date,
        er.gender,
        er.emergency_contact_name,
        er.emergency_contact_phone,
        er.t_shirt_size,
        er.special_needs,
        er.payment_proof_url,
        er.status,
        er.registered_at
      FROM event_registrations er
      JOIN events e ON er.event_id = e.id
      WHERE er.full_name IS NOT NULL
      ORDER BY er.registered_at DESC
    `;

    return NextResponse.json({
      registrations: result.rows
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
    const validStatuses = ['pending_payment', 'confirmed', 'cancelled', 'payment_verified'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    await sql`
      UPDATE event_registrations 
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${registration_id}
    `;

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