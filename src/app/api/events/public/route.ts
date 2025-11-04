import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Mock data untuk development jika database tidak tersedia
const mockEvents = [
  {
    id: "1",
    title: "Fun Run Purwakarta 2025",
    description: "Event lari santai untuk semua kalangan dengan jarak 5K. Nikmati suasana pagi yang segar sambil berolahraga bersama komunitas lari Purwakarta.",
    date: new Date("2025-12-15T06:00:00Z"),
    location: "Alun-alun Purwakarta",
    maxParticipants: 500,
    registrationFee: 75000,
    status: "active",
    createdAt: new Date("2025-11-01T00:00:00Z"),
    _count: {
      registrations: 42
    }
  },
  {
    id: "2",
    title: "Marathon Purwakarta Challenge",
    description: "Tantangan marathon untuk pelari berpengalaman. Rute melalui area wisata Situ Wanayasa dengan pemandangan yang indah.",
    date: new Date("2025-12-22T05:30:00Z"),
    location: "Situ Wanayasa, Purwakarta",
    maxParticipants: 200,
    registrationFee: 150000,
    status: "active",
    createdAt: new Date("2025-11-01T00:00:00Z"),
    _count: {
      registrations: 15
    }
  },
  {
    id: "3",
    title: "Kids Run Festival",
    description: "Event lari khusus untuk anak-anak usia 6-12 tahun. Hadiah menarik untuk semua peserta dan sertifikat partisipasi.",
    date: new Date("2025-12-08T07:00:00Z"),
    location: "Taman Kota Purwakarta",
    maxParticipants: 100,
    registrationFee: 0,
    status: "active",
    createdAt: new Date("2025-11-01T00:00:00Z"),
    _count: {
      registrations: 8
    }
  }
];

export async function GET() {
  try {
    // Try database connection first
    const events = await prisma.event.findMany({
      where: {
        status: 'active'
      },
      include: {
        _count: {
          select: {
            registrations: {
              where: {
                status: {
                  in: ['pending', 'confirmed']
                }
              }
            }
          }
        },
        createdBy: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.log('Database connection failed, using mock data:', error instanceof Error ? error.message : 'Unknown error');
    
    // Return mock data if database is not available
    return NextResponse.json({ events: mockEvents });
  }
}