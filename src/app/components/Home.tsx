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

        {/* CONTENT REVEAL SEQUENCE */}
        <motion.div 
          className="container relative z-10 px-6 max-w-5xl mx-auto flex flex-col items-center justify-center text-center"
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
          {/* BISMILLAH / BLESSING */}
          <motion.div 
            className="mb-14 flex flex-col items-center"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { 
                opacity: 1, 
                y: 0, 
                transition: { duration: 1.2, ease: "easeOut" } 
              }
            }}
          >
            <div className="reveal-scale active mb-0 w-64 md:w-80 flex justify-center">
              <img 
                src="/bismillah.png" 
                alt="Bismillah" 
                className="w-full h-auto object-contain hover:scale-[1.02] transition-transform duration-1000"
              />
            </div>
            <p className="font-cinzel text-[10px] md:text-[11px] tracking-[0.6em] text-secondary-text -mt-16 mb-10 uppercase font-bold">
              En el nombre de Dios
            </p>
            <p className="font-script text-xl md:text-2xl text-secondary-text mb-12 max-w-xs md:max-w-md italic">
              You are invited to celebrate the wedding of
            </p>
          </motion.div>

          {/* THE NAMES */}
          <motion.div 
            className="flex flex-col items-center"
            variants={{
              hidden: { opacity: 0, scale: 0.98, y: 30 },
              visible: { 
                opacity: 1, 
                scale: 1, 
                y: 0, 
                transition: { duration: 1.5, ease: [0.19, 1, 0.22, 1] } 
              }
            }}
          >
            <div className="flex flex-col items-center gap-4 mb-2">
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
          </motion.div>

          {/* DATES & COUNTDOWN */}
          <motion.div 
            className="w-full flex flex-col items-center mt-12"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { 
                opacity: 1, 
                y: 0, 
                transition: { duration: 1, ease: "easeOut" } 
              }
            }}
          >
            <div className="w-16 h-px bg-accent-terracotta mt-8 mb-10" />

            <h2 className="script-accent text-3xl md:text-4xl mb-12 text-primary-text">
              17 April 2027
            </h2>

            <div className="flex justify-center gap-12 mb-10 scale-110">
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

            <div className="space-y-2 mb-10">
              <p className="text-xl md:text-3xl font-serif text-primary-text tracking-wide">
                Castillo de Monda
              </p>
              <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-secondary-text opacity-100 leading-relaxed font-bold mb-10">
                De La Villeta 6, 29110 Monda, Spain
              </p>
            </div>

            <Link 
              to="/rsvp" 
              className="btn-primary inline-flex"
            >
              Begin your RSVP
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. OUR STORY SECTION */}
      <motion.section 
        id="story" 
        className="section-layer-2"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1,
            transition: { staggerChildren: 0.3 }
          }
        }}
      >
        <div className="section-container">
          <motion.div 
            className="text-center mb-16 flex flex-col items-center"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 1 } }
            }}
          >
            <span className="label-uppercase">Our Story</span>
            <h2 className="text-5xl md:text-6xl font-serif text-primary-text leading-[1.1] mb-6 max-w-3xl">
              A journey between <br className="hidden md:block" /> two worlds
            </h2>
            <div className="w-16 h-px bg-accent-terracotta" />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div 
              className="order-2 lg:order-1 -mx-6 md:mx-0 overflow-hidden shadow-2xl lg:w-full rounded-2xl depth-overlay"
              variants={{
                hidden: { opacity: 0, x: -50, scale: 1.05 },
                visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 1.2, ease: "easeOut" } }
              }}
            >
              <img
                src="/story-photo.jpg"
                alt="Lama & Álvaro"
                className="w-full h-auto object-cover max-h-[700px] lg:aspect-[4/5] lg:max-h-none img-grain"
              />
            </motion.div>

            <motion.div 
              className="order-1 lg:order-2 space-y-12 lg:text-left text-center flex flex-col items-center lg:items-start"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 1, delay: 0.2 } }
              }}
            >
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
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* 3. THE VENUE SECTION */}
      <motion.section 
        id="venue" 
        className="section-layer-1"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1,
            transition: { staggerChildren: 0.3 }
          }
        }}
      >
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-24">
            <motion.div 
              className="space-y-10 order-2 lg:order-1"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 1 } }
              }}
            >
              <div className="space-y-4">
                <span className="label-uppercase">The Setting</span>
                <h2 className="text-5xl md:text-6xl font-serif text-primary-text leading-tight">
                  Castillo de Monda
                </h2>
              </div>
              <p className="text-secondary-text leading-relaxed text-lg max-w-xl">
                Nestled in the heart of the Sierra de las Nieves, this historic fortress tells a story of centuries. Its whitewashed walls and stone passages will be the backdrop of our celebration.
              </p>
              <div className="pt-2">
                <Link to="/travel" className="btn-primary inline-flex">
                  Explore the area
                </Link>
              </div>
            </motion.div>

            <motion.div 
              className="relative order-1 lg:order-2"
              variants={{
                hidden: { opacity: 0, scale: 0.95, y: 40 },
                visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 1.5, ease: [0.19, 1, 0.22, 1] } }
              }}
            >
              <div className="aspect-[4/5] md:aspect-square rounded-3xl overflow-hidden shadow-2xl relative">
                <img
                  src="/venue-hero.jpg"
                  alt="Castillo de Monda"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-background p-8 rounded-2xl shadow-xl hidden md:block max-w-[200px] border border-accent-beige/20">
                <span className="font-serif italic text-accent-terracotta text-lg block mb-1">“Historic Elegance”</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-secondary-text font-bold">Sierra de las Nieves</span>
              </div>
            </motion.div>
          </div>

          {/* MAP / DESTINATION SECTION */}
          <motion.div 
            className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[500px] flex items-center justify-center text-center p-12 group"
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0, transition: { duration: 1.2 } }
            }}
          >
            <motion.div 
              className="absolute inset-0 z-0 scale-110"
              initial={{ scale: 1.15, filter: "brightness(0.8)" }}
              whileInView={{ scale: 1, filter: "brightness(0.65)" }}
              transition={{ duration: 10, ease: "linear" }}
              viewport={{ once: false }}
            >
              <img
                src="/andalusia-bg.jpg"
                alt="Andalusia landscape"
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            <motion.div 
              className="relative z-10 max-w-2xl"
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1, transition: { duration: 1, delay: 0.5 } }
              }}
            >
              <span className="label-uppercase text-white/80">The Destination</span>
              <h3 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-8 leading-tight">
                A weekend in <br /> Andalusia
              </h3>
              <p className="text-white/80 text-lg md:text-xl mb-12 max-w-xl mx-auto leading-relaxed italic font-serif">
                Join us for a celebration across three days of culture, connection, and the white villages of Malaga.
              </p>
              <Link to="/travel" className="btn-primary-white">
                View Schedule & Travel
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* 4. DRESS CODE SECTION */}
      <motion.section 
        id="dress-code" 
        className="section-layer-1 px-6 pt-12 pb-32 relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1,
            transition: { staggerChildren: 0.2 }
          }
        }}
      >
        <motion.div 
          className="text-center mb-16 flex flex-col items-center"
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 1 } }
          }}
        >
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
          {[
            { img: "/dress_code_beige.png", label: "Linen & Beige" },
            { img: "/dress_code_olive.png", label: "Olive & Sage" },
            { img: "/dress_code_terracotta.png", label: "Terracotta & Ochre" },
            { img: "/dress_code_blue.png", label: "Dusty Blue & Slate" }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              className="flex flex-col items-center group"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: idx * 0.1 } }
              }}
            >
              <div className="relative overflow-hidden rounded-3xl mb-4 shadow-sm border border-border/10 aspect-[3/4] transition-all duration-700 group-hover:shadow-xl group-hover:-translate-y-2">
                <img src={item.img} alt={item.label} className="w-full h-full object-cover transition-all duration-700" />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
              <span className="label-uppercase text-xs tracking-[0.2em] font-bold">{item.label}</span>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-24 text-center"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 1 } }
          }}
        >
          <p className="text-secondary-text font-serif italic mb-10 text-xl max-w-lg mx-auto leading-relaxed">Planning your attire? <br /> Tell us you're coming first.</p>
          <Link to="/rsvp" className="btn-primary inline-flex shadow-xl">
             RSVP to the Wedding
          </Link>
        </motion.div>
      </motion.section>

      {/* 4. CELEBRATION SECTION */}
      <motion.section 
        id="schedule" 
        className="section-layer-3 py-32 px-6 border-y border-border/10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1,
            transition: { staggerChildren: 0.3 }
          }
        }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-20 flex flex-col items-center"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 1 } }
            }}
          >
            <span className="label-uppercase">The Celebration</span>
            <h2 className="text-5xl md:text-6xl font-serif text-primary-text mb-6 italic">Wedding Schedule</h2>
            <div className="w-16 h-px bg-accent-terracotta" />
            <p className="mt-8 text-secondary-text font-serif italic max-w-none mx-auto w-full whitespace-nowrap text-lg md:text-xl">Saturday, 17th April 2027</p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent-beige/40 to-transparent hidden md:block" />
            
            <div className="space-y-24">
              {[
                { time: "16:00", title: "The Ceremony", desc: "Gathering at the historic chapel gardens for our exchange of vows.", img: "/ceremony.png", rotate: "rotate-2" },
                { time: "17:30", title: "Sunset Cocktails", desc: "Hors d'oeuvres and signature drinks on the Mediterranean terrace.", img: "/cocktail_sketch.png", rotate: "-rotate-1", reverse: true },
                { time: "19:30", title: "Wedding Banquet", desc: "A grand dinner celebration featuring local Andalusian delicacies.", img: "/dinner.png", rotate: "rotate-1" },
                { time: "23:00", title: "The Party", desc: "Dancing and celebration into the early hours with our live DJ.", img: "/party.png", rotate: "-rotate-2", reverse: true }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  className={`relative grid grid-cols-1 md:grid-cols-2 gap-12 items-center`}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0, transition: { duration: 1 } }
                  }}
                >
                  <div className={`${item.reverse ? 'order-1 md:order-2' : 'md:text-right'}`}>
                    <span className="font-cinzel text-accent-terracotta tracking-[0.3em] font-bold">{item.time}</span>
                    <h3 className="text-3xl font-serif text-primary-text mt-2 mb-4">{item.title}</h3>
                    <p className={`text-secondary-text leading-relaxed max-w-xs ${item.reverse ? '' : 'md:ml-auto'}`}>{item.desc}</p>
                  </div>
                  <div className={`relative group max-w-[300px] mx-auto cursor-pointer ${item.reverse ? 'order-2 md:order-1' : ''}`}>
                    <div className="absolute inset-0 bg-accent-terracotta/10 rounded-full blur-2xl transform scale-0 group-hover:scale-100 transition-transform duration-700 opacity-50" />
                    <div className={`stamp-visual transform ${item.rotate} relative z-10 transition-transform duration-700 group-hover:scale-105`}>
                      <img src={item.img} alt={item.title} className="stamp-image" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section 
        id="rsvp" 
        className="section-layer-2 py-32 px-6 border-t border-border/10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0, transition: { duration: 1 } }
        }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="text-center">
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
      </motion.section>

      <footer className="pt-8 pb-32 text-center border-t border-border bg-background">
        <p className="label-uppercase mb-0">Lama & Álvaro · 2027</p>
      </footer>
    </div>
  );
}