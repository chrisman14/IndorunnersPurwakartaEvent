import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sql } from '@vercel/postgres';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      password,
      phone,
      dateOfBirth,
      gender,
      emergencyContact,
      emergencyPhone,
    } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const result = await sql`
      INSERT INTO users (
        name, email, password, phone, date_of_birth, gender, 
        emergency_contact, emergency_phone, role
      )
      VALUES (
        ${name}, ${email}, ${hashedPassword}, ${phone || null}, 
        ${dateOfBirth || null}, ${gender || null}, 
        ${emergencyContact || null}, ${emergencyPhone || null}, 'user'
      )
      RETURNING id, name, email, role
    `;

    const user = result.rows[0];

    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}