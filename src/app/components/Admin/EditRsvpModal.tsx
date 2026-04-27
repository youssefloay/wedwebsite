import React, { useState } from "react";
import { X, Save } from "lucide-react";
import { RsvpData, updateRsvp } from "../../../lib/rsvpService";
import { toast } from "sonner";

interface EditRsvpModalProps {
  rsvp: RsvpData;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditRsvpModal = ({ rsvp, onClose, onSuccess }: EditRsvpModalProps) => {
  const [editingGuest, setEditingGuest] = useState<RsvpData>(rsvp);
  const [isUpdating, setIsUpdating] = useState(false);

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
                onChange={(e) => handleEditChange('guests', parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-8 border-t border-black/5 pt-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="label-uppercase text-[10px] text-accent-terracotta font-bold tracking-widest">Stay Dates</label>
                <input 
                  type="text"
                  placeholder="e.g. Friday 16th, Saturday 17th"
                  className="w-full bg-black/5 border-none p-4 rounded-2xl outline-none focus:ring-1 ring-accent-terracotta/20 font-serif italic text-lg"
                  value={editingGuest.stayDuration}
                  onChange={(e) => handleEditChange('stayDuration', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="label-uppercase text-[10px] text-accent-terracotta font-bold tracking-widest">Manual Dates (Extra Night)</label>
                <input 
                  type="text"
                  className="w-full bg-black/5 border-none p-4 rounded-2xl outline-none focus:ring-1 ring-accent-terracotta/20 font-serif italic text-lg"
                  value={editingGuest.manualStayDates}
                  onChange={(e) => handleEditChange('manualStayDates', e.target.value)}
                />
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
    </div>
  );
};
