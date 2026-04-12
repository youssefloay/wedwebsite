import { Link } from "react-router";
import { Heart, Globe, CreditCard, Copy, Check, Smartphone, Info, Sparkles, MapPin, ExternalLink, ChevronDown, Landmark, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

type Region = 'international' | 'france' | 'switzerland';

export function GiftsPage() {
  const [activeRegion, setActiveRegion] = useState<Region>('france');
  const [revolutMode, setRevolutMode] = useState<'tag' | 'iban' | 'chf'>('tag');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeProvider, setActiveProvider] = useState<string | null>(null);

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

  const handleProviderToggle = (id: string) => {
    setActiveProvider(activeProvider === id ? null : id);
  };

  // 1. HELPER: Compact Detail Snippet
  function renderDetailSnippet(label: string, value: string, copyId?: string) {
    const isCopied = copiedId === copyId;
    return (
      <div className="flex flex-col gap-1.5 py-4 border-b border-border/5 group/row text-left">
        <div className="flex justify-between items-center">
          <span className="text-[10px] uppercase tracking-[0.25em] text-secondary-text font-bold opacity-30">{label}</span>
          {copyId && (
            <button 
              onClick={() => handleCopy(value, copyId)} 
              className={`text-[9px] uppercase tracking-widest font-bold transition-all duration-300 flex items-center gap-1.5 ${isCopied ? 'text-green-500' : 'text-accent-terracotta hover:opacity-100'}`}
            >
              {isCopied ? <Check size={10} strokeWidth={3} /> : <Copy size={10} strokeWidth={2.5} />}
              {isCopied ? 'Copied' : 'Copy'}
            </button>
          )}
        </div>
        <span className="text-xs md:text-sm font-mono text-primary-text leading-relaxed tracking-wider opacity-80 break-all bg-white/40 p-3 rounded-xl border border-border/5 shadow-inner">
           {value}
        </span>
      </div>
    );
  }

  // 2. HELPER: Local Card (Compact Drawer)
  function renderLocalCard(region: string, bank: string, holder: string, ival: string, bic: string, isTwint = false) {
    const isOpen = activeProvider === bank;
    return (
      <div className={`group wedding-card bg-white border transition-all duration-700 overflow-hidden ${isOpen ? 'shadow-xl shadow-accent-terracotta/5 border-accent-terracotta/20' : 'hover:border-accent-terracotta/20 shadow-sm'}`}>
         <button 
           onClick={() => handleProviderToggle(bank)}
           className={`w-full p-6 md:p-8 flex justify-between items-center text-left transition-colors duration-500 ${isOpen ? 'bg-[#FBF9F4]/60' : ''}`}
         >
            <div className="flex items-center gap-4 md:gap-6">
               <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full border flex items-center justify-center transition-all duration-700 ${isOpen ? 'bg-accent-terracotta text-white border-accent-terracotta' : 'bg-white text-accent-terracotta border-accent-terracotta/10 group-hover:bg-accent-terracotta/5'}`}>
                  {isTwint ? <Smartphone size={18} strokeWidth={1.5} /> : <Landmark size={18} strokeWidth={1.5} />}
               </div>
               <div>
                  <span className="block text-[9px] uppercase tracking-[0.3em] text-secondary-text font-bold opacity-40 mb-1">{region} Local</span>
                  <h3 className={`text-xl md:text-2xl font-serif italic transition-all duration-500 ${isOpen ? 'text-accent-terracotta' : 'text-primary-text'}`}>{bank}</h3>
               </div>
            </div>
            <div className={`w-8 h-8 rounded-full border border-border/10 flex items-center justify-center transition-all duration-500 ${isOpen ? 'rotate-180 bg-accent-terracotta/10 text-accent-terracotta' : 'text-secondary-text opacity-40'}`}>
               <ChevronDown size={18} strokeWidth={2} />
            </div>
         </button>

         <AnimatePresence>
            {isOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                 <div className="px-8 pb-10 pt-2 border-t border-border/5 space-y-6 relative bg-[#FBF9F4]/30 text-left overflow-hidden">
                    <div className="flex flex-col gap-1 pb-4 border-b border-border/5">
                       <span className="text-[9px] uppercase tracking-[0.3em] text-secondary-text font-bold opacity-30">Account Holder</span>
                       <span className="text-lg md:text-xl font-serif italic text-primary-text">{holder}</span>
                    </div>
                    
                    <div className="space-y-1">
                       {renderDetailSnippet(isTwint ? 'Mobile Phone' : 'Full IBAN', ival, bank + '-num')}
                       {!isTwint && bic && (
                          <div className="flex justify-between items-center py-4 border-b border-border/5">
                            <span className="text-[10px] uppercase tracking-[0.3em] text-secondary-text font-bold opacity-30">BIC CODE</span>
                            <span className="text-xs md:text-sm font-bold font-mono text-primary-text tracking-widest">{bic}</span>
                          </div>
                       )}
                       
                       {!isTwint && (
                         <div className="bg-accent-terracotta/[0.04] p-4 rounded-2xl border border-accent-terracotta/10 mt-6 relative overflow-hidden group/ref flex items-center justify-between">
                            <div className="space-y-1">
                               <span className="text-[9px] uppercase tracking-[0.3em] text-accent-terracotta font-bold block mb-1">Required Reference</span>
                               <span className="text-xs font-bold text-accent-terracotta font-mono uppercase tracking-tight">Wedding - [Your Name]</span>
                            </div>
                            <button 
                              onClick={() => handleCopy('Wedding - [Your Name]', bank + '-ref')} 
                              className={`p-2 rounded-full transition-all duration-300 ${copiedId === bank + '-ref' ? 'bg-green-500 text-white' : 'bg-accent-terracotta/10 text-accent-terracotta hover:bg-accent-terracotta hover:text-white'}`}
                            >
                               {copiedId === bank + '-ref' ? <Check size={14} /> : <Copy size={14} />}
                            </button>
                         </div>
                       )}
                    </div>
                 </div>
              </motion.div>
            )}
         </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-primary-text font-serif">
      
      {/* 1. HERO - More Refined Padding */}
      <section className="relative pt-10 pb-0 px-6 overflow-hidden text-center section-layer-1 border-b border-border/5">
        <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'url("/arch-pattern.png")', backgroundSize: '400px' }} />
        <div className="relative z-10 max-w-3xl mx-auto reveal">
          <span className="label-uppercase mb-4 block tracking-[0.5em] text-accent-terracotta/60 text-[10px]">Registry</span>
          <h1 className="text-4xl md:text-7xl font-serif text-primary-text mb-6 italic tracking-tighter">Our Future</h1>
          <div className="w-12 h-px mx-auto mb-8 bg-accent-terracotta/20" />
        </div>
      </section>

      {/* 2. THE NOTE */}
      <section className="px-6 pb-20 bg-background reveal">
        <div className="max-w-4xl mx-auto">
          <div className="wedding-card bg-[#FBF9F4]/40 backdrop-blur-xl border border-accent-terracotta/10 text-center py-16 px-8 md:px-16 hover:-translate-y-1 transition-all duration-1000 shadow-sm relative overflow-hidden">
            <div className="max-w-2xl mx-auto space-y-8">
              <h2 className="text-3xl md:text-4xl font-serif text-primary-text italic opacity-80 leading-tight">A Heartfelt Note</h2>
              <p className="text-xl md:text-2xl text-secondary-text leading-relaxed font-serif italic opacity-60">
                We are incredibly fortunate to already have a home filled with everything we could possibly need. 
              </p>
              <p className="text-base text-secondary-text leading-relaxed font-serif px-4 opacity-50">
                Should you wish to honor us with a gesture, a <span className="text-accent-terracotta underline decoration-accent-terracotta/20 underline-offset-8 font-bold italic">monetary contribution</span> towards our future sanctuary and upcoming adventures would be most appreciated.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DYNAMIC TRANSFERS (Refined UI) */}
      <div className="max-w-4xl mx-auto px-6 py-20 space-y-12">
        
        {/* REGION SELECTION PANEL */}
        <section className="flex flex-col items-center gap-10 mb-16 relative">
          <div className="flex flex-col items-center gap-4 text-center">
             <span className="label-uppercase tracking-[0.4em] text-accent-terracotta/60 font-bold text-[9px]">Gifting Logistics</span>
             <h2 className="text-3xl md:text-4xl font-serif text-primary-text italic tracking-tight">Select Your Region</h2>
          </div>
          
          <div className="bg-white/50 backdrop-blur-md p-1.5 rounded-full border border-border/10 flex gap-1 shadow-inner relative overflow-hidden isolate w-full max-w-md">
            {regions.map((region) => (
              <button
                key={region.id}
                onClick={() => {
                   setActiveRegion(region.id as Region);
                   setActiveProvider(null);
                }}
                className={`flex-1 relative px-4 md:px-6 py-4 rounded-full text-[10px] md:text-[11px] uppercase font-bold tracking-[0.2em] transition-all duration-500 whitespace-nowrap ${
                  activeRegion === region.id ? 'text-white' : 'text-secondary-text hover:text-accent-terracotta'
                }`}
              >
                {activeRegion === region.id && (
                  <motion.div
                    layoutId="activeRegionTabRefined"
                    className="absolute inset-0 bg-accent-terracotta rounded-full z-[-1] shadow-lg shadow-accent-terracotta/20"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.1, duration: 0.6 }}
                  />
                )}
                {region.label}
              </button>
            ))}
          </div>
        </section>

        {/* PROVIDER STACK (Compact Drawer Styled) */}
        <div className="max-w-3xl mx-auto space-y-6">
          
          {/* A. REVOLUT (Refined Hub) */}
          <div className={`group wedding-card bg-white border transition-all duration-700 overflow-hidden ${activeProvider === 'revolut' ? 'shadow-xl shadow-accent-terracotta/5 border-accent-terracotta/20' : 'hover:border-accent-terracotta/20 shadow-sm'}`}>
             <button 
               onClick={() => handleProviderToggle('revolut')}
               className={`w-full p-6 md:p-8 flex justify-between items-center text-left transition-colors duration-500 ${activeProvider === 'revolut' ? 'bg-[#FBF9F4]/60' : ''}`}
             >
                <div className="flex items-center gap-4 md:gap-6">
                   <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full border flex items-center justify-center transition-all duration-700 ${activeProvider === 'revolut' ? 'bg-accent-terracotta text-white border-accent-terracotta' : 'bg-white text-accent-terracotta border-accent-terracotta/10 group-hover:bg-accent-terracotta/5'}`}>
                      <Sparkles size={18} strokeWidth={1.5} />
                   </div>
                   <div>
                      <span className="block text-[9px] uppercase tracking-[0.3em] text-secondary-text font-bold opacity-40 mb-1">Modern Global</span>
                      <h3 className={`text-xl md:text-2xl font-serif italic transition-all duration-500 ${activeProvider === 'revolut' ? 'text-accent-terracotta' : 'text-primary-text'}`}>Revolut Hub</h3>
                   </div>
                </div>
                <div className={`w-8 h-8 rounded-full border border-border/10 flex items-center justify-center transition-all duration-500 ${activeProvider === 'revolut' ? 'rotate-180 bg-accent-terracotta/10 text-accent-terracotta' : 'text-secondary-text opacity-40'}`}>
                   <ChevronDown size={18} strokeWidth={2} />
                </div>
             </button>

             <AnimatePresence>
               {activeProvider === 'revolut' && (
                 <motion.div 
                   initial={{ height: 0, opacity: 0 }}
                   animate={{ height: 'auto', opacity: 1 }}
                   exit={{ height: 0, opacity: 0 }}
                   transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                 >
                    <div className="px-8 pb-10 pt-4 border-t border-border/5 space-y-8 overflow-hidden text-left bg-[#FBF9F4]/30 relative">
                       {/* Compact Mode Switcher */}
                       <div className="bg-white p-1 rounded-2xl border border-accent-terracotta/10 flex gap-1 shadow-inner relative overflow-hidden isolate w-full max-w-xs mx-auto md:mx-0">
                         <button onClick={() => setRevolutMode('tag')} className={`flex-1 relative py-3 rounded-xl text-[9px] uppercase font-bold tracking-[0.15em] transition-all duration-500 ${revolutMode === 'tag' ? 'text-accent-terracotta bg-[#FBF9F4] shadow-sm' : 'text-secondary-text opacity-40 hover:opacity-100'}`}>Revolut Tag</button>
                         {activeRegion !== 'switzerland' && <button onClick={() => setRevolutMode('iban')} className={`flex-1 relative py-3 rounded-xl text-[9px] uppercase font-bold tracking-[0.15em] transition-all duration-500 ${revolutMode === 'iban' ? 'text-accent-terracotta bg-[#FBF9F4] shadow-sm' : 'text-secondary-text opacity-40 hover:opacity-100'}`}>Euro IBAN</button>}
                         {activeRegion === 'switzerland' && <button onClick={() => setRevolutMode('chf')} className={`flex-1 relative py-3 rounded-xl text-[9px] uppercase font-bold tracking-[0.15em] transition-all duration-500 ${revolutMode === 'chf' ? 'text-accent-terracotta bg-[#FBF9F4] shadow-sm' : 'text-secondary-text opacity-40 hover:opacity-100'}`}>Swiss CHF</button>}
                       </div>

                       <div className="min-h-[240px] flex items-center justify-center pt-2">
                          {revolutMode === 'chf' && activeRegion === 'switzerland' ? (
                            <div className="w-full max-w-sm space-y-5">
                               {renderDetailSnippet('Recipient Name', 'Revolut Bank UAB')}
                               {renderDetailSnippet('Swiss CHF IBAN', 'CH44 0900 0W0C 1638 5407 7', 'rev-chf-iban')}
                               <div className="bg-accent-terracotta/5 p-4 rounded-xl border border-accent-terracotta/10 flex items-center justify-between">
                                  <div className="space-y-0.5">
                                    <span className="text-[9px] uppercase tracking-[0.3em] text-accent-terracotta font-bold block opacity-60">Required Reference</span>
                                    <span className="text-xs font-bold text-accent-terracotta font-mono tracking-tighter">LAMA LOAY, CH</span>
                                  </div>
                                  <button onClick={() => handleCopy('LAMA LOAY, CH', 'rev-chf-ref')} className={`p-2 rounded-full transition-all duration-300 ${copiedId === 'rev-chf-ref' ? 'bg-green-500 text-white' : 'bg-accent-terracotta text-white'}`}>
                                    {copiedId === 'rev-chf-ref' ? <Check size={14} /> : <Copy size={14} />}
                                  </button>
                               </div>
                            </div>
                          ) : revolutMode === 'tag' ? (
                            <div className="flex flex-col items-center gap-8 text-center w-full max-w-md">
                              <span className="text-4xl md:text-6xl font-serif text-primary-text italic tracking-tighter leading-none opacity-80 select-all">@lamaloay</span>
                              <div className="flex flex-col gap-4 w-full px-10">
                                <button onClick={() => handleCopy('@lamaloay', 'rev-tag')} className={`btn-primary w-full py-4 rounded-full text-[10px] tracking-widest transition-all duration-500 ${copiedId === 'rev-tag' ? 'bg-green-600' : 'bg-primary-text'}`}>
                                  {copiedId === 'rev-tag' ? 'Username Copied!' : 'Copy Username'}
                                </button>
                                <a href="https://revolut.me/lamaloay" target="_blank" rel="noopener noreferrer" className="text-[9px] uppercase tracking-[0.3em] text-accent-terracotta font-bold flex items-center justify-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                                  Open Revolut <ExternalLink size={12} />
                                </a>
                              </div>
                            </div>
                          ) : (
                            <div className="w-full max-w-sm space-y-5">
                               {renderDetailSnippet('Recipient Name', 'LAMA LOAY')}
                               {renderDetailSnippet('Euro IBAN Account', 'LT18 3250 0331 5970 5728', 'rev-euro-iban')}
                               <div className="bg-accent-terracotta/5 p-4 rounded-xl border border-accent-terracotta/10 flex items-center justify-between">
                                  <div className="space-y-0.5">
                                    <span className="text-[9px] uppercase tracking-[0.3em] text-accent-terracotta font-bold block opacity-60">Required Reference</span>
                                    <span className="text-xs font-bold text-accent-terracotta font-mono tracking-tighter">Wedding - [Your Name]</span>
                                  </div>
                                  <button onClick={() => handleCopy('Wedding - [Your Name]', 'rev-euro-ref')} className={`p-2 rounded-full transition-all duration-300 ${copiedId === 'rev-euro-ref' ? 'bg-green-500 text-white' : 'bg-accent-terracotta text-white'}`}>
                                    {copiedId === 'rev-euro-ref' ? <Check size={14} /> : <Copy size={14} />}
                                  </button>
                               </div>
                            </div>
                          )}
                       </div>
                    </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>

          {/* B. LOCAL OPTIONS */}
          {activeRegion === 'france' && renderLocalCard('France', 'BoursoBank', 'Lama Loay', 'FR76 4061 8803 3500 0402 2902 922', 'BOUS FRPP XXX')}
          
          {activeRegion === 'switzerland' && (
            <>
              {renderLocalCard('Switzerland', 'UBS', 'Lama Loay', 'CH16 0021 5215 1631 0340 Y', 'UBSWCHZH80A')}
              {renderLocalCard('Switzerland', 'TWINT', 'Lama Loay', '+41 76 701 34 52', '', true)}
            </>
          )}

          {/* C. IN-PERSON WISHES (Compact Choice) */}
          <div className={`group wedding-card bg-white border transition-all duration-700 overflow-hidden ${activeProvider === 'inperson' ? 'shadow-xl shadow-accent-terracotta/5 border-accent-terracotta/20' : 'hover:border-accent-terracotta/20 shadow-sm'}`}>
             <button 
               onClick={() => handleProviderToggle('inperson')}
               className={`w-full p-6 md:p-8 flex justify-between items-center text-left transition-colors duration-500 ${activeProvider === 'inperson' ? 'bg-[#FBF9F4]/60' : ''}`}
             >
                <div className="flex items-center gap-4 md:gap-6">
                   <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full border flex items-center justify-center transition-all duration-700 ${activeProvider === 'inperson' ? 'bg-accent-terracotta text-white border-accent-terracotta' : 'bg-white text-accent-terracotta border-accent-terracotta/10 group-hover:bg-accent-terracotta/5'}`}>
                      <Heart size={18} strokeWidth={1.5} />
                   </div>
                   <div>
                      <span className="block text-[9px] uppercase tracking-[0.3em] text-secondary-text font-bold opacity-40 mb-1">Venue / Physical</span>
                      <h3 className={`text-xl md:text-2xl font-serif italic transition-all duration-500 ${activeProvider === 'inperson' ? 'text-accent-terracotta' : 'text-primary-text'}`}>In-Person Wishes</h3>
                   </div>
                </div>
                <div className={`w-8 h-8 rounded-full border border-border/10 flex items-center justify-center transition-all duration-500 ${activeProvider === 'inperson' ? 'rotate-180 bg-accent-terracotta/10 text-accent-terracotta' : 'text-secondary-text opacity-40'}`}>
                   <ChevronDown size={18} strokeWidth={2} />
                </div>
             </button>

             <AnimatePresence>
                {activeProvider === 'inperson' && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                     <div className="px-10 pb-16 pt-8 border-t border-border/5 space-y-10 overflow-hidden text-center relative bg-[#FBF9F4]/30">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-accent-terracotta/20 to-transparent" />
                        <div className="max-w-md mx-auto space-y-6 relative z-10">
                           <p className="text-xl md:text-2xl text-secondary-text italic leading-relaxed font-serif pt-4 opacity-70">
                              "For those who prefer a more traditional gesture, we will have a collection box available at the venue terrace throughout the celebration."
                           </p>
                           <div className="pt-4 flex flex-col items-center gap-3">
                              <div className="w-1 h-1 rounded-full bg-accent-terracotta/20" />
                              <span className="label-uppercase text-[10px] opacity-50 tracking-[0.4em] text-accent-terracotta font-serif italic">Castillo de Monda</span>
                           </div>
                        </div>
                     </div>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>
        </div>
      </div>

      {/* FINAL RSVP CTA */}
      <section className="bg-background py-24 px-6 border-t border-border/10">
        <div className="max-w-2xl mx-auto text-center reveal">
          <span className="label-uppercase mb-4 block font-bold tracking-[0.3em] opacity-30 text-[9px]">Submission</span>
          <h2 className="text-3xl md:text-4xl font-serif text-primary-text mb-6 italic tracking-tight opacity-80">Return to RSVP</h2>
          <p className="text-lg text-secondary-text font-serif italic mb-12 opacity-50 leading-relaxed max-w-md mx-auto">
            "We look forward to celebrating with you."
          </p>
          <Link to="/rsvp" className="btn-primary inline-flex px-14 py-5 text-[11px] rounded-full hover:shadow-xl transition-all duration-500">
             Submit RSVP
          </Link>
        </div>
      </section>

    </div>
  );
}

const ExternalLink = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
);