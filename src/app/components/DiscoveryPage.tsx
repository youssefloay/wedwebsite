import { Link } from "react-router";
import { MapPin, Coffee, Sun, Palmtree, Utensils, Compass, Camera, Sparkles, Wind } from 'lucide-react';

export function DiscoveryPage() {
  const discoveries = [
    { 
      title: "Marbella & Málaga", 
      subtitle: "The Soul of the Coast",
      desc: "Wander the whitewashed 'Casco Antiguo' of Marbella or explore Málaga's historic cathedral. Both offer a perfect blend of history and modern Mediterranean life.", 
      icon: <MapPin size={24} />,
      image: "/malaga-coast.png",
      tag: "Exploration",
      size: "large"
    },
    { 
      title: "Beach Club Culture", 
      subtitle: "Sun-drenched Solitude",
      desc: "Experience the quintessential Costa del Sol lifestyle at world-class beach clubs.", 
      icon: <Palmtree size={24} />,
      image: "/cocktail_sketch.png",
      tag: "Leisure",
      size: "small"
    },
    { 
      title: "Andalusian Flavors", 
      subtitle: "A Culinary Tapestry",
      desc: "Indulge in authentic 'espetos de sardinas' on the beach or explore the modern tapas scene.", 
      icon: <Utensils size={24} />,
      image: "/dinner.png",
      tag: "Cuisine",
      size: "small"
    },
    { 
      title: "April Skies", 
      subtitle: "The Perfect Spring",
      desc: "April in Andalusia is a magical time. Expect soft spring light and temperatures typically around 22°C (72°F).", 
      icon: <Sun size={24} />,
      image: "/hills-journey.png",
      tag: "Climate",
      size: "large"
    }
  ];

  const essentials = [
    { title: "The Cobblestone Standard", desc: "Monda's charm lies in its winding stone paths. We recommend elegant but comfortable footwear for all outdoor moments.", icon: <Sparkles size={18} /> },
    { title: "The Sunset Hour", desc: "The light in Andalusia changes dramatically at 7 PM. Ensure your camera is ready for the golden glow on the castle walls.", icon: <Camera size={18} /> },
    { title: "Andalusian Pace", desc: "Life here moves with the sun. Many local shops observe the traditional afternoon siesta between 2 PM and 5 PM.", icon: <Wind size={18} /> },
    { title: "The Coffee Ritual", desc: "In Málaga, coffee is an art of proportions. Ask for a 'Sombra' (mostly milk) or a 'Nube' (just a cloud of milk) to order like a local.", icon: <Coffee size={18} /> }
  ];

  return (
    <div className="min-h-screen bg-background text-primary-text font-serif">

      {/* REFINED HERO */}
      <section className="relative pt-20 pb-32 px-6 text-center border-b border-border/10">
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("/arch-pattern.png")', backgroundSize: '400px' }} />
        
        <div className="max-w-4xl mx-auto relative z-10 reveal">
          <span className="label-uppercase mb-8 block tracking-[0.5em] opacity-60 text-accent-terracotta">Discovery Journal</span>
          <h1 className="text-6xl md:text-8xl font-serif text-primary-text mb-10 leading-[1.1]">The Monda <br/><span className="italic">Perspective</span></h1>
          <p className="text-xl md:text-2xl font-serif text-secondary-text italic leading-relaxed max-w-2xl mx-auto px-4 opacity-70">
            "Andalusia is a tapestry of history, light, and flavor. We invite you to linger, explore, and find piece of your soul in the sun."
          </p>
          <div className="w-16 h-px mx-auto mt-16 bg-accent-terracotta" />
        </div>
      </section>

      {/* INSIDER ESSENTIALS (PRACTICAL TIPS) */}
      <section className="py-24 px-6 bg-white/30 backdrop-blur-sm border-b border-border/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="label-uppercase text-[10px] tracking-widest text-accent-terracotta opacity-60">Insider Tips</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {essentials.map((tip, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="w-10 h-10 rounded-full border border-accent-terracotta/20 flex items-center justify-center text-accent-terracotta mb-6 group-hover:bg-accent-terracotta group-hover:text-white transition-all duration-700">
                  {tip.icon}
                </div>
                <h3 className="font-serif italic text-2xl mb-4 text-primary-text">{tip.title}</h3>
                <p className="text-secondary-text font-serif italic text-lg leading-relaxed opacity-80">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DISCOVERY TAPESTRY GRID */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24">
            {discoveries.map((item, idx) => (
              <div 
                key={idx} 
                className={`${item.size === 'large' ? 'md:col-span-8' : 'md:col-span-4'} reveal-scale`}
                style={{ transitionDelay: `${idx * 150}ms` }}
              >
                <div className="group relative">
                  <div className="aspect-[4/5] overflow-hidden rounded-[40px] shadow-2xl mb-8 border border-white/60">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-all duration-[3s] group-hover:scale-110"
                    />
                    <div className="absolute top-8 left-8 flex items-center gap-3">
                       <div className="bg-white/90 backdrop-blur-md px-6 py-2 rounded-full shadow-lg border border-white/20">
                          <span className="label-uppercase text-[10px] tracking-widest text-[#515C4C]">{item.tag}</span>
                       </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-accent-terracotta/5 flex items-center justify-center text-accent-terracotta">
                        {item.icon}
                      </div>
                      <h2 className="text-3xl md:text-4xl font-serif text-primary-text italic">{item.title}</h2>
                    </div>
                    <p className="text-secondary-text font-serif italic text-xl leading-relaxed opacity-80 px-12 md:px-0">
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
      <section className="py-32 px-6 bg-[#FAF8F5]/50 border-y border-border/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24">
            <span className="label-uppercase mb-6 block tracking-[0.4em] opacity-60">The Journal Selection</span>
            <h2 className="text-4xl md:text-6xl font-serif text-primary-text italic leading-tight">Hand-picked Momentos</h2>
            <div className="w-16 h-px bg-accent-terracotta mx-auto mt-12" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24">
            {[
              {
                category: "Heritage",
                icon: <Compass size={20} />,
                items: [
                  { name: "Picasso Museum", loc: "Málaga", detail: "The birthplace and soul of Málaga's most famous son." },
                  { name: "The Alcazaba", loc: "Málaga", detail: "A palatial Moorish fortress overlooking the Mediterranean." }
                ]
              },
              {
                category: "The Table",
                icon: <Utensils size={20} />,
                items: [
                  { name: "The Old Town Tapas", loc: "Marbella", detail: "Traditional bites in the heart of the Casco Antiguo." },
                  { name: "Espetos on Shore", loc: "The Coast", detail: "Fresh sardines grilled on open-air boat barbeques." }
                ]
              },
              {
                category: "The Pour",
                icon: <Coffee size={20} />,
                items: [
                  { name: "Rooftop Views", loc: "Málaga", detail: "Sunset cocktails overlooking the cathedral port." },
                  { name: "Beach Club", loc: "Marbella", detail: "Relaxed energy and chilled wine as the sun dips." }
                ]
              }
            ].map((cat, i) => (
              <div key={i} className="space-y-12">
                <div className="flex flex-col items-center gap-4 mb-2">
                  <div className="p-4 bg-accent-terracotta/5 rounded-full text-accent-terracotta border border-accent-terracotta/10">
                    {cat.icon}
                  </div>
                  <h3 className="label-uppercase text-[11px] font-extrabold text-[#515C4C] tracking-[0.3em]">{cat.category}</h3>
                </div>
                <div className="space-y-12">
                  {cat.items.map((item, j) => (
                    <div key={j} className="text-center group/item border-b border-accent-terracotta/5 pb-12 last:border-0 hover:border-accent-terracotta/20 transition-all duration-700">
                      <div className="mb-2">
                        <span className="text-[9px] uppercase tracking-widest text-accent-beige font-bold mb-3 block">{item.loc}</span>
                        <h4 className="font-serif italic text-2xl text-primary-text group-hover/item:text-accent-terracotta transition-colors">{item.name}</h4>
                      </div>
                      <p className="text-secondary-text font-serif italic opacity-70 leading-relaxed text-sm max-w-[240px] mx-auto">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL RSVP CTA */}
      <section className="py-40 px-6 text-center">
        <div className="max-w-2xl mx-auto reveal">
          <span className="label-uppercase mb-8 block font-bold opacity-30">The Completion</span>
          <h2 className="text-5xl md:text-7xl font-serif text-primary-text mb-10 italic">Ready for <br/>Andalusia?</h2>
          <p className="text-xl text-secondary-text font-serif italic mb-16 opacity-70 leading-relaxed">
            "We invite you to join us in Monda and write your own chapter of this story."
          </p>
          <Link to="/rsvp" className="btn-primary-large inline-flex shadow-2xl shadow-accent-terracotta/10">
             Confirm Attendance
          </Link>
        </div>
      </section>

    </div>
  );
}
