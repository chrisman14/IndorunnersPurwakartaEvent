# Indorunners Purwakarta - Event Management System

Sistem manajemen event lari untuk komunitas Indorunners Purwakarta yang dibangun dengan Next.js, Vercel Postgres, dan Tailwind CSS.

## 🎨 Desain Terbaru

Aplikasi ini menggunakan **palet warna khusus** yang disesuaikan untuk Indorunners Purwakarta:
- **Primary (Blue)**: #4A70A9 - Biru profesional untuk elemen utama
- **Secondary (Cream)**: #EFECE3 - Cream lembut untuk background dan accent  
- **Neutral**: #000000 - Hitam untuk text dan kontras
- **Accent**: #8FABD4 - Biru muda untuk highlight dan button hover

## 🔄 Alur Sistem Terbaru

**Sistem telah diperbarui dengan alur yang lebih sederhana:**

### 👨‍💼 **Admin Only Login**
- Hanya admin yang bisa melakukan login
- Admin mengelola semua event dan pendaftaran
- Dashboard admin untuk monitoring dan verifikasi

### 👥 **Public Registration**  
- Peserta **TIDAK PERLU** membuat akun atau login
- Peserta langsung daftar event melalui form publik
- Upload bukti pembayaran langsung saat pendaftaran
- Admin memverifikasi pembayaran dan konfirmasi pendaftaran

### 📋 **Flow Pendaftaran Baru:**
1. **Peserta** → Lihat event di halaman publik
2. **Peserta** → Daftar langsung dengan form lengkap  
3. **Peserta** → Upload bukti pembayaran
4. **Admin** → Verifikasi pembayaran di dashboard
5. **Admin** → Konfirmasi pendaftaran peserta
6. **Peserta** → Mendapat konfirmasi (email/WhatsApp)

## 🚀 Fitur Lengkap

### 👨‍💼 Admin Features
- ✅ **Dashboard Admin** - Statistik dan overview pendaftaran
- ✅ **Manajemen Event** - Buat, edit, hapus event lari
- ✅ **Kelola Pendaftaran** - Verifikasi pembayaran dan konfirmasi peserta
- ✅ **Upload Management** - Kelola bukti pembayaran dari peserta
- ✅ **Status Tracking** - Update status pendaftaran (pending → verified → confirmed)
- ✅ **Manajemen Aktivitas** - Kelola kegiatan rutin komunitas 
- ✅ **Sistem Absensi** - Buat dan kelola absensi untuk event dan aktivitas

### 👥 Public Features (Tanpa Login)
- ✅ **Browse Events** - Lihat semua event yang tersedia secara publik
- ✅ **Detail Event** - Informasi lengkap event tanpa login
- ✅ **Form Pendaftaran Publik** - Daftar event langsung dengan data lengkap
- ✅ **Upload Bukti Bayar** - Upload proof of payment saat pendaftaran
- ✅ **Responsive Design** - Optimal di mobile dan desktop

### 🔐 Simplified Authentication
- ✅ **Admin-Only Login** - Hanya admin yang memerlukan autentikasi
- ✅ **Public Access** - Semua halaman event dapat diakses tanpa login
- ✅ **Secure Admin Area** - Area admin tetap protected dengan NextAuth.js

### 📱 Mobile & Responsive
- ✅ **Fully Responsive** - Optimal di semua ukuran layar (mobile, tablet, desktop)
- ✅ **Mobile-First Design** - Didesain khusus untuk pengalaman mobile
- ✅ **Touch-Friendly** - Interface yang mudah digunakan di touch device
- ✅ **Hamburger Navigation** - Menu mobile yang responsive
- ✅ **Adaptive Layouts** - Layout yang menyesuaikan dengan ukuran layar
- ✅ **Cross-Platform** - Kompatibel dengan iOS, Android, dan desktop

### 🔐 Authentication & Security
- ✅ **Role-Based Access** - Admin dan User dengan akses yang berbeda
- ✅ **NextAuth.js Integration** - Sistem autentikasi yang aman
- ✅ **Protected Routes** - Middleware untuk melindungi halaman
- ✅ **Password Hashing** - Bcrypt untuk keamanan password
- ✅ **Session Management** - JWT-based session handling

### 📊 Dashboard & Analytics
- ✅ **Real-time Statistics** - Data statistik yang update secara real-time
- ✅ **Admin Analytics** - Total event, peserta, aktivitas, dan user
- ✅ **User Analytics** - Statistik personal user dan kehadiran
- ✅ **Quick Actions** - Shortcut untuk aksi cepat di dashboard

