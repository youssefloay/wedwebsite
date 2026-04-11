import { Link } from "react-router";
import { useState, useEffect } from "react";
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
  Heart
} from 'lucide-react';

export function RsvpPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    attendance: "",
    firstName: "",
    lastName: "",
    email: "",
    guests: "1",
    guestNames: [] as { firstName: string; lastName: string }[],
    accommodation: "",
    roomPreference: "",
    transfer: "",
    carRental: "",
    needsParking: "",
    visaSupport: "",
    dietary: "",
    notes: ""
  });

  const roomTypes = [
    { name: 'Comfy', maxGuests: 2, pricePerNight: 153.5 },
    { name: 'Superior Comfy', maxGuests: 3, pricePerNight: 183.5 },
    { name: 'Castillo Junior', maxGuests: 2, pricePerNight: 208.5 },
    { name: 'Family Room', maxGuests: 4, pricePerNight: 218.5 }
  ];

  const handleAttendanceSelect = (option: string) => {
    updateFormData('attendance', option);
    // Smooth auto-advance for better UX
    setTimeout(() => {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 400);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsSubmitting(true);
      setError(null);

      try {
        // REPLACE 'YOUR_FORMSPREE_ID' with your actual Formspree ID
        const response = await fetch("https://formspree.io/f/YOUR_FORMSPREE_ID", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            ...formData,
            guestNames: formData.guestNames.map(g => `${g.firstName} ${g.lastName}`).join(", ")
          })
        });

        if (response.ok) {
          setIsSubmitted(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          throw new Error("Failed to submit RSVP");
        }
      } catch (err) {
        setError("Something went wrong. Please try again or contact us directly.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const updateFormData = (field: string, value: string) => {
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

  const steps = [
    { number: 1, label: "Attendance" },
    { number: 2, label: "Your Party" },
    { number: 3, label: "Preferences" },
    { number: 4, label: "Review" }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative Atmosphere Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-terracotta/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-beige/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'url("/arch-pattern.png")', backgroundSize: '400px' }} />
      
      <Navigation />
      
      {!isSubmitted ? (
        <div className="max-w-4xl mx-auto px-6 pt-40 pb-32 relative z-10 font-sans">
          
          {/* Artisanal Header */}
          <div className="text-center mb-16">
            <span className="label-uppercase tracking-[0.4em] mb-4">You are Invited</span>
            <h1 className="text-5xl md:text-7xl font-serif italic text-primary-text mb-6">RSVP</h1>
            <div className="flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-widest text-accent-beige">
              <div className="w-12 h-px bg-accent-beige/30" />
              Kindly respond by 13.11.2026
              <div className="w-12 h-px bg-accent-beige/30" />
            </div>
            
            {/* Minimal Progress Road */}
            <div className="max-w-sm mx-auto flex justify-between items-center mt-12 relative">
              <div className="absolute h-px bg-border/40 left-0 right-0 top-1/2 -z-10" />
              {steps.map((step) => (
                <div key={step.number} className="flex flex-col items-center gap-2">
                  <div className={`w-3 h-3 rounded-full transition-all duration-700 ${
                    currentStep === step.number 
                      ? 'bg-accent-terracotta ring-4 ring-accent-terracotta/10 scale-125' 
                      : currentStep > step.number 
                        ? 'bg-primary-text' 
                        : 'bg-border scale-75'
                  }`} />
                </div>
              ))}
            </div>
            <div className="mt-4 text-[10px] uppercase tracking-[0.2em] font-bold text-accent-beige">
              {steps[currentStep-1].label}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            {/* INVITATION CARD CONTAINER */}
            <div className="wedding-card bg-white/95 backdrop-blur-xl border-accent-terracotta/10 shadow-2xl p-8 md:p-14 min-h-[500px] flex flex-col justify-between">
              
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* STEP 1: ATTENDANCE (Visual) */}
                {currentStep === 1 && (
                  <div className="space-y-12">
                    <div className="text-center">
                      <h3 className="text-2xl md:text-3xl font-serif text-primary-text italic mb-3">Will you join the celebration?</h3>
                      <p className="text-sm text-secondary-text italic">Choose an option to continue</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { label: 'Joyfully accept', icon: <GlassWater size={28} />, value: 'Joyfully accept' },
                        { label: 'Regretfully decline', icon: <XCircle size={28} />, value: 'Regretfully decline' }
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleAttendanceSelect(opt.value)}
                          className={`group relative p-10 rounded-3xl border-2 text-center transition-all duration-500 overflow-hidden flex flex-col items-center gap-6 ${
                            formData.attendance === opt.value 
                              ? 'border-accent-terracotta bg-accent-terracotta/[0.02] shadow-xl scale-105' 
                              : 'border-border hover:border-accent-terracotta/40 hover:bg-background/50'
                          }`}
                        >
                          <div className={`p-4 rounded-full transition-all duration-500 ${
                            formData.attendance === opt.value ? 'bg-accent-terracotta text-white' : 'bg-background text-accent-terracotta group-hover:scale-110'
                          }`}>
                            {opt.icon}
                          </div>
                          <span className={`text-xl font-serif transition-colors ${
                            formData.attendance === opt.value ? 'text-primary-text font-medium' : 'text-secondary-text'
                          }`}>
                            {opt.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 2: DETAILS */}
                {currentStep === 2 && (
                  <div className="space-y-8">
                    <div className="text-center mb-10">
                      <h3 className="text-2xl md:text-3xl font-serif text-primary-text italic mb-2">Details of your stay</h3>
                      <p className="text-sm text-secondary-text italic">Let us get to know your traveling party</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-accent-beige pl-1">First Name</label>
                        <input
                          type="text"
                          required
                          className="w-full px-6 py-4 rounded-2xl border border-border bg-background/50 focus:border-accent-terracotta focus:ring-1 focus:ring-accent-terracotta outline-none transition-all"
                          value={formData.firstName}
                          onChange={(e) => updateFormData('firstName', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-accent-beige pl-1">Last Name</label>
                        <input
                          type="text"
                          required
                          className="w-full px-6 py-4 rounded-2xl border border-border bg-background/50 focus:border-accent-terracotta focus:ring-1 focus:ring-accent-terracotta outline-none transition-all"
                          value={formData.lastName}
                          onChange={(e) => updateFormData('lastName', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-accent-beige pl-1">Email Address</label>
                      <input
                        type="email"
                        required
                        className="w-full px-6 py-4 rounded-2xl border border-border bg-background/50 focus:border-accent-terracotta focus:ring-1 focus:ring-accent-terracotta outline-none transition-all"
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                      />
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border/50">
                      <div className="flex items-center gap-3 mb-4">
                        <Users size={16} className="text-accent-terracotta" />
                        <h4 className="text-[11px] uppercase tracking-widest font-bold text-primary-text">Party Size</h4>
                      </div>
                      <select
                        className="w-full px-6 py-4 rounded-2xl border border-border bg-background/50 focus:border-accent-terracotta outline-none appearance-none cursor-pointer"
                        value={formData.guests}
                        onChange={(e) => updateFormData('guests', e.target.value)}
                      >
                        <option value="1">Just Me</option>
                        <option value="2">Traveling as a Duo</option>
                        <option value="3">Party of Three</option>
                        <option value="4">A Group of Four</option>
                      </select>
                    </div>

                    {formData.guestNames.length > 0 && (
                      <div className="pt-8 space-y-6 animate-in slide-in-from-top-4 duration-500">
                        <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-accent-terracotta text-center italic">Plus One(s) Details</h4>
                        {formData.guestNames.map((guest, idx) => (
                          <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                              placeholder={`Guest ${idx+1} First Name`}
                              className="px-6 py-4 rounded-2xl border border-border bg-background/50 focus:border-accent-terracotta outline-none text-sm"
                              value={guest.firstName}
                              onChange={(e) => updateGuestName(idx, 'firstName', e.target.value)}
                            />
                            <input
                              placeholder={`Guest ${idx+1} Last Name`}
                              className="px-6 py-4 rounded-2xl border border-border bg-background/50 focus:border-accent-terracotta outline-none text-sm"
                              value={guest.lastName}
                              onChange={(e) => updateGuestName(idx, 'lastName', e.target.value)}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 3: PREFERENCES */}
                {currentStep === 3 && (
                  <div className="space-y-10">
                    <div className="text-center mb-8">
                       <h3 className="text-2xl md:text-3xl font-serif text-primary-text italic mb-2">Tailoring Your Trip</h3>
                       <p className="text-sm text-secondary-text italic">Help us coordinate the perfect stay</p>
                    </div>
                    
                    {/* Accommodation - Visual Toggle */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                         <Bed size={16} className="text-accent-terracotta" />
                         <span className="text-[10px] uppercase tracking-widest font-bold text-accent-beige">Stay at the Castle?</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {['Yes, please', 'No, thank you'].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => updateFormData('accommodation', opt)}
                            className={`py-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                              formData.accommodation === opt 
                                ? 'bg-primary-text text-white shadow-lg scale-105' 
                                : 'bg-background border border-border text-secondary-text hover:border-accent-terracotta/40'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                      
                      {formData.accommodation === 'Yes, please' && (
                        <div className="pt-4 animate-in fade-in slide-in-from-top-2">
                          <select
                            className="w-full px-6 py-4 rounded-2xl border border-border bg-background focus:border-accent-terracotta outline-none"
                            value={formData.roomPreference}
                            onChange={(e) => updateFormData('roomPreference', e.target.value)}
                          >
                            <option value="">Preferred Room Type</option>
                            {roomTypes.map(r => (
                              <option key={r.name} value={r.name}>{r.name} (Max {r.maxGuests})</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>

                    {/* Logistics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-border/40">
                      {/* Dietary */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                           <Utensils size={16} className="text-accent-terracotta" />
                           <span className="text-[10px] uppercase tracking-widest font-bold text-accent-beige">Dietary Needs</span>
                        </div>
                        <input
                          placeholder="Allergies or preferences..."
                          className="w-full px-5 py-3 rounded-xl border border-border bg-background focus:border-accent-terracotta outline-none text-sm"
                          value={formData.dietary}
                          onChange={(e) => updateFormData('dietary', e.target.value)}
                        />
                      </div>

                      {/* Visa */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                           <FileText size={16} className="text-accent-terracotta" />
                           <span className="text-[10px] uppercase tracking-widest font-bold text-accent-beige">Visa Support?</span>
                        </div>
                        <div className="flex gap-2">
                          {['Yes', 'No'].map(o => (
                            <button
                              key={o}
                              type="button"
                              onClick={() => updateFormData('visaSupport', o)}
                              className={`flex-1 py-3 rounded-xl border text-xs font-bold transition-all ${
                                formData.visaSupport === o ? 'border-accent-terracotta bg-accent-terracotta/5 text-accent-terracotta' : 'border-border text-secondary-text'
                              }`}
                            >
                              {o}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Transport Row */}
                    <div className="pt-8 border-t border-border/40 space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                         <Car size={16} className="text-accent-terracotta" />
                         <span className="text-[10px] uppercase tracking-widest font-bold text-accent-beige">Transport & Transfers</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { id: 'carRental', label: 'Renting Car', icon: <Car size={14} /> },
                          { id: 'transfer', label: 'Need Transfer', icon: <BusIcon size={14} /> },
                          { id: 'parking', label: 'Need Parking', icon: <Sparkles size={14} /> }
                        ].map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => updateFormData(item.id, formData[item.id as keyof typeof formData] === 'Yes' ? 'No' : 'Yes')}
                            className={`py-3 px-4 rounded-xl border text-[10px] uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all ${
                              formData[item.id as keyof typeof formData] === 'Yes' 
                                ? 'bg-primary-text text-white border-primary-text shadow-md' 
                                : 'bg-background border-border text-secondary-text hover:bg-background/80'
                            }`}
                          >
                            {item.icon} {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: REVIEW */}
                {currentStep === 4 && (
                  <div className="space-y-10">
                    <div className="text-center mb-8">
                       <h3 className="text-2xl md:text-3xl font-serif text-primary-text italic mb-2">Final Review</h3>
                       <p className="text-sm text-secondary-text italic">Almost there, {formData.firstName}</p>
                    </div>

                    <div className="bg-[#FBF9F4] rounded-[2.5rem] p-10 border border-accent-terracotta/5 space-y-6 relative overflow-hidden">
                      {/* Stylized Check Stamp in corner */}
                      <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent-terracotta/5 rounded-full flex items-center justify-center -rotate-12 border border-accent-terracotta/10">
                        <Check className="text-accent-terracotta/20" size={40} />
                      </div>

                      <div className="grid grid-cols-2 gap-y-6 text-sm">
                        <div>
                          <span className="text-[9px] uppercase tracking-[0.2em] text-accent-beige font-bold block mb-1">Response</span>
                          <span className="font-serif italic text-lg text-primary-text">{formData.attendance}</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase tracking-[0.2em] text-accent-beige font-bold block mb-1">Guests</span>
                          <span className="font-serif italic text-lg text-primary-text">{formData.guests} Total</span>
                        </div>
                        <div className="col-span-2 pt-4 border-t border-border/10">
                          <span className="text-[9px] uppercase tracking-[0.2em] text-accent-beige font-bold block mb-1">Primary Email</span>
                          <span className="font-medium text-primary-text">{formData.email}</span>
                        </div>
                        {(formData.accommodation === 'Yes, please' || formData.carRental === 'Yes' || formData.transfer === 'Yes') && (
                          <div className="col-span-2 pt-4 border-t border-border/10 space-y-2">
                             <span className="text-[9px] uppercase tracking-[0.2em] text-accent-beige font-bold block mb-2">Preferences Captured</span>
                             <div className="flex flex-wrap gap-2">
                               {formData.accommodation === 'Yes, please' && <span className="bg-white px-3 py-1 rounded-full text-[9px] border border-border italic text-secondary-text">Room: {formData.roomPreference || 'Requested'}</span>}
                               {formData.carRental === 'Yes' && <span className="bg-white px-3 py-1 rounded-full text-[9px] border border-border italic text-secondary-text">Car Rental</span>}
                               {formData.transfer === 'Yes' && <span className="bg-white px-3 py-1 rounded-full text-[9px] border border-border italic text-secondary-text">Transfer Coord.</span>}
                               {formData.visaSupport === 'Yes' && <span className="bg-white px-3 py-1 rounded-full text-[9px] border border-border italic text-secondary-text">Visa Documents</span>}
                             </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Actions */}
              <div className="mt-12 space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-center text-xs italic font-serif animate-shake">
                    {error}
                  </div>
                )}
                
                <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-6">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="text-[10px] uppercase tracking-widest font-bold text-secondary-text hover:text-accent-terracotta transition-colors flex items-center gap-2 group"
                    >
                      <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to {steps[currentStep-2].label}
                    </button>
                  ) : <div />}
                  
                  {currentStep > 1 && (
                    <button
                      type="submit"
                      disabled={isSubmitting || (currentStep === 2 && (!formData.firstName || !formData.lastName || !formData.email))}
                      className="btn-primary w-full sm:w-auto min-w-[220px]"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">Processing...</span>
                      ) : currentStep === 4 ? (
                        <span className="flex items-center gap-2">Confirm Attendance <ArrowRight size={16} /></span>
                      ) : (
                        <span className="flex items-center gap-2">Next Step <ArrowRight size={16} /></span>
                      )}
                    </button>
                  )}
                </div>
              </div>

            </div>
          </form>
        </div>
      ) : (
        /* SUCCESS VIEW - THE THANK YOU CARD */
        <div className="min-h-screen flex items-center justify-center px-6 py-20 relative z-10">
          <div className="max-w-xl w-full wedding-card bg-white p-16 text-center shadow-2xl transform rotate-1 animate-in zoom-in-95 duration-1000">
            <div className="mb-10 relative inline-block">
               <div className="absolute inset-0 bg-accent-terracotta/10 rounded-full blur-2xl -z-10 animate-pulse" />
               <Heart size={48} className="text-accent-terracotta mx-auto" strokeWidth={1} />
            </div>
            
            <span className="label-uppercase mb-4 block">Confirmado</span>
            <h1 className="text-4xl md:text-5xl font-serif italic text-primary-text mb-8">Muchas Gracias</h1>
            
            <p className="text-lg text-secondary-text leading-relaxed font-serif italic mb-10">
              "We have received your response, {formData.firstName}. Your attendance means the world to us and we can't wait to share this magical journey with you in the hills of Monda."
            </p>
            
            <div className="w-12 h-px bg-accent-terracotta/30 mx-auto mb-12" />
            
            <Link to="/" className="btn-primary-white border border-border group">
               Home <ArrowRight size={14} className="inline ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      )}
      
      {/* FINAL MOBILE CUE */}
      <footer className="absolute bottom-0 left-0 right-0 py-8 text-center pointer-events-none opacity-20">
         <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent-beige">Lama & Álvaro · 2027</p>
      </footer>
    </div>
  );
}