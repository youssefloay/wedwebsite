import { Link } from "react-router";
import { MapPin, Coffee, Sun, Palmtree, Utensils, Compass, Camera, Sparkles, Wind, Navigation } from 'lucide-react';

export function DiscoveryPage() {
  const discoveries = [
    { 
      title: "Marbella & Málaga", 
      subtitle: "The Soul of the Coast",
      desc: "Wander the whitewashed 'Casco Antiguo' of Marbella or explore Málaga's historic cathedral. Both offer a perfect blend of history and modern Mediterranean life.", 
      note: "The jasmine scent in Marbella's alleys is unforgettable.",
      icon: <MapPin size={24} />,
      image: "/malaga-coast.png",
      tag: "Exploration",
      orient: "left"
    },
    { 
      title: "Andalusian Flavors", 
      subtitle: "A Culinary Tapestry",
      desc: "Indulge in authentic 'espetos de sardinas' on the beach or explore the modern tapas scene in Málaga's pedestrian center.", 
      note: "Try 'Sherry' with your tapas - it is the soul of Spain.",
      icon: <Utensils size={24} />,
      image: "/dinner.png",
      tag: "Cuisine",
      orient: "right"
    },
    { 
      title: "Beach Club Culture", 
      subtitle: "Sun-drenched Solitude",
      desc: "Experience the quintessential Costa del Sol lifestyle at world-class beach clubs from Trocadero to Nikki Beach.", 
      note: "Pack your most elegant beach-wear.",
      icon: <Palmtree size={24} />,
      image: "/cocktail_sketch.png",
      tag: "Leisure",
      orient: "left"
    },
    { 
      title: "April Skies", 
      subtitle: "The Perfect Spring",
      desc: "April in Andalusia is magical. Expect soft spring light, blooming bougainvillea, and temperatures around 22°C.", 
      note: "The golden hour starts at 7:45 PM.",
      icon: <Sun size={24} />,
      image: "/hills-journey.png",
      tag: "Climate",
      orient: "right"
    }
  ];

  const essentials = [
    { title: "Footwear", desc: "Monda's winding stone paths require elegant but sturdy soles.", icon: <Navigation size={18} /> },
    { title: "Golden Light", desc: "Andalusia changes color at 7 PM. Keep your camera ready.", icon: <Camera size={18} /> },
    { title: "The Siesta", desc: "Life pauses between 2 PM and 5 PM. Embrace the slow pace.", icon: <Wind size={18} /> }
  ];

  return (
    <div className="min-h-screen bg-background text-primary-text font-serif overflow-hidden">

      {/* IMMERSIVE HERO */}
      <section className="relative pt-24 pb-40 px-6 text-center">
        <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'url("/arch-pattern.png")', backgroundSize: '350px' }} />
        
        <div className="max-w-5xl mx-auto relative z-10 reveal">
          <div className="flex flex-col items-center">
            <span className="label-uppercase mb-10 block tracking-[0.6em] opacity-40">Entry No. XII</span>
            <div className="relative">
              <h1 className="text-7xl md:text-9xl font-serif text-primary-text mb-12 leading-[1.1] relative z-10">
                The Monda <br/><span className="italic">Perspective</span>
              </h1>
              <span className="absolute -top-12 -right-12 md:-right-20 font-script text-4xl md:text-6xl text-accent-terracotta/40 -rotate-12 select-none">Insider's Journal</span>
            </div>
            <p className="text-xl md:text-3xl font-serif text-secondary-text italic leading-relaxed max-w-2xl mx-auto px-4 opacity-60">
              "We have curated a ledger of our favorite corners, flavors, and moments across this sun-drenched landscape."
            </p>
            <div className="w-16 h-px mx-auto mt-20 bg-accent-terracotta/30" />
          </div>
        </div>
      </section>

      {/* TRAVELER'S KIT (ESSENTIALS) */}
      <section className="py-32 px-6 relative">
         <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24 relative z-10">
               {essentials.map((tip, i) => (
                 <div key={i} className="reveal group" style={{ transitionDelay: `${i * 150}ms` }}>
                    <div className="wedding-card !bg-white/40 backdrop-blur-md border-border/10 !p-12 hover:-translate-y-3 transition-all duration-700 relative overflow-visible">
                       <div className="absolute -top-6 -left-6 w-14 h-14 rounded-full bg-accent-terracotta flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-700">
                          {tip.icon}
                       </div>
                       <h3 className="font-serif italic text-3xl mb-6 text-primary-text">{tip.title}</h3>
                       <p className="text-secondary-text font-serif italic text-lg leading-relaxed opacity-80">{tip.desc}</p>
                       <div className="absolute -bottom-4 -right-4 w-12 h-px bg-accent-terracotta/20 mt-8" />
                    </div>
                 </div>
               ))}
            </div>
         </div>
         {/* Decorative Watermark */}
         <div className="absolute top-1/2 left-0 w-full h-px bg-border/5 -z-10" />
      </section>

      {/* THE MOMENTS GRID (OVERLAPPING DEPTH) */}
      <section className="py-40 px-6">
        <div className="max-w-7xl mx-auto space-y-64">
          {discoveries.map((item, idx) => (
            <div key={idx} className={`relative flex flex-col ${item.orient === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-20 reveal-scale`}>
               
               {/* VISUAL SIDE - OVERLAPPING ELEMENTS */}
               <div className="w-full md:w-[60%] relative group">
                  <div className="absolute -inset-10 bg-accent-beige/[0.03] rounded-[60px] -z-10 transform -rotate-2" />
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[40px] shadow-[0_40px_100px_rgba(92,50,16,0.12)] border border-white/80">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-all duration-[4s] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-text/20 to-transparent opacity-40" />
                  </div>
                  
                  {/* Floating Script Note */}
                  <div className={`absolute ${item.orient === 'right' ? '-left-8 md:-left-20' : '-right-8 md:-right-20'} top-1/2 -translate-y-1/2 w-48 md:w-64 z-20`}>
                     <p className="font-script text-2xl md:text-3xl text-accent-terracotta leading-snug drop-shadow-sm -rotate-6 select-none opacity-80">
                        "{item.note}"
                     </p>
                  </div>
               </div>

               {/* CONTENT SIDE */}
               <div className="w-full md:w-[40%] text-center md:text-left space-y-8 z-10">
                  <div className="space-y-4">
                     <span className="label-uppercase opacity-40 text-[10px] tracking-[0.4em]">{item.tag} / MOMENT {idx + 1}</span>
                     <h2 className="text-5xl md:text-7xl font-serif text-primary-text italic leading-tight">{item.title}</h2>
                     <div className="w-12 h-px bg-accent-terracotta/40 mt-6" />
                  </div>
                  <p className="text-xl text-secondary-text font-serif italic leading-relaxed opacity-70">
                    {item.desc}
                  </p>
                  <div className="flex items-center gap-4 text-accent-terracotta">
                     {item.icon}
                     <span className="label-uppercase text-[10px] tracking-widest">{item.subtitle}</span>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* REIMAGINED LEDGER (THE NOTEBOOK) */}
      <section className="py-40 px-6 bg-[#FAF8F5] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-background to-transparent" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-32">
            <span className="label-uppercase mb-8 block tracking-[0.5em] opacity-30">Selection Vol. I</span>
            <h2 className="text-5xl md:text-8xl font-serif text-primary-text italic opacity-90">Hand-picked Essentials</h2>
            <div className="w-20 h-px bg-accent-terracotta/40 mx-auto mt-16" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24 items-start">
            {[
              {
                category: "Heritage",
                icon: <Compass size={24} />,
                items: [
                  { name: "Picasso Museum", loc: "Málaga", detail: "The birthplace and soul of Málaga's most famous son." },
                  { name: "The Alcazaba", loc: "Málaga", detail: "A palatial Moorish fortress overlooking the sea." }
                ]
              },
              {
                category: "The Table",
                icon: <Utensils size={24} />,
                items: [
                  { name: "Old Town Tapas", loc: "Marbella", detail: "Traditional bites in the heart of the Casco Antiguo." },
                  { name: "Espetos on Shore", loc: "The Coast", detail: "Fresh sardines grilled on open-air boat barbeques." }
                ]
              },
              {
                category: "The Pour",
                icon: <Coffee size={24} />,
                items: [
                  { name: "Rooftop Views", loc: "Málaga", detail: "Sunset cocktails overlooking the cathedral port." },
                  { name: "Beach Club", loc: "Marbella", detail: "Relaxed energy and chilled wine as the sun dips." }
                ]
              }
            ].map((cat, i) => (
              <div key={i} className="space-y-16 group" style={{ marginTop: `${i * 60}px` }}>
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-full border border-border/10 flex items-center justify-center text-accent-terracotta bg-white shadow-md">
                    {cat.icon}
                  </div>
                  <h3 className="label-uppercase text-[11px] font-extrabold tracking-[0.4em] opacity-50">{cat.category}</h3>
                </div>
                <div className="space-y-16 border-l border-accent-terracotta/10 pl-10">
                  {cat.items.map((item, j) => (
                    <div key={j} className="space-y-4">
                      <div className="flex justify-between items-start">
                         <h4 className="font-serif italic text-3xl text-primary-text group-hover:text-accent-terracotta transition-colors">{item.name}</h4>
                         <span className="text-[9px] uppercase tracking-widest text-accent-beige font-extrabold mt-2">{item.loc}</span>
                      </div>
                      <p className="text-secondary-text font-serif italic opacity-60 leading-relaxed text-lg">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL INVITATION */}
      <section className="py-48 px-6 text-center border-t border-border/10">
        <div className="max-w-3xl mx-auto reveal">
          <Sparkles className="mx-auto mb-12 text-accent-terracotta/20 shrink-0" size={48} strokeWidth={1} />
          <h2 className="text-6xl md:text-8xl font-serif text-primary-text mb-12 italic leading-tight">Join the Story</h2>
          <p className="text-xl md:text-2xl text-secondary-text font-serif italic mb-20 opacity-70 leading-relaxed">
            "We have prepared the canvas; we simply await your arrival to complete the chapter."
          </p>
          <Link to="/rsvp" className="btn-primary inline-flex shadow-2xl">
             Confirm Attendance
          </Link>
        </div>
      </section>

    </div>
  );
}
