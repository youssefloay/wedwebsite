import { db } from "./firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  Timestamp,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";

export interface RsvpData {
  id?: string;
  attendance: string;
  firstName: string;
  lastName: string;
  email: string;
  guests: number;
  guestNames: { firstName: string; lastName: string }[];
  accommodation: string;
  roomPreference: string;
  stayDuration: string; // Comma separated: "Friday 16th, Saturday 17th, Extra Night"
  manualStayDates: string;
  assignedRoom?: string;
  transfer: string;
  carRental: string;
  visaSupport: string;
  dietary: string;
  musicSuggestion: string;
  notes: string;
  submittedAt: Timestamp | Date;
  isPlaceholder?: boolean;
  side?: string;
}

const RSVP_COLLECTION = "rsvps";

export const saveRsvp = async (data: Omit<RsvpData, "submittedAt">) => {
  return await addDoc(collection(db, RSVP_COLLECTION), {
    ...data,
    submittedAt: Timestamp.now(),
  });
};

export const getAllRsvps = async (): Promise<RsvpData[]> => {
  const q = query(collection(db, RSVP_COLLECTION), orderBy("submittedAt", "desc"));
  const querySnapshot = await getDocs(q);
  const data = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as RsvpData));

  console.log("DEBUG_RSVP:", data.filter(r => 
    r.firstName?.toLowerCase().includes("antony") || 
    r.firstName?.toLowerCase().includes("daniela")
  ));

  // Removed hardcoded patches because they overwrite real RSVPs and prevent admin edits.
  // The admin can manually update these guests via the Edit RSVP modal.
  return data;
};

export const deleteRsvp = async (id: string) => {
  await deleteDoc(doc(db, RSVP_COLLECTION, id));
};

export const updateRsvp = async (id: string, data: Partial<RsvpData>) => {
  const rsvpRef = doc(db, RSVP_COLLECTION, id);
  // Remove id from data to avoid updating the id field itself if present
  const { id: _, ...updateData } = data as any;
  
  // Firestore throws an error if we try to update a document with undefined values
  Object.keys(updateData).forEach(key => {
    if (updateData[key] === undefined) {
      delete updateData[key];
    }
  });

  await updateDoc(rsvpRef, updateData);
};

/**
 * Maps Guest data to the flat structure requested for CSV export
 */
export const mapToExportFormat = (rsvp: RsvpData) => {
  const isAttending = rsvp.attendance === "Joyfully accept";
  const isStayingAtCastle = rsvp.accommodation === "Yes, please";

  // Nights logic
  const checkDate = (date: string) => {
    if (!isAttending || !isStayingAtCastle) return "";
    const inDuration = rsvp.stayDuration?.includes(date);
    // Also check manualStayDates for extra nights
    const inManual = rsvp.manualStayDates?.toLowerCase().includes(date.toLowerCase());
    return (inDuration || inManual) ? "X" : "";
  };

  const stay_thursday_15 = checkDate("Thursday 15th");
  const stay_friday_16 = checkDate("Friday 16th");
  const stay_saturday_17 = checkDate("Saturday 17th");
  const stay_sunday_18 = checkDate("Sunday 18th");
  const stay_monday_20 = checkDate("Monday 20th");

  // Guest mapping
  const guest_2 = rsvp.guestNames[0] || {};
  const guest_3 = rsvp.guestNames[1] || {};
  const guest_4 = rsvp.guestNames[2] || {};

  return {
    "Date & Time": rsvp.submittedAt instanceof Timestamp ? rsvp.submittedAt.toDate().toLocaleString() : new Date(rsvp.submittedAt).toLocaleString(),
    attendance: rsvp.attendance,
    is_placeholder: (rsvp.isPlaceholder || rsvp.email?.includes('placeholder-') || rsvp.notes === "Placeholder created by admin.") ? "Yes" : "No",
    first_name: rsvp.firstName,
    last_name: rsvp.lastName,
    email: rsvp.email,
    side: rsvp.side || "",
    total_guests: isAttending ? rsvp.guests : 1,
    guest_2_first_name: isAttending && rsvp.guests >= 2 ? (guest_2.firstName || "") : "",
    guest_2_last_name: isAttending && rsvp.guests >= 2 ? (guest_2.lastName || "") : "",
    guest_3_first_name: isAttending && rsvp.guests >= 3 ? (guest_3.firstName || "") : "",
    guest_3_last_name: isAttending && rsvp.guests >= 3 ? (guest_3.lastName || "") : "",
    guest_4_first_name: isAttending && rsvp.guests >= 4 ? (guest_4.firstName || "") : "",
    guest_4_last_name: isAttending && rsvp.guests >= 4 ? (guest_4.lastName || "") : "",
    accommodation_choice: isAttending ? (isStayingAtCastle ? "Castillo de Monda" : "Independent") : "",
    room_type_preference: isAttending && isStayingAtCastle ? rsvp.roomPreference : "",
    assigned_room: isAttending && isStayingAtCastle ? (rsvp.assignedRoom || "") : "",
    "Thursday 15th": stay_thursday_15,
    "Friday 16th": stay_friday_16,
    "Saturday 17th": stay_saturday_17,
    "Sunday 18th": stay_sunday_18,
    "Monday 20th": stay_monday_20,
    extra_night_details: isAttending && rsvp.stayDuration.includes("Extra Night") ? rsvp.manualStayDates : "",
    travel_method: isAttending ? (rsvp.carRental === "Yes" ? "Car Rental" : rsvp.transfer === "Yes" ? "Transfer" : "Own Transportation") : "",
    visa_support_needed: isAttending ? rsvp.visaSupport : "",
    dietary_requirements: isAttending ? rsvp.dietary : "",
    music_recommendation: isAttending ? rsvp.musicSuggestion : "",
    personal_message: rsvp.notes
  };
};

