import { Link, useSearchParams } from "react-router";
import { useState, useEffect } from "react";
import { VideoEntrance } from './VideoEntrance';

export function Home() {
  const [searchParams] = useSearchParams();
  const [daysUntil, setDaysUntil] = useState(0);
  const [hoursUntil, setHoursUntil] = useState(0);
  const [minutesUntil, setMinutesUntil] = useState(0);
  const [justFinishedVideo, setJustFinishedVideo] = useState(false);
  const [showContent, setShowContent] = useState(() => {
    // Initialize based on query param OR session storage
    return searchParams.get('entered') === 'true' || sessionStorage.getItem('entered') === 'true';
  });

  useEffect(() => {
    // Monitor query param changes (e.g. clicking Home while on Home)
    const enteredParam = searchParams.get('entered') === 'true';
    if (enteredParam) {
      setShowContent(true);
      sessionStorage.setItem('entered', 'true');
    } else if (window.location.pathname === '/' && !window.location.search) {
      // Direct access to '/' without params (like logo click) should reset if we want it to land on splash
      setShowContent(false);
      sessionStorage.removeItem('entered');
    }
  }, [searchParams]);

  useEffect(() => {
    const updateCountdown = () => {
      const weddingDate = new Date('2027-04-17T16:00:00'); // 4pm ceremony
      const now = new Date();
      const diffTime = weddingDate.getTime() - now.getTime();

      const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));

      setDaysUntil(days);
      setHoursUntil(hours);
      setMinutesUntil(minutes);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleEnter = () => {
    setJustFinishedVideo(true);
    setShowContent(true);
    sessionStorage.setItem('entered', 'true');
  };

  if (!showContent) {
    return <VideoEntrance onEnter={handleEnter} />;
  }

  return (
    <div className="min-h-screen">
      {justFinishedVideo && (
        <>
          <div 
            className="fixed inset-0 z-[9999] bg-white pointer-events-none" 
            style={{ animation: 'fadeOutGlow 3s ease-out forwards' }}
          />
          <style>{`
            @keyframes fadeOutGlow {
              0% { opacity: 1; }
              20% { opacity: 1; }
              100% { opacity: 0; }
            }
          `}</style>
        </>
      )}

      {/* PRINT-ONLY BROCHURE COVER LOGO */}
      <div className="hidden print:block text-center py-20 pointer-events-none">
        <img src="/logo_cursive.png" alt="L&A Logo" className="w-48 mx-auto" />
      </div>

      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden bg-background">
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-bg.png"
            alt="Andalusian Arch background"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/5 via-transparent to-background/5 backdrop-blur-[0.5px]" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-2xl mx-auto flex flex-col items-center">
          <div className="reveal-scale active mb-0 w-64 md:w-80 transition-all duration-1000 flex justify-center">
            <img
              src="/bismillah.png"
              alt="Bismillah"
              className="w-full h-auto object-contain hover:scale-[1.02] transition-transform duration-1000"
            />
          </div>

          <p className="reveal delay-100 font-cinzel text-[10px] md:text-[11px] tracking-[0.6em] text-secondary-text -mt-16 mb-10 uppercase font-bold">
            En el nombre de Dios
          </p>

          <p className="reveal delay-200 font-script text-xl md:text-2xl text-secondary-text mb-12 max-w-xs md:max-w-md italic">
            You are invited to celebrate the wedding of
          </p>

          <div className="reveal delay-300 flex flex-col items-center gap-4 mb-2 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h1 className="flex flex-col items-center font-serif text-primary-text leading-[0.85]">
              <span className="text-6xl md:text-8xl uppercase tracking-wider">Lama</span>
              <span className="text-3xl md:text-4xl mt-2 uppercase tracking-widest">Loay</span>
            </h1>

            <div className="flex items-center justify-center my-8">
              <span className="script-accent text-3xl md:text-4xl opacity-60 italic">&</span>
            </div>

            <h1 className="flex flex-col items-center font-serif text-primary-text leading-[0.85]">
              <span className="text-6xl md:text-8xl uppercase tracking-wider">Alvaro</span>
              <span className="text-3xl md:text-4xl mt-2 uppercase tracking-widest">Recas</span>
            </h1>
          </div>

          <div className="w-16 h-px bg-accent-terracotta mt-8 mb-10" />

          <h2 className="script-accent text-3xl md:text-4xl mb-12 text-primary-text">
            17 April 2027
          </h2>

          <div className="reveal delay-400 flex justify-center gap-12 mb-10 scale-110">
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-serif text-primary-text mb-2">{daysUntil}</span>
              <span className="font-cinzel text-[10px] tracking-widest text-secondary-text font-bold">DAYS</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-serif text-primary-text mb-2">{hoursUntil}</span>
              <span className="font-cinzel text-[10px] tracking-widest text-secondary-text font-bold">HRS</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-serif text-primary-text mb-2">{minutesUntil}</span>
              <span className="font-cinzel text-[10px] tracking-widest text-secondary-text font-bold">MIN</span>
            </div>
          </div>

          <div className="reveal delay-500 space-y-2">
            <p className="text-xl md:text-3xl font-serif text-primary-text tracking-wide">
              Castillo de Monda
            </p>
            <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-secondary-text opacity-100 leading-relaxed font-bold mb-10">
              De La Villeta 6, 29110 Monda, Spain
            </p>
            <Link to="/rsvp" className="btn-primary inline-flex">
              Kindly RSVP
            </Link>
          </div>
        </div>
      </section>

      {/* 2. OUR STORY SECTION */}
      <section id="story" className="section-layer-2">
        <div className="section-container">
          <div className="text-center mb-16 flex flex-col items-center reveal">
            <span className="label-uppercase">Our Story</span>
            <h2 className="text-5xl md:text-6xl font-serif text-primary-text leading-[1.1] mb-6 max-w-3xl">
              A journey between <br className="hidden md:block" /> two worlds
            </h2>
            <div className="w-16 h-px bg-accent-terracotta" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1 -mx-6 md:mx-0 overflow-hidden shadow-2xl lg:w-full rounded-2xl depth-overlay">
              <img
                src="/story-photo.jpg"
                alt="Lama & Álvaro"
                className="w-full h-auto object-cover max-h-[700px] lg:aspect-[4/5] lg:max-h-none img-grain"
              />
            </div>

            <div className="order-1 lg:order-2 space-y-12 lg:text-left text-center flex flex-col items-center lg:items-start reveal">
              <div className="space-y-8">
                <p className="text-lg md:text-xl text-secondary-text leading-relaxed font-serif italic mb-10">
                  Our story is a weave of two cultures, six languages, and one shared dream. From the vibrant energy of Cairo to the historic charm of Madrid, we have found our home in each other.
                </p>
                <div className="pt-4">
                  <Link to="/rsvp" className="btn-primary inline-flex">
                    Begin your RSVP
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DRESS CODE SECTION - MOVED BEFORE SCHEDULE */}
      <section id="dress-code" className="section-layer-1 px-6 pt-12 pb-32 relative">
        <div className="text-center mb-16 flex flex-col items-center">
          <span className="label-uppercase">Dress Code</span>
          <h2 className="text-5xl md:text-6xl font-serif text-primary-text mb-6 italic">Black Tie & Color</h2>
          <div className="w-16 h-px bg-accent-terracotta mb-10" />
          
          <div className="max-w-xl mx-auto space-y-6 mb-8">
            <p className="text-lg text-secondary-text font-serif leading-relaxed italic border-x-2 border-accent-terracotta/20 px-8 py-2">
              "We invite our guests to embrace the vibrant spirit of Spain through a palette of earthy tones."
            </p>
            <p className="text-sm uppercase tracking-widest text-accent-terracotta font-bold pt-4">
              Gentle Request: Please avoid wearing all-black or dark navy.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-6xl mx-auto px-4">
          <div className="flex flex-col items-center group">
            <div className="relative overflow-hidden rounded-3xl mb-4 shadow-sm border border-border/10 aspect-[3/4] transition-all duration-700 group-hover:shadow-xl group-hover:-translate-y-2">
              <img src="/dress_code_beige.png" alt="Beige Palette" className="w-full h-full object-cover transition-all duration-700" />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>
            <span className="label-uppercase text-xs tracking-[0.2em] font-bold">Linen & Beige</span>
          </div>
          
          <div className="flex flex-col items-center group">
            <div className="relative overflow-hidden rounded-3xl mb-4 shadow-sm border border-border/10 aspect-[3/4] transition-all duration-700 group-hover:shadow-xl group-hover:-translate-y-2">
              <img src="/dress_code_olive.png" alt="Olive Palette" className="w-full h-full object-cover transition-all duration-700" />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>
            <span className="label-uppercase text-xs tracking-[0.2em] font-bold">Olive & Sage</span>
          </div>

          <div className="flex flex-col items-center group">
            <div className="relative overflow-hidden rounded-3xl mb-4 shadow-sm border border-border/10 aspect-[3/4] transition-all duration-700 group-hover:shadow-xl group-hover:-translate-y-2">
              <img src="/dress_code_terracotta.png" alt="Terracotta Palette" className="w-full h-full object-cover transition-all duration-700" />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>
            <span className="label-uppercase text-xs tracking-[0.2em] font-bold">Terracotta & Ochre</span>
          </div>

          <div className="flex flex-col items-center group">
            <div className="relative overflow-hidden rounded-3xl mb-4 shadow-sm border border-border/10 aspect-[3/4] transition-all duration-700 group-hover:shadow-xl group-hover:-translate-y-2">
              <img src="/dress_code_blue.png" alt="Dusty Blue Palette" className="w-full h-full object-cover transition-all duration-700" />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>
            <span className="label-uppercase text-xs tracking-[0.2em] font-bold">Dusty Blue & Slate</span>
          </div>
        </div>

        <div className="mt-24 text-center reveal">
          <p className="text-secondary-text font-serif italic mb-10 text-xl max-w-lg mx-auto leading-relaxed">Planning your attire? <br /> Tell us you're coming first.</p>
          <Link to="/rsvp" className="btn-primary inline-flex shadow-xl">
             RSVP to the Wedding
          </Link>
        </div>
      </section>

      {/* 4. CELEBRATION SECTION (MOVED AFTER DRESS CODE) */}
      <section id="schedule" className="section-layer-3 py-32 px-6 border-y border-border/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 flex flex-col items-center">
            <span className="label-uppercase">The Celebration</span>
            <h2 className="text-5xl md:text-6xl font-serif text-primary-text mb-6 italic">Wedding Schedule</h2>
            <div className="w-16 h-px bg-accent-terracotta" />
            <p className="mt-8 text-secondary-text font-serif italic max-w-none mx-auto w-full whitespace-nowrap text-lg md:text-xl">Saturday, 17th April 2027</p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent-beige/40 to-transparent hidden md:block" />
            
            <div className="space-y-24">
              <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="md:text-right">
                  <span className="font-cinzel text-accent-terracotta tracking-[0.3em] font-bold">16:00</span>
                  <h3 className="text-3xl font-serif text-primary-text mt-2 mb-4">The Ceremony</h3>
                  <p className="text-secondary-text leading-relaxed max-w-xs md:ml-auto">Gathering at the historic chapel gardens for our exchange of vows.</p>
                </div>
                <div className="relative group max-w-[300px] mx-auto cursor-pointer">
                  <div className="absolute inset-0 bg-accent-terracotta/10 rounded-full blur-2xl transform scale-0 group-hover:scale-100 transition-transform duration-700 opacity-50" />
                  <div className="stamp-visual transform rotate-2 relative z-10 transition-transform duration-700 group-hover:scale-105">
                    <img src="/ceremony.png" alt="Wedding Ceremony" className="stamp-image" />
                  </div>
                </div>
              </div>

              <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1 relative group max-w-[300px] mx-auto cursor-pointer">
                  <div className="absolute inset-0 bg-accent-terracotta/10 rounded-full blur-2xl transform scale-0 group-hover:scale-100 transition-transform duration-700 opacity-50" />
                  <div className="stamp-visual transform -rotate-1 relative z-10 transition-transform duration-700 group-hover:scale-105">
                    <img src="/cocktail_sketch.png" alt="Cocktail Hour" className="stamp-image" />
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <span className="font-cinzel text-accent-terracotta tracking-[0.3em] font-bold">17:30</span>
                  <h3 className="text-3xl font-serif text-primary-text mt-2 mb-4">Sunset Cocktails</h3>
                  <p className="text-secondary-text leading-relaxed max-w-xs">Hors d'oeuvres and signature drinks on the Mediterranean terrace.</p>
                </div>
              </div>

              <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="md:text-right">
                  <span className="font-cinzel text-accent-terracotta tracking-[0.3em] font-bold">19:30</span>
                  <h3 className="text-3xl font-serif text-primary-text mt-2 mb-4">Wedding Banquet</h3>
                  <p className="text-secondary-text leading-relaxed max-w-xs md:ml-auto">A grand dinner celebration featuring local Andalusian delicacies.</p>
                </div>
                <div className="relative group max-w-[300px] mx-auto cursor-pointer">
                  <div className="absolute inset-0 bg-accent-terracotta/10 rounded-full blur-2xl transform scale-0 group-hover:scale-100 transition-transform duration-700 opacity-50" />
                  <div className="stamp-visual transform rotate-1 relative z-10 transition-transform duration-700 group-hover:scale-105">
                    <img src="/dinner.png" alt="Wedding Dinner" className="stamp-image" />
                  </div>
                </div>
              </div>

              <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1 relative group max-w-[300px] mx-auto cursor-pointer">
                  <div className="absolute inset-0 bg-accent-terracotta/10 rounded-full blur-2xl transform scale-0 group-hover:scale-100 transition-transform duration-700 opacity-50" />
                  <div className="stamp-visual transform -rotate-2 relative z-10 transition-transform duration-700 group-hover:scale-105">
                    <img src="/party.png" alt="The Party" className="stamp-image" />
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <span className="font-cinzel text-accent-terracotta tracking-[0.3em] font-bold">23:00</span>
                  <h3 className="text-3xl font-serif text-primary-text mt-2 mb-4">The Party</h3>
                  <p className="text-secondary-text leading-relaxed max-w-xs">Dancing and celebration into the early hours with our live DJ.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="rsvp" className="section-layer-2 py-32 px-6 border-t border-border/10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center reveal">
            <span className="label-uppercase mb-4 block">RSVP</span>
            <h2 className="text-5xl md:text-6xl font-serif text-primary-text mb-8">Join Our Story</h2>
            <p className="text-lg text-secondary-text font-serif italic leading-relaxed mb-12">
              Please kindly let us know if you can join us <br className="hidden md:block" /> by November 13th, 2026.
            </p>
            <div className="flex justify-center pt-4">
              <Link to="/rsvp" className="btn-primary inline-flex">
                Kindly RSVP
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="pt-8 pb-32 text-center border-t border-border bg-background">
        <p className="label-uppercase mb-0">Lama & Álvaro · 2027</p>
      </footer>
    </div>
  );
}