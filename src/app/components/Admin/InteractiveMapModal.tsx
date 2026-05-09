import React, { useState, useEffect } from "react";
import { X, Check, Trash2, Settings, Users, Bed } from "lucide-react";
import { RsvpData, getAllRsvps } from "../../../lib/rsvpService";
import { HOTEL_ROOMS } from "./RoomSelectorGrid";

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

export const InteractiveMapModal = ({ 
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
  const [coords, setCoords] = useState<RoomCoords>({});
  const [editMode, setEditMode] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(LEVELS[0].id);
  const [selectedRoomToPlace, setSelectedRoomToPlace] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await getAllRsvps();
        setRsvps(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchAll();

    const savedCoords = localStorage.getItem("floorPlanCoords");
    if (savedCoords) {
      try {
        setCoords(JSON.parse(savedCoords));
      } catch (e) {}
    }
  }, []);

  const getOccupants = (roomId: string) => {
    return rsvps.filter(r => r.assignedRoom === roomId && r.id !== currentGuestId);
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

  const copyConfigToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(coords, null, 2));
    alert("Map layout configuration copied to clipboard! Send this to your developer to make the placement permanent across all devices.");
  };

  const activeLevelRooms = Object.entries(coords).filter(([_, data]) => data.levelId === currentLevel);
  const unplacedRooms = ALL_ROOMS.filter(r => !coords[r.id]);

  return (
    <div className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#FBF9F4] rounded-[40px] w-full max-w-[95vw] h-[95vh] flex overflow-hidden shadow-2xl relative" onClick={e => e.stopPropagation()}>
        
        {/* SIDEBAR */}
        <div className="w-[350px] bg-white border-r border-accent-terracotta/10 flex flex-col h-full z-10">
          <div className="p-6 border-b border-accent-terracotta/10">
            <h3 className="text-3xl font-serif italic text-primary-text mb-2">Floor Plans</h3>
            <div className="flex items-center justify-between">
              <p className="text-xs text-secondary-text uppercase tracking-widest font-bold">Interactive Map</p>
              <button 
                onClick={() => setEditMode(!editMode)}
                className={`p-2 rounded-full transition-all ${editMode ? 'bg-accent-terracotta text-white shadow-md' : 'bg-black/5 text-secondary-text hover:bg-black/10'}`}
                title={editMode ? "Exit Edit Mode" : "Enter Admin Map Builder"}
              >
                {editMode ? <Check size={18} /> : <Settings size={18} />}
              </button>
            </div>
          </div>

          <div className="p-4 border-b border-accent-terracotta/10">
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
                  <p className="text-yellow-700 text-xs">Click a room number below, then click exactly on the map image to place the interactive button there.</p>
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

                <div className="border-t border-black/10 pt-4">
                  <button 
                    onClick={copyConfigToClipboard}
                    className="w-full bg-black/5 hover:bg-black/10 text-primary-text px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors"
                  >
                    Export Layout Config
                  </button>
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xs uppercase tracking-widest font-bold text-accent-terracotta">Rooms on this floor</h4>
                  <button 
                    onClick={() => { onSelect(""); onClose(); }}
                    className="text-[10px] bg-black/5 hover:bg-black/10 px-3 py-1 rounded-full uppercase font-bold tracking-widest"
                  >
                    Clear Selected
                  </button>
                </div>
                
                <div className="space-y-3">
                  {activeLevelRooms.map(([roomId]) => {
                    const room = ALL_ROOMS.find(r => r.id === roomId);
                    if (!room) return null;
                    const occupants = getOccupants(room.id);
                    const isSelected = currentAssignedRoom === room.id;
                    
                    return (
                      <div 
                        key={roomId} 
                        className={`p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
                          isSelected ? 'border-accent-terracotta bg-accent-terracotta/5' : 'border-black/5 bg-white'
                        }`}
                        onClick={() => {
                          if (occupants.length === 0) {
                            onSelect(room.id);
                            onClose();
                          }
                        }}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-serif italic font-bold text-xl">{room.number}</span>
                          {occupants.length > 0 && <span className="text-[9px] bg-red-100 text-red-600 px-2 py-1 rounded-full font-bold uppercase tracking-widest">Occupied</span>}
                          {isSelected && <Check size={16} className="text-accent-terracotta" />}
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
                  {activeLevelRooms.length === 0 && (
                    <div className="text-center bg-black/5 rounded-2xl p-6">
                      <p className="text-sm italic text-secondary-text opacity-70 mb-3">No rooms mapped on this floor yet.</p>
                      <button 
                        onClick={() => setEditMode(true)}
                        className="text-xs bg-white border border-accent-terracotta/20 text-accent-terracotta px-4 py-2 rounded-xl font-bold uppercase tracking-widest shadow-sm hover:bg-accent-terracotta hover:text-white transition-all"
                      >
                        Open Builder
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MAP AREA */}
        <div className="flex-1 bg-[#ebe8e0] relative overflow-auto flex items-center justify-center p-8">
          <button 
            className="absolute top-8 right-8 p-4 bg-white border border-accent-terracotta/10 rounded-full hover:bg-accent-terracotta hover:text-white transition-colors z-[300] shadow-xl" 
            onClick={onClose}
          >
            <X size={24} />
          </button>

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
              const isSelected = currentAssignedRoom === room.id;

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
                      if (!isOccupied) {
                        onSelect(room.id);
                        onClose();
                      }
                    }}
                    className={`relative flex flex-col items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border-[3px] shadow-lg backdrop-blur-md transition-all hover:scale-125 hover:z-50 ${
                      editMode ? 'bg-yellow-400 border-white text-yellow-900 animate-pulse' :
                      isSelected ? 'bg-accent-terracotta text-white border-white scale-125 z-40 shadow-accent-terracotta/50 shadow-xl' :
                      isOccupied ? 'bg-red-500 text-white border-white cursor-not-allowed opacity-90' :
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
                  {!editMode && (
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
                                <p className="text-[10px] text-red-800/80 uppercase mt-0.5 tracking-tighter font-bold">
                                  {o.stayDuration?.split(', ').map((d: string) => d === 'Extra Night' ? (o.manualStayDates ? `Extra: ${o.manualStayDates}` : d) : d).join(', ')}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-green-50 p-3 rounded-xl border border-green-100 text-center">
                          <p className="text-xs text-green-700 font-bold uppercase tracking-widest">Available</p>
                          <p className="text-[10px] text-green-600/70 mt-1">Click circle to assign</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
