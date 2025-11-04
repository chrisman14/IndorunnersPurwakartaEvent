import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sql } from '@vercel/postgres';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, setupKey } = body;

    // Validate setup key (in production, use proper security)
    if (setupKey !== 'INDORUNNERS2024') {
      return NextResponse.json(
        { error: 'Setup key tidak valid' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if any admin already exists
    const existingAdmin = await sql`
      SELECT id FROM users WHERE role = 'admin' LIMIT 1
    `;

    if (existingAdmin.rows.length > 0) {
      return NextResponse.json(
        { error: 'Admin sudah ada dalam sistem' },
        { status: 400 }
      );
    }

    // Check if user with email already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'User dengan email ini sudah ada' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin user
    const result = await sql`
      INSERT INTO users (
        name, email, password, role
      )
      VALUES (
        ${name}, ${email}, ${hashedPassword}, 'admin'
      )
      RETURNING id, name, email, role
    `;

    const admin = result.rows[0];

    return NextResponse.json({
      message: 'Admin berhasil dibuat',
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Admin setup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}