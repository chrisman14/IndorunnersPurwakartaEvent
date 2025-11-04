'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type EventType = {
  id: string | number;
  title: string;
  description?: string;
  date?: string;
  registration_deadline?: string;
  location?: string;
  maxParticipants?: number;
  registration_fee?: number | null;
  registered_count?: number;
  status?: string;
};

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.id as string;

  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${eventId}`);
        if (!res.ok) {
          router.push('/events');
          return;
        }
        const data = await res.json();
        setEvent(data.event || data);
      } catch (err) {
        console.error('Error fetching event:', err);
        router.push('/events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, router]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl lg:text-3xl">{event.title}</CardTitle>
                <div className="text-sm text-neutral-600">{event.location}</div>
              </div>
              <div>
                <Button variant="outline" onClick={() => router.back()}>
                  Kembali
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-neutral-700 leading-relaxed">{event.description}</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Event</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">Lokasi</p>
                    <p className="text-sm text-muted-foreground">{event.location}</p>
                  </div>
                  <div>
                    <p className="font-medium">Deskripsi</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{event.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pendaftaran</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Batas pendaftaran:</p>
                  <p className="font-medium">{event.registration_deadline ?? '-'}</p>
                </div>
                <div className="space-y-3 mt-4">
                  <Link href={`/events/${event.id}/register`} className="block">
                    <Button className="w-full" size="lg">
                      Daftar Sekarang
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}