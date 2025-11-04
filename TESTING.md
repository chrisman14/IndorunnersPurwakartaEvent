# 🧪 Testing Guide - Indorunners Purwakarta

## 🎯 End-to-End Testing Scenarios

### Test Scenario 1: Admin Setup dan Event Creation

1. **Setup Admin Pertama**
   ```
   URL: http://localhost:3000/admin/setup
   Setup Key: INDORUNNERS2024
   
   Test Data:
   - Name: Admin Indorunners
   - Email: admin@indorunners.com
   - Password: admin123456
   ```

2. **Login sebagai Admin**
   ```
   URL: http://localhost:3000/admin/login
   Credentials: admin@indorunners.com / admin123456
   Expected: Redirect ke /admin/dashboard
   ```

3. **Buat Event Pertama**
   ```
   URL: /admin/events/create
   
   Test Data:
   - Nama Event: "Purwakarta Fun Run 2024"
   - Kategori: "Fun Run"
   - Jarak: "5K"
   - Tanggal: [Future date]
   - Lokasi: "Alun-alun Purwakarta"
   - Biaya: 50000
   - Max Peserta: 100
   ```

### Test Scenario 2: User Registration dan Event Registration

1. **User Registration**
   ```
   URL: http://localhost:3000/auth/signup
   
   Test Data:
   - Name: "Runner Test"
   - Email: "runner@test.com"
   - Password: "password123"
   - Phone: "081234567890"
   - Gender: "male"
   - Emergency Contact: "Emergency Contact"
   - Emergency Phone: "081987654321"
   ```

2. **User Login**
   ```
   URL: http://localhost:3000/auth/signin
   Credentials: runner@test.com / password123
   Expected: Redirect ke /dashboard
   ```

3. **Browse dan Daftar Event**
   ```
   URL: /events
   - Lihat daftar event
   - Klik detail event yang dibuat admin
   - Klik "Daftar Event"
   - Isi form pendaftaran
   - Submit registration
   ```

### Test Scenario 3: Activity Management

1. **Buat Aktivitas Rutin (Admin)**
   ```
   URL: /admin/activities/create
   
   Test Data:
   - Title: "Latihan Rutin Mingguan"
   - Deskripsi: "Latihan lari setiap minggu"
   - Tanggal: [Next week]
   - Lokasi: "Taman Kota Purwakarta"
   - Tipe: "routine"
   ```

2. **Kelola Absensi (Admin)**
   ```
   URL: /admin/activities/[id]/attendance
   - Buat session absensi
   - Tambahkan peserta
   - Update status kehadiran
   ```

### Test Scenario 4: Mobile Responsiveness

1. **Test Mobile Navigation**
   - Resize browser ke mobile size (375px)
   - Test hamburger menu functionality
   - Check touch targets minimal 44px
   - Verify scroll behavior

2. **Test Mobile Forms**
   - Test form inputs di mobile
   - Check keyboard behavior
   - Test form submission
   - Verify error messages display

3. **Test Mobile Cards dan Lists**
   - Check event cards layout
   - Test tap interactions
   - Verify loading states
   - Check scroll performance

### Test Scenario 5: Statistics dan Analytics

1. **Admin Dashboard Statistics**
   ```
   URL: /admin/dashboard
   - Check total events count
   - Check total users count
   - Check registrations count
   - Verify real-time updates
   ```

2. **User Dashboard Statistics**
   ```
   URL: /dashboard
   - Check registered events
   - Check attendance rate
   - Check activity participation
   ```

## 🔧 Manual Testing Checklist

### Authentication Tests
- [ ] Admin setup dengan setup key yang benar
- [ ] Admin setup dengan setup key yang salah (should fail)
- [ ] Admin login dengan credentials yang benar
- [ ] Admin login dengan credentials yang salah
- [ ] User registration dengan data lengkap
- [ ] User registration dengan data minimal
- [ ] User login dengan credentials yang benar
- [ ] User login dengan credentials yang salah
- [ ] Logout functionality
- [ ] Session persistence
- [ ] Protected routes redirection

