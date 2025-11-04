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
        a.*,
        u.name as created_by_name,
        COUNT(at.id) as attendance_count
      FROM activities a
      LEFT JOIN users u ON a.created_by = u.id
      LEFT JOIN attendance at ON a.id = at.activity_id AND at.status = 'present'
      WHERE a.status = ${status}
      GROUP BY a.id, u.name
      ORDER BY a.activity_date ASC
    `;

    return NextResponse.json({ activities: result.rows });
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
      activity_date,
      location,
      activity_type,
      max_participants,
    } = body;

    // Validate required fields
    if (!title || !activity_date || !location) {
      return NextResponse.json(
        { error: 'Title, activity date, and location are required' },
        { status: 400 }
      );
    }

    // Create activity
    const result = await sql`
      INSERT INTO activities (
        title, description, activity_date, location, activity_type,
        max_participants, created_by, status
      )
      VALUES (
        ${title}, ${description || null}, ${activity_date}, ${location},
        ${activity_type || 'routine'}, ${max_participants || null}, 
        ${token.sub}, 'active'
      )
      RETURNING *
    `;

    const activity = result.rows[0];

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