'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function Navigation() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b border-primary-200 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-lg md:text-xl font-bold text-primary-500 hover:text-primary-600 transition-colors">
              <span className="hidden sm:inline">Indorunners Purwakarta</span>
              <span className="sm:hidden">Indorunners</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4">
            <Link href="/events" className="text-neutral-700 hover:text-primary-500 hover:bg-secondary-50 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Event Lari
            </Link>
            
            {session && session.user.role === 'admin' && (
              <>
                <Link href="/admin/dashboard" className="text-neutral-700 hover:text-primary-500 hover:bg-secondary-50 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Dashboard Admin
                </Link>
                <Link href="/admin/events" className="text-neutral-700 hover:text-primary-500 hover:bg-secondary-50 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Kelola Event
                </Link>
                <Link href="/admin/activities" className="text-neutral-700 hover:text-primary-500 hover:bg-secondary-50 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Kelola Aktivitas
                </Link>
                <Link href="/admin/attendance" className="text-neutral-700 hover:text-primary-500 hover:bg-secondary-50 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Kelola Pendaftaran
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            {session && session.user.role === 'admin' ? (
              <>
                <span className="hidden sm:inline text-xs md:text-sm text-neutral-600">
                  Admin: {session.user.name}
                </span>
                <Button 
                  variant="outline" 
                  onClick={() => signOut()}
                  size="sm"
                  className="hidden md:inline-flex border-primary-300 text-primary-600 hover:bg-primary-50 hover:text-primary-700"
                >
                  Keluar
                </Button>
              </>
            ) : (
              <div className="hidden md:flex space-x-2">
                <Link href="/auth/signin">
                  <Button variant="outline" size="sm" className="border-primary-300 text-primary-600 hover:bg-primary-50 hover:text-primary-700">
                    Login Admin
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-neutral-700 hover:text-primary-500 hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-primary-200 bg-secondary-50">
              <Link 
                href="/events" 
                className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-primary-500 hover:bg-white transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Event Lari
              </Link>
              
              {session && session.user.role === 'admin' ? (
                <>
                  <div className="px-3 py-2 text-sm font-medium text-neutral-600 border-b border-primary-200">
                    Admin: {session.user.name}
                  </div>
                  
                  <Link 
                    href="/admin/dashboard" 
                    className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-primary-500 hover:bg-white transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard Admin
                  </Link>
                  <Link 
                    href="/admin/events" 
                    className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-primary-500 hover:bg-white transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Kelola Event
                  </Link>
                  <Link 
                    href="/admin/activities" 
                    className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-primary-500 hover:bg-white transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Kelola Aktivitas
                  </Link>
                  <Link 
                    href="/admin/attendance" 
                    className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-primary-500 hover:bg-white transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Kelola Pendaftaran
                  </Link>
                  
                  <button 
                    onClick={() => {
                      signOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-primary-500 hover:bg-white transition-colors"
                  >
                    Keluar
                  </button>
                </>
              ) : (
                <Link 
                  href="/auth/signin"
                  className="block px-3 py-2 rounded-md text-base font-medium text-primary-500 hover:text-primary-600 hover:bg-white border-t border-primary-200 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  🔐 Login Admin
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}