'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const errorMessages: Record<string, string> = {
  Configuration: 'Terjadi kesalahan konfigurasi server. Silakan hubungi administrator.',
  AccessDenied: 'Akses ditolak. Anda tidak memiliki izin untuk mengakses halaman ini.',
  Verification: 'Token verifikasi tidak valid atau sudah kedaluwarsa.',
  Default: 'Terjadi kesalahan yang tidak diketahui. Silakan coba lagi.',
  CredentialsSignin: 'Email atau password yang Anda masukkan salah.',
  Signin: 'Terjadi kesalahan saat login. Silakan coba lagi.',
  OAuthSignin: 'Terjadi kesalahan saat login dengan provider eksternal.',
  OAuthCallback: 'Terjadi kesalahan saat memproses callback OAuth.',
  OAuthCreateAccount: 'Tidak dapat membuat akun dengan provider OAuth.',
  EmailCreateAccount: 'Tidak dapat membuat akun dengan email.',
  Callback: 'Terjadi kesalahan saat memproses callback.',
  OAuthAccountNotLinked: 'Akun OAuth tidak terhubung dengan akun yang ada.',
  EmailSignin: 'Tidak dapat mengirim email login.',
  SessionRequired: 'Anda harus login untuk mengakses halaman ini.',
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const [errorType, setErrorType] = useState<string>('');

  useEffect(() => {
    const error = searchParams.get('error') || 'Default';
    setErrorType(error);
  }, [searchParams]);

  const errorMessage = errorMessages[errorType] || errorMessages.Default;

  return (
    <div className="flex items-center justify-center min-h-[70vh] sm:min-h-[80vh] px-4 bg-secondary-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <CardTitle className="text-xl sm:text-2xl text-neutral-900">Kesalahan Login</CardTitle>
          <CardDescription className="text-sm text-neutral-600">
            Terjadi masalah saat proses autentikasi
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
              <p className="text-red-700 text-sm">
                {errorMessage}
              </p>
              {errorType && (
                <p className="text-red-500 text-xs mt-2">
                  Error Code: {errorType}
                </p>
              )}
            </div>
            
            <div className="space-y-3">
              <Link href="/auth/signin" className="block">
                <Button className="w-full bg-primary-500 hover:bg-primary-600 text-white">
                  Coba Login Lagi
                </Button>
              </Link>
              
              <Link href="/" className="block">
                <Button variant="outline" className="w-full">
                  Kembali ke Beranda
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-6 text-center text-sm">
            <div className="text-neutral-500">
              Jika masalah berlanjut, silakan hubungi administrator sistem.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}