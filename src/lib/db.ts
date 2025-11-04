import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

// Database operations with Prisma Cloud
export async function createAdminUser() {
  try {
    const adminExists = await prisma.user.findUnique({
      where: { email: 'admin@indorunners.com' }
    });

    if (!adminExists) {
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
      return true;
    }
    
    console.log('Admin user already exists');
    return true;
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
}

// Get events from cloud database
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
    console.error('Database error:', error);
    throw error;
  }
}

// Get event by ID from cloud database
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
    throw error;
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