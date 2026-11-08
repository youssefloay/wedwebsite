import React, { useState } from "react";
import { X, Save, LayoutGrid, MapPin, Merge, Plane, Car, Bed, Utensils, CalendarCheck, Clock, CheckCircle2, AlertTriangle, Users, Accessibility, MessageSquare } from "lucide-react";
import { RsvpData, updateRsvp, deleteRsvp, DIETARY_OPTIONS } from "../../../lib/rsvpService";
import { toast } from "sonner";
import { InteractiveMapModal } from "./InteractiveMapModal";

// DIETARY_OPTIONS imported from rsvpService (single source of truth)

interface EditRsvpModalProps {
  rsvp: RsvpData;
  allRsvps?: RsvpData[];
  onClose: () => void;
  onSuccess: () => void;
}

export const EditRsvpModal = ({ rsvp, allRsvps = [], onClose, onSuccess }: EditRsvpModalProps) => {
  const [editingGuest, setEditingGuest] = useState<RsvpData>(rsvp);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showRoomGrid, setShowRoomGrid] = useState(false);
  const [selectedMergeId, setSelectedMergeId] = useState<string>("");

  const placeholders = allRsvps.filter(r => 
    r.id !== rsvp.id && (r.isPlaceholder || r.email?.includes('placeholder-') || r.notes === "Placeholder created by admin.")
  );

  const handleMerge = async () => {
    if (!selectedMergeId) return;
    const placeholder = placeholders.find(p => p.id === selectedMergeId);
    if (!placeholder) return;

    setIsUpdating(true);
    try {
      // 1. Transfer room assignment to current guest
      const updatedGuest = { ...editingGuest, assignedRoom: placeholder.assignedRoom };
      await updateRsvp(editingGuest.id!, updatedGuest);
      
      // 2. Delete the placeholder
      await deleteRsvp(placeholder.id!);
      
      toast.success(`Merged with ${placeholder.firstName}! Room ${placeholder.assignedRoom || 'Unassigned'} transferred.`);
      onSuccess();
    } catch (err) {
      toast.error("Failed to merge with placeholder");
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGuest.id) return;

    setIsUpdating(true);
    try {
      const payload: RsvpData = { ...editingGuest };

      // Multi-guest dietary unification:
      // If multi-guest party, ensure each plus-one has their dietary data preserved,
      // and update payload.dietary so admin lists, catering exports and chefs see the combined per-guest breakdown.
      if (payload.guests > 1 && payload.guestNames && payload.guestNames.length > 0) {
        const mainName = `${payload.firstName} ${payload.lastName}`.trim();
        const mainDiet = payload.dietary && payload.dietary.trim() && payload.dietary !== 'None' ? payload.dietary.trim() : 'None';
        const anyPlusOneHasDiet = payload.guestNames.some(g => (g.dietary && g.dietary.trim() && g.dietary !== 'None') || (g.dietaryCategories && g.dietaryCategories.length > 0));

        if (anyPlusOneHasDiet) {
          const segments: string[] = [`${mainName}: ${mainDiet}`];
          payload.guestNames.forEach((g, idx) => {
            const p1Name = `${g.firstName} ${g.lastName}`.trim() || `Guest ${idx + 2}`;
            const p1Diet = g.dietary && g.dietary.trim() && g.dietary !== 'None' ? g.dietary.trim() : 'None';
            segments.push(`${p1Name}: ${p1Diet}`);
          });

          const allNone = mainDiet === 'None' && payload.guestNames.every(g => !g.dietary || g.dietary.trim() === '' || g.dietary === 'None');
          if (allNone) {
            payload.dietary = 'None';
          } else {
            payload.dietary = segments.join(' | ');
          }

          // Merge all dietary categories
          const allCats = new Set<string>(payload.dietaryCategories || []);
          payload.guestNames.forEach(g => {
            (g.dietaryCategories || []).forEach(c => allCats.add(c));
          });
          payload.dietaryCategories = Array.from(allCats);
        }
      }

      await updateRsvp(editingGuest.id, payload);
      toast.success("RSVP updated successfully");
      onSuccess();
    } catch (err) {
      toast.error("Failed to update RSVP");
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEditChange = (field: keyof RsvpData, value: any) => {
    setEditingGuest({ ...editingGuest, [field]: value });
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-md" onClick={onClose}>
      <div className="bg-white rounded-[40px] max-w-3xl w-full max-h-[90vh] overflow-y-auto p-12 shadow-2xl relative" onClick={e => e.stopPropagation()}>
        <button
          className="absolute top-8 right-8 p-3 bg-black/5 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <form onSubmit={handleUpdate} className="space-y-10">
          <div>
            <h3 className="text-4xl font-serif italic text-primary-text mb-2">Edit Response</h3>
            <p className="text-secondary-text font-serif italic opacity-70">Manually update guest details and preferences.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="label-uppercase text-[10px] text-accent-terracotta font-bold tracking-widest">First Name</label>
              <input
                type="text"
                className="w-full bg-black/5 border-none p-4 rounded-2xl outline-none focus:ring-1 ring-accent-terracotta/20 font-serif italic text-lg"
                value={editingGuest.firstName}
                onChange={(e) => handleEditChange('firstName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="label-uppercase text-[10px] text-accent-terracotta font-bold tracking-widest">Last Name</label>
              <input
                type="text"
                className="w-full bg-black/5 border-none p-4 rounded-2xl outline-none focus:ring-1 ring-accent-terracotta/20 font-serif italic text-lg"
                value={editingGuest.lastName}
                onChange={(e) => handleEditChange('lastName', e.target.value)}
              />
            </div>
            <div className="space-y-2 col-span-full">
              <label className="label-uppercase text-[10px] text-accent-terracotta font-bold tracking-widest">Email Address</label>
              <input
                type="email"
                className="w-full bg-black/5 border-none p-4 rounded-2xl outline-none focus:ring-1 ring-accent-terracotta/20 font-serif italic text-lg"
                value={editingGuest.email}
                onChange={(e) => handleEditChange('email', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-black/5 pt-10">
            <div className="space-y-2">
              <label className="label-uppercase text-[10px] text-accent-terracotta font-bold tracking-widest">Attendance</label>
              <select
                className="w-full bg-black/5 border-none p-4 rounded-2xl outline-none focus:ring-1 ring-accent-terracotta/20 font-serif italic text-lg"
                value={editingGuest.attendance}
                onChange={(e) => handleEditChange('attendance', e.target.value)}
              >
                <option value="">-- Select --</option>
                <option value="Joyfully accept">Joyfully accept</option>
                <option value="Regretfully decline">Regretfully decline</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="label-uppercase text-[10px] text-accent-terracotta font-bold tracking-widest">Party Size</label>
              <input
                type="number"
                min="1"
                max="10"
                className="w-full bg-black/5 border-none p-4 rounded-2xl outline-none focus:ring-1 ring-accent-terracotta/20 font-serif italic text-lg"
                value={editingGuest.guests || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  const numGuests = val === "" ? ("" as any) : parseInt(val);
                  const validGuests = val === "" ? 1 : (parseInt(val) || 1);
                  const newGuestNames = Array(Math.max(0, validGuests - 1)).fill(null).map((_, i) =>
                    (editingGuest.guestNames && editingGuest.guestNames[i]) || { firstName: '', lastName: '' }
                  );
                  setEditingGuest(prev => ({
                    ...prev,
                    guests: numGuests,
                    guestNames: newGuestNames
                  }));
                }}
              />
            </div>
            <div className="space-y-2 flex items-end">
              <label className="flex items-center gap-3 bg-black/5 p-4 rounded-2xl cursor-pointer hover:bg-black/10 transition-all w-full h-[60px]">
                <input
                  type="checkbox"
                  className="w-5 h-5 accent-accent-terracotta"
                  checked={editingGuest.isPlaceholder || false}
                  onChange={(e) => handleEditChange('isPlaceholder', e.target.checked)}
                />
                <span className="label-uppercase text-[10px] text-accent-terracotta font-bold tracking-widest">Admin Placeholder</span>
              </label>
            </div>
          </div>

          {editingGuest.guests > 1 && (
            <div className="space-y-4 border-t border-black/5 pt-10">
              <h4 className="text-xl font-serif italic text-primary-text mb-4">Additional Guests</h4>
              {Array.from({ length: Math.max(0, editingGuest.guests - 1) }).map((_, idx) => {
                const guest = (editingGuest.guestNames && editingGuest.guestNames[idx]) || { firstName: '', lastName: '' };
                return (
                  <div key={idx} className="bg-black/5 p-6 rounded-2xl space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="label-uppercase text-[10px] text-accent-terracotta font-bold tracking-widest">Guest {idx + 2} First Name</label>
                        <input
                          type="text"
                          className="w-full bg-transparent border-b border-black/10 py-2 outline-none focus:border-accent-terracotta font-serif italic text-lg"
                          value={guest.firstName}
                          onChange={(e) => {
                            const newGuestNames = [...(editingGuest.guestNames || [])];
                            while (newGuestNames.length <= idx) newGuestNames.push({ firstName: '', lastName: '' });
                            newGuestNames[idx] = { ...newGuestNames[idx], firstName: e.target.value };
                            handleEditChange('guestNames', newGuestNames);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="label-uppercase text-[10px] text-accent-terracotta font-bold tracking-widest">Guest {idx + 2} Last Name</label>
                        <input
                          type="text"
                          className="w-full bg-transparent border-b border-black/10 py-2 outline-none focus:border-accent-terracotta font-serif italic text-lg"
                          value={guest.lastName}
                          onChange={(e) => {
                            const newGuestNames = [...(editingGuest.guestNames || [])];
                            while (newGuestNames.length <= idx) newGuestNames.push({ firstName: '', lastName: '' });
                            newGuestNames[idx] = { ...newGuestNames[idx], lastName: e.target.value };
                            handleEditChange('guestNames', newGuestNames);
                          }}
                        />
                      </div>
                    </div>

                    {/* Per-guest dietary requirement */}
                    <div className="border-t border-black/5 pt-4 space-y-3">
                      <label className="label-uppercase text-[10px] text-accent-terracotta font-bold tracking-widest flex items-center gap-1.5">
                        <Utensils size={12} /> Dietary Requirements for {guest.firstName || `Guest ${idx + 2}`}
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {DIETARY_OPTIONS.map(opt => {
                          const currentCats = guest.dietaryCategories || [];
                          const isSelected = currentCats.includes(opt);
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => {
                                const newCats = isSelected
                                  ? currentCats.filter(c => c !== opt)
                                  : [...currentCats, opt];
                                const newGuestNames = [...(editingGuest.guestNames || [])];
                                while (newGuestNames.length <= idx) newGuestNames.push({ firstName: '', lastName: '' });
                                newGuestNames[idx] = {
                                  ...newGuestNames[idx],
                                  dietaryCategories: newCats,
                                  dietary: newCats.join(', ')
                                };
                                handleEditChange('guestNames', newGuestNames);
                              }}
                              className={`px-3 py-1 rounded-full text-[11px] font-serif italic border transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                                  : 'bg-white/60 text-secondary-text border-black/10 hover:bg-white'
                              }`}
                            >
                              {opt} {isSelected && '✓'}
                            </button>
                          );
                        })}
                      </div>

                      <input
                        type="text"
                        placeholder={`Specific dietary notes/allergies for ${guest.firstName || `Guest ${idx + 2}`}...`}
                        className="w-full bg-white border border-black/10 p-3 rounded-xl outline-none focus:border-accent-terracotta font-serif italic text-sm"
                        value={guest.dietary || ''}
                        onChange={(e) => {
                          const newGuestNames = [...(editingGuest.guestNames || [])];
                          while (newGuestNames.length <= idx) newGuestNames.push({ firstName: '', lastName: '' });
                          newGuestNames[idx] = { ...newGuestNames[idx], dietary: e.target.value };
                          handleEditChange('guestNames', newGuestNames);
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="space-y-8 border-t border-black/5 pt-10">
            <div className="space-y-2 col-span-full">
              <label className="label-uppercase text-[10px] text-accent-terracotta font-bold tracking-widest">Stay Dates</label>
              <div className="flex flex-wrap gap-4">
                {['Thursday 15th', 'Friday 16th', 'Saturday 17th', 'Sunday 18th'].map(date => {
                  const dateNumber = date.split(' ')[1].replace('th', '');
                  const isChecked = !!(
                    editingGuest.stayDuration?.includes(date) || 
                    editingGuest.manualStayDates?.includes(dateNumber) || 
                    editingGuest.manualStayDates?.includes(date.split(' ')[0])
                  );

                  return (
                    <label key={date} className="flex items-center gap-2 bg-black/5 p-3 rounded-xl cursor-pointer hover:bg-black/10 transition-all">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 accent-accent-terracotta"
                        checked={isChecked}
                        onChange={(e) => {
                          const current = editingGuest.stayDuration?.split(',').map(s => s.trim()).filter(Boolean) || [];
                          // Also parse any dates from manualStayDates so we don't lose them when converting
                          const manual = editingGuest.manualStayDates || "";
                          let allDates = new Set(current);
                          
                          if (manual.includes("15")) allDates.add("Thursday 15th");
                          if (manual.includes("16")) allDates.add("Friday 16th");
                          if (manual.includes("17")) allDates.add("Saturday 17th");
                          if (manual.includes("18")) allDates.add("Sunday 18th");

                          allDates.delete('Extra Night');

                          if (e.target.checked) {
                            allDates.add(date);
                          } else {
                            allDates.delete(date);
                          }

                          setEditingGuest(prev => ({
                            ...prev,
                            stayDuration: Array.from(allDates).join(', '),
                            manualStayDates: "" // Clear legacy field
                          }));
                        }}
                      />
                      <span className="font-serif italic text-sm">{date}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="label-uppercase text-[10px] text-accent-terracotta font-bold tracking-widest">Accommodation</label>
                <select
                  className="w-full bg-black/5 border-none p-4 rounded-2xl outline-none focus:ring-1 ring-accent-terracotta/20 font-serif italic text-lg"
                  value={editingGuest.accommodation}
                  onChange={(e) => handleEditChange('accommodation', e.target.value)}
                >
                  <option value="">-- Select --</option>
                  <option value="Yes, please">Castillo de Monda</option>
                  <option value="No, thank you">Independent</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="label-uppercase text-[10px] text-accent-terracotta font-bold tracking-widest">Room Preference</label>
                <input
                  type="text"
                  className="w-full bg-black/5 border-none p-4 rounded-2xl outline-none focus:ring-1 ring-accent-terracotta/20 font-serif italic text-lg"
                  value={editingGuest.roomPreference}
                  onChange={(e) => handleEditChange('roomPreference', e.target.value)}
                />
              </div>

              {editingGuest.accommodation === 'Yes, please' && (
                <div className="space-y-2">
                  <label className="label-uppercase text-[10px] text-accent-terracotta font-bold tracking-widest">Payment Status</label>
                  <select
                    className="w-full bg-black/5 border-none p-4 rounded-2xl outline-none focus:ring-1 ring-accent-terracotta/20 font-serif italic text-lg"
                    value={editingGuest.paymentStatus || "Unpaid"}
                    onChange={(e) => handleEditChange('paymentStatus', e.target.value)}
                  >
                    <option value="Unpaid">Unpaid</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2 col-span-full">
                <label className="label-uppercase text-[10px] text-accent-terracotta font-bold tracking-widest flex justify-between items-center">
                  <span>Assigned Room</span>
                  <span className="text-[9px] text-secondary-text opacity-60">Check Map for Details</span>
                </label>
                <div className="flex gap-4">
                  <select 
                    className="flex-1 bg-black/5 border-none p-4 rounded-2xl outline-none focus:ring-1 ring-accent-terracotta/20 font-serif italic text-lg"
                    value={editingGuest.assignedRoom || ""}
                    onChange={(e) => handleEditChange('assignedRoom', e.target.value)}
                  >
                    <option value="">-- Unassigned --</option>
                    <optgroup label="Level 1 & 2 (Level 2: Stairs Only)">
                      <option value="101 (Superior Comfy, 3 pax, King + Sofa-bed)">101 (Superior Comfy, 3 pax, King + Sofa-bed)</option>
                      <option value="201 (Comfy, 2 pax, King)">201 (Comfy, 2 pax, King)</option>
                      <option value="202 (Castillo Junior, 2 pax, King, Terrace)">202 (Castillo Junior, 2 pax, King, Terrace)</option>
                    </optgroup>
                    <optgroup label="Level 3 (Elevator Access)">
                      <option value="301 (Comfy, 2 pax, King)">301 (Comfy, 2 pax, King)</option>
                      <option value="302 (Comfy, 2 pax, King)">302 (Comfy, 2 pax, King)</option>
                      <option value="303 (Comfy, 2 pax, King)">303 (Comfy, 2 pax, King)</option>
                    </optgroup>
                    <optgroup label="Level 4 (Elevator Access)">
                      <option value="400 (Superior Comfy, 2 pax, Twin)">400 (Superior Comfy, 2 pax, Twin)</option>
                      <option value="400A (Family Room / Superior Comfy, 2 pax)">400A (Family Room / Superior Comfy, 2 pax)</option>
                      <option value="401 (Superior Comfy, 2 pax, Twin)">401 (Superior Comfy, 2 pax, Twin)</option>
                      <option value="402 (Superior Comfy, 2 pax, Twin)">402 (Superior Comfy, 2 pax, Twin)</option>
                      <option value="403 (Superior Comfy, 2 pax, Twin, Balcony)">403 (Superior Comfy, 2 pax, Twin, Balcony)</option>
                      <option value="404 (Superior Comfy, 2 pax, Twin, Balcony)">404 (Superior Comfy, 2 pax, Twin, Balcony)</option>
                      <option value="405 (Superior Comfy, 2 pax, Twin, Balcony)">405 (Superior Comfy, 2 pax, Twin, Balcony)</option>
                      <option value="406 (Superior Comfy, 2 pax, Twin)">406 (Superior Comfy, 2 pax, Twin)</option>
                      <option value="407 (Superior Comfy, 2 pax, Twin, Balcony)">407 (Superior Comfy, 2 pax, Twin, Balcony)</option>
                      <option value="408 (Superior Comfy, 2 pax, Twin)">408 (Superior Comfy, 2 pax, Twin)</option>
                      <option value="409 (Superior Comfy, 3 pax, Twin + Sofa-bed)">409 (Superior Comfy, 3 pax, Twin + Sofa-bed)</option>
                      <option value="410 (Superior Comfy, 2 pax, Twin)">410 (Superior Comfy, 2 pax, Twin)</option>
                    </optgroup>
                    <optgroup label="Level 5 (Elevator Access)">
                      <option value="501 (Comfy, 2 pax)">501 (Comfy, 2 pax)</option>
                      <option value="502 (Comfy, 2 pax)">502 (Comfy, 2 pax)</option>
                      <option value="505 (Family Room, 4 pax)">505 (Family Room, 4 pax)</option>
                      <option value="507 (Superior Comfy, 2 pax)">507 (Superior Comfy, 2 pax)</option>
                      <option value="508 (Comfy, 2 pax, Twin)">508 (Comfy, 2 pax, Twin)</option>
                    </optgroup>
                    <optgroup label="Level 6 (Elevator Access)">
                      <option value="503 (Comfy, 2 pax)">503 (Comfy, 2 pax)</option>
                      <option value="506 (Castillo Junior, 2 pax)">506 (Castillo Junior, 2 pax)</option>
                      <option value="601 (Comfy, 2 pax)">601 (Comfy, 2 pax)</option>
                      <option value="602 (Comfy, 2 pax)">602 (Comfy, 2 pax)</option>
                      <option value="603 (Castillo Junior, 2 pax)">603 (Castillo Junior, 2 pax)</option>
                      <option value="703 (Castillo Junior, 2 pax)">703 (Castillo Junior, 2 pax)</option>
                    </optgroup>
                    <optgroup label="Level 7 (Stairs Only)">
                      <option value="700 (Castillo Junior, 2 pax)">700 (Castillo Junior, 2 pax)</option>
                      <option value="701 (Superior Comfy, 2 pax, Twin)">701 (Superior Comfy, 2 pax, Twin)</option>
                      <option value="702 (Superior Comfy, 2 pax, Twin)">702 (Superior Comfy, 2 pax, Twin)</option>
                      <option value="704 (Comfy, 2 pax)">704 (Comfy, 2 pax)</option>
                      <option value="705 (Superior Comfy, 2 pax)">705 (Superior Comfy, 2 pax)</option>
                      <option value="706 (Castillo Junior, 2 pax)">706 (Castillo Junior, 2 pax)</option>
                    </optgroup>
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowRoomGrid(true)}
                    className="bg-accent-terracotta text-white px-6 rounded-2xl font-serif italic hover:bg-accent-terracotta/90 transition-all shadow-md flex items-center gap-2 whitespace-nowrap group active:scale-95"
                  >
                    <MapPin size={18} className="group-hover:-translate-y-1 transition-transform" />
                    Interactive Map
                  </button>
                </div>
              </div>
            </div>

            {/* LINK/MERGE SECTION */}
            {!rsvp.isPlaceholder && placeholders.length > 0 && (
              <div className="bg-yellow-50/50 p-8 rounded-3xl border border-yellow-200/50 space-y-6">
                <div>
                  <h4 className="text-xl font-serif italic text-primary-text flex items-center gap-2">
                    <Merge size={20} className="text-yellow-600" />
                    Link to Placeholder
                  </h4>
                  <p className="text-sm text-secondary-text font-serif italic opacity-70 mt-1">
                    Merge this RSVP with an existing admin placeholder to transfer its room assignment.
                  </p>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1 space-y-2">
                    <label className="label-uppercase text-[10px] text-accent-terracotta font-bold tracking-widest">Select Placeholder</label>
                    <select 
                      className="w-full bg-white border-none p-4 rounded-2xl outline-none focus:ring-1 ring-accent-terracotta/20 font-serif italic text-lg shadow-sm"
                      value={selectedMergeId}
                      onChange={(e) => setSelectedMergeId(e.target.value)}
                    >
                      <option value="">-- Select a Placeholder --</option>
                      {placeholders.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.firstName} {p.lastName} ({p.assignedRoom || 'No Room'})
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={handleMerge}
                    disabled={!selectedMergeId || isUpdating}
                    className="bg-yellow-600 text-white px-8 py-4 rounded-2xl hover:bg-yellow-700 transition-all shadow-md disabled:opacity-50 font-serif italic"
                  >
                    Merge & Link
                  </button>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="label-uppercase text-[10px] text-accent-terracotta font-bold tracking-widest">Transfer</label>
                <select
                  className="w-full bg-black/5 border-none p-4 rounded-2xl outline-none focus:ring-1 ring-accent-terracotta/20 font-serif italic text-lg"
                  value={editingGuest.transfer}
                  onChange={(e) => handleEditChange('transfer', e.target.value)}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="label-uppercase text-[10px] text-accent-terracotta font-bold tracking-widest">Car Rental</label>
                <select
                  className="w-full bg-black/5 border-none p-4 rounded-2xl outline-none focus:ring-1 ring-accent-terracotta/20 font-serif italic text-lg"
                  value={editingGuest.carRental}
                  onChange={(e) => handleEditChange('carRental', e.target.value)}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="label-uppercase text-[10px] text-accent-terracotta font-bold tracking-widest">Visa Support</label>
                <select
                  className="w-full bg-black/5 border-none p-4 rounded-2xl outline-none focus:ring-1 ring-accent-terracotta/20 font-serif italic text-lg"
                  value={editingGuest.visaSupport}
                  onChange={(e) => handleEditChange('visaSupport', e.target.value)}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="label-uppercase text-[10px] text-accent-terracotta font-bold tracking-widest">Music Recommendation</label>
              <input
                type="text"
                className="w-full bg-black/5 border-none p-4 rounded-2xl outline-none focus:ring-1 ring-accent-terracotta/20 font-serif italic text-lg"
                value={editingGuest.musicSuggestion}
                onChange={(e) => handleEditChange('musicSuggestion', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="label-uppercase text-[10px] text-accent-terracotta font-bold tracking-widest">
                Main Guest Dietary Details ({editingGuest.firstName || 'Main Guest'})
              </label>
              <textarea
                className="w-full bg-black/5 border-none p-4 rounded-2xl outline-none focus:ring-1 ring-accent-terracotta/20 font-serif italic text-lg h-24"
                value={editingGuest.dietary || ""}
                onChange={(e) => handleEditChange('dietary', e.target.value)}
              />
            </div>

            {/* Dietary Categories Pills */}
            <div className="space-y-2 col-span-full">
              <label className="label-uppercase text-[10px] text-accent-terracotta font-bold tracking-widest flex items-center gap-2">
                <Utensils size={12} /> Dietary Categories & Allergies ({editingGuest.firstName || 'Main Guest'})
              </label>
              <div className="flex flex-wrap gap-2 pt-1">
                {DIETARY_OPTIONS.map(opt => {
                  const currentCategories = editingGuest.dietaryCategories || [];
                  const isSelected = currentCategories.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        const newCats = isSelected
                          ? currentCategories.filter(c => c !== opt)
                          : [...currentCategories, opt];
                        handleEditChange('dietaryCategories', newCats);
                        // Also auto-sync dietary string if empty
                        if (!editingGuest.dietary || editingGuest.dietary === 'None') {
                          handleEditChange('dietary', newCats.join(', '));
                        }
                      }}
                      className={`px-4 py-2 rounded-full text-xs font-serif italic border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                          : 'bg-black/5 text-secondary-text border-black/10 hover:bg-black/10'
                      }`}
                    >
                      {opt} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── FINAL CONFIRMATION & TRAVEL ADJUSTMENTS ── */}
            <div className="col-span-full border-t-2 border-dashed border-accent-terracotta/20 pt-8 mt-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-2xl font-serif italic text-primary-text flex items-center gap-2">
                    <CalendarCheck size={22} className="text-accent-terracotta" />
                    Final Confirmation & Travel Details
                  </h4>
                  <p className="text-xs text-secondary-text font-serif italic opacity-75 mt-0.5">
                    View or manually edit travel, transfers, and accommodation preferences submitted by the guest.
                  </p>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      if (editingGuest.confirmationSubmittedAt) {
                        handleEditChange('confirmationSubmittedAt', null);
                        toast.info("Marked confirmation status as Pending");
                      } else {
                        handleEditChange('confirmationSubmittedAt', new Date());
                        toast.success("Marked confirmation status as Confirmed");
                      }
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-serif font-bold uppercase tracking-wider border cursor-pointer transition-all ${
                      editingGuest.confirmationSubmittedAt
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-amber-50 text-amber-800 border-amber-300'
                    }`}
                  >
                    {editingGuest.confirmationSubmittedAt ? (
                      <>
                        <CheckCircle2 size={14} className="text-emerald-600" />
                        <span>Status: Confirmed</span>
                      </>
                    ) : (
                      <>
                        <Clock size={14} className="text-amber-600" />
                        <span>Status: Pending Confirmation</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Arrival Fields */}
              <div className="bg-black/[0.02] border border-black/5 p-6 rounded-3xl space-y-4">
                <p className="text-xs uppercase tracking-widest text-accent-terracotta font-bold flex items-center gap-1.5">
                  <Plane size={12} /> Arrival
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-secondary-text uppercase font-bold tracking-wider">Method</label>
                    <select
                      className="w-full bg-white border border-black/10 p-3 rounded-xl outline-none font-serif text-sm"
                      value={editingGuest.arrivalMethod || "Plane"}
                      onChange={(e) => handleEditChange('arrivalMethod', e.target.value)}
                    >
                      <option value="Plane">Plane</option>
                      <option value="Car">Car</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-secondary-text uppercase font-bold tracking-wider">Arrival Date</label>
                    <input
                      type="text"
                      placeholder="e.g. 2027-04-16"
                      className="w-full bg-white border border-black/10 p-3 rounded-xl outline-none font-serif text-sm"
                      value={editingGuest.arrivalDate || ""}
                      onChange={(e) => handleEditChange('arrivalDate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-secondary-text uppercase font-bold tracking-wider">Arrival Time</label>
                    <input
                      type="text"
                      placeholder="e.g. 14:30"
                      className="w-full bg-white border border-black/10 p-3 rounded-xl outline-none font-serif text-sm"
                      value={editingGuest.arrivalTime || ""}
                      onChange={(e) => handleEditChange('arrivalTime', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-secondary-text uppercase font-bold tracking-wider">Flight Number</label>
                    <input
                      type="text"
                      placeholder="e.g. IB3840"
                      className="w-full bg-white border border-black/10 p-3 rounded-xl outline-none font-serif text-sm"
                      value={editingGuest.flightNumberArrival || ""}
                      onChange={(e) => handleEditChange('flightNumberArrival', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Departure Fields */}
              <div className="bg-black/[0.02] border border-black/5 p-6 rounded-3xl space-y-4">
                <p className="text-xs uppercase tracking-widest text-accent-terracotta font-bold flex items-center gap-1.5">
                  <Plane size={12} className="rotate-180" /> Departure
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-secondary-text uppercase font-bold tracking-wider">Method</label>
                    <select
                      className="w-full bg-white border border-black/10 p-3 rounded-xl outline-none font-serif text-sm"
                      value={editingGuest.departureMethod || "Plane"}
                      onChange={(e) => handleEditChange('departureMethod', e.target.value)}
                    >
                      <option value="Plane">Plane</option>
                      <option value="Car">Car</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-secondary-text uppercase font-bold tracking-wider">Departure Date</label>
                    <input
                      type="text"
                      placeholder="e.g. 2027-04-19"
                      className="w-full bg-white border border-black/10 p-3 rounded-xl outline-none font-serif text-sm"
                      value={editingGuest.departureDate || ""}
                      onChange={(e) => handleEditChange('departureDate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-secondary-text uppercase font-bold tracking-wider">Departure Time</label>
                    <input
                      type="text"
                      placeholder="e.g. 18:00"
                      className="w-full bg-white border border-black/10 p-3 rounded-xl outline-none font-serif text-sm"
                      value={editingGuest.departureTime || ""}
                      onChange={(e) => handleEditChange('departureTime', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-secondary-text uppercase font-bold tracking-wider">Flight Number</label>
                    <input
                      type="text"
                      placeholder="e.g. BA2715"
                      className="w-full bg-white border border-black/10 p-3 rounded-xl outline-none font-serif text-sm"
                      value={editingGuest.flightNumberDeparture || ""}
                      onChange={(e) => handleEditChange('flightNumberDeparture', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Castle-specific Transfers & Bed Preference */}
              {editingGuest.accommodation === 'Yes, please' && (
                <div className="bg-emerald-50/40 border border-emerald-200/60 p-6 rounded-3xl space-y-4">
                  <p className="text-xs uppercase tracking-widest text-emerald-800 font-bold flex items-center gap-1.5">
                    <Bed size={12} /> Castillo Preferences & Airport Transfers
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-secondary-text uppercase font-bold tracking-wider">Bed Preference</label>
                      <select
                        className="w-full bg-white border border-black/10 p-3 rounded-xl outline-none font-serif text-sm"
                        value={editingGuest.bedPreference || "No preference"}
                        onChange={(e) => handleEditChange('bedPreference', e.target.value)}
                      >
                        <option value="King Bed (1 large bed)">King Bed (1 large bed)</option>
                        <option value="Twin Beds (2 separate beds)">Twin Beds (2 separate beds)</option>
                        <option value="No preference">No preference</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-secondary-text uppercase font-bold tracking-wider">Airport Transfer In</label>
                      <div className="flex gap-2">
                        <select
                          className="flex-1 bg-white border border-black/10 p-3 rounded-xl outline-none font-serif text-sm"
                          value={editingGuest.airportTransferIn || "Not sure yet"}
                          onChange={(e) => handleEditChange('airportTransferIn', e.target.value)}
                        >
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                          <option value="Not sure yet">Not sure yet</option>
                        </select>
                        <input
                          type="number"
                          placeholder="Pax"
                          title="Passengers"
                          className="w-16 bg-white border border-black/10 p-3 rounded-xl outline-none font-serif text-sm"
                          value={editingGuest.transferInPax || ""}
                          onChange={(e) => handleEditChange('transferInPax', Number(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-secondary-text uppercase font-bold tracking-wider">Airport Transfer Out</label>
                      <div className="flex gap-2">
                        <select
                          className="flex-1 bg-white border border-black/10 p-3 rounded-xl outline-none font-serif text-sm"
                          value={editingGuest.airportTransferOut || "Not sure yet"}
                          onChange={(e) => handleEditChange('airportTransferOut', e.target.value)}
                        >
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                          <option value="Not sure yet">Not sure yet</option>
                        </select>
                        <input
                          type="number"
                          placeholder="Pax"
                          title="Passengers"
                          className="w-16 bg-white border border-black/10 p-3 rounded-xl outline-none font-serif text-sm"
                          value={editingGuest.transferOutPax || ""}
                          onChange={(e) => handleEditChange('transferOutPax', Number(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* External Accommodation Details & Wedding-Day Transport */}
              {editingGuest.accommodation !== 'Yes, please' && (
                <div className="bg-amber-50/40 border border-amber-200/60 p-6 rounded-3xl space-y-4">
                  <p className="text-xs uppercase tracking-widest text-amber-800 font-bold flex items-center gap-1.5">
                    <Car size={12} /> External Hotel & Wedding-Day Transfers
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-secondary-text uppercase font-bold tracking-wider">Hotel / Accommodation Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Hotel Castillo de Monda / Airbnb"
                        className="w-full bg-white border border-black/10 p-3 rounded-xl outline-none font-serif text-sm"
                        value={editingGuest.externalAccommodationName || ""}
                        onChange={(e) => handleEditChange('externalAccommodationName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-secondary-text uppercase font-bold tracking-wider">City / Area</label>
                      <input
                        type="text"
                        placeholder="e.g. Monda, Coín, Marbella"
                        className="w-full bg-white border border-black/10 p-3 rounded-xl outline-none font-serif text-sm"
                        value={editingGuest.externalAccommodationCity || ""}
                        onChange={(e) => handleEditChange('externalAccommodationCity', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-secondary-text uppercase font-bold tracking-wider">Address</label>
                      <input
                        type="text"
                        placeholder="Street or details"
                        className="w-full bg-white border border-black/10 p-3 rounded-xl outline-none font-serif text-sm"
                        value={editingGuest.externalAccommodationAddress || ""}
                        onChange={(e) => handleEditChange('externalAccommodationAddress', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div className="space-y-1">
                      <label className="text-[10px] text-secondary-text uppercase font-bold tracking-wider">Shuttle TO Wedding</label>
                      <select
                        className="w-full bg-white border border-black/10 p-3 rounded-xl outline-none font-serif text-sm"
                        value={editingGuest.weddingDayTransferTo || "Not sure yet"}
                        onChange={(e) => handleEditChange('weddingDayTransferTo', e.target.value)}
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                        <option value="Not sure yet">Not sure yet</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-secondary-text uppercase font-bold tracking-wider">Shuttle FROM Wedding (Return)</label>
                      <select
                        className="w-full bg-white border border-black/10 p-3 rounded-xl outline-none font-serif text-sm"
                        value={editingGuest.weddingDayTransferFrom || "Not sure yet"}
                        onChange={(e) => handleEditChange('weddingDayTransferFrom', e.target.value)}
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                        <option value="Not sure yet">Not sure yet</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-secondary-text uppercase font-bold tracking-wider">Shuttle Pax</label>
                      <input
                        type="number"
                        placeholder="Passengers"
                        className="w-full bg-white border border-black/10 p-3 rounded-xl outline-none font-serif text-sm"
                        value={editingGuest.weddingDayTransferPax || ""}
                        onChange={(e) => handleEditChange('weddingDayTransferPax', Number(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Accessibility & Change Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50/50 border border-blue-200/60 p-5 rounded-2xl space-y-2">
                  <label className="text-[10px] text-blue-800 uppercase font-bold tracking-wider flex items-center gap-1.5">
                    <Accessibility size={12} /> Accessibility Needs
                  </label>
                  <div className="flex items-center gap-3">
                    <select
                      className="bg-white border border-black/10 p-2.5 rounded-xl font-serif text-sm outline-none"
                      value={editingGuest.hasAccessibilityNeeds ? "Yes" : "No"}
                      onChange={(e) => handleEditChange('hasAccessibilityNeeds', e.target.value === "Yes")}
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Specify accessibility requirements"
                      className="flex-1 bg-white border border-black/10 p-2.5 rounded-xl font-serif text-sm outline-none"
                      value={editingGuest.accessibilityDetails || ""}
                      onChange={(e) => handleEditChange('accessibilityDetails', e.target.value)}
                    />
                  </div>
                </div>

                <div className="bg-black/[0.02] border border-black/5 p-5 rounded-2xl space-y-2">
                  <label className="text-[10px] text-secondary-text uppercase font-bold tracking-wider flex items-center gap-1.5">
                    <MessageSquare size={12} /> RSVP Change Note
                  </label>
                  <input
                    type="text"
                    placeholder="Note if guest requested an RSVP change"
                    className="w-full bg-white border border-black/10 p-2.5 rounded-xl font-serif text-sm outline-none"
                    value={editingGuest.rsvpChangeNote || ""}
                    onChange={(e) => handleEditChange('rsvpChangeNote', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 col-span-full">
              <label className="label-uppercase text-[10px] text-accent-terracotta font-bold tracking-widest">Personal Note / Other Notes</label>
              <textarea
                className="w-full bg-black/5 border-none p-4 rounded-2xl outline-none focus:ring-1 ring-accent-terracotta/20 font-serif italic text-lg h-24"
                value={editingGuest.notes || ""}
                onChange={(e) => handleEditChange('notes', e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-black/5">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-4 rounded-2xl font-serif italic text-lg text-secondary-text hover:bg-black/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="flex items-center gap-3 bg-[#515C4C] text-white px-10 py-4 rounded-2xl hover:bg-[#515C4C]/90 transition-all shadow-lg disabled:opacity-50"
            >
              {isUpdating ? "Saving..." : (
                <>
                  <Save size={20} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      {showRoomGrid && (
        <InteractiveMapModal 
          currentAssignedRoom={editingGuest.assignedRoom || ""}
          currentGuestId={editingGuest.id}
          onSelect={(roomId) => handleEditChange('assignedRoom', roomId)}
          onClose={() => setShowRoomGrid(false)}
        />
      )}
    </div>
  );
};
