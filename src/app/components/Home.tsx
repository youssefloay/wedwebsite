import { Link } from "react-router";
import { useState, useEffect } from "react";
import { DoorEntrance } from './DoorEntrance';
import { Navigation } from './Navigation';

export function Home() {
  const [daysUntil, setDaysUntil] = useState(0);
  const [hoursUntil, setHoursUntil] = useState(0);
  const [minutesUntil, setMinutesUntil] = useState(0);
  const [showContent, setShowContent] = useState(false);

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
    setShowContent(true);
  };

  if (!showContent) {
    return <DoorEntrance onEnter={handleEnter} />;
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* 1. HERO SECTION (UPDATED WITH ILLUSTRATED BACKGROUND) */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-background">
        {/* New Illustrated Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-bg.png"
            alt="Andalusian Arch background"
            className="w-full h-full object-cover opacity-90"
          />
          {/* Very subtle overlay to ensure text legibility while preserving the background's beauty */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/5 via-transparent to-background/5 backdrop-blur-[0.5px]" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-2xl mx-auto flex flex-col items-center">
          {/* Bismillah Calligraphy - Updated to the precise requested image directly on the hero background */}
          <div className="mb-0 w-64 md:w-80 opacity-90 transition-opacity duration-1000 flex justify-center">
            <img
              src="/bismillah.png"
              alt="Bismillah"
              className="w-full h-auto object-contain"
            />
          </div>

          <p className="label-uppercase tracking-[0.25em] text-[#4A3A2A]/80 font-bold -mt-22 mb-5 text-xs md:text-sm">
            En el nombre de Dios
          </p>

          <div className="space-y-3 mb-6">
            <p className="font-script text-base md:text-lg text-secondary-text opacity-100 font-bold ">You are invited to celebrate the wedding of</p>
          </div>

          {/* Names Layout */}
          <div className="flex flex-col items-center gap-4 mb-2 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h1 className="flex flex-col items-center font-cinzel text-primary-text tracking-[0.05em] leading-[1.1]">
              <span className="text-4xl md:text-6xl uppercase">Lama</span>
              <span className="text-2xl md:text-4xl uppercase">Loay</span>
            </h1>

            <div className="flex items-center gap-6 my-4">
              <div className="w-16 h-px bg-border/40" />
              <span className="font-serif text-3xl italic opacity-50">&</span>
              <div className="w-16 h-px bg-border/40" />
            </div>

            <h1 className="flex flex-col items-center font-cinzel text-primary-text tracking-[0.05em] leading-[1.1]">
              <span className="text-4xl md:text-6xl uppercase">Alvaro</span>
              <span className="text-2xl md:text-4xl uppercase">Recas</span>
            </h1>
          </div>

          <div className="w-12 h-px bg-accent-terracotta/30 mt-3 mb-6" />

          <h2 className="text-xl md:text-xl font-script mb-8 text-primary-text">
            17 April 2027
          </h2>

          {/* Minimal Countdown - Moved Higher and Enlarged */}
          <div className="flex justify-center gap-10 text-sm uppercase tracking-[0.2em] text-[#4A3A2A]/50 mb-4 scale-110">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-serif text-primary-text/80 mb-1">{daysUntil}</div>
              <div className="text-[9px] opacity-100 font-bold">Days</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-serif text-primary-text/80 mb-1">{hoursUntil}</div>
              <div className="text-[9px] opacity-100 font-bold">Hrs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-serif text-primary-text/80 mb-1">{minutesUntil}</div>
              <div className="text-[9px] opacity-100 font-bold">Min</div>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xl md:text-3xl font-serif text-primary-text tracking-wide">
              Castillo de Monda
            </p>
            <p className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-secondary-text opacity-100 leading-relaxed font-medium mb-20">
              De La Villeta 6, 29110 Monda, Spain
            </p>
          </div>
        </div>
      </section>

      {/* 2. OUR STORY SECTION */}
      <section id="story" className="section-container">
        <div className="text-center mb-16">
          <span className="label-uppercase">Our Story</span>
          <h2 className="title-section">A journey between two worlds</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <div className="wedding-card p-0 overflow-hidden shadow-xl">
              <img
                src="/story-photo.jpg"
                alt="Lama & Álvaro"
                className="w-full h-auto object-cover aspect-[4/5]"
              />
            </div>
          </div>
          <div className="order-1 md:order-2 space-y-8">
            <p className="text-lg leading-relaxed">
              Surrounded by nature, light, and history, we have chosen a place that feels like a meeting point between our worlds.
            </p>
            <p className="text-lg leading-relaxed">
              It is a celebration of the warmth of Spanish heritage intertwined with the timeless beauty of Arab culture.
            </p>
            <div className="pt-4 italic font-serif text-xl border-t border-border">
              "Where two cultures, two families, and two hearts become one."
            </div>
          </div>
        </div>
      </section>

      <section className="bg-card-background py-20 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* TEXT COLUMN & MOBILE IMAGE */}
            <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left">
              <span className="label-uppercase">The Venue</span>
              <h2 className="text-5xl md:text-6xl font-serif text-primary-text leading-tight mb-4">Castillo de Monda</h2>
              <div className="w-16 h-px bg-accent-terracotta mb-8" />
              
              {/* Image for Mobile Only - Placed right after the line */}
              <div className="w-full max-w-sm lg:hidden mb-10">
                <img 
                  src="/venue-hero.png" 
                  alt="Castillo de Monda" 
                  className="w-full h-auto max-h-[280px] object-contain mx-auto"
                />
              </div>

              <div className="space-y-6">
                <p className="text-xl font-serif italic text-secondary-text leading-relaxed">
                  Nestled in the Andalusian hills, where ancient stone whispers stories of the past and the air carries the scent of orange blossoms.
                </p>
                <p className="text-lg text-secondary-text">
                  Monda, Málaga, Andalusia
                </p>
                <div className="pt-6">
                  <a 
                    href="https://maps.google.com/?q=Castillo+de+Monda" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-secondary"
                  >
                    View Location
                  </a>
                </div>
              </div>
            </div>

            {/* IMAGE COLUMN (DESKTOP ONLY) */}
            <div className="lg:col-span-6 hidden lg:flex justify-end">
              <img 
                src="/venue-hero.png" 
                alt="Castillo de Monda" 
                className="w-full max-h-[450px] object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE SCHEDULE SECTION */}
      <section className="section-container">
        <div className="text-center mb-20">
          <span className="label-uppercase">The Celebration</span>
          <h2 className="title-section">Saturday, 17 April 2027</h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-2">
          {[
            { time: "16:00", event: "The Arrival", description: "Welcome refreshments at the terrace" },
            { time: "17:00", event: "The Ceremony", description: "A union of two cultures" },
            { time: "18:00", event: "Cocktail", description: "Andalusian tapas & spirits" },
            { time: "20:00", event: "Dinner", description: "A feast under the stars" },
            { time: "22:00", event: "The Party", description: "Music and dance until late" },
          ].map((item, idx) => (
            <div key={idx} className="wedding-card mb-4 flex items-center justify-between group hover:border-accent-terracotta">
              <div className="flex items-center gap-8">
                <div className="text-2xl font-serif text-accent-terracotta w-20">{item.time}</div>
                <div>
                  <h3 className="text-xl font-serif text-primary-text mb-1">{item.event}</h3>
                  <p className="text-sm text-secondary-text m-0">{item.description}</p>
                </div>
              </div>
              <div className="h-12 w-px bg-border group-hover:bg-accent-terracotta transition-colors" />
            </div>
          ))}
        </div>
      </section>

      {/* 5. DRESS CODE SECTION */}
      <section className="bg-card-background section-container">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="label-uppercase">Dress Code</span>
          <h2 className="title-section">Shades of Andalusia</h2>
          <p className="text-lg leading-relaxed mt-4">
            We invite you to wear soft, elegant shades inspired by the local landscape: neutrals, earthy tones, olive greens, and muted terracotta.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {[
            { color: "#F5F1EA", name: "Neutral" },
            { color: "#A08F7A", name: "Beige" },
            { color: "#6F7F6C", name: "Olive" },
            { color: "#C98A5A", name: "Terracotta" },
            { color: "#8B9DAF", name: "Dusty Blue" },
          ].map((c, i) => (
            <div key={i} className="text-center group">
              <div
                className="w-20 h-20 md:w-24 md:h-24 rounded-full mb-3 border-4 border-white shadow-lg transition-transform group-hover:scale-110"
                style={{ backgroundColor: c.color }}
              />
              <span className="text-xs uppercase tracking-widest text-secondary-text">{c.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 6. RSVP FINAL SECTION */}
      <section className="section-container text-center">
        <div className="wedding-card py-20 bg-background border-accent-terracotta/20">
          <h2 className="title-section mb-10 max-w-xl mx-auto">We would love to celebrate with you</h2>
          <p className="text-lg mb-12 max-w-lg mx-auto">
            Please kindly let us know if you can join us by November 13th, 2026.
          </p>
          <Link to="/rsvp" className="btn-primary">
            Kindly RSVP
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 text-center border-t border-border bg-background">
        <p className="label-uppercase mb-0">Lama & Álvaro · 2027</p>
      </footer>
    </div>
  );
}