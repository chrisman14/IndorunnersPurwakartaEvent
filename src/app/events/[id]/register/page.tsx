"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface EventModel {
  id: number;
  title: string;
  description?: string;
  event_date: string;
  registration_deadline: string;
  location: string;
  max_participants?: number | null;
  registration_fee: number;
  registered_count?: number;
}

interface FormDataState {
  full_name: string;
  email: string;
  phone: string;
  birth_date: string;
  gender: string;
  t_shirt_size: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  special_needs?: string;
  payment_proof?: File | null;
}

export default function RegisterPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [event, setEvent] = useState<EventModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormDataState>({
    full_name: "",
    email: "",
    phone: "",
    birth_date: "",
    gender: "",
    t_shirt_size: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    special_needs: "",
    payment_proof: null,
  });

  useEffect(() => {
    const id = params.id;
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${id}`);
        if (!res.ok) throw new Error("Event not found");
        const data = await res.json();
        setEvent(data.event ?? null);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data event.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [params.id]);

  const handleInputChange = (field: keyof FormDataState, value: string | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value } as unknown as FormDataState));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    handleInputChange("payment_proof", file);
  };

  const validateForm = (): boolean => {
    const required: (keyof FormDataState)[] = [
      "full_name",
      "email",
      "phone",
      "birth_date",
      "gender",
      "t_shirt_size",
      "emergency_contact_name",
      "emergency_contact_phone",
    ];

    for (const field of required) {
      const v = formData[field];
      if (!v || (typeof v === "string" && v.trim() === "")) {
        setError(`Field ${String(field)} harus diisi`);
        return false;
      }
    }

    if (event && event.registration_fee > 0 && !formData.payment_proof) {
      setError("Bukti pembayaran harus diupload untuk event berbayar");
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const payload = new globalThis.FormData();
      // append all fields
      payload.append("event_id", String(event.id));
      payload.append("full_name", formData.full_name);
      payload.append("email", formData.email);
      payload.append("phone", formData.phone);
      payload.append("birth_date", formData.birth_date);
      payload.append("gender", formData.gender);
      payload.append("t_shirt_size", formData.t_shirt_size);
      payload.append("emergency_contact_name", formData.emergency_contact_name);
      payload.append("emergency_contact_phone", formData.emergency_contact_phone);
      if (formData.special_needs) payload.append("special_needs", formData.special_needs);
      if (formData.payment_proof) payload.append("payment_proof", formData.payment_proof);

      const res = await fetch("/api/events/register-public", {
        method: "POST",
        body: payload,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mendaftar");

      // navigate to success page (include registration id if provided)
      const regId = data.registration_id ? `?registration_id=${data.registration_id}` : "";
      router.push(`/events/${event.id}/registration-success${regId}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan saat mendaftar");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (iso?: string) => {
    if (!iso) return "-";
    try {
      return new Date(iso).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" });
    } catch {
      return iso;
    }
  };

  const formatCurrency = (amount = 0) => {
    if (amount === 0) return "Gratis";
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4" />
            <p className="text-neutral-600">Memuat data event...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Event tidak ditemukan</CardTitle>
            <CardDescription>Data event gagal dimuat atau tidak ada.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => router.push("/events")}>Kembali ke daftar event</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isRegistrationClosed = new Date() > new Date(event.registration_deadline);
  const isEventFull = event.max_participants ? (event.registered_count ?? 0) >= event.max_participants : false;

  if (isRegistrationClosed || isEventFull) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Pendaftaran Ditutup</CardTitle>
            <CardDescription>{isRegistrationClosed ? "Batas waktu pendaftaran telah berakhir" : "Kuota peserta sudah terpenuhi"}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => router.push("/events")}>Kembali ke daftar event</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Pendaftaran: {event.title}</CardTitle>
            <CardDescription>Isi formulir di bawah untuk mendaftar event ini</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <div className="font-medium">Tanggal:</div>
                <div className="text-neutral-600">{formatDate(event.event_date)}</div>
              </div>
              <div>
                <div className="font-medium">Lokasi:</div>
                <div className="text-neutral-600">{event.location}</div>
              </div>
              <div>
                <div className="font-medium">Biaya:</div>
                <div className="text-neutral-600">{formatCurrency(event.registration_fee)}</div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nama Lengkap *</label>
                  <Input value={formData.full_name} onChange={(e) => handleInputChange("full_name", e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <Input type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Telepon *</label>
                  <Input value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tanggal Lahir *</label>
                  <Input type="date" value={formData.birth_date} onChange={(e) => handleInputChange("birth_date", e.target.value)} required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Jenis Kelamin *</label>
                  <select value={formData.gender} onChange={(e) => handleInputChange("gender", e.target.value)} className="w-full p-2 border rounded" required>
                    <option value="">Pilih jenis kelamin</option>
                    <option value="male">Laki-laki</option>
                    <option value="female">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Ukuran Kaos *</label>
                  <select value={formData.t_shirt_size} onChange={(e) => handleInputChange("t_shirt_size", e.target.value)} className="w-full p-2 border rounded" required>
                    <option value="">Pilih ukuran</option>
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                  </select>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Kontak Darurat</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nama Kontak Darurat *</label>
                    <Input value={formData.emergency_contact_name} onChange={(e) => handleInputChange("emergency_contact_name", e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Telepon Darurat *</label>
                    <Input value={formData.emergency_contact_phone} onChange={(e) => handleInputChange("emergency_contact_phone", e.target.value)} required />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Kebutuhan Khusus (opsional)</label>
                <textarea value={formData.special_needs} onChange={(e) => handleInputChange("special_needs", e.target.value)} className="w-full p-2 border rounded" rows={3} />
              </div>

              {event.registration_fee > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Bukti Pembayaran</h4>
                  <p className="text-sm text-neutral-600 mb-2">Silakan transfer jumlah: {formatCurrency(event.registration_fee)} lalu upload bukti pembayaran.</p>
                  <Input type="file" accept="image/*" onChange={handleFileChange} />
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={() => router.push("/events")} className="flex-1">
                  Batal
                </Button>
                <Button type="submit" disabled={submitting} className="flex-1">
                  {submitting ? "Mendaftar..." : "Daftar Event"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-xs text-neutral-600 space-y-2">
              <p className="font-medium">Syarat dan Ketentuan:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Peserta wajib mengikuti protokol kesehatan yang berlaku</li>
                <li>Peserta bertanggung jawab atas kesehatan dan keselamatan diri sendiri</li>
                <li>Panitia berhak melakukan perubahan jadwal atau pembatalan event jika diperlukan</li>
                <li>Biaya pendaftaran tidak dapat dikembalikan kecuali event dibatalkan oleh panitia</li>
                <li>Dengan mendaftar, peserta menyetujui syarat dan ketentuan yang berlaku</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

