'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatDate } from '@/lib/utils';

interface Attendance {
  id: number;
  activity_id?: number;
  event_id?: number;
  attendance_date: string;
  status: string;
  notes?: string;
  title: string;
  type: 'activity' | 'event';
}

interface Activity {
  id: number;
  title: string;
  activity_date: string;
  location: string;
  activity_type: string;
  status: string;
}

export default function AttendancePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [myAttendance, setMyAttendance] = useState<Attendance[]>([]);
  const [availableActivities, setAvailableActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [attendingActivity, setAttendingActivity] = useState<number | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (session.user.role === 'admin') {
      router.push('/admin/attendance');
      return;
    }

    fetchMyAttendance();
    fetchAvailableActivities();
  }, [session, status, router]);

  const fetchMyAttendance = async () => {
    try {
      const response = await fetch('/api/attendance');
      if (response.ok) {
        const data = await response.json();
        setMyAttendance(data.attendance);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableActivities = async () => {
    try {
      const response = await fetch('/api/activities?status=active');
      if (response.ok) {
        const data = await response.json();
        // Filter activities that are happening today or in the near future
        const today = new Date();
        const upcoming = data.activities.filter((activity: Activity) => {
          const activityDate = new Date(activity.activity_date);
          const timeDiff = activityDate.getTime() - today.getTime();
          // Show activities from 24 hours ago to 24 hours from now
          return timeDiff >= -24 * 60 * 60 * 1000 && timeDiff <= 24 * 60 * 60 * 1000;
        });
        setAvailableActivities(upcoming);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const handleMarkAttendance = async (activityId: number) => {
    setAttendingActivity(activityId);

    try {
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activity_id: activityId,
          status: 'present',
        }),
      });

      if (response.ok) {
        fetchMyAttendance(); // Refresh attendance list
        fetchAvailableActivities(); // Refresh available activities
      } else {
        const data = await response.json();
        alert(data.error || 'Gagal mencatat absensi');
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert('Terjadi kesalahan saat mencatat absensi');
    } finally {
      setAttendingActivity(null);
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
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800'}`}>
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

  const isAlreadyAttended = (activityId: number) => {
    return myAttendance.some(att => att.activity_id === activityId);
  };

  const filteredAttendance = myAttendance.filter(att =>
    att.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!session || session.user.role === 'admin') {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Absensi Saya</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Kelola kehadiran aktivitas dan event yang Anda ikuti
        </p>
      </div>

      {/* Quick Attendance */}
      {availableActivities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Absensi Hari Ini</CardTitle>
            <CardDescription>
              Aktivitas yang sedang berlangsung atau akan segera dimulai
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {availableActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(new Date(activity.activity_date))} • {activity.location}
                        </p>
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {activity.activity_type === 'routine' ? 'Rutin' : 'Khusus'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {isAlreadyAttended(activity.id) ? (
                      <span className="text-green-600 text-sm font-medium">
                        ✓ Sudah Absen
                      </span>
                    ) : (
                      <Button
                        onClick={() => handleMarkAttendance(activity.id)}
                        disabled={attendingActivity === activity.id}
                        size="sm"
                      >
                        {attendingActivity === activity.id ? 'Mencatat...' : 'Hadir'}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attendance Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {myAttendance.filter(att => att.status === 'present').length}
              </div>
              <div className="text-sm text-muted-foreground">Total Hadir</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {myAttendance.filter(att => att.status === 'late').length}
              </div>
              <div className="text-sm text-muted-foreground">Terlambat</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {myAttendance.filter(att => att.type === 'activity').length}
              </div>
              <div className="text-sm text-muted-foreground">Aktivitas</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {myAttendance.filter(att => att.type === 'event').length}
              </div>
              <div className="text-sm text-muted-foreground">Event</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance History */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-lg">Riwayat Kehadiran</CardTitle>
              <CardDescription>
                Total {myAttendance.length} kehadiran tercatat
              </CardDescription>
            </div>
            <div className="w-full sm:w-64">
              <Input
                placeholder="Cari aktivitas atau event..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAttendance.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p>Belum ada riwayat kehadiran</p>
              <p className="text-sm mt-1">Mulai ikuti aktivitas komunitas untuk mencatat kehadiran</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAttendance.map((att) => (
                <div key={att.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="font-medium">{att.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(new Date(att.attendance_date))}
                        </p>
                        {att.notes && (
                          <p className="text-sm text-muted-foreground mt-1">{att.notes}</p>
                        )}
                      </div>
                      {getTypeBadge(att.type)}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {getStatusBadge(att.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}