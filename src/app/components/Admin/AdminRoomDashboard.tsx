import React, { useState, useEffect } from "react";
import { Check, Trash2, Settings, X, Search, UserPlus } from "lucide-react";
import { RsvpData, getAllRsvps, updateRsvp } from "../../../lib/rsvpService";
import { HOTEL_ROOMS } from "./RoomSelectorGrid";
import { toast } from "sonner";

const ALL_ROOMS = HOTEL_ROOMS.flatMap(group => group.rooms);

interface RoomCoords {
  [roomId: string]: { x: number; y: number; levelId: string };
}

const LEVELS = [
  { id: "level1", name: "Floor Plan 1", image: "/floorplans/level1.png" },
  { id: "level2", name: "Floor Plan 2", image: "/floorplans/level2.png" },
  { id: "level3", name: "Floor Plan 3", image: "/floorplans/level3.png" },
  { id: "level4", name: "Floor Plan 4", image: "/floorplans/level4.png" },
  { id: "level5", name: "Floor Plan 5", image: "/floorplans/level5.png" },
  { id: "level6", name: "Floor Plan 6", image: "/floorplans/level6.png" },
  { id: "level7", name: "Floor Plan 7", image: "/floorplans/level7.png" },
];

export const AdminRoomDashboard = () => {
  const [rsvps, setRsvps] = useState<RsvpData[]>([]);
  const [coords, setCoords] = useState<RoomCoords>({});
  const [editMode, setEditMode] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(LEVELS[0].id);
  const [selectedRoomToPlace, setSelectedRoomToPlace] = useState<string | null>(null);
  const [selectedRoomForAssignment, setSelectedRoomForAssignment] = useState<string | null>(null);
  const [guestSearch, setGuestSearch] = useState("");

  const fetchData = async () => {
    try {
      const data = await getAllRsvps();
      setRsvps(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();

    const savedCoords = localStorage.getItem("floorPlanCoords");
    if (savedCoords) {
      try {
        setCoords(JSON.parse(savedCoords));
      } catch (e) {}
    }
  }, []);

  const getOccupants = (roomId: string) => {
    return rsvps.filter(r => r.assignedRoom === roomId);
  };

  const saveCoords = (newCoords: RoomCoords) => {
    setCoords(newCoords);
    localStorage.setItem("floorPlanCoords", JSON.stringify(newCoords));
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!editMode || !selectedRoomToPlace) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newCoords = { ...coords };
    newCoords[selectedRoomToPlace] = { x, y, levelId: currentLevel };
    saveCoords(newCoords);
    setSelectedRoomToPlace(null);
  };

  const removeRoomCoord = (e: React.MouseEvent, roomId: string) => {
    e.stopPropagation();
    const newCoords = { ...coords };
    delete newCoords[roomId];
    saveCoords(newCoords);
  };

  const handleAssignGuest = async (guest: RsvpData, roomId: string) => {
    try {
      await updateRsvp(guest.id!, { ...guest, assignedRoom: roomId });
      toast.success(`${guest.firstName} assigned to room!`);
      fetchData(); // Refresh data
    } catch (err) {
      toast.error("Failed to assign guest");
    }
  };

  const handleUnassignGuest = async (guest: RsvpData) => {
    try {
      await updateRsvp(guest.id!, { ...guest, assignedRoom: "" });
      toast.success(`${guest.firstName} unassigned from room.`);
      fetchData(); // Refresh data
    } catch (err) {
      toast.error("Failed to unassign guest");
    }
  };

  const activeLevelRooms = Object.entries(coords).filter(([_, data]) => data.levelId === currentLevel);
  const unplacedRooms = ALL_ROOMS.filter(r => !coords[r.id]);

  // For the assignment dropdown
  const unassignedGuests = rsvps.filter(r => 
    r.attendance === "Joyfully accept" && 
    r.accommodation === "Yes, please" && 
    !r.assignedRoom &&
    (`${r.firstName} ${r.lastName}`.toLowerCase().includes(guestSearch.toLowerCase()))
  );

  return (
    <div className="bg-white rounded-[40px] border border-accent-terracotta/10 shadow-sm flex overflow-hidden h-[85vh] relative animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* SIDEBAR */}
      <div className="w-[350px] bg-[#FBF9F4] border-r border-accent-terracotta/10 flex flex-col h-full z-10 shrink-0">
        <div className="p-6 border-b border-accent-terracotta/10 bg-white">
          <h3 className="text-3xl font-serif italic text-primary-text mb-2">Interactive Map</h3>
          <div className="flex items-center justify-between">
            <p className="text-xs text-secondary-text uppercase tracking-widest font-bold">Room Assignment</p>
            <button 
              onClick={() => {
                setEditMode(!editMode);
                setSelectedRoomForAssignment(null);
              }}
              className={`p-2 rounded-full transition-all ${editMode ? 'bg-accent-terracotta text-white shadow-md' : 'bg-black/5 text-secondary-text hover:bg-black/10'}`}
              title={editMode ? "Exit Edit Mode" : "Enter Admin Map Builder"}
            >
              {editMode ? <Check size={18} /> : <Settings size={18} />}
            </button>
          </div>
        </div>

        <div className="p-4 border-b border-accent-terracotta/10 bg-white">
           <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
             {LEVELS.map(l => (
               <button
                 key={l.id}
                 onClick={() => setCurrentLevel(l.id)}
                 className={`px-4 py-2 rounded-xl whitespace-nowrap text-sm font-bold uppercase tracking-widest transition-all ${
                   currentLevel === l.id ? 'bg-accent-terracotta text-white' : 'bg-black/5 text-secondary-text hover:bg-black/10'
                 }`}
               >
                 {l.name}
               </button>
             ))}
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {editMode ? (
            <div className="animate-in fade-in">
              <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-200 mb-6">
                <h4 className="text-yellow-800 font-bold text-sm uppercase tracking-widest mb-1">Map Builder</h4>
                <p className="text-yellow-700 text-xs">Click a room below, then click on the map to place it.</p>
              </div>
              
              <h4 className="text-xs text-secondary-text uppercase tracking-widest font-bold mb-3">Unplaced Rooms ({unplacedRooms.length})</h4>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {unplacedRooms.map(room => (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoomToPlace(room.id)}
                    className={`w-full text-left p-3 rounded-xl text-sm font-bold transition-all border ${
                      selectedRoomToPlace === room.id 
                        ? 'bg-accent-terracotta text-white border-accent-terracotta shadow-md' 
                        : 'bg-white border-black/10 hover:border-accent-terracotta/30 text-primary-text'
                    }`}
                  >
                    Rm {room.number}
                  </button>
                ))}
                {unplacedRooms.length === 0 && (
                  <p className="col-span-2 text-center text-sm italic text-secondary-text opacity-50 py-4">All rooms are placed!</p>
                )}
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-black/5 shadow-sm">
                <h4 className="text-xs uppercase tracking-widest font-bold text-accent-terracotta mb-2">Instructions</h4>
                <p className="text-sm text-secondary-text font-serif italic">Click on any room on the map to view its details, assign guests, or unassign current occupants.</p>
              </div>
              
              <h4 className="text-xs uppercase tracking-widest font-bold text-accent-terracotta pt-4 border-t border-black/5">Rooms on this floor</h4>
              <div className="space-y-3">
                {activeLevelRooms.map(([roomId]) => {
                  const room = ALL_ROOMS.find(r => r.id === roomId);
                  if (!room) return null;
                  const occupants = getOccupants(room.id);
                  const isSelected = selectedRoomForAssignment === room.id;
                  
                  return (
                    <div 
                      key={roomId} 
                      className={`p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
                        isSelected ? 'border-accent-terracotta bg-accent-terracotta/5 shadow-sm scale-[1.02]' : 'border-black/5 bg-white'
                      }`}
                      onClick={() => setSelectedRoomForAssignment(room.id)}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-serif italic font-bold text-xl">{room.number}</span>
                        {occupants.length > 0 && <span className="text-[9px] bg-red-100 text-red-600 px-2 py-1 rounded-full font-bold uppercase tracking-widest">Occupied</span>}
                      </div>
                      <p className="text-xs text-secondary-text">{room.type} • {room.pax} pax</p>
                      {occupants.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-black/5 space-y-2">
                          {occupants.map(o => (
                            <div key={o.id}>
                              <p className="text-sm font-bold text-primary-text">{o.firstName} {o.lastName}</p>
                              <p className="text-[10px] text-secondary-text uppercase mt-0.5 opacity-80">
                                {o.stayDuration?.split(', ').map((d: string) => d === 'Extra Night' ? (o.manualStayDates ? `Extra: ${o.manualStayDates}` : d) : d).join(', ')}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MAP AREA */}
      <div className="flex-1 bg-[#ebe8e0] relative overflow-auto flex items-center justify-center p-8 border-r border-black/5">
        <div 
          className={`relative max-w-full max-h-full transition-all duration-300 ${editMode && selectedRoomToPlace ? 'cursor-crosshair scale-105' : ''}`}
          onClick={handleMapClick}
          style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
        >
          <img 
            src={LEVELS.find(l => l.id === currentLevel)?.image} 
            alt="Floor Plan" 
            className="max-h-[85vh] w-auto rounded-xl object-contain bg-white"
          />

          {/* ROOM MARKERS */}
          {activeLevelRooms.map(([roomId, data]) => {
            const room = ALL_ROOMS.find(r => r.id === roomId);
            if (!room) return null;
            const occupants = getOccupants(room.id);
            const isOccupied = occupants.length > 0;
            const isSelected = selectedRoomForAssignment === room.id;

            return (
              <div 
                key={roomId}
                className="absolute group z-10"
                style={{ left: `${data.x}%`, top: `${data.y}%`, transform: 'translate(-50%, -50%)' }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (editMode) return;
                    setSelectedRoomForAssignment(roomId);
                  }}
                  className={`relative flex flex-col items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border-[3px] shadow-lg backdrop-blur-md transition-all hover:scale-125 hover:z-50 ${
                    editMode ? 'bg-yellow-400 border-white text-yellow-900 animate-pulse' :
                    isSelected ? 'bg-accent-terracotta text-white border-white scale-125 z-40 shadow-accent-terracotta/50 shadow-xl' :
                    isOccupied ? 'bg-red-500 text-white border-white opacity-90' :
                    'bg-green-500 text-white border-white hover:bg-green-400'
                  }`}
                >
                  <span className="font-bold text-xs md:text-sm tracking-tighter">{room.number}</span>
                  
                  {editMode && (
                    <div 
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 cursor-pointer shadow-sm hover:scale-110 transition-all z-50"
                      onClick={(e) => removeRoomCoord(e, roomId)}
                    >
                      <Trash2 size={12} />
                    </div>
                  )}
                </button>

                {/* TOOLTIP ON HOVER */}
                {!editMode && !isSelected && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-white rounded-2xl shadow-2xl p-5 w-56 opacity-0 group-hover:opacity-100 pointer-events-none transition-all scale-95 group-hover:scale-100 z-50 border border-accent-terracotta/10">
                    <p className="font-serif italic font-bold text-2xl mb-1 text-primary-text">{room.number}</p>
                    <p className="text-[10px] text-secondary-text uppercase tracking-widest font-bold mb-3 pb-3 border-b border-black/5">{room.type} • {room.pax} pax</p>
                    {isOccupied ? (
                      <div className="bg-red-50 p-3 rounded-xl border border-red-100">
                        <p className="text-[9px] text-red-600 uppercase tracking-widest font-bold mb-1">Occupied By</p>
                        <div className="space-y-2">
                          {occupants.map(o => (
                            <div key={o.id}>
                              <p className="text-sm font-bold text-red-900 font-serif italic">{o.firstName} {o.lastName}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-green-50 p-3 rounded-xl border border-green-100 text-center">
                        <p className="text-xs text-green-700 font-bold uppercase tracking-widest">Available</p>
                        <p className="text-[10px] text-green-600/70 mt-1">Click circle to assign guests</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ASSIGNMENT SIDEBAR (RIGHT) */}
      {selectedRoomForAssignment && !editMode && (
        <div className="w-[350px] bg-white flex flex-col h-full shrink-0 animate-in slide-in-from-right-8 z-20 shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.1)]">
          {(() => {
            const room = ALL_ROOMS.find(r => r.id === selectedRoomForAssignment);
            if (!room) return null;
            const occupants = getOccupants(room.id);
            const remainingCapacity = room.pax - occupants.reduce((sum, o) => sum + o.guests, 0);

            return (
              <>
                <div className="p-6 border-b border-black/5 bg-[#FBF9F4] relative">
                  <button 
                    onClick={() => setSelectedRoomForAssignment(null)}
                    className="absolute top-6 right-6 p-2 bg-white rounded-full hover:bg-black/5 transition-colors"
                  >
                    <X size={16} />
                  </button>
                  <h3 className="text-4xl font-serif italic text-primary-text mb-2">Room {room.number}</h3>
                  <div className="flex flex-col gap-1 text-xs text-secondary-text uppercase tracking-widest font-bold">
                    <span>{room.type}</span>
                    <span>Max {room.pax} Guests</span>
                    {room.bed && <span>{room.bed}</span>}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                  {/* CURRENT OCCUPANTS */}
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-accent-terracotta mb-4">Current Occupants</h4>
                    {occupants.length > 0 ? (
                      <div className="space-y-3">
                        {occupants.map(o => (
                          <div key={o.id} className="bg-black/5 p-4 rounded-2xl flex items-center justify-between group">
                            <div>
                              <p className="font-serif italic font-bold text-lg text-primary-text">{o.firstName} {o.lastName}</p>
                              <p className="text-[10px] text-secondary-text uppercase mt-1 font-bold">Party of {o.guests}</p>
                              <p className="text-[9px] text-secondary-text uppercase mt-0.5 opacity-80">
                                {o.stayDuration?.split(', ').map((d: string) => d === 'Extra Night' ? (o.manualStayDates ? `Extra: ${o.manualStayDates}` : d) : d).join(', ')}
                              </p>
                            </div>
                            <button 
                              onClick={() => handleUnassignGuest(o)}
                              className="text-red-500 bg-red-50 p-2 rounded-xl opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                              title="Unassign"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-green-50 border border-green-100 p-4 rounded-2xl text-center">
                        <p className="text-green-800 font-serif italic">This room is empty!</p>
                      </div>
                    )}
                  </div>

                  {/* ADD GUESTS */}
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-accent-terracotta mb-4">Assign Guests</h4>
                    {remainingCapacity > 0 ? (
                      <div className="space-y-4">
                        <div className="relative">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-text/50" size={16} />
                          <input 
                            type="text" 
                            placeholder="Search unassigned guests..."
                            value={guestSearch}
                            onChange={(e) => setGuestSearch(e.target.value)}
                            className="w-full bg-black/5 border-none py-3 pl-10 pr-4 rounded-xl text-sm outline-none focus:ring-1 ring-accent-terracotta/20 font-serif italic"
                          />
                        </div>
                        
                        <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                          {unassignedGuests.length > 0 ? (
                            unassignedGuests.map(guest => (
                              <div key={guest.id} className="border border-black/5 p-4 rounded-2xl flex items-center justify-between hover:border-accent-terracotta/20 transition-all bg-white shadow-sm">
                                <div>
                                  <p className="font-serif italic font-bold text-base text-primary-text">{guest.firstName} {guest.lastName}</p>
                                  <p className="text-[10px] text-secondary-text uppercase mt-1 font-bold">Party of {guest.guests}</p>
                                  <p className="text-[9px] text-secondary-text uppercase mt-0.5 opacity-80 truncate max-w-[150px]" title={guest.roomPreference}>
                                    Req: {guest.roomPreference}
                                  </p>
                                </div>
                                <button 
                                  onClick={() => handleAssignGuest(guest, room.id)}
                                  className="bg-accent-terracotta text-white p-2 rounded-xl hover:bg-accent-terracotta/90 transition-all shadow-sm flex items-center gap-2"
                                  disabled={guest.guests > remainingCapacity}
                                  title={guest.guests > remainingCapacity ? "Party size exceeds room capacity" : "Assign to room"}
                                >
                                  <UserPlus size={16} />
                                </button>
                              </div>
                            ))
                          ) : (
                            <p className="text-center text-xs text-secondary-text italic py-4">
                              {guestSearch ? "No guests found." : "All accommodation requesters are assigned!"}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-black/5 p-4 rounded-2xl text-center">
                        <p className="text-secondary-text font-serif italic text-sm">Room is at max capacity.</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};
