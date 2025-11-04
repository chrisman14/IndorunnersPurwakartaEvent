import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await sql`
      SELECT 
        er.*,
        e.title as event_title,
        e.event_date,
        e.location,
        e.category,
        e.distance
      FROM event_registrations er
      JOIN events e ON er.event_id = e.id
      WHERE er.user_id = ${token.sub}
      ORDER BY er.registration_date DESC
    `;

    return NextResponse.json({ registrations: result.rows });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}