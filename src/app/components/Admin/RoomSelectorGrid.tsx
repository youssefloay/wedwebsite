import React, { useState, useEffect } from "react";
import { RsvpData, getAllRsvps } from "../../../lib/rsvpService";
import { X, Bed, Users, CheckCircle2 } from "lucide-react";

export const HOTEL_ROOMS = [
  { level: "Level 1 & 2 (Level 2: Stairs Only)", rooms: [
    { id: "101 (Superior, 3 pax, King + Sofa-bed)", number: "101", type: "Superior", pax: 3, bed: "King + Sofa-bed", features: "" },
    { id: "201 (Standard, 2 pax, King)", number: "201", type: "Standard", pax: 2, bed: "King", features: "" },
    { id: "202 (Castillo Junior, 2 pax, King, Terrace)", number: "202", type: "Castillo Junior", pax: 2, bed: "King", features: "Terrace" }
  ]},
  { level: "Level 3 (Elevator Access)", rooms: [
    { id: "301 (Standard, 2 pax, King)", number: "301", type: "Standard", pax: 2, bed: "King", features: "" },
    { id: "302 (Standard, 2 pax, King)", number: "302", type: "Standard", pax: 2, bed: "King", features: "" },
    { id: "303 (Standard, 2 pax, King)", number: "303", type: "Standard", pax: 2, bed: "King", features: "" }
  ]},
  { level: "Level 4 (Elevator Access)", rooms: [
    { id: "400 (Superior, 2 pax, Twin)", number: "400", type: "Superior", pax: 2, bed: "Twin", features: "" },
    { id: "400A (Family Room / Superior, 2 pax)", number: "400A", type: "Superior", pax: 2, bed: "Family", features: "" },
    { id: "401 (Superior, 2 pax, Twin)", number: "401", type: "Superior", pax: 2, bed: "Twin", features: "" },
    { id: "402 (Superior, 2 pax, Twin)", number: "402", type: "Superior", pax: 2, bed: "Twin", features: "" },
    { id: "403 (Superior, 2 pax, Twin, Balcony)", number: "403", type: "Superior", pax: 2, bed: "Twin", features: "Balcony" },
    { id: "404 (Superior, 2 pax, Twin, Balcony)", number: "404", type: "Superior", pax: 2, bed: "Twin", features: "Balcony" },
    { id: "405 (Superior, 2 pax, Twin, Balcony)", number: "405", type: "Superior", pax: 2, bed: "Twin", features: "Balcony" },
    { id: "406 (Superior, 2 pax, Twin)", number: "406", type: "Superior", pax: 2, bed: "Twin", features: "" },
    { id: "407 (Superior, 2 pax, Twin, Balcony)", number: "407", type: "Superior", pax: 2, bed: "Twin", features: "Balcony" },
    { id: "408 (Superior, 2 pax, Twin)", number: "408", type: "Superior", pax: 2, bed: "Twin", features: "" },
    { id: "409 (Superior, 3 pax, Twin + Sofa-bed)", number: "409", type: "Superior", pax: 3, bed: "Twin + Sofa-bed", features: "" },
    { id: "410 (Superior, 2 pax, Twin)", number: "410", type: "Superior", pax: 2, bed: "Twin", features: "" }
  ]},
  { level: "Level 5 (Elevator Access)", rooms: [
    { id: "501 (Standard, 2 pax)", number: "501", type: "Standard", pax: 2, bed: "", features: "" },
    { id: "502 (Standard, 2 pax)", number: "502", type: "Standard", pax: 2, bed: "", features: "" },
    { id: "505 (Family, 4 pax)", number: "505", type: "Family", pax: 4, bed: "", features: "" },
    { id: "507 (Superior, 2 pax)", number: "507", type: "Superior", pax: 2, bed: "", features: "" },
    { id: "508 (Standard, 2 pax, Twin)", number: "508", type: "Standard", pax: 2, bed: "Twin", features: "" }
  ]},
  { level: "Level 6 (Elevator Access)", rooms: [
    { id: "503 (Standard, 2 pax)", number: "503", type: "Standard", pax: 2, bed: "", features: "" },
    { id: "506 (Castillo Junior, 2 pax)", number: "506", type: "Castillo Junior", pax: 2, bed: "", features: "" },
    { id: "601 (Standard, 2 pax)", number: "601", type: "Standard", pax: 2, bed: "", features: "" },
    { id: "602 (Standard, 2 pax)", number: "602", type: "Standard", pax: 2, bed: "", features: "" },
    { id: "603 (Castillo Junior, 2 pax)", number: "603", type: "Castillo Junior", pax: 2, bed: "", features: "" },
    { id: "703 (Castillo Junior, 2 pax)", number: "703", type: "Castillo Junior", pax: 2, bed: "", features: "" }
  ]},
  { level: "Level 7 (Stairs Only)", rooms: [
    { id: "700 (Castillo Junior, 2 pax)", number: "700", type: "Castillo Junior", pax: 2, bed: "", features: "" },
    { id: "701 (Superior, 2 pax, Twin)", number: "701", type: "Superior", pax: 2, bed: "Twin", features: "" },
    { id: "702 (Superior, 2 pax, Twin)", number: "702", type: "Superior", pax: 2, bed: "Twin", features: "" },
    { id: "704 (Standard, 2 pax)", number: "704", type: "Standard", pax: 2, bed: "", features: "" },
    { id: "705 (Superior, 2 pax)", number: "705", type: "Superior", pax: 2, bed: "", features: "" },
    { id: "706 (Castillo Junior, 2 pax)", number: "706", type: "Castillo Junior", pax: 2, bed: "", features: "" }
  ]}
];

