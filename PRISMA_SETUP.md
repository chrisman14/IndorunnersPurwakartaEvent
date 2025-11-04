# Prisma Setup Guide

## 🗄️ Database Configuration

Project ini sekarang menggunakan **Prisma** dengan **PostgreSQL** dari Prisma Cloud.

### 📋 Environment Variables

Pastikan `.env.local` memiliki konfigurasi:

```bash
# Prisma Database URLs
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_API_KEY"
POSTGRES_URL="postgres://username:password@host:port/database?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 🚀 Scripts Available

```bash
# Generate Prisma client dan push schema
npm run db:setup

# Buka Prisma Studio untuk manage database
npm run db:studio

# Create admin user (development)
npm run db:seed
```

### 📊 Database Models

1. **User** - Admin dan user sistem
2. **Event** - Event lari yang dibuat admin
3. **Registration** - Pendaftaran peserta untuk event
4. **Activity** - Aktivitas rutin dan re-registrasi
5. **Attendance** - Kehadiran peserta di aktivitas

### 🔄 Development Workflow

1. Ubah schema di `prisma/schema.prisma`
2. Jalankan `npx prisma generate` untuk update client
3. Jalankan `npx prisma db push` untuk sync database
4. Gunakan `npx prisma studio` untuk manage data

### 🌐 Deployment

Untuk Vercel, set environment variables:
- `DATABASE_URL`
- `POSTGRES_URL` 
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

Database akan otomatis tersync saat deployment.