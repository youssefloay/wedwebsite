import { Navigation } from './Navigation';
import { Users, Info } from 'lucide-react';
import { useNavigate } from 'react-router';

export function AccommodationPage() {
  const navigate = useNavigate();

  const roomTypes = [
    {
      name: 'Comfy',
      rooms: 13,
      maxGuests: 2,
      pricePerNight: 153.5,
      image: "/room-comfy.jpg",
      description: 'Our "Comfy" rooms offer the perfect retreat, whether for a short stay or an extended escape.'
    },
    {
      name: 'Superior Comfy',
      rooms: 15,
      maxGuests: 3,
      pricePerNight: 183.5,
      image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=800",
      description: 'Spacious retreat with a large double bed or two twins, offering a perfect blend of luxury and character.'
    },
    {
      name: 'Castillo Junior',
      rooms: 6,
      maxGuests: 2,
      pricePerNight: 208.5,
      image: "/room-junior.webp",
      description: 'Top of the range rooms featuring both a balcony and a private seating area.'
    },
    {
      name: 'Family Room',
      rooms: 1,
      maxGuests: 4,
      pricePerNight: 218.5,
      image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800",
      description: 'Consists of two bedrooms sharing one bathroom, perfect for family groups.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* HERO SECTION */}
      <section className="relative pt-40 pb-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="label-uppercase">Where to Stay</span>
          <h1 className="title-hero">Accommodation</h1>
          <p className="text-xl font-serif italic text-secondary-text">
            Rest amidst the history of Castillo de Monda
          </p>
          <div className="w-16 h-px mx-auto mt-12 bg-border" />
        </div>
      </section>

      {/* WELCOME MESSAGE */}
      <section className="section-container pt-0">
        <div className="wedding-card bg-accent-beige/10 border-accent-beige/30 text-center py-12">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="title-card">A Private Celebration</h2>
            <p className="text-lg">
              We are delighted to share that the entire venue will be <span className="text-primary-text font-medium">privatized for our wedding</span>.
            </p>
            <p>
              We warmly invite you to stay on-site and share the full experience with us. Rooms are available on a first-come, first-served basis, and breakfast is included with every stay.
            </p>
          </div>
        </div>
      </section>

      {/* ROOM TYPES GRID */}
      <section className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {roomTypes.map((room, idx) => (
            <div key={idx} className="wedding-card group overflow-hidden p-0 flex flex-col md:flex-row shadow-sm hover:shadow-xl transition-all duration-500">
              <div className="w-full md:w-2/5 h-64 md:h-auto overflow-hidden relative">
                <img 
                  src={room.image} 
                  alt={room.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold text-accent-terracotta shadow-sm">
                    {room.rooms} Available
                  </span>
                </div>
              </div>
              <div className="w-full md:w-3/5 p-8 flex flex-col justify-center">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="title-card mb-0">{room.name}</h3>
                  <div className="flex items-center gap-1 text-accent-beige">
                    <Users size={16} />
                    <span className="text-sm">{room.maxGuests}</span>
                  </div>
                </div>
                <p className="text-sm text-secondary-text mb-6 flex-grow">
                  {room.description}
                </p>
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-border/50">
                  <div className="text-2xl font-serif text-primary-text">
                    €{room.pricePerNight}
                    <span className="text-xs font-sans text-secondary-text ml-2 uppercase tracking-tighter">/ night</span>
                  </div>
                  <button 
                    onClick={() => navigate('/rsvp')}
                    className="text-xs uppercase tracking-widest font-bold text-accent-terracotta hover:underline"
                  >
                    Select in RSVP
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BOOKING INFO */}
      <section className="section-container bg-card-background mt-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="label-uppercase">The Process</span>
            <h2 className="title-section">How to secure your stay</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                step: "01", 
                title: "Indicate Choice", 
                text: "Select your preferred room type directly through our RSVP form by November 13th." 
              },
              { 
                step: "02", 
                title: "Coordination", 
                text: "We will coordinate with the hotel, who will then contact you to confirm the booking." 
              },
              { 
                step: "03", 
                title: "Finalize", 
                text: "Full payment to the hotel is required upon booking to guarantee your reservation." 
              }
            ].map((item, i) => (
              <div key={i} className="text-center space-y-4">
                <div className="text-5xl font-serif text-accent-terracotta/20">{item.step}</div>
                <h4 className="font-serif text-xl text-primary-text">{item.title}</h4>
                <p className="text-sm text-secondary-text leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 p-8 border border-accent-terracotta/20 rounded-2xl flex items-start gap-4">
            <Info className="text-accent-terracotta flex-shrink-0" size={24} />
            <p className="text-sm text-secondary-text italic leading-relaxed">
              If you prefer to stay elsewhere, Marbella (25 mins) and Málaga (45 mins) offer many alternatives. However, we would love to have as many of you as possible staying with us at the venue to share the full experience!
            </p>
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