import React, { useEffect, useState } from "react";
import { getAllRsvps, deleteRsvp, RsvpData, mapToExportFormat, convertToCSV } from "../../../lib/rsvpService";
import { 
  Download, 
  Search, 
  Trash2, 
  Eye, 
  Filter,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet
} from "lucide-react";
import { toast } from "sonner";

export const AdminGuestList = () => {
  const [rsvps, setRsvps] = useState<RsvpData[]>([]);
  const [filteredRsvps, setFilteredRsvps] = useState<RsvpData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let result = rsvps;
    
    if (searchTerm) {
      result = result.filter(r => 
        `${r.firstName} ${r.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filter !== "all") {
      result = result.filter(r => r.attendance === filter);
    }

    setFilteredRsvps(result);
  }, [searchTerm, filter, rsvps]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await getAllRsvps();
      setRsvps(data);
    } catch (err) {
      toast.error("Failed to fetch guest list");
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

  const handleExport = () => {
    try {
      const exportData = rsvps.map(r => mapToExportFormat(r));
      const csv = convertToCSV(exportData);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `wedding_rsvps_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Guest list exported successfully!");
    } catch (err) {
      toast.error("Failed to export data");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-serif italic text-primary-text">Guest Management</h2>
          <p className="text-secondary-text font-serif italic mt-1 opacity-70">Manage responses and export data for vendors.</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-3 bg-accent-terracotta text-white px-8 py-4 rounded-2xl hover:bg-accent-terracotta/90 transition-all shadow-lg active:scale-95"
        >
          <FileSpreadsheet size={20} />
          <span className="font-serif uppercase tracking-widest text-sm">Export to CSV</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-3xl border border-accent-terracotta/10 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-terracotta/30" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            className="w-full bg-black/5 border-none p-4 pl-12 rounded-2xl outline-none focus:ring-1 ring-accent-terracotta/20 font-serif italic"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="text-accent-terracotta/40 ml-2" size={18} />
          <select 
            className="bg-black/5 border-none p-4 rounded-2xl outline-none focus:ring-1 ring-accent-terracotta/20 font-serif italic flex-1 md:w-48"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Responses</option>
            <option value="Joyfully accept">Attending</option>
            <option value="Regretfully decline">Declined</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[40px] border border-accent-terracotta/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-accent-terracotta/5 bg-black/5">
                <th className="p-6 text-[10px] label-uppercase tracking-widest text-accent-terracotta font-bold">Guest</th>
                <th className="p-6 text-[10px] label-uppercase tracking-widest text-accent-terracotta font-bold">Status</th>
                <th className="p-6 text-[10px] label-uppercase tracking-widest text-accent-terracotta font-bold">Party</th>
                <th className="p-6 text-[10px] label-uppercase tracking-widest text-accent-terracotta font-bold">Accom.</th>
                <th className="p-6 text-[10px] label-uppercase tracking-widest text-accent-terracotta font-bold">Dietary</th>
                <th className="p-6 text-[10px] label-uppercase tracking-widest text-accent-terracotta font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-20 text-center">
                    <div className="animate-pulse flex flex-col items-center gap-2">
                       <div className="w-8 h-8 border-4 border-accent-terracotta border-t-transparent rounded-full animate-spin" />
                       <p className="font-serif italic text-secondary-text opacity-40">Fetching guests...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredRsvps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-20 text-center">
                    <p className="font-serif italic text-secondary-text opacity-40 text-xl">No guests found matching your search.</p>
                  </td>
                </tr>
              ) : (
                filteredRsvps.map((rsvp) => (
                  <tr key={rsvp.id} className="border-b border-accent-terracotta/5 hover:bg-black/[0.02] transition-colors group">
                    <td className="p-6">
                      <div>
                        <p className="font-serif italic text-lg text-primary-text">{rsvp.firstName} {rsvp.lastName}</p>
                        <p className="text-xs text-secondary-text opacity-60 uppercase tracking-tighter">{rsvp.email}</p>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold ${
                        rsvp.attendance === 'Joyfully accept' 
                          ? 'bg-green-50 text-green-600' 
                          : 'bg-red-50 text-red-600'
                      }`}>
                        {rsvp.attendance === 'Joyfully accept' ? 'Attending' : 'Declined'}
                      </span>
                    </td>
                    <td className="p-6">
                      <p className="font-serif italic text-primary-text">{rsvp.attendance === 'Joyfully accept' ? `${rsvp.guests} Guests` : '-'}</p>
                    </td>
                    <td className="p-6">
                      <p className="text-sm font-serif italic text-secondary-text">
                        {rsvp.accommodation === 'Yes, please' ? rsvp.roomPreference : 'Independent'}
                      </p>
                    </td>
                    <td className="p-6">
                      {rsvp.dietary ? (
                        <div className="flex items-center gap-2 text-orange-600">
                          <Eye size={14} />
                          <span className="text-xs font-serif italic truncate max-w-[150px]">{rsvp.dietary}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-secondary-text opacity-30 italic font-serif">None</span>
                      )}
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <button className="p-2 text-secondary-text hover:text-accent-terracotta hover:bg-accent-terracotta/10 rounded-xl transition-all">
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(rsvp.id!)}
                          className="p-2 text-secondary-text hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
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
        
        {/* Pagination placeholder */}
        <div className="p-6 bg-black/5 flex items-center justify-between border-t border-accent-terracotta/5">
          <p className="text-xs text-secondary-text opacity-60 font-serif italic">
            Showing {filteredRsvps.length} of {rsvps.length} entries
          </p>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-xl text-secondary-text opacity-40 hover:opacity-100 transition-all disabled:opacity-20" disabled>
              <ChevronLeft size={20} />
            </button>
            <button className="p-2 rounded-xl text-secondary-text opacity-40 hover:opacity-100 transition-all disabled:opacity-20" disabled>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
