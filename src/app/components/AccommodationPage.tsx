import { Navigation } from './Navigation';
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
      <Navigation />
      
      {/* 1. HERO - STAY TITLE */}
      <section className="relative pt-40 pb-16 px-6 bg-background overflow-hidden">
        {/* Arch Pattern Background - Identical to Home */}
        <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'url("/arch-pattern.png")', backgroundSize: '400px' }} />
        
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <span className="label-uppercase mb-6 block">Where to Stay</span>
          <h1 className="text-5xl md:text-7xl font-serif text-primary-text mb-8 leading-tight">Castillo de Monda</h1>
          <p className="text-xl md:text-2xl font-serif text-secondary-text leading-relaxed italic max-w-lg mx-auto">
            "Rest amidst the history and quiet beauty of our private fortress."
          </p>
          <div className="w-16 h-px mx-auto mt-12 bg-accent-terracotta" />
        </div>
      </section>

      {/* 2. WELCOME MESSAGE */}
      <section className="px-6 pb-24 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="wedding-card bg-[#F5EFEB]/50 backdrop-blur-sm border-accent-terracotta/20 text-center py-16 px-8 md:px-16">
            <div className="max-w-2xl mx-auto space-y-8">
              <h2 className="text-4xl md:text-5xl font-serif text-primary-text italic">A Private Celebration</h2>
              <p className="text-lg text-secondary-text leading-relaxed">
                We are delighted to share that the entire venue will be <span className="text-primary-text font-bold">privatized for our wedding</span>.
              </p>
              <p className="text-secondary-text italic line-clamp-none">
                We warmly invite you to stay on-site and share the full experience with us. Rooms are available on a first-come, first-served basis, and breakfast is included with every stay.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ROOM TYPES GRID */}
      <section className="py-24 px-6 bg-[#F5EFEB] border-y border-border/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 gap-12">
            {roomTypes.map((room, idx) => (
              <div key={idx} className="wedding-card group overflow-hidden p-0 flex flex-col md:flex-row shadow-sm hover:shadow-2xl transition-all duration-700 bg-white border border-border/5">
                <div className="w-full md:w-[45%] h-80 md:h-auto overflow-hidden relative">
                  <img 
                    src={room.image} 
                    alt={room.name} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="bg-white/95 backdrop-blur px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold text-accent-terracotta shadow-lg">
                      {room.rooms} Available
                    </span>
                  </div>
                </div>
                <div className="w-full md:w-[55%] p-10 md:p-14 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-3xl md:text-4xl font-serif text-primary-text italic leading-none">{room.name}</h3>
                    <div className="flex items-center gap-2 text-accent-terracotta">
                      <Users size={18} />
                      <span className="text-sm font-bold uppercase tracking-widest">{room.maxGuests} guests</span>
                    </div>
                  </div>
                  <p className="text-sm text-secondary-text mb-6">
                    {room.description}
                  </p>
                  <div className="flex flex-wrap gap-4 mb-8">
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
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-8 border-t border-border/50">
                    <div className="text-3xl font-serif text-primary-text">
                      €{room.pricePerNight}
                      <span className="text-xs font-sans text-secondary-text ml-3 uppercase tracking-widest font-bold">per night</span>
                    </div>
                    <button 
                      onClick={() => navigate('/rsvp')}
                      className="btn-primary w-full sm:w-auto py-4 px-10 text-xs tracking-widest uppercase bg-primary-text text-white hover:bg-accent-terracotta transition-all rounded-xl shadow-lg"
                    >
                      Select in RSVP
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. BOOKING PROCESS */}
      <section className="py-32 px-6 bg-background">
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

      {/* FOOTER */}
      <footer className="pt-8 pb-32 text-center border-t border-border bg-background">
        <p className="label-uppercase mb-0">Lama & Álvaro · 2027</p>
      </footer>
    </div>
  );
}