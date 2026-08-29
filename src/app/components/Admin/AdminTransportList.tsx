import React, { useEffect, useState } from "react";
import { getAllRsvps, RsvpData } from "../../../lib/rsvpService";
import { Timestamp } from "firebase/firestore";
import { 
  Car, 
  Search, 
  HelpCircle, 
  FileSpreadsheet, 
  Download, 
  Users, 
  Plane, 
  Building,
  CheckCircle2,
  Clock,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { convertToCSV, downloadExcel } from "../../../lib/rsvpService";
import { toast } from "sonner";

type ActiveTab = "airport" | "hotels" | "status";

export const AdminTransportList = () => {
  const [rsvps, setRsvps] = useState<RsvpData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<ActiveTab>("airport");
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await getAllRsvps();
      // Keep only attending guests (non-placeholders)
      const attending = data.filter(r => 
        !r.isPlaceholder && 
        !r.email?.includes('placeholder-') &&
        r.attendance === "Joyfully accept"
      );
      setRsvps(attending);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load transport details");
    } finally {
      setIsLoading(false);
    }
  };

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

  // Grouping for Hotel Clustering
  const getHotelClusters = () => {
    const clusters: Record<string, {
      hotel: string;
      city: string;
      guestsCount: number;
      guestNames: string[];
      needToWedding: number;
      needFromWedding: number;
    }> = {};

    rsvps.forEach(rsvp => {
      if (rsvp.accommodation !== "Yes, please") {
        const hotelName = rsvp.externalAccommodationName?.trim() || "Accommodation Unknown";
        const city = rsvp.externalAccommodationCity?.trim() || "Unknown";
        
        if (!clusters[hotelName]) {
          clusters[hotelName] = {
            hotel: hotelName,
            city: city,
            guestsCount: 0,
            guestNames: [],
            needToWedding: 0,
            needFromWedding: 0,
          };
        }

        const partySize = Number(rsvp.guests) || 1;
        clusters[hotelName].guestsCount += partySize;
        
        let guestNameStr = `${rsvp.firstName} ${rsvp.lastName}`;
        if (rsvp.guestNames && rsvp.guestNames.length > 0) {
          guestNameStr += ` (+${rsvp.guestNames.map(g => `${g.firstName} ${g.lastName}`).join(", ")})`;
        }
        clusters[hotelName].guestNames.push(guestNameStr);

        if (rsvp.weddingDayTransferTo === "Yes") {
          clusters[hotelName].needToWedding += partySize;
        }
        if (rsvp.weddingDayTransferFrom === "Yes") {
          clusters[hotelName].needFromWedding += partySize;
        }
      }
    });

    return Object.values(clusters).sort((a, b) => b.guestsCount - a.guestsCount);
  };

  // Filter and Sort RSVPs for Airport Transfers
  const getFilteredAirportTransfers = () => {
    let result = rsvps.filter(r => 
      // Showing only guests staying at Monda who completed final confirmation or requested transfers
      r.accommodation === "Yes, please" && 
      (r.airportTransferIn === "Yes" || r.airportTransferOut === "Yes" || r.confirmationSubmittedAt)
    );

    if (searchTerm) {
      result = result.filter(r => 
        `${r.firstName} ${r.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortConfig) {
      result.sort((a, b) => {
        let aValue: any = a[sortConfig.key as keyof RsvpData];
        let bValue: any = b[sortConfig.key as keyof RsvpData];
        
        if (sortConfig.key === 'name') {
           aValue = `${a.firstName} ${a.lastName}`.toLowerCase();
           bValue = `${b.firstName} ${b.lastName}`.toLowerCase();
        }
        if (aValue === undefined || aValue === null) aValue = "";
        if (bValue === undefined || bValue === null) bValue = "";
        if (typeof aValue === 'string') aValue = aValue.toLowerCase();
        if (typeof bValue === 'string') bValue = bValue.toLowerCase();
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  };

  // Filter and Sort for Confirmation Status tab
  const getFilteredConfirmations = () => {
    let result = [...rsvps];
    if (searchTerm) {
      result = result.filter(r => 
        `${r.firstName} ${r.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortConfig) {
      result.sort((a, b) => {
        let aValue: any = a[sortConfig.key as keyof RsvpData];
        let bValue: any = b[sortConfig.key as keyof RsvpData];
        if (sortConfig.key === 'name') {
           aValue = `${a.firstName} ${a.lastName}`.toLowerCase();
           bValue = `${b.firstName} ${b.lastName}`.toLowerCase();
        }
        if (aValue === undefined || aValue === null) aValue = "";
        if (bValue === undefined || bValue === null) bValue = "";
        if (typeof aValue === 'string') aValue = aValue.toLowerCase();
        if (typeof bValue === 'string') bValue = bValue.toLowerCase();
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  };

  const handleExportCSV = () => {
    try {
      let exportData: any[] = [];
      let prefix = "";
      
      if (activeTab === "airport") {
        prefix = "airport_transfers";
        exportData = getFilteredAirportTransfers().map(r => ({
          Guest: `${r.firstName} ${r.lastName}`,
          GuestsCount: r.guests,
          ArrivalMethod: r.arrivalMethod || "",
          ArrivalDate: r.arrivalDate || "",
          ArrivalTime: r.arrivalTime || "",
          FlightArrival: r.flightNumberArrival || "",
          TransferInNeeded: r.airportTransferIn || "No",
          TransferInPax: r.transferInPax || 0,
          DepartureMethod: r.departureMethod || "",
          DepartureDate: r.departureDate || "",
          DepartureTime: r.departureTime || "",
          FlightDeparture: r.flightNumberDeparture || "",
          TransferOutNeeded: r.airportTransferOut || "No",
          TransferOutPax: r.transferOutPax || 0,
        }));
      } else if (activeTab === "hotels") {
        prefix = "hotel_clusters";
        exportData = getHotelClusters().map(c => ({
          Accommodation: c.hotel,
          City: c.city,
          TotalGuests: c.guestsCount,
          Names: c.guestNames.join(" | "),
          NeedToWedding: c.needToWedding,
          NeedFromWedding: c.needFromWedding,
        }));
      } else {
        prefix = "confirmation_status";
        exportData = getFilteredConfirmations().map(r => ({
          Guest: `${r.firstName} ${r.lastName}`,
          Email: r.email,
          RsvpStatus: r.attendance,
          Accommodation: r.accommodation === "Yes, please" ? "Castillo de Monda" : (r.externalAccommodationName || "Independent"),
          ConfirmationStatus: r.confirmationSubmittedAt ? "Confirmed" : "Pending",
          ConfirmationDate: r.confirmationSubmittedAt ? (r.confirmationSubmittedAt instanceof Timestamp ? r.confirmationSubmittedAt.toDate().toLocaleString() : new Date(r.confirmationSubmittedAt).toLocaleString()) : "",
        }));
      }

      const csv = convertToCSV(exportData);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${prefix}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("CSV exported successfully");
    } catch (err) {
      toast.error("Failed to export CSV");
    }
  };

  const handleExportExcel = () => {
    try {
      let exportData: any[] = [];
      let prefix = "";
      
      if (activeTab === "airport") {
        prefix = "airport_transfers";
        exportData = getFilteredAirportTransfers().map(r => ({
          Guest: `${r.firstName} ${r.lastName}`,
          GuestsCount: r.guests,
          ArrivalMethod: r.arrivalMethod || "",
          ArrivalDate: r.arrivalDate || "",
          ArrivalTime: r.arrivalTime || "",
          FlightArrival: r.flightNumberArrival || "",
          TransferInNeeded: r.airportTransferIn || "No",
          TransferInPax: r.transferInPax || 0,
          DepartureMethod: r.departureMethod || "",
          DepartureDate: r.departureDate || "",
          DepartureTime: r.departureTime || "",
          FlightDeparture: r.flightNumberDeparture || "",
          TransferOutNeeded: r.airportTransferOut || "No",
          TransferOutPax: r.transferOutPax || 0,
        }));
      } else if (activeTab === "hotels") {
        prefix = "hotel_clusters";
        exportData = getHotelClusters().map(c => ({
          Accommodation: c.hotel,
          City: c.city,
          TotalGuests: c.guestsCount,
          Names: c.guestNames.join(", "),
          NeedToWedding: c.needToWedding,
          NeedFromWedding: c.needFromWedding,
        }));
      } else {
        prefix = "confirmation_status";
        exportData = getFilteredConfirmations().map(r => ({
          Guest: `${r.firstName} ${r.lastName}`,
          Email: r.email,
          RsvpStatus: r.attendance,
          Accommodation: r.accommodation === "Yes, please" ? "Castillo de Monda" : (r.externalAccommodationName || "Independent"),
          ConfirmationStatus: r.confirmationSubmittedAt ? "Confirmed" : "Pending",
          ConfirmationDate: r.confirmationSubmittedAt ? (r.confirmationSubmittedAt instanceof Timestamp ? r.confirmationSubmittedAt.toDate().toLocaleString() : new Date(r.confirmationSubmittedAt).toLocaleString()) : "",
        }));
      }

      downloadExcel(exportData, `${prefix}_${new Date().toISOString().split('T')[0]}`);
      toast.success("Excel exported successfully");
    } catch (err) {
      toast.error("Failed to export Excel");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-serif italic text-primary-text flex items-center gap-3">
            <Car className="text-accent-terracotta" size={32} />
            Wedding Logistics & Transport
          </h2>
          <p className="text-secondary-text font-serif italic mt-2 opacity-70">
            Coordinate airport transfers, external guest accommodation clustering, and final confirmations.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
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
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-accent-terracotta/10">
        <button
          onClick={() => { setActiveTab("airport"); setSortConfig(null); }}
          className={`px-6 py-3 font-serif italic text-lg transition-colors relative ${activeTab === "airport" ? "text-accent-terracotta font-bold" : "text-secondary-text hover:text-primary-text"}`}
        >
          <div className="flex items-center gap-2">
            <Plane size={16} />
            Airport Transfers (Monda)
          </div>
          {activeTab === "airport" && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent-terracotta" />}
        </button>

        <button
          onClick={() => { setActiveTab("hotels"); setSortConfig(null); }}
          className={`px-6 py-3 font-serif italic text-lg transition-colors relative ${activeTab === "hotels" ? "text-accent-terracotta font-bold" : "text-secondary-text hover:text-primary-text"}`}
        >
          <div className="flex items-center gap-2">
            <Building size={16} />
            Hotel Clustering
          </div>
          {activeTab === "hotels" && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent-terracotta" />}
        </button>

        <button
          onClick={() => { setActiveTab("status"); setSortConfig(null); }}
          className={`px-6 py-3 font-serif italic text-lg transition-colors relative ${activeTab === "status" ? "text-accent-terracotta font-bold" : "text-secondary-text hover:text-primary-text"}`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            Final Confirmation Status
          </div>
          {activeTab === "status" && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent-terracotta" />}
        </button>
      </div>

      {/* Search Input (For Airport and Status tabs) */}
      {activeTab !== "hotels" && (
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
      )}

      {/* Tab Contents */}
      <div className="bg-white rounded-[40px] border border-accent-terracotta/10 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-20 text-center animate-pulse font-serif italic text-xl opacity-50">
            Loading logistics data...
          </div>
        ) : (
          <div className="overflow-x-auto">
            {activeTab === "airport" && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/5 border-b border-accent-terracotta/10">
                    <th className="p-6 text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold font-serif cursor-pointer hover:bg-black/10 transition-colors" onClick={() => handleSort('name')}>
                      <div className="flex items-center gap-2">Guest {getSortIcon('name')}</div>
                    </th>
                    <th className="p-6 text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold font-serif">Arrival details</th>
                    <th className="p-6 text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold font-serif">Inbound Transfer</th>
                    <th className="p-6 text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold font-serif">Departure details</th>
                    <th className="p-6 text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold font-serif">Outbound Transfer</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredAirportTransfers().length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-20 text-center font-serif italic text-xl opacity-50">
                        No airport transfers requested yet.
                      </td>
                    </tr>
                  ) : (
                    getFilteredAirportTransfers().map(r => (
                      <tr key={r.id} className="border-b border-accent-terracotta/5 hover:bg-black/[0.02]">
                        <td className="p-6">
                          <p className="font-serif italic text-lg text-primary-text">{r.firstName} {r.lastName}</p>
                          <p className="text-xs text-secondary-text opacity-60 uppercase mt-1">{r.guests} Guest(s)</p>
                        </td>
                        <td className="p-6 text-sm">
                          {r.arrivalMethod === "Plane" ? (
                            <>
                              <p className="font-bold text-accent-terracotta">{r.arrivalDate || "No Date"}</p>
                              <p className="text-secondary-text mt-0.5">{r.arrivalTime || "No Time"} ({r.flightNumberArrival || "No flight #"})</p>
                            </>
                          ) : r.arrivalMethod ? (
                            <p className="italic text-secondary-text">By {r.arrivalMethod}</p>
                          ) : (
                            <p className="text-secondary-text opacity-30 italic">No details</p>
                          )}
                        </td>
                        <td className="p-6">
                          <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
                            r.airportTransferIn === "Yes" 
                              ? "bg-green-50 text-green-700 border border-green-200" 
                              : r.airportTransferIn === "No" 
                                ? "bg-red-50 text-red-600 border border-red-100" 
                                : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                          }`}>
                            {r.airportTransferIn === "Yes" ? `Yes (${r.transferInPax || r.guests} pax)` : r.airportTransferIn || "Pending"}
                          </span>
                        </td>
                        <td className="p-6 text-sm">
                          {r.departureMethod === "Plane" ? (
                            <>
                              <p className="font-bold text-accent-terracotta">{r.departureDate || "No Date"}</p>
                              <p className="text-secondary-text mt-0.5">{r.departureTime || "No Time"} ({r.flightNumberDeparture || "No flight #"})</p>
                            </>
                          ) : r.departureMethod ? (
                            <p className="italic text-secondary-text">By {r.departureMethod}</p>
                          ) : (
                            <p className="text-secondary-text opacity-30 italic">No details</p>
                          )}
                        </td>
                        <td className="p-6">
                          <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
                            r.airportTransferOut === "Yes" 
                              ? "bg-green-50 text-green-700 border border-green-200" 
                              : r.airportTransferOut === "No" 
                                ? "bg-red-50 text-red-600 border border-red-100" 
                                : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                          }`}>
                            {r.airportTransferOut === "Yes" ? `Yes (${r.transferOutPax || r.guests} pax)` : r.airportTransferOut || "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {activeTab === "hotels" && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/5 border-b border-accent-terracotta/10">
                    <th className="p-6 text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold font-serif">Accommodation</th>
                    <th className="p-6 text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold font-serif">City</th>
                    <th className="p-6 text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold font-serif">Headcount</th>
                    <th className="p-6 text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold font-serif">Guests Staying</th>
                    <th className="p-6 text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold font-serif">Wedding-Day Transport</th>
                  </tr>
                </thead>
                <tbody>
                  {getHotelClusters().length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-20 text-center font-serif italic text-xl opacity-50">
                        No external accommodations recorded.
                      </td>
                    </tr>
                  ) : (
                    getHotelClusters().map((c, i) => (
                      <tr key={i} className="border-b border-accent-terracotta/5 hover:bg-black/[0.02]">
                        <td className="p-6 font-bold text-lg text-primary-text">{c.hotel}</td>
                        <td className="p-6 text-sm text-secondary-text font-serif italic">{c.city}</td>
                        <td className="p-6 text-lg font-serif italic text-accent-terracotta font-bold">{c.guestsCount}</td>
                        <td className="p-6 text-xs text-secondary-text leading-relaxed font-serif max-w-xs">
                          {c.guestNames.join(", ")}
                        </td>
                        <td className="p-6 text-sm">
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] uppercase font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded max-w-max">
                              To Wedding: {c.needToWedding} pax
                            </span>
                            <span className="text-[10px] uppercase font-bold text-purple-700 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded max-w-max">
                              Return: {c.needFromWedding} pax
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {activeTab === "status" && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/5 border-b border-accent-terracotta/10">
                    <th className="p-6 text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold font-serif cursor-pointer hover:bg-black/10 transition-colors" onClick={() => handleSort('name')}>
                      <div className="flex items-center gap-2">Guest {getSortIcon('name')}</div>
                    </th>
                    <th className="p-6 text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold font-serif">Email</th>
                    <th className="p-6 text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold font-serif">Accommodation</th>
                    <th className="p-6 text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold font-serif">Confirmation Status</th>
                    <th className="p-6 text-xs uppercase tracking-[0.2em] text-accent-terracotta font-bold font-serif">Confirmation Date</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredConfirmations().length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-20 text-center font-serif italic text-xl opacity-50">
                        No guests found.
                      </td>
                    </tr>
                  ) : (
                    getFilteredConfirmations().map(r => (
                      <tr key={r.id} className="border-b border-accent-terracotta/5 hover:bg-black/[0.02]">
                        <td className="p-6 font-serif italic text-lg text-primary-text">{r.firstName} {r.lastName}</td>
                        <td className="p-6 text-sm text-secondary-text uppercase tracking-tighter">{r.email}</td>
                        <td className="p-6 text-sm text-secondary-text font-serif italic">
                          {r.accommodation === "Yes, please" ? "Castillo de Monda" : (r.externalAccommodationName || "Independent")}
                        </td>
                        <td className="p-6">
                          {r.confirmationSubmittedAt ? (
                            <span className="flex items-center gap-1.5 text-xs uppercase font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full max-w-max">
                              <CheckCircle2 size={12} />
                              Confirmed
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-xs uppercase font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full max-w-max">
                              <Clock size={12} />
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="p-6 text-xs text-secondary-text opacity-70 uppercase tracking-tighter">
                          {r.confirmationSubmittedAt 
                            ? (r.confirmationSubmittedAt instanceof Timestamp 
                                ? r.confirmationSubmittedAt.toDate().toLocaleString() 
                                : new Date(r.confirmationSubmittedAt).toLocaleString())
                            : "-"
                          }
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
