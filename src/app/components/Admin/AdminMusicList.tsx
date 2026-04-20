import React, { useEffect, useState } from "react";
import { getAllRsvps, RsvpData } from "../../../lib/rsvpService";
import { Timestamp } from "firebase/firestore";
import { Music, Search, Heart, FileSpreadsheet, Download } from "lucide-react";
import { convertToCSV, downloadExcel } from "../../../lib/rsvpService";
import { toast } from "sonner";

export const AdminMusicList = () => {
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
      // Only keep people who have music suggestions
      const musicData = data.filter(r => r.musicSuggestion && r.musicSuggestion.trim() !== "");
      setRsvps(musicData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
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
        Suggestion: r.musicSuggestion
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
        Suggestion: r.musicSuggestion
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
          <p className="text-secondary-text font-serif italic mt-2 opacity-70">A list of songs to get the party started.</p>
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
            <Heart size={24} />
            <div>
              <p className="font-bold text-xs uppercase tracking-widest">Total Suggestions</p>
              <p className="text-3xl font-serif italic leading-none mt-1">{rsvps.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-accent-terracotta/10 shadow-sm flex items-center">
        <Search className="text-accent-terracotta/30 mx-4" size={18} />
        <input 
          type="text" 
          placeholder="Search by guest name or song/artist..." 
          className="w-full bg-transparent border-none p-2 outline-none font-serif italic text-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-[40px] border border-accent-terracotta/10 shadow-sm overflow-hidden p-8">
        {isLoading ? (
           <div className="p-20 text-center animate-pulse font-serif italic text-xl">Loading music suggestions...</div>
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
                        Guest Suggestion • {rsvp.submittedAt instanceof Timestamp ? rsvp.submittedAt.toDate().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : new Date(rsvp.submittedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </p>
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
    </div>
  );
};
