import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

// Mock data untuk development jika database tidak tersedia
const mockEvents = [
  {
    id: 1,
    title: "Fun Run Purwakarta 2025",
    description: "Event lari santai untuk semua kalangan dengan jarak 5K. Nikmati suasana pagi yang segar sambil berolahraga bersama komunitas lari Purwakarta.",
    event_date: "2025-12-15T06:00:00Z",
    registration_deadline: "2025-12-10T23:59:59Z", 
    location: "Alun-alun Purwakarta",
    max_participants: 500,
    registration_fee: 75000,
    category: "Fun Run",
    distance: "5K",
    image_url: null,
    status: "active",
    created_at: "2025-11-01T00:00:00Z",
    registration_count: 42
  },
  {
    id: 2,
    title: "Marathon Purwakarta Challenge",
    description: "Tantangan marathon untuk pelari berpengalaman. Rute melalui area wisata Situ Wanayasa dengan pemandangan yang indah.",
    event_date: "2025-12-22T05:30:00Z",
    registration_deadline: "2025-12-18T23:59:59Z",
    location: "Situ Wanayasa, Purwakarta",
    max_participants: 200,
    registration_fee: 150000,
    category: "Marathon", 
    distance: "21K",
    image_url: null,
    status: "active",
    created_at: "2025-11-01T00:00:00Z",
    registration_count: 15
  },
  {
    id: 3,
    title: "Kids Run Festival",
    description: "Event lari khusus untuk anak-anak usia 6-12 tahun. Hadiah menarik untuk semua peserta dan sertifikat partisipasi.",
    event_date: "2025-12-08T07:00:00Z",
    registration_deadline: "2025-12-05T23:59:59Z",
    location: "Taman Kota Purwakarta",
    max_participants: 100,
    registration_fee: 0,
    category: "Kids Run",
    distance: "1K",
    image_url: null,
    status: "active", 
    created_at: "2025-11-01T00:00:00Z",
    registration_count: 8
  }
];

export async function GET() {
  try {
    // Try database connection first
    const result = await sql`
      SELECT 
        e.id,
        e.title,
        e.description,
        e.event_date,
        e.registration_deadline,
        e.location,
        e.max_participants,
        e.registration_fee,
        e.category,
        e.distance,
        e.image_url,
        e.status,
        e.created_at,
        COUNT(er.id) as registration_count
      FROM events e
      LEFT JOIN event_registrations er ON e.id = er.event_id 
        AND er.full_name IS NOT NULL 
        AND er.status IN ('pending_payment', 'payment_verified', 'confirmed')
      WHERE e.status = 'active'
      GROUP BY e.id
      ORDER BY e.event_date ASC
    `;

    // Transform data to include _count structure for compatibility
    const events = result.rows.map(event => ({
      ...event,
      _count: {
        registrations: parseInt(event.registration_count || '0')
      }
    }));

    return NextResponse.json({ events });
  } catch (error) {
    console.log('Database connection failed, using mock data:', error instanceof Error ? error.message : 'Unknown error');
    
    // Return mock data if database is not available
    const events = mockEvents.map(event => ({
      ...event,
      _count: {
        registrations: event.registration_count
      }
    }));

    return NextResponse.json({ events });
  }
}