import { Link } from "react-router";
import { ChevronDown, ShieldCheck, Zap, Clock, Globe, MapPin, Coffee, Sun, Palmtree } from 'lucide-react';

export function FaqPage() {
  const faqs = [
    { 
      q: "What is the exact location of the wedding?", 
      a: "Our celebration takes place at the Castillo de Monda, a historic fortress nestled in the Andalusian hills. The address is Calle de la Villeta 6, 29110 Monda, Spain. It is approximately 45 minutes by car from Málaga." 
    },
    { 
      q: "What does 'Elegant Attire in Color' mean?", 
      a: "We invite our guests to dress in an elegant and festive style, inspired by the vibrant spirit of Spain and a palette of warm, earthy tones. Think formal or cocktail attire - refined, polished, and comfortable (Men: suits or dressy shirts with trousers; Women: elegant dresses or chic jumpsuits). We kindly ask you to avoid wearing all-black or dark navy." 
    },
    { 
      q: "How do I reach Monda from Málaga?", 
      a: "Monda is accessible by car. We recommend either renting a car for the most flexibility during your stay or indicating on your RSVP that you would like help with an assisted transfer from Málaga Airport or the city center." 
    },
    { 
      q: "Is there a deadline for the RSVP?", 
      a: "Yes, we kindly ask all guests to finalize their attendance and logistics (including accommodation and transfers) via the online RSVP form by November 13th, 2026." 
    },
    { 
      q: "Will you provide visa support letters?", 
      a: "Absolutely. For our Egyptian guests or anyone requiring a Schengen visa, you can request a formal invitation and hotel confirmation letter directly through the RSVP process. We recommend applying 3-4 months in advance." 
    },
    { 
      q: "Is there parking at the venue?", 
      a: "Yes, limited parking is available at the Castillo de Monda. For those staying in the village or using our assisted transfers, shuttle options will be coordinated." 
    },
    { 
      q: "What will the weather be like?", 
      a: "April in Monda is typically beautiful and mild, with temperatures between 20-25°C. However, it can get cooler in the evenings, so we recommend a light layer for the outdoor portions of the celebration." 
    }
  ];

  return (
    <div className="min-h-screen bg-background text-primary-text font-serif">

      {/* HERO SECTION */}
      <section className="relative pt-10 pb-0 px-6 overflow-hidden text-center section-layer-1 border-b border-border/10">
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("/arch-pattern.png")', backgroundSize: '400px' }} />
        
        <div className="max-w-3xl mx-auto relative z-10 reveal">
          <span className="label-uppercase mb-6 block">Information Hub</span>
          <h1 className="text-5xl md:text-7xl font-serif text-primary-text mb-8 leading-tight">The Journal</h1>
          <p className="text-xl md:text-2xl font-serif text-secondary-text italic leading-relaxed max-w-2xl mx-auto px-4 opacity-80">
            "Everything you need to know for our weekend in Monda, from travel logistics to dress code details."
          </p>
          <p className="text-sm uppercase tracking-[0.3em] font-bold text-accent-terracotta mt-6 animate-pulse">
            Kindly RSVP by November 13th, 2026
          </p>
          <div className="w-16 h-px mx-auto my-10 bg-accent-terracotta" />
        </div>
      </section>

      {/* FAQ ACCORDION SECTION */}
      <section className="pt-0 pb-24 px-6 section-layer-2 border-y border-border/10">
        <div className="max-w-3xl mx-auto reveal-scale">
          <div className="space-y-4">
            {faqs.map((item, idx) => (
              <details key={idx} className="group wedding-card !p-0 bg-white/40 backdrop-blur-sm border border-border/10 overflow-hidden transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
                <summary className="flex items-center justify-between cursor-pointer list-none p-8 md:p-10 outline-none select-none">
                  <span className="font-serif italic text-2xl md:text-3xl text-primary-text group-hover:text-accent-terracotta transition-colors leading-tight">
                    {item.q}
                  </span>
                  <div className="ml-6 flex-shrink-0 w-10 h-10 rounded-full border border-accent-terracotta/20 flex items-center justify-center text-accent-terracotta group-open:bg-accent-terracotta group-open:text-white transition-all duration-500">
                    <ChevronDown size={20} className="transition-transform duration-500 group-open:rotate-180" />
                  </div>
                </summary>
                <div className="px-8 md:px-10 pb-12 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="w-12 h-px bg-accent-terracotta mb-8" />
                  <p className="text-lg md:text-xl text-secondary-text font-serif italic leading-relaxed opacity-90 max-w-2xl">
                    {item.a}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>


      {/* QUICK ESSENTIALS GRID */}
      <section className="py-32 px-6 section-layer-3">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20 reveal">
             <span className="label-uppercase mb-4 block">Essentials</span>
             <h2 className="text-4xl md:text-5xl font-serif text-primary-text italic">Travel At A Glance</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 reveal">
            {[
              { label: 'Time Zone', val: 'CEST', icon: <Clock size={24} /> },
              { label: 'Currency', val: 'Euro (€)', icon: <Globe size={24} /> },
              { label: 'Power', val: 'Type F', icon: <Zap size={24} /> },
              { label: 'Health', val: 'EU Coverage', icon: <ShieldCheck size={24} /> }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center p-8 bg-white/50 backdrop-blur-md rounded-[40px] border border-white/60 shadow-xl transition-transform hover:scale-105 duration-500">
                <div className="p-4 bg-accent-terracotta/5 rounded-full text-accent-terracotta mb-6">
                  {item.icon}
                </div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-accent-beige font-bold mb-2">{item.label}</span>
                <span className="text-xl font-serif italic text-primary-text">{item.val}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL RSVP CTA */}
      <section className="section-layer-1 py-32 px-6 border-t border-border/10">
        <div className="max-w-2xl mx-auto text-center reveal">
          <span className="label-uppercase mb-6 block font-bold">Primary Action</span>
          <h2 className="text-4xl md:text-5xl font-serif text-primary-text mb-8 italic">Ready to RSVP?</h2>
          <p className="text-xl text-secondary-text font-serif italic mb-12 opacity-80 leading-relaxed">
            "Once you have explored our story and details, kindly finalize your plans by submitting your formal response."
          </p>
          <Link to="/rsvp" className="btn-primary inline-flex shadow-xl">
             Go to RSVP
          </Link>
        </div>
      </section>

      {/* PACKING ESSENTIALS */}
      <section className="py-16 md:py-24 px-6 bg-[#515C4C] border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 reveal">
            <span className="label-uppercase mb-4 block text-white/60">The Checklist</span>
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4 italic">Packing For Monda</h2>
            <div className="w-12 h-px bg-white/20 mx-auto mb-6" />
            <p className="text-base text-white/70 font-serif italic max-w-xl mx-auto">
              "To ensure your comfort as we celebrate, we recommend a few essentials tailored for the Andalusian terrain."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
            {[
              { 
                title: "Cobblestone-Ready Shoes", 
                desc: "The whitewashed streets of Monda are as ancient as they are charming. We suggest block heels or wedges over stilettos for navigating the village paths.",
                icon: <MapPin size={22} />
              },
              { 
                title: "Evening Layers", 
                desc: "The hills of Andalusia can be deceptive; while afternoons are sun-drenched, the air can turn crisp once the sun dips behind the Castle.",
                icon: <Sun size={22} />
              },
              { 
                title: "EU Power Adapters", 
                desc: "Spain uses Type F (Schuko) and Type C sockets. For our international guests, ensure you bring a standard European two-pin adapter.",
                icon: <Zap size={22} />
              },
              { 
                title: "Sun Protection", 
                desc: "Even in mid-April, the Spanish sun is generous. A light sunscreen and your favorite pair of sunglasses will be your best companions.",
                icon: <Sun size={22} />
              }
            ].map((item, i) => (
              <div 
                key={i} 
                className={`relative flex gap-6 p-6 bg-[#FDFBF7] border border-dashed border-accent-terracotta/20 rounded-sm shadow-md transition-all duration-700 ${
                  i % 2 === 0 ? '-rotate-1' : 'rotate-1'
                }`}
              >
                {/* Vintage Pin Effect */}
                <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-accent-terracotta/20 border border-accent-terracotta/30" />
                
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent-terracotta/5 border border-accent-terracotta/10 flex items-center justify-center text-accent-terracotta">
                  {item.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl md:text-2xl font-serif text-primary-text italic leading-tight">{item.title}</h3>
                  <p className="text-base text-secondary-text font-serif italic leading-relaxed opacity-70">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL RSVP CTA */}
      <section className="section-layer-1 py-32 px-6 border-t border-border/10">
        <div className="max-w-2xl mx-auto text-center reveal">
          <span className="label-uppercase mb-6 block font-bold">Primary Action</span>
          <h2 className="text-4xl md:text-5xl font-serif text-primary-text mb-8 italic">Ready to RSVP?</h2>
          <p className="text-xl text-secondary-text font-serif italic mb-12 opacity-80 leading-relaxed">
            "Once you have explored our story and details, kindly finalize your plans by submitting your formal response."
          </p>
          <Link to="/rsvp" className="btn-primary inline-flex shadow-xl">
             Go to RSVP
          </Link>
        </div>
      </section>

    </div>
  );
}
