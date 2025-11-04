'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Event {
  id: number;
  title: string;
  description: string;
  event_date: string;
  location: string;
  registration_fee: number;
  max_participants: number;
  registration_deadline: string;
  status: string;
  created_at: string;
  _count?: {
    registrations: number;
  };
}

export function EventsList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events/public');
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    if (amount === 0) return 'Gratis';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  const getEventStatus = (event: Event) => {
    const now = new Date();
    const eventDate = new Date(event.event_date);
    const registrationDeadline = new Date(event.registration_deadline);

    if (eventDate < now) {
      return { label: 'Selesai', color: 'bg-neutral-100 text-neutral-700' };
    }
    if (registrationDeadline < now) {
      return { label: 'Pendaftaran Ditutup', color: 'bg-red-100 text-red-700' };
    }
    if (event._count?.registrations && event._count.registrations >= event.max_participants) {
      return { label: 'Penuh', color: 'bg-yellow-100 text-yellow-700' };
    }
    return { label: 'Buka Pendaftaran', color: 'bg-green-100 text-green-700' };
  };

  const canRegister = (event: Event) => {
    const now = new Date();
    const eventDate = new Date(event.event_date);
    const registrationDeadline = new Date(event.registration_deadline);

    return (
      eventDate > now &&
      registrationDeadline > now &&
      (!event._count?.registrations || event._count.registrations < event.max_participants)
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-neutral-600">Memuat event...</p>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <span className="text-6xl">🏃‍♂️</span>
        </div>
        <h3 className="text-xl font-semibold text-neutral-900 mb-2">
          Belum Ada Event
        </h3>
        <p className="text-neutral-600">
          Event lari akan muncul di sini setelah admin membuatnya.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-primary-600 mb-2">
          Event Lari Tersedia
        </h2>
        <p className="text-neutral-600">
          Pilih event yang ingin Anda ikuti dan daftar sekarang!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => {
          const status = getEventStatus(event);
          const registrationOpen = canRegister(event);

          return (
            <Card key={event.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow border-primary-200">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-bold text-primary-600 leading-tight pr-2">
                    {event.title}
                  </CardTitle>
                  <Badge className={status.color}>
                    {status.label}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-neutral-700 line-clamp-3">
                  {event.description}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-primary-600">📅</span>
                    <span className="text-neutral-700">{formatDate(event.event_date)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-primary-600">📍</span>
                    <span className="text-neutral-700">{event.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-primary-600">💰</span>
                    <span className="text-neutral-700">{formatCurrency(event.registration_fee)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-medium text-primary-600">👥</span>
                    <span className="text-neutral-700">
                      {event._count?.registrations || 0} / {event.max_participants} peserta
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-medium text-primary-600">⏰</span>
                    <span className="text-neutral-700">
                      Daftar sampai {formatDate(event.registration_deadline)}
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex flex-col gap-2">
                  <Button variant="outline" className="w-full" disabled>
                    Lihat Detail (Segera)
                  </Button>
                  
                  {registrationOpen ? (
                    <Button className="w-full bg-primary-600 hover:bg-primary-700" disabled>
                      Daftar Sekarang (Segera)
                    </Button>
                  ) : (
                    <Button disabled className="w-full">
                      {status.label}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}