import React, { useEffect, useState } from "react";
import { getAllRsvps, RsvpData } from "../../../lib/rsvpService";
import { 
  Users, 
  Heart, 
  Bed, 
  Utensils, 
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { HOTEL_ROOMS } from "./RoomSelectorGrid";

const ALL_ROOMS = HOTEL_ROOMS.flatMap(group => group.rooms);

export const AdminDashboard = () => {
  const [rsvps, setRsvps] = useState<RsvpData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllRsvps();
        setRsvps(data);
      } catch (err) {
        console.error("Failed to fetch RSVPs:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = {
    totalSubmissions: rsvps.filter(r => !r.isPlaceholder && !r.email?.includes('placeholder-') && r.notes !== "Placeholder created by admin.").length,
    attendingCount: rsvps.filter(r => !r.isPlaceholder && !r.email?.includes('placeholder-') && r.notes !== "Placeholder created by admin." && r.attendance === "Joyfully accept").length,
    declinedCount: rsvps.filter(r => !r.isPlaceholder && !r.email?.includes('placeholder-') && r.notes !== "Placeholder created by admin." && r.attendance === "Regretfully decline").length,
    confirmedGuests: rsvps
      .filter(r => !r.isPlaceholder && !r.email?.includes('placeholder-') && r.notes !== "Placeholder created by admin." && r.attendance === "Joyfully accept")
      .reduce((acc, curr) => acc + (Number(curr.guests) || 0), 0),
    totalIncludingPlaceholders: rsvps
      .filter(r => {
        const isPlaceholder = r.isPlaceholder || r.email?.includes('placeholder-') || r.notes === "Placeholder created by admin.";
        return isPlaceholder || r.attendance === "Joyfully accept";
      })
      .reduce((acc, curr) => acc + (Number(curr.guests) || 0), 0),
    placeholderGuests: rsvps
      .filter(r => r.isPlaceholder || r.email?.includes('placeholder-') || r.notes === "Placeholder created by admin.")
      .reduce((acc, curr) => acc + (Number(curr.guests) || 0), 0),
    accommodationInterest: rsvps.filter(r => !r.isPlaceholder && !r.email?.includes('placeholder-') && r.notes !== "Placeholder created by admin." && r.accommodation === "Yes, please").length,
    dietaryCount: rsvps.filter(r => !r.isPlaceholder && !r.email?.includes('placeholder-') && r.notes !== "Placeholder created by admin." && r.dietary && r.dietary.trim() !== "").length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Heart className="text-accent-terracotta/20 animate-bounce" size={56} />
          <p className="label-uppercase text-xs tracking-widest text-accent-terracotta font-bold">Loading Stats...</p>
        </div>
      </div>
    );
  }

  const cards = [
    { label: "Total Headcount", value: stats.totalIncludingPlaceholders, sub: "Including placeholders", icon: <Users size={24} />, color: "bg-blue-50 text-blue-600" },
    { label: "Confirmed Guests", value: stats.confirmedGuests, sub: "RSVPs accepted", icon: <CheckCircle2 size={24} />, color: "bg-green-50 text-green-600" },
    { label: "Placeholder Guests", value: stats.placeholderGuests, sub: "Pending invitations", icon: <Users size={24} />, color: "bg-purple-50 text-purple-600" },
    { label: "RSVP Responses", value: stats.totalSubmissions, sub: `${stats.attendingCount} Accept / ${stats.declinedCount} Decline`, icon: <Heart size={24} />, color: "bg-red-50 text-red-600" },
    { label: "Hotel Requests", value: stats.accommodationInterest, sub: "Castillo de Monda", icon: <Bed size={24} />, color: "bg-indigo-50 text-indigo-600" },
    { label: "Dietary Needs", value: stats.dietaryCount, sub: "Allergies & Restrictions", icon: <Utensils size={24} />, color: "bg-orange-50 text-orange-600" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-serif italic text-primary-text">Dashboard Overview</h2>
          <p className="text-secondary-text font-serif italic mt-1 opacity-70">A snapshot of your wedding guest preparations.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border border-accent-terracotta/10 text-sm shadow-sm">
          <Clock size={16} className="text-accent-terracotta" />
          <span className="text-secondary-text font-medium">Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-8 rounded-[30px] border border-accent-terracotta/10 shadow-sm hover:shadow-md transition-all duration-500 group">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 rounded-2xl ${card.color} group-hover:scale-110 transition-transform duration-500`}>
                {card.icon}
              </div>
              <TrendingUp size={16} className="text-green-500 opacity-20" />
            </div>
            <div className="space-y-2">
              <p className="text-xs label-uppercase tracking-[0.2em] font-bold text-accent-terracotta">{card.label}</p>
              <p className="text-5xl font-serif italic text-primary-text">{card.value}</p>
              <p className="text-sm text-secondary-text opacity-70 font-serif italic">{card.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent RSVPs */}
        <div className="bg-white rounded-[40px] border border-accent-terracotta/10 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-serif italic text-primary-text">Recent Responses</h3>
            <button className="text-xs label-uppercase tracking-widest text-accent-terracotta hover:opacity-100 font-bold opacity-70 transition-opacity">View All</button>
          </div>
          <div className="space-y-6">
            {rsvps
              .filter(r => !r.isPlaceholder && !r.email?.includes('placeholder-'))
              .slice(0, 5)
              .map((rsvp) => (
              <div key={rsvp.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-black/5 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${
                    rsvp.attendance === 'Joyfully accept' 
                      ? 'bg-green-500' 
                      : rsvp.attendance === 'Regretfully decline' 
                        ? 'bg-red-400' 
                        : 'bg-yellow-400'
                  }`} />
                  <div>
                    <p className="font-serif italic text-lg text-primary-text">{rsvp.firstName} {rsvp.lastName}</p>
                    <p className="text-xs text-secondary-text opacity-60 uppercase tracking-tighter">{rsvp.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-serif italic text-accent-terracotta">
                    {rsvp.attendance === 'Joyfully accept' 
                      ? `+${rsvp.guests - 1} guests` 
                      : rsvp.attendance === 'Regretfully decline' 
                        ? 'Declined' 
                        : 'No RSVP'}
                  </p>
                  <p className="text-[9px] uppercase tracking-tighter opacity-30 mt-1">
                    {rsvp.submittedAt instanceof Date ? rsvp.submittedAt.toLocaleDateString() : (rsvp.submittedAt as any).toDate().toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Accommodation Breakdown */}
        <div className="bg-white rounded-[40px] border border-accent-terracotta/10 p-8 shadow-sm">
          <h3 className="text-2xl font-serif italic text-primary-text mb-8">Room Preferences</h3>
          <div className="space-y-8">
             {['Comfy', 'Superior Comfy', 'Castillo Junior', 'Family Room'].map(room => {
               const count = rsvps.filter(r => r.roomPreference === room).length;
               const totalRequests = stats.accommodationInterest;
               const percentage = totalRequests > 0 ? (count / totalRequests) * 100 : 0;
               return (
                 <div key={room} className="space-y-3">
                   <div className="flex justify-between items-end">
                     <span className="font-serif italic text-primary-text">{room} <span className="text-sm opacity-50 ml-1">({room === 'Comfy' ? '€154' : room === 'Superior Comfy' ? '€184' : room === 'Castillo Junior' ? '€209' : '€219'})</span></span>
                     <span className="text-xs text-accent-terracotta font-bold">{count} rooms</span>
                   </div>
                   <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden">
                     <div 
                      className="h-full bg-accent-terracotta transition-all duration-1000 ease-out" 
                      style={{ width: `${percentage}%` }}
                    />
                   </div>
                 </div>
               );
             })}
          </div>
        </div>
      </div>

      {/* Room Inventory */}
      <div className="bg-white rounded-[40px] border border-accent-terracotta/10 p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h3 className="text-3xl font-serif italic text-primary-text">Room Availability</h3>
            <p className="text-xs text-secondary-text font-serif italic hidden sm:block mt-1">Real-time inventory based on actual room assignments</p>
          </div>
          <div className="bg-[#FBF9F4] px-6 py-3 rounded-2xl border border-accent-terracotta/10 flex items-center gap-4 shadow-sm">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-secondary-text font-bold">Total Assigned</p>
              <p className="text-2xl font-serif italic text-accent-terracotta font-bold leading-none mt-1">
                {ALL_ROOMS.filter(r => rsvps.some(rsvp => rsvp.assignedRoom === r.id)).length} <span className="text-sm text-secondary-text font-normal">/ {ALL_ROOMS.length}</span>
              </p>
            </div>
            <div className="h-8 w-px bg-accent-terracotta/10 mx-2" />
            <div className="flex flex-col gap-1">
              <span className="text-[9px] uppercase font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded border border-pink-100 flex justify-between gap-3 min-w-[70px]">
                <span>Bride</span>
                <span>{ALL_ROOMS.filter(r => { const o = rsvps.find(x => x.assignedRoom === r.id); return o?.side === 'Bride'; }).length}</span>
              </span>
              <span className="text-[9px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 flex justify-between gap-3 min-w-[70px]">
                <span>Groom</span>
                <span>{ALL_ROOMS.filter(r => { const o = rsvps.find(x => x.assignedRoom === r.id); return o?.side === 'Groom'; }).length}</span>
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {['Comfy', 'Superior Comfy', 'Castillo Junior', 'Family Room'].map(roomType => {
            const total = ALL_ROOMS.filter(r => r.type === roomType).length;
            const assigned = ALL_ROOMS.filter(r => r.type === roomType && rsvps.some(rsvp => rsvp.assignedRoom === r.id)).length;
            const available = total - assigned;
            
            return (
              <div key={roomType} className="bg-[#FBF9F4] rounded-3xl p-6 border border-accent-terracotta/10 hover:shadow-md transition-shadow">
                <p className="text-xs uppercase tracking-widest text-accent-terracotta font-bold mb-2">{roomType}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-serif italic text-primary-text">{available}</span>
                  <span className="text-sm text-secondary-text font-serif italic">left of {total}</span>
                </div>
                <div className="mt-4 h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${available === 0 ? 'bg-red-400' : available <= 2 ? 'bg-yellow-400' : 'bg-green-400'}`}
                    style={{ width: `${total > 0 ? (assigned / total) * 100 : 0}%` }}
                  />
                </div>
                <div className="flex flex-col mt-3 gap-2">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] uppercase tracking-widest text-secondary-text font-bold">
                      {assigned} Assigned
                    </p>
                  </div>
                  {assigned > 0 && (
                    <div className="flex gap-2">
                      <span className="text-[9px] uppercase font-bold text-pink-600 bg-pink-50 px-1.5 py-0.5 rounded border border-pink-100">
                        {ALL_ROOMS.filter(r => r.type === roomType && rsvps.find(x => x.assignedRoom === r.id)?.side === 'Bride').length} B
                      </span>
                      <span className="text-[9px] uppercase font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                        {ALL_ROOMS.filter(r => r.type === roomType && rsvps.find(x => x.assignedRoom === r.id)?.side === 'Groom').length} G
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
