'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreateEventPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    registration_deadline: '',
    location: '',
    max_participants: '',
    registration_fee: '',
    category: '',
    distance: '',
    image_url: '',
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
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
          registration_fee: parseFloat(formData.registration_fee) || 0,
        }),
      });

      if (response.ok) {
        router.push('/admin/events');
      } else {
        const data = await response.json();
        setError(data.error || 'Terjadi kesalahan saat membuat event');
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
          <h1 className="text-2xl sm:text-3xl font-bold">Buat Event Baru</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Isi form di bawah untuk membuat event lari baru
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Event</CardTitle>
          <CardDescription>
            Lengkapi data event yang akan dibuat
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
                    Nama Event *
                  </label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Contoh: Purwakarta Marathon 2024"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">
                    Kategori
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Pilih Kategori</option>
                    <option value="Fun Run">Fun Run</option>
                    <option value="5K">5K</option>
                    <option value="10K">10K</option>
                    <option value="Half Marathon">Half Marathon</option>
                    <option value="Marathon">Marathon</option>
                    <option value="Trail Run">Trail Run</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="distance" className="text-sm font-medium">
                    Jarak
                  </label>
                  <Input
                    id="distance"
                    name="distance"
                    type="text"
                    value={formData.distance}
                    onChange={handleChange}
                    placeholder="Contoh: 5K, 10K, 21K"
                    className="w-full"
                  />
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
                    placeholder="Lokasi event"
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      placeholder="Opsional"
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="registration_fee" className="text-sm font-medium">
                      Biaya Pendaftaran (Rp)
                    </label>
                    <Input
                      id="registration_fee"
                      name="registration_fee"
                      type="number"
                      value={formData.registration_fee}
                      onChange={handleChange}
                      min="0"
                      step="1000"
                      placeholder="0 (gratis)"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="event_date" className="text-sm font-medium">
                    Tanggal & Waktu Event *
                  </label>
                  <Input
                    id="event_date"
                    name="event_date"
                    type="datetime-local"
                    value={formData.event_date}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="registration_deadline" className="text-sm font-medium">
                    Batas Pendaftaran *
                  </label>
                  <Input
                    id="registration_deadline"
                    name="registration_deadline"
                    type="datetime-local"
                    value={formData.registration_deadline}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="image_url" className="text-sm font-medium">
                    URL Gambar
                  </label>
                  <Input
                    id="image_url"
                    name="image_url"
                    type="url"
                    value={formData.image_url}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Deskripsi Event
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Deskripsi detail tentang event..."
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? 'Membuat Event...' : 'Buat Event'}
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