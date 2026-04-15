import { Link } from "react-router";
import { Heart, Globe, CreditCard, Copy, Check, Smartphone, Info, Sparkles, MapPin, ExternalLink, ChevronDown, Landmark, ArrowRight, PiggyBank } from 'lucide-react';
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

  const SITE_GREEN = '#515C4C'; 
  const SITE_BROWN = '#5C3210'; 

  // 1. HELPER: Unified Detail Row
  function renderDetailRow(label: string, value: string, copyId: string) {
    const isCopied = copiedId === copyId;
    return (
      <div className="group/row flex flex-col gap-1 py-3 border-b border-accent-terracotta/10 last:border-0 text-left relative">
        <div className="flex justify-between items-center px-1">
          <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-secondary-text font-bold opacity-40 font-cinzel leading-none">{label}</span>
          <button 
            onClick={() => handleCopy(value, copyId)} 
            className={`text-[9px] uppercase tracking-[0.2em] font-bold transition-all duration-300 flex items-center gap-2 font-cinzel ${isCopied ? 'text-green-600' : 'text-[#515C4C]/40 group-hover/row:text-[#515C4C]'}`}
          >
            {isCopied ? <Check size={10} strokeWidth={3} /> : <Copy size={10} strokeWidth={2.5} />}
            {isCopied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <span className="text-lg md:text-xl text-primary-text leading-tight font-serif italic tracking-tight">
           {value}
        </span>
      </div>
    );
  }

  // 2. HELPER: Redesigned Local Card
  function renderLocalCard(region: string, bank: string, holder: string, ival: string, bic: string, isTwint = false) {
    const isOpen = activeProvider === bank;
    return (
      <div className={`group wedding-card transition-all duration-700 overflow-hidden ${isOpen ? 'shadow-lg shadow-black/5 bg-white border-[#515C4C]/20' : 'hover:border-border/20 shadow-sm border-border/10'}`}>
         <button 
           onClick={() => handleProviderToggle(bank)}
           className={`w-full p-4 md:p-5 flex justify-between items-center text-left transition-colors duration-500 ${isOpen ? 'bg-[#F5EFEB]/30' : ''}`}
         >
            <div className="flex items-center gap-4">
               <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full border flex items-center justify-center transition-all duration-700 ${isOpen ? 'bg-[#515C4C] text-white border-[#515C4C]' : 'bg-white text-accent-terracotta border-accent-terracotta/10 group-hover:bg-accent-terracotta/5'}`}>
                  {isTwint ? <Smartphone size={16} strokeWidth={1.5} /> : <Landmark size={16} strokeWidth={1.5} />}
               </div>
               <div>
                  <span className="block text-[10px] uppercase tracking-[0.2em] text-secondary-text font-bold opacity-40 font-cinzel mb-0.5">{region} Local</span>
                  <h3 className={`text-lg md:text-xl font-cinzel tracking-tight transition-all duration-500 ${isOpen ? 'text-[#515C4C]' : 'text-primary-text'}`}>{bank}</h3>
               </div>
            </div>
            <div className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-500 ${isOpen ? 'rotate-180 bg-[#515C4C]/10 text-[#515C4C] border-[#515C4C]/20' : 'text-secondary-text opacity-30 border-accent-terracotta/10'}`}>
               <ChevronDown size={12} strokeWidth={3} />
            </div>
         </button>

         <AnimatePresence>
            {isOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
                 <div className="px-8 md:px-12 pb-12 pt-4 border-t border-border/5 bg-[#F5EFEB]/20 text-left overflow-hidden">
                    <div className="space-y-1">
                       {renderDetailRow('Account Holder', holder, bank + '-holder')}
                       {renderDetailRow(isTwint ? 'Mobile Phone' : 'Full IBAN', ival, bank + '-num')}
                       {!isTwint && bic && renderDetailRow('BIC Code', bic, bank + '-bic')}

                       {!isTwint && (
                         <div className="group/row flex flex-col gap-1 py-4 border-t border-[#515C4C]/10 mt-6 relative text-left">
                             <div className="flex justify-between items-center px-1">
                                <div className="flex items-center gap-2">
                                   <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-[#515C4C] font-bold font-cinzel">Required Reference</span>
                                   <div className="w-1 h-1 rounded-full bg-[#515C4C]/40 animate-pulse" />
                                </div>
                                <button 
                                  onClick={() => handleCopy('Wedding - [Your Name]', bank + '-ref')} 
                                  className={`text-[9px] uppercase tracking-[0.2em] font-bold transition-all duration-300 flex items-center gap-2 font-cinzel ${copiedId === bank + '-ref' ? 'text-green-600' : 'text-[#515C4C]/40 group-hover/row:text-[#515C4C]'}`}
                                >
                                   {copiedId === bank + '-ref' ? <Check size={10} strokeWidth={3} /> : <Copy size={10} strokeWidth={2.5} />}
                                   {copiedId === bank + '-ref' ? 'Copied' : 'Copy'}
                                </button>
                             </div>
                             <span className="text-xl font-serif italic text-[#515C4C] tracking-tight">
                                Wedding - [Your Name]
                             </span>
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
    <div className="min-h-screen bg-background text-primary-text font-cinzel">
      
      {/* 1. RESTORED GRAND HEADER */}
      <section className="relative pt-12 pb-0 px-6 overflow-hidden text-center section-layer-1 border-b border-border/10">
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("/arch-pattern.png")', backgroundSize: '400px' }} />
        
        <div className="max-w-3xl mx-auto relative z-10 reveal">
          <span className="label-uppercase mb-6 block">Gifting Registry</span>
          <h1 className="text-5xl md:text-7xl font-serif text-primary-text mb-8 leading-tight tracking-tighter">Support Our Story</h1>
          <p className="text-xl md:text-2xl font-serif text-secondary-text italic leading-relaxed max-w-2xl mx-auto px-4 opacity-80">
            "Your presence at our wedding is the greatest gift of all."
          </p>
          <div className="w-16 h-px mx-auto my-10 bg-accent-terracotta" />
        </div>
      </section>

      {/* 2. THE NOTE */}
      <section className="px-6 pb-12 pt-12 bg-background reveal">
        <div className="max-w-4xl mx-auto">
          <div className="wedding-card bg-[#F5EFEB]/50 backdrop-blur-sm border-accent-terracotta/20 text-center py-16 px-8 md:px-16 hover:-translate-y-2 transition-all duration-700 shadow-lg shadow-black/[0.02]">
            <div className="max-w-2xl mx-auto space-y-8">
              <h2 className="text-4xl md:text-5xl font-serif text-primary-text italic">A Heartfelt Note</h2>
              <p className="text-lg md:text-xl text-secondary-text leading-relaxed uppercase tracking-[0.1em] opacity-80 font-cinzel">
                We are incredibly fortunate to already have a home filled with <span className="text-primary-text font-bold">everything we could possibly need</span>. 
              </p>
              <p className="text-[10px] md:text-xs text-secondary-text tracking-[0.3em] uppercase leading-relaxed font-cinzel py-2 md:py-4 border-y border-accent-terracotta/10">
                Should you wish to honor us with a gesture, a contribution towards our future sanctuary would be most appreciated.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE FUNDS */}
      <section className="py-24 px-6 bg-[#F5EFEB]/30 border-y border-border/10 reveal">
        <div className="max-w-2xl mx-auto space-y-16 text-center">
          
          <div className="space-y-8 flex flex-col items-center">
            <span className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-accent-beige font-bold font-cinzel">Honeymoon Fund</span>
            <h2 className="text-4xl md:text-5xl font-serif text-primary-text italic tracking-tight">Post-Wedding Adventures</h2>
            <div className="w-16 h-px bg-accent-terracotta/40" />
            <p className="text-sm md:text-base text-secondary-text leading-[2.2] uppercase tracking-[0.15em] opacity-80 font-serif italic max-w-lg mx-auto">
              "Help us create lifelong memories as we explore new horizons together on our first journey as husband and wife."
            </p>
          </div>

          <div className="relative mx-auto w-64 h-64 md:w-80 md:h-80 bg-white p-3 md:p-4 shadow-xl shadow-black/5 rotate-[-1deg] transition-transform duration-700 hover:rotate-1">
            <div className="w-full h-full border border-border/10 overflow-hidden relative group">
              <img src="/gift-honeymoon.png" alt="Post-Wedding Adventures" className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/5 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-8 flex flex-col items-center">
            <span className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-accent-beige font-bold font-cinzel">Home Fund</span>
            <h2 className="text-4xl md:text-5xl font-serif text-primary-text italic tracking-tight">Our Future Sanctuary</h2>
            <div className="w-16 h-px bg-accent-terracotta/40" />
            <p className="text-sm md:text-base text-secondary-text leading-[2.2] uppercase tracking-[0.15em] opacity-80 font-serif italic max-w-lg mx-auto">
              "Contributions will help us create a space filled with love, laughter, and lifelong memories to share with our friends and family."
            </p>
          </div>

          <div className="relative mx-auto w-64 h-64 md:w-80 md:h-80 bg-white p-3 md:p-4 shadow-xl shadow-black/5 rotate-[1deg] transition-transform duration-700 hover:rotate-[-1deg]">
            <div className="w-full h-full border border-border/10 overflow-hidden relative group">
              <img src="/gift-home.png" alt="Our Future Sanctuary" className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/5 pointer-events-none" />
            </div>
          </div>

        </div>
      </section>

      {/* 4. DYNAMIC TRANSFERS */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        <section className="flex flex-col items-center gap-8 mb-16 relative">
          <div className="flex flex-col items-center gap-3 text-center">
             <span className="label-uppercase tracking-[0.5em]">Selection</span>
             <h2 className="text-2xl md:text-3xl font-serif text-primary-text italic tracking-tight opacity-90">Select Your Location</h2>
          </div>
          
          <div className="bg-bg-subtle p-1.5 rounded-full border border-border/10 flex gap-1 shadow-inner relative overflow-hidden isolate w-full max-w-sm">
            {regions.map((region) => (
              <button
                key={region.id}
                onClick={() => {
                   setActiveRegion(region.id as Region);
                   setActiveProvider(null);
                }}
                className={`flex-1 relative px-3 md:px-4 py-3.5 rounded-full text-[9px] md:text-[10px] uppercase font-bold tracking-[0.2em] transition-all duration-500 whitespace-nowrap z-10 font-cinzel ${
                  activeRegion === region.id ? 'text-white' : 'text-secondary-text hover:text-accent-terracotta'
                }`}
              >
                {activeRegion === region.id && (
                  <motion.div layoutId="activeRegionPillMasterFinal" className="absolute inset-0 z-[-1] rounded-full shadow-lg shadow-black/5" style={{ backgroundColor: SITE_GREEN }} initial={false} transition={{ type: "spring", bounce: 0.1, duration: 0.6 }} />
                )}
                {region.label}
              </button>
            ))}
          </div>
        </section>

        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* REVOLUT HUB */}
          <div className={`group wedding-card transition-all duration-700 overflow-hidden ${activeProvider === 'revolut' ? 'shadow-lg shadow-black/5 bg-white border-[#515C4C]/20' : 'hover:border-border/20 shadow-sm border-border/10'}`}>
             <button onClick={() => handleProviderToggle('revolut')} className={`w-full p-4 md:p-5 flex justify-between items-center text-left transition-colors duration-500 ${activeProvider === 'revolut' ? 'bg-[#F5EFEB]/30' : ''}`}>
                <div className="flex items-center gap-4">
                   <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full border flex items-center justify-center transition-all duration-700 ${activeProvider === 'revolut' ? 'bg-[#515C4C] text-white border-[#515C4C]' : 'bg-white text-accent-terracotta border-accent-terracotta/10 group-hover:bg-accent-terracotta/5'}`}><Globe size={16} strokeWidth={1.5} /></div>
                   <div><span className="block text-[10px] uppercase tracking-[0.2em] text-secondary-text font-bold opacity-40 font-cinzel mb-0.5">Modern Global</span><h3 className={`text-lg md:text-xl font-cinzel tracking-tight transition-all duration-500 ${activeProvider === 'revolut' ? 'text-[#515C4C]' : 'text-primary-text'}`}>Revolut Hub</h3></div>
                </div>
                <div className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-500 ${activeProvider === 'revolut' ? 'rotate-180 bg-[#515C4C]/10 text-[#515C4C] border-[#515C4C]/20' : 'text-secondary-text opacity-30 border-accent-terracotta/10'}`}><ChevronDown size={12} strokeWidth={3} /></div>
             </button>

             <AnimatePresence>
               {activeProvider === 'revolut' && (
                 <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
                    <div className="px-8 md:px-12 pb-12 pt-6 border-t border-border/5 space-y-8 overflow-hidden text-left bg-[#F5EFEB]/20 relative">
                       <div className="bg-white/80 p-1.5 rounded-full border border-border/10 flex gap-1 shadow-inner relative overflow-hidden isolate w-full max-w-[340px] mx-auto md:mx-0">
                         <button onClick={() => setRevolutMode('tag')} className={`flex-1 relative py-3 rounded-full text-[10px] uppercase font-bold tracking-[0.15em] transition-all duration-500 z-10 font-cinzel ${revolutMode === 'tag' ? 'text-white' : 'text-secondary-text opacity-40 hover:opacity-100'}`}>{revolutMode === 'tag' && (<motion.div layoutId="revolutPillMasterFinal" className="absolute inset-0 z-[-1] rounded-full shadow-lg shadow-black/5" style={{ backgroundColor: SITE_GREEN }} transition={{ type: "spring", bounce: 0.1, duration: 0.6 }} />)}Revolut Tag</button>
                         {activeRegion !== 'switzerland' && (<button onClick={() => setRevolutMode('iban')} className={`flex-1 relative py-3 rounded-full text-[10px] uppercase font-bold tracking-[0.15em] transition-all duration-500 z-10 font-cinzel ${revolutMode === 'iban' ? 'text-white' : 'text-secondary-text opacity-40 hover:opacity-100'}`}>{revolutMode === 'iban' && (<motion.div layoutId="revolutPillMasterFinal" className="absolute inset-0 z-[-1] rounded-full shadow-lg shadow-black/5" style={{ backgroundColor: SITE_GREEN }} transition={{ type: "spring", bounce: 0.1, duration: 0.6 }} />)}Euro IBAN</button>)}
                         {activeRegion === 'switzerland' && (<button onClick={() => setRevolutMode('chf')} className={`flex-1 relative py-3 rounded-full text-[10px] uppercase font-bold tracking-[0.15em] transition-all duration-500 z-10 font-cinzel ${revolutMode === 'chf' ? 'text-white' : 'text-secondary-text opacity-40 hover:opacity-100'}`}>{revolutMode === 'chf' && (<motion.div layoutId="revolutPillMasterFinal" className="absolute inset-0 z-[-1] rounded-full shadow-lg shadow-black/5" style={{ backgroundColor: SITE_GREEN }} transition={{ type: "spring", bounce: 0.1, duration: 0.6 }} />)}Swiss CHF</button>)}
                       </div>
                       
                       <div className="min-h-[140px] flex items-center justify-center pt-2">
                          {revolutMode === 'chf' && activeRegion === 'switzerland' ? (
                            <div className="w-full space-y-1">
                               {renderDetailRow('Recipient Name', 'Revolut Bank UAB', 'rev-chf-holder')}
                               {renderDetailRow('Swiss CHF IBAN', 'CH44 0900 0W0C 1638 5407 7', 'rev-chf-iban')}
                               <div className="group/row flex flex-col gap-1 py-4 border-t border-[#515C4C]/10 mt-6 relative text-left">
                                  <div className="flex justify-between items-center px-1">
                                     <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-[#515C4C] font-bold font-cinzel">Required Reference</span>
                                     <button 
                                        onClick={() => handleCopy('LAMA LOAY, CH', 'rev-chf-ref')} 
                                        className={`text-[9px] uppercase tracking-[0.2em] font-bold transition-all duration-300 flex items-center gap-2 font-cinzel ${copiedId === 'rev-chf-ref' ? 'text-green-600' : 'text-[#515C4C]/40 group-hover/row:text-[#515C4C]'}`}
                                      >
                                         {copiedId === 'rev-chf-ref' ? <Check size={10} strokeWidth={3} /> : <Copy size={10} strokeWidth={2.5} />}
                                         {copiedId === 'rev-chf-ref' ? 'Copied' : 'Copy'}
                                      </button>
                                  </div>
                                  <span className="text-xl font-serif italic text-[#515C4C] tracking-tight">LAMA LOAY, CH</span>
                               </div>
                            </div>
                          ) : revolutMode === 'tag' ? (
                            <div className="w-full space-y-1">
                               {renderDetailRow('Username', '@lamaloay', 'rev-tag')}
                               <div className="pt-8 flex flex-col items-center gap-4">
                                  <a href="https://revolut.me/lamaloay" target="_blank" rel="noopener noreferrer" className="text-[9px] uppercase tracking-[0.3em] text-[#515C4C] font-bold flex items-center justify-center gap-2 opacity-60 hover:opacity-100 transition-opacity font-cinzel whitespace-nowrap">Open Revolut Secure Link <ExternalLink size={10} /></a>
                                  <div className="w-1 h-1 rounded-full bg-[#515C4C]/20" />
                               </div>
                            </div>
                          ) : (
                            <div className="w-full space-y-1">
                               {renderDetailRow('Recipient Name', 'LAMA LOAY', 'rev-euro-holder')}
                               {renderDetailRow('Euro IBAN Account', 'LT18 3250 0331 5970 5728', 'rev-euro-iban')}
                               <div className="group/row flex flex-col gap-1 py-4 border-t border-[#515C4C]/10 mt-6 relative text-left">
                                  <div className="flex justify-between items-center px-1">
                                     <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-[#515C4C] font-bold font-cinzel">Required Reference</span>
                                     <button 
                                        onClick={() => handleCopy('Wedding - [Your Name]', 'rev-euro-ref')} 
                                        className={`text-[9px] uppercase tracking-[0.2em] font-bold transition-all duration-300 flex items-center gap-2 font-cinzel ${copiedId === 'rev-euro-ref' ? 'text-green-600' : 'text-[#515C4C]/40 group-hover/row:text-[#515C4C]'}`}
                                      >
                                         {copiedId === 'rev-euro-ref' ? <Check size={10} strokeWidth={3} /> : <Copy size={10} strokeWidth={2.5} />}
                                         {copiedId === 'rev-euro-ref' ? 'Copied' : 'Copy'}
                                      </button>
                                  </div>
                                  <span className="text-xl font-serif italic text-[#515C4C] tracking-tight">Wedding - [Your Name]</span>
                               </div>
                            </div>
                          )}
                       </div>
                    </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>

          {/* LOCAL OPTIONS */}
          {activeRegion === 'france' && renderLocalCard('France', 'BoursoBank', 'Lama Loay', 'FR76 4061 8803 3500 0402 2902 922', 'BOUS FRPP XXX')}
          {activeRegion === 'switzerland' && (
            <>{renderLocalCard('Switzerland', 'UBS', 'Lama Loay', 'CH16 0021 5215 1631 0340 Y', 'UBSWCHZH80A')}{renderLocalCard('Switzerland', 'TWINT', 'Lama Loay', '+41 76 701 34 52', '', true)}</>
          )}

          {/* IN-PERSON WISHES */}
          <div className={`group wedding-card transition-all duration-700 overflow-hidden ${activeProvider === 'inperson' ? 'shadow-lg shadow-black/5 bg-white border-[#515C4C]/20' : 'hover:border-border/20 shadow-sm border-border/10'}`}>
             <button onClick={() => handleProviderToggle('inperson')} className={`w-full p-4 md:p-5 flex justify-between items-center text-left transition-colors duration-500 ${activeProvider === 'inperson' ? 'bg-[#F5EFEB]/30' : ''}`}>
                <div className="flex items-center gap-4">
                   <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full border flex items-center justify-center transition-all duration-700 ${activeProvider === 'inperson' ? 'bg-[#515C4C] text-white border-[#515C4C]' : 'bg-white text-accent-terracotta border-accent-terracotta/10 group-hover:bg-accent-terracotta/5'}`}><PiggyBank size={16} strokeWidth={1.5} /></div>
                   <div><span className="block text-[10px] uppercase tracking-[0.2em] text-secondary-text font-bold opacity-40 font-cinzel mb-0.5">Venue / Physical</span><h3 className={`text-lg md:text-xl font-cinzel tracking-tight transition-all duration-500 ${activeProvider === 'inperson' ? 'text-[#515C4C]' : 'text-primary-text'}`}>In-Person Wishes</h3></div>
                </div>
                <div className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-500 ${activeProvider === 'inperson' ? 'rotate-180 bg-[#515C4C]/10 text-[#515C4C] border-[#515C4C]/20' : 'text-secondary-text opacity-30 border-accent-terracotta/10'}`}><ChevronDown size={12} strokeWidth={3} /></div>
             </button>
             <AnimatePresence>
                {activeProvider === 'inperson' && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}><div className="px-12 pb-16 pt-12 border-t border-border/5 space-y-10 overflow-hidden text-center relative bg-[#F5EFEB]/20"><div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-10 bg-gradient-to-b from-accent-terracotta/20 to-transparent" /><div className="max-w-md mx-auto space-y-8 relative z-10"><p className="text-xl md:text-2xl text-secondary-text italic leading-relaxed font-serif pt-2 opacity-80">"For those who prefer a more traditional gesture, we will have a collection box available at the venue terrace."</p><div className="pt-4 flex flex-col items-center gap-4"><div className="w-2 h-2 rounded-full bg-accent-terracotta/30 animate-pulse" /><span className="label-uppercase !mb-0 tracking-[0.6em] text-accent-terracotta opacity-60">Castillo de Monda</span></div></div></div></motion.div>)}
             </AnimatePresence>
          </div>
        </div>
      </div>

      {/* FINAL RSVP CTA */}
      <section className="py-24 px-6 border-t border-border/5 bg-background"><div className="max-w-xl mx-auto text-center reveal"><h2 className="text-3xl md:text-4xl font-serif text-primary-text mb-8 italic tracking-tight opacity-90">Finalize Your Plans</h2><Link to="/rsvp" className="btn-primary inline-flex px-14 py-4" style={{ backgroundColor: SITE_GREEN }}>Submit RSVP</Link></div></section>

    </div>
  );
}