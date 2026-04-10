import { Navigation } from './Navigation';
import { Plane, Car, MapPin, ParkingCircle } from 'lucide-react';

export function TravelPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* HERO SECTION */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/travel-hero.jpg" 
            alt="Andalusian Journey" 
            className="w-full h-full object-cover opacity-10"
          />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <span className="label-uppercase">Travel Information</span>
          <h1 className="title-hero">Journey to Monda</h1>
          <p className="text-xl font-serif italic text-secondary-text">
            Plan your voyage to the heart of Andalusia
          </p>
          <div className="w-16 h-px mx-auto mt-12 bg-border" />
        </div>
      </section>

      {/* MAIN CONTENT SPACE */}
      <section className="section-container pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* 1. FLIGHTS */}
          <div className="wedding-card">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-white rounded-full shadow-sm">
                <Plane size={24} className="text-accent-terracotta" />
              </div>
              <h2 className="title-card mb-0">Flights</h2>
            </div>
            <p className="mb-6">
              The closest airport is <span className="font-medium text-primary-text">Málaga Airport (AGP)</span>, which is well-connected to most major European cities.
            </p>
            <div className="p-4 bg-background rounded-xl border border-border italic text-sm">
              Málaga Airport is located approximately 45 minutes from the venue.
            </div>
          </div>

          {/* 2. TRANSFERS */}
          <div className="wedding-card">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-white rounded-full shadow-sm">
                <Car size={24} className="text-accent-terracotta" />
              </div>
              <h2 className="title-card mb-0">Transfers</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-border pb-2">
                <span>Private Car (Up to 4)</span>
                <span className="font-serif text-primary-text">€95</span>
              </div>
              <div className="flex justify-between items-center border-b border-border pb-2">
                <span>Private Van (Up to 7)</span>
                <span className="font-serif text-primary-text">€150</span>
              </div>
              <p className="text-sm text-secondary-text pt-2">
                We can help coordinate shared transfers between guests to reduce costs. Please indicate your interest in the RSVP.
              </p>
            </div>
          </div>

          {/* 3. CAR RENTAL */}
          <div className="wedding-card">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-white rounded-full shadow-sm">
                <Car size={24} className="text-accent-terracotta" />
              </div>
              <h2 className="title-card mb-0">Car Rental</h2>
            </div>
            <p className="mb-6">
              For those wishing to explore Andalusia at their own pace, car rentals are available at the airport starting from <span className="font-serif text-primary-text">€30/day</span>.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-beige" />
                <span>Malaga Car Hire</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-beige" />
                <span>Sixt / Hertz / Avis</span>
              </div>
            </div>
          </div>

          {/* 4. PARKING */}
          <div className="wedding-card">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-white rounded-full shadow-sm">
                <ParkingCircle size={24} className="text-accent-terracotta" />
              </div>
              <h2 className="title-card mb-0">Parking</h2>
            </div>
            <p className="mb-6">
              Complimentary parking is available for all guests at <span className="font-medium text-primary-text">Castillo de Monda</span>.
            </p>
            <div className="flex items-center gap-4 p-4 bg-background rounded-xl border border-border">
              <MapPin size={20} className="text-accent-beige" />
              <div className="text-sm">
                Calle Castillo, 29110 Monda, Málaga
              </div>
            </div>
          </div>

        </div>

        {/* HELPFUL TIPS */}
        <div className="mt-16 text-center">
          <div className="wedding-card bg-accent-beige/5 border-accent-beige/20">
            <h2 className="title-card mb-6 italic">Helpful Journey Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
              <div>
                <h4 className="font-medium text-primary-text mb-2">Climate</h4>
                <p>Warm and pleasant, typically between 20-25°C in April.</p>
              </div>
              <div>
                <h4 className="font-medium text-primary-text mb-2">Arrival</h4>
                <p>We recommend arriving 1-2 days early to enjoy the region.</p>
              </div>
              <div>
                <h4 className="font-medium text-primary-text mb-2">Support</h4>
                <p>Need help? Contact the hotel at +34 952 45 98 36</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 text-center border-t border-border bg-background">
        <p className="label-uppercase mb-0">Lama & Álvaro · 2027</p>
      </footer>
    </div>
  );
}