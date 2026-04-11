import { Navigation } from './Navigation';
import { Link } from "react-router";
import { MapPin, Coffee, Sun, Palmtree, ArrowRight, Compass, Camera, Utensils } from 'lucide-react';

export function DiscoveryPage() {
  const discoveries = [
    { 
      title: "Marbella & Málaga", 
      subtitle: "The Soul of the Coast",
      desc: "Wander the whitewashed 'Casco Antiguo' of Marbella with its orange-scented plazas, or explore Málaga's historic cathedral, Picasso Museum, and vibrant 'Muelle Uno' port area. Both offer a perfect blend of history and modern Mediterranean life.", 
      icon: <MapPin size={28} />,
      image: "/malaga-coast-sketch.png",
      tag: "Exploration"
    },
    { 
      title: "Beach Club Culture", 
      subtitle: "Sun-drenched Solitude",
      desc: "Experience the quintessential Costa del Sol lifestyle at world-class beach clubs. From the sophisticated atmosphere of Trocadero Playa to the vibrant energy of Nikki Beach, these are the best places to enjoy the sea with a glass of sangria in hand.", 
      icon: <Palmtree size={28} />,
      image: "/cocktail-sketch.png",
      tag: "Leisure"
    },
    { 
      title: "Andalusian Flavors", 
      subtitle: "A Culinary Tapestry",
      desc: "Indulge in authentic 'espetos de sardinas' (grilled sardines) on the beach, or explore the modern tapas scene in the pedestrian streets of Málaga's old town. Don't miss out on local Sherry and fresh seafood from the Mediterranean.", 
      icon: <Utensils size={28} />,
      image: "/dinner-sketch.png",
      tag: "Cuisine"
    },
    { 
      title: "April Skies", 
      subtitle: "The Perfect Spring",
      desc: "April in Andalusia is a magical time of year. Expect soft spring light and temperatures typically around 22°C (72°F). The flowers are in bloom, and the air is fresh—perfect for exploring the hills of Monda or the coastal promenades.", 
      icon: <Sun size={28} />,
      image: "/andalusian-road-sketch.png",
      tag: "Climate"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-primary-text font-serif">
      <Navigation />

      {/* HERO SECTION */}
      <section className="relative pt-2 pb-24 px-6 overflow-hidden text-center">
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("/arch-pattern.png")', backgroundSize: '400px' }} />
        
        <div className="max-w-4xl mx-auto relative z-10 reveal">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-accent-terracotta/5 rounded-full ring-1 ring-accent-terracotta/10">
              <Compass className="text-accent-terracotta animate-spin-slow" size={32} strokeWidth={1} />
            </div>
          </div>
          <span className="label-uppercase mb-6 block">Make a weekend of it</span>
          <h1 className="text-6xl md:text-8xl font-serif text-primary-text mb-8 italic leading-tight">
            The Andalusian <br className="hidden md:block" /> Discovery
          </h1>
          <p className="text-xl md:text-2xl text-secondary-text font-serif italic max-w-2xl mx-auto px-4 leading-relaxed opacity-80">
            "Andalusia is a tapestry of history, light, and flavor. We invite you to linger, explore, and fall in love with the magic of the Costa del Sol."
          </p>
          <div className="w-24 h-px mx-auto mt-16 bg-accent-terracotta/30" />
        </div>
      </section>

      {/* DISCOVERY GRID */}
      <section className="py-24 px-6 section-layer-1">
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
