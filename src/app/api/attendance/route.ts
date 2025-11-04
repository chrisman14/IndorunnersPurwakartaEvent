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
    const activityId = searchParams.get('activity_id');
    const eventId = searchParams.get('event_id');
    const userId = searchParams.get('user_id');

    let query = '';
    let params: any[] = [];

    if (token.role === 'admin') {
      // Admin can see all attendance
      if (activityId) {
        query = `
          SELECT 
            a.*,
            u.name as user_name,
            u.email as user_email,
            act.title as activity_title
          FROM attendance a
          JOIN users u ON a.user_id = u.id
          JOIN activities act ON a.activity_id = act.id
          WHERE a.activity_id = $1
          ORDER BY a.attendance_date DESC
        `;
        params = [activityId];
      } else if (eventId) {
        query = `
          SELECT 
            a.*,
            u.name as user_name,
            u.email as user_email,
            e.title as event_title
          FROM attendance a
          JOIN users u ON a.user_id = u.id
          JOIN events e ON a.event_id = e.id
          WHERE a.event_id = $1
          ORDER BY a.attendance_date DESC
        `;
        params = [eventId];
      } else {
        query = `
          SELECT 
            a.*,
            u.name as user_name,
            u.email as user_email,
            COALESCE(act.title, e.title) as title,
            CASE 
              WHEN a.activity_id IS NOT NULL THEN 'activity'
              ELSE 'event'
            END as type
          FROM attendance a
          JOIN users u ON a.user_id = u.id
          LEFT JOIN activities act ON a.activity_id = act.id
          LEFT JOIN events e ON a.event_id = e.id
          ORDER BY a.attendance_date DESC
        `;
      }
    } else {
      // Users can only see their own attendance
      if (activityId) {
        query = `
          SELECT 
            a.*,
            act.title as activity_title
          FROM attendance a
          JOIN activities act ON a.activity_id = act.id
          WHERE a.activity_id = $1 AND a.user_id = $2
          ORDER BY a.attendance_date DESC
        `;
        params = [activityId, token.sub];
      } else if (eventId) {
        query = `
          SELECT 
            a.*,
            e.title as event_title
          FROM attendance a
          JOIN events e ON a.event_id = e.id
          WHERE a.event_id = $1 AND a.user_id = $2
          ORDER BY a.attendance_date DESC
        `;
        params = [eventId, token.sub];
      } else {
        query = `
          SELECT 
            a.*,
            COALESCE(act.title, e.title) as title,
            CASE 
              WHEN a.activity_id IS NOT NULL THEN 'activity'
              ELSE 'event'
            END as type
          FROM attendance a
          LEFT JOIN activities act ON a.activity_id = act.id
          LEFT JOIN events e ON a.event_id = e.id
          WHERE a.user_id = $1
          ORDER BY a.attendance_date DESC
        `;
        params = [token.sub];
      }
    }

    const result = await sql.query(query, params);

    return NextResponse.json({ attendance: result.rows });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { activity_id, event_id, user_id, status, notes } = body;

    // Validate that either activity_id or event_id is provided, but not both
    if ((!activity_id && !event_id) || (activity_id && event_id)) {
      return NextResponse.json(
        { error: 'Either activity_id or event_id must be provided, but not both' },
        { status: 400 }
      );
    }

    let targetUserId = user_id;

    // If admin is creating attendance for another user
    if (token.role === 'admin' && user_id) {
      targetUserId = user_id;
    } else {
      // Regular user can only create attendance for themselves
      targetUserId = token.sub;
    }

    // Check if attendance already exists
    let existingQuery = '';
    let existingParams: any[] = [];

    if (activity_id) {
      existingQuery = 'SELECT id FROM attendance WHERE activity_id = $1 AND user_id = $2';
      existingParams = [activity_id, targetUserId];
    } else {
      existingQuery = 'SELECT id FROM attendance WHERE event_id = $1 AND user_id = $2';
      existingParams = [event_id, targetUserId];
    }

    const existing = await sql.query(existingQuery, existingParams);

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: 'Absensi sudah tercatat untuk user ini' },
        { status: 400 }
      );
    }

    // Create attendance record
    const result = await sql`
      INSERT INTO attendance (
        activity_id, event_id, user_id, status, notes
      )
      VALUES (
        ${activity_id || null}, ${event_id || null}, ${targetUserId}, 
        ${status || 'present'}, ${notes || null}
      )
      RETURNING *
    `;

    return NextResponse.json({
      message: 'Absensi berhasil dicatat',
      attendance: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating attendance:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}