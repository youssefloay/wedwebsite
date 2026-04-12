import { Link } from "react-router";
import { Heart, Globe, CreditCard, Copy, Check, Smartphone, Info, Sparkles, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

type Region = 'international' | 'france' | 'switzerland';

export function GiftsPage() {
  const [activeRegion, setActiveRegion] = useState<Region>('france');
  const [revolutMode, setRevolutMode] = useState<'tag' | 'iban' | 'chf'>('tag');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const regions = [
    { id: 'france', label: 'France', icon: <MapPin size={16} /> },
    { id: 'switzerland', label: 'Switzerland', icon: <MapPin size={16} /> },
    { id: 'international', label: 'International', icon: <Globe size={16} /> }
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
          <div className="wedding-card bg-[#F5EFEB]/50 backdrop-blur-sm border-accent-terracotta/20 text-center py-16 px-8 md:px-16 hover:-translate-y-2 transition-all duration-700">
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

      {/* 3. FUNDS */}
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

        {/* 4. THE TWO PATHS: DIGITAL & PHYSICAL */}
        <div className="space-y-32">
          
          {/* DIGITAL PATH: REVOLUT */}
          <section className="reveal">
            <div className="flex flex-col items-center mb-12">
              <div className="flex items-center gap-3 mb-4">
                <Smartphone size={20} className="text-accent-terracotta" strokeWidth={1.25} />
                <span className="label-uppercase font-bold">Digital Transfer</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif text-primary-text mb-6 italic">The Revolut Hub</h2>
              <div className="w-16 h-px bg-accent-terracotta/20" />
            </div>

            <div className="wedding-card bg-white border border-border/10 p-0 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-1000 max-w-4xl mx-auto">
              <div className="flex border-b border-border/10 bg-[#FBF9F4] overflow-x-auto no-scrollbar">
                <button onClick={() => setRevolutMode('tag')} className={`flex-1 min-w-[120px] py-6 text-[11px] uppercase tracking-[0.2em] font-bold transition-all ${revolutMode === 'tag' ? 'text-accent-terracotta bg-white border-b-2 border-accent-terracotta shadow-sm' : 'text-secondary-text opacity-60'}`}>Revolut Tag</button>
                <button onClick={() => setRevolutMode('iban')} className={`flex-1 min-w-[120px] py-6 text-[11px] uppercase tracking-[0.2em] font-bold transition-all ${revolutMode === 'iban' ? 'text-accent-terracotta bg-white border-b-2 border-accent-terracotta shadow-sm' : 'text-secondary-text opacity-60'}`}>Euro IBAN</button>
              </div>

              <div className="p-8 md:p-20 min-h-[400px] flex items-center justify-center">
                {revolutMode === 'tag' ? (
                  <div className="flex flex-col items-center gap-8 animate-in fade-in zoom-in-95 duration-700 text-center">
                    <span className="text-5xl md:text-7xl font-serif text-primary-text italic tracking-tight">@lamaloay</span>
                    <div className="flex flex-col gap-4">
                      <button onClick={() => handleCopy('@lamaloay', 'rev-tag')} className={`btn-primary px-16 py-4 rounded-full text-xs transition-all ${copiedId === 'rev-tag' ? 'bg-green-500' : 'shadow-lg hover:shadow-accent-terracotta/20'}`}>
                        {copiedId === 'rev-tag' ? 'Tag Copied!' : 'Copy Tag to Clipboard'}
                      </button>
                      <a 
                        href="https://revolut.me/lamaloay" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] uppercase tracking-widest text-accent-terracotta font-bold flex items-center justify-center gap-2 hover:underline"
                      >
                        Open in Revolut App <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in-95 duration-700">
                    <div className="space-y-6">
                      {renderDetailRow('Beneficiary', 'LAMA LOAY')}
                      {renderDetailRow('Euro IBAN', 'LT18 3250 0331 5970 5728', 'rev-euro-iban')}
                      {renderDetailRow('BIC / SWIFT', 'REVOLT21', 'rev-euro-bic')}
                    </div>
                    {renderReferenceBlock('rev-euro-ref')}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* PHYSICAL PATH: IN-PERSON */}
          <section className="reveal pb-16">
            <div className="max-w-3xl mx-auto">
              <div className="wedding-card bg-[#F5EFEB]/40 backdrop-blur-sm border-2 border-dashed border-accent-terracotta/20 p-12 md:p-20 flex flex-col items-center text-center group hover:bg-white hover:border-accent-terracotta/40 transition-all duration-1000 shadow-sm relative overflow-visible">
                {/* Visual anchor icon */}
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
      </div>

      {/* FINAL RSVP CTA */}
      <section className="bg-background py-32 px-6 border-t border-border/10">
        <div className="max-w-2xl mx-auto text-center reveal">
          <span className="label-uppercase mb-6 block font-bold">Primary Action</span>
          <h2 className="text-4xl md:text-5xl font-serif text-primary-text mb-8 italic">Return to RSVP</h2>
          <p className="text-xl text-secondary-text font-serif italic mb-12 opacity-80 leading-relaxed">
            "Once you have explored our story, kindly finalize your plans by submitting your RSVP."
          </p>
          <Link to="/rsvp" className="btn-primary inline-flex shadow-xl">
             Go to RSVP
          </Link>
        </div>
      </section>

    </div>
  );

  function renderReferenceBlock(id: string) {
    return (
      <div className="bg-accent-terracotta/[0.03] p-4 rounded-xl border border-accent-terracotta/20 mt-4">
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

  function renderLocalCard(region: string, bank: string, holder: string, ival: string, bic: string, address?: string, isTwint = false) {
    const isShowing = showDetails === bank;
    return (
      <div className="wedding-card bg-white border border-border/10 p-8 flex flex-col group hover:border-accent-terracotta/20 transition-all duration-700 text-left">
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col items-start gap-1">
            <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-accent-terracotta">{region}</span>
            <h3 className="text-2xl font-serif italic">{bank}</h3>
          </div>
          {isTwint ? <Smartphone size={24} className="text-accent-terracotta/30" /> : <CreditCard size={24} className="text-accent-terracotta/30" />}
        </div>
        <div className="space-y-5">
           <div className="flex flex-col items-start border-b border-border/5 pb-3 w-full">
             <span className="text-[9px] uppercase tracking-widest text-secondary-text mb-1">Holder</span>
             <span className="text-sm font-medium">{holder}</span>
           </div>
           <div className={`space-y-4 transition-all duration-700 overflow-hidden ${isShowing ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
              <div className="flex flex-col items-start gap-1">
                <div className="flex justify-between w-full">
                  <span className="text-[9px] uppercase tracking-widest text-secondary-text">{isTwint ? 'Number' : 'IBAN'}</span>
                  <button onClick={() => handleCopy(ival, bank + '-num')} className="text-[8px] text-accent-terracotta uppercase font-bold">{copiedId === bank + '-num' ? 'Copied' : 'Copy'}</button>
                </div>
                <span className="text-xs font-mono break-all bg-[#FBF9F4] p-3 rounded-lg w-full border border-border/10">{ival}</span>
              </div>
              {!isTwint && bic && (
                <div className="flex justify-between items-center py-2 border-t border-border/10">
                  <span className="text-[9px] uppercase tracking-widest text-secondary-text">BIC/SWIFT</span>
                  <span className="text-xs font-bold font-mono">{bic}</span>
                </div>
              )}
              {!isTwint && renderReferenceBlock(bank + '-ref')}
              {address && <p className="text-[9px] italic text-secondary-text mt-2">{address}</p>}
           </div>
           <button onClick={() => setShowDetails(isShowing ? null : bank)} className="w-full py-4 border border-border/10 rounded-2xl text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-accent-terracotta hover:text-white transition-all shadow-sm">
              {isShowing ? 'Hide Details' : `Show ${bank} Details`}
           </button>
        </div>
      </div>
    );
  }
}

const ExternalLink = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
);