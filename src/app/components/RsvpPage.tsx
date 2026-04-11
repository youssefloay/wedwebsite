import { Link } from "react-router";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { Navigation } from './Navigation';
import {
  Check,
  ArrowRight,
  ArrowLeft,
  GlassWater,
  XCircle,
  Users,
  Bed,
  Car,
  FileText,
  Utensils,
  BusIcon,
  Sparkles,
  Heart,
  MessageCircle
} from 'lucide-react';

interface GuestName {
  firstName: string;
  lastName: string;
}

interface RsvpFormData {
  attendance: string;
  firstName: string;
  lastName: string;
  email: string;
  guests: string;
  guestNames: GuestName[];
  accommodation: string;
  roomPreference: string;
  transfer: string;
  carRental: string;
  needsParking: string;
  visaSupport: string;
  dietary: string;
  stayDuration: string;
  manualStayDates: string;
  notes: string;
}

interface RsvpStep {
  id: 'attendance' | 'identity' | 'note' | 'party' | 'stay' | 'journey' | 'review';
  label: string;
}

export function RsvpPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const nextSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentStep > 1) {
      setTimeout(() => {
        nextSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [currentStep]);

  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<RsvpFormData>({
    attendance: "",
    firstName: "",
    lastName: "",
    email: "",
    guests: "1",
    guestNames: [],
    accommodation: "",
    roomPreference: "",
    transfer: "No",
    carRental: "No",
    needsParking: "No",
    visaSupport: "No",
    dietary: "",
    stayDuration: "",
    manualStayDates: "",
    notes: ""
  });

  const roomTypes = [
    { name: 'Comfy', maxGuests: 2, price: 153.5 },
    { name: 'Superior Comfy', maxGuests: 3, price: 183.5 },
    { name: 'Castillo Junior', maxGuests: 2, price: 208.5 },
    { name: 'Family Room', maxGuests: 4, price: 218.5 }
  ];

  const steps = useMemo<RsvpStep[]>(() => {
    if (formData.attendance === 'Regretfully decline') {
      return [
        { id: 'attendance', label: "Welcome" },
        { id: 'identity', label: "Guest" },
        { id: 'note', label: "Note" },
        { id: 'review', label: "Review" }
      ];
    }
    return [
      { id: 'attendance', label: "Welcome" },
      { id: 'identity', label: "Guest" },
      { id: 'party', label: "Party" },
      { id: 'stay', label: "Stay" },
      { id: 'journey', label: "Journey" },
      { id: 'visa', label: "Visa" },
      { id: 'note', label: "Note" },
      { id: 'review', label: "Review" }
    ] as RsvpStep[];
  }, [formData.attendance]);

  const activeStep = steps[currentStep - 1];
  
  const toggleStayDuration = (option: string) => {
    const current = formData.stayDuration.split(', ').filter(Boolean);
    let updated;
    if (current.includes(option)) {
      updated = current.filter(o => o !== option);
    } else {
      updated = [...current, option];
    }
    updateFormData('stayDuration', updated.join(', '));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAttendanceSelect = (option: string) => {
    setFormData(prev => ({ ...prev, attendance: option }));
    setTimeout(() => handleNext(), 400);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (activeStep.id === 'identity') {
      if (!formData.firstName || !formData.lastName || !formData.email) return;
    }

    if (activeStep.id === 'party' && formData.guestNames.length > 0) {
      const allFilled = formData.guestNames.every(g => g.firstName.trim() && g.lastName.trim());
      if (!allFilled) {
        setError("Please provide the full name for all guests.");
        return;
      }
    }

    if (currentStep < steps.length) {
      handleNext();
    } else {
      setIsSubmitting(true);
      setError(null);
      try {
        const response = await fetch("https://formspree.io/f/YOUR_FORMSPREE_ID", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({
            ...formData,
            guestNames: formData.guestNames.map(g => `${g.firstName} ${g.lastName}`).join(", ")
          })
        });
        if (response.ok) {
          setIsSubmitted(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          throw new Error("Submission failed");
        }
      } catch (err) {
        setError("Connection issue. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const updateFormData = (field: keyof RsvpFormData, value: string) => {
    setFormData(prev => {
      if (field === 'guests') {
        const numGuests = parseInt(value);
        const newGuestNames = Array(Math.max(0, numGuests - 1)).fill(null).map((_, i) =>
          prev.guestNames[i] || { firstName: '', lastName: '' }
        );
        return { ...prev, [field]: value, guestNames: newGuestNames };
      }
      return { ...prev, [field]: value };
    });
  };

  const updateGuestName = (index: number, field: 'firstName' | 'lastName', value: string) => {
    setFormData(prev => {
      const newGuestNames = [...prev.guestNames];
      newGuestNames[index] = { ...newGuestNames[index], [field]: value };
      return { ...prev, guestNames: newGuestNames };
    });
  };

  return (
    <div className="min-h-screen bg-background selection:bg-accent-terracotta/20">
      <Navigation />

      {!isSubmitted ? (
        <div className="max-w-4xl mx-auto px-6 pt-2 pb-32">

          {/* Sectional Header */}
          <div className="text-center mb-10 flex flex-col items-center reveal">
            <span className="label-uppercase tracking-[0.6em] mb-6 block font-bold">YOU ARE INVITED</span>
            <h1 className="text-5xl md:text-7xl font-serif text-primary-text mb-8 leading-tight">The RSVP</h1>
            <p className="text-xl md:text-2xl text-secondary-text font-serif italic mb-6 max-w-lg mx-auto leading-relaxed px-4 opacity-80">
              "We await your joy as we coordinate your stay in the quiet beauty of the Andalusian hills."
            </p>
            <div className="w-16 h-px bg-accent-terracotta mx-auto mt-6" />
          </div>

          <div className="relative max-w-2xl mx-auto reveal delay-200">
            <div className="absolute inset-x-[-20px] inset-y-[-40px] border border-accent-terracotta/5 rounded-[60px] pointer-events-none -z-10 bg-[#FAF9F6]/50 shadow-[0_20px_50px_rgba(92,50,16,0.03)] backdrop-blur-sm" />
            <div className="absolute inset-x-[-30px] inset-y-[-50px] border border-accent-terracotta/5 rounded-[70px] pointer-events-none -z-10" />

            <form onSubmit={handleSubmit} className="relative z-10 px-8 py-4">

              {/* Header */}
              <div className="text-left mb-8 max-w-none mx-auto animate-in fade-in duration-1000">
                <p className="font-serif italic text-3xl md:text-4xl text-primary-text leading-tight md:leading-none mb-6 whitespace-nowrap">Join us in Monda?</p>
                <div className="w-12 h-px bg-accent-terracotta/20 mt-6" />
              </div>



              <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="space-y-12">

                  {/* STEP 1: ATTENDANCE */}
                  <div className="space-y-16 pt-4 pb-12 border-b border-accent-beige/10">
                    <div className="grid grid-cols-2 gap-8 md:gap-16 max-w-2xl mx-auto items-stretch">
                      {[
                        { label: 'Joyfully Accept', value: 'Joyfully accept', sub: 'I will be there!', image: '/rsvp-accept.png', rotate: 'rotate-2' },
                        { label: 'Regretfully Decline', value: 'Regretfully decline', sub: 'Miss you from afar', image: '/rsvp-decline.png', rotate: '-rotate-2' }
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleAttendanceSelect(opt.value)}
                          className={`group relative flex flex-col items-center transition-all duration-700 ${formData.attendance === opt.value ? 'scale-[1.05]' : 'opacity-80 hover:opacity-100'}`}
                        >
                          <div className={`stamp-visual mb-8 w-full aspect-square ${opt.rotate} group-hover:rotate-0 transition-transform duration-1000 ${formData.attendance === opt.value ? 'ring-2 ring-accent-terracotta/40 ring-offset-8 bg-[#FBF9F4]' : ''}`}>
                            <img src={opt.image} alt={opt.label} className="stamp-image w-full h-full object-cover" />
                          </div>
                          
                          <div className="text-center space-y-2">
                            <span className={`block text-xl md:text-3xl font-serif italic transition-colors duration-500 ${formData.attendance === opt.value ? 'text-accent-terracotta' : 'text-primary-text'}`}>{opt.label}</span>
                            <span className="label-uppercase text-[12px] md:text-[14px] text-accent-beige tracking-[0.3em] font-medium">{opt.sub}</span>
                          </div>

                          {formData.attendance === opt.value && (
                            <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-accent-terracotta flex items-center justify-center shadow-lg animate-in zoom-in duration-500">
                              <Check size={16} className="text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* BLOOMED SECTIONS — shown once attendance is chosen */}
                  {formData.attendance && (
                    <div className="animate-in fade-in slide-in-from-top-12 duration-1000 space-y-12">

                      {/* IDENTITY */}
                      <div className="max-w-none mx-auto space-y-16 -mt-12" ref={currentStep === 2 ? nextSectionRef : null}>
                        <div className="text-left mb-12">
                          <p className="font-serif italic text-3xl md:text-4xl text-primary-text leading-none mb-6 whitespace-nowrap">
                            {formData.attendance === 'Regretfully decline' ? "We'll miss you" : 'Who is attending?'}
                          </p>
                          <div className="w-12 h-px bg-accent-terracotta/20 mt-6" />
                        </div>
                        <div className="space-y-12 relative z-10">
                          <div className="space-y-2">
                            <label className="label-uppercase text-[12px] text-accent-beige font-bold tracking-[0.3em]">First Name</label>
                            <input
                              type="text" required placeholder="Guest name"
                              className="w-full bg-transparent border-b border-accent-beige/30 py-4 focus:border-accent-terracotta outline-none transition-all font-serif text-3xl italic text-primary-text placeholder:text-accent-beige/20"
                              value={formData.firstName} onChange={(e) => updateFormData('firstName', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="label-uppercase text-[12px] text-accent-beige font-bold tracking-[0.3em]">Last Name</label>
                            <input
                              type="text" required placeholder="Family name"
                              className="w-full bg-transparent border-b border-accent-beige/30 py-4 focus:border-accent-terracotta outline-none transition-all font-serif text-3xl italic text-primary-text placeholder:text-accent-beige/20"
                              value={formData.lastName} onChange={(e) => updateFormData('lastName', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="label-uppercase text-[12px] text-accent-beige font-bold tracking-[0.3em] block">Email Address</label>
                            <input
                              type="email" required placeholder="your@email.com"
                              className="w-full bg-transparent border-b border-accent-beige/30 py-4 focus:border-accent-terracotta outline-none transition-all font-serif text-3xl italic text-primary-text placeholder:text-accent-beige/20"
                              value={formData.email} onChange={(e) => updateFormData('email', e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="flex justify-end pt-12">
                          <button type="button" onClick={handleNext} disabled={!formData.firstName || !formData.lastName || !formData.email} className="group flex items-center gap-4 text-[12px] uppercase tracking-[0.4em] font-medium text-accent-beige hover:text-accent-terracotta transition-all disabled:opacity-30">
                            Continue <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </div>

                      {/* LOGISTICS BLOOM — Joyfully accept, step >= 3 */}
                      {formData.attendance === 'Joyfully accept' && currentStep >= 3 && (
                        <div className="animate-in fade-in slide-in-from-top-12 duration-1000 space-y-12">

                          {/* PARTY */}
                          <div className="space-y-12 max-w-none mx-auto border-t border-accent-beige/10 pt-12" ref={currentStep === 3 ? nextSectionRef : null}>
                            <div className="text-left mb-12">
                              <p className="font-serif italic text-3xl md:text-4xl text-primary-text leading-none mb-6 whitespace-nowrap">Who is in your party?</p>
                              <div className="w-12 h-px bg-accent-terracotta/20 mt-6" />
                            </div>
                            <div className="flex flex-col items-start gap-10">
                              <div className="space-y-4 w-full">
                                <label className="label-uppercase text-[12px] text-accent-beige font-bold tracking-[0.3em] block mb-2">Number of Guests</label>
                                <p className="text-xl md:text-2xl text-secondary-text font-serif italic leading-relaxed max-w-xl">Please check with us first regarding additional guests or +1s.</p>
                                <div className="grid grid-cols-4 gap-4 max-w-sm">
                                  {['1', '2', '3', '4'].map(n => (
                                    <button
                                      key={n}
                                      type="button"
                                      onClick={() => updateFormData('guests', n)}
                                      className={`aspect-square border flex flex-col items-center justify-center transition-all duration-700 group ${formData.guests === n ? 'border-accent-terracotta bg-[#FBF9F4] scale-110 shadow-lg z-10' : 'border-accent-beige/10 bg-white'}`}
                                    >
                                      <span className={`text-4xl font-serif italic ${formData.guests === n ? 'text-primary-text' : 'text-accent-beige opacity-30 font-light'}`}>{n}</span>
                                      <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent-beige">Guest{n !== '1' ? 's' : ''}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                            {formData.guestNames.length > 0 && (
                              <div className="space-y-8 pt-10 border-t border-accent-beige/10">
                                {formData.guestNames.map((guest, idx) => (
                                  <div key={idx} className="bg-[#FAF8F5]/30 p-8 border border-accent-beige/10 grid grid-cols-2 gap-8">
                                    <input placeholder="First Name" required className="bg-transparent border-b border-accent-beige/20 py-2 font-serif italic text-xl" value={guest.firstName} onChange={(e) => updateGuestName(idx, 'firstName', e.target.value)} />
                                    <input placeholder="Last Name" required className="bg-transparent border-b border-accent-beige/20 py-2 font-serif italic text-xl" value={guest.lastName} onChange={(e) => updateGuestName(idx, 'lastName', e.target.value)} />
                                  </div>
                                ))}
                              </div>
                            )}
                            <div className="flex justify-end pt-12">
                              <button 
                                type="button" 
                                onClick={handleNext} 
                                disabled={formData.guestNames.length > 0 && !formData.guestNames.every(g => g.firstName.trim() && g.lastName.trim())}
                                className="group flex items-center gap-4 text-[12px] uppercase tracking-[0.4em] font-medium text-accent-beige hover:text-accent-terracotta transition-all disabled:opacity-30"
                              >
                                Continue <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                              </button>
                            </div>
                          </div>

                          {/* STAY */}
                          {currentStep >= 4 && (
                            <div className="space-y-12 max-w-none mx-auto border-t border-accent-beige/10 pt-12" ref={currentStep === 4 ? nextSectionRef : null}>
                              <div className="text-left mb-12">
                                <p className="font-serif italic text-3xl md:text-4xl text-primary-text leading-none mb-6 whitespace-nowrap">Where will you rest?</p>
                                <div className="w-12 h-px bg-accent-terracotta/20 mt-6" />
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                                {[
                                  { id: 'Yes, please', label: 'Reservation', detail: 'At the Castle', sub: 'For our stay', image: '/accom-castle.png', rotate: 'rotate-1' },
                                  { id: 'No, thank you', label: 'Independent', detail: 'Staying Elsewhere', sub: 'Private Resting', image: '/accom-outside.png', rotate: '-rotate-1' }
                                ].map(opt => (
                                  <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => updateFormData('accommodation', opt.id)}
                                    className={`group relative flex flex-col items-center transition-all duration-700 ${formData.accommodation === opt.id ? 'scale-[1.05]' : 'opacity-80 hover:opacity-100'}`}
                                  >
                                    <div className={`stamp-visual mb-6 w-full aspect-square ${opt.rotate} group-hover:rotate-0 transition-transform duration-1000 ${formData.accommodation === opt.id ? 'ring-2 ring-accent-terracotta/40 ring-offset-8 bg-[#FBF9F4]' : ''}`}>
                                      <img src={opt.image} alt={opt.detail} className="stamp-image w-full h-full object-cover" />
                                    </div>
                                    <div className="text-center">
                                      <span className={`label-uppercase text-[12px] font-bold tracking-[0.3em] mb-2 block ${formData.accommodation === opt.id ? 'text-accent-terracotta' : 'text-accent-beige'}`}>{opt.label}</span>
                                      <p className="font-serif italic text-3xl text-primary-text leading-tight">{opt.detail}</p>
                                      <p className="text-[11px] label-uppercase tracking-widest text-accent-beige mt-3 opacity-60">{opt.sub}</p>
                                    </div>
                                    {formData.accommodation === opt.id && (
                                      <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-accent-terracotta flex items-center justify-center shadow-lg animate-in zoom-in duration-500">
                                        <Check size={16} className="text-white" />
                                      </div>
                                    )}
                                  </button>
                                ))}
                              </div>
                              {formData.accommodation === 'Yes, please' && (
                                <div className="pt-10 space-y-6">
                                  <div className="space-y-6">
                                    <p className="font-serif italic text-3xl md:text-4xl text-primary-text leading-none mb-6">Which sanctuary would you prefer to reserve?</p>
                                    <p className="text-xl md:text-2xl text-secondary-text font-serif italic leading-relaxed max-w-xl">
                                      Rooms are allocated on first-come, first-served basis. Payment is required to confirm your stay; the hotel concierge will contact you.
                                    </p>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-700">
                                    {roomTypes.map(r => (
                                      <button
                                        key={r.name}
                                        type="button"
                                        onClick={() => updateFormData('roomPreference', r.name)}
                                        className={`group relative p-8 md:p-10 border transition-all duration-700 overflow-hidden flex flex-col items-start gap-4 ${formData.roomPreference === r.name ? 'bg-white border-accent-terracotta/40 shadow-[0_20px_40px_rgba(92,50,16,0.06)] scale-[1.03] z-10' : 'bg-white border-accent-beige/10 opacity-70 hover:opacity-100 hover:border-accent-beige/30'}`}
                                      >
                                        <div className={`absolute top-0 left-0 w-1 h-full bg-accent-terracotta transition-transform duration-700 ${formData.roomPreference === r.name ? 'translate-x-0' : '-translate-x-full'}`} />
                                        
                                        <div className="w-full flex justify-between items-start">
                                          <span className={`label-uppercase text-[12px] font-bold tracking-[0.3em] ${formData.roomPreference === r.name ? 'text-accent-terracotta' : 'text-accent-beige'}`}>Room Type</span>
                                          {formData.roomPreference === r.name && (
                                            <div className="w-6 h-6 rounded-full bg-accent-terracotta flex items-center justify-center shadow-sm">
                                              <Check size={12} className="text-white" />
                                            </div>
                                          )}
                                        </div>
                                        
                                        <p className="font-serif italic text-3xl text-primary-text leading-tight">{r.name}</p>
                                        
                                        <div className="mt-4 pt-4 border-t border-accent-beige/10 w-full flex justify-between items-center">
                                          <span className="text-[12px] label-uppercase tracking-widest text-accent-beige opacity-60">Nightly Rate</span>
                                          <span className="font-serif italic text-xl text-primary-text">€{r.price}</span>
                                        </div>
                                      </button>
                                    ))}
                                  </div>

                                  {formData.roomPreference && (
                                    <div className="pt-16 space-y-12 animate-in fade-in slide-in-from-top-12 duration-1000">
                                      <div className="space-y-6">
                                        <p className="font-serif italic text-3xl md:text-4xl text-primary-text leading-none mb-6">How long do you need a room at Castillo de Monda?</p>
                                        <div className="w-12 h-px bg-accent-terracotta/20 mt-6" />
                                      </div>
                                      
                                      <div className="grid grid-cols-1 gap-4">
                                        {[
                                          { id: 'fri', label: 'Friday 16th', detail: "Arrival evening" },
                                          { id: 'sat', label: 'Saturday 17th', detail: "Celebration night" },
                                          { id: 'manual', label: 'Extra Night', detail: 'Specify dates below' }
                                        ].map(opt => (
                                          <button
                                            key={opt.id}
                                            type="button"
                                            onClick={() => toggleStayDuration(opt.label)}
                                            className={`p-8 border text-left transition-all duration-700 flex justify-between items-center ${formData.stayDuration.includes(opt.label) ? 'bg-[#FBF9F4] border-accent-terracotta/60 shadow-md' : 'bg-white border-accent-beige/10 opacity-70'}`}
                                          >
                                            <div className="space-y-1">
                                              <span className={`label-uppercase text-[12px] font-bold tracking-[0.3em] ${formData.stayDuration.includes(opt.label) ? 'text-accent-terracotta' : 'text-accent-beige opacity-60'}`}>{opt.label}</span>
                                              <p className="font-serif italic text-2xl text-primary-text leading-tight">{opt.detail}</p>
                                            </div>
                                            <div className={`w-8 h-8 rounded-full border border-accent-beige/20 flex items-center justify-center transition-all ${formData.stayDuration.includes(opt.label) ? 'bg-accent-terracotta border-accent-terracotta shadow-lg scale-110' : ''}`}>
                                               {formData.stayDuration.includes(opt.label) && <Check size={16} className="text-white" />}
                                            </div>
                                          </button>
                                        ))}
                                      </div>

                                      {formData.stayDuration.includes('Extra Night') && (
                                        <div className="pt-8 animate-in fade-in slide-in-from-top-8 duration-700">
                                          <p className="label-uppercase text-[10px] text-accent-beige font-bold tracking-[0.3em] mb-4">Please specify your arrival & departure</p>
                                          <input 
                                            type="text"
                                            placeholder="e.g. Wednesday 14th to Sunday 18th"
                                            className="w-full bg-white border-b border-accent-beige/20 p-6 outline-none focus:border-accent-terracotta font-serif italic text-2xl"
                                            value={formData.manualStayDates}
                                            onChange={(e) => updateFormData('manualStayDates', e.target.value)}
                                          />
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                              <div className="flex justify-end pt-12">
                                <button type="button" onClick={handleNext} disabled={!formData.accommodation} className="group flex items-center gap-4 text-[12px] uppercase tracking-[0.4em] font-medium text-accent-beige hover:text-accent-terracotta transition-all disabled:opacity-30">
                                  Continue <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                              </div>
                            </div>
                          )}

                          {/* JOURNEY */}
                          {currentStep >= 5 && (
                            <div className="space-y-12 max-w-none mx-auto border-t border-accent-beige/10 pt-12" ref={currentStep === 5 ? nextSectionRef : null}>
                              <div className="text-left mb-12 space-y-6">
                                <p className="font-serif italic text-3xl md:text-4xl text-primary-text leading-none whitespace-nowrap">How will you travel?</p>
                                <p className="text-xl md:text-2xl text-secondary-text font-serif italic leading-relaxed max-w-xl">
                                  We understand that these details are not yet final. A formal logistics form will be shared between December and January to coordinate your definitive travel arrangements.
                                </p>
                                <div className="w-12 h-px bg-accent-terracotta/20 mt-6" />
                              </div>
                              <div className="grid grid-cols-1 gap-12">
                                {[
                                  { id: 'carRental', label: 'My Own Route', detail: 'I will be driving to Monda', sub: 'A parking space at the venue would be appreciated.', image: '/journey-car.png', rotate: 'rotate-1' },
                                  { id: 'transfer', label: 'Assisted Transfer', detail: 'I would love help with transport', sub: 'Shuttle or private transfer options.', image: '/journey-shuttle.png', rotate: '-rotate-1' }
                                ].map(item => (
                                  <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => {
                                      if (item.id === 'carRental') {
                                        updateFormData('carRental', formData.carRental === 'Yes' ? 'No' : 'Yes');
                                        updateFormData('transfer', 'No');
                                      } else {
                                        updateFormData('transfer', formData.transfer === 'Yes' ? 'No' : 'Yes');
                                        updateFormData('carRental', 'No');
                                      }
                                    }}
                                    className={`group relative flex flex-col md:flex-row items-center gap-8 md:gap-12 transition-all duration-700 border border-transparent p-6 rounded-3xl ${formData[item.id as keyof RsvpFormData] === 'Yes' ? 'bg-[#FBF9F4] border-accent-terracotta/20 shadow-md' : 'hover:bg-white/50'}`}
                                  >
                                    <div className={`stamp-visual w-40 md:w-56 aspect-square ${item.rotate} group-hover:rotate-0 transition-transform duration-1000 flex-shrink-0 ${formData[item.id as keyof RsvpFormData] === 'Yes' ? 'ring-2 ring-accent-terracotta/40' : ''}`}>
                                      <img src={item.image} alt={item.label} className="stamp-image w-full h-full object-cover" />
                                    </div>
                                    <div className="text-center md:text-left flex-grow">
                                      <div className="flex items-center justify-center md:justify-start gap-4 mb-3">
                                        <span className={`label-uppercase text-[12px] font-bold tracking-[0.3em] ${formData[item.id as keyof RsvpFormData] === 'Yes' ? 'text-accent-terracotta' : 'text-accent-beige'}`}>{item.label}</span>
                                        <div className={`w-5 h-5 rounded-full border border-accent-beige/20 flex items-center justify-center transition-all ${formData[item.id as keyof RsvpFormData] === 'Yes' ? 'bg-accent-terracotta border-accent-terracotta' : ''}`}>
                                          {formData[item.id as keyof RsvpFormData] === 'Yes' && <Check size={10} className="text-white" />}
                                        </div>
                                      </div>
                                      <p className="font-serif italic text-2xl md:text-3xl text-primary-text leading-tight mb-2">"{item.detail}"</p>
                                      <p className="text-[16px] text-secondary-text opacity-70 font-serif italic leading-relaxed">{item.sub}</p>
                                    </div>
                                  </button>
                                ))}
                              </div>
                              <div className="flex justify-end pt-12">
                                <button 
                                  type="button" 
                                  onClick={handleNext} 
                                  disabled={formData.carRental !== 'Yes' && formData.transfer !== 'Yes'}
                                  className="group flex items-center gap-4 text-[12px] uppercase tracking-[0.4em] font-medium text-accent-beige hover:text-accent-terracotta transition-all disabled:opacity-30"
                                >
                                  Continue <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                              </div>
                            </div>
                          )}

                          {/* VISA */}
                          {currentStep >= 6 && (
                            <div className="space-y-12 max-w-none mx-auto border-t border-accent-beige/10 pt-12" ref={currentStep === 6 ? nextSectionRef : null}>
                              <div className="text-left mb-12 space-y-6">
                                <p className="font-serif italic text-3xl md:text-4xl text-primary-text leading-none">Visa Assistance</p>
                                <p className="text-xl md:text-2xl text-secondary-text font-serif italic leading-relaxed max-w-xl">
                                  Do you require assistance with your Visa application? We are happy to provide liaison and invitation documentation.
                                </p>
                                <div className="w-12 h-px bg-accent-terracotta/20 mt-6" />
                              </div>
                              <div className="grid grid-cols-2 gap-8 md:gap-12">
                                {[
                                  { id: 'Yes', label: 'Assistance', detail: 'Invitation Letter', image: '/visa-yes.png', rotate: 'rotate-1' },
                                  { id: 'No', label: 'Independent', detail: 'No Help Needed', image: '/visa-no.png', rotate: '-rotate-1' }
                                ].map(opt => (
                                  <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => updateFormData('visaSupport', opt.id)}
                                    className={`group relative flex flex-col items-center transition-all duration-700 ${formData.visaSupport === opt.id ? 'scale-[1.05]' : 'opacity-80 hover:opacity-100'}`}
                                  >
                                    <div className={`stamp-visual mb-6 w-full aspect-square ${opt.rotate} group-hover:rotate-0 transition-transform duration-1000 ${formData.visaSupport === opt.id ? 'ring-2 ring-accent-terracotta/40 ring-offset-8 bg-[#FBF9F4]' : ''}`}>
                                      <img src={opt.image} alt={opt.label} className="stamp-image w-full h-full object-cover" />
                                    </div>
                                    <div className="text-center">
                                      <span className={`label-uppercase text-[12px] font-bold tracking-[0.3em] mb-2 block ${formData.visaSupport === opt.id ? 'text-accent-terracotta' : 'text-accent-beige'}`}>{opt.label}</span>
                                      <p className="font-serif italic text-2xl text-primary-text leading-tight">{opt.detail}</p>
                                    </div>
                                    {formData.visaSupport === opt.id && (
                                      <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-accent-terracotta flex items-center justify-center shadow-lg animate-in zoom-in duration-500">
                                        <Check size={16} className="text-white" />
                                      </div>
                                    )}
                                  </button>
                                ))}
                              </div>
                              <div className="flex justify-end pt-12">
                                <button 
                                  type="button" 
                                  onClick={handleNext} 
                                  disabled={!formData.visaSupport}
                                  className="group flex items-center gap-4 text-[11px] uppercase tracking-[0.4em] font-medium text-accent-beige hover:text-accent-terracotta transition-all disabled:opacity-30"
                                >
                                  Continue <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                              </div>
                            </div>
                          )}

                        </div>
                      )}

                      {/* NOTE — shown when current step id is 'note' */}
                      {activeStep?.id === 'note' && (
                        <div className="animate-in fade-in slide-in-from-top-12 duration-1000 space-y-12 max-w-none mx-auto border-t border-accent-beige/10 pt-12" ref={nextSectionRef}>
                          <div className="text-left mb-12">
                            <p className="font-serif italic text-3xl md:text-4xl text-primary-text leading-none mb-6">A Note for the Couple</p>
                            <div className="w-12 h-px bg-accent-terracotta/20 mt-6" />
                          </div>
                          <div className="relative p-4">
                            <textarea
                              placeholder="Share your wishes..."
                              className="w-full bg-[#FAF8F5]/60 border border-accent-beige/20 p-10 outline-none focus:border-accent-terracotta font-serif italic text-2xl h-64 text-center placeholder:text-accent-beige/20 transition-all"
                              value={formData.notes} onChange={(e) => updateFormData('notes', e.target.value)}
                            />
                          </div>
                          <div className="flex justify-end pt-12">
                            <button type="button" onClick={handleNext} className="group flex items-center gap-4 text-[11px] uppercase tracking-[0.4em] font-medium text-accent-beige hover:text-accent-terracotta transition-all">
                              Continue <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* REVIEW & SUBMIT — shown when current step id is 'review' */}
                      {activeStep?.id === 'review' && (
                        <div className="animate-in fade-in slide-in-from-top-12 duration-1000 space-y-12 max-w-none mx-auto border-t border-accent-beige/10 pt-12" ref={nextSectionRef}>
                          <div className="text-left py-10 border-y border-accent-beige/10 relative space-y-12">
                            <div className="space-y-4">
                              <p className="label-uppercase text-[10px] text-accent-beige font-bold tracking-[0.3em]">Confirmation</p>
                              <p className="text-3xl md:text-5xl font-serif italic text-primary-text mb-10 leading-none">{formData.attendance}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
                              <div className="space-y-2">
                                <span className="label-uppercase text-[9px] text-accent-beige font-bold tracking-[0.2em]">Primary Guest</span>
                                <p className="text-2xl font-serif italic text-primary-text">{formData.firstName} {formData.lastName}</p>
                                <p className="text-xs text-accent-beige/60">{formData.email}</p>
                              </div>
                              {formData.attendance === 'Joyfully accept' && (
                                <div className="space-y-2">
                                  <span className="label-uppercase text-[9px] text-accent-beige font-bold tracking-[0.2em]">Guest Count</span>
                                  <p className="text-2xl font-serif italic text-primary-text">{formData.guests} Guests</p>
                                </div>
                              )}
                              {formData.attendance === 'Joyfully accept' && (
                                <div className="space-y-2">
                                  <span className="label-uppercase text-[9px] text-accent-beige font-bold tracking-[0.2em]">Sanctuary</span>
                                  <p className="text-2xl font-serif italic text-primary-text">{formData.accommodation === 'Yes, please' ? formData.roomPreference : 'Independent Resting'}</p>
                                </div>
                              )}
                              {formData.attendance === 'Joyfully accept' && (
                                <div className="space-y-2">
                                  <span className="label-uppercase text-[9px] text-accent-beige font-bold tracking-[0.2em]">Journey</span>
                                  <p className="text-2xl font-serif italic text-primary-text">{formData.carRental === 'Yes' ? 'Renting a Car' : formData.transfer === 'Yes' ? 'Assisted Transfer' : 'Independent Arrival'}</p>
                                </div>
                              )}
                              {formData.attendance === 'Joyfully accept' && (
                                <div className="space-y-2 col-span-full">
                                  <span className="label-uppercase text-[9px] text-accent-beige font-bold tracking-[0.2em]">Visa Assistance</span>
                                  <p className="text-2xl font-serif italic text-primary-text">{formData.visaSupport === 'Yes' ? 'Assistance Needed' : 'Not Required'}</p>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-center gap-6">
                            <button type="submit" disabled={isSubmitting} className="btn-primary w-full md:w-auto md:min-w-[280px] h-14 shadow-lg flex items-center justify-center transition-all group active:scale-95">
                              {isSubmitting ? (
                                <span className="label-uppercase text-[10px] tracking-[0.3em]">Sending...</span>
                              ) : (
                                <span className="text-sm md:text-base font-serif uppercase tracking-[0.2em]">
                                  {formData.attendance === 'Joyfully accept' ? 'Confirm Attendance' : 'Submit Attendance Form'}
                                </span>
                              )}
                            </button>
                            <button type="button" onClick={() => setCurrentStep(currentStep - 1)} className="text-[10px] uppercase tracking-[0.4em] text-accent-beige hover:text-accent-terracotta transition-all py-4">
                              Back to Edit
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                </div>
              </div>

            </form>
          </div>

          {error && (
            <div className="mt-8 text-center text-red-600 font-serif italic text-lg animate-in fade-in duration-500">
              {error}
            </div>
          )}
        </div>
      ) : (
        /* SUCCESS PAGE */
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-xl text-left py-20 bg-white shadow-2xl p-16 md:p-24 border border-accent-beige/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-accent-terracotta/20" />
            <Heart size={48} className="text-accent-terracotta mb-10 opacity-30" />
            <span className="label-uppercase text-[11px] font-bold tracking-[0.4em] mb-6 block text-accent-terracotta">Success</span>
            <h2 className="text-6xl md:text-8xl font-serif italic text-primary-text mb-8 leading-none">Muchas Gracias</h2>
            <div className="w-16 h-px bg-accent-terracotta/20 mb-10" />
            <p className="text-xl md:text-2xl text-secondary-text leading-relaxed font-serif italic mb-16 max-w-lg">
              We have received your response, {formData.firstName}. We cannot wait to celebrate this journey with you in the hills of Monda.
            </p>
            <Link to="/" className="group flex items-center gap-4 text-[11px] uppercase tracking-[0.4em] font-bold text-accent-terracotta hover:text-primary-text transition-all">
              Return to the Story <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      )}

      <footer className="pt-8 pb-32 text-center border-t border-border bg-background">
        <p className="label-uppercase tracking-[0.5em] mb-0 text-[11px]">Lama & Álvaro · 2027</p>
      </footer>
    </div>
  );
}