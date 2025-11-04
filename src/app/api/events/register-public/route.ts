import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const eventId = formData.get('event_id') as string;
    const fullName = formData.get('full_name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const birthDate = formData.get('birth_date') as string;
    const gender = formData.get('gender') as string;
    const emergencyContactName = formData.get('emergency_contact_name') as string;
    const emergencyContactPhone = formData.get('emergency_contact_phone') as string;
    const tShirtSize = formData.get('t_shirt_size') as string;
    const specialNeeds = formData.get('special_needs') as string;
    const paymentProof = formData.get('payment_proof') as File;

    // Validate required fields
    if (!eventId || !fullName || !email || !phone || !birthDate || !gender || 
        !emergencyContactName || !emergencyContactPhone || !tShirtSize) {
      return NextResponse.json(
        { error: 'Semua field wajib harus diisi' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format email tidak valid' },
        { status: 400 }
      );
    }

    // Check if event exists and is active
    const eventResult = await sql`
      SELECT id, title, registration_deadline, max_participants, registration_fee,
             (SELECT COUNT(*) FROM event_registrations WHERE event_id = events.id AND status != 'cancelled') as registered_count
      FROM events 
      WHERE id = ${eventId} AND status = 'active'
    `;

    if (eventResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Event tidak ditemukan atau tidak aktif' },
        { status: 404 }
      );
    }

    const event = eventResult.rows[0];
    
    // Check if registration is still open
    if (new Date() > new Date(event.registration_deadline)) {
      return NextResponse.json(
        { error: 'Pendaftaran sudah ditutup' },
        { status: 400 }
      );
    }

    // Check if event is full
    if (event.max_participants && event.registered_count >= event.max_participants) {
      return NextResponse.json(
        { error: 'Event sudah penuh' },
        { status: 400 }
      );
    }

    // Check for duplicate email
    const duplicateCheck = await sql`
      SELECT id FROM event_registrations 
      WHERE event_id = ${eventId} AND email = ${email} AND status != 'cancelled'
    `;

    if (duplicateCheck.rows.length > 0) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar untuk event ini' },
        { status: 400 }
      );
    }

    let paymentProofPath = null;

    // Handle payment proof upload if provided
    if (paymentProof && paymentProof.size > 0) {
      const bytes = await paymentProof.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Validate file size (5MB max)
      if (buffer.length > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'Ukuran file maksimal 5MB' },
          { status: 400 }
        );
      }

      // Validate file type
      if (!paymentProof.type.startsWith('image/')) {
        return NextResponse.json(
          { error: 'File harus berupa gambar' },
          { status: 400 }
        );
      }

      // Create uploads directory if it doesn't exist
      const uploadsDir = join(process.cwd(), 'public/uploads/payment-proofs');
      try {
        await mkdir(uploadsDir, { recursive: true });
      } catch (error) {
        // Directory might already exist
      }

      // Generate unique filename
      const timestamp = Date.now();
      const sanitizedEventId = eventId.replace(/[^a-zA-Z0-9]/g, '');
      const sanitizedEmail = email.replace(/[^a-zA-Z0-9@.]/g, '').split('@')[0];
      const extension = paymentProof.name.split('.').pop() || 'jpg';
      const filename = `payment_${sanitizedEventId}_${sanitizedEmail}_${timestamp}.${extension}`;
      
      paymentProofPath = `/uploads/payment-proofs/${filename}`;
      const fullPath = join(uploadsDir, filename);

      await writeFile(fullPath, buffer);
    }

    // Generate registration ID
    const registrationId = `REG${eventId}${Date.now().toString().slice(-6)}`;

    // Insert registration
    const insertResult = await sql`
      INSERT INTO event_registrations (
        event_id, registration_id, full_name, email, phone, birth_date, gender,
        emergency_contact_name, emergency_contact_phone, t_shirt_size, 
        special_needs, payment_proof_url, status, registered_at
      ) VALUES (
        ${eventId}, ${registrationId}, ${fullName}, ${email}, ${phone}, ${birthDate}, ${gender},
        ${emergencyContactName}, ${emergencyContactPhone}, ${tShirtSize},
        ${specialNeeds || ''}, ${paymentProofPath || ''}, 
        ${event.registration_fee > 0 ? 'pending_payment' : 'confirmed'}, 
        NOW()
      ) RETURNING id
    `;

    const newRegistration = insertResult.rows[0];

    return NextResponse.json({
      success: true,
      registration_id: registrationId,
      message: event.registration_fee > 0 
        ? 'Pendaftaran berhasil! Menunggu verifikasi pembayaran dari admin.'
        : 'Pendaftaran berhasil dikonfirmasi!'
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memproses pendaftaran' },
      { status: 500 }
    );
  }
}