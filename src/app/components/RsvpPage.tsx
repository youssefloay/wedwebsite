import { Link } from "react-router";
import { useState } from "react";
import { Navigation } from './Navigation';
import { Check, ArrowRight, ArrowLeft } from 'lucide-react';

export function RsvpPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
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
    transferDetails: "",
    dietary: "",
    notes: ""
  });

  const roomTypes = [
    { name: 'Comfy', maxGuests: 2, pricePerNight: 153.5 },
    { name: 'Superior Comfy', maxGuests: 3, pricePerNight: 183.5 },
    { name: 'Castillo Junior', maxGuests: 2, pricePerNight: 208.5 },
    { name: 'Family Room', maxGuests: 4, pricePerNight: 218.5 }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log('RSVP Data:', formData);
      setIsSubmitted(true);
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
    { number: 2, label: "Details" },
    { number: 3, label: "Preferences" },
    { number: 4, label: "Confirmation" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {!isSubmitted ? (
        <div className="section-container">
          <div className="text-center mb-16 pt-8">
            <span className="label-uppercase">Please Respond</span>
            <h1 className="title-section mb-6">RSVP</h1>
            <p className="text-lg text-secondary-text mb-4 italic font-serif">
              Kindly respond by November 13th, 2026
            </p>
            
            {/* Step Indicators */}
            <div className="flex justify-center items-center gap-4 mt-12 mb-8">
              {steps.map((step) => (
                <div key={step.number} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                    currentStep >= step.number ? 'bg-primary-text text-white' : 'bg-border text-secondary-text'
                  }`}>
                    {step.number}
                  </div>
                  {step.number < steps.length && (
                    <div className={`w-8 md:w-16 h-px mx-2 ${currentStep > step.number ? 'bg-primary-text' : 'bg-border'}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-sm uppercase tracking-widest text-accent-beige font-medium">
              Step {currentStep}: {steps[currentStep-1].label}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
            <div className="wedding-card bg-white/50 backdrop-blur-sm">
              
              {/* STEP 1: ATTENDANCE */}
              {currentStep === 1 && (
                <div className="space-y-8">
                  <h3 className="title-card text-center mb-8">Will you be joining us?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['Joyfully accept', 'Regretfully decline'].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => updateFormData('attendance', option)}
                        className={`p-8 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-4 ${
                          formData.attendance === option 
                          ? 'border-accent-terracotta bg-white shadow-lg' 
                          : 'border-border bg-background/50 hover:bg-white'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          formData.attendance === option ? 'border-accent-terracotta bg-accent-terracotta' : 'border-border'
                        }`}>
                          {formData.attendance === option && <Check size={14} className="text-white" />}
                        </div>
                        <span className={`font-serif text-xl ${formData.attendance === option ? 'text-primary-text' : 'text-secondary-text'}`}>
                          {option}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: DETAILS */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="title-card text-center mb-8">Your Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="label-uppercase mb-2 text-left">First Name</label>
                      <input
                        type="text"
                        required
                        className="w-full px-6 py-4 rounded-xl border border-border bg-background focus:border-accent-terracotta focus:ring-1 focus:ring-accent-terracotta outline-none transition-all"
                        value={formData.firstName}
                        onChange={(e) => updateFormData('firstName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="label-uppercase mb-2 text-left">Last Name</label>
                      <input
                        type="text"
                        required
                        className="w-full px-6 py-4 rounded-xl border border-border bg-background focus:border-accent-terracotta focus:ring-1 focus:ring-accent-terracotta outline-none transition-all"
                        value={formData.lastName}
                        onChange={(e) => updateFormData('lastName', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="label-uppercase mb-2 text-left">Email Address</label>
                    <input
                      type="email"
                      required
                      className="w-full px-6 py-4 rounded-xl border border-border bg-background focus:border-accent-terracotta focus:ring-1 focus:ring-accent-terracotta outline-none transition-all"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="label-uppercase mb-2 text-left">How many guests?</label>
                    <select
                      className="w-full px-6 py-4 rounded-xl border border-border bg-background focus:border-accent-terracotta focus:ring-1 focus:ring-accent-terracotta outline-none transition-all"
                      value={formData.guests}
                      onChange={(e) => updateFormData('guests', e.target.value)}
                    >
                      <option value="1">1 (Just me)</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests</option>
                    </select>
                  </div>

                  {formData.guestNames.length > 0 && (
                    <div className="pt-6 space-y-6">
                      <h4 className="font-serif text-xl border-t border-border pt-6 mb-4">Plus One(s) Details</h4>
                      {formData.guestNames.map((guest, idx) => (
                        <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-border/10 last:border-0">
                          <input
                            placeholder={`Guest ${idx+1} First Name`}
                            className="px-6 py-3 rounded-xl border border-border bg-background/50 focus:border-accent-terracotta outline-none"
                            value={guest.firstName}
                            onChange={(e) => updateGuestName(idx, 'firstName', e.target.value)}
                          />
                          <input
                            placeholder={`Guest ${idx+1} Last Name`}
                            className="px-6 py-3 rounded-xl border border-border bg-background/50 focus:border-accent-terracotta outline-none"
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
                <div className="space-y-8">
                  <h3 className="title-card text-center mb-8">Logistics & Preferences</h3>
                  
                  {/* Accommodation */}
                  <div className="space-y-4">
                    <label className="label-uppercase">Accommodation Needed?</label>
                    <div className="grid grid-cols-2 gap-4">
                      {['Yes, please', 'No, thank you'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => updateFormData('accommodation', opt)}
                          className={`py-4 px-6 rounded-xl border transition-all ${
                            formData.accommodation === opt ? 'bg-primary-text text-white border-primary-text' : 'bg-background border-border text-secondary-text'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    {formData.accommodation === 'Yes, please' && (
                      <div className="pt-4 animate-in fade-in slide-in-from-top-2">
                        <select
                          className="w-full px-6 py-4 rounded-xl border border-border bg-background focus:border-accent-terracotta outline-none"
                          value={formData.roomPreference}
                          onChange={(e) => updateFormData('roomPreference', e.target.value)}
                        >
                          <option value="">Select Room Type preference</option>
                          {roomTypes.map(r => (
                            <option key={r.name} value={r.name}>{r.name} - max {r.maxGuests} pers.</option>
                          ))}
                        </select>
                        <p className="text-xs text-secondary-text mt-3 bg-accent-beige/10 p-4 rounded-lg italic">
                          * Rooms are limited at the Castle. We will coordinate with you directly.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Dietary */}
                  <div className="space-y-4 pt-4 border-t border-border">
                    <label className="label-uppercase">Dietary Requirements / Allergies</label>
                    <textarea
                      placeholder="e.g. Vegetarian, Gluten-free, etc."
                      className="w-full px-6 py-4 rounded-xl border border-border bg-background focus:border-accent-terracotta outline-none min-h-[100px]"
                      value={formData.dietary}
                      onChange={(e) => updateFormData('dietary', e.target.value)}
                    />
                  </div>

                  {/* Car Rental & Parking */}
                  <div className="space-y-4 pt-4 border-t border-border">
                    <label className="label-uppercase">Car Rental & Parking</label>
                    <div className="space-y-4">
                      <p className="text-sm text-secondary-text mb-4 italic">Will you be renting a car and do you require a parking spot?</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => updateFormData('carRental', 'Yes')}
                          className={`py-3 px-6 rounded-xl border text-sm transition-all ${
                            formData.carRental === 'Yes' ? 'bg-primary-text text-white border-primary-text' : 'bg-background border-border text-secondary-text'
                          }`}
                        >
                          I'm renting a car
                        </button>
                        <button
                          type="button"
                          onClick={() => updateFormData('carRental', 'No')}
                          className={`py-3 px-6 rounded-xl border text-sm transition-all ${
                            formData.carRental === 'No' ? 'bg-primary-text text-white border-primary-text' : 'bg-background border-border text-secondary-text'
                          }`}
                        >
                          No car rental
                        </button>
                      </div>
                      
                      {formData.carRental === 'Yes' && (
                        <div className="pt-2">
                          <label className="text-xs uppercase tracking-widest text-accent-terracotta font-bold mb-3 block">Parking Spot Needed?</label>
                          <div className="flex gap-4">
                            {['Yes', 'No'].map(opt => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => updateFormData('needsParking', opt)}
                                className={`flex-1 py-3 rounded-xl border text-sm transition-all ${
                                  formData.needsParking === opt ? 'bg-accent-terracotta text-white border-accent-terracotta' : 'bg-background border-border text-secondary-text'
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Visa Support */}
                  <div className="space-y-4 pt-4 border-t border-border">
                    <label className="label-uppercase">Visa Support</label>
                    <div className="space-y-4">
                      <p className="text-sm text-secondary-text mb-4 italic">Do you require a formal booking confirmation/invitation letter from the Hotel for your visa application?</p>
                      <div className="grid grid-cols-2 gap-4">
                        {['Yes', 'No'].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => updateFormData('visaSupport', opt)}
                            className={`py-4 px-6 rounded-xl border transition-all ${
                              formData.visaSupport === opt ? 'bg-primary-text text-white border-primary-text' : 'bg-background border-border text-secondary-text'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Transfer */}
                  <div className="space-y-4 pt-4 border-t border-border">
                    <label className="label-uppercase">Airport Transfer Coordination</label>
                    <p className="text-sm text-secondary-text mb-4 italic">If you are not renting a car, would you like us to help coordinate a shared transfer?</p>
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => updateFormData('transfer', 'Yes')}
                        className={`py-4 px-6 rounded-xl border text-center transition-all ${
                          formData.transfer === 'Yes' ? 'bg-accent-terracotta text-white border-accent-terracotta' : 'bg-background border-border text-secondary-text'
                        }`}
                      >
                        Yes, please coordinate
                      </button>
                      <button
                        type="button"
                        onClick={() => updateFormData('transfer', 'No')}
                        className={`py-4 px-6 rounded-xl border text-center transition-all ${
                          formData.transfer === 'No' ? 'bg-accent-terracotta text-white border-accent-terracotta' : 'bg-background border-border text-secondary-text'
                        }`}
                      >
                        No, I'm all set
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: REVIEW */}
              {currentStep === 4 && (
                <div className="space-y-8">
                  <h3 className="title-card text-center mb-8">Review your response</h3>
                  <div className="space-y-4 bg-background p-6 rounded-2xl border border-border/50">
                    <div className="flex justify-between border-b border-border/30 pb-3">
                      <span className="text-sm font-medium text-accent-beige uppercase">Attendance</span>
                      <span className="font-serif text-primary-text">{formData.attendance}</span>
                    </div>
                    <div className="flex justify-between border-b border-border/30 pb-3">
                      <span className="text-sm font-medium text-accent-beige uppercase">Name</span>
                      <span className="font-sans text-primary-text">{formData.firstName} {formData.lastName}</span>
                    </div>
                    <div className="flex justify-between border-b border-border/30 pb-3">
                      <span className="text-sm font-medium text-accent-beige uppercase">Guests</span>
                      <span className="font-serif text-primary-text">{formData.guests}</span>
                    </div>
                    {formData.accommodation && (
                      <div className="flex justify-between border-b border-border/30 pb-3">
                        <span className="text-sm font-medium text-accent-beige uppercase">Stay</span>
                        <span className="font-serif text-primary-text">{formData.accommodation}</span>
                      </div>
                    )}
                    {formData.carRental && (
                      <div className="flex justify-between border-b border-border/30 pb-3">
                        <span className="text-sm font-medium text-accent-beige uppercase">Car Rental</span>
                        <span className="font-serif text-primary-text">{formData.carRental} {formData.needsParking === 'Yes' ? '(Parking Requested)' : ''}</span>
                      </div>
                    )}
                    {formData.visaSupport === 'Yes' && (
                      <div className="flex justify-between border-b border-border/30 pb-3">
                        <span className="text-sm font-medium text-accent-beige uppercase">Visa Support</span>
                        <span className="font-serif text-primary-text">Documentation Requested</span>
                      </div>
                    )}
                    {formData.dietary && (
                      <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-accent-beige uppercase">Dietary</span>
                        <span className="text-primary-text italic">{formData.dietary}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-center text-secondary-text text-sm">
                    By clicking submit, you are confirming your attendance.
                  </p>
                </div>
              )}

            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center gap-4 pt-8">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="btn-secondary group flex items-center gap-2"
                >
                  <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                  Back
                </button>
              ) : <div />}
              
              <button
                type="submit"
                disabled={currentStep === 1 && !formData.attendance}
                className={`btn-primary group flex items-center gap-2 ${currentStep === 1 && !formData.attendance ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {currentStep === 4 ? 'Confirm & Submit' : 'Next Step'}
                {currentStep < 4 && <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* SUCCESS VIEW */
        <div className="section-container flex items-center justify-center min-h-[80vh] pt-32">
          <div className="wedding-card bg-white p-12 text-center max-w-xl shadow-2xl animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-accent-terracotta rounded-full flex items-center justify-center mx-auto mb-8 text-white shadow-lg">
              <Check size={40} />
            </div>
            <h1 className="title-section mb-6">RSVP Received</h1>
            <p className="text-xl font-serif italic text-primary-text mb-8">
              Gracias, {formData.firstName}!
            </p>
            <p className="text-secondary-text mb-12">
              We've successfully received your response. A confirmation email has been sent to {formData.email}. We can't wait to see you in Monda!
            </p>
            <Link to="/" className="btn-primary">
              Return to Website
            </Link>
          </div>
        </div>
      )}

      {/* ALREADY REPLIED SECTION */}
      {!isSubmitted && (
        <div className="section-container pb-24">
          <div className="max-w-2xl mx-auto wedding-card bg-white/50 backdrop-blur-sm p-12 md:p-16 text-center relative overflow-hidden">
            <div className="relative z-10">
              <span className="label-uppercase mb-4 block">Already Replied?</span>
              <h3 className="text-2xl font-serif text-primary-text mb-8 leading-relaxed">
                Complete your final details & <br className="hidden md:block" /> travel preferences here
              </h3>
              <a 
                href="https://forms.gle/example" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                Before You Arrive
              </a>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="pt-8 pb-32 text-center border-t border-border bg-background">
        <p className="label-uppercase mb-0">Lama & Álvaro · 2027</p>
      </footer>
    </div>
  );
}