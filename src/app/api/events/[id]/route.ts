import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
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
    
    const result = await sql`
      SELECT 
        e.*,
        u.name as created_by_name,
        COUNT(er.id) as registered_count
      FROM events e
      LEFT JOIN users u ON e.created_by = u.id
      LEFT JOIN event_registrations er ON e.id = er.event_id AND er.status = 'registered'
      WHERE e.id = ${eventId}
      GROUP BY e.id, u.name
    `;

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ event: result.rows[0] });
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
      event_date,
      registration_deadline,
      location,
      max_participants,
      registration_fee,
      category,
      distance,
      image_url,
      status,
    } = body;

    // Update event
    const result = await sql`
      UPDATE events
      SET 
        title = ${title},
        description = ${description || null},
        event_date = ${event_date},
        registration_deadline = ${registration_deadline},
        location = ${location},
        max_participants = ${max_participants || null},
        registration_fee = ${registration_fee || 0},
        category = ${category || null},
        distance = ${distance || null},
        image_url = ${image_url || null},
        status = ${status || 'active'},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${eventId} AND created_by = ${token.sub}
      RETURNING *
    `;

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Event not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Event berhasil diupdate',
      event: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating event:', error);
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
    
    // Delete event (cascades to registrations)
    const result = await sql`
      DELETE FROM events
      WHERE id = ${eventId} AND created_by = ${token.sub}
      RETURNING *
    `;

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Event not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Event berhasil dihapus',
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}