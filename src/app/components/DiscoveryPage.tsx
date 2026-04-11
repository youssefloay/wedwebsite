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
      desc: "April in Andalusia is a magical time of year. Expect soft spring light and temperatures typically around 22°C (72°F). The flowers are in bloom, and the air is fresh—perfect for exploring the hills of Monda or the coastal promenades.", 
      icon: <Sun size={28} />,
      image: "/hills-journey.png",
      tag: "Climate"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-primary-text font-serif">

      {/* HERO SECTION */}
      <section className="relative pt-10 pb-20 px-6 overflow-hidden text-center section-layer-1">
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("/arch-pattern.png")', backgroundSize: '400px' }} />
        
        <div className="max-w-3xl mx-auto relative z-10 reveal">
          <span className="label-uppercase mb-6 block">Make a weekend of it</span>
          <h1 className="text-5xl md:text-7xl font-serif text-primary-text mb-8 italic leading-tight">
            The Andalusian <br className="hidden md:block" /> Discovery
          </h1>
          <p className="text-xl md:text-2xl text-secondary-text font-serif italic max-w-lg mx-auto px-4 leading-relaxed opacity-80">
            "Andalusia is a tapestry of history, light, and flavor. We invite you to linger, explore, and fall in love with the magic of the Costa del Sol."
          </p>
          <div className="w-16 h-px mx-auto mt-12 bg-accent-terracotta" />
        </div>
      </section>

      {/* DISCOVERY GRID */}
      <section className="py-12 px-6 section-layer-1">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-32">
            {discoveries.map((item, idx) => (
              <div key={idx} className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16 lg:gap-24 reveal`}>
                {/* Image Side */}
                <div className="w-full lg:w-1/2 relative group">
                  <div className="aspect-[4/3] rounded-[60px] overflow-hidden shadow-2xl transform transition-all duration-1000 group-hover:scale-[1.02]">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover img-grain" />
                    <div className="absolute inset-0 bg-accent-terracotta/5 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-700" />
                  </div>
                  {/* Floating Icon Stamp */}
                  <div className="absolute -bottom-8 -right-8 md:-bottom-12 md:-right-12 w-24 h-24 md:w-32 md:h-32 bg-white rounded-full shadow-2xl border border-border/10 flex items-center justify-center text-accent-terracotta transform rotate-12 group-hover:rotate-0 transition-transform duration-700">
                    {item.icon}
                  </div>
                </div>

                {/* Content Side */}
                <div className="w-full lg:w-1/2 text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                    <span className="label-uppercase tracking-[0.4em] text-accent-terracotta">{item.tag}</span>
                    <div className="w-8 h-px bg-accent-terracotta/20" />
                  </div>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-primary-text mb-4 leading-tight italic">{item.title}</h2>
                  <h3 className="text-xl md:text-2xl font-serif text-accent-beige italic mb-8 opacity-80">{item.subtitle}</h3>
                  <div className="w-12 h-px bg-accent-terracotta/20 mb-8 hidden lg:block" />
                  <p className="text-lg md:text-xl text-secondary-text font-serif italic leading-relaxed opacity-90 max-w-xl mx-auto lg:mx-0">
                    {item.desc}
                  </p>
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
            <span className="label-uppercase mb-4 block">The Andalusian Ledger</span>
            <h2 className="text-4xl md:text-5xl font-serif text-primary-text italic mb-6">Curated Experiences</h2>
            <div className="w-16 h-px bg-accent-terracotta/20 mx-auto" />
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
                  <h3 className="label-uppercase text-[12px] font-extrabold tracking-[0.3em] text-primary-text">{cat.category}</h3>
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
          <div className="w-16 h-px bg-accent-terracotta mx-auto mb-12" />
          <span className="label-uppercase tracking-[0.5em] text-accent-beige">A Note for our Guests</span>
        </div>
      </section>

      {/* FINAL RSVP CTA */}
      <section className="section-layer-1 py-32 px-6 border-t border-border/10">
        <div className="max-w-2xl mx-auto text-center reveal">
          <span className="label-uppercase mb-6 block font-bold tracking-[0.4em]">Primary Action</span>
          <h2 className="text-4xl md:text-5xl font-serif text-primary-text mb-8 italic">Inspired to Join Us?</h2>
          <p className="text-xl text-secondary-text font-serif italic mb-12 opacity-80 leading-relaxed">
            "Once you have explored our story and the beauty of Monda, kindly finalize your plans by submitting your response."
          </p>
          <Link to="/rsvp" className="btn-primary inline-flex shadow-xl group">
             Go to RSVP <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
          </Link>
        </div>
      </section>

      <footer className="pt-8 pb-32 text-center border-t border-border bg-background">
        <p className="label-uppercase mb-0">Lama & Álvaro · 2027</p>
      </footer>
    </div>
  );
}
