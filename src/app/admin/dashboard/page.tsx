'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

interface Statistics {
  total_events: number;
  total_activities: number;
  total_users: number;
  total_registrations: number;
  total_attendance: number;
}

interface RecentEvent {
  id: number;
  title: string;
  event_date: string;
  created_at: string;
}

interface RecentRegistration {
  user_name: string;
  event_title: string;
  registration_date: string;
}

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);
  const [recentRegistrations, setRecentRegistrations] = useState<RecentRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/admin/login');
      return;
    }

    // Redirect non-admin users
    if (session.user.role !== 'admin') {
      router.push('/dashboard');
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
        setRecentEvents(data.recent_events || []);
        setRecentRegistrations(data.recent_registrations || []);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!session || session.user.role !== 'admin') {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard Admin</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Selamat datang kembali, Admin {session.user.name}!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Event</CardTitle>
            <CardDescription className="text-sm">Event aktif</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics?.total_events || 0}</div>
            <p className="text-xs text-muted-foreground">
              Event yang sedang berjalan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Peserta</CardTitle>
            <CardDescription className="text-sm">Pendaftar event</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics?.total_registrations || 0}</div>
            <p className="text-xs text-muted-foreground">
              Terdaftar aktif
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Aktivitas Rutin</CardTitle>
            <CardDescription className="text-sm">Kegiatan komunitas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics?.total_activities || 0}</div>
            <p className="text-xs text-muted-foreground">
              Aktivitas aktif
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total User</CardTitle>
            <CardDescription className="text-sm">Member komunitas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics?.total_users || 0}</div>
            <p className="text-xs text-muted-foreground">
              User terdaftar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Kehadiran</CardTitle>
            <CardDescription className="text-sm">Absensi tercatat</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics?.total_attendance || 0}</div>
            <p className="text-xs text-muted-foreground">
              Kehadiran aktif
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg sm:text-xl flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Kelola Event
            </CardTitle>
            <CardDescription className="text-sm">
              Buat dan kelola event lari
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4">
              Buat event baru, edit event yang ada, dan kelola pendaftaran peserta.
            </p>
            <Link href="/admin/events">
              <Button className="w-full">
                Kelola Event
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg sm:text-xl flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Pendaftaran Peserta
            </CardTitle>
            <CardDescription className="text-sm">
              Kelola pendaftaran public
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4">
              Verifikasi pembayaran dan kelola data peserta yang mendaftar.
            </p>
            <Link href="/admin/registrations">
              <Button className="w-full">
                Kelola Pendaftaran
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg sm:text-xl flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Aktivitas Rutin
            </CardTitle>
            <CardDescription className="text-sm">
              Kelola kegiatan komunitas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4">
              Buat jadwal latihan rutin dan kegiatan komunitas lainnya.
            </p>
            <Link href="/admin/activities">
              <Button className="w-full">
                Kelola Aktivitas
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
              Kelola sistem absensi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4">
              Pantau kehadiran peserta event dan aktivitas rutin.
            </p>
            <Link href="/admin/attendance">
              <Button className="w-full">
                Kelola Absensi
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg sm:text-xl">Event Terbaru</CardTitle>
            <CardDescription className="text-sm">
              Event yang baru saja dibuat
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Belum ada event yang dibuat.
              </p>
            ) : (
              <div className="space-y-3">
                {recentEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(new Date(event.event_date))}
                      </p>
                    </div>
                    <Link href={`/admin/events/${event.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
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
            <CardTitle className="text-lg sm:text-xl">Pendaftaran Terbaru</CardTitle>
            <CardDescription className="text-sm">
              Peserta yang baru mendaftar
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentRegistrations.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Belum ada pendaftaran baru.
              </p>
            ) : (
              <div className="space-y-3">
                {recentRegistrations.map((registration, index) => (
                  <div key={index} className="border-l-2 border-primary/20 pl-3">
                    <p className="font-medium text-sm">{registration.user_name}</p>
                    <p className="text-xs text-muted-foreground">{registration.event_title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(new Date(registration.registration_date))}
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