import { Link, useSearchParams } from "react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { VideoEntrance } from './VideoEntrance';

export function Home() {
  const [searchParams] = useSearchParams();
  const isForced = searchParams.get('force') === 'true';
  const shouldSkip = !isForced && (searchParams.get('skip') === 'true' || sessionStorage.getItem('entered') === 'true');

  const [daysUntil, setDaysUntil] = useState(0);
  const [hoursUntil, setHoursUntil] = useState(0);
  const [minutesUntil, setMinutesUntil] = useState(0);
  const [justFinishedVideo, setJustFinishedVideo] = useState(false);
  const [showContent, setShowContent] = useState(shouldSkip);

  useEffect(() => {
    if (isForced) {
      setShowContent(false);
      setJustFinishedVideo(false);
    } else if (shouldSkip) {
      setShowContent(true);
    }
  }, [isForced, shouldSkip]);

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
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-background">
        {/* CINEMATIC BACKGROUND REVEAL (BOTTOM-UP) */}
        <motion.div 
          className="absolute inset-0 z-0"
          initial={{ y: 80, opacity: 0, scale: 1.05 }}
          animate={{ y: 0, opacity: 0.6, scale: 1 }}
          transition={{ 
            duration: 2, 
            ease: [0.22, 1, 0.36, 1],
            delay: shouldSkip ? 0 : 1 
          }}
        >
          <img 
            src="/hero-bg.png" 
            alt="Andalusian Arch background" 
            className="w-full h-full object-cover object-bottom"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-transparent to-background/5" />
        </motion.div>

        {/* CONTENT REVEAL SEQUENCE - VERTICAL MONUMENT LAYOUT */}
        <motion.div 
          className="container relative z-10 px-6 max-w-5xl mx-auto h-[90vh] flex flex-col justify-between text-center"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { 
              opacity: 1,
              transition: { 
                staggerChildren: 0.5,
                delayChildren: shouldSkip ? 0 : 1.5
              } 
            }
          }}
        >
          {/* TOP: BISMILLAH / BLESSING */}
          <motion.div 
            className="flex flex-col items-center"
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: "easeOut" } }
            }}
          >
            <div className="reveal-scale active mb-0 w-48 md:w-64 flex justify-center opacity-80">
              <img 
                src="/bismillah.png" 
                alt="Bismillah" 
                className="w-full h-auto object-contain"
              />
            </div>
            <p className="font-cinzel text-[9px] md:text-[10px] tracking-[0.5em] text-accent-beige -mt-12 md:-mt-14 uppercase font-bold opacity-80">
              En el nombre de Dios
            </p>
          </motion.div>

          {/* CENTER: THE NAMES (PILLAR) */}
          <motion.div 
            className="flex flex-col items-center py-6 md:py-10"
            variants={{
              hidden: { opacity: 0, scale: 0.98 },
              visible: { opacity: 1, scale: 1, transition: { duration: 1.5, ease: [0.19, 1, 0.22, 1] } }
            }}
          >
            <h1 className="flex flex-col items-center font-serif text-primary-text leading-[0.9] gap-4">
              <div className="flex flex-col items-center">
                <span className="text-5xl md:text-8xl lg:text-9xl uppercase tracking-[0.2em]">Lama</span>
                <span className="text-base md:text-3xl lg:text-4xl mt-2 uppercase tracking-[0.5em] opacity-60 font-cinzel">Loay</span>
              </div>
              
              <div className="my-4 md:my-8 flex items-center justify-center w-full">
                <span className="script-accent text-3xl md:text-5xl mx-6 opacity-40 italic">&</span>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-5xl md:text-8xl lg:text-9xl uppercase tracking-[0.2em]">Álvaro</span>
                <span className="text-base md:text-3xl lg:text-4xl mt-2 uppercase tracking-[0.5em] opacity-60 font-cinzel">Recas</span>
              </div>
            </h1>
          </motion.div>

          {/* BOTTOM: THE PROMISE (DATES & COUNTDOWN) */}
          <motion.div 
            className="w-full flex flex-col items-center"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: "easeOut" } }
            }}
          >
            <div className="mb-6 md:mb-12">
              <h2 className="text-lg md:text-3xl font-serif text-primary-text tracking-[0.3em] uppercase mb-2">
                17 April 2027
              </h2>
              <p className="font-cinzel text-[9px] md:text-[11px] tracking-[0.2em] text-accent-beige uppercase font-bold opacity-80">
                Castillo de Monda • Andalusia, Spain
              </p>
            </div>

            <div className="flex justify-center gap-8 md:gap-16 mb-6 md:mb-12 pt-8 w-full max-w-sm">
              <div className="flex flex-col items-center">
                <span className="text-3xl md:text-5xl font-serif text-primary-text mb-1">{daysUntil}</span>
                <span className="font-cinzel text-[8px] md:text-[10px] tracking-widest text-secondary-text font-bold">DAYS</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl md:text-5xl font-serif text-primary-text mb-1">{hoursUntil}</span>
                <span className="font-cinzel text-[8px] md:text-[10px] tracking-widest text-secondary-text font-bold">HRS</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl md:text-5xl font-serif text-primary-text mb-1">{minutesUntil}</span>
                <span className="font-cinzel text-[8px] md:text-[10px] tracking-widest text-secondary-text font-bold">MIN</span>
              </div>
            </div>

            <Link 
              to="/rsvp" 
              className="btn-primary inline-flex scale-90 md:scale-100"
            >
              Begin your RSVP
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. OUR STORY SECTION */}
      <section id="story" className="section-layer-2 border-t border-border/10">
        <div className="section-container">
          <div className="text-center mb-16 flex flex-col items-center reveal">
            <span className="label-uppercase">Our Story</span>
            <h2 className="text-4xl md:text-5xl font-serif text-primary-text mb-6 italic">
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
      <section id="dress-code" className="section-layer-1 px-6 pt-12 pb-32 relative border-t border-border/10">
        <div className="text-center mb-16 flex flex-col items-center">
          <span className="label-uppercase">Dress Code</span>
          <h2 className="text-4xl md:text-5xl font-serif text-primary-text mb-6 italic">Black Tie & Color</h2>
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
            <h2 className="text-4xl md:text-5xl font-serif text-primary-text mb-6 italic">Wedding Schedule</h2>
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
            <h2 className="text-4xl md:text-5xl font-serif text-primary-text mb-8 italic">Join Our Story</h2>
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

    </div>
  );
}