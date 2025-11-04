import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Indorunners Purwakarta',
  description: 'Admin dashboard untuk mengelola event dan pendaftaran',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/admin" className="text-xl font-bold text-primary-600">
                Admin Dashboard
              </Link>
              <nav className="hidden md:flex space-x-6">
                <Link 
                  href="/admin" 
                  className="text-neutral-600 hover:text-primary-600 transition-colors"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/admin/events" 
                  className="text-neutral-600 hover:text-primary-600 transition-colors"
                >
                  Events
                </Link>
                <Link 
                  href="/admin/registrations" 
                  className="text-neutral-600 hover:text-primary-600 transition-colors"
                >
                  Pendaftaran
                </Link>
                <Link 
                  href="/admin/attendance" 
                  className="text-neutral-600 hover:text-primary-600 transition-colors"
                >
                  Absensi
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="text-neutral-600 hover:text-primary-600 transition-colors"
              >
                Lihat Website
              </Link>
              <Link 
                href="/admin/logout" 
                className="text-red-600 hover:text-red-700 transition-colors"
              >
                Logout
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}