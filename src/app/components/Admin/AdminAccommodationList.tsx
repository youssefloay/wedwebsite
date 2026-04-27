import React, { useEffect, useState } from "react";
import { getAllRsvps, RsvpData } from "../../../lib/rsvpService";
import { Timestamp } from "firebase/firestore";
import { Bed, Search, CheckCircle2, FileSpreadsheet, Download, Pencil, Trash2 } from "lucide-react";
import { convertToCSV, downloadExcel, deleteRsvp } from "../../../lib/rsvpService";
import { EditRsvpModal } from "./EditRsvpModal";
import { toast } from "sonner";

const ROOM_PRICES: Record<string, string> = {
  'Comfy': '€154',
  'Superior Comfy': '€184',
  'Castillo Junior': '€209',
  'Family Room': '€219'
};

const formatRoom = (type: string) => {
  const price = ROOM_PRICES[type];
  return price ? `${type} (${price})` : type;
};

export const AdminAccommodationList = () => {
  const [rsvps, setRsvps] = useState<RsvpData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingGuest, setEditingGuest] = useState<RsvpData | null>(null);

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

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this RSVP?")) {
      try {
        await deleteRsvp(id);
        toast.success("RSVP deleted successfully");
        fetchData();
      } catch (err) {
        toast.error("Failed to delete RSVP");
      }
    }
  };

  const handleEditSuccess = () => {
    setEditingGuest(null);
    fetchData();
  };

  const filteredRsvps = rsvps.filter(r => 
    `${r.firstName} ${r.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.roomPreference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportCSV = () => {
    try {
      const exportData = filteredRsvps.map(r => ({
        "Date & Time": r.submittedAt instanceof Timestamp ? r.submittedAt.toDate().toLocaleString() : new Date(r.submittedAt).toLocaleString(),
        Guest: `${r.firstName} ${r.lastName}`,
        Email: r.email,
        RoomPreference: formatRoom(r.roomPreference),
        StayDuration: r.stayDuration,
        ManualDates: r.manualStayDates,
        PartySize: r.guests
      }));
      const csv = convertToCSV(exportData);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `accommodation_registry_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Accommodation list exported to CSV");
    } catch (err) {
      toast.error("Failed to export CSV");
    }
  };

  const handleExportExcel = () => {
    try {
      const exportData = filteredRsvps.map(r => ({
        "Date & Time": r.submittedAt instanceof Timestamp ? r.submittedAt.toDate().toLocaleString() : new Date(r.submittedAt).toLocaleString(),
        Guest: `${r.firstName} ${r.lastName}`,
        Email: r.email,
        RoomPreference: formatRoom(r.roomPreference),
        StayDuration: r.stayDuration,
        ManualDates: r.manualStayDates,
        PartySize: r.guests
      }));
      downloadExcel(exportData, `accommodation_registry_${new Date().toISOString().split('T')[0]}`);
      toast.success("Accommodation list exported to Excel");
    } catch (err) {
      toast.error("Failed to export Excel");
    }
  };

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
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-2 bg-white text-accent-terracotta border border-accent-terracotta/20 px-4 py-3 rounded-xl hover:bg-black/5 transition-all text-[10px] font-bold uppercase tracking-widest shadow-sm"
            >
              <Download size={14} />
              CSV
            </button>
            <button 
              onClick={handleExportExcel}
              className="flex items-center gap-2 bg-accent-terracotta text-white px-4 py-3 rounded-xl hover:bg-accent-terracotta/90 transition-all text-[10px] font-bold uppercase tracking-widest shadow-md"
            >
              <FileSpreadsheet size={14} />
              Excel
            </button>
          </div>
          <div className="bg-green-50 text-green-700 px-6 py-4 rounded-2xl border border-green-100 flex items-center gap-4 shadow-sm">
            <CheckCircle2 size={24} />
            <div>
              <p className="font-bold text-xs uppercase tracking-widest">Total Rooms</p>
              <p className="text-3xl font-serif italic leading-none mt-1">{rsvps.length}</p>
            </div>
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
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-black/5 border-b border-accent-terracotta/10">
                <th className="p-6 text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold font-serif">Submitted</th>
                <th className="p-6 text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold font-serif">Guest</th>
                <th className="p-6 text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold font-serif">Room Preference</th>
                <th className="p-6 text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold font-serif">Stay Dates</th>
                <th className="p-6 text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold font-serif">Party Size</th>
                <th className="p-6 text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold font-serif">Actions</th>
              </tr>
            </thead>
          <tbody>
            {isLoading ? (
               <tr><td colSpan={6} className="p-20 text-center animate-pulse">Loading accommodation data...</td></tr>
            ) : filteredRsvps.length === 0 ? (
               <tr><td colSpan={6} className="p-20 text-center font-serif italic text-xl opacity-50">No room requests found.</td></tr>
            ) : (
                filteredRsvps.map(rsvp => (
                  <tr key={rsvp.id} className="border-b border-accent-terracotta/5 hover:bg-black/[0.02]">
                    <td className="p-6">
                      <p className="text-[10px] font-bold text-accent-terracotta uppercase tracking-tighter opacity-60">
                        {rsvp.submittedAt instanceof Timestamp ? rsvp.submittedAt.toDate().toLocaleDateString() : new Date(rsvp.submittedAt).toLocaleDateString()}
                      </p>
                      <p className="text-[9px] text-secondary-text opacity-40 uppercase">
                        {rsvp.submittedAt instanceof Timestamp ? rsvp.submittedAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date(rsvp.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>
                    <td className="p-6">
                     <p className="font-serif italic text-lg text-primary-text">{rsvp.firstName} {rsvp.lastName}</p>
                     <p className="text-xs text-secondary-text opacity-60 uppercase tracking-tighter">{rsvp.email}</p>
                   </td>
                   <td className="p-6">
                     <span className="bg-[#FBF9F4] px-4 py-2 border border-accent-terracotta/20 rounded-xl font-serif italic text-primary-text">
                       {formatRoom(rsvp.roomPreference)}
                     </span>
                   </td>
                   <td className="p-6">
                      <p className="text-sm font-serif italic text-secondary-text max-w-[200px] leading-relaxed">
                        {rsvp.stayDuration.split(', ').map(d => d === 'Extra Night' ? (rsvp.manualStayDates ? `Extra: ${rsvp.manualStayDates}` : d) : d).join(', ')}
                      </p>
                   </td>
                   <td className="p-6 font-serif italic text-primary-text text-lg">
                     {rsvp.guests}
                   </td>
                   <td className="p-6">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setEditingGuest(rsvp)}
                          className="p-2 text-secondary-text hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                          title="Edit Response"
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(rsvp.id!)}
                          className="p-2 text-secondary-text hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          title="Delete Response"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                 </tr>
               ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      {editingGuest && (
        <EditRsvpModal 
          rsvp={editingGuest} 
          onClose={() => setEditingGuest(null)} 
          onSuccess={handleEditSuccess} 
        />
      )}
    </div>
  );
};
