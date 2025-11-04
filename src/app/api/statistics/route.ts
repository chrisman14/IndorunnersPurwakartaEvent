import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (token.role === 'admin') {
      // Admin statistics
      const [
        eventsResult,
        activitiesResult,
        usersResult,
        registrationsResult,
        attendanceResult,
        recentEventsResult,
        recentRegistrationsResult
      ] = await Promise.all([
        sql`SELECT COUNT(*) as count FROM events WHERE status = 'active'`,
        sql`SELECT COUNT(*) as count FROM activities WHERE status = 'active'`,
        sql`SELECT COUNT(*) as count FROM users WHERE role = 'user'`,
        sql`SELECT COUNT(*) as count FROM event_registrations WHERE status = 'registered'`,
        sql`SELECT COUNT(*) as count FROM attendance WHERE status = 'present'`,
        sql`
          SELECT id, title, event_date, created_at
          FROM events 
          WHERE status = 'active'
          ORDER BY created_at DESC 
          LIMIT 5
        `,
        sql`
          SELECT 
            er.registration_date,
            u.name as user_name,
            e.title as event_title
          FROM event_registrations er
          JOIN users u ON er.user_id = u.id
          JOIN events e ON er.event_id = e.id
          WHERE er.status = 'registered'
          ORDER BY er.registration_date DESC
          LIMIT 5
        `
      ]);

      return NextResponse.json({
        statistics: {
          total_events: parseInt(eventsResult.rows[0].count),
          total_activities: parseInt(activitiesResult.rows[0].count),
          total_users: parseInt(usersResult.rows[0].count),
          total_registrations: parseInt(registrationsResult.rows[0].count),
          total_attendance: parseInt(attendanceResult.rows[0].count),
        },
        recent_events: recentEventsResult.rows,
        recent_registrations: recentRegistrationsResult.rows,
      });
    } else {
      // User statistics
      const [
        myRegistrationsResult,
        myAttendanceResult,
        upcomingEventsResult,
        upcomingActivitiesResult
      ] = await Promise.all([
        sql`
          SELECT COUNT(*) as count 
          FROM event_registrations 
          WHERE user_id = ${token.sub} AND status = 'registered'
        `,
        sql`
          SELECT COUNT(*) as count 
          FROM attendance 
          WHERE user_id = ${token.sub} AND status = 'present'
        `,
        sql`
          SELECT COUNT(*) as count 
          FROM events 
          WHERE status = 'active' AND event_date > NOW()
        `,
        sql`
          SELECT COUNT(*) as count 
          FROM activities 
          WHERE status = 'active' AND activity_date > NOW()
        `
      ]);

      // Get user's recent registrations
      const recentRegistrations = await sql`
        SELECT 
          e.id,
          e.title,
          e.event_date,
          er.registration_date
        FROM event_registrations er
        JOIN events e ON er.event_id = e.id
        WHERE er.user_id = ${token.sub} AND er.status = 'registered'
        ORDER BY er.registration_date DESC
        LIMIT 3
      `;

      // Get user's recent attendance
      const recentAttendance = await sql`
        SELECT 
          COALESCE(act.title, e.title) as title,
          a.attendance_date,
          a.status,
          CASE 
            WHEN a.activity_id IS NOT NULL THEN 'activity'
            ELSE 'event'
          END as type
        FROM attendance a
        LEFT JOIN activities act ON a.activity_id = act.id
        LEFT JOIN events e ON a.event_id = e.id
        WHERE a.user_id = ${token.sub}
        ORDER BY a.attendance_date DESC
        LIMIT 3
      `;

      return NextResponse.json({
        statistics: {
          my_registrations: parseInt(myRegistrationsResult.rows[0].count),
          my_attendance: parseInt(myAttendanceResult.rows[0].count),
          upcoming_events: parseInt(upcomingEventsResult.rows[0].count),
          upcoming_activities: parseInt(upcomingActivitiesResult.rows[0].count),
        },
        recent_registrations: recentRegistrations.rows,
        recent_attendance: recentAttendance.rows,
      });
    }
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}