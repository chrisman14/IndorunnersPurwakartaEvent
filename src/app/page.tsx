import { Suspense } from "react";
import { EventsList } from "@/components/events-list";

export default function Home() {
  return (
    <div className="bg-secondary-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-hero-gradient text-center space-y-4 sm:space-y-6 py-12 sm:py-16 lg:py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white drop-shadow-lg">
            Event Lari Indorunners Purwakarta
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-primary-100 max-w-2xl mx-auto px-4 drop-shadow">
            Temukan dan daftarkan diri Anda pada event lari yang tersedia.
            Pendaftaran mudah, langsung tanpa perlu membuat akun!
          </p>
        </div>
      </section>

      {/* Events List Section */}
      <section className="container mx-auto px-4 py-8">
        <Suspense fallback={
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
              <p className="text-neutral-600">Memuat event...</p>
            </div>
          </div>
        }>
          <EventsList />
        </Suspense>
      </section>
    </div>
  );
}
