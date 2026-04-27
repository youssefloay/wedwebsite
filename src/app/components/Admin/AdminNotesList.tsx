import React, { useEffect, useState } from "react";
import { getAllRsvps, RsvpData } from "../../../lib/rsvpService";
import { Timestamp } from "firebase/firestore";
import { MessageSquare, Search, Sparkles, FileSpreadsheet, Download, Pencil, Trash2 } from "lucide-react";
import { convertToCSV, downloadExcel, deleteRsvp } from "../../../lib/rsvpService";
import { EditRsvpModal } from "./EditRsvpModal";
import { toast } from "sonner";

export const AdminNotesList = () => {
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
      // Only keep people who have notes
      const notesData = data.filter(r => r.notes && r.notes.trim() !== "");
      setRsvps(notesData);
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
    r.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportCSV = () => {
    try {
      const exportData = filteredRsvps.map(r => ({
        "Date & Time": r.submittedAt instanceof Timestamp ? r.submittedAt.toDate().toLocaleString() : new Date(r.submittedAt).toLocaleString(),
        Guest: `${r.firstName} ${r.lastName}`,
        Email: r.email,
        Message: r.notes,
        Date: r.submittedAt instanceof Date ? r.submittedAt.toLocaleDateString() : (r.submittedAt as any).toDate().toLocaleDateString()
      }));
      const csv = convertToCSV(exportData);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `guest_notes_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Notes exported to CSV");
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
        Message: r.notes,
        Date: r.submittedAt instanceof Date ? r.submittedAt.toLocaleDateString() : (r.submittedAt as any).toDate().toLocaleDateString()
      }));
      downloadExcel(exportData, `guest_notes_${new Date().toISOString().split('T')[0]}`);
      toast.success("Notes exported to Excel");
    } catch (err) {
      toast.error("Failed to export Excel");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-serif italic text-primary-text flex items-center gap-3">
            <MessageSquare className="text-accent-terracotta" size={32} />
            Guest Notes
          </h2>
          <p className="text-secondary-text font-serif italic mt-2 opacity-70">Personal messages and special requests from your guests.</p>
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
          <div className="bg-purple-50 text-purple-700 px-6 py-4 rounded-2xl border border-purple-100 flex items-center gap-4 shadow-sm">
            <Sparkles size={24} />
            <div>
              <p className="font-bold text-xs uppercase tracking-widest">Personal Messages</p>
              <p className="text-3xl font-serif italic leading-none mt-1">{rsvps.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-accent-terracotta/10 shadow-sm flex items-center">
        <Search className="text-accent-terracotta/30 mx-4" size={18} />
        <input 
          type="text" 
          placeholder="Search by guest name or note content..." 
          className="w-full bg-transparent border-none p-2 outline-none font-serif italic text-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-[40px] border border-accent-terracotta/10 shadow-sm overflow-hidden p-8">
        {isLoading ? (
           <div className="p-20 text-center animate-pulse font-serif italic text-xl">Loading messages...</div>
        ) : filteredRsvps.length === 0 ? (
           <div className="p-20 text-center text-secondary-text opacity-50 font-serif italic text-xl">No notes or messages found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredRsvps.map(rsvp => (
               <div key={rsvp.id} className="p-8 rounded-[30px] border border-accent-terracotta/10 bg-[#FBF9F4]/50 hover:bg-white hover:shadow-md transition-all duration-500 relative group">
                 <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="font-serif italic text-3xl text-primary-text">{rsvp.firstName} {rsvp.lastName}</p>
                      <p className="text-xs label-uppercase tracking-[0.2em] text-accent-terracotta mt-2 font-bold">Personal Message</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[11px] uppercase tracking-tighter font-bold opacity-50">
                        {rsvp.submittedAt instanceof Timestamp ? rsvp.submittedAt.toDate().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : new Date(rsvp.submittedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </p>
                    </div>
                 </div>
                 <div className="relative">
                    <span className="absolute -top-6 -left-6 text-7xl text-accent-terracotta/10 font-serif">"</span>
                    <p className="font-serif italic text-2xl leading-relaxed text-primary-text/90 relative z-10 px-4">
                      {rsvp.notes}
                    </p>
                    <span className="absolute -bottom-10 -right-4 text-7xl text-accent-terracotta/10 font-serif">"</span>
                 </div>
               </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
