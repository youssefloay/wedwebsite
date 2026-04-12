import { Users, Info, Globe, ShieldCheck, Zap, Clock, Compass } from 'lucide-react';
import { useNavigate, Link } from 'react-router';

export function AccommodationPage() {
  const navigate = useNavigate();

  const roomTypes = [
    {
      name: 'Comfy',
      rooms: 13,
      maxGuests: 2,
      pricePerNight: 153.5,
      image: "/room-comfy.png",
      description: 'Our "Comfy" rooms offer the perfect retreat, whether for a short stay or an extended escape.'
    },
    {
      name: 'Superior Comfy',
      rooms: 15,
      maxGuests: 3,
      pricePerNight: 183.5,
      image: "/room-superior.png",
      description: 'Spacious retreat with a large double bed or two twins, offering a perfect blend of luxury and character.'
    },
    {
      name: 'Castillo Junior',
      rooms: 6,
      maxGuests: 2,
      pricePerNight: 208.5,
      image: "/room-junior.png",
      description: 'Top of the range rooms featuring both a balcony and a private seating area.'
    },
    {
      name: 'Family Room',
      rooms: 1,
      maxGuests: 4,
      pricePerNight: 218.5,
      image: "/room-family.png",
      description: 'Consists of two bedrooms sharing one bathroom, perfect for family groups.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      

      {/* 1. HERO - STAY TITLE */}
      <section className="relative pt-10 pb-0 px-6 bg-background overflow-hidden section-layer-1 border-b border-border/10">
        {/* Arch Pattern Background - Identical to Home */}
        <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'url("/arch-pattern.png")', backgroundSize: '400px' }} />

        <div className="relative z-10 max-w-3xl mx-auto text-center reveal">
          <span className="label-uppercase mb-6 block">Where to Stay</span>
          <h1 className="text-5xl md:text-7xl font-serif text-primary-text mb-8 leading-tight">Stay with Us</h1>
          <p className="text-xl md:text-2xl font-serif text-secondary-text italic leading-relaxed max-w-2xl mx-auto px-4 opacity-80">
            "Rest amidst the history of the Andalusian hills, where the quiet of the night meets the beauty of the Castle."
          </p>
          <div className="w-16 h-px mx-auto my-10 bg-accent-terracotta" />
        </div>
      </section>

      {/* 2. WELCOME MESSAGE */}
      <section className="px-6 pb-24 bg-background reveal">
        <div className="max-w-4xl mx-auto">
          <div className="wedding-card bg-[#F5EFEB]/50 backdrop-blur-sm border-accent-terracotta/20 text-center py-16 px-8 md:px-16 hover:-translate-y-2 transition-all duration-700">
            <div className="max-w-2xl mx-auto space-y-8">
              <h2 className="text-4xl md:text-5xl font-serif text-primary-text italic">A Private Celebration</h2>
              <p className="text-xl text-secondary-text leading-relaxed italic opacity-80">
                We are delighted to share that the entire venue will be <span className="text-primary-text font-bold">privatized for our wedding</span>.
              </p>
              <p className="text-secondary-text italic leading-relaxed">
                We warmly invite you to stay on-site and share the full experience with us. Rooms are available on a first-come, first-served basis, and breakfast is included with every stay.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE CASTLE SANCTUARIES */}
      <section className="py-24 px-6 section-layer-3 border-y border-border/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 flex flex-col items-center reveal">
            <span className="label-uppercase">The Sanctuaries</span>
            <h2 className="text-4xl md:text-5xl font-serif text-primary-text mb-6 italic">Private Rooms</h2>
            <div className="w-16 h-px bg-accent-terracotta" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {roomTypes.map((room) => (
              <div key={room.name} className="wedding-card group flex flex-col h-full !p-0 overflow-hidden">
                <div className="aspect-[16/10] overflow-hidden depth-overlay relative">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 img-grain"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-extrabold text-[#515C4C] shadow-sm">
                    {room.rooms === 1 ? '1 Room' : `${room.rooms} Rooms`}
                  </div>
                </div>
                <div className="w-full md:w-[55%] p-10 md:p-14 flex flex-col justify-center">
                  <div className="flex flex-col mb-8">
                    <h3 className="text-3xl md:text-4xl font-serif text-primary-text italic leading-tight mb-3 transition-colors duration-500 group-hover:text-accent-terracotta">{room.name}</h3>
                    <div className="flex items-center gap-2 text-secondary-text/60">
                      <Users size={14} strokeWidth={1.5} />
                      <span className="text-[10px] uppercase tracking-widest font-bold">{room.maxGuests} Guests Max</span>
                    </div>
                  </div>
                  <p className="text-base text-secondary-text mb-8 italic leading-relaxed opacity-80">
                    {room.description}
                  </p>
                  <div className="flex flex-wrap gap-5 mb-10">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-accent-terracotta/80">
                      <Zap size={10} strokeWidth={1.25} /> AC
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-accent-terracotta/80">
                      <Globe size={10} strokeWidth={1.25} /> Wifi
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-accent-terracotta/80">
                      <Clock size={10} strokeWidth={1.25} /> Breakfast
                    </div>
                    {(room.name.includes('Junior') || room.name.includes('Superior')) && (
                      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-accent-terracotta/80">
                        <Compass size={10} strokeWidth={1.25} /> Views
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-10 border-t border-border/20">
                    <div className="text-3xl font-serif text-primary-text">
                      €{room.pricePerNight}
                      <span className="text-[10px] font-sans text-secondary-text/60 ml-3 uppercase tracking-widest font-bold">per night</span>
                    </div>
                    <button
                      onClick={() => navigate('/rsvp')}
                      className="btn-primary"
                    >
                      Reserve in RSVP
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. BOOKING PROCESS */}
      <section className="py-32 px-6 section-layer-2">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <span className="label-uppercase mb-4 block">The Process</span>
            <h2 className="text-5xl md:text-6xl font-serif text-primary-text italic">Securing Your Stay</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
            {/* Visual connector for desktop */}
            <div className="hidden md:block absolute top-[50px] left-0 w-full h-px bg-accent-terracotta/20 -z-10" />

            {[
              {
                step: "01",
                title: "Indicate Choice",
                text: "Select your preferred room type during the RSVP process."
              },
              {
                step: "02",
                title: "Coordination",
                text: "The hotel will contact you directly to confirm your details."
              },
              {
                step: "03",
                title: "Finalize",
                text: "Payment is required upon booking to guarantee your room."
              }
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-3xl font-serif text-accent-terracotta shadow-xl mx-auto mb-8 group-hover:bg-accent-terracotta group-hover:text-white transition-all duration-500 border border-accent-terracotta/10">
                  {item.step}
                </div>
                <h4 className="text-2xl font-serif text-primary-text mb-4 italic">{item.title}</h4>
                <p className="text-sm text-secondary-text leading-relaxed font-serif italic">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 flex flex-col md:flex-row gap-6">
            <div className="flex-1 p-8 bg-[#F5EFEB]/50 border border-accent-terracotta/10 rounded-3xl flex items-start gap-5">
              <Info className="text-accent-terracotta shrink-0" size={24} />
              <p className="text-sm text-secondary-text italic leading-relaxed font-serif">
                Should you prefer to stay elsewhere, the surrounding villages and the coast offer many alternatives. However, we would love to have you sharing the full experience with us!
              </p>
            </div>

            <Link to="/travel#visa" className="flex-1 p-8 bg-white border-2 border-dashed border-accent-terracotta/20 rounded-3xl flex items-start gap-5 hover:border-accent-terracotta/40 transition-colors group">
              <Globe className="text-accent-terracotta shrink-0 group-hover:rotate-12 transition-transform" size={24} />
              <div>
                <h4 className="font-serif text-lg text-primary-text mb-1 italic">Visa Documentation</h4>
                <p className="text-xs text-secondary-text leading-relaxed">
                  Require a formal hotel invitation letter for your visa? See our <span className="text-accent-terracotta underline">Travel Guide</span> for support details.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL RSVP CTA */}
      <section className="section-layer-1 py-32 px-6 border-t border-border/10">
        <div className="max-w-2xl mx-auto text-center reveal">
          <span className="label-uppercase mb-6 block font-bold">Secure your Sanctuary</span>
          <h2 className="text-4xl md:text-5xl font-serif text-primary-text mb-8 italic">Rest at the Castle</h2>
          <p className="text-xl text-secondary-text font-serif italic mb-12 opacity-80 leading-relaxed">
            "Room reservations are handled exclusively through our RSVP process to ensure every guest is perfectly accommodated."
          </p>
          <Link to="/rsvp" className="btn-primary inline-flex shadow-xl">
             Select & RSVP
          </Link>
        </div>
      </section>

      {/* FOOTER */}
    </div>
  );
}