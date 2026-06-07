import React, { useEffect, useState } from "react";
import { getAllRsvps, RsvpData } from "../../../lib/rsvpService";
import { Timestamp } from "firebase/firestore";
import { Bed, Search, CheckCircle2, FileSpreadsheet, Download, Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { convertToCSV, deleteRsvp, updateRsvp } from "../../../lib/rsvpService";
import { EditRsvpModal } from "./EditRsvpModal";
import { toast } from "sonner";
import { HOTEL_ROOMS } from "./RoomSelectorGrid";
import * as XLSX from 'xlsx';

const ROOM_PRICES: Record<string, string> = {
  'Comfy': '€200',
  'Superior Comfy': '€190',
  'Castillo Junior': '€135',
  'Family Room': '€165'
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
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await getAllRsvps();
      // Keep people who accepted, admin placeholders, and those who haven't RSVPed yet
      const accomData = data.filter(r => 
        r.isPlaceholder || 
        r.attendance === "Joyfully accept" || 
        !r.attendance || 
        r.attendance === "Pending" ||
        r.email?.includes('placeholder-')
      );
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

  let sortedRsvps = rsvps.filter(r => 
    `${r.firstName} ${r.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.roomPreference.toLowerCase().includes(searchTerm.toLowerCase())
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

      if (aValue === undefined || aValue === null) aValue = "";
      if (bValue === undefined || bValue === null) bValue = "";
      
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  const getExportData = () => {
    const ALL_ROOMS = HOTEL_ROOMS.flatMap(group => 
      group.rooms.map(room => ({
        ...room,
        levelName: group.level
      }))
    );

    const TYPE_MAPPINGS: Record<string, string> = {
      'Comfy': 'Standard Double',
      'Superior Comfy': 'Superior',
      'Castillo Junior': 'Castillo Junior',
      'Family Room': 'Family Room'
    };

    const PRICE_MAPPINGS: Record<string, number> = {
      'Comfy': 154,
      'Superior Comfy': 184,
      'Castillo Junior': 209,
      'Family Room': 219
    };

    let roomsToExport = ALL_ROOMS;
    if (searchTerm.trim()) {
      roomsToExport = ALL_ROOMS.filter(room => {
        const occupants = rsvps.filter(r => r.assignedRoom === room.id);
        const guestNames = occupants.map(o => `${o.firstName} ${o.lastName}`).join(" ").toLowerCase();
        const matchesGuest = guestNames.includes(searchTerm.toLowerCase());
        const matchesRoomType = room.type.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                TYPE_MAPPINGS[room.type]?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesGuest || matchesRoomType;
      });
    }

    return roomsToExport.map(room => {
      const occupants = rsvps.filter(r => r.assignedRoom === room.id);
      
      const guestNames = occupants.map(o => {
        const names = [`${o.firstName} ${o.lastName}`];
        if (o.guestNames && o.guestNames.length > 0) {
          names.push(...o.guestNames.map(g => `${g.firstName} ${g.lastName}`));
        }
        return names.join(", ");
      }).join(" | ");

      const emailAddress = occupants.map(o => o.email).join(" | ");
      const adultsCount = occupants.reduce((sum, o) => sum + o.guests, 0);

      const mappedType = TYPE_MAPPINGS[room.type] || room.type;
      const basePrice = PRICE_MAPPINGS[room.type] || 0;

      let location = "";
      if (room.number === "101") {
        location = "It is on the 4th floor. Access is via stairs.";
      } else if (room.levelName.includes("Level 1 & 2")) {
        location = `It is on a stairs behind the reception${room.features ? '. ' + room.features : ''}`;
      } else if (room.levelName.includes("Level 3")) {
        location = "It is on 3rd floor";
      } else if (room.levelName.includes("Level 4")) {
        location = `It is on the 4th floor${room.number.startsWith("400") ? " at the end of the corridor" : ""}`;
      } else if (room.levelName.includes("Level 5")) {
        location = "It is on 5th floor";
      } else if (room.levelName.includes("Level 6")) {
        location = "It is on 6th floor";
      } else if (room.levelName.includes("Level 7")) {
        location = "It is on 7th floor. Access is via stairs.";
      } else {
        location = room.levelName.replace(/ \(.+\)/g, "");
      }

      let additionals = "";
      if (room.number === "101") {
        additionals = "Terrace on the roof TWIN";
      } else {
        const parts = [];
        if (room.bed) parts.push(room.bed);
        if (room.features) parts.push(room.features);
        additionals = parts.join(" ");
      }

      const hasStayDate = (dateStr: string, dateLabel: string) => {
        return occupants.some(o => {
          const inDuration = o.stayDuration?.includes(dateLabel);
          const inManual = o.manualStayDates?.toLowerCase().includes(dateStr.toLowerCase()) || o.manualStayDates?.toLowerCase().includes(dateLabel.toLowerCase());
          return !!(inDuration || inManual);
        }) ? "X" : "";
      };

      const stay15 = occupants.length > 0 ? hasStayDate("15th", "Thursday 15th") : "";
      const stay16 = occupants.length > 0 ? hasStayDate("16th", "Friday 16th") : "";
      const stay17 = occupants.length > 0 ? hasStayDate("17th", "Saturday 17th") : "";
      const stay18 = occupants.length > 0 ? hasStayDate("18th", "Sunday 18th") : "";

      let nightsCount = 0;
      if (stay15 === "X") nightsCount++;
      if (stay16 === "X") nightsCount++;
      if (stay17 === "X") nightsCount++;
      if (stay18 === "X") nightsCount++;

      if (nightsCount === 0 && occupants.length > 0) {
        nightsCount = Math.max(...occupants.map(o => {
          const parts = o.stayDuration?.split(",").map(p => p.trim()).filter(Boolean) || [];
          return parts.length > 0 ? parts.length : 2;
        }));
      }

      const extraGuests = occupants.length > 0 ? Math.max(0, adultsCount - 1) : 0;
      const extraBreakfastCostPerNight = extraGuests * 18.5;
      const nonExclusiveRate = basePrice > 0 ? (basePrice - 0.5 + extraBreakfastCostPerNight) : 0;
      const exclusiveRate = basePrice > 0 ? (basePrice - 0.5 + (nightsCount * 0.5) + extraBreakfastCostPerNight) : 0;
      const totalAmount = basePrice > 0 ? (basePrice + extraBreakfastCostPerNight) * nightsCount : 0;

      const notes = occupants.map(o => {
        const parts = [];
        if (o.dietary) parts.push(`Dietary: ${o.dietary}`);
        if (o.notes) parts.push(`Notes: ${o.notes}`);
        if (o.isPlaceholder) parts.push("[Placeholder]");
        return parts.join("; ");
      }).filter(Boolean).join(" | ");

      return {
        "User name": "",
        "Room Number": room.number + (room.number === "101" ? "*" : ""),
        "Room Type": mappedType,
        "Room Location": location,
        "Booking reference": "",
        "Room additionals": additionals,
        "Guest Name(s) and Surname(s)": guestNames,
        "Email address": emailAddress,
        "First guest phone number": "",
        "Adults": occupants.length > 0 ? adultsCount : "",
        "Kids (include the age)": "",
        "DATES": "",
        "15th APRIL": stay15,
        "16th APRIL": stay16,
        "17th APRIL (exclusive night)": stay17,
        "18th APRIL": stay18,
        "Rate Euros No-exclus. days Breakfast incl.": occupants.length > 0 && nightsCount > 1 ? nonExclusiveRate : "",
        "Rate Euros Exclu. days Breakfast incl.": occupants.length > 0 ? exclusiveRate : "",
        "Prices per day": occupants.length > 0 ? (nightsCount > 1 ? `${nonExclusiveRate} / ${exclusiveRate}` : exclusiveRate) : "",
        "amount guests to pay": occupants.length > 0 ? totalAmount : "",
        "Notes": notes
      };
    });
  };

  const handleExportCSV = () => {
    try {
      const exportData = getExportData();
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

  const handleExportExcel = async () => {
    setIsLoading(true);
    try {
      const { downloadExcelFromTemplate } = await import('../../../lib/rsvpService');
      await downloadExcelFromTemplate(rsvps, `accommodation_registry_${new Date().toISOString().split('T')[0]}`);
      toast.success("Accommodation list exported to Excel perfectly formatted!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to export Excel");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPlaceholder = async () => {
    setIsLoading(true);
    try {
      const { saveRsvp } = await import('../../../lib/rsvpService');
      await saveRsvp({
        firstName: "New",
        lastName: "Placeholder",
        email: `placeholder-${Date.now()}@wedding.com`,
        guests: 1,
        guestNames: [],
        attendance: "Joyfully accept",
        accommodation: "Yes, please",
        roomPreference: "",
        stayDuration: "",
        manualStayDates: "",
        transfer: "No",
        carRental: "No",
        visaSupport: "No",
        dietary: "",
        musicSuggestion: "",
        notes: "Placeholder created by admin.",
        isPlaceholder: true,
      });
      toast.success("Placeholder created! You can now edit it.");
      fetchData();
    } catch (err) {
      toast.error("Failed to create placeholder");
    } finally {
      setIsLoading(false);
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
              onClick={handleAddPlaceholder}
              className="flex items-center gap-2 bg-white text-accent-terracotta border border-accent-terracotta/20 px-4 py-3 rounded-xl hover:bg-black/5 transition-all text-[10px] font-bold uppercase tracking-widest shadow-sm"
            >
              + Add Placeholder
            </button>
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
                <th className="p-6 text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold font-serif cursor-pointer hover:bg-black/10 transition-colors" onClick={() => handleSort('submittedAt')}>
                  <div className="flex items-center gap-2">Submitted {getSortIcon('submittedAt')}</div>
                </th>
                <th className="p-6 text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold font-serif cursor-pointer hover:bg-black/10 transition-colors" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-2">Guest {getSortIcon('name')}</div>
                </th>
                <th className="p-6 text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold font-serif cursor-pointer hover:bg-black/10 transition-colors" onClick={() => handleSort('roomPreference')}>
                  <div className="flex items-center gap-2">Room Preference {getSortIcon('roomPreference')}</div>
                </th>
                <th className="p-6 text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold font-serif cursor-pointer hover:bg-black/10 transition-colors" onClick={() => handleSort('assignedRoom')}>
                  <div className="flex items-center gap-2">Assigned Room {getSortIcon('assignedRoom')}</div>
                </th>
                <th className="p-6 text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold font-serif cursor-pointer hover:bg-black/10 transition-colors" onClick={() => handleSort('stayDuration')}>
                  <div className="flex items-center gap-2">Stay Dates {getSortIcon('stayDuration')}</div>
                </th>
                <th className="p-6 text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold font-serif cursor-pointer hover:bg-black/10 transition-colors" onClick={() => handleSort('guests')}>
                  <div className="flex items-center gap-2">Party Size {getSortIcon('guests')}</div>
                </th>
                <th className="p-6 text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold font-serif">Actions</th>
              </tr>
            </thead>
          <tbody>
            {isLoading ? (
               <tr><td colSpan={7} className="p-20 text-center animate-pulse">Loading accommodation data...</td></tr>
            ) : sortedRsvps.length === 0 ? (
               <tr><td colSpan={7} className="p-20 text-center font-serif italic text-xl opacity-50">No room requests found.</td></tr>
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
                      <div className="flex flex-col items-start">
                        <div className="flex items-center gap-2">
                          <p className="font-serif italic text-lg text-primary-text">{rsvp.firstName} {rsvp.lastName}</p>
                          { (rsvp.isPlaceholder || rsvp.email?.includes('placeholder-') || rsvp.notes === "Placeholder created by admin.") ? (
                            <span className="text-[8px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-sm uppercase tracking-widest font-bold border border-yellow-200">
                              Placeholder
                            </span>
                          ) : (rsvp.attendance !== "Joyfully accept") ? (
                            <span className="text-[8px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-sm uppercase tracking-widest font-bold border border-yellow-200">
                              No RSVP
                            </span>
                          ) : null}
                        </div>
                        <p className="text-xs text-secondary-text opacity-60 uppercase tracking-tighter mt-1 mb-2">{rsvp.email}</p>
                        <select
                          value={rsvp.side || ""}
                          onChange={async (e) => {
                            const newSide = e.target.value;
                            try {
                              await updateRsvp(rsvp.id!, { side: newSide });
                              setRsvps(prev => prev.map(r => r.id === rsvp.id ? { ...r, side: newSide } : r));
                              toast.success("Guest side updated");
                            } catch (err) {
                              toast.error("Failed to update guest side");
                            }
                          }}
                          className="text-[10px] bg-black/5 border border-accent-terracotta/10 rounded-md px-2 py-1 outline-none font-serif italic text-secondary-text cursor-pointer hover:bg-black/10 transition-colors"
                        >
                          <option value="">Assign Side</option>
                          <option value="Bride">Bride</option>
                          <option value="Groom">Groom</option>
                          <option value="Both">Both</option>
                        </select>
                      </div>
                    </td>
                   <td className="p-6">
                     <span className="bg-[#FBF9F4] px-4 py-2 border border-accent-terracotta/20 rounded-xl font-serif italic text-primary-text">
                       {formatRoom(rsvp.roomPreference)}
                     </span>
                   </td>
                   <td className="p-6">
                     <span className={`px-4 py-2 rounded-xl font-serif italic text-sm border ${rsvp.assignedRoom ? 'bg-green-50 text-green-700 border-green-200' : 'bg-black/5 text-secondary-text border-black/10'}`}>
                       {rsvp.assignedRoom || "Unassigned"}
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
          allRsvps={rsvps}
          onClose={() => setEditingGuest(null)} 
          onSuccess={handleEditSuccess} 
        />
      )}
    </div>
  );
};
