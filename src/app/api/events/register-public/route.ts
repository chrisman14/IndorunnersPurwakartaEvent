import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const eventId = formData.get('event_id') as string;
    const fullName = formData.get('full_name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const emergencyContact = formData.get('emergency_contact_name') as string;
    const medicalInfo = formData.get('special_needs') as string;
    const paymentProof = formData.get('payment_proof') as File;

    // Validate required fields
    if (!eventId || !fullName || !email || !phone) {
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
    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        status: 'active'
      },
      include: {
        _count: {
          select: {
            registrations: {
              where: {
                status: {
                  not: 'cancelled'
                }
              }
            }
          }
        }
      }
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event tidak ditemukan atau tidak aktif' },
        { status: 404 }
      );
    }

    // Check if event is full
    if (event.maxParticipants && event._count.registrations >= event.maxParticipants) {
      return NextResponse.json(
        { error: 'Event sudah penuh' },
        { status: 400 }
      );
    }

    // Check for duplicate email
    const existingRegistration = await prisma.registration.findFirst({
      where: {
        eventId: eventId,
        email: email,
        status: {
          not: 'cancelled'
        }
      }
    });

    if (existingRegistration) {
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

    // Create registration
    const registration = await prisma.registration.create({
      data: {
        eventId,
        fullName,
        email,
        phone,
        emergencyContact,
        medicalInfo: medicalInfo || null,
        paymentProof: paymentProofPath,
        status: event.registrationFee && Number(event.registrationFee) > 0 ? 'pending' : 'confirmed'
      }
    });

    return NextResponse.json({
      success: true,
      registration_id: registration.id,
      message: event.registrationFee && Number(event.registrationFee) > 0
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