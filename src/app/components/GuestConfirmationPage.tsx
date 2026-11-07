import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { getRsvpById, submitGuestConfirmation, RsvpData } from '../../lib/rsvpService';
import { decodeGuestPayload } from '../../lib/guestCodec';
import {
  Check, Heart, Plane, Car, Bed, Utensils, Users, ChevronRight,
  Accessibility, MessageCircle, CheckCircle2, Loader2, AlertTriangle,
  User, UserPlus
} from 'lucide-react';

interface PlusOneDietary {
  firstName: string;
  lastName: string;
  hasDietary: string; // 'No, no dietary restrictions' | 'Yes, has dietary restrictions'
  selectedTags: string[];
  details: string;
}

const DIETARY_OPTIONS = [
  "Vegetarian",
  "Vegan",
  "Pescatarian",
  "Gluten-Free (Celiac)",
  "Lactose / Dairy Free",
  "Nut Allergy (Peanuts / Tree Nuts)",
  "Shellfish / Seafood Allergy",
  "Egg Allergy",
  "Soy Free",
  "Halal",
  "Kosher",
  "Pregnancy restrictions",
  "Other"
];

function RadioGroup({ name, options, value, onChange }: { name: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-3 mt-3" role="radiogroup">
      {options.map(opt => (
        <div
          key={opt}
          role="radio"
          aria-checked={value === opt}
          tabIndex={0}
          onClick={() => onChange(opt)}
          onKeyDown={e => (e.key === ' ' || e.key === 'Enter') && onChange(opt)}
          className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer select-none transition-all ${value === opt ? 'border-accent-terracotta bg-accent-terracotta/5' : 'border-accent-terracotta/20 hover:border-accent-terracotta/40 bg-white'}`}
        >
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${value === opt ? 'border-accent-terracotta bg-accent-terracotta' : 'border-accent-terracotta/30'}`}>
            {value === opt && <div className="w-2 h-2 rounded-full bg-white" />}
          </div>
          <span className="font-serif italic text-primary-text">{opt}</span>
        </div>
      ))}
    </div>
  );
}

function CheckboxGroup({ options, selected, onChange }: { options: string[]; selected: string[]; onChange: (v: string[]) => void }) {
  const toggle = (opt: string) => {
    if (selected.includes(opt)) {
      onChange(selected.filter(item => item !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
      {options.map(opt => {
        const isChecked = selected.includes(opt);
        return (
          <div
            key={opt}
            role="checkbox"
            aria-checked={isChecked}
            tabIndex={0}
            onClick={() => toggle(opt)}
            onKeyDown={e => (e.key === ' ' || e.key === 'Enter') && toggle(opt)}
            className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer select-none transition-all ${isChecked ? 'border-accent-terracotta bg-accent-terracotta/5 font-semibold' : 'border-accent-terracotta/20 hover:border-accent-terracotta/40 bg-white'}`}
          >
            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isChecked ? 'border-accent-terracotta bg-accent-terracotta text-white' : 'border-accent-terracotta/30 bg-white'}`}>
              {isChecked && <Check size={14} strokeWidth={3} />}
            </div>
            <span className="font-serif italic text-primary-text text-sm">{opt}</span>
          </div>
        );
      })}
    </div>
  );
}

function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[30px] border border-accent-terracotta/10 shadow-sm p-8 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-accent-terracotta/10 rounded-xl text-accent-terracotta">{icon}</div>
        <h3 className="text-2xl font-serif italic text-primary-text">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#FBF9F4] border border-accent-terracotta/10 rounded-2xl p-5 mb-6 font-serif italic text-secondary-text leading-relaxed">
      {children}
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div className="mb-4">
      <label className="block text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-black/5 border border-accent-terracotta/10 rounded-2xl p-4 font-serif italic text-primary-text outline-none focus:ring-2 ring-accent-terracotta/20 transition-all"
      />
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="mb-4">
      <label className="block text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold mb-2">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full bg-black/5 border border-accent-terracotta/10 rounded-2xl p-4 font-serif italic text-primary-text outline-none focus:ring-2 ring-accent-terracotta/20 transition-all resize-none"
      />
    </div>
  );
}

