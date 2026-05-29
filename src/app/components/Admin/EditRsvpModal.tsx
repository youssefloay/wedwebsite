import React, { useState } from "react";
import { X, Save } from "lucide-react";
import { RsvpData, updateRsvp, deleteRsvp } from "../../../lib/rsvpService";
import { toast } from "sonner";
import { InteractiveMapModal } from "./InteractiveMapModal";
import { LayoutGrid, MapPin, Merge } from "lucide-react";

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
      await updateRsvp(editingGuest.id, editingGuest);
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
                value={editingGuest.guests}
                onChange={(e) => {
                  const numGuests = parseInt(e.target.value) || 1;
                  const newGuestNames = Array(Math.max(0, numGuests - 1)).fill(null).map((_, i) =>
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
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-black/5 p-6 rounded-2xl">
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
                );
              })}
            </div>
          )}

          <div className="space-y-8 border-t border-black/5 pt-10">
            <div className="space-y-2 col-span-full">
              <label className="label-uppercase text-[10px] text-accent-terracotta font-bold tracking-widest">Stay Dates</label>
              <div className="flex flex-wrap gap-4">
                {['Thursday 15th', 'Friday 16th', 'Saturday 17th', 'Sunday 18th'].map(date => (
                  <label key={date} className="flex items-center gap-2 bg-black/5 p-3 rounded-xl cursor-pointer hover:bg-black/10 transition-all">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 accent-accent-terracotta"
                      checked={editingGuest.stayDuration?.includes(date) || editingGuest.manualStayDates?.includes(date.split(' ')[0])}
                      onChange={(e) => {
                        const current = editingGuest.stayDuration?.split(', ').filter(Boolean) || [];
                        let updated;
                        if (e.target.checked) {
                          if (!current.includes(date)) updated = [...current, date];
                          else updated = current;
                        } else {
                          updated = current.filter(d => d !== date && d !== 'Extra Night');
                        }
                        handleEditChange('stayDuration', updated.join(', '));
                      }}
                    />
                    <span className="font-serif italic text-sm">{date}</span>
                  </label>
                ))}
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
              <label className="label-uppercase text-[10px] text-accent-terracotta font-bold tracking-widest">Dietary Requirements</label>
              <textarea
                className="w-full bg-black/5 border-none p-4 rounded-2xl outline-none focus:ring-1 ring-accent-terracotta/20 font-serif italic text-lg h-24"
                value={editingGuest.dietary}
                onChange={(e) => handleEditChange('dietary', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="label-uppercase text-[10px] text-accent-terracotta font-bold tracking-widest">Personal Note</label>
              <textarea
                className="w-full bg-black/5 border-none p-4 rounded-2xl outline-none focus:ring-1 ring-accent-terracotta/20 font-serif italic text-lg h-24"
                value={editingGuest.notes}
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
