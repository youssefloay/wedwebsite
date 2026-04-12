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
      <div className="flex flex-col gap-1 py-3 border-b border-accent-terracotta/5 group/row text-left">
        <div className="flex justify-between items-center">
          <span className="text-[9px] uppercase tracking-[0.2em] text-secondary-text font-bold opacity-30">{label}</span>
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
        <span className="text-xs md:text-sm font-mono text-primary-text leading-relaxed tracking-wider opacity-80 break-all bg-[#FBF9F4]/40 p-3 rounded-lg border border-accent-terracotta/5 shadow-inner">
           {value}
        </span>
      </div>
    );
  }

  // 2. HELPER: Local Card (Copy Enabled Drawer)
  function renderLocalCard(region: string, bank: string, holder: string, ival: string, bic: string, isTwint = false) {
    const isOpen = activeProvider === bank;
    return (
      <div className={`group wedding-card bg-[#FBF9F4]/80 border transition-all duration-700 overflow-hidden ${isOpen ? 'shadow-xl shadow-accent-terracotta/5 border-accent-terracotta/20 bg-white' : 'hover:border-accent-terracotta/20 shadow-sm border-border/10'}`}>
         <button 
           onClick={() => handleProviderToggle(bank)}
           className={`w-full p-5 md:p-6 flex justify-between items-center text-left transition-colors duration-500 ${isOpen ? 'bg-[#FBF9F4]/60' : ''}`}
         >
            <div className="flex items-center gap-4">
               <div className={`w-9 h-9 md:w-11 md:h-11 rounded-full border flex items-center justify-center transition-all duration-700 ${isOpen ? 'bg-accent-terracotta text-white border-accent-terracotta' : 'bg-white/50 text-accent-terracotta border-accent-terracotta/10 group-hover:bg-accent-terracotta/5'}`}>
                  {isTwint ? <Smartphone size={16} strokeWidth={1.5} /> : <Landmark size={16} strokeWidth={1.5} />}
               </div>
               <div>
                  <span className="block text-[8px] uppercase tracking-[0.25em] text-secondary-text font-bold opacity-40">{region} Local</span>
                  <h3 className={`text-lg md:text-2xl font-serif italic transition-all duration-500 ${isOpen ? 'text-accent-terracotta' : 'text-primary-text'}`}>{bank}</h3>
               </div>
            </div>
            <div className={`w-7 h-7 rounded-full border border-accent-terracotta/10 flex items-center justify-center transition-all duration-500 ${isOpen ? 'rotate-180 bg-accent-terracotta/10 text-accent-terracotta' : 'text-secondary-text opacity-30'}`}>
               <ChevronDown size={14} strokeWidth={2.5} />
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
                 <div className="px-6 pb-8 pt-4 border-t border-accent-terracotta/5 space-y-4 relative bg-[#FBF9F4]/20 text-left overflow-hidden">
                    <div className="flex flex-col gap-1 pb-3 border-b border-accent-terracotta/5">
                       <div className="flex justify-between items-center">
                          <span className="text-[8px] uppercase tracking-[0.3em] text-secondary-text font-bold opacity-30">Account Holder</span>
                          <button 
                            onClick={() => handleCopy(holder, bank + '-holder')} 
                            className={`text-[9px] uppercase font-bold transition-all duration-300 ${copiedId === bank + '-holder' ? 'text-green-500' : 'text-accent-terracotta opacity-60 hover:opacity-100'}`}
                          >
                            {copiedId === bank + '-holder' ? 'Copied' : 'Copy'}
                          </button>
                       </div>
                       <span className="text-base md:text-lg font-serif italic text-primary-text">{holder}</span>
                    </div>
                    
                    <div className="space-y-1">
                       {renderDetailSnippet(isTwint ? 'Mobile Phone' : 'Full IBAN', ival, bank + '-num')}
                       {!isTwint && bic && (
                          <div className="flex flex-col gap-1 py-3 border-b border-accent-terracotta/5">
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] uppercase tracking-[0.3em] text-secondary-text font-bold opacity-30">BIC CODE</span>
                              <button 
                                onClick={() => handleCopy(bic, bank + '-bic')} 
                                className={`text-[9px] uppercase font-bold transition-all duration-300 ${copiedId === bank + '-bic' ? 'text-green-500' : 'text-accent-terracotta opacity-60 hover:opacity-100'}`}
                              >
                                {copiedId === bank + '-bic' ? 'Copied' : 'Copy'}
                              </button>
                            </div>
                            <span className="text-xs font-bold font-mono text-primary-text tracking-widest">{bic}</span>
                          </div>
                       )}
                       
                       {!isTwint && (
                         <div className="bg-accent-terracotta/[0.04] p-3 rounded-xl border border-accent-terracotta/10 mt-4 relative overflow-hidden group/ref flex items-center justify-between shadow-sm">
                            <div className="space-y-0.5">
                               <span className="text-[8px] uppercase tracking-[0.3em] text-accent-terracotta font-bold block opacity-60">Required Reference</span>
                               <span className="text-xs font-bold text-accent-terracotta font-mono uppercase tracking-tight">Wedding - [Your Name]</span>
                            </div>
                            <button 
                              onClick={() => handleCopy('Wedding - [Your Name]', bank + '-ref')} 
                              className={`p-1.5 rounded-full transition-all duration-300 ${copiedId === bank + '-ref' ? 'bg-green-500 text-white' : 'bg-accent-terracotta text-white'}`}
                            >
                               {copiedId === bank + '-ref' ? <Check size={12} /> : <Copy size={12} />}
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
    <div className="min-h-screen bg-[#FBF9F4]/20 text-primary-text font-serif">
      
      {/* 1. HERO */}
      <section className="relative pt-10 pb-0 px-6 overflow-hidden text-center section-layer-1 border-b border-border/5">
        <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'url("/arch-pattern.png")', backgroundSize: '400px' }} />
        <div className="relative z-10 max-w-3xl mx-auto reveal">
          <span className="label-uppercase mb-4 block tracking-[0.5em] text-accent-terracotta/60 text-[9px]">Gifting</span>
          <h1 className="text-3xl md:text-5xl font-serif text-primary-text mb-4 italic tracking-tighter">Support Our Story</h1>
          <div className="w-10 h-px mx-auto mb-6 bg-accent-terracotta/20" />
        </div>
      </section>

      {/* 2. THE NOTE */}
      <section className="px-6 pb-16 bg-background reveal">
        <div className="max-w-4xl mx-auto">
          <div className="wedding-card bg-[#F5EFEB]/50 backdrop-blur-xl border border-accent-terracotta/10 text-center py-12 px-6 md:px-16 hover:-translate-y-1 transition-all duration-1000 shadow-sm relative overflow-hidden">
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-2xl md:text-3xl font-serif text-primary-text italic opacity-80 leading-tight">A Heartfelt Note</h2>
              <p className="text-lg md:text-xl text-secondary-text leading-relaxed font-serif italic opacity-60">
                We are incredibly fortunate to already have a home filled with everything we could possibly need. 
              </p>
              <p className="text-sm text-secondary-text leading-relaxed font-serif px-4 opacity-50">
                Should you wish to honor us with a gesture, a <span className="text-accent-terracotta underline decoration-accent-terracotta/20 underline-offset-8 font-bold italic">monetary contribution</span> towards our future sanctuary would be most appreciated.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DYNAMIC TRANSFERS (Warmer UI) */}
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-10">
        
        {/* REGION SELECTION PANEL */}
        <section className="flex flex-col items-center gap-8 mb-12 relative">
          <div className="flex flex-col items-center gap-3 text-center">
             <span className="label-uppercase tracking-[0.4em] text-accent-terracotta/60 font-bold text-[8px]">Selection</span>
             <h2 className="text-2xl md:text-3xl font-serif text-primary-text italic tracking-tight opacity-90">Select Your Location</h2>
          </div>
          
          <div className="bg-[#F5EFEB]/80 backdrop-blur-md p-1 rounded-full border border-accent-terracotta/10 flex gap-1 shadow-inner relative overflow-hidden isolate w-full max-w-sm">
            {regions.map((region) => (
              <button
                key={region.id}
                onClick={() => {
                   setActiveRegion(region.id as Region);
                   setActiveProvider(null);
                }}
                className={`flex-1 relative px-3 md:px-4 py-3 rounded-full text-[9px] md:text-[10px] uppercase font-bold tracking-[0.2em] transition-all duration-500 whitespace-nowrap ${
                  activeRegion === region.id ? 'text-white' : 'text-secondary-text hover:text-accent-terracotta'
                }`}
              >
                {activeRegion === region.id && (
                  <motion.div
                    layoutId="activeRegionTabWarmerCopy"
                    className="absolute inset-0 bg-accent-terracotta rounded-full z-[-1] shadow-md shadow-accent-terracotta/10"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.1, duration: 0.6 }}
                  />
                )}
                {region.label}
              </button>
            ))}
          </div>
        </section>

        {/* PROVIDER STACK (Warmer Tonal Stack) */}
        <div className="max-w-2xl mx-auto space-y-4">
          
          {/* A. REVOLUT (Refined Hub) */}
          <div className={`group wedding-card bg-[#FBF9F4]/80 border transition-all duration-700 overflow-hidden ${activeProvider === 'revolut' ? 'shadow-xl shadow-accent-terracotta/5 border-accent-terracotta/20 bg-white' : 'hover:border-accent-terracotta/20 shadow-sm border-border/10'}`}>
             <button 
               onClick={() => handleProviderToggle('revolut')}
               className={`w-full p-5 md:p-6 flex justify-between items-center text-left transition-colors duration-500 ${activeProvider === 'revolut' ? 'bg-[#FBF9F4]/60' : ''}`}
             >
                <div className="flex items-center gap-4">
                   <div className={`w-9 h-9 md:w-11 md:h-11 rounded-full border flex items-center justify-center transition-all duration-700 ${activeProvider === 'revolut' ? 'bg-accent-terracotta text-white border-accent-terracotta' : 'bg-white/50 text-accent-terracotta border-accent-terracotta/10 group-hover:bg-accent-terracotta/5'}`}>
                      <Sparkles size={16} strokeWidth={1.5} />
                   </div>
                   <div>
                      <span className="block text-[8px] uppercase tracking-[0.25em] text-secondary-text font-bold opacity-40">Modern Global</span>
                      <h3 className={`text-lg md:text-2xl font-serif italic transition-all duration-500 ${activeProvider === 'revolut' ? 'text-accent-terracotta' : 'text-primary-text'}`}>Revolut Hub</h3>
                   </div>
                </div>
                <div className={`w-7 h-7 rounded-full border border-accent-terracotta/10 flex items-center justify-center transition-all duration-700 ${activeProvider === 'revolut' ? 'rotate-180 bg-accent-terracotta/10 text-accent-terracotta' : 'text-secondary-text opacity-30'}`}>
                   <ChevronDown size={14} strokeWidth={2.5} />
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
                    <div className="px-6 pb-8 pt-3 border-t border-accent-terracotta/5 space-y-6 overflow-hidden text-left bg-[#FBF9F4]/20 relative">
                       {/* Compact Warmer Switcher */}
                       <div className="bg-white/80 p-0.5 rounded-xl border border-accent-terracotta/10 flex gap-0.5 shadow-inner relative overflow-hidden isolate w-full max-w-[280px] mx-auto md:mx-0">
                         <button onClick={() => setRevolutMode('tag')} className={`flex-1 relative py-2.5 rounded-lg text-[8px] uppercase font-bold tracking-[0.15em] transition-all duration-500 ${revolutMode === 'tag' ? 'text-accent-terracotta bg-white shadow-sm' : 'text-secondary-text opacity-40 hover:opacity-100'}`}>Revolut Tag</button>
                         {activeRegion !== 'switzerland' && <button onClick={() => setRevolutMode('iban')} className={`flex-1 relative py-2.5 rounded-lg text-[8px] uppercase font-bold tracking-[0.15em] transition-all duration-500 ${revolutMode === 'iban' ? 'text-accent-terracotta bg-white shadow-sm' : 'text-secondary-text opacity-40 hover:opacity-100'}`}>Euro IBAN</button>}
                         {activeRegion === 'switzerland' && <button onClick={() => setRevolutMode('chf')} className={`flex-1 relative py-2.5 rounded-lg text-[8px] uppercase font-bold tracking-[0.15em] transition-all duration-500 ${revolutMode === 'chf' ? 'text-accent-terracotta bg-white shadow-sm' : 'text-secondary-text opacity-40 hover:opacity-100'}`}>Swiss CHF</button>}
                       </div>

                       <div className="min-h-[220px] flex items-center justify-center pt-1">
                          {revolutMode === 'chf' && activeRegion === 'switzerland' ? (
                            <div className="w-full max-w-sm space-y-4">
                               <div className="flex flex-col gap-1 pb-3 border-b border-accent-terracotta/5">
                                  <div className="flex justify-between items-center">
                                    <span className="text-[8px] uppercase tracking-[0.3em] text-secondary-text font-bold opacity-30">Recipient Name</span>
                                    <button 
                                      onClick={() => handleCopy('Revolut Bank UAB', 'rev-chf-holder')} 
                                      className={`text-[9px] uppercase font-bold transition-all duration-300 ${copiedId === 'rev-chf-holder' ? 'text-green-500' : 'text-accent-terracotta opacity-60 hover:opacity-100'}`}
                                    >
                                      {copiedId === 'rev-chf-holder' ? 'Copied' : 'Copy'}
                                    </button>
                                  </div>
                                  <span className="text-base md:text-lg font-serif italic text-primary-text">Revolut Bank UAB</span>
                               </div>
                               {renderDetailSnippet('Swiss CHF IBAN', 'CH44 0900 0W0C 1638 5407 7', 'rev-chf-iban')}
                               <div className="bg-accent-terracotta/5 p-3 rounded-lg border border-accent-terracotta/10 flex items-center justify-between shadow-sm">
                                  <div className="space-y-0.5">
                                    <span className="text-[8px] uppercase tracking-[0.3em] text-accent-terracotta font-bold block opacity-60">Required Reference</span>
                                    <span className="text-xs font-bold text-accent-terracotta font-mono tracking-tighter">LAMA LOAY, CH</span>
                                  </div>
                                  <button onClick={() => handleCopy('LAMA LOAY, CH', 'rev-chf-ref')} className={`p-1.5 rounded-full transition-all duration-300 ${copiedId === 'rev-chf-ref' ? 'bg-green-500 text-white' : 'bg-accent-terracotta text-white'}`}>
                                    {copiedId === 'rev-chf-ref' ? <Check size={12} /> : <Copy size={12} />}
                                  </button>
                               </div>
                            </div>
                          ) : revolutMode === 'tag' ? (
                            <div className="flex flex-col items-center gap-6 text-center w-full max-w-xs">
                              <span className="text-3xl md:text-5xl font-serif text-primary-text italic tracking-tighter leading-none opacity-80 select-all">@lamaloay</span>
                              <div className="flex flex-col gap-3 w-full px-6">
                                <button onClick={() => handleCopy('@lamaloay', 'rev-tag')} className={`btn-primary w-full py-3 rounded-full text-[9px] tracking-widest transition-all duration-500 ${copiedId === 'rev-tag' ? 'bg-green-600' : 'bg-primary-text'}`}>
                                  {copiedId === 'rev-tag' ? 'Username Copied!' : 'Copy Username'}
                                </button>
                                <a href="https://revolut.me/lamaloay" target="_blank" rel="noopener noreferrer" className="text-[8px] uppercase tracking-[0.3em] text-accent-terracotta font-bold flex items-center justify-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                                  Open Revolut <ExternalLink size={10} />
                                </a>
                              </div>
                            </div>
                          ) : (
                            <div className="w-full max-w-sm space-y-4">
                               <div className="flex flex-col gap-1 pb-3 border-b border-accent-terracotta/5">
                                  <div className="flex justify-between items-center">
                                    <span className="text-[8px] uppercase tracking-[0.3em] text-secondary-text font-bold opacity-30">Recipient Name</span>
                                    <button 
                                      onClick={() => handleCopy('LAMA LOAY', 'rev-euro-holder')} 
                                      className={`text-[9px] uppercase font-bold transition-all duration-300 ${copiedId === 'rev-euro-holder' ? 'text-green-500' : 'text-accent-terracotta opacity-60 hover:opacity-100'}`}
                                    >
                                      {copiedId === 'rev-euro-holder' ? 'Copied' : 'Copy'}
                                    </button>
                                  </div>
                                  <span className="text-base md:text-lg font-serif italic text-primary-text">LAMA LOAY</span>
                               </div>
                               {renderDetailSnippet('Euro IBAN Account', 'LT18 3250 0331 5970 5728', 'rev-euro-iban')}
                               <div className="bg-accent-terracotta/5 p-3 rounded-lg border border-accent-terracotta/10 flex items-center justify-between shadow-sm">
                                  <div className="space-y-0.5">
                                    <span className="text-[8px] uppercase tracking-[0.3em] text-accent-terracotta font-bold block opacity-60">Required Reference</span>
                                    <span className="text-xs font-bold text-accent-terracotta font-mono tracking-tighter">Wedding - [Your Name]</span>
                                  </div>
                                  <button onClick={() => handleCopy('Wedding - [Your Name]', 'rev-euro-ref')} className={`p-1.5 rounded-full transition-all duration-300 ${copiedId === 'rev-euro-ref' ? 'bg-green-500 text-white' : 'bg-accent-terracotta text-white'}`}>
                                    {copiedId === 'rev-euro-ref' ? <Check size={12} /> : <Copy size={12} />}
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

          {/* C. IN-PERSON WISHES (Warmer Stack) */}
          <div className={`group wedding-card bg-[#FBF9F4]/80 border transition-all duration-700 overflow-hidden ${activeProvider === 'inperson' ? 'shadow-xl shadow-accent-terracotta/5 border-accent-terracotta/20 bg-white' : 'hover:border-accent-terracotta/20 shadow-sm border-border/10'}`}>
             <button 
               onClick={() => handleProviderToggle('inperson')}
               className={`w-full p-5 md:p-6 flex justify-between items-center text-left transition-colors duration-500 ${activeProvider === 'inperson' ? 'bg-[#FBF9F4]/60' : ''}`}
             >
                <div className="flex items-center gap-4">
                   <div className={`w-9 h-9 md:w-11 md:h-11 rounded-full border flex items-center justify-center transition-all duration-700 ${activeProvider === 'inperson' ? 'bg-accent-terracotta text-white border-accent-terracotta' : 'bg-white/50 text-accent-terracotta border-accent-terracotta/10 group-hover:bg-accent-terracotta/5'}`}>
                      <Heart size={16} strokeWidth={1.5} />
                   </div>
                   <div>
                      <span className="block text-[8px] uppercase tracking-[0.25em] text-secondary-text font-bold opacity-40">Venue / Physical</span>
                      <h3 className={`text-lg md:text-2xl font-serif italic transition-all duration-500 ${activeProvider === 'inperson' ? 'text-accent-terracotta' : 'text-primary-text'}`}>In-Person Wishes</h3>
                   </div>
                </div>
                <div className={`w-7 h-7 rounded-full border border-accent-terracotta/10 flex items-center justify-center transition-all duration-700 ${activeProvider === 'inperson' ? 'rotate-180 bg-accent-terracotta/10 text-accent-terracotta' : 'text-secondary-text opacity-30'}`}>
                   <ChevronDown size={14} strokeWidth={2.5} />
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
                     <div className="px-8 pb-12 pt-6 border-t border-accent-terracotta/5 space-y-8 overflow-hidden text-center relative bg-[#FBF9F4]/20">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-6 bg-gradient-to-b from-accent-terracotta/20 to-transparent" />
                        <div className="max-w-md mx-auto space-y-5 relative z-10">
                           <p className="text-lg md:text-xl text-secondary-text italic leading-relaxed font-serif pt-2 opacity-70">
                              "For those who prefer a more traditional gesture, we will have a collection box available at the venue terrace."
                           </p>
                           <div className="pt-2 flex flex-col items-center gap-2">
                              <div className="w-1 h-1 rounded-full bg-accent-terracotta/20" />
                              <span className="label-uppercase text-[9px] opacity-40 tracking-[0.3em] text-accent-terracotta font-serif italic">Castillo de Monda</span>
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
      <section className="bg-background py-20 px-6 border-t border-border/5">
        <div className="max-w-xl mx-auto text-center reveal">
          <h2 className="text-2xl md:text-3xl font-serif text-primary-text mb-4 italic tracking-tight opacity-80">Finalize Your Plans</h2>
          <Link to="/rsvp" className="btn-primary inline-flex px-12 py-4 text-[10px] rounded-full hover:shadow-lg transition-all duration-500">
             Submit RSVP
          </Link>
        </div>
      </section>

    </div>
  );
}

const ExternalLink = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40 font-bold"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
);