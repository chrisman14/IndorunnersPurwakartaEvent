import { prisma } from './prisma';

// Mock data untuk development tanpa database
export const mockEvents = [
  {
    id: '1',
    title: 'Purwakarta Morning Run',
    description: 'Lari pagi rutin di area Taman Kota Purwakarta untuk menjaga kesehatan dan kebugaran bersama komunitas.',
    date: new Date('2024-12-15T06:00:00'),
    location: 'Taman Kota Purwakarta',
    maxParticipants: 50,
    registrationFee: 25000,
    status: 'active',
    createdAt: new Date('2024-11-01T00:00:00'),
    registrations: []
  },
  {
    id: '2', 
    title: 'Trail Running Situ Wanayasa',
    description: 'Petualangan trail running di kawasan Situ Wanayasa dengan pemandangan alam yang indah.',
    date: new Date('2024-12-22T07:00:00'),
    location: 'Situ Wanayasa, Purwakarta',
    maxParticipants: 30,
    registrationFee: 50000,
    status: 'active',
    createdAt: new Date('2024-11-05T00:00:00'),
    registrations: []
  },
  {
    id: '3',
    title: 'Fun Run Keluarga',
    description: 'Acara lari santai untuk seluruh keluarga dengan berbagai kategori jarak.',
    date: new Date('2025-01-05T08:00:00'),
    location: 'Alun-alun Purwakarta',
    maxParticipants: 100,
    registrationFee: 35000,
    status: 'active',
    createdAt: new Date('2024-11-10T00:00:00'),
    registrations: []
  }
];

// Database operations with Prisma
export async function createAdminUser() {
  try {
    const adminExists = await prisma.user.findUnique({
      where: { email: 'admin@indorunners.com' }
    });

    if (!adminExists) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await prisma.user.create({
        data: {
          email: 'admin@indorunners.com',
          name: 'Admin Indorunners',
          password: hashedPassword,
          role: 'admin'
        }
      });
      
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
    // Don't throw error, just log it for development
  }
}

// Get events (with fallback to mock data)
export async function getEvents() {
  try {
    const events = await prisma.event.findMany({
      include: {
        registrations: true,
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
    
    return events;
  } catch (error) {
    console.error('Database error, using mock data:', error);
    return mockEvents;
  }
}

// Get event by ID
export async function getEventById(id: string) {
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        registrations: true,
        createdBy: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });
    
    return event;
  } catch (error) {
    console.error('Database error:', error);
    return mockEvents.find(event => event.id === id) || null;
  }
}

// Create event registration
export async function createEventRegistration(eventId: string, registrationData: any) {
  try {
    const registration = await prisma.registration.create({
      data: {
        eventId,
        fullName: registrationData.fullName,
        email: registrationData.email,
        phone: registrationData.phone,
        emergencyContact: registrationData.emergencyContact,
        medicalInfo: registrationData.medicalInfo,
        paymentProof: registrationData.paymentProof,
        status: 'pending'
      }
    });
    
    return registration;
  } catch (error) {
    console.error('Error creating registration:', error);
    throw error;
  }
}

export { prisma };