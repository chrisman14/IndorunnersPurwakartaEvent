import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    // Get total events
    const eventsResult = await sql`
      SELECT COUNT(*) as count FROM events WHERE created_at > NOW() - INTERVAL '1 year'
    `;
    const totalEvents = parseInt(eventsResult.rows[0].count);

    // Get total registrations
    const registrationsResult = await sql`
      SELECT COUNT(*) as count FROM event_registrations WHERE full_name IS NOT NULL
    `;
    const totalRegistrations = parseInt(registrationsResult.rows[0].count);

    // Get pending registrations
    const pendingResult = await sql`
      SELECT COUNT(*) as count FROM event_registrations 
      WHERE status = 'pending_payment' AND full_name IS NOT NULL
    `;
    const pendingRegistrations = parseInt(pendingResult.rows[0].count);

    // Get confirmed registrations
    const confirmedResult = await sql`
      SELECT COUNT(*) as count FROM event_registrations 
      WHERE status = 'confirmed' AND full_name IS NOT NULL
    `;
    const confirmedRegistrations = parseInt(confirmedResult.rows[0].count);

    // Get recent registrations
    const recentResult = await sql`
      SELECT 
        er.id,
        er.full_name,
        e.title as event_title,
        er.status,
        er.registered_at
      FROM event_registrations er
      JOIN events e ON er.event_id = e.id
      WHERE er.full_name IS NOT NULL
      ORDER BY er.registered_at DESC
      LIMIT 5
    `;

    return NextResponse.json({
      totalEvents,
      totalRegistrations,
      pendingRegistrations,
      confirmedRegistrations,
      recentRegistrations: recentResult.rows,
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}