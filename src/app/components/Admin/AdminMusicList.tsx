import React, { useEffect, useState } from "react";
import { getAllRsvps, RsvpData } from "../../../lib/rsvpService";
import { Timestamp } from "firebase/firestore";
import { Music, Search, Heart, FileSpreadsheet, Download, Pencil, Trash2 } from "lucide-react";
import { convertToCSV, downloadExcel, deleteRsvp } from "../../../lib/rsvpService";
import { EditRsvpModal } from "./EditRsvpModal";
import { toast } from "sonner";

export const AdminMusicList = () => {
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
      // Only keep people who accepted and provided music suggestions
      const musicData = data.filter(r => r.attendance === "Joyfully accept" && r.musicSuggestion && r.musicSuggestion.trim() !== "");
      setRsvps(musicData);
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
    r.musicSuggestion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportCSV = () => {
    try {
      const exportData = filteredRsvps.map(r => ({
        "Date & Time": r.submittedAt instanceof Timestamp ? r.submittedAt.toDate().toLocaleString() : new Date(r.submittedAt).toLocaleString(),
        Guest: `${r.firstName} ${r.lastName}`,
        Email: r.email,
        MusicSuggestion: r.musicSuggestion,
        PartySize: r.guests
      }));
      const csv = convertToCSV(exportData);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `music_suggestions_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Music list exported to CSV");
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
        MusicSuggestion: r.musicSuggestion,
        PartySize: r.guests
      }));
      downloadExcel(exportData, `music_suggestions_${new Date().toISOString().split('T')[0]}`);
      toast.success("Music list exported to Excel");
    } catch (err) {
      toast.error("Failed to export Excel");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-serif italic text-primary-text flex items-center gap-3">
            <Music className="text-accent-terracotta" size={32} />
            Music Suggestions
          </h2>
          <p className="text-secondary-text font-serif italic mt-2 opacity-70">Songs to get the party started.</p>
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
          <div className="bg-pink-50 text-pink-700 px-6 py-4 rounded-2xl border border-pink-100 flex items-center gap-4 shadow-sm">
            <Heart size={24} />
            <div>
              <p className="font-bold text-xs uppercase tracking-widest">Total Tracks</p>
              <p className="text-3xl font-serif italic leading-none mt-1">{rsvps.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-accent-terracotta/10 shadow-sm flex items-center">
        <Search className="text-accent-terracotta/30 mx-4" size={18} />
        <input 
          type="text" 
          placeholder="Search by guest or song..." 
          className="w-full bg-transparent border-none p-2 outline-none font-serif italic text-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-[40px] border border-accent-terracotta/10 shadow-sm p-8 min-h-[400px]">
        {isLoading ? (
           <div className="p-20 text-center animate-pulse">Loading music suggestions...</div>
        ) : filteredRsvps.length === 0 ? (
           <div className="p-20 text-center text-secondary-text opacity-50 font-serif italic text-xl">No music suggestions found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRsvps.map(rsvp => (
               <div key={rsvp.id} className="p-6 rounded-3xl border border-accent-terracotta/10 bg-[#FBF9F4]/50 hover:bg-[#FBF9F4] transition-colors relative group">
                 <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-serif italic text-2xl text-primary-text">{rsvp.firstName} {rsvp.lastName}</p>
                      <p className="text-sm label-uppercase tracking-widest text-accent-terracotta mt-2 font-bold">
                        Guest Suggestion • {rsvp.submittedAt instanceof Timestamp ? rsvp.submittedAt.toDate().toLocaleDateString() : new Date(rsvp.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
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
                 </div>
                 <div className="p-4 bg-white rounded-2xl border border-accent-terracotta/5 text-primary-text">
                    <p className="font-serif italic text-lg leading-relaxed">"{rsvp.musicSuggestion}"</p>
                 </div>
               </div>
            ))}
          </div>
        )}
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