export function GuestConfirmationPage() {
  const { token } = useParams<{ token: string }>();
  const [guest, setGuest] = useState<RsvpData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState(false);
  // Tracks whether the user has interacted with the form; if so, Firestore data won't overwrite their changes
  const formTouched = React.useRef(false);

  // Form state
  const [rsvpChange, setRsvpChange] = useState('No, everything is still correct');
  const [rsvpChangeNote, setRsvpChangeNote] = useState('');
  
  const [accomCorrect, setAccomCorrect] = useState('Yes, this is correct');
  const [accomChangeNote, setAccomChangeNote] = useState('');
  const [bedPreference, setBedPreference] = useState('No preference');

  const [externalName, setExternalName] = useState('');
  const [externalAddress, setExternalAddress] = useState('');
  const [externalCity, setExternalCity] = useState('');
  const [travelingWith, setTravelingWith] = useState('');
  const [travelingWithNames, setTravelingWithNames] = useState('');

  const [arrivalMethod, setArrivalMethod] = useState('Plane');
  const [arrivalDate, setArrivalDate] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [flightIn, setFlightIn] = useState('');

  const [airportTransferIn, setAirportTransferIn] = useState('Not sure yet');
  const [transferInPax, setTransferInPax] = useState('');
  
  // Shuttle / Taxi back and forth for external guests
  const [weddingDayTo, setWeddingDayTo] = useState('Not sure yet');
  const [weddingDayFrom, setWeddingDayFrom] = useState('Not sure yet');
  const [weddingDayPax, setWeddingDayPax] = useState('');

  const [departureMethod, setDepartureMethod] = useState('Plane');
  const [departureDate, setDepartureDate] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [flightOut, setFlightOut] = useState('');
  const [airportTransferOut, setAirportTransferOut] = useState('Not sure yet');
  const [transferOutPax, setTransferOutPax] = useState('');

  const [hasDietary, setHasDietary] = useState('No, I have no dietary restrictions');
  const [selectedDietaryTags, setSelectedDietaryTags] = useState<string[]>([]);
  const [otherDietaryDetails, setOtherDietaryDetails] = useState('');
  const [plusOnes, setPlusOnes] = useState<PlusOneDietary[]>([]);

  const [hasAccessibility, setHasAccessibility] = useState('No');
  const [accessibilityDetails, setAccessibilityDetails] = useState('');

  const [otherChanges, setOtherChanges] = useState('');
  const [anythingElse, setAnythingElse] = useState('');

  const applyGuestData = (data: Partial<RsvpData>) => {
    setGuest(data as RsvpData);
    if (data.bedPreference) setBedPreference(data.bedPreference);
    if (data.externalAccommodationName) setExternalName(data.externalAccommodationName);
    if (data.externalAccommodationAddress) setExternalAddress(data.externalAccommodationAddress);
    if (data.externalAccommodationCity) setExternalCity(data.externalAccommodationCity);
    if (data.travelingWithGuests) setTravelingWith(data.travelingWithGuests);
    if (data.travelingWithGuestNames) setTravelingWithNames(data.travelingWithGuestNames);
    if (data.arrivalMethod) setArrivalMethod(data.arrivalMethod);
    if (data.arrivalDate) setArrivalDate(data.arrivalDate);
    if (data.arrivalTime) setArrivalTime(data.arrivalTime);
    if (data.flightNumberArrival) setFlightIn(data.flightNumberArrival);
    if (data.airportTransferIn) setAirportTransferIn(data.airportTransferIn);
    if (data.transferInPax) setTransferInPax(String(data.transferInPax));
    if (data.weddingDayTransferTo) setWeddingDayTo(data.weddingDayTransferTo);
    if (data.weddingDayTransferFrom) setWeddingDayFrom(data.weddingDayTransferFrom);
    if (data.weddingDayTransferPax) setTransferOutPax(String(data.weddingDayTransferPax));
    if (data.departureMethod) setDepartureMethod(data.departureMethod);
    if (data.departureDate) setDepartureDate(data.departureDate);
    if (data.departureTime) setDepartureTime(data.departureTime);
    if (data.flightNumberDeparture) setFlightOut(data.flightNumberDeparture);
    if (data.airportTransferOut) setAirportTransferOut(data.airportTransferOut);
    if (data.transferOutPax) setTransferOutPax(String(data.transferOutPax));
    
    // Per-guest dietary parsing
    const partyCount = Number(data.guests) || 1;
    const existingGuestNames = data.guestNames || [];
    const plusOneCount = Math.max(existingGuestNames.length, Math.max(0, partyCount - 1));

    // Check if data.dietary has the pipe syntax (e.g. "Name 1: ... | Name 2: ...")
    const hasPipeFormat = data.dietary && data.dietary.includes('|');
    const pipeParts = hasPipeFormat ? data.dietary!.split('|').map(p => p.trim()) : [];

    // Parse main guest dietary
    let mainDietaryRaw = data.dietary || '';
    if (hasPipeFormat && pipeParts.length > 0) {
      const firstSeg = pipeParts[0];
      mainDietaryRaw = firstSeg.includes(':') ? firstSeg.split(':').slice(1).join(':').trim() : firstSeg;
    }

    if (data.dietaryCategories && data.dietaryCategories.length > 0 && (!hasPipeFormat || (mainDietaryRaw && mainDietaryRaw.toLowerCase() !== 'none'))) {
      setHasDietary('Yes, I have dietary restrictions');
      setSelectedDietaryTags(data.dietaryCategories);
      if (mainDietaryRaw && mainDietaryRaw.trim() !== '' && mainDietaryRaw.toLowerCase() !== 'none') {
        const otherDetail = mainDietaryRaw.includes('Other details:')
          ? mainDietaryRaw.split('Other details:')[1].trim()
          : (!data.dietaryCategories.some(c => mainDietaryRaw?.includes(c)) ? mainDietaryRaw : '');
        if (otherDetail) setOtherDietaryDetails(otherDetail);
      }
    } else if (mainDietaryRaw && mainDietaryRaw.trim() !== '' && mainDietaryRaw.toLowerCase() !== 'none') {
      setHasDietary('Yes, I have dietary restrictions');
      const matchedTags = DIETARY_OPTIONS.filter(opt => mainDietaryRaw?.toLowerCase().includes(opt.toLowerCase()));
      if (matchedTags.length > 0) {
        setSelectedDietaryTags(matchedTags);
        const remaining = matchedTags.reduce((acc, t) => acc.replace(new RegExp(t, 'gi'), ''), mainDietaryRaw)
          .replace(/[,\s]+/g, ' ').trim();
        if (remaining && remaining.length > 2) setOtherDietaryDetails(remaining);
      } else {
        setOtherDietaryDetails(mainDietaryRaw);
      }
    } else {
      setHasDietary('No, I have no dietary restrictions');
      setSelectedDietaryTags([]);
      setOtherDietaryDetails('');
    }

    // Parse plus ones dietary
    const p1List: PlusOneDietary[] = [];
    for (let i = 0; i < plusOneCount; i++) {
      const gn = existingGuestNames[i] || { firstName: '', lastName: '' };
      let p1HasDiet = 'No, no dietary restrictions';
      let p1Tags: string[] = [];
      let p1Det = '';

      if (gn.dietaryCategories && gn.dietaryCategories.length > 0) {
        p1HasDiet = 'Yes, has dietary restrictions';
        p1Tags = gn.dietaryCategories;
        if (gn.dietary && gn.dietary !== 'None') {
          const otherDetail = gn.dietary.includes('Other details:')
            ? gn.dietary.split('Other details:')[1].trim()
            : (!gn.dietaryCategories.some(c => gn.dietary?.includes(c)) ? gn.dietary : '');
          if (otherDetail) p1Det = otherDetail;
        }
      } else if (gn.dietary && gn.dietary.trim() !== '' && gn.dietary.toLowerCase() !== 'none') {
        p1HasDiet = 'Yes, has dietary restrictions';
        const matched = DIETARY_OPTIONS.filter(opt => gn.dietary?.toLowerCase().includes(opt.toLowerCase()));
        if (matched.length > 0) {
          p1Tags = matched;
        } else {
          p1Det = gn.dietary;
        }
      } else if (hasPipeFormat) {
        const seg = (gn.firstName && pipeParts.find(p => p.toLowerCase().includes(gn.firstName.toLowerCase()))) || pipeParts[i + 1];
        if (seg) {
          const dietText = seg.includes(':') ? seg.split(':').slice(1).join(':').trim() : seg.trim();
          if (dietText && dietText.toLowerCase() !== 'none') {
            p1HasDiet = 'Yes, has dietary restrictions';
            const matched = DIETARY_OPTIONS.filter(opt => dietText.toLowerCase().includes(opt.toLowerCase()));
            if (matched.length > 0) p1Tags = matched;
            p1Det = dietText;
          }
        }
      }

      p1List.push({
        firstName: gn.firstName || '',
        lastName: gn.lastName || '',
        hasDietary: p1HasDiet,
        selectedTags: p1Tags,
        details: p1Det,
      });
    }
    setPlusOnes(p1List);

    if (data.hasAccessibilityNeeds) setHasAccessibility('Yes');
    if (data.accessibilityDetails) setAccessibilityDetails(data.accessibilityDetails);
    if (data.rsvpChangeNote) {
      setRsvpChange('Yes, another detail has changed');
      setRsvpChangeNote(data.rsvpChangeNote);
    }
    if (data.otherChanges) setOtherChanges(data.otherChanges);
    if (data.anythingElse) setAnythingElse(data.anythingElse);
  };

  useEffect(() => {
    // 1. Instant preview: If encoded data in URL exists, prefill immediately for zero-lag display
    let hasUrlData = false;
    try {
      const search = window.location.search || (window.location.hash.includes('?') ? '?' + window.location.hash.split('?')[1] : '');
      const params = new URLSearchParams(search);
      const encoded = params.get('d');
      if (encoded) {
        const decoded = decodeGuestPayload(encoded);
        if (decoded) {
          applyGuestData(decoded);
          hasUrlData = true;
          setIsLoading(false);
        }
      }
    } catch (e) {
      console.warn("Could not parse URL guest payload, falling back to Firestore", e);
    }

    if (!token) {
      if (!hasUrlData) setNotFound(true);
      setIsLoading(false);
      return;
    }

    // 2. Fetch fresh data from Firestore so any previously submitted adjustments appear
    const timeout = setTimeout(() => {
      if (!hasUrlData) {
        setLoadError(true);
        setIsLoading(false);
      }
    }, 10000);

    getRsvpById(token)
      .then(data => {
        clearTimeout(timeout);
        if (!data) {
          if (!hasUrlData) setNotFound(true);
        } else {
          // Only overwrite form state if the user hasn't started filling in the form yet
          if (!formTouched.current) {
            applyGuestData(data);
          } else {
            // Still update guest metadata (id, name, etc.) for submission, but keep user's form edits
            setGuest(prev => ({ ...data, ...prev } as RsvpData));
          }
        }
        setIsLoading(false);
      })
      .catch(err => {
        clearTimeout(timeout);
        console.error('Failed to load guest data:', err);
        if (!hasUrlData) setLoadError(true);
        setIsLoading(false);
      });

    return () => clearTimeout(timeout);
  }, [token]);

  const isAtCastle = guest?.accommodation === 'Yes, please';

  const handleSubmit = async () => {
    const targetId = guest?.id || token;
    if (!targetId || targetId === 'guest') {
      alert('Could not determine guest identity. Please use your personalized confirmation link.');
      return;
    }
    setIsSubmitting(true);
    try {
      const updates: Partial<RsvpData> = {
        confirmationSubmittedAt: new Date() as any,
        arrivalMethod,
        arrivalDate,
        arrivalTime,
        flightNumberArrival: flightIn,
        departureMethod,
        departureDate,
        departureTime,
        flightNumberDeparture: flightOut,
        otherChanges,
        anythingElse,
        rsvpChangeNote: rsvpChange !== 'No, everything is still correct' ? rsvpChangeNote : '',
      };

      if (isAtCastle) {
        updates.bedPreference = bedPreference;
        updates.airportTransferIn = airportTransferIn;
        updates.airportTransferOut = airportTransferOut;
        updates.transferInPax = Number(transferInPax) || 0;
        updates.transferOutPax = Number(transferOutPax) || 0;
        if (accomCorrect !== 'Yes, this is correct') {
          updates.notes = (guest?.notes ? guest.notes + '\n' : '') + `[Accommodation change note: ${accomChangeNote}]`;
        }
      } else {
        updates.externalAccommodationName = externalName;
        updates.externalAccommodationAddress = externalAddress;
        updates.externalAccommodationCity = externalCity;
        updates.travelingWithGuests = travelingWith;
        updates.travelingWithGuestNames = travelingWith === 'Yes' ? travelingWithNames : '';
        updates.weddingDayTransferTo = weddingDayTo;
        updates.weddingDayTransferFrom = weddingDayFrom;
        updates.weddingDayTransferPax = Number(weddingDayPax) || 0;
      }

      // Dietary handling (per-guest support)
      let mainDietaryStr = 'None';
      if (hasDietary === 'Yes, I have dietary restrictions') {
        mainDietaryStr = [
          ...selectedDietaryTags.filter(t => t !== 'Other'),
          otherDietaryDetails.trim() ? `Other details: ${otherDietaryDetails}` : ''
        ].filter(Boolean).join(', ') || 'Restricted';
      }

      const updatedGuestNames = plusOnes.map((p1, idx) => {
        let p1DietaryStr = 'None';
        if (p1.hasDietary === 'Yes, has dietary restrictions') {
          p1DietaryStr = [
            ...p1.selectedTags.filter(t => t !== 'Other'),
            p1.details.trim() ? `Other details: ${p1.details}` : ''
          ].filter(Boolean).join(', ') || 'Restricted';
        }
        return {
          firstName: p1.firstName.trim() || (guest?.guestNames && guest.guestNames[idx]?.firstName) || '',
          lastName: p1.lastName.trim() || (guest?.guestNames && guest.guestNames[idx]?.lastName) || '',
          dietary: p1DietaryStr,
          dietaryCategories: p1.hasDietary === 'Yes, has dietary restrictions' ? p1.selectedTags : []
        };
      });

      if (updatedGuestNames.length === 0) {
        updates.dietary = mainDietaryStr;
        updates.dietaryCategories = hasDietary === 'Yes, I have dietary restrictions' ? selectedDietaryTags : [];
        updates.guestNames = [];
      } else {
        const mainName = `${guest?.firstName || 'Main Guest'} ${guest?.lastName || ''}`.trim();
        const allDietaryCategories = new Set<string>();
        if (hasDietary === 'Yes, I have dietary restrictions') {
          selectedDietaryTags.forEach(t => allDietaryCategories.add(t));
        }
        updatedGuestNames.forEach(gn => {
          (gn.dietaryCategories || []).forEach(t => allDietaryCategories.add(t));
        });

        const allNone = mainDietaryStr === 'None' && updatedGuestNames.every(gn => gn.dietary === 'None');
        if (allNone) {
          updates.dietary = 'None';
          updates.dietaryCategories = [];
        } else {
          const segments: string[] = [
            `${mainName}: ${mainDietaryStr}`
          ];
          updatedGuestNames.forEach((gn, idx) => {
            const p1Name = `${gn.firstName} ${gn.lastName}`.trim() || `Guest ${idx + 2}`;
            segments.push(`${p1Name}: ${gn.dietary || 'None'}`);
          });
          updates.dietary = segments.join(' | ');
          updates.dietaryCategories = Array.from(allDietaryCategories);
        }
        updates.guestNames = updatedGuestNames;
      }

      updates.hasAccessibilityNeeds = hasAccessibility === 'Yes';
      if (hasAccessibility === 'Yes') {
        updates.accessibilityDetails = accessibilityDetails;
      }

      await submitGuestConfirmation(targetId, updates);

      // Keep guest state fresh and update URL encoded payload in address bar
      const mergedGuest: RsvpData = {
        ...(guest || {}),
        ...updates,
        id: targetId,
      } as RsvpData;
      setGuest(mergedGuest);

      try {
        const { encodeGuestPayload } = await import('../../lib/guestCodec');
        const newEncoded = encodeGuestPayload(mergedGuest);
        if (newEncoded) {
          const newUrl = `${window.location.pathname}#/guest-confirmation/${targetId}?d=${newEncoded}`;
          window.history.replaceState(null, '', newUrl);
        }
      } catch (e) {
        // ignore
      }

      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Submission failed:', err);
      alert('Something went wrong submitting your details. Please try again or contact Lama & Álvaro.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FBF9F4] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-accent-terracotta" size={48} />
          <p className="font-serif italic text-secondary-text text-xl">Loading your details...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-[#FBF9F4] flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <AlertTriangle className="text-amber-500 mx-auto mb-6" size={56} />
          <h1 className="text-3xl font-serif italic text-primary-text mb-4">Something went wrong</h1>
          <p className="font-serif italic text-secondary-text text-lg leading-relaxed mb-6">
            We couldn't load your details — this is usually a temporary network issue.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-accent-terracotta text-white rounded-full font-serif italic text-lg hover:bg-accent-terracotta/90 transition-all shadow-md"
          >
            Try Again
          </button>
          <p className="mt-6 font-serif italic text-secondary-text opacity-60 text-sm">
            If this keeps happening, please contact Lama & Álvaro directly.
          </p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#FBF9F4] flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <AlertTriangle className="text-accent-terracotta mx-auto mb-6" size={56} />
          <h1 className="text-4xl font-serif italic text-primary-text mb-4">Link Not Found</h1>
          <p className="font-serif italic text-secondary-text text-lg leading-relaxed">
            This link doesn't seem to be valid. Please check your email for the correct personal link, or contact us directly.
          </p>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#FBF9F4] flex items-center justify-center p-8">
        <div className="text-center max-w-lg">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-200">
            <CheckCircle2 className="text-green-500" size={52} />
          </div>
          <h1 className="text-5xl font-serif italic text-primary-text mb-4">Thank you, {guest?.firstName}!</h1>
          <p className="font-serif italic text-secondary-text text-xl leading-relaxed mb-6">
            Your details have been updated. We now have your latest RSVP, accommodation, travel and dietary information.
          </p>
          <p className="font-serif italic text-secondary-text opacity-70 leading-relaxed mb-8">
            We will use this information to coordinate the final wedding arrangements and transportation. We can't wait to celebrate with you in Monda! 🤍
          </p>
          <button
            onClick={() => {
              setIsSubmitted(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-8 py-3 bg-white border border-accent-terracotta/30 text-accent-terracotta rounded-2xl hover:bg-black/5 transition-all font-serif italic text-base shadow-sm"
          >
            Need to change something? Edit my answers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF9F4]">
      {/* Header */}
      <div className="bg-white border-b border-accent-terracotta/10 shadow-sm">
        <div className="max-w-3xl mx-auto px-6 py-8 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-accent-terracotta font-bold mb-3">Lama & Álvaro — April 17, 2027</p>
          <h1 className="text-4xl md:text-5xl font-serif italic text-primary-text mb-2">Final Confirmation</h1>
          <p className="font-serif italic text-secondary-text opacity-70 text-lg">
            Hello, <strong className="text-primary-text not-italic">{guest?.firstName}</strong>! Please review and confirm your details below.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">

        {/* ─── SECTION 1: RSVP ─── */}
        <SectionCard title="Your RSVP" icon={<Heart size={20} />}>
          <InfoBox>
            You confirmed your attendance
            {guest?.guests && Number(guest.guests) > 1
              ? ` for ${guest.guests} guests`
              : ' for yourself'}
            {guest?.guestNames && guest.guestNames.length > 0
              ? ` — including ${guest.guestNames.map(g => g.firstName).join(', ')}`
              : ''
            }.
          </InfoBox>
          <p className="text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold mb-2">Has anything changed since your original RSVP?</p>
          <RadioGroup
            name="rsvpChange"
            options={['No, everything is still correct', 'Yes, my attendance has changed', 'Yes, my plus-one has changed', 'Yes, another detail has changed']}
            value={rsvpChange}
            onChange={setRsvpChange}
          />
          {rsvpChange !== 'No, everything is still correct' && (
            <div className="mt-4">
              <TextArea
                label="Please describe what has changed"
                value={rsvpChangeNote}
                onChange={setRsvpChangeNote}
                placeholder="e.g. My partner can no longer attend / I am now coming with a different plus-one..."
              />
            </div>
          )}
        </SectionCard>

        {/* ─── SECTION 2: ACCOMMODATION ─── */}
        <SectionCard title="Your Accommodation" icon={<Bed size={20} />}>
          {isAtCastle ? (
            <>
              <InfoBox>
                We currently have you booked at <strong>Castillo de Monda</strong>
                {guest?.stayDuration ? ` — ${guest.stayDuration}` : ''}.
                {guest?.roomPreference ? ` Room type: ${guest.roomPreference}.` : ''}
              </InfoBox>
              
              <div className="mb-6">
                <p className="text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold mb-2">What type of bed arrangement do you prefer for your room?</p>
                <RadioGroup
                  name="bedPref"
                  options={['King Bed (1 large bed)', 'Twin Beds (2 separate beds)', 'No preference']}
                  value={bedPreference}
                  onChange={setBedPreference}
                />
              </div>

              <p className="text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold mb-2">Is this room booking information still correct?</p>
              <RadioGroup
                name="accomCorrect"
                options={['Yes, this is correct', 'No, I need to make a change']}
                value={accomCorrect}
                onChange={setAccomCorrect}
              />
              {accomCorrect !== 'Yes, this is correct' && (
                <div className="mt-4">
                  <TextArea
                    label="Please describe your requested accommodation changes"
                    value={accomChangeNote}
                    onChange={setAccomChangeNote}
                    placeholder="e.g. I need to change my room type / I want to add an extra night / I will stay elsewhere..."
                  />
                </div>
              )}
            </>
          ) : (
            <>
              <InfoBox>
                You indicated you will arrange your own accommodation.
              </InfoBox>
              
              <p className="text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold mb-2">Where will you be staying during the wedding?</p>
              <div className="mt-4 space-y-2">
                <InputField label="Name of Hotel / Airbnb / Villa" value={externalName} onChange={setExternalName} placeholder="e.g. Hotel Molina Lario / Villa Sol" />
                <InputField label="Exact Address (Street name, building #, area)" value={externalAddress} onChange={setExternalAddress} placeholder="e.g. Calle Larios 12, Málaga" />
                <InputField label="City / Area" value={externalCity} onChange={setExternalCity} placeholder="e.g. Málaga / Monda / Marbella" />
              </div>

              <div className="mt-6">
                <p className="text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold mb-2">Are you staying with or travelling with other wedding guests?</p>
                <RadioGroup name="travelWith" options={['Yes', 'No', 'Not sure']} value={travelingWith} onChange={setTravelingWith} />
                {travelingWith === 'Yes' && (
                  <div className="mt-3">
                    <InputField label="Their names (if known)" value={travelingWithNames} onChange={setTravelingWithNames} placeholder="e.g. John & Sarah Smith" />
                  </div>
                )}
              </div>
            </>
          )}
        </SectionCard>

        {/* ─── SECTION 3: ARRIVAL ─── */}
        <SectionCard title="Your Arrival" icon={<Plane size={20} />}>
          <p className="text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold mb-2">How will you arrive in the Málaga area?</p>
          <RadioGroup name="arrivalMethod" options={['Plane', 'Car', 'Other']} value={arrivalMethod} onChange={setArrivalMethod} />
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Arrival Date" value={arrivalDate} onChange={setArrivalDate} type="date" />
            <InputField label="Approximate Arrival Time" value={arrivalTime} onChange={setArrivalTime} placeholder="e.g. 14:30" />
          </div>
          {arrivalMethod === 'Plane' && (
            <InputField label="Flight Number (optional — if already booked)" value={flightIn} onChange={setFlightIn} placeholder="e.g. VY1234" />
          )}

          {/* Airport Transfer Logic */}
          {isAtCastle ? (
            <div className="mt-6 bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
              <p className="font-bold text-indigo-700 text-sm uppercase tracking-widest mb-1">Airport Transfer</p>
              <p className="font-serif italic text-secondary-text mb-4">
                Since you are staying at Castillo de Monda, we may be able to arrange transportation from Málaga Airport to Castillo de Monda.
              </p>
              <p className="text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold mb-2">Would you like to be considered for an airport transfer to Castillo de Monda?</p>
              <RadioGroup name="airportTransferIn" options={['Yes', 'No', 'Not sure yet']} value={airportTransferIn} onChange={setAirportTransferIn} />
              {airportTransferIn === 'Yes' && (
                <div className="mt-4">
                  <InputField label="Number of people requiring the transfer" value={transferInPax} onChange={setTransferInPax} placeholder="e.g. 2" type="number" />
                </div>
              )}
            </div>
          ) : (
            <div className="mt-6 bg-amber-50 border border-amber-100 rounded-2xl p-5">
              <p className="font-bold text-amber-700 text-sm uppercase tracking-widest mb-1">Airport Transportation</p>
              <p className="font-serif italic text-secondary-text text-sm leading-relaxed">
                As you are staying outside Castillo de Monda, transportation from Málaga Airport to your accommodation will need to be arranged independently.
              </p>
            </div>
          )}
        </SectionCard>

        {/* ─── SECTION 4: WEDDING-DAY TRANSPORT / TAXI (non-castle only) ─── */}
        {!isAtCastle && (
          <SectionCard title="Wedding-Day Transportation & Taxi" icon={<Car size={20} />}>
            <p className="font-serif italic text-secondary-text mb-5 leading-relaxed">
              We are organizing group shuttle / taxi transport between guest accommodations and Castillo de Monda for the wedding day.
            </p>
            
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold mb-2">Do you need a taxi/shuttle from your accommodation to Castillo de Monda on the wedding day?</p>
              <RadioGroup name="weddingTo" options={['Yes', 'No', 'Not sure yet']} value={weddingDayTo} onChange={setWeddingDayTo} />
            </div>

            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold mb-2">Do you need a taxi/shuttle from Castillo de Monda back to your accommodation after the wedding?</p>
              <RadioGroup name="weddingFrom" options={['Yes', 'No', 'Not sure yet']} value={weddingDayFrom} onChange={setWeddingDayFrom} />
            </div>

            {(weddingDayTo === 'Yes' || weddingDayFrom === 'Yes') && (
              <InputField label="Number of people requiring the shuttle / taxi" value={weddingDayPax} onChange={setWeddingDayPax} placeholder="e.g. 2" type="number" />
            )}
          </SectionCard>
        )}

        {/* ─── SECTION 5: DEPARTURE ─── */}
        <SectionCard title="Your Departure" icon={<Plane size={20} className="rotate-180" />}>
          <p className="text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold mb-2">How will you leave the Málaga area?</p>
          <RadioGroup name="departureMethod" options={['Plane', 'Car', 'Other']} value={departureMethod} onChange={setDepartureMethod} />
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Departure Date" value={departureDate} onChange={setDepartureDate} type="date" />
            <InputField label="Approximate Departure Time" value={departureTime} onChange={setDepartureTime} placeholder="e.g. 18:00" />
          </div>
          {departureMethod === 'Plane' && (
            <InputField label="Flight Number (optional — if already booked)" value={flightOut} onChange={setFlightOut} placeholder="e.g. VY1235" />
          )}

          {/* Return transfer (castle only) */}
          {isAtCastle && (
            <div className="mt-6 bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
              <p className="font-bold text-indigo-700 text-sm uppercase tracking-widest mb-1">Return Airport Transfer</p>
              <p className="font-serif italic text-secondary-text mb-4">
                Would you like to be considered for transportation from Castillo de Monda to Málaga Airport?
              </p>
              <RadioGroup name="airportTransferOut" options={['Yes', 'No', 'Not sure yet']} value={airportTransferOut} onChange={setAirportTransferOut} />
              {airportTransferOut === 'Yes' && (
                <div className="mt-4">
                  <InputField label="Number of people requiring the transfer" value={transferOutPax} onChange={setTransferOutPax} placeholder="e.g. 2" type="number" />
                </div>
              )}
            </div>
          )}
        </SectionCard>

        {/* ─── SECTION 6: DIETARY ─── */}
        <SectionCard title="Dietary Requirements & Allergies" icon={<Utensils size={20} />}>
          {guest?.dietary && guest.dietary.trim() && guest.dietary !== 'None' ? (
            <InfoBox>
              Currently registered requirements for your party:<br />
              <strong className="text-primary-text">{guest.dietary}</strong>
            </InfoBox>
          ) : (
            <InfoBox>We currently have no dietary requirements registered for your party.</InfoBox>
          )}

          {plusOnes.length > 0 ? (
            <div className="space-y-8">
              <div className="bg-amber-50/70 border border-amber-200/60 rounded-2xl p-4 text-xs text-amber-900 font-serif italic">
                You are attending as a party of <strong>{(Number(guest?.guests) || (plusOnes.length + 1))}</strong>. Please confirm dietary requirements for each person individually below so our chef can cater specifically to each of you.
              </div>

              {/* Main Guest Card */}
              <div className="bg-white border-2 border-accent-terracotta/20 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-black/5">
                  <div className="w-8 h-8 rounded-full bg-accent-terracotta text-white flex items-center justify-center text-xs font-bold font-serif">
                    <User size={16} />
                  </div>
                  <div>
                    <h4 className="font-serif italic text-lg text-primary-text font-bold">
                      {guest?.firstName} {guest?.lastName} <span className="text-xs font-sans uppercase tracking-widest text-accent-terracotta ml-1 font-bold">(You)</span>
                    </h4>
                    <p className="text-[11px] text-secondary-text font-serif italic opacity-70">Main Guest</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold mb-2">Do you have any dietary requirements or allergies?</p>
                  <RadioGroup
                    name="hasDietaryMain"
                    options={[
                      'No, I have no dietary restrictions',
                      'Yes, I have dietary restrictions'
                    ]}
                    value={hasDietary}
                    onChange={v => { formTouched.current = true; setHasDietary(v); }}
                  />
                </div>

                {hasDietary === 'Yes, I have dietary restrictions' && (
                  <div className="mt-4 space-y-4 pt-2 border-t border-black/5 animate-in fade-in duration-300">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold mb-2">Select all that apply to you:</p>
                      <CheckboxGroup
                        options={DIETARY_OPTIONS}
                        selected={selectedDietaryTags}
                        onChange={v => { formTouched.current = true; setSelectedDietaryTags(v); }}
                      />
                    </div>
                    <TextArea
                      label="Other / Specific Allergies for You"
                      value={otherDietaryDetails}
                      onChange={v => { formTouched.current = true; setOtherDietaryDetails(v); }}
                      placeholder="e.g. Celiac disease, severe peanut allergy..."
                    />
                  </div>
                )}
              </div>

              {/* Plus Ones Cards */}
              {plusOnes.map((p1, idx) => {
                const displayName = p1.firstName ? `${p1.firstName} ${p1.lastName}`.trim() : `Guest ${idx + 2}`;
                return (
                  <div key={idx} className="bg-white border-2 border-accent-terracotta/20 rounded-3xl p-6 shadow-sm space-y-4">
                    <div className="flex items-center gap-3 pb-3 border-b border-black/5">
                      <div className="w-8 h-8 rounded-full bg-accent-terracotta/80 text-white flex items-center justify-center text-xs font-bold font-serif">
                        <UserPlus size={16} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-serif italic text-lg text-primary-text font-bold">
                          {displayName}
                        </h4>
                        <p className="text-[11px] text-secondary-text font-serif italic opacity-70">Additional Guest {idx + 2}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputField
                        label="First Name"
                        value={p1.firstName}
                        onChange={v => {
                          formTouched.current = true;
                          setPlusOnes(prev => {
                            const copy = [...prev];
                            copy[idx] = { ...copy[idx], firstName: v };
                            return copy;
                          });
                        }}
                        placeholder={`Guest ${idx + 2} First Name`}
                      />
                      <InputField
                        label="Last Name"
                        value={p1.lastName}
                        onChange={v => {
                          formTouched.current = true;
                          setPlusOnes(prev => {
                            const copy = [...prev];
                            copy[idx] = { ...copy[idx], lastName: v };
                            return copy;
                          });
                        }}
                        placeholder={`Guest ${idx + 2} Last Name`}
                      />
                    </div>

                    <div className="pt-2">
                      <p className="text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold mb-2">
                        Does {p1.firstName || `Guest ${idx + 2}`} have any dietary requirements or allergies?
                      </p>
                      <RadioGroup
                        name={`hasDietaryP1_${idx}`}
                        options={[
                          'No, no dietary restrictions',
                          'Yes, has dietary restrictions'
                        ]}
                        value={p1.hasDietary}
                        onChange={v => {
                          formTouched.current = true;
                          setPlusOnes(prev => {
                            const copy = [...prev];
                            copy[idx] = { ...copy[idx], hasDietary: v };
                            return copy;
                          });
                        }}
                      />
                    </div>

                    {p1.hasDietary === 'Yes, has dietary restrictions' && (
                      <div className="mt-4 space-y-4 pt-2 border-t border-black/5 animate-in fade-in duration-300">
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold mb-2">
                            Select all that apply to {p1.firstName || `Guest ${idx + 2}`}:
                          </p>
                          <CheckboxGroup
                            options={DIETARY_OPTIONS}
                            selected={p1.selectedTags}
                            onChange={tags => {
                              formTouched.current = true;
                              setPlusOnes(prev => {
                                const copy = [...prev];
                                copy[idx] = { ...copy[idx], selectedTags: tags };
                                return copy;
                              });
                            }}
                          />
                        </div>
                        <TextArea
                          label={`Other / Specific Allergies for ${p1.firstName || `Guest ${idx + 2}`}`}
                          value={p1.details}
                          onChange={v => {
                            formTouched.current = true;
                            setPlusOnes(prev => {
                              const copy = [...prev];
                              copy[idx] = { ...copy[idx], details: v };
                              return copy;
                            });
                          }}
                          placeholder="e.g. Shellfish allergy, vegetarian..."
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold mb-2">Do you have any dietary requirements or allergies?</p>
              <RadioGroup
                name="hasDietary"
                options={[
                  'No, I have no dietary restrictions',
                  'Yes, I have dietary restrictions'
                ]}
                value={hasDietary}
                onChange={v => { formTouched.current = true; setHasDietary(v); }}
              />

              {hasDietary === 'Yes, I have dietary restrictions' && (
                <div className="mt-6 space-y-5 animate-in fade-in duration-300">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold mb-2">Select all restrictions that apply:</p>
                    <CheckboxGroup
                      options={DIETARY_OPTIONS}
                      selected={selectedDietaryTags}
                      onChange={v => { formTouched.current = true; setSelectedDietaryTags(v); }}
                    />
                  </div>

                  <div className="mt-4">
                    <TextArea
                      label="Other / Specific Allergies & Details"
                      value={otherDietaryDetails}
                      onChange={v => { formTouched.current = true; setOtherDietaryDetails(v); }}
                      placeholder="Please specify any exact allergies, severe reactions, or additional details here..."
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </SectionCard>

        {/* ─── SECTION 7: ACCESSIBILITY ─── */}
        <SectionCard title="Accessibility & Special Needs" icon={<Users size={20} />}>
          <p className="text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold mb-2">Do you have any accessibility or mobility requirements we should be aware of?</p>
          <RadioGroup name="hasAccessibility" options={['No', 'Yes']} value={hasAccessibility} onChange={setHasAccessibility} />
          {hasAccessibility === 'Yes' && (
            <div className="mt-4">
              <TextArea
                label="Please describe your requirements"
                value={accessibilityDetails}
                onChange={setAccessibilityDetails}
                placeholder="e.g. Wheelchair access required, limited mobility..."
              />
            </div>
          )}
        </SectionCard>

        {/* ─── SECTION 8: FINAL NOTES ─── */}
        <SectionCard title="Anything Else?" icon={<MessageCircle size={20} />}>
          <TextArea
            label="Is there anything else that has changed since your original RSVP?"
            value={otherChanges}
            onChange={setOtherChanges}
            placeholder="Let us know about anything we should be aware of..."
          />
          <TextArea
            label="Is there anything we can help you with before the wedding?"
            value={anythingElse}
            onChange={setAnythingElse}
            placeholder="Any questions, concerns or requests..."
          />
        </SectionCard>

        {/* ─── SUBMIT ─── */}
        <div className="pt-4 pb-16">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-accent-terracotta text-white py-5 rounded-2xl text-lg font-bold tracking-wide hover:bg-accent-terracotta/90 transition-all shadow-lg shadow-accent-terracotta/20 active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-3"
          >
            {isSubmitting ? (
              <><Loader2 className="animate-spin" size={22} /> Submitting...</>
            ) : (
              <><Check size={22} /> Confirm My Details</>
            )}
          </button>
          <p className="text-center font-serif italic text-secondary-text opacity-50 text-sm mt-4">
            Your information is saved securely and will only be used to coordinate your wedding experience.
          </p>
        </div>
      </div>
    </div>
  );
}
