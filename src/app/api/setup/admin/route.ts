import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    // Simple protection - only allow if no admin exists or if secret key provided
    const { secret } = await request.json();
    
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@indorunners.com' }
    });

    if (existingAdmin && secret !== process.env.SETUP_SECRET) {
      return NextResponse.json(
        { error: 'Admin already exists and no valid setup secret provided' },
        { status: 403 }
      );
    }

    if (existingAdmin) {
      return NextResponse.json({
        message: 'Admin user already exists',
        admin: {
          email: existingAdmin.email,
          name: existingAdmin.name,
          role: existingAdmin.role,
          created: false
        }
      });
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await prisma.user.create({
      data: {
        email: 'admin@indorunners.com',
        name: 'Admin Indorunners',
        password: hashedPassword,
        role: 'admin'
      }
    });

    return NextResponse.json({
      message: 'Admin user created successfully',
      admin: {
        email: admin.email,
        name: admin.name,
        role: admin.role,
        created: true
      },
      credentials: {
        email: 'admin@indorunners.com',
        password: 'admin123'
      }
    });

  } catch (error) {
    console.error('Setup admin error:', error);
    return NextResponse.json(
      { error: 'Failed to setup admin user', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}