export const RoomSelectorGrid = ({ 
  currentAssignedRoom, 
  onSelect, 
  onClose,
  currentGuestId 
}: { 
  currentAssignedRoom: string, 
  onSelect: (roomId: string) => void, 
  onClose: () => void,
  currentGuestId?: string
}) => {
  const [rsvps, setRsvps] = useState<RsvpData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await getAllRsvps();
        setRsvps(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, []);

  const getOccupants = (roomId: string) => {
    return rsvps.filter(r => r.assignedRoom === roomId && r.id !== currentGuestId);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4 backdrop-blur-md" onClick={onClose}>
      <div className="bg-[#FBF9F4] rounded-[40px] max-w-6xl w-full max-h-[90vh] overflow-y-auto p-12 shadow-2xl relative" onClick={e => e.stopPropagation()}>
        <button 
          className="absolute top-8 right-8 p-3 bg-white border border-accent-terracotta/10 rounded-full hover:bg-accent-terracotta hover:text-white transition-colors z-10" 
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <div className="mb-10">
          <h3 className="text-4xl font-serif italic text-primary-text mb-2">Interactive Room Grid</h3>
          <p className="text-secondary-text font-serif italic opacity-70">Select an available room. Occupied rooms display the guests currently assigned to them.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-terracotta"></div>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="flex justify-end mb-4">
               <button 
                  onClick={() => { onSelect(""); onClose(); }}
                  className="px-6 py-3 bg-white text-secondary-text rounded-full shadow-sm hover:bg-black/5 transition-all text-sm font-bold uppercase tracking-widest border border-black/5"
               >
                 Clear Assignment
               </button>
            </div>
            {HOTEL_ROOMS.map(level => (
              <div key={level.level} className="space-y-6">
                <h4 className="text-2xl font-serif italic text-accent-terracotta border-b border-accent-terracotta/20 pb-2">{level.level}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {level.rooms.map(room => {
                    const occupants = getOccupants(room.id);
                    const isOccupied = occupants.length > 0;
                    const isSelected = currentAssignedRoom === room.id;

                    return (
                      <div 
                        key={room.id}
                        onClick={() => {
                          if (!isOccupied) {
                            onSelect(room.id);
                            onClose();
                          }
                        }}
                        className={`relative rounded-3xl p-6 border transition-all duration-300 ${
                          isSelected 
                            ? 'bg-accent-terracotta text-white border-accent-terracotta shadow-lg scale-[1.02]' 
                            : isOccupied 
                              ? 'bg-black/5 border-transparent opacity-70 cursor-not-allowed'
                              : 'bg-white border-accent-terracotta/20 hover:border-accent-terracotta hover:shadow-md cursor-pointer group'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <span className={`text-3xl font-serif italic font-bold ${isSelected ? 'text-white' : 'text-primary-text'}`}>
                              {room.number}
                            </span>
                            <p className={`text-xs uppercase tracking-widest font-bold mt-1 ${isSelected ? 'text-white/80' : 'text-accent-terracotta'}`}>
                              {room.type}
                            </p>
                          </div>
                          {isSelected && <CheckCircle2 size={24} className="text-white" />}
                          {isOccupied && !isSelected && (
                            <span className="bg-red-100 text-red-600 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                              Occupied
                            </span>
                          )}
                        </div>

                        <div className={`space-y-2 mb-6 ${isSelected ? 'text-white/90' : 'text-secondary-text'}`}>
                          <div className="flex items-center gap-2 text-sm">
                            <Users size={16} />
                            <span>Up to {room.pax} Guests</span>
                          </div>
                          {(room.bed || room.features) && (
                            <div className="flex items-center gap-2 text-sm">
                              <Bed size={16} />
                              <span>{[room.bed, room.features].filter(Boolean).join(" • ")}</span>
                            </div>
                          )}
                        </div>

                        {isOccupied && (
                          <div className="mt-4 pt-4 border-t border-black/10">
                            <p className="text-[10px] uppercase tracking-widest font-bold text-secondary-text mb-2">Assigned to:</p>
                            {occupants.map(occ => (
                              <div key={occ.id} className="text-sm font-serif italic text-primary-text font-bold leading-tight">
                                {occ.firstName} {occ.lastName} <span className="text-xs opacity-60 normal-case not-italic">({occ.guests} pax)</span>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {!isOccupied && !isSelected && (
                          <div className="absolute inset-0 bg-accent-terracotta/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl flex items-center justify-center">
                            <span className="bg-white text-accent-terracotta px-6 py-2 rounded-full font-serif italic text-sm font-bold shadow-sm">
                              Click to Assign
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
