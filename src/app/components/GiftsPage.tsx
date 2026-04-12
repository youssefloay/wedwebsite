import { Link } from "react-router";
import { Heart, Globe, CreditCard, Copy, Check, Smartphone, Info, Sparkles, MapPin, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

type Region = 'international' | 'france' | 'switzerland';

export function GiftsPage() {
  const [activeRegion, setActiveRegion] = useState<Region>('france');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const regions = [
    { id: 'france', label: 'France' },
    { id: 'switzerland', label: 'Switzerland' },
    { id: 'international', label: 'International' }
  ];

  return (
    <div className="min-h-screen bg-background text-primary-text font-serif">
      
      {/* 1. HERO */}
      <section className="relative pt-10 pb-0 px-6 overflow-hidden text-center section-layer-1 border-b border-border/10">
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("/arch-pattern.png")', backgroundSize: '400px' }} />
        <div className="relative z-10 max-w-3xl mx-auto reveal">
          <span className="label-uppercase mb-6 block">Gifting</span>
          <h1 className="text-5xl md:text-7xl font-serif text-primary-text mb-8 leading-tight">Our Future</h1>
          <p className="text-xl md:text-2xl font-serif text-secondary-text italic leading-relaxed max-w-2xl mx-auto px-4 opacity-80">
            "Your presence is the greatest gift."
          </p>
          <div className="w-16 h-px mx-auto my-10 bg-accent-terracotta" />
        </div>
      </section>

      {/* 2. THE NOTE */}
      <section className="px-6 pb-24 bg-background reveal">
        <div className="max-w-4xl mx-auto">
          <div className="wedding-card bg-[#F5EFEB]/50 backdrop-blur-sm border-accent-terracotta/20 text-center py-16 px-8 md:px-16 hover:-translate-y-2 transition-all duration-700 shadow-sm">
            <div className="max-w-2xl mx-auto space-y-8">
              <h2 className="text-4xl font-serif text-primary-text italic leading-tight">A Heartfelt Note</h2>
              <p className="text-xl md:text-2xl text-secondary-text leading-relaxed font-serif italic opacity-80">
                We are incredibly fortunate to already have a home filled with everything we could possibly need. 
              </p>
              <p className="text-lg text-secondary-text leading-relaxed font-serif px-4 opacity-70">
                Should you wish to honor us with a gesture, a <span className="text-accent-terracotta underline font-bold">monetary contribution</span> towards buying our future home and our upcoming adventures would be most appreciated.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FUNDS (Home & Honeymoon Illustrations) */}
      <section className="py-12 px-6 bg-[#FBF9F4] border-y border-border/5 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
            {/* Honeymoon Fund */}
            <div className="space-y-10 group">
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <span className="label-uppercase mb-4">Honeymoon Fund</span>
                <h2 className="text-4xl md:text-5xl font-serif text-primary-text mb-6 italic leading-[1.1]">Post-Wedding <br className="hidden md:block" /> Adventures</h2>
                <div className="w-12 h-px bg-accent-terracotta mb-8" />
                <p className="text-lg text-secondary-text leading-relaxed max-w-sm italic">
                  "Help us create lifelong memories as we explore new horizons together on our first journey as husband and wife."
                </p>
              </div>
              <div className="flex justify-center md:justify-start">
                <div className="stamp-visual transform rotate-2 max-w-[280px] group-hover:rotate-0 transition-transform duration-1000">
                  <img src="/gift-honeymoon.png" alt="Honeymoon Fund" className="stamp-image" />
                </div>
              </div>
            </div>

            {/* Future Home */}
            <div className="space-y-10 group">
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <span className="label-uppercase mb-4">Home Fund</span>
                <h2 className="text-4xl md:text-5xl font-serif text-primary-text mb-6 italic leading-[1.1]">Our Future <br className="hidden md:block" /> Sanctuary</h2>
                <div className="w-12 h-px bg-accent-terracotta mb-8" />
                <p className="text-lg text-secondary-text leading-relaxed max-w-sm italic">
                  "Contributions will help us create a space filled with love, laughter, and lifelong memories."
                </p>
              </div>
              <div className="flex justify-center md:justify-start">
                <div className="stamp-visual transform -rotate-1 max-w-[280px] group-hover:rotate-0 transition-transform duration-1000">
                  <img src="/gift-home.png" alt="Future Home Fund" className="stamp-image" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DYNAMIC TRANSFERS (Revolut + Banks) */}
      <div className="max-w-5xl mx-auto px-6 py-24 space-y-24">
        
        {/* REGION SELECTION (THE FRONT DOOR) */}
        <section className="flex flex-col items-center gap-8 sticky top-[72px] md:top-[80px] z-[60] py-6 bg-background/80 backdrop-blur-xl border-b border-border/10 -mx-6 px-6">
          <span className="label-uppercase text-[10px] tracking-[0.4em] opacity-60">Where are you transfering from?</span>
          <div className="bg-white/30 backdrop-blur-md p-1.5 rounded-full border border-border/10 flex gap-1 shadow-inner relative overflow-hidden isolate">
            {regions.map((region) => (
              <button
                key={region.id}
                onClick={() => {
                   setActiveRegion(region.id as Region);
                   setShowDetails(null);
                }}
                className={`flex-1 relative px-6 md:px-10 py-3 rounded-full text-[10px] md:text-[12px] uppercase font-bold tracking-[0.2em] transition-all duration-500 whitespace-nowrap ${
                  activeRegion === region.id ? 'text-white' : 'text-secondary-text hover:text-primary-text'
                }`}
              >
                {activeRegion === region.id && (
                  <motion.div
                    layoutId="activeRegionTab"
                    className="absolute inset-0 bg-accent-terracotta rounded-full z-[-1]"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {region.label}
              </button>
            ))}
          </div>
        </section>

        {/* DYNAMIC GRID (REVOLUT HUB + LOCAL BANKS) */}
        <section className="space-y-16 reveal">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            
            {/* 1. REVOLUT (Always top left, dynamic content) */}
            <div className="wedding-card bg-white border border-border/10 p-0 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-1000 col-span-full md:col-span-1">
               <div className="bg-[#FBF9F4] p-6 border-b border-border/10 flex justify-between items-center">
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-accent-terracotta">Modern Transfer</span>
                    <h3 className="text-2xl font-serif italic">Revolut Hub</h3>
                  </div>
                  <Sparkles size={20} className="text-accent-terracotta opacity-40" />
               </div>
               
               <div className="p-8 space-y-6">
                  {activeRegion === 'switzerland' ? (
                    <div className="space-y-6 animate-in fade-in duration-700">
                      <div className="bg-accent-terracotta/[0.03] p-4 rounded-xl border border-accent-terracotta/20">
                         <div className="flex justify-between items-center mb-1">
                            <span className="text-[8px] uppercase tracking-widest text-accent-terracotta font-bold">Required Reference</span>
                            <button onClick={() => handleCopy('LAMA LOAY, CH', 'rev-chf-ref')} className="text-[8px] font-bold text-accent-terracotta uppercase">{copiedId === 'rev-chf-ref' ? 'Copied' : 'Copy'}</button>
                         </div>
                         <span className="text-sm font-bold text-accent-terracotta font-mono tracking-tight underline decoration-dotted underline-offset-4">LAMA LOAY, CH</span>
                      </div>
                      {renderDetailRowSmall('Beneficiary', 'Revolut Bank UAB')}
                      {renderDetailRowSmall('Swiss CHF IBAN', 'CH44 0900 0W0C 1638 5407 7', 'rev-chf-iban')}
                      {renderDetailRowSmall('Bank', 'PostFinance AG')}
                    </div>
                  ) : (
                    <div className="space-y-6 animate-in fade-in duration-700">
                      <div className="flex flex-col items-center py-4 gap-4 bg-accent-terracotta/[0.02] rounded-xl border border-accent-terracotta/10 mb-2">
                         <span className="text-3xl font-serif italic text-primary-text">@lamaloay</span>
                         <button onClick={() => handleCopy('@lamaloay', 'rev-tag')} className="text-[9px] uppercase font-bold tracking-widest text-accent-terracotta border border-accent-terracotta/30 px-6 py-2 rounded-full hover:bg-accent-terracotta hover:text-white transition-all">
                            {copiedId === 'rev-tag' ? 'Tag Copied' : 'Copy Tag'}
                         </button>
                      </div>
                      {renderDetailRowSmall('Beneficiary', 'LAMA LOAY')}
                      {renderDetailRowSmall('Euro IBAN', 'LT18 3250 0331 5970 5728', 'rev-euro-iban')}
                      <div className="bg-accent-terracotta/[0.03] p-4 rounded-xl border border-accent-terracotta/20 mt-2">
                         <div className="flex justify-between items-center mb-1">
                            <span className="text-[8px] uppercase tracking-widest text-accent-terracotta font-bold">Required Reference</span>
                            <button onClick={() => handleCopy('Wedding - [Your Name]', 'rev-ref')} className="text-[8px] font-bold text-accent-terracotta uppercase">{copiedId === 'rev-ref' ? 'Copied' : 'Copy'}</button>
                         </div>
                         <span className="text-[10px] font-bold text-accent-terracotta">Wedding - [Your Name]</span>
                      </div>
                    </div>
                  )}
                  <a href="https://revolut.me/lamaloay" target="_blank" rel="noopener noreferrer" className="btn-secondary w-full py-3 text-[9px] flex items-center justify-center gap-2">
                    Open In Revolut App <ExternalLink size={12} />
                  </a>
               </div>
            </div>

            {/* 2. LOCAL OPTIONS (Filtered by region) */}
            {activeRegion === 'france' && renderLocalCard('France', 'BoursoBank', 'Lama Loay', 'FR76 4061 8803 3500 0402 2902 922', 'BOUS FRPP XXX')}
            
            {activeRegion === 'switzerland' && (
              <>
                {renderLocalCard('Switzerland', 'UBS', 'Lama Loay', 'CH16 0021 5215 1631 0340 Y', 'UBSWCHZH80A')}
                {renderLocalCard('Switzerland', 'TWINT', 'Lama Loay', '+41 76 701 34 52', '', true)}
              </>
            )}

            {/* International helper for non-revolut? */}
            {activeRegion === 'international' && (
               <div className="wedding-card bg-[#F5EFEB]/30 p-8 flex flex-col items-center justify-center border border-border/10 text-center col-span-full md:col-span-1">
                  <Globe className="text-accent-terracotta/40 mb-6" size={40} strokeWidth={1} />
                  <p className="text-lg italic text-primary-text mb-4">Global Guest?</p>
                  <p className="text-xs text-secondary-text leading-relaxed max-w-[220px] italic">
                    The Revolut Hub is our primary destination for international transfers. Safe, instant, and borderless.
                  </p>
               </div>
            )}
          </div>
        </section>

        {/* 5. PHYSICAL PATH: IN-PERSON */}
        <section className="reveal pb-16">
          <div className="max-w-3xl mx-auto">
            <div className="wedding-card bg-[#F5EFEB]/40 backdrop-blur-sm border-2 border-dashed border-accent-terracotta/20 p-12 md:p-20 flex flex-col items-center text-center group hover:bg-white hover:border-accent-terracotta/40 transition-all duration-1000 shadow-sm relative overflow-visible">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-white border border-border/10 flex items-center justify-center text-accent-terracotta shadow-xl rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                 <Heart size={32} strokeWidth={1.25} />
              </div>

              <div className="max-w-xl mx-auto space-y-8">
                <div className="flex flex-col items-center gap-4">
                  <span className="label-uppercase tracking-[0.4em] opacity-60">Traditional Gestures</span>
                  <h3 className="text-4xl md:text-6xl font-serif italic text-primary-text">In-Person Wishes</h3>
                </div>
                <div className="w-16 h-px bg-accent-terracotta/20 mx-auto" />
                <p className="text-xl md:text-2xl text-secondary-text italic leading-relaxed font-serif max-w-lg mx-auto">
                  "For those who prefer a more traditional gesture, we will have a collection box available at the venue terrace throughout the celebration."
                </p>
                <div className="pt-6 flex flex-col items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent-terracotta/20" />
                  <span className="label-uppercase text-[10px] opacity-40">Castillo de Monda</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* FINAL RSVP CTA */}
      <section className="bg-background py-32 px-6 border-t border-border/10">
        <div className="max-w-2xl mx-auto text-center reveal">
          <span className="label-uppercase mb-6 block font-bold">Primary Action</span>
          <h2 className="text-4xl md:text-5xl font-serif text-primary-text mb-8 italic">Return to RSVP</h2>
          <p className="text-xl text-secondary-text font-serif italic mb-12 opacity-80 leading-relaxed">
            "Once you have explored our story, kindly finalize your plans by submitting your RSVP."
          </p>
          <Link to="/rsvp" className="btn-primary inline-flex shadow-xl px-12">
             Go to RSVP
          </Link>
        </div>
      </section>

    </div>
  );

  function renderDetailRowSmall(label: string, value: string, copyId?: string) {
    return (
      <div className="flex flex-col gap-1 text-left border-b border-border/5 pb-3">
        <div className="flex justify-between items-center">
          <span className="text-[8px] uppercase tracking-widest text-secondary-text font-bold opacity-60">{label}</span>
          {copyId && (
            <button onClick={() => handleCopy(value, copyId)} className="text-[8px] uppercase tracking-widest text-accent-terracotta font-bold hover:underline">
              {copiedId === copyId ? 'Copied' : 'Copy'}
            </button>
          )}
        </div>
        <span className="text-xs font-serif text-primary-text font-medium break-all">{value}</span>
      </div>
    );
  }

  function renderReferenceBlock(id: string) {
    return (
      <div className="bg-accent-terracotta/[0.03] p-4 rounded-xl border border-accent-terracotta/20 mt-4 text-left">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[9px] uppercase tracking-widest text-accent-terracotta font-bold">Required Reference</span>
          <button onClick={() => handleCopy('Wedding - [Your Name]', id)} className="text-[8px] font-bold text-accent-terracotta uppercase">
            {copiedId === id ? 'Copied' : 'Copy'}
          </button>
        </div>
        <span className="text-xs font-bold text-accent-terracotta">Wedding - [Your Name]</span>
      </div>
    );
  }

  function renderDetailRow(label: string, value: string, copyId?: string) {
    return (
      <div className="flex flex-col gap-1 text-left border-b border-border/10 pb-4">
        <div className="flex justify-between items-end">
          <span className="text-[9px] uppercase tracking-widest text-secondary-text font-bold opacity-60">{label}</span>
          {copyId && (
            <button onClick={() => handleCopy(value, copyId)} className="text-[8px] uppercase tracking-widest text-accent-terracotta font-bold hover:underline">
              {copiedId === copyId ? 'Copied' : 'Copy'}
            </button>
          )}
        </div>
        <span className="text-sm md:text-base font-serif text-primary-text font-medium">{value}</span>
      </div>
    );
  }

  function renderLocalCard(region: string, bank: string, holder: string, ival: string, bic: string, isTwint = false) {
    const isShowing = showDetails === bank;
    return (
      <div className="wedding-card bg-white border border-border/10 p-0 flex flex-col group hover:border-accent-terracotta/20 transition-all duration-700 text-left overflow-hidden">
        <div className="bg-[#FBF9F4] p-6 border-b border-border/10">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-accent-terracotta">{region}</span>
            {isTwint ? <Smartphone size={20} className="text-accent-terracotta/30" /> : <CreditCard size={20} className="text-accent-terracotta/30" />}
          </div>
          <div className="flex items-end justify-between gap-4">
             <div className="flex flex-col gap-1">
                <h3 className="text-2xl font-serif italic text-primary-text">{bank}</h3>
                <button 
                  onClick={() => setShowDetails(isShowing ? null : bank)}
                  className="text-[9px] uppercase tracking-widest text-accent-terracotta font-bold underline underline-offset-4 decoration-accent-terracotta/30 hover:decoration-accent-terracotta transition-all text-left"
                >
                  {isShowing ? 'Hide Details' : 'Show Details'}
                </button>
             </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
           <div className="flex flex-col items-start gap-1 pb-4 border-b border-border/5">
             <span className="text-[9px] uppercase tracking-widest text-secondary-text font-bold opacity-60">Account Holder</span>
             <span className="text-xl font-serif italic text-primary-text">{holder}</span>
           </div>
           
           <div className={`space-y-6 transition-all duration-700 overflow-hidden ${isShowing ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
              <div className="flex flex-col items-start gap-2">
                <div className="flex justify-between w-full">
                  <span className="text-[9px] uppercase tracking-widest text-secondary-text font-bold">{isTwint ? 'Number' : 'IBAN'}</span>
                  <button onClick={() => handleCopy(ival, bank + '-num')} className="text-[9px] text-accent-terracotta uppercase font-bold hover:underline">{copiedId === bank + '-num' ? 'Copied' : 'Copy'}</button>
                </div>
                <span className="text-xs font-mono break-all bg-[#FBF9F4] p-4 rounded-xl w-full border border-border/10 leading-relaxed shadow-sm">
                  {ival}
                </span>
              </div>
              {!isTwint && bic && (
                <div className="flex justify-between items-center py-4 border-t border-border/10">
                  <span className="text-[9px] uppercase tracking-widest text-secondary-text font-bold">BIC / SWIFT</span>
                  <span className="text-sm font-bold font-mono text-primary-text">{bic}</span>
                </div>
              )}
              {!isTwint && renderReferenceBlock(bank + '-ref')}
           </div>
        </div>
      </div>
    );
  }
}