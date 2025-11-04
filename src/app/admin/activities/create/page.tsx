'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreateActivityPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    activity_date: '',
    location: '',
    activity_type: 'routine',
    max_participants: '',
  });

  if (status === 'loading') {
    return <div className="text-center">Loading...</div>;
  }

  if (!session || session.user.role !== 'admin') {
    router.push('/admin/login');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
        }),
      });

      if (response.ok) {
        router.push('/admin/activities');
      } else {
        const data = await response.json();
        setError(data.error || 'Terjadi kesalahan saat membuat aktivitas');
      }
    } catch (error) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
          <h1 className="text-2xl sm:text-3xl font-bold">Buat Aktivitas Baru</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Isi form di bawah untuk membuat aktivitas komunitas
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Aktivitas</CardTitle>
          <CardDescription>
            Lengkapi data aktivitas yang akan dibuat
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md border border-red-200">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Nama Aktivitas *
                  </label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Contoh: Latihan Rutin Minggu Pagi"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="activity_type" className="text-sm font-medium">
                    Jenis Aktivitas *
                  </label>
                  <select
                    id="activity_type"
                    name="activity_type"
                    value={formData.activity_type}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="routine">Rutin</option>
                    <option value="special">Khusus</option>
                  </select>
                  <p className="text-xs text-muted-foreground">
                    Rutin: Aktivitas berulang seperti latihan mingguan. Khusus: Kegiatan satu kali.
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="location" className="text-sm font-medium">
                    Lokasi *
                  </label>
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    placeholder="Lokasi aktivitas"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="max_participants" className="text-sm font-medium">
                    Maks. Peserta
                  </label>
                  <Input
                    id="max_participants"
                    name="max_participants"
                    type="number"
                    value={formData.max_participants}
                    onChange={handleChange}
                    min="1"
                    placeholder="Opsional - Batas maksimal peserta"
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Kosongkan jika tidak ada batasan peserta
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="activity_date" className="text-sm font-medium">
                    Tanggal & Waktu Aktivitas *
                  </label>
                  <Input
                    id="activity_date"
                    name="activity_date"
                    type="datetime-local"
                    value={formData.activity_date}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Deskripsi Aktivitas
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={8}
                    placeholder="Deskripsi detail tentang aktivitas..."
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h4 className="font-medium text-blue-900 mb-2">Catatan:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Aktivitas akan otomatis tersedia untuk semua member komunitas</li>
                <li>• Sistem absensi akan diaktifkan untuk melacak kehadiran peserta</li>
                <li>• Anda dapat mengelola absensi melalui dashboard admin</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? 'Membuat Aktivitas...' : 'Buat Aktivitas'}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => router.back()}
                className="w-full sm:w-auto"
              >
                Batal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}