### 🎯 Improvements & Features
- ✅ **Advanced Search** - Pencarian event berdasarkan nama, lokasi, kategori
- ✅ **Status Management** - Kelola status event (active, completed, cancelled)
- ✅ **Capacity Management** - Batas maksimal peserta dan notifikasi penuh
- ✅ **Registration Deadline** - Sistem batas waktu pendaftaran
- ✅ **Payment Integration Ready** - Struktur database siap untuk integrasi payment
- ✅ **Error Handling** - Comprehensive error handling dan user feedback
- ✅ **Form Validation** - Validasi form di client dan server side
- ✅ **Loading States** - Loading indicators untuk UX yang baik

## 🛠 Teknologi

- **Next.js 16** - Framework React dengan App Router dan Turbopack
- **Vercel Postgres** - Database PostgreSQL serverless 
- **Tailwind CSS v4** - Utility-first CSS framework
- **TypeScript** - Type safety dan developer experience
- **NextAuth.js** - Authentication dan session management
- **bcryptjs** - Password hashing yang aman
- **date-fns** - Utility untuk manipulasi tanggal
- **clsx & tailwind-merge** - Conditional styling

## 📁 Struktur Project

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── events/       # Event management APIs
│   │   ├── activities/   # Activity management APIs
│   │   ├── attendance/   # Attendance APIs
│   │   ├── statistics/   # Statistics APIs
│   │   └── admin/        # Admin-specific APIs
│   ├── admin/            # Admin pages
│   │   ├── dashboard/    # Admin dashboard
│   │   ├── events/       # Event management
│   │   ├── activities/   # Activity management
│   │   ├── login/        # Admin login
│   │   └── setup/        # Admin setup
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # User dashboard
│   ├── events/           # Event pages for users
│   └── attendance/       # Attendance pages
├── components/           # Reusable React components
│   └── ui/              # UI components (Button, Card, Input, etc)
├── lib/                 # Utility functions
│   ├── auth.ts          # NextAuth configuration
│   ├── db.ts            # Database utilities
│   └── utils.ts         # General utilities
├── types/               # TypeScript type definitions
└── middleware.ts        # Authentication middleware
```

## 📊 Database Schema

### Users Table
- Menyimpan data user (admin dan regular user)
- Includes profile lengkap dan emergency contact
- Role-based access control

### Events Table  
- Data event lari dengan informasi lengkap
- Registration settings dan capacity management
- Status tracking (active, completed, cancelled)

### Event_Registrations Table
- Pendaftaran user untuk event
- Payment status tracking
- Additional info (bib number, shirt size, special needs)

### Activities Table
- Kegiatan rutin komunitas
- Flexible activity types dan scheduling

### Attendance Table
- Sistem absensi untuk activities dan events
- Status tracking (present, absent, late)
- Notes dan additional information

## 🎯 User Guide

### 🔧 Setup & Installation

1. **Clone atau Download Project**
```bash
git clone <repository-url>
cd indorunners-purwakarta
```

2. **Install Dependencies**
```bash
npm install
```

3. **Setup Environment Variables**
```bash
cp .env.example .env.local
```
Edit `.env.local` dengan database credentials Anda.

4. **Initialize Database**
```bash
npm run db:setup
```

5. **Run Development Server**
```bash
npm run dev
```

### 👤 Getting Started

#### 1. **Setup Admin Pertama**
- Kunjungi `/admin/setup` atau `/admin/login`
- Login sebagai admin untuk mengakses dashboard
- Admin dapat mengelola semua event dan pendaftaran

#### 2. **Buat Event untuk Pendaftaran Publik**
- Di dashboard admin, klik "Kelola Event"
- Klik "Buat Event Baru"
- Isi detail event: nama, tanggal, lokasi, biaya, dll
- Set batas waktu pendaftaran dan kapasitas peserta
- Publish event - sekarang dapat diakses publik

#### 3. **Kelola Pendaftaran Peserta**
- Peserta mendaftar langsung melalui `/events/[id]/register`
- Admin memantau pendaftaran di `/admin/registrations`
- Verifikasi bukti pembayaran dan konfirmasi peserta
- Update status: pending → payment_verified → confirmed

#### 4. **Monitor dan Kelola**
- Dashboard admin menampilkan statistik real-time
- Kelola status pendaftaran dan pembayaran
- Export data peserta untuk event management

### 👥 Pengalaman Peserta (Tanpa Login)

#### Untuk Peserta Event:
1. **Browse Event**
   - Kunjungi halaman utama atau `/events`
   - Lihat semua event yang tersedia secara publik
   - Tidak perlu login atau buat akun

2. **Daftar Event Langsung**
   - Klik event yang diminati
   - Isi form pendaftaran lengkap:
     - Data pribadi (nama, email, telepon, tanggal lahir)
     - Kontak darurat 
     - Ukuran kaos
     - Kebutuhan khusus (jika ada)
   - Upload bukti pembayaran
   - Submit pendaftaran

3. **Konfirmasi Pendaftaran**
   - Pendaftaran masuk ke sistem dengan status "pending"
   - Admin akan verifikasi pembayaran
   - Peserta akan dihubungi untuk konfirmasi final

### 🔐 Admin Workflow

#### Untuk Admin:
1. **Login Admin**
   - Akses `/admin/login`
   - Login dengan kredential admin

2. **Kelola Event**
   - Buat event baru
   - Update informasi event
   - Set kapasitas dan deadline

3. **Kelola Pendaftaran**
   - Monitor pendaftaran baru di dashboard
   - Verifikasi bukti pembayaran
   - Update status pendaftaran:
     - `pending_payment` → `payment_verified` → `confirmed`
   - Batalkan pendaftaran jika diperlukan

4. **Export & Reporting**
   - Export data peserta untuk event management
   - Monitor statistik pendaftaran
   - Generate laporan kehadiran

### 🔐 Security Features

- **Role-based access control** - Admin dan user memiliki akses berbeda
- **Protected routes** - Middleware untuk authentication
- **Secure admin setup** - Setup key untuk membuat admin pertama  
- **Password encryption** - Bcrypt untuk hash password
- **Session management** - JWT-based dengan NextAuth.js

### 📱 Mobile Experience

- **Responsive design** - Optimal di semua device
- **Touch-friendly UI** - Interface mudah digunakan di mobile
- **Progressive Web App ready** - Dapat di-install sebagai PWA
- **Offline-first approach** - Beberapa fitur dapat diakses offline

### 🚀 Production Deployment

1. **Vercel Deployment**
```bash
npm run build
vercel --prod
```

2. **Environment Setup**
- Set semua environment variables di Vercel dashboard
- Ensure database connection strings benar
- Test production build

3. **Database Migration**
- Jalankan `npm run db:setup` di production environment
- Verify semua tables terbuat dengan benar

## 📈 Advanced Features

### 📊 Analytics & Reporting
- Real-time dashboard statistics
- Export data pendaftaran dan absensi
- Performance metrics untuk events

### 🔔 Notifications (Ready for Integration)
- Email notifications untuk pendaftaran
- WhatsApp integration untuk reminder
- Push notifications untuk mobile users

### 💳 Payment Integration (Ready)
- Database schema sudah support payment status
- Ready untuk integrasi dengan payment gateway
- Tracking pembayaran peserta

### 🎨 Customization
- Easy theme customization dengan Tailwind CSS
- Configurable branding dan colors
- Flexible event categories dan types

## 🤝 Contributing & Development

### Development Guidelines
- Use TypeScript for all files
- Follow Next.js App Router conventions  
- Use Tailwind CSS for styling
- Implement proper authentication and authorization
- Use server actions for form submissions
- Implement proper error handling and validation

### Code Quality
- ESLint configuration untuk code consistency
- TypeScript strict mode enabled
- Comprehensive error handling
- Mobile-first responsive design

### API Documentation
- RESTful API design
- Comprehensive error responses
- Input validation dan sanitization
- Rate limiting ready for production

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check `.env.local` file exists dan credentials benar
   - Verify Vercel Postgres database running
   - Run `npm run db:setup` untuk initialize tables

2. **Build Errors**
   - Check TypeScript errors dengan `npm run build`
   - Verify all dependencies installed
   - Clear `.next` folder dan rebuild

3. **Authentication Issues**
   - Check `NEXTAUTH_SECRET` dan `NEXTAUTH_URL` di environment
   - Verify middleware configuration
   - Check session provider wrapping

4. **Mobile Responsiveness**
   - Test di berbagai device sizes
   - Check viewport meta tag
   - Verify touch targets minimal 44px

## 📝 License & Support

Project ini menggunakan **MIT License**. 

### Support & Community
- 📧 Email support untuk issues
- 💬 Community discussions
- 🐛 Bug reports via GitHub issues
- 🚀 Feature requests welcome

### Roadmap
- [ ] **Push Notifications** - Real-time notifications
- [ ] **Payment Gateway** - Integrasi pembayaran online  
- [ ] **Social Features** - Leaderboard dan achievements
- [ ] **Mobile App** - React Native companion app
- [ ] **Advanced Analytics** - Detailed reporting dan insights
- [ ] **Multi-language** - Bahasa Indonesia dan English
- [ ] **API Documentation** - Swagger/OpenAPI documentation
- [ ] **Automated Testing** - Unit dan integration tests

---

**Developed with ❤️ for Indorunners Purwakarta Community**

*Bangun komunitas lari yang lebih kuat dengan teknologi modern!* 🏃‍♂️🏃‍♀️
# IndorunnersPurwakartaEvent
