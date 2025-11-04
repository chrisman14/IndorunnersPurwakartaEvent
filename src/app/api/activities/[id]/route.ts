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

    const { id: activityId } = await params;
    
    const result = await sql`
      SELECT 
        a.*,
        u.name as created_by_name,
        COUNT(at.id) as attendance_count
      FROM activities a
      LEFT JOIN users u ON a.created_by = u.id
      LEFT JOIN attendance at ON a.id = at.activity_id AND at.status = 'present'
      WHERE a.id = ${activityId}
      GROUP BY a.id, u.name
    `;

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }

    return NextResponse.json({ activity: result.rows[0] });
  } catch (error) {
    console.error('Error fetching activity:', error);
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

    const { id: activityId } = await params;
    const body = await request.json();
    const {
      title,
      description,
      activity_date,
      location,
      activity_type,
      max_participants,
      status,
    } = body;

    // Update activity
    const result = await sql`
      UPDATE activities
      SET 
        title = ${title},
        description = ${description || null},
        activity_date = ${activity_date},
        location = ${location},
        activity_type = ${activity_type || 'routine'},
        max_participants = ${max_participants || null},
        status = ${status || 'active'},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${activityId} AND created_by = ${token.sub}
      RETURNING *
    `;

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Activity not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Aktivitas berhasil diupdate',
      activity: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating activity:', error);
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

    const { id: activityId } = await params;
    
    // Delete activity (cascades to attendance)
    const result = await sql`
      DELETE FROM activities
      WHERE id = ${activityId} AND created_by = ${token.sub}
      RETURNING *
    `;

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Activity not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Aktivitas berhasil dihapus',
    });
  } catch (error) {
    console.error('Error deleting activity:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}