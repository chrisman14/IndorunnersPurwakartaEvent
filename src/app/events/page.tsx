'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatDate, formatCurrency } from '@/lib/utils';

interface Event {
  id: number;
  title: string;
  description?: string;
  event_date: string;
  registration_deadline: string;
  location: string;
  max_participants?: number;
  registration_fee: number;
  category?: string;
  distance?: string;
  status: string;
  registration_count: number;
  image_url?: string;
  _count?: {
    registrations: number;
  };
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events/public');
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const isRegistrationOpen = (event: Event) => {
    return new Date() <= new Date(event.registration_deadline);
  };

  const isEventFull = (event: Event) => {
    const registeredCount = event._count?.registrations || parseInt(event.registration_count?.toString() || '0');
    return event.max_participants ? registeredCount >= event.max_participants : false;
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-neutral-600">Memuat event...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary-600">Event Lari Tersedia</h1>
        <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
          Daftar langsung pada event lari yang tersedia. Tidak perlu membuat akun, 
          cukup isi formulir pendaftaran dan upload bukti pembayaran.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto">
        <Input
          placeholder="Cari event, lokasi, atau kategori..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <Card className="max-w-2xl mx-auto">
          <CardContent className="py-12">
            <div className="text-center text-neutral-600">
              <svg className="w-16 h-16 mx-auto mb-6 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-xl font-semibold mb-2">Belum ada event tersedia</h3>
              <p className="text-sm">
                Event sedang dalam persiapan. Silakan cek kembali nanti atau hubungi admin untuk informasi lebih lanjut.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-all duration-300 group">
              {event.image_url && (
                <div className="w-full h-48 overflow-hidden rounded-t-lg">
                  <img 
                    src={event.image_url} 
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg sm:text-xl text-primary-600 group-hover:text-primary-700 transition-colors">
                      {event.title}
                    </CardTitle>
                    <CardDescription className="text-sm mt-2">
                      {event.category && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700 mr-2">
                          {event.category}
                        </span>
                      )}
                      {event.distance && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-neutral-700">
                          {event.distance}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex items-center text-neutral-600">
                    <svg className="w-4 h-4 mr-3 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium">Tanggal:</span>
                    <span className="ml-2">{formatDate(new Date(event.event_date))}</span>
                  </div>
                  <div className="flex items-center text-neutral-600">
                    <svg className="w-4 h-4 mr-3 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="font-medium">Lokasi:</span>
                    <span className="ml-2">{event.location}</span>
                  </div>
                  <div className="flex items-center text-neutral-600">
                    <svg className="w-4 h-4 mr-3 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <span className="font-medium">Biaya:</span>
                    <span className="ml-2 font-semibold text-primary-600">
                      {event.registration_fee > 0 ? formatCurrency(event.registration_fee) : 'Gratis'}
                    </span>
                  </div>
                  <div className="flex items-center text-neutral-600">
                    <svg className="w-4 h-4 mr-3 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    <span className="font-medium">Peserta:</span>
                    <span className="ml-2">
                      {event._count?.registrations || parseInt(event.registration_count?.toString() || '0')}
                      {event.max_participants && ` / ${event.max_participants}`} orang
                    </span>
                  </div>
                </div>

                {event.description && (
                  <div className="bg-secondary-50 p-3 rounded-lg">
                    <p className="text-sm text-neutral-700" style={{
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 3
                    }}>
                      {event.description}
                    </p>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-xs text-neutral-500">
                      <span className="font-medium">Batas pendaftaran:</span>
                      <br />
                      {formatDate(new Date(event.registration_deadline))}
                    </div>
                    {!isRegistrationOpen(event) && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        Pendaftaran Ditutup
                      </span>
                    )}
                    {isEventFull(event) && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                        Event Penuh
                      </span>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1" disabled>
                      Lihat Detail (Segera)
                    </Button>
                    
                    <Button 
                      size="sm"
                      className="flex-1"
                      disabled
                    >
                      Daftar Sekarang (Segera)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}