export const convertToCSV = (data: any[]) => {
  if (data.length === 0) return "";
  const headers = Object.keys(data[0]).join(",");
  const rows = data.map(obj => 
    Object.values(obj)
      .map(val => `"${String(val).replace(/"/g, '""')}"`)
      .join(",")
  );
  return [headers, ...rows].join("\n");
};

import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export const downloadExcel = (data: any[], filename: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "RSVPs");
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const downloadExcelFromTemplate = async (rsvps: RsvpData[], filename: string) => {
  try {
    const response = await fetch('/template.xlsx');
    const arrayBuffer = await response.arrayBuffer();
    
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);
    const worksheet = workbook.worksheets[0];
    
    const groupedRsvps: Record<string, RsvpData[]> = {};
    for (const rsvp of rsvps) {
      if (rsvp.assignedRoom) {
        if (!groupedRsvps[rsvp.assignedRoom]) {
          groupedRsvps[rsvp.assignedRoom] = [];
        }
        groupedRsvps[rsvp.assignedRoom].push(rsvp);
      }
    }
    
    worksheet.eachRow((row, rowNumber) => {
      // Stop checking if we passed row 200 to be safe
      if (rowNumber > 200) return;
      
      const cellValue = row.getCell(2).value; // Room Number column
      if (cellValue) {
        const roomNumberStr = cellValue.toString().trim();
        if (roomNumberStr === "Room Number") return; // Header row
        
        const matchingRoomId = Object.keys(groupedRsvps).find(roomId => {
           const roomIdNumber = roomId.split(" ")[0];
           // Exact match or match with asterisk (like 101*)
           return roomNumberStr === roomIdNumber || roomNumberStr === `${roomIdNumber}*`;
        });
        
        if (matchingRoomId) {
           const occupants = groupedRsvps[matchingRoomId];
           
           const names = occupants.map(o => {
             const allNames = [`${o.firstName} ${o.lastName}`];
             if (o.guestNames && o.guestNames.length > 0) {
                o.guestNames.forEach(g => allNames.push(`${g.firstName} ${g.lastName}`));
             }
             return allNames.join(", ");
           }).join(" & ");
           
           const emails = occupants.map(o => o.email).filter(Boolean).join(", ");
           const totalGuests = occupants.reduce((acc, o) => acc + (o.attendance === "Joyfully accept" ? o.guests : 0), 0);
           
           const roomTypeStr = row.getCell(3).value?.toString().trim().toLowerCase() || "";
           let basePrice = 0;
           if (roomTypeStr.includes("standard double")) basePrice = 154; // Comfy
           else if (roomTypeStr.includes("standard double") || roomTypeStr.includes("comfy")) basePrice = 154; // Fallbacks
           else if (roomTypeStr.includes("superior")) basePrice = 184; // Superior Comfy
           else if (roomTypeStr.includes("castillo")) basePrice = 209; // Castillo Junior
           else if (roomTypeStr.includes("family")) basePrice = 219; // Family Room
           // Default if not caught
           else if (roomTypeStr.includes("standard")) basePrice = 154; 

           const checkDate = (dateStr: string) => {
             return occupants.some(o => 
               o.stayDuration?.toLowerCase().includes(dateStr.toLowerCase()) || 
               o.manualStayDates?.toLowerCase().includes(dateStr.toLowerCase())
             );
           };
           
           let nightsCount = 0;
           if (checkDate("15th")) nightsCount++;
           if (checkDate("16th")) nightsCount++;
           if (checkDate("17th")) nightsCount++;
           if (checkDate("18th")) nightsCount++;
           if (nightsCount === 0 && occupants.length > 0) {
             nightsCount = Math.max(...occupants.map(o => {
               const parts = o.stayDuration?.split(",").map(p => p.trim()).filter(Boolean) || [];
               return parts.length > 0 ? parts.length : 2;
             }));
           }

           const extraGuests = occupants.length > 0 ? Math.max(0, totalGuests - 1) : 0;
           const extraBreakfastCostPerNight = extraGuests * 18.5;
           const nonExclusiveRate = basePrice > 0 ? (basePrice - 0.5 + extraBreakfastCostPerNight) : 0;
           const exclusiveRate = basePrice > 0 ? (basePrice - 0.5 + (nightsCount * 0.5) + extraBreakfastCostPerNight) : 0;
           const totalAmount = basePrice > 0 ? (basePrice + extraBreakfastCostPerNight) * nightsCount : 0;
           const pricePerDay = occupants.length > 0 ? (nightsCount > 1 ? `${nonExclusiveRate} / ${exclusiveRate}` : exclusiveRate) : "";
           
           row.getCell(7).value = names;
           row.getCell(8).value = emails;
           row.getCell(10).value = totalGuests;
           
           if (checkDate("15th")) row.getCell(13).value = "X";
           if (checkDate("16th")) row.getCell(14).value = "X";
           if (checkDate("17th")) row.getCell(15).value = "X";
           if (checkDate("18th")) row.getCell(16).value = "X";
           if (checkDate("19th") || checkDate("20th")) row.getCell(17).value = "X"; 
           
           if (occupants.length > 0) {
             if (nightsCount > 1) row.getCell(19).value = nonExclusiveRate;
             row.getCell(20).value = exclusiveRate;
             row.getCell(21).value = pricePerDay;
             row.getCell(22).value = totalAmount;
           }
        }
      }
    });
    
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `${filename}.xlsx`);
  } catch (error) {
    console.error("Error generating excel from template:", error);
    alert("Failed to generate Excel from template. Please check console for details.");
  }
};
