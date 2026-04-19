import React, { useEffect, useState } from "react";
import { getAllRsvps, RsvpData } from "../../../lib/rsvpService";
import { PlaneTakeoff, Search, HelpCircle } from "lucide-react";

export const AdminTravelList = () => {
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
      // Only keep people who accepted and either need a transfer, car rental, or visa support
      const travelData = data.filter(r => 
        r.attendance === "Joyfully accept" && 
        (r.transfer === "Yes" || r.carRental === "Yes" || r.visaSupport !== "No")
      );
      setRsvps(travelData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRsvps = rsvps.filter(r => 
    `${r.firstName} ${r.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-serif italic text-primary-text flex items-center gap-3">
            <PlaneTakeoff className="text-accent-terracotta" size={32} />
            Travel & Visas
          </h2>
          <p className="text-secondary-text font-serif italic mt-2 opacity-70">Guests requiring transport or visa coordination.</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-6 py-4 rounded-2xl border border-blue-100 flex items-center gap-3 shadow-sm">
          <HelpCircle size={20} />
          <div>
            <p className="font-bold text-sm">Action Items</p>
            <p className="text-2xl font-serif italic leading-none mt-1">{rsvps.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-accent-terracotta/10 shadow-sm flex items-center">
        <Search className="text-accent-terracotta/30 mx-4" size={18} />
        <input 
          type="text" 
          placeholder="Search by guest name..." 
          className="w-full bg-transparent border-none p-2 outline-none font-serif italic text-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-[40px] border border-accent-terracotta/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/5 border-b border-accent-terracotta/10">
                <th className="p-6 text-[10px] uppercase tracking-widest text-accent-terracotta font-bold font-serif">Guest</th>
                <th className="p-6 text-[10px] uppercase tracking-widest text-accent-terracotta font-bold font-serif">Transfer Needed</th>
                <th className="p-6 text-[10px] uppercase tracking-widest text-accent-terracotta font-bold font-serif">Renting Car</th>
                <th className="p-6 text-[10px] uppercase tracking-widest text-accent-terracotta font-bold font-serif">Visa Assistance</th>
              </tr>
            </thead>
          <tbody>
            {isLoading ? (
               <tr><td colSpan={4} className="p-20 text-center animate-pulse">Loading travel data...</td></tr>
            ) : filteredRsvps.length === 0 ? (
               <tr><td colSpan={4} className="p-20 text-center font-serif italic text-xl opacity-50">No travel requirements found.</td></tr>
            ) : (
               filteredRsvps.map(rsvp => (
                 <tr key={rsvp.id} className="border-b border-accent-terracotta/5 hover:bg-black/[0.02]">
                   <td className="p-6">
                     <p className="font-serif italic text-lg text-primary-text">{rsvp.firstName} {rsvp.lastName}</p>
                     <p className="text-xs text-secondary-text opacity-60 uppercase tracking-tighter">{rsvp.email}</p>
                   </td>
                   <td className="p-6">
                     <span className={`text-sm font-serif italic px-4 py-1.5 rounded-full ${rsvp.transfer === 'Yes' ? 'bg-accent-terracotta/10 text-accent-terracotta' : 'text-secondary-text opacity-30 shadow-none'}`}>
                       {rsvp.transfer === 'Yes' ? 'Yes, please' : 'No'}
                     </span>
                   </td>
                   <td className="p-6">
                     <span className={`text-sm font-serif italic px-4 py-1.5 rounded-full ${rsvp.carRental === 'Yes' ? 'bg-[#515C4C]/10 text-[#515C4C]' : 'text-secondary-text opacity-30 shadow-none'}`}>
                       {rsvp.carRental === 'Yes' ? 'Yes, renting' : 'No'}
                     </span>
                   </td>
                   <td className="p-6">
                     <span className={`text-sm font-serif italic px-4 py-1.5 rounded-full ${rsvp.visaSupport !== 'No' && rsvp.visaSupport ? 'bg-red-50 text-red-600' : 'text-secondary-text opacity-30 shadow-none'}`}>
                       {rsvp.visaSupport !== 'No' && rsvp.visaSupport ? 'Assistance Needed' : 'Not Required'}
                     </span>
                   </td>
                 </tr>
               ))
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};
