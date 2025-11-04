'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatDate } from '@/lib/utils';

interface Activity {
  id: number;
  title: string;
  activity_date: string;
  location: string;
  activity_type: string;
}

interface Attendance {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  attendance_date: string;
  status: string;
  notes?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

export default function ActivityAttendancePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const activityId = params.id as string;
  
  const [activity, setActivity] = useState<Activity | null>(null);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState('present');
  const [notes, setNotes] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/admin/login');
      return;
    }

    if (session.user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    fetchActivity();
    fetchAttendance();
    fetchUsers();
  }, [session, status, router, activityId]);

  const fetchActivity = async () => {
    try {
      const response = await fetch(`/api/activities/${activityId}`);
      if (response.ok) {
        const data = await response.json();
        setActivity(data.activity);
      }
    } catch (error) {
      console.error('Error fetching activity:', error);
    }
  };

  const fetchAttendance = async () => {
    try {
      const response = await fetch(`/api/attendance?activity_id=${activityId}`);
      if (response.ok) {
        const data = await response.json();
        setAttendance(data.attendance);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users.filter((user: User) => user.id !== parseInt(session?.user.id || '0')));
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAddAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);

    try {
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activity_id: parseInt(activityId),
          user_id: parseInt(selectedUser),
          status: attendanceStatus,
          notes: notes || null,
        }),
      });

      if (response.ok) {
        setSelectedUser('');
        setAttendanceStatus('present');
        setNotes('');
        fetchAttendance(); // Refresh list
      } else {
        const data = await response.json();
        alert(data.error || 'Gagal menambah absensi');
      }
    } catch (error) {
      console.error('Error adding attendance:', error);
      alert('Terjadi kesalahan saat menambah absensi');
    } finally {
      setIsAdding(false);
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

  const filteredAttendance = attendance.filter(att =>
    att.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    att.user_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableUsers = users.filter(user => 
    !attendance.some(att => att.user_id === user.id)
  );

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!session || session.user.role !== 'admin' || !activity) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Kelola Absensi</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            {activity.title}
          </p>
        </div>
      </div>

      {/* Activity Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{activity.title}</CardTitle>
          <CardDescription>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize mr-2">
              {activity.activity_type === 'routine' ? 'Rutin' : 'Khusus'}
            </span>
            {formatDate(new Date(activity.activity_date))} • {activity.location}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {attendance.filter(att => att.status === 'present').length}
              </div>
              <div className="text-sm text-muted-foreground">Hadir</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {attendance.filter(att => att.status === 'late').length}
              </div>
              <div className="text-sm text-muted-foreground">Terlambat</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {attendance.filter(att => att.status === 'absent').length}
              </div>
              <div className="text-sm text-muted-foreground">Tidak Hadir</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {attendance.length}
              </div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Attendance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tambah Absensi Manual</CardTitle>
          <CardDescription>
            Catat kehadiran peserta yang belum melakukan absensi mandiri
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddAttendance} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label htmlFor="user" className="text-sm font-medium">
                  Pilih Peserta
                </label>
                <select
                  id="user"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Pilih peserta...</option>
                  {availableUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">
                  Status Kehadiran
                </label>
                <select
                  id="status"
                  value={attendanceStatus}
                  onChange={(e) => setAttendanceStatus(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="present">Hadir</option>
                  <option value="late">Terlambat</option>
                  <option value="absent">Tidak Hadir</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="notes" className="text-sm font-medium">
                  Catatan
                </label>
                <Input
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Catatan opsional..."
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium invisible">Action</label>
                <Button 
                  type="submit" 
                  disabled={isAdding || !selectedUser}
                  className="w-full"
                >
                  {isAdding ? 'Menambah...' : 'Tambah'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Attendance List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-lg">Daftar Absensi</CardTitle>
              <CardDescription>
                Total {attendance.length} peserta tercatat
              </CardDescription>
            </div>
            <div className="w-full sm:w-64">
              <Input
                placeholder="Cari peserta..."
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
              <p>Belum ada absensi tercatat</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAttendance.map((att) => (
                <div key={att.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="font-medium">{att.user_name}</p>
                        <p className="text-sm text-muted-foreground">{att.user_email}</p>
                      </div>
                    </div>
                    {att.notes && (
                      <p className="text-sm text-muted-foreground mt-1">{att.notes}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div>{getStatusBadge(att.status)}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(new Date(att.attendance_date))}
                      </p>
                    </div>
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