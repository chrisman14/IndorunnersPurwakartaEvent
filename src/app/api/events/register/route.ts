import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { getToken } from 'next-auth/jwt';

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { event_id, bib_number, shirt_size, special_needs } = body;

    // Check if event exists and is active
    const eventResult = await sql`
      SELECT id, title, max_participants, registration_deadline, status
      FROM events 
      WHERE id = ${event_id} AND status = 'active'
    `;

    if (eventResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Event tidak ditemukan atau sudah tidak aktif' },
        { status: 404 }
      );
    }

    const event = eventResult.rows[0];

    // Check registration deadline
    if (new Date() > new Date(event.registration_deadline)) {
      return NextResponse.json(
        { error: 'Pendaftaran sudah ditutup' },
        { status: 400 }
      );
    }

    // Check if user already registered
    const existingRegistration = await sql`
      SELECT id FROM event_registrations 
      WHERE event_id = ${event_id} AND user_id = ${token.sub}
    `;

    if (existingRegistration.rows.length > 0) {
      return NextResponse.json(
        { error: 'Anda sudah terdaftar untuk event ini' },
        { status: 400 }
      );
    }

    // Check max participants
    if (event.max_participants) {
      const registeredCount = await sql`
        SELECT COUNT(*) as count 
        FROM event_registrations 
        WHERE event_id = ${event_id} AND status = 'registered'
      `;

      if (parseInt(registeredCount.rows[0].count) >= event.max_participants) {
        return NextResponse.json(
          { error: 'Event sudah penuh' },
          { status: 400 }
        );
      }
    }

    // Create registration
    const result = await sql`
      INSERT INTO event_registrations (
        event_id, user_id, bib_number, shirt_size, special_needs, status, payment_status
      )
      VALUES (
        ${event_id}, ${token.sub}, ${bib_number || null}, ${shirt_size || null}, 
        ${special_needs || null}, 'registered', 'pending'
      )
      RETURNING *
    `;

    return NextResponse.json({
      message: 'Berhasil mendaftar event',
      registration: result.rows[0],
    });
  } catch (error) {
    console.error('Error registering for event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}