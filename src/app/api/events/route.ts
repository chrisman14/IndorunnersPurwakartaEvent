import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'active';
    
    const result = await sql`
      SELECT 
        e.*,
        u.name as created_by_name,
        COUNT(er.id) as registered_count
      FROM events e
      LEFT JOIN users u ON e.created_by = u.id
      LEFT JOIN event_registrations er ON e.id = er.event_id AND er.status = 'registered'
      WHERE e.status = ${status}
      GROUP BY e.id, u.name
      ORDER BY e.event_date ASC
    `;

    return NextResponse.json({ events: result.rows });
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
      event_date,
      registration_deadline,
      location,
      max_participants,
      registration_fee,
      category,
      distance,
      image_url,
    } = body;

    // Validate required fields
    if (!title || !event_date || !registration_deadline || !location) {
      return NextResponse.json(
        { error: 'Title, event date, registration deadline, and location are required' },
        { status: 400 }
      );
    }

    // Create event
    const result = await sql`
      INSERT INTO events (
        title, description, event_date, registration_deadline, location,
        max_participants, registration_fee, category, distance, image_url,
        created_by, status
      )
      VALUES (
        ${title}, ${description || null}, ${event_date}, ${registration_deadline}, ${location},
        ${max_participants || null}, ${registration_fee || 0}, ${category || null}, 
        ${distance || null}, ${image_url || null}, ${token.sub}, 'active'
      )
      RETURNING *
    `;

    const event = result.rows[0];

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