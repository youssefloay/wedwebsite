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
          <div className="text-center mb-6 flex flex-col items-center animate-in fade-in duration-1000">
            <span className="label-uppercase tracking-[0.6em] mb-6 block font-medium">YOU ARE INVITED</span>
            <h1 className="text-6xl md:text-8xl font-serif text-primary-text mb-8 leading-none">The RSVP</h1>
            <p className="text-xl md:text-2xl text-secondary-text font-serif italic mb-6 max-w-lg mx-auto leading-relaxed px-4">
              "We await your joy as we coordinate your stay in the quiet beauty of the Andalusian hills."
            </p>
            <div className="w-16 h-px bg-accent-terracotta/40 mx-auto mt-6" />
          </div>

          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-x-[-20px] inset-y-[-40px] border border-accent-beige/30 rounded-[60px] pointer-events-none -z-10 bg-[#FAF9F6] shadow-[0_20px_50px_rgba(0,0,0,0.03)]" />
            <div className="absolute inset-x-[-30px] inset-y-[-50px] border border-accent-beige/10 rounded-[70px] pointer-events-none -z-10" />

            <form onSubmit={handleSubmit} className="relative z-10 px-8 py-4">

              {/* Header */}
              <div className="text-center mb-10 space-y-4 max-w-lg mx-auto">
                <span className="label-uppercase text-[10px] text-accent-terracotta tracking-[0.4em] font-medium block">An Intimate Celebration</span>
                <p className="font-serif italic text-6xl md:text-8xl text-primary-text leading-none animate-in fade-in duration-1000">Will you join us in Monda?</p>
              </div>



              <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="space-y-24">

                  {/* STEP 1: ATTENDANCE */}
                  <div className="space-y-16 py-8 border-b border-accent-beige/10 pb-12">
                    <div className="grid grid-cols-2 gap-4 md:gap-10 max-w-2xl mx-auto items-stretch">
                      {[
                        { label: 'Joyfully Accept', value: 'Joyfully accept', sub: 'I will be there!' },
                        { label: 'Regretfully Decline', value: 'Regretfully decline', sub: 'Miss you from afar' }
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleAttendanceSelect(opt.value)}
                          className={`group relative p-6 md:p-14 border transition-all duration-700 hover:border-accent-terracotta/40 flex flex-col items-center justify-center text-center overflow-hidden ${formData.attendance === opt.value
                              ? 'bg-[#FBF9F4] border-accent-terracotta/60 shadow-lg scale-[1.02] z-10'
                              : 'bg-white border-accent-beige/20 opacity-60'
                            }`}
                        >
                          <div className={`absolute inset-2 md:inset-3 border border-accent-beige/10 transition-opacity duration-700 ${formData.attendance === opt.value ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                          <span className="block text-xl md:text-3xl font-serif italic text-primary-text mb-2 relative z-10">{opt.label}</span>
                          <span className="label-uppercase text-[8px] md:text-[11px] text-accent-beige tracking-[0.2em] md:tracking-[0.3em] font-medium relative z-10">{opt.sub}</span>
                          {formData.attendance === opt.value && (
                            <div className="absolute top-2 right-2 md:top-4 md:right-4 animate-in zoom-in duration-500">
                              <Check size={14} className="md:size-4 text-accent-terracotta" />
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
                      <div className="max-w-xl mx-auto space-y-16 -mt-12" ref={currentStep === 2 ? nextSectionRef : null}>
                        <div className="text-left mb-12">
                          <p className="font-serif italic text-5xl md:text-7xl text-primary-text leading-none mb-6">
                            {formData.attendance === 'Regretfully decline' ? 'Who shall we miss?' : 'Who are we welcoming?'}
                          </p>
                          <div className="w-12 h-px bg-accent-terracotta/20 mt-6" />
                        </div>
                        <div className="space-y-12 relative z-10">
                          <div className="space-y-2">
                            <label className="label-uppercase text-[11px] text-accent-beige font-bold tracking-[0.3em]">First Name</label>
                            <input
                              type="text" required placeholder="Guest name"
                              className="w-full bg-transparent border-b border-accent-beige/30 py-4 focus:border-accent-terracotta outline-none transition-all font-serif text-3xl italic text-primary-text placeholder:text-accent-beige/20"
                              value={formData.firstName} onChange={(e) => updateFormData('firstName', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="label-uppercase text-[11px] text-accent-beige font-bold tracking-[0.3em]">Last Name</label>
                            <input
                              type="text" required placeholder="Family name"
                              className="w-full bg-transparent border-b border-accent-beige/30 py-4 focus:border-accent-terracotta outline-none transition-all font-serif text-3xl italic text-primary-text placeholder:text-accent-beige/20"
                              value={formData.lastName} onChange={(e) => updateFormData('lastName', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="label-uppercase text-[11px] text-accent-beige font-bold tracking-[0.3em] block">Email Address</label>
                            <input
                              type="email" required placeholder="your@email.com"
                              className="w-full bg-transparent border-b border-accent-beige/30 py-4 focus:border-accent-terracotta outline-none transition-all font-serif text-3xl italic text-primary-text placeholder:text-accent-beige/20"
                              value={formData.email} onChange={(e) => updateFormData('email', e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="flex justify-end pt-12">
                          <button type="button" onClick={handleNext} disabled={!formData.firstName || !formData.lastName || !formData.email} className="group flex items-center gap-4 text-[11px] uppercase tracking-[0.4em] font-medium text-accent-beige hover:text-accent-terracotta transition-all disabled:opacity-30">
                            Continue <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </div>

                      {/* LOGISTICS BLOOM — Joyfully accept, step >= 3 */}
                      {formData.attendance === 'Joyfully accept' && currentStep >= 3 && (
                        <div className="animate-in fade-in slide-in-from-top-12 duration-1000 space-y-12">

                          {/* PARTY */}
                          <div className="space-y-12 max-w-xl mx-auto border-t border-accent-beige/10 pt-12" ref={currentStep === 3 ? nextSectionRef : null}>
                            <div className="text-left mb-12">
                              <p className="font-serif italic text-5xl md:text-7xl text-primary-text leading-none mb-6">Who is in your party?</p>
                              <div className="w-12 h-px bg-accent-terracotta/20 mt-6" />
                            </div>
                            <div className="flex flex-col items-start gap-10">
                              <div className="space-y-4 w-full">
                                <label className="label-uppercase text-[11px] text-accent-beige font-bold tracking-[0.3em] block mb-2">Number of Guests</label>
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
                                      <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-accent-beige">Guest{n !== '1' ? 's' : ''}</span>
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
                              <button type="button" onClick={handleNext} className="group flex items-center gap-4 text-[11px] uppercase tracking-[0.4em] font-medium text-accent-beige hover:text-accent-terracotta transition-all">
                                Continue <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                              </button>
                            </div>
                          </div>

                          {/* STAY */}
                          {currentStep >= 4 && (
                            <div className="space-y-12 max-w-xl mx-auto border-t border-accent-beige/10 pt-12" ref={currentStep === 4 ? nextSectionRef : null}>
                              <div className="text-left mb-12">
                                <p className="font-serif italic text-5xl md:text-7xl text-primary-text leading-none mb-6">Where will you be resting?</p>
                                <div className="w-12 h-px bg-accent-terracotta/20 mt-6" />
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <button type="button" onClick={() => updateFormData('accommodation', 'Yes, please')} className={`p-10 border text-left transition-all duration-700 ${formData.accommodation === 'Yes, please' ? 'bg-[#FBF9F4] border-accent-terracotta/60 shadow-md' : 'bg-white border-accent-beige/10 opacity-80'}`}>
                                  <span className="label-uppercase text-[10px] text-accent-terracotta font-bold tracking-[0.3em] mb-4 block">Reservation</span>
                                  <p className="font-serif italic text-3xl text-primary-text leading-tight">At the Castle</p>
                                  <p className="text-[11px] label-uppercase tracking-widest text-accent-beige mt-4">For our stay</p>
                                </button>
                                <button type="button" onClick={() => updateFormData('accommodation', 'No, thank you')} className={`p-10 border text-left transition-all duration-700 ${formData.accommodation === 'No, thank you' ? 'bg-[#FBF9F4] border-accent-terracotta/60 shadow-md' : 'bg-white border-accent-beige/10 opacity-80'}`}>
                                  <span className="label-uppercase text-[10px] text-accent-beige font-bold tracking-[0.3em] mb-4 block">Independent</span>
                                  <p className="font-serif italic text-3xl text-primary-text leading-tight opacity-40">Staying Elsewhere</p>
                                  <p className="text-[11px] label-uppercase tracking-widest text-accent-beige mt-4 opacity-40">Private Resting</p>
                                </button>
                              </div>
                              {formData.accommodation === 'Yes, please' && (
                                <div className="pt-10 space-y-6">
                                  <div className="space-y-6">
                                    <p className="font-serif italic text-5xl md:text-7xl text-primary-text leading-none mb-6">Which sanctuary would you prefer to reserve?</p>
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
                                        className={`p-10 border text-left transition-all duration-700 flex flex-col items-start gap-4 ${formData.roomPreference === r.name ? 'bg-[#FBF9F4] border-accent-terracotta/60 shadow-md scale-[1.02] z-10' : 'bg-white border-accent-beige/10 opacity-80'}`}
                                      >
                                        <span className={`label-uppercase text-[10px] font-bold tracking-[0.3em] ${formData.roomPreference === r.name ? 'text-accent-terracotta' : 'text-accent-beige opacity-60'}`}>Room Type</span>
                                        <p className={`font-serif italic text-3xl leading-tight ${formData.roomPreference === r.name ? 'text-primary-text' : 'text-primary-text opacity-40'}`}>{r.name}</p>
                                        <p className={`text-[11px] label-uppercase tracking-widest mt-4 ${formData.roomPreference === r.name ? 'text-accent-terracotta' : 'text-accent-beige opacity-60'}`}>€{r.price} per night</p>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                              <div className="flex justify-end pt-12">
                                <button type="button" onClick={handleNext} disabled={!formData.accommodation} className="group flex items-center gap-4 text-[11px] uppercase tracking-[0.4em] font-medium text-accent-beige hover:text-accent-terracotta transition-all disabled:opacity-30">
                                  Continue <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                              </div>
                            </div>
                          )}

                          {/* JOURNEY */}
                          {currentStep >= 5 && (
                            <div className="space-y-12 max-w-xl mx-auto border-t border-accent-beige/10 pt-12" ref={currentStep === 5 ? nextSectionRef : null}>
                              <div className="text-left mb-12 space-y-6">
                                <p className="font-serif italic text-5xl md:text-7xl text-primary-text leading-none">How do you plan to join us?</p>
                                <p className="text-xl md:text-2xl text-secondary-text font-serif italic leading-relaxed max-w-xl">
                                  We understand that these details are not yet final. A formal logistics form will be shared between December and January to coordinate your definitive travel arrangements.
                                </p>
                                <div className="w-12 h-px bg-accent-terracotta/20 mt-6" />
                              </div>
                              <div className="grid grid-cols-1 gap-8">
                                {[
                                  { id: 'carRental', label: 'My Own Route', detail: 'I will be driving to Monda — a parking space at the venue would be greatly appreciated.' },
                                  { id: 'transfer', label: 'Assisted Transfer', detail: 'I would love help with transport. A shared shuttle may be available at a lower cost, or a private transfer at €95. Payment is settled directly at the hotel.' }
                                ].map(item => (
                                  <button key={item.id} type="button" onClick={() => updateFormData(item.id as keyof RsvpFormData, formData[item.id as keyof RsvpFormData] === 'Yes' ? 'No' : 'Yes')}
                                    className={`p-10 border flex flex-col items-start gap-4 transition-all duration-700 ${formData[item.id as keyof RsvpFormData] === 'Yes' ? 'bg-[#FBF9F4] border-accent-terracotta/60 shadow-md' : 'bg-white border-accent-beige/10 opacity-80'}`}
                                  >
                                    <div className="flex justify-between w-full items-start">
                                      <span className="label-uppercase text-[10px] text-accent-terracotta font-bold tracking-[0.3em]">{item.label}</span>
                                      <div className={`w-6 h-6 rounded-full border border-accent-beige/20 flex items-center justify-center transition-all ${formData[item.id as keyof RsvpFormData] === 'Yes' ? 'bg-accent-terracotta border-accent-terracotta' : ''}`}>
                                        {formData[item.id as keyof RsvpFormData] === 'Yes' && <Check size={12} className="text-white" />}
                                      </div>
                                    </div>
                                    <p className={`font-serif italic text-2xl text-primary-text leading-tight ${formData[item.id as keyof RsvpFormData] === 'Yes' ? 'opacity-100' : 'opacity-40'}`}>
                                      "{item.detail}"
                                    </p>
                                  </button>
                                ))}
                              </div>
                              <div className="flex justify-end pt-12">
                                <button type="button" onClick={handleNext} className="group flex items-center gap-4 text-[11px] uppercase tracking-[0.4em] font-medium text-accent-beige hover:text-accent-terracotta transition-all">
                                  Continue <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                              </div>
                            </div>
                          )}

                          {/* VISA */}
                          {currentStep >= 6 && (
                            <div className="space-y-12 max-w-xl mx-auto border-t border-accent-beige/10 pt-12" ref={currentStep === 6 ? nextSectionRef : null}>
                              <div className="text-left mb-12 space-y-6">
                                <p className="font-serif italic text-5xl md:text-7xl text-primary-text leading-none">Visa Assistance</p>
                                <p className="text-xl md:text-2xl text-secondary-text font-serif italic leading-relaxed max-w-xl">
                                  Do you require assistance with your Visa application? We are happy to provide liaison and invitation documentation.
                                </p>
                                <div className="w-12 h-px bg-accent-terracotta/20 mt-6" />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                {['Yes', 'No'].map(choice => (
                                  <button key={choice} type="button" onClick={() => updateFormData('visaSupport', choice)}
                                    className={`p-6 border flex flex-col items-start gap-3 transition-all duration-700 ${formData.visaSupport === choice ? 'bg-[#FBF9F4] border-accent-terracotta/60 shadow-md' : 'bg-white border-accent-beige/10 opacity-80'}`}
                                  >
                                    <span className={`label-uppercase text-[10px] font-bold tracking-[0.3em] ${formData.visaSupport === choice ? 'text-accent-terracotta' : 'text-accent-beige opacity-60'}`}>{choice}</span>
                                    <p className={`font-serif italic text-2xl leading-tight ${formData.visaSupport === choice ? 'text-primary-text' : 'text-primary-text opacity-40'}`}>
                                      {choice === 'Yes' ? 'Assistance Needed' : 'Not Required'}
                                    </p>
                                  </button>
                                ))}
                              </div>
                              <div className="flex justify-end pt-12">
                                <button type="button" onClick={handleNext} className="group flex items-center gap-4 text-[11px] uppercase tracking-[0.4em] font-medium text-accent-beige hover:text-accent-terracotta transition-all">
                                  Continue <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                              </div>
                            </div>
                          )}

                        </div>
                      )}

                      {/* NOTE — shown when current step id is 'note' */}
                      {activeStep?.id === 'note' && (
                        <div className="animate-in fade-in slide-in-from-top-12 duration-1000 space-y-12 max-w-xl mx-auto border-t border-accent-beige/10 pt-12" ref={nextSectionRef}>
                          <div className="text-left mb-12">
                            <p className="font-serif italic text-5xl md:text-7xl text-primary-text leading-none mb-6">A Note for the Couple</p>
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
                        <div className="animate-in fade-in slide-in-from-top-12 duration-1000 space-y-12 max-w-xl mx-auto border-t border-accent-beige/10 pt-12" ref={nextSectionRef}>
                          <div className="text-left py-10 border-y border-accent-beige/10 relative space-y-12">
                            <div className="space-y-4">
                              <p className="label-uppercase text-[10px] text-accent-beige font-bold tracking-[0.3em]">Confirmation</p>
                              <p className="text-5xl md:text-7xl font-serif italic text-primary-text mb-10 leading-none">{formData.attendance}</p>
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