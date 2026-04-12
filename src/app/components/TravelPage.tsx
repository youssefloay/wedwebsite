import { Link } from "react-router";
import { Plane, Car, MapPin, Compass, CheckCircle2, Globe, ShieldCheck, Zap, Clock, Banknote, ArrowRight, Home as HomeIcon, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export function TravelPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background text-primary-text font-serif">

      {/* 1. HERO - JOURNEY INTRO */}
      <section className="relative pt-10 pb-0 px-6 overflow-hidden section-layer-1 border-b border-border/10">
        {/* Arch Pattern Background - Identical to Home */}
        <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'url("/arch-pattern.png")', backgroundSize: '400px' }} />

        <div className="relative z-10 max-w-3xl mx-auto text-center reveal">
          <span className="label-uppercase mb-6 block">The Voyage</span>
          <h1 className="text-5xl md:text-7xl font-serif text-primary-text mb-8 leading-tight">Journey to Monda</h1>
          <p className="text-xl md:text-2xl font-serif text-secondary-text leading-relaxed italic max-w-2xl mx-auto px-4 opacity-80">
            "A scenic passage from the Mediterranean coast to the heart of the Andalusian hills."
          </p>
          <div className="w-16 h-px mx-auto my-10 bg-accent-terracotta" />
        </div>
      </section>

      {/* 2. THE MAP VISUAL */}
      <section className="px-6 pt-0 pb-24 relative z-10 section-layer-2 border-y border-border/10">
        <div className="max-w-4xl mx-auto reveal-scale">
          <div className="relative p-2 bg-white shadow-2xl rounded-sm transform rotate-1 border border-border/10 ring-8 ring-white/5 transition-transform duration-1000 hover:rotate-0 depth-overlay">
            <img
              src="/travel-map.png"
              alt="Andalusian Journey Map"
              className="w-full h-auto opacity-100 mix-blend-multiply img-grain"
            />
          </div>
          <p className="text-center mt-10 text-secondary-text font-serif italic text-base opacity-70">
            Winding through the heart of Andalusia, just around 40-45 mins from Málaga Airport.
          </p>
        </div>
      </section>

      {/* 3. THE ARRIVAL - MÁLAGA */}
      <section className="py-24 px-6 section-layer-1 border-b border-border/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-1 hidden lg:block" />

            <div className="lg:col-span-12 xl:col-span-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="relative order-2 lg:order-1 flex justify-center reveal">
                  <div className="stamp-visual transform rotate-2 max-w-[400px]">
                    <img
                      src="/malaga-coast.png"
                      alt="Málaga Coastline"
                      className="stamp-image"
                    />
                  </div>
                </div>

                <div className="order-1 lg:order-2">
                  <span className="label-uppercase mb-4 block">Part I: Arrival</span>
                  <h2 className="text-5xl md:text-6xl font-serif text-primary-text mb-8 italic leading-tight">
                    Arriving at the <br />
                    Gateway
                  </h2>
                  <p className="text-lg text-secondary-text leading-relaxed mb-8">
                    Your journey begins at <span className="text-primary-text font-medium">Málaga Airport</span>. We recommend arriving a day or two early to soak in the seaside atmosphere of the Costa del Sol before heading into the hills.
                  </p>

                  <div className="wedding-card bg-white/60 backdrop-blur-md border border-white/40 shadow-xl">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-accent-terracotta/10 rounded-full">
                        <Plane size={24} className="text-accent-terracotta" />
                      </div>
                      <div>
                        <h4 className="font-serif text-xl font-medium text-primary-text mb-2">Flight Connections</h4>
                        <p className="text-sm text-secondary-text leading-relaxed">
                          Direct flights connect Málaga to most major European hubs. The airport is just around 40-45 mins from our venue.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 hidden lg:block" />
          </div>
        </div>
      </section>

      {/* 4. THE ASCENT - TRANSFERS & CARS */}
      <section className="relative py-12 px-6 section-layer-2 overflow-hidden border-b border-border/10">
        <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'url("/arch-pattern.png")', backgroundSize: '400px' }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
            <div className="lg:col-span-1 hidden lg:block" />

            <div className="lg:col-span-5">
              <span className="label-uppercase mb-4 block">Part II: Ascent</span>
              <h2 className="text-5xl md:text-6xl font-serif text-primary-text mb-8 italic leading-tight">
                Into the <br />
                Rolling Hills
              </h2>
              <p className="text-lg text-secondary-text leading-relaxed mb-10">
                The drive to Monda is spectacular, winding through ancient olive groves. Whether you prefer a private transfer or the freedom of a rental car, the path is yours to choose.
              </p>

              <div className="space-y-6">
                <div className="wedding-card group hover:shadow-2xl transition-all duration-700 bg-white/40 border border-border/5">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="font-serif text-3xl text-primary-text italic">Private Transfers</h3>
                    <div className="p-2 bg-accent-terracotta/5 rounded-full"><Car size={24} className="text-accent-terracotta" /></div>
                  </div>
                  <div className="space-y-5 mb-10">
                    <div className="flex justify-between border-b border-border/50 pb-3">
                      <span className="text-primary-text font-serif text-lg">Executive Car</span>
                      <span className="font-serif text-xl text-primary-text">€95</span>
                    </div>
                    <div className="flex justify-between border-b border-border/50 pb-3">
                      <span className="text-primary-text font-serif text-lg">Private Van (7 guests)</span>
                      <span className="font-serif text-xl text-primary-text">€150–160</span>
                    </div>
                  </div>
                  <Link to="/rsvp" className="btn-primary w-full text-center py-4 transition-all hover:scale-[1.02] shadow-lg">
                    Coordinate Transfer
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link to="/rsvp" className="wedding-card !bg-transparent border-dashed border-border/40 hover:border-accent-terracotta/60 transition-all duration-300 group/card block">
                    <h3 className="font-serif text-xl text-primary-text mb-2 italic">Car Rental</h3>
                    <p className="text-[11px] text-secondary-text mb-4 leading-relaxed">Rentals available at Málaga Airport from €30/day. Please tell us your plans in the <span className="text-accent-terracotta underline">RSVP</span>.</p>
                    <div className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-accent-terracotta font-bold">
                      <Car size={14} className="group-hover/card:translate-x-1 transition-transform" /> Málaga Airport
                    </div>
                  </Link>

                  <div className="wedding-card !bg-transparent border-dashed border-border/40 group/card block">
                    <h3 className="font-serif text-xl text-primary-text mb-2 italic">Free Parking</h3>
                    <p className="text-[11px] text-secondary-text mb-4 leading-relaxed">Requested via RSVP. Self-service parking located at Calle Castillo.</p>
                    <div className="flex flex-col gap-3">
                      <a
                        href="https://maps.app.goo.gl/TyTof35JTLYVxBZj6?g_st=iw"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-accent-terracotta font-bold hover:translate-x-1 transition-all"
                      >
                        <MapPin size={14} /> Open Parking Map
                      </a>
                      <Link to="/rsvp" className="text-[9px] uppercase tracking-widest font-bold text-secondary-text opacity-50 hover:opacity-100 transition-all">
                        Request Spot via RSVP
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 hidden lg:block" />

            <div className="lg:col-span-4 relative">
              <div className="relative z-10 flex flex-col items-center">
                <div className="stamp-visual transform rotate-3 max-w-full">
                  <img
                    src="/travel-sketch.png"
                    alt="Andalusian Road Trip"
                    className="stamp-image"
                  />
                </div>

                {/* Enhancement: Scenic Route Tip */}
                <div className="mt-12 bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-accent-terracotta/10 max-w-xs -rotate-2 relative z-20">
                  <Compass className="text-accent-terracotta mb-4" size={24} />
                  <h4 className="font-serif text-xl text-primary-text mb-2">The Scenic Route</h4>
                  <p className="text-sm text-secondary-text italic leading-relaxed">
                    Make a stop at <span className="text-accent-terracotta font-bold">Mijas Pueblo</span> on your way. It's a stunning white village just 20 mins from the airport.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. VISA & ENTRY REQUIREMENTS */}
      <section id="visa" className="py-12 px-6 bg-card-background border-y border-border/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-1 hidden lg:block" />

            <div className="lg:col-span-1 hidden lg:block" />

            <div className="lg:col-span-10">
              <div className="max-w-2xl">
                <span className="label-uppercase mb-4 block">Part III: Entry</span>
                <h2 className="text-5xl md:text-6xl font-serif text-primary-text mb-8 italic leading-tight">
                  Visa & Entry <br />
                  Requirements
                </h2>
                <p className="text-lg text-secondary-text leading-relaxed mb-8">
                  Spain is part of the Schengen Area. We recommend all our international guests check their specific entry requirements well in advance.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="wedding-card bg-white/50 backdrop-blur-sm border-l-4 border-accent-terracotta">
                    <h4 className="font-serif text-xl text-primary-text mb-3 italic">For our Egyptian Guests</h4>
                    <p className="text-sm text-secondary-text leading-relaxed font-medium">
                      Please ensure you apply for your Schengen Visa at least <span className="text-primary-text font-bold">3–4 months</span> prior to the wedding. Appointment slots can be limited during peak seasons.
                    </p>
                  </div>

                  <div className="wedding-card bg-white/50 backdrop-blur-sm">
                    <h4 className="font-serif text-xl text-primary-text mb-3 italic">Hotel Documentation</h4>
                    <p className="text-sm text-secondary-text leading-relaxed font-medium">
                      If you are staying at the Castillo de Monda and require a formal booking confirmation or invitation letter for your visa application, please request this via the RSVP form or contact the hotel directly.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 hidden lg:block" />
          </div>
        </div>
      </section>

      {/* 6. TRAVELER'S POCKET GUIDE (ENHANCED) */}
      <section className="py-12 px-6 section-layer-3 font-sans">
        <div className="max-w-5xl mx-auto">
          {/* JOURNEY TIMELINE */}
          <div className="max-w-3xl mx-auto mb-8 relative">
            <div className="absolute top-[28px] left-[10%] right-[10%] h-px bg-accent-terracotta/20 hidden md:block" />
            <div className="flex justify-between items-start">
              {[
                { time: "Arrive", label: "Málaga Airport", icon: <Plane size={18} /> },
                { time: "Transport", label: "Collect Car", icon: <Car size={18} /> },
                { time: "40-45 min", label: "To Monda", icon: <ArrowRight size={18} /> },
                { time: "Arrive", label: "Welcome", icon: <HomeIcon size={18} /> }
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center px-2 z-10">
                  <div className="w-14 h-14 bg-white border border-accent-terracotta/20 rounded-full flex items-center justify-center text-accent-terracotta shadow-sm mb-3">
                    {step.icon}
                  </div>
                  <span className="text-[9px] uppercase tracking-widest text-accent-terracotta font-bold mb-0.5">{step.time}</span>
                  <span className="text-xs md:text-sm font-serif italic text-primary-text leading-tight">{step.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 bg-white rounded-[40px] shadow-2xl overflow-hidden border border-border/5">
            {/* Left: Journey Notes */}
            <div className="lg:col-span-2 p-12 md:p-16 border-r border-border/10">
              <span className="label-uppercase mb-4 block">Essentials</span>
              <h2 className="text-4xl md:text-5xl font-serif text-primary-text mb-12 italic">Journey Notes</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <h4 className="font-serif text-lg text-primary-text italic">Spring Climate</h4>
                  <p className="text-sm text-secondary-text leading-relaxed">Warm and pleasant, typically 20-25°C in April with soft Mediterranean breezes and cool evenings.</p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-serif text-lg text-primary-text italic">Early Arrival</h4>
                  <p className="text-sm text-secondary-text leading-relaxed">We recommend arriving a day early to settle in and explore the magical white village of Monda.</p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-serif text-lg text-primary-text italic">Digital Guide</h4>
                  <p className="text-sm text-secondary-text leading-relaxed mb-4">Set your compass to Castillo de Monda. Use these tools for your GPS or navigation app.</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText("36.6256, -4.7936");
                        setCopiedId('coords');
                        setTimeout(() => setCopiedId(null), 2000);
                      }}
                      className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-white border border-border/20 rounded-xl text-[10px] uppercase tracking-widest font-bold text-secondary-text hover:border-accent-terracotta transition-all shadow-sm"
                    >
                      {copiedId === 'coords' ? <Check size={14} /> : <Copy size={14} />}
                      {copiedId === 'coords' ? 'Copied' : 'Copy Coordinates'}
                    </button>
                    <a
                      href="https://maps.google.com/?q=Castillo+de+Monda"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-accent-terracotta text-white rounded-xl text-[10px] uppercase tracking-widest font-bold hover:opacity-90 transition-all shadow-md"
                    >
                      Venue Location <Compass size={14} />
                    </a>
                    <a
                      href="https://maps.app.goo.gl/TyTof35JTLYVxBZj6?g_st=iw"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-[#F5EFEB] text-accent-terracotta border border-accent-terracotta/20 rounded-xl text-[10px] uppercase tracking-widest font-bold hover:border-accent-terracotta transition-all shadow-sm"
                    >
                      Parking Map <MapPin size={14} />
                    </a>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-serif text-lg text-primary-text italic">Hotel Support</h4>
                  <p className="text-sm text-secondary-text leading-relaxed">The friendly staff at Castillo de Monda are available to assist with any questions regarding your stay.</p>
                </div>
              </div>
            </div>

            {/* Right: Checklist & Essentials */}
            <div className="p-12 md:p-16 bg-accent-beige/10 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-2xl text-primary-text mb-8 italic">Packing Tips</h3>
                <ul className="space-y-6 mb-12">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-accent-terracotta shrink-0 mt-0.5" />
                    <span className="text-sm text-secondary-text">Comfortable soles for cobblestones</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-accent-terracotta shrink-0 mt-0.5" />
                    <span className="text-sm text-secondary-text">A light layer for the evening breeze</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-accent-terracotta shrink-0 mt-0.5" />
                    <span className="text-sm text-secondary-text">Sun protection for the terrace</span>
                  </li>
                </ul>
              </div>

              {/* Essentials Dashboard */}
              <div className="pt-8 border-t border-accent-terracotta/20">
                <h4 className="label-uppercase mb-6 text-[10px]">Andalusian Essentials Dashboard</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="p-4 bg-white/40 rounded-2xl border border-white/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap size={16} strokeWidth={1.25} className="text-accent-terracotta" />
                      <span className="text-[9px] uppercase tracking-widest text-secondary-text">Power</span>
                    </div>
                    <span className="text-sm font-bold text-primary-text">Type F</span>
                  </div>
                  <div className="p-4 bg-white/40 rounded-2xl border border-white/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock size={16} strokeWidth={1.25} className="text-accent-terracotta" />
                      <span className="text-[9px] uppercase tracking-widest text-secondary-text">Time</span>
                    </div>
                    <span className="text-sm font-bold text-primary-text">CEST</span>
                  </div>
                  <div className="p-4 bg-white/40 rounded-2xl border border-white/50 col-span-2 md:col-span-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Banknote size={16} strokeWidth={1.25} className="text-accent-terracotta" />
                      <span className="text-[9px] uppercase tracking-widest text-secondary-text">Currency</span>
                    </div>
                    <span className="text-sm font-bold text-primary-text">Euros (€)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL RSVP CTA */}
      <section className="bg-background py-32 px-6 border-t border-border/10">
        <div className="max-w-2xl mx-auto text-center reveal">
          <span className="label-uppercase mb-6 block font-bold">The Next Step</span>
          <h2 className="text-4xl md:text-5xl font-serif text-primary-text mb-8 italic">Ready for the journey?</h2>
          <p className="text-xl text-secondary-text font-serif italic mb-12 opacity-80 leading-relaxed">
            "Once you’ve mapped your way, kindly secure your place at our table and coordinate your arrival in the quiet beauty of Monda."
          </p>
          <Link to="/rsvp" className="btn-primary inline-flex shadow-xl">
             RSVP & Coordinate
          </Link>
        </div>
      </section>

    </div>
  );
}