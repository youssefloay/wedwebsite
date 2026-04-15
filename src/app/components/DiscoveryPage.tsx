import { Link } from "react-router";
import { MapPin, Coffee, Sun, Palmtree, ArrowRight, Camera, Utensils, Compass } from 'lucide-react';

export function DiscoveryPage() {
  const discoveries = [
    { 
      title: "Marbella & Málaga", 
      subtitle: "The Soul of the Coast",
      desc: "Wander the whitewashed 'Casco Antiguo' of Marbella with its orange-scented plazas, or explore Málaga's historic cathedral, Picasso Museum, and vibrant 'Muelle Uno' port area. Both offer a perfect blend of history and modern Mediterranean life.", 
      icon: <MapPin size={28} />,
      image: "/malaga-coast.png",
      tag: "Exploration"
    },
    { 
      title: "Beach Club Culture", 
      subtitle: "Sun-drenched Solitude",
      desc: "Experience the quintessential Costa del Sol lifestyle at world-class beach clubs. From the sophisticated atmosphere of Trocadero Playa to the vibrant energy of Nikki Beach, these are the best places to enjoy the sea with a glass of sangria in hand.", 
      icon: <Palmtree size={28} />,
      image: "/cocktail_sketch.png",
      tag: "Leisure"
    },
    { 
      title: "Andalusian Flavors", 
      subtitle: "A Culinary Tapestry",
      desc: "Indulge in authentic 'espetos de sardinas' (grilled sardines) on the beach, or explore the modern tapas scene in the pedestrian streets of Málaga's old town. Don't miss out on local Sherry and fresh seafood from the Mediterranean.", 
      icon: <Utensils size={28} />,
      image: "/dinner.png",
      tag: "Cuisine"
    },
    { 
      title: "April Skies", 
      subtitle: "The Perfect Spring",
      desc: "April in Andalusia is a magical time of year. Expect soft spring light and temperatures typically around 22°C (72°F). The flowers are in bloom, and the air is fresh - perfect for exploring the hills of Monda or the coastal promenades.", 
      icon: <Sun size={28} />,
      image: "/hills-journey.png",
      tag: "Climate"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-primary-text font-serif">

      {/* HERO SECTION */}
      <section className="relative pt-10 pb-0 px-6 overflow-hidden text-center section-layer-1 border-b border-border/10">
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("/arch-pattern.png")', backgroundSize: '400px' }} />
        
        <div className="max-w-3xl mx-auto relative z-10 reveal">
          <span className="label-uppercase mb-6 block">Make a weekend of it</span>
          <h1 className="text-5xl md:text-7xl font-serif text-primary-text mb-8 leading-tight">Discover Monda</h1>
          <p className="text-xl md:text-2xl font-serif text-secondary-text italic leading-relaxed max-w-2xl mx-auto px-4 opacity-80">
            "Andalusia is a tapestry of history, light, and flavor. We invite you to linger, explore, and fall in love with the magic of the Costa del Sol."
          </p>
          <div className="w-16 h-px mx-auto my-10 bg-accent-terracotta" />
        </div>
      </section>

      {/* DISCOVERY GRID */}
      <section className="pb-24 px-6 section-layer-1">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-32">
            {discoveries.map((item, idx) => (
              <div key={idx} className="reveal-scale">
                {/* Section Header - CENTERING ABOVE CONTENT (Universal Standard) */}
                <div className="text-center mb-16 flex flex-col items-center">
                  <span className="label-uppercase">{item.tag}</span>
                  <h2 className="text-4xl md:text-5xl font-serif text-primary-text mb-6 italic">{item.title}</h2>
                  <div className="w-16 h-px bg-accent-terracotta" />
                </div>

                <div className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-20 items-center mb-40 last:mb-0`}>
                  {/* Visual Side */}
                  <div className="w-full lg:w-1/2 relative group">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl depth-overlay">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 img-grain"
                      />
                    </div>
                    {/* Floating Icon Stamp */}
                    <div className="absolute -bottom-8 -right-8 md:-bottom-12 md:-right-12 w-24 h-24 md:w-32 md:h-32 bg-white rounded-full shadow-2xl border border-border/10 flex items-center justify-center text-accent-terracotta transform rotate-12 group-hover:rotate-0 transition-transform duration-700">
                      {item.icon}
                    </div>
                  </div>

                  {/* Content Side */}
                  <div className="w-full lg:w-1/2 text-center lg:text-left">
                    <h3 className="text-xl md:text-2xl font-serif text-primary-text mb-6 italic opacity-90">{item.subtitle}</h3>
                    <p className="text-lg md:text-xl text-secondary-text font-serif italic leading-relaxed opacity-90 max-w-xl mx-auto lg:mx-0">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE CURATED LEDGER */}
      <section className="py-32 px-6 section-layer-3 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 reveal">
            <span className="label-uppercase mb-4 block reveal">The Andalusian Ledger</span>
            <h2 className="text-4xl md:text-5xl font-serif text-primary-text mb-6 italic">Curated Experiences</h2>
            <div className="w-16 h-px bg-accent-terracotta mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                category: "Heritage & Arts",
                icon: <Compass size={24} />,
                items: [
                  { name: "Picasso Museum", loc: "Málaga", detail: "The birthplace and soul of Málaga's most famous son." },
                  { name: "The Alcazaba", loc: "Málaga", detail: "A palatial Moorish fortress overlooking the Mediterranean." },
                  { name: "Monda Village", loc: "Monda", detail: "Wander the winding, whitewashed streets surrounding the Castle." }
                ]
              },
              {
                category: "The Table",
                icon: <Utensils size={24} />,
                items: [
                  { name: "The Old Town Tapas", loc: "Marbella", detail: "Traditional bites in the heart of the Casco Antiguo." },
                  { name: "Espetos on the Shore", loc: "The Coast", detail: "Fresh sardines grilled on open-air boat barbeques." },
                  { name: "Modern Cuisine", loc: "Málaga", detail: "A contemporary take on classic Andalusian ingredients." }
                ]
              },
              {
                category: "The Spirits",
                icon: <Coffee size={24} />,
                items: [
                  { name: "Rooftop Views", loc: "Málaga", detail: "Sunset cocktails overlooking the cathedral and port." },
                  { name: "Beach Club Sunsets", loc: "Marbella", detail: "Relaxed energy and chilled wine as the sun dips." },
                  { name: "The Castle Lounge", loc: "Monda", detail: "A quiet, starlit evening at our celebration venue." }
                ]
              }
            ].map((cat, i) => (
              <div key={i} className="reveal group" style={{ transitionDelay: `${i * 150}ms` }}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 rounded-full bg-accent-terracotta/5 flex items-center justify-center text-accent-terracotta">
                    {cat.icon}
                  </div>
                  <h3 className="label-uppercase text-[12px] font-extrabold text-primary-text">{cat.category}</h3>
                </div>
                <div className="space-y-8">
                  {cat.items.map((item, j) => (
                    <div key={j} className="border-l border-accent-terracotta/10 pl-6 group/item hover:border-accent-terracotta/40 transition-colors">
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className="font-serif italic text-xl text-primary-text group-hover/item:text-accent-terracotta transition-colors">{item.name}</h4>
                        <span className="text-[10px] uppercase tracking-widest text-accent-beige font-bold">{item.loc}</span>
                      </div>
                      <p className="text-sm text-secondary-text font-serif italic opacity-70 leading-relaxed">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRAVEL JOURNAL QUOTE */}
      <section className="py-32 px-6 section-layer-2 text-center overflow-hidden">
        <div className="max-w-4xl mx-auto relative reveal">
          <Camera className="absolute -top-12 -left-12 text-accent-terracotta/10 w-24 h-24 rotate-[-15deg]" />
          <p className="text-3xl md:text-5xl font-serif italic text-primary-text leading-tight mb-12">
            "To travel is to live, and to explore Andalusia is to find a piece of one's soul in the sun."
          </p>
          <div className="w-16 h-px bg-accent-terracotta mx-auto mt-8 mb-16" />
          <span className="label-uppercase tracking-[0.5em] text-accent-beige">A Note for our Guests</span>
        </div>
      </section>

      {/* SPANISH CHEAT SHEET */}
      <section className="py-16 md:py-24 px-6 section-layer-2 bg-[#F5EFEB]/20 border-t border-border/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 reveal">
            <span className="label-uppercase mb-4 block">Lingua Franca</span>
            <h2 className="text-3xl md:text-4xl font-serif text-primary-text mb-4 italic">A Few Words in Spanish</h2>
            <div className="w-12 h-px bg-accent-terracotta mx-auto mb-6" />
            <p className="text-base text-secondary-text font-serif italic max-w-xl mx-auto opacity-70">
              "While Álvaro can translate, the locals in Monda will always appreciate a warm greeting in their own tongue."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              { phrase: "¡Hola!", meaning: "Hello", sub: "A universal start to any conversation." },
              { phrase: "¿Cómo estás?", meaning: "How are you?", sub: "For a friendly greeting." },
              { phrase: "Dos copas, por favor", meaning: "Two glasses, please", sub: "Essential for the sunset cocktails." },
              { phrase: "Muchas gracias", meaning: "Thank you very much", sub: "Always appreciated." },
              { phrase: "¡Salud!", meaning: "Cheers!", sub: "To be said with eye contact." },
              { phrase: "¡Qué bonito!", meaning: "How beautiful!", sub: "You will say this often in Monda." }
            ].map((item, i) => (
              <div 
                key={i} 
                className={`relative p-5 bg-transparent border border-dashed border-accent-terracotta/30 rounded-sm transition-all duration-700 hover:scale-105 flex flex-col items-center gap-2 ${
                  i % 3 === 0 ? 'rotate-1' : i % 3 === 1 ? '-rotate-1' : 'rotate-2'
                }`}
              >
                {/* Vintage Tape Effect */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-4 bg-accent-terracotta/5 backdrop-blur-sm border border-accent-terracotta/10 rotate-[-2deg]" />
                
                <span className="text-xl md:text-2xl font-serif text-primary-text italic group-hover:text-accent-terracotta transition-colors">{item.phrase}</span>
                <div className="w-6 h-px bg-accent-terracotta/20" />
                <span className="label-uppercase text-[9px] tracking-[0.2em] font-bold text-accent-terracotta/60">{item.meaning}</span>
                <p className="text-[12px] text-secondary-text font-serif italic opacity-70 leading-relaxed text-center">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL RSVP CTA */}
      <section className="section-layer-1 py-32 px-6 border-t border-border/10">
        <div className="max-w-2xl mx-auto text-center reveal">
          <span className="label-uppercase mb-6 block font-bold">Primary Action</span>
          <h2 className="text-4xl md:text-5xl font-serif text-primary-text mb-8 italic">Inspired to Join Us?</h2>
          <p className="text-xl text-secondary-text font-serif italic mb-12 opacity-80 leading-relaxed">
            "Once you have explored our story and the beauty of Monda, kindly finalize your plans by submitting your response."
          </p>
          <Link to="/rsvp" className="btn-primary">
             Go to RSVP
          </Link>
        </div>
      </section>

    </div>
  );
}
