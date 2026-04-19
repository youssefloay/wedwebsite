import React, { useEffect, useState } from "react";
import { getAllRsvps, RsvpData } from "../../../lib/rsvpService";
import { Utensils, Search, AlertCircle } from "lucide-react";

export const AdminDietaryList = () => {
  const [rsvps, setRsvps] = useState<RsvpData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await getAllRsvps();
      // Only keep people who accepted and have dietary requirements
      const dietaryData = data.filter(r => r.attendance === "Joyfully accept" && r.dietary && r.dietary.trim() !== "");
      setRsvps(dietaryData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRsvps = rsvps.filter(r => 
    `${r.firstName} ${r.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.dietary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-serif italic text-primary-text flex items-center gap-3">
            <Utensils className="text-accent-terracotta" size={32} />
            Dietary Requirements
          </h2>
          <p className="text-secondary-text font-serif italic mt-2 opacity-70">A specialized report for the catering team and chef.</p>
        </div>
        <div className="bg-orange-50 text-orange-700 px-6 py-4 rounded-2xl border border-orange-100 flex items-center gap-3 shadow-sm">
          <AlertCircle size={20} />
          <div>
            <p className="font-bold text-sm">Total Alerts</p>
            <p className="text-2xl font-serif italic leading-none mt-1">{rsvps.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-accent-terracotta/10 shadow-sm flex items-center">
        <Search className="text-accent-terracotta/30 mx-4" size={18} />
        <input 
          type="text" 
          placeholder="Search by guest name or allergy type..." 
          className="w-full bg-transparent border-none p-2 outline-none font-serif italic text-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-[40px] border border-accent-terracotta/10 shadow-sm overflow-hidden p-8">
        {isLoading ? (
           <div className="p-20 text-center animate-pulse">Loading dietary data...</div>
        ) : filteredRsvps.length === 0 ? (
           <div className="p-20 text-center text-secondary-text opacity-50 font-serif italic text-xl">No dietary requirements found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRsvps.map(rsvp => (
               <div key={rsvp.id} className="p-6 rounded-3xl border border-accent-terracotta/10 bg-[#FBF9F4]/50 hover:bg-[#FBF9F4] transition-colors relative">
                 <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-serif italic text-xl text-primary-text">{rsvp.firstName} {rsvp.lastName}</p>
                      <p className="text-[10px] label-uppercase tracking-widest text-accent-terracotta mt-1">{rsvp.guests > 1 ? `Party of ${rsvp.guests}` : 'Single Guest'}</p>
                    </div>
                 </div>
                 <div className="p-4 bg-white rounded-2xl border border-orange-100 text-orange-800">
                    <p className="font-serif italic text-lg leading-relaxed">"{rsvp.dietary}"</p>
                 </div>
               </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
