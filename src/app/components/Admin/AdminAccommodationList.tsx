import React, { useEffect, useState } from "react";
import { getAllRsvps, RsvpData } from "../../../lib/rsvpService";
import { Bed, Search, CheckCircle2 } from "lucide-react";

export const AdminAccommodationList = () => {
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
      // Only keep people who accepted and requested Castillo de Monda
      const accomData = data.filter(r => r.attendance === "Joyfully accept" && r.accommodation === "Yes, please");
      setRsvps(accomData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRsvps = rsvps.filter(r => 
    `${r.firstName} ${r.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.roomPreference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-serif italic text-primary-text flex items-center gap-3">
            <Bed className="text-accent-terracotta" size={32} />
            Accommodation Registry
          </h2>
          <p className="text-secondary-text font-serif italic mt-2 opacity-70">Room requests for Castillo de Monda.</p>
        </div>
        <div className="bg-green-50 text-green-700 px-6 py-4 rounded-2xl border border-green-100 flex items-center gap-3 shadow-sm">
          <CheckCircle2 size={20} />
          <div>
            <p className="font-bold text-sm">Total Rooms</p>
            <p className="text-2xl font-serif italic leading-none mt-1">{rsvps.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-accent-terracotta/10 shadow-sm flex items-center">
        <Search className="text-accent-terracotta/30 mx-4" size={18} />
        <input 
          type="text" 
          placeholder="Search by guest name or room type..." 
          className="w-full bg-transparent border-none p-2 outline-none font-serif italic text-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-[40px] border border-accent-terracotta/10 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/5 border-b border-accent-terracotta/10">
              <th className="p-6 text-[10px] label-uppercase tracking-widest text-accent-terracotta font-bold">Guest</th>
              <th className="p-6 text-[10px] label-uppercase tracking-widest text-accent-terracotta font-bold">Room Preference</th>
              <th className="p-6 text-[10px] label-uppercase tracking-widest text-accent-terracotta font-bold">Stay Dates</th>
              <th className="p-6 text-[10px] label-uppercase tracking-widest text-accent-terracotta font-bold">Party Size</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
               <tr><td colSpan={4} className="p-20 text-center animate-pulse">Loading accommodation data...</td></tr>
            ) : filteredRsvps.length === 0 ? (
               <tr><td colSpan={4} className="p-20 text-center font-serif italic text-xl opacity-50">No room requests found.</td></tr>
            ) : (
               filteredRsvps.map(rsvp => (
                 <tr key={rsvp.id} className="border-b border-accent-terracotta/5 hover:bg-black/[0.02]">
                   <td className="p-6">
                     <p className="font-serif italic text-lg text-primary-text">{rsvp.firstName} {rsvp.lastName}</p>
                     <p className="text-xs text-secondary-text opacity-60 uppercase tracking-tighter">{rsvp.email}</p>
                   </td>
                   <td className="p-6">
                     <span className="bg-[#FBF9F4] px-4 py-2 border border-accent-terracotta/20 rounded-xl font-serif italic text-primary-text">
                       {rsvp.roomPreference}
                     </span>
                   </td>
                   <td className="p-6">
                      <p className="text-sm font-serif italic text-secondary-text max-w-[200px] leading-relaxed">
                        {rsvp.stayDuration.includes("Extra Night") ? rsvp.manualStayDates : rsvp.stayDuration}
                      </p>
                   </td>
                   <td className="p-6 font-serif italic text-primary-text text-lg">
                     {rsvp.guests}
                   </td>
                 </tr>
               ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
