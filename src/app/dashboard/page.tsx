'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

interface Statistics {
  my_registrations: number;
  my_attendance: number;
  upcoming_events: number;
  upcoming_activities: number;
}

interface RecentRegistration {
  id: number;
  title: string;
  event_date: string;
  registration_date: string;
}

interface RecentAttendance {
  title: string;
  attendance_date: string;
  status: string;
  type: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [recentRegistrations, setRecentRegistrations] = useState<RecentRegistration[]>([]);
  const [recentAttendance, setRecentAttendance] = useState<RecentAttendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    // Redirect admins to admin dashboard
    if (session.user.role === 'admin') {
      router.push('/admin/dashboard');
      return;
    }

    fetchStatistics();
  }, [session, status, router]);

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/statistics');
      if (response.ok) {
        const data = await response.json();
        setStatistics(data.statistics);
        setRecentRegistrations(data.recent_registrations || []);
        setRecentAttendance(data.recent_attendance || []);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      present: 'bg-green-100 text-green-800',
      absent: 'bg-red-100 text-red-800',
      late: 'bg-yellow-100 text-yellow-800',
    };
    
    const labels = {
      present: 'Hadir',
      absent: 'Tidak Hadir',
      late: 'Terlambat',
    };

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
        type === 'activity' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
      }`}>
        {type === 'activity' ? 'Aktivitas' : 'Event'}
      </span>
    );
  };

  if (status === 'loading' || loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!session || session.user.role === 'admin') {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Selamat datang kembali, {session.user.name}!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Event Terdaftar</CardTitle>
            <CardDescription className="text-sm">Event yang sudah Anda daftarkan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics?.my_registrations || 0}</div>
            <p className="text-xs text-muted-foreground">
              Event terdaftar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Kehadiran</CardTitle>
            <CardDescription className="text-sm">Aktivitas yang diikuti</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics?.my_attendance || 0}</div>
            <p className="text-xs text-muted-foreground">
              Kehadiran tercatat
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Event Mendatang</CardTitle>
            <CardDescription className="text-sm">Event yang bisa diikuti</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics?.upcoming_events || 0}</div>
            <p className="text-xs text-muted-foreground">
              Event tersedia
            </p>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Aktivitas Mendatang</CardTitle>
            <CardDescription className="text-sm">Aktivitas yang bisa diikuti</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics?.upcoming_activities || 0}</div>
            <p className="text-xs text-muted-foreground">
              Aktivitas tersedia
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg sm:text-xl flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Lihat Event
            </CardTitle>
            <CardDescription className="text-sm">
              Temukan event lari yang tersedia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4">
              Jelajahi event lari yang bisa Anda ikuti dan daftarkan diri Anda.
            </p>
            <Link href="/events">
              <Button className="w-full">
                Jelajahi Event
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg sm:text-xl flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Absensi
            </CardTitle>
            <CardDescription className="text-sm">
              Kelola kehadiran aktivitas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4">
              Catat kehadiran Anda dalam aktivitas dan event yang diikuti.
            </p>
            <Link href="/attendance">
              <Button className="w-full">
                Kelola Absensi
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg sm:text-xl flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profil
            </CardTitle>
            <CardDescription className="text-sm">
              Update informasi akun
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4">
              Perbarui informasi profil dan kontak darurat Anda.
            </p>
            <Link href="/profile">
              <Button className="w-full" variant="outline">
                Edit Profil
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg sm:text-xl">Event Terdaftar</CardTitle>
            <CardDescription className="text-sm">
              Event yang sudah Anda daftarkan
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentRegistrations.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Belum ada event yang terdaftar.
              </p>
            ) : (
              <div className="space-y-3">
                {recentRegistrations.map((registration) => (
                  <div key={registration.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{registration.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(new Date(registration.event_date))}
                      </p>
                    </div>
                    <Link href={`/events/${registration.id}`}>
                      <Button variant="outline" size="sm">
                        Detail
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg sm:text-xl">Kehadiran Terbaru</CardTitle>
            <CardDescription className="text-sm">
              Aktivitas yang baru diikuti
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentAttendance.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Belum ada aktivitas yang diikuti.
              </p>
            ) : (
              <div className="space-y-3">
                {recentAttendance.map((attendance, index) => (
                  <div key={index} className="border-l-2 border-primary/20 pl-3">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{attendance.title}</p>
                      <div className="flex space-x-2">
                        {getTypeBadge(attendance.type)}
                        {getStatusBadge(attendance.status)}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(new Date(attendance.attendance_date))}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}