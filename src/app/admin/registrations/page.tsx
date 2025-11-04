'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface Registration {
  id: number;
  registration_id: string;
  event_id: number;
  event_title: string;
  full_name: string;
  email: string;
  phone: string;
  birth_date: string;
  gender: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  t_shirt_size: string;
  special_needs: string;
  payment_proof_url?: string;
  status: string;
  registered_at: string;
  event_date: string;
  registration_fee: number;
}

export default function AdminRegistrationsPage() {
  const router = useRouter();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await fetch('/api/admin/registrations');
      if (response.ok) {
        const data = await response.json();
        setRegistrations(data.registrations);
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateRegistrationStatus = async (id: number, newStatus: string) => {
    try {
      const response = await fetch('/api/admin/registrations', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registration_id: id,
          status: newStatus,
        }),
      });

      if (response.ok) {
        // Update local state
        setRegistrations(prev => 
          prev.map(reg => 
            reg.id === id ? { ...reg, status: newStatus } : reg
          )
        );
      }
    } catch (error) {
      console.error('Error updating registration status:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pending_payment': { label: 'Menunggu Pembayaran', className: 'bg-yellow-100 text-yellow-700' },
      'confirmed': { label: 'Terkonfirmasi', className: 'bg-green-100 text-green-700' },
      'cancelled': { label: 'Dibatalkan', className: 'bg-red-100 text-red-700' },
      'payment_verified': { label: 'Pembayaran Terverifikasi', className: 'bg-blue-100 text-blue-700' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || 
                   { label: status, className: 'bg-gray-100 text-gray-700' };

    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const filteredRegistrations = registrations.filter(registration => {
    const matchesSearch = 
      registration.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.event_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.registration_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || registration.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-neutral-600">Memuat data pendaftaran...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Kelola Pendaftaran</h1>
          <p className="text-neutral-600 text-sm sm:text-base">
            Kelola pendaftaran peserta event dan verifikasi pembayaran
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Cari nama, email, event, atau ID pendaftaran..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="all">Semua Status</option>
                <option value="pending_payment">Menunggu Pembayaran</option>
                <option value="confirmed">Terkonfirmasi</option>
                <option value="payment_verified">Pembayaran Terverifikasi</option>
                <option value="cancelled">Dibatalkan</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Registrations List */}
      {filteredRegistrations.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-neutral-600">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="text-xl font-semibold mb-2">Belum ada pendaftaran</h3>
              <p className="text-sm">
                Pendaftaran peserta akan muncul di sini setelah ada yang mendaftar.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRegistrations.map((registration) => (
            <Card key={registration.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{registration.full_name}</h3>
                        <p className="text-sm text-neutral-600">{registration.email}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-2 sm:mt-0">
                        {getStatusBadge(registration.status)}
                        <span className="text-xs text-neutral-500">
                          ID: {registration.registration_id}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                      <div>
                        <span className="font-medium">Event:</span>
                        <p className="text-neutral-600">{registration.event_title}</p>
                      </div>
                      <div>
                        <span className="font-medium">Tanggal Event:</span>
                        <p className="text-neutral-600">{formatDate(new Date(registration.event_date))}</p>
                      </div>
                      <div>
                        <span className="font-medium">Biaya:</span>
                        <p className="text-neutral-600">
                          {registration.registration_fee > 0 ? formatCurrency(registration.registration_fee) : 'Gratis'}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Telepon:</span>
                        <p className="text-neutral-600">{registration.phone}</p>
                      </div>
                      <div>
                        <span className="font-medium">Ukuran Kaos:</span>
                        <p className="text-neutral-600">{registration.t_shirt_size}</p>
                      </div>
                      <div>
                        <span className="font-medium">Tanggal Daftar:</span>
                        <p className="text-neutral-600">{formatDate(new Date(registration.registered_at))}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 min-w-[200px]">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedRegistration(registration);
                        setShowDetails(true);
                      }}
                      className="w-full"
                    >
                      Lihat Detail
                    </Button>

                    {registration.payment_proof_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(registration.payment_proof_url, '_blank')}
                        className="w-full"
                      >
                        Lihat Bukti Bayar
                      </Button>
                    )}

                    {registration.status === 'pending_payment' && (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          onClick={() => updateRegistrationStatus(registration.id, 'payment_verified')}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          Verifikasi
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateRegistrationStatus(registration.id, 'cancelled')}
                          className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
                        >
                          Tolak
                        </Button>
                      </div>
                    )}

                    {registration.status === 'payment_verified' && (
                      <Button
                        size="sm"
                        onClick={() => updateRegistrationStatus(registration.id, 'confirmed')}
                        className="w-full"
                      >
                        Konfirmasi Final
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {showDetails && selectedRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Detail Pendaftaran</CardTitle>
              <CardDescription>
                Informasi lengkap peserta: {selectedRegistration.full_name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="font-medium">ID Pendaftaran:</label>
                  <p className="text-neutral-600">{selectedRegistration.registration_id}</p>
                </div>
                <div>
                  <label className="font-medium">Status:</label>
                  <div className="mt-1">{getStatusBadge(selectedRegistration.status)}</div>
                </div>
                <div>
                  <label className="font-medium">Nama Lengkap:</label>
                  <p className="text-neutral-600">{selectedRegistration.full_name}</p>
                </div>
                <div>
                  <label className="font-medium">Email:</label>
                  <p className="text-neutral-600">{selectedRegistration.email}</p>
                </div>
                <div>
                  <label className="font-medium">Telepon:</label>
                  <p className="text-neutral-600">{selectedRegistration.phone}</p>
                </div>
                <div>
                  <label className="font-medium">Tanggal Lahir:</label>
                  <p className="text-neutral-600">{formatDate(new Date(selectedRegistration.birth_date))}</p>
                </div>
                <div>
                  <label className="font-medium">Jenis Kelamin:</label>
                  <p className="text-neutral-600">{selectedRegistration.gender === 'male' ? 'Laki-laki' : 'Perempuan'}</p>
                </div>
                <div>
                  <label className="font-medium">Ukuran Kaos:</label>
                  <p className="text-neutral-600">{selectedRegistration.t_shirt_size}</p>
                </div>
                <div>
                  <label className="font-medium">Kontak Darurat:</label>
                  <p className="text-neutral-600">{selectedRegistration.emergency_contact_name}</p>
                </div>
                <div>
                  <label className="font-medium">Telepon Darurat:</label>
                  <p className="text-neutral-600">{selectedRegistration.emergency_contact_phone}</p>
                </div>
                <div className="sm:col-span-2">
                  <label className="font-medium">Event:</label>
                  <p className="text-neutral-600">{selectedRegistration.event_title}</p>
                </div>
                {selectedRegistration.special_needs && (
                  <div className="sm:col-span-2">
                    <label className="font-medium">Kebutuhan Khusus:</label>
                    <p className="text-neutral-600">{selectedRegistration.special_needs}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowDetails(false)}
                >
                  Tutup
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}