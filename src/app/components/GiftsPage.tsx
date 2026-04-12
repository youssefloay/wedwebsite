import { Link } from "react-router";
import { Heart, Globe, CreditCard, Copy, Check, Smartphone, Info, Sparkles, MapPin, ExternalLink, ChevronDown, Landmark } from 'lucide-react';
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

  // 1. HELPER: Reference Block
  function renderReferenceBlock(id: string) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-accent-terracotta/[0.04] p-5 rounded-3xl border border-accent-terracotta/10 mt-6 relative overflow-hidden group/ref text-left"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-accent-terracotta/[0.03] rounded-full blur-3xl -mr-12 -mt-12 group-hover/ref:bg-accent-terracotta/5 transition-colors duration-1000" />
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] uppercase tracking-[0.3em] text-accent-terracotta font-bold">Required Reference</span>
          <button 
            onClick={() => handleCopy('Wedding - [Your Name]', id)} 
            className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full transition-all duration-300 ${copiedId === id ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'text-accent-terracotta border border-accent-terracotta/20 hover:bg-accent-terracotta hover:text-white'}`}
          >
            {copiedId === id ? 'Copied' : 'Copy'}
          </button>
        </div>
        <span className="text-sm font-bold text-accent-terracotta font-mono uppercase tracking-tight block">Wedding - <span className="underline decoration-dotted underline-offset-4 opacity-60 text-[10px]">[Your Name]</span></span>
      </motion.div>
    );
  }

  // 2. HELPER: Small Detail Row
  function renderDetailRowSmall(label: string, value: string, copyId?: string) {
    return (
      <div className="flex flex-col gap-2 py-5 border-b border-border/5 group/row text-left">
        <div className="flex justify-between items-center">
          <span className="text-[10px] uppercase tracking-[0.3em] text-secondary-text font-bold opacity-40">{label}</span>
          {copyId && (
            <button 
              onClick={() => handleCopy(value, copyId)} 
              className={`text-[9px] uppercase tracking-widest font-bold transition-all duration-300 ${copiedId === copyId ? 'text-green-500' : 'text-accent-terracotta opacity-0 group-hover/row:opacity-100'}`}
            >
              {copiedId === copyId ? 'Copied' : 'Copy'}
            </button>
          )}
        </div>
        <span className="text-sm md:text-base font-serif text-primary-text italic opacity-80 break-all">{value}</span>
      </div>
    );
  }

  // 3. HELPER: Local Card (Drawer)
  function renderLocalCard(region: string, bank: string, holder: string, ival: string, bic: string, isTwint = false) {
    const isOpen = activeProvider === bank;
    return (
      <div className={`group wedding-card bg-white border h-full transition-all duration-1000 overflow-hidden ${isOpen ? 'shadow-2xl border-accent-terracotta/20 ring-1 ring-accent-terracotta/10' : 'hover:border-accent-terracotta/20 shadow-sm'}`}>
         <button 
           onClick={() => handleProviderToggle(bank)}
           className={`w-full p-8 flex justify-between items-center text-left transition-colors duration-700 ${isOpen ? 'bg-[#FBF9F4]/40' : ''}`}
         >
            <div className="space-y-2">
               <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-accent-terracotta/[0.05] flex items-center justify-center text-accent-terracotta group-hover:scale-110 transition-transform duration-700">
                      {isTwint ? <Smartphone size={16} /> : <Landmark size={16} />}
                   </div>
                   <span className="label-uppercase text-[10px] tracking-[0.3em] opacity-40">{region} Destination</span>
               </div>
               <h3 className={`text-2xl md:text-4xl font-serif italic transition-all duration-700 ${isOpen ? 'text-accent-terracotta' : 'text-primary-text'}`}>{bank}</h3>
            </div>
            <div className={`w-12 h-12 rounded-full border border-border/10 flex items-center justify-center transition-all duration-700 ${isOpen ? 'rotate-180 bg-accent-terracotta text-white border-accent-terracotta shadow-lg' : 'text-secondary-text group-hover:border-accent-terracotta/30 group-hover:text-accent-terracotta'}`}>
               <ChevronDown size={22} strokeWidth={1} />
            </div>
         </button>

         <AnimatePresence>
            {isOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative overflow-hidden"
              >
                 <div className="px-10 pb-16 pt-6 border-t border-border/5 space-y-10 relative bg-[#FBF9F4]/20 text-left">
                    <div className="flex flex-col items-start gap-2 pb-6 border-b-2 border-accent-terracotta/5">
                       <span className="text-[10px] uppercase tracking-[0.4em] text-secondary-text font-bold opacity-40">Recipient</span>
                       <span className="text-2xl md:text-3xl font-serif italic text-primary-text leading-tight">{holder}</span>
                    </div>
                    
                    <div className="space-y-4">
                       <div className="flex flex-col items-start gap-3">
                          <div className="flex justify-between w-full items-baseline">
                            <span className="text-[10px] uppercase tracking-[0.4em] text-secondary-text font-bold opacity-40">{isTwint ? 'Mobile Number' : 'Full IBAN'}</span>
                            <button 
                              onClick={() => handleCopy(ival, bank + '-num')} 
                              className={`text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300 border-b border-transparent hover:border-accent-terracotta ${copiedId === bank + '-num' ? 'text-green-500' : 'text-accent-terracotta'}`}
                            >
                              {copiedId === bank + '-num' ? 'Copied' : 'Copy Full'}
                            </button>
                          </div>
                          <div className="w-full relative group/iban">
                             <div className="absolute inset-0 bg-accent-terracotta/[0.02] rounded-2xl blur-xl group-hover/iban:bg-accent-terracotta/[0.05] transition-all duration-700" />
                             <span className="relative block text-xs md:text-sm font-mono break-all bg-white p-5 rounded-2xl w-full border border-accent-terracotta/10 shadow-sm leading-relaxed tracking-wider italic">
                                {ival}
                             </span>
                          </div>
                       </div>
                       
                       {!isTwint && bic && (
                          <div className="flex justify-between items-center py-6 border-t border-border/5">
                            <span className="text-[10px] uppercase tracking-[0.4em] text-secondary-text font-bold opacity-40">BIC / SWIFT CODE</span>
                            <span className="text-sm md:text-base font-bold font-mono text-primary-text tracking-widest">{bic}</span>
                          </div>
                       )}
                       
                       {!isTwint && renderReferenceBlock(bank + '-ref')}
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
      
      {/* 1. HERO */}
      <section className="relative pt-16 pb-0 px-6 overflow-hidden text-center section-layer-1 border-b border-border/10">
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("/arch-pattern.png")', backgroundSize: '400px' }} />
        <div className="relative z-10 max-w-3xl mx-auto reveal">
          <span className="label-uppercase mb-6 block tracking-[0.5em] text-accent-terracotta">Registry</span>
          <h1 className="text-5xl md:text-8xl font-serif text-primary-text mb-8 leading-none italic tracking-tighter">Our Future</h1>
          <p className="text-xl md:text-2xl font-serif text-secondary-text italic leading-relaxed max-w-2xl mx-auto px-4 opacity-60">
            "Your presence is the greatest gift."
          </p>
          <div className="w-16 h-px mx-auto my-12 bg-accent-terracotta/30" />
        </div>
      </section>

      {/* 2. THE NOTE */}
      <section className="px-6 pb-24 bg-background reveal">
        <div className="max-w-4xl mx-auto">
          <div className="wedding-card bg-[#FBF9F4]/40 backdrop-blur-xl border border-accent-terracotta/20 text-center py-20 px-8 md:px-20 hover:-translate-y-2 transition-all duration-1000 shadow-xl relative overflow-hidden group">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-[3000ms]" style={{ backgroundImage: 'url("/noise.png")' }} />
            <div className="max-w-2xl mx-auto space-y-10 relative z-10">
              <h2 className="text-4xl md:text-5xl font-serif text-primary-text italic leading-tight">A Heartfelt Note</h2>
              <div className="w-8 h-px bg-accent-terracotta/40 mx-auto" />
              <p className="text-2xl md:text-3xl text-secondary-text leading-relaxed font-serif italic opacity-70">
                We are incredibly fortunate to already have a home filled with everything we could possibly need. 
              </p>
              <p className="text-lg md:text-xl text-secondary-text leading-relaxed font-serif px-4 opacity-60">
                Should you wish to honor us with a gesture, a <span className="text-accent-terracotta underline decoration-accent-terracotta/30 underline-offset-8 font-bold italic">monetary contribution</span> towards buying our future sanctuary and our upcoming adventures would be most appreciated.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DYNAMIC TRANSFERS (Editorial UI) */}
      <div className="max-w-5xl mx-auto px-6 py-32 space-y-16">
        
        {/* REGION SELECTION PANEL */}
        <section className="flex flex-col items-center gap-14 mb-24 relative">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-t from-accent-terracotta/20 to-transparent" />
          <div className="flex flex-col items-center gap-6 text-center reveal">
             <span className="label-uppercase tracking-[0.5em] text-accent-terracotta font-bold text-[10px]">Step I</span>
             <h2 className="text-4xl md:text-6xl font-serif text-primary-text italic tracking-tight">International Logistics</h2>
             <p className="text-sm text-secondary-text italic opacity-60 max-w-sm tracking-wide leading-relaxed">Please select your region to unlock the most convenient transfer methods.</p>
          </div>
          
          <div className="bg-white p-2 rounded-full border border-border/10 flex gap-2 shadow-2xl relative overflow-hidden isolate w-full max-w-lg">
            {regions.map((region) => (
              <button
                key={region.id}
                onClick={() => {
                   setActiveRegion(region.id as Region);
                   setActiveProvider(null);
                }}
                className={`flex-1 relative px-6 md:px-10 py-5 rounded-full text-[10px] md:text-[12px] uppercase font-bold tracking-[0.3em] transition-all duration-700 whitespace-nowrap ${
                  activeRegion === region.id ? 'text-white' : 'text-secondary-text hover:text-accent-terracotta'
                }`}
              >
                {activeRegion === region.id && (
                  <motion.div
                    layoutId="activeRegionTabTargetFinalUI"
                    className="absolute inset-0 bg-accent-terracotta rounded-full z-[-1] shadow-xl shadow-accent-terracotta/20"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.15, duration: 0.8 }}
                  />
                )}
                {region.label}
              </button>
            ))}
          </div>
        </section>

        {/* PROVIDER STACK (DRAWER STYLE) */}
        <div className="space-y-8 reveal">
          
          {/* A. REVOLUT (Dynamic Hub) */}
          <div className={`group wedding-card bg-white border transition-all duration-1000 overflow-hidden ${activeProvider === 'revolut' ? 'shadow-2xl border-accent-terracotta/20 ring-1 ring-accent-terracotta/10' : 'hover:border-accent-terracotta/20 shadow-sm'}`}>
             <button 
               onClick={() => handleProviderToggle('revolut')}
               className={`w-full p-8 md:p-12 flex justify-between items-center text-left transition-colors duration-700 ${activeProvider === 'revolut' ? 'bg-[#FBF9F4]/40' : ''}`}
             >
                <div className="space-y-2">
                   <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-accent-terracotta/[0.05] flex items-center justify-center text-accent-terracotta group-hover:scale-110 transition-transform duration-700">
                          <Sparkles size={16} />
                       </div>
                       <span className="label-uppercase text-[10px] tracking-[0.3em] opacity-40">Modern Global</span>
                   </div>
                   <h3 className={`text-2xl md:text-5xl font-serif italic transition-all duration-700 ${activeProvider === 'revolut' ? 'text-accent-terracotta tracking-tight' : 'text-primary-text'}`}>Revolut Hub</h3>
                </div>
                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full border border-border/10 flex items-center justify-center transition-all duration-700 ${activeProvider === 'revolut' ? 'rotate-180 bg-accent-terracotta text-white border-accent-terracotta shadow-xl' : 'text-secondary-text group-hover:border-accent-terracotta/30 group-hover:text-accent-terracotta'}`}>
                   <ChevronDown size={28} strokeWidth={1} />
                </div>
             </button>

             <AnimatePresence>
               {activeProvider === 'revolut' && (
                 <motion.div 
                   initial={{ height: 0, opacity: 0 }}
                   animate={{ height: 'auto', opacity: 1 }}
                   exit={{ height: 0, opacity: 0 }}
                   transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                 >
                    <div className="px-8 md:px-12 pb-20 pt-8 border-t border-border/5 space-y-12 overflow-hidden text-left bg-[#FBF9F4]/20 relative">
                       <div className="absolute inset-0 opacity-[0.01] pointer-events-none" style={{ backgroundImage: 'url("/noise.png")' }} />
                       
                       <div className="bg-white p-2 rounded-2xl border border-accent-terracotta/10 flex gap-2 shadow-inner relative overflow-hidden isolate w-full max-w-md mx-6 md:mx-0">
                         <button onClick={() => setRevolutMode('tag')} className={`flex-1 relative py-4 rounded-xl text-[10px] uppercase font-bold tracking-[0.2em] transition-all duration-700 ${revolutMode === 'tag' ? 'text-accent-terracotta shadow-sm bg-[#FBF9F4]' : 'text-secondary-text opacity-40 hover:opacity-100'}`}>Tag</button>
                         {activeRegion !== 'switzerland' && <button onClick={() => setRevolutMode('iban')} className={`flex-1 relative py-4 rounded-xl text-[10px] uppercase font-bold tracking-[0.2em] transition-all duration-700 ${revolutMode === 'iban' ? 'text-accent-terracotta shadow-sm bg-[#FBF9F4]' : 'text-secondary-text opacity-40 hover:opacity-100'}`}>EURO</button>}
                         {activeRegion === 'switzerland' && <button onClick={() => setRevolutMode('chf')} className={`flex-1 relative py-4 rounded-xl text-[10px] uppercase font-bold tracking-[0.2em] transition-all duration-700 ${revolutMode === 'chf' ? 'text-accent-terracotta shadow-sm bg-[#FBF9F4]' : 'text-secondary-text opacity-40 hover:opacity-100'}`}>CHF</button>}
                       </div>

                       <div className="min-h-[340px] flex items-center justify-center pt-8 reveal">
                          {revolutMode === 'chf' && activeRegion === 'switzerland' ? (
                            <div className="w-full max-w-md space-y-8 animate-in slide-in-from-bottom-4 duration-1000">
                               {renderDetailRowSmall('Recipient Name', 'Revolut Bank UAB')}
                               <div className="relative group/iban">
                                  <div className="absolute inset-0 bg-accent-terracotta/[0.02] rounded-2xl blur-xl" />
                                  {renderDetailRowSmall('Swiss CHF IBAN', 'CH44 0900 0W0C 1638 5407 7', 'rev-chf-iban')}
                               </div>
                               <div className="bg-accent-terracotta/[0.04] p-6 rounded-3xl border border-accent-terracotta/20 relative overflow-hidden group/ref text-left">
                                  <div className="flex justify-between items-center mb-3">
                                    <span className="text-[10px] uppercase tracking-[0.3em] text-accent-terracotta font-bold">Required Reference</span>
                                    <button onClick={() => handleCopy('LAMA LOAY, CH', 'rev-chf-ref')} className={`text-[9px] font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-all duration-300 ${copiedId === 'rev-chf-ref' ? 'bg-green-500 text-white' : 'text-accent-terracotta border border-accent-terracotta/20 hover:bg-accent-terracotta hover:text-white'}`}>
                                      {copiedId === 'rev-chf-ref' ? 'Copied' : 'Copy'}
                                    </button>
                                  </div>
                                  <span className="text-xl font-bold text-accent-terracotta font-mono tracking-tighter underline underline-offset-8 decoration-dotted decoration-accent-terracotta/40">LAMA LOAY, CH</span>
                               </div>
                            </div>
                          ) : revolutMode === 'tag' ? (
                            <div className="flex flex-col items-center gap-12 animate-in zoom-in-95 duration-1000 text-center w-full max-w-lg">
                              <span className="text-6xl md:text-9xl font-serif text-primary-text italic tracking-tighter leading-none px-4 drop-shadow-sm select-all">@lamaloay</span>
                              <div className="flex flex-col gap-6 w-full px-8 relative">
                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-accent-terracotta/20 uppercase text-[9px] tracking-[0.5em] font-bold">Tap To Copy</div>
                                <button onClick={() => handleCopy('@lamaloay', 'rev-tag')} className={`btn-primary px-16 py-6 rounded-full text-[11px] shadow-2xl transition-all duration-700 active:scale-95 ${copiedId === 'rev-tag' ? 'bg-green-600 shadow-green-500/20' : 'bg-primary-text'}`}>
                                  {copiedId === 'rev-tag' ? 'Username Copied!' : 'Copy Username'}
                                </button>
                                <a href="https://revolut.me/lamaloay" target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase tracking-[0.4em] text-accent-terracotta font-bold flex items-center justify-center gap-3 hover:opacity-60 transition-opacity pt-4">
                                  Open Revolut App <ExternalLink size={14} />
                                </a>
                              </div>
                            </div>
                          ) : (
                            <div className="w-full max-w-md space-y-8 animate-in slide-in-from-bottom-4 duration-1000">
                               {renderDetailRowSmall('Recipient Name', 'LAMA LOAY')}
                               <div className="relative group/iban">
                                  <div className="absolute inset-0 bg-accent-terracotta/[0.02] rounded-2xl blur-xl" />
                                  {renderDetailRowSmall('Euro IBAN Account', 'LT18 3250 0331 5970 5728', 'rev-euro-iban')}
                               </div>
                               {renderReferenceBlock('rev-euro-ref')}
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

          {/* C. IN-PERSON WISHES (Unified Choice) */}
          <div className={`group wedding-card bg-white border transition-all duration-1000 overflow-hidden ${activeProvider === 'inperson' ? 'shadow-2xl border-accent-terracotta/20 ring-1 ring-accent-terracotta/10' : 'hover:border-accent-terracotta/20 shadow-sm'}`}>
             <button 
               onClick={() => handleProviderToggle('inperson')}
               className={`w-full p-8 md:p-12 flex justify-between items-center text-left transition-colors duration-700 ${activeProvider === 'inperson' ? 'bg-[#FBF9F4]/40' : ''}`}
             >
                <div className="space-y-2">
                   <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-accent-terracotta/[0.05] flex items-center justify-center text-accent-terracotta group-hover:scale-110 transition-transform duration-700">
                          <Heart size={16} />
                       </div>
                       <span className="label-uppercase text-[10px] tracking-[0.3em] opacity-40">Venue / Physical</span>
                   </div>
                   <h3 className={`text-2xl md:text-5xl font-serif italic transition-all duration-700 ${activeProvider === 'inperson' ? 'text-accent-terracotta tracking-tight' : 'text-primary-text'}`}>In-Person Wishes</h3>
                </div>
                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full border border-border/10 flex items-center justify-center transition-all duration-700 ${activeProvider === 'inperson' ? 'rotate-180 bg-accent-terracotta text-white border-accent-terracotta shadow-xl' : 'text-secondary-text group-hover:border-accent-terracotta/30 group-hover:text-accent-terracotta'}`}>
                   <ChevronDown size={28} strokeWidth={1} />
                </div>
             </button>

             <AnimatePresence>
                {activeProvider === 'inperson' && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  >
                     <div className="px-10 pb-24 pt-12 border-t border-border/5 space-y-12 overflow-hidden text-center relative bg-[#FBF9F4]/20">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-12 bg-gradient-to-b from-accent-terracotta/20 to-transparent" />
                        <div className="max-w-lg mx-auto space-y-10 relative z-10">
                           <p className="text-2xl md:text-4xl text-secondary-text italic leading-relaxed font-serif pt-4 opacity-80 drop-shadow-sm">
                              "For those who prefer a more traditional gesture, we will have a collection box available at the venue terrace throughout the celebration."
                           </p>
                           <div className="pt-8 flex flex-col items-center gap-4">
                              <div className="w-2 h-2 rounded-full bg-accent-terracotta/20 animate-pulse" />
                              <span className="label-uppercase text-[12px] opacity-70 tracking-[0.5em] text-accent-terracotta font-serif">Castillo de Monda</span>
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
      <section className="bg-background py-32 px-6 border-t border-border/10">
        <div className="max-w-2xl mx-auto text-center reveal">
          <span className="label-uppercase mb-6 block font-bold tracking-[0.3em] opacity-40">Next Step</span>
          <h2 className="text-4xl md:text-6xl font-serif text-primary-text mb-8 italic tracking-tight">Return to RSVP</h2>
          <p className="text-xl text-secondary-text font-serif italic mb-16 opacity-60 leading-relaxed max-w-lg mx-auto">
            "Once you have explored our story, kindly finalize your plans by submitting your RSVP."
          </p>
          <Link to="/rsvp" className="btn-primary inline-flex shadow-2xl px-16 py-6 text-[12px] rounded-full hover:scale-105 transition-transform duration-500">
             Go to RSVP
          </Link>
        </div>
      </section>

    </div>
  );
}