import React, { useEffect, useState } from "react";
import { getAllRsvps, RsvpData } from "../../../lib/rsvpService";
import { Timestamp } from "firebase/firestore";
import { PlaneTakeoff, Search, HelpCircle, FileSpreadsheet, Download, Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { convertToCSV, downloadExcel, deleteRsvp } from "../../../lib/rsvpService";
import { EditRsvpModal } from "./EditRsvpModal";
import { toast } from "sonner";

export const AdminTravelList = () => {
  const [rsvps, setRsvps] = useState<RsvpData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingGuest, setEditingGuest] = useState<RsvpData | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await getAllRsvps();
      // Only keep real guests (non-placeholders) who accepted and either need a transfer, car rental, or visa support
      const travelData = data.filter(r => 
        !r.isPlaceholder &&
        !r.email?.includes('placeholder-') &&
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

  let sortedRsvps = rsvps.filter(r => 
    `${r.firstName} ${r.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) return <ArrowUpDown size={14} className="opacity-30" />;
    return sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
  };

  if (sortConfig) {
    sortedRsvps.sort((a, b) => {
      let aValue: any = a[sortConfig.key as keyof RsvpData];
      let bValue: any = b[sortConfig.key as keyof RsvpData];
      
      if (sortConfig.key === 'name') {
         aValue = `${a.firstName} ${a.lastName}`.toLowerCase();
         bValue = `${b.firstName} ${b.lastName}`.toLowerCase();
      } else if (sortConfig.key === 'submittedAt') {
         aValue = a.submittedAt instanceof Timestamp ? a.submittedAt.toMillis() : new Date(a.submittedAt).getTime();
         bValue = b.submittedAt instanceof Timestamp ? b.submittedAt.toMillis() : new Date(b.submittedAt).getTime();
      }
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  const handleExportCSV = () => {
    try {
      const exportData = sortedRsvps.map(r => {
        const checkDate = (date: string) => {
          const inDuration = r.stayDuration?.includes(date);
          const inManual = r.manualStayDates?.toLowerCase().includes(date.toLowerCase());
          return (inDuration || inManual) ? "X" : "";
        };

        return {
          "Date & Time": r.submittedAt instanceof Timestamp ? r.submittedAt.toDate().toLocaleString() : new Date(r.submittedAt).toLocaleString(),
          Guest: `${r.firstName} ${r.lastName}`,
          Email: r.email,
          Transfer: r.transfer,
          CarRental: r.carRental,
          VisaSupport: r.visaSupport,
          "Thursday 15th": checkDate("Thursday 15th"),
          "Friday 16th": checkDate("Friday 16th"),
          "Saturday 17th": checkDate("Saturday 17th"),
          "Sunday 18th": checkDate("Sunday 18th"),
          "Monday 20th": checkDate("Monday 20th"),
          PartySize: r.guests
        };
      });
      const csv = convertToCSV(exportData);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `travel_and_visas_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Travel list exported to CSV");
    } catch (err) {
      toast.error("Failed to export CSV");
    }
  };

  const handleExportExcel = () => {
    try {
      const exportData = sortedRsvps.map(r => {
        const checkDate = (date: string) => {
          const inDuration = r.stayDuration?.includes(date);
          const inManual = r.manualStayDates?.toLowerCase().includes(date.toLowerCase());
          return (inDuration || inManual) ? "X" : "";
        };

        return {
          "Date & Time": r.submittedAt instanceof Timestamp ? r.submittedAt.toDate().toLocaleString() : new Date(r.submittedAt).toLocaleString(),
          Guest: `${r.firstName} ${r.lastName}`,
          Email: r.email,
          Transfer: r.transfer,
          CarRental: r.carRental,
          VisaSupport: r.visaSupport,
          "Thursday 15th": checkDate("Thursday 15th"),
          "Friday 16th": checkDate("Friday 16th"),
          "Saturday 17th": checkDate("Saturday 17th"),
          "Sunday 18th": checkDate("Sunday 18th"),
          "Monday 20th": checkDate("Monday 20th"),
          PartySize: r.guests
        };
      });
      downloadExcel(exportData, `travel_and_visas_${new Date().toISOString().split('T')[0]}`);
      toast.success("Travel list exported to Excel");
    } catch (err) {
      toast.error("Failed to export Excel");
    }
  };

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
          <div className="bg-blue-50 text-blue-700 px-6 py-4 rounded-2xl border border-blue-100 flex items-center gap-4 shadow-sm">
            <HelpCircle size={24} />
            <div>
              <p className="font-bold text-xs uppercase tracking-widest">Action Items</p>
              <p className="text-3xl font-serif italic leading-none mt-1">{rsvps.length}</p>
            </div>
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
                <th className="p-6 text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold font-serif cursor-pointer hover:bg-black/10 transition-colors" onClick={() => handleSort('submittedAt')}>
                  <div className="flex items-center gap-2">Submitted {getSortIcon('submittedAt')}</div>
                </th>
                <th className="p-6 text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold font-serif cursor-pointer hover:bg-black/10 transition-colors" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-2">Guest {getSortIcon('name')}</div>
                </th>
                <th className="p-6 text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold font-serif cursor-pointer hover:bg-black/10 transition-colors" onClick={() => handleSort('transfer')}>
                  <div className="flex items-center gap-2">Transfer Needed {getSortIcon('transfer')}</div>
                </th>
                 <th className="p-6 text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold font-serif cursor-pointer hover:bg-black/10 transition-colors" onClick={() => handleSort('carRental')}>
                  <div className="flex items-center gap-2">Renting Car {getSortIcon('carRental')}</div>
                 </th>
                 <th className="p-6 text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold font-serif cursor-pointer hover:bg-black/10 transition-colors" onClick={() => handleSort('visaSupport')}>
                  <div className="flex items-center gap-2">Visa Assistance {getSortIcon('visaSupport')}</div>
                 </th>
                 <th className="p-6 text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold font-serif">Actions</th>
               </tr>
             </thead>
          <tbody>
            {isLoading ? (
               <tr><td colSpan={6} className="p-20 text-center animate-pulse">Loading travel data...</td></tr>
            ) : sortedRsvps.length === 0 ? (
               <tr><td colSpan={6} className="p-20 text-center font-serif italic text-xl opacity-50">No travel requirements found.</td></tr>
            ) : (
                sortedRsvps.map(rsvp => (
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