### Admin Functionality Tests
- [ ] Admin dashboard loading dan statistics
- [ ] Create event dengan data lengkap
- [ ] Create event dengan data minimal
- [ ] Edit event yang sudah ada
- [ ] Delete event (dengan konfirmasi)
- [ ] View event registrations
- [ ] Create activity baru
- [ ] Edit activity yang ada
- [ ] Delete activity
- [ ] Create attendance session
- [ ] Manage attendance status

### User Functionality Tests
- [ ] User dashboard loading dan statistics
- [ ] Browse events list
- [ ] Search events by keyword
- [ ] Filter events by status
- [ ] View event details
- [ ] Register untuk event
- [ ] Register dengan form lengkap
- [ ] View registration history
- [ ] Attend activities
- [ ] Mark attendance

### UI/UX Tests
- [ ] Loading states di semua forms
- [ ] Error messages yang informatif
- [ ] Success messages yang jelas
- [ ] Form validation (client dan server)
- [ ] Disabled buttons saat loading
- [ ] Responsive navigation
- [ ] Mobile touch interactions
- [ ] Scroll behavior
- [ ] Button hover states
- [ ] Focus states untuk accessibility

### API Tests
- [ ] GET /api/events returns events list
- [ ] POST /api/events creates new event (admin only)
- [ ] PUT /api/events/[id] updates event (admin only)
- [ ] DELETE /api/events/[id] deletes event (admin only)
- [ ] POST /api/events/register registers user for event
- [ ] GET /api/activities returns activities list
- [ ] POST /api/attendance creates attendance record
- [ ] GET /api/statistics returns dashboard statistics
- [ ] Unauthorized access returns 401
- [ ] Invalid data returns proper error messages

### Browser Compatibility Tests
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Performance Tests
- [ ] Page load times < 3 seconds
- [ ] Image optimization
- [ ] Build size optimization
- [ ] Database query performance
- [ ] Mobile performance
- [ ] Memory usage

## 🚀 Production Testing

### Pre-Deployment Checklist
- [ ] `npm run build` succeeds without errors
- [ ] All environment variables properly set
- [ ] Database connection working
- [ ] All API endpoints responding
- [ ] Admin setup works in production
- [ ] Email functionality (if implemented)
- [ ] Error logging configured

### Post-Deployment Tests
- [ ] Application loads correctly
- [ ] Database initialization successful
- [ ] Admin setup process works
- [ ] User registration works
- [ ] Event creation dan registration works
- [ ] Mobile responsiveness
- [ ] All forms submitting correctly
- [ ] Statistics updating properly

## 🐛 Known Issues & Limitations

### Current Limitations
1. **Email Integration** - Belum terintegrasi dengan email service
2. **Payment Gateway** - Database ready, tapi belum ada integration
3. **File Upload** - Belum ada fitur upload gambar event
4. **Push Notifications** - Belum implemented
5. **Offline Support** - Belum ada PWA features

### Workarounds
1. **Email** - Manual notification untuk sementara
2. **Payment** - Manual verification pembayaran
3. **Images** - Gunakan URL external untuk gambar
4. **Notifications** - Check dashboard secara manual
5. **Offline** - Pastikan koneksi internet stabil

## 📊 Performance Benchmarks

### Target Metrics
- **Page Load Time**: < 3 seconds
- **First Contentful Paint**: < 1.5 seconds
- **Build Size**: < 2MB
- **Database Query Time**: < 500ms
- **Mobile Performance Score**: > 90

### Monitoring Tools
- Lighthouse untuk performance audit
- Web Vitals untuk user experience metrics
- Chrome DevTools untuk debugging
- Network tab untuk API response times

---

**Test dengan skenario di atas untuk memastikan aplikasi berfungsi dengan baik! 🧪✅**