import { db } from "./firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  query, 
  orderBy, 
  where,
  Timestamp,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot
} from "firebase/firestore";

export const DIETARY_OPTIONS = [
  "Vegetarian",
  "Vegan",
  "Pescatarian",
  "Gluten-Free (Celiac)",
  "Lactose / Dairy Free",
  "Nut Allergy (Peanuts / Tree Nuts)",
  "Shellfish / Seafood Allergy",
  "Fish Allergy",
  "Egg Allergy",
  "Soy Free",
  "Sesame Allergy",
  "Mustard Allergy",
  "Celery Allergy",
  "Halal",
  "Kosher",
  "Pregnancy restrictions",
  "Alcohol Free",
  "Other"
];

export interface RsvpData {
  id?: string;
  attendance: string;
  firstName: string;
  lastName: string;
  email: string;
  guests: number;
  guestNames: { firstName: string; lastName: string; dietary?: string; dietaryCategories?: string[] }[];
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
  confirmationEmailSent?: boolean;

  // Accommodation payment tracking
  paymentStatus?: 'Paid' | 'Unpaid';

  // Final Confirmation fields
  confirmationSubmittedAt?: any; // Timestamp
  confirmationLinkEmailSent?: boolean;

  // Arrival
  arrivalMethod?: string;         // 'Plane' | 'Car' | 'Other'
  arrivalDate?: string;
  arrivalTime?: string;
  flightNumberArrival?: string;

  // Departure
  departureMethod?: string;
  departureDate?: string;
  departureTime?: string;
  flightNumberDeparture?: string;

  // Airport transfers (only for castle guests)
  airportTransferIn?: string;     // 'Yes' | 'No' | 'Not sure yet'
  airportTransferOut?: string;
  transferInPax?: number;
  transferOutPax?: number;

  // Wedding-day transport (only for non-castle guests)
  weddingDayTransferTo?: string;  // 'Yes' | 'No' | 'Not sure yet'
  weddingDayTransferFrom?: string;
  weddingDayTransferPax?: number;

  // Room configuration (for castle guests)
  bedPreference?: string;          // 'King Bed (1 large bed)' | 'Twin Beds (2 separate beds)' | 'No preference'

  // External accommodation
  externalAccommodationName?: string;
  externalAccommodationAddress?: string;
  externalAccommodationCity?: string;
  travelingWithGuests?: string;   // 'Yes' | 'No' | 'Not sure'
  travelingWithGuestNames?: string;

  // Dietary
  dietaryCategories?: string[];


  // Accessibility
  hasAccessibilityNeeds?: boolean;
  accessibilityDetails?: string;

  // RSVP changes
  rsvpChangeNote?: string;
  otherChanges?: string;
  anythingElse?: string;

  // Confirmation update tracking (for unauthenticated guests)
  isConfirmationUpdate?: boolean;
  originalRsvpId?: string;
}

const RSVP_COLLECTION = "rsvps";

export const saveRsvp = async (data: Omit<RsvpData, "submittedAt">) => {
  return await addDoc(collection(db, RSVP_COLLECTION), {
    ...data,
    submittedAt: Timestamp.now(),
  });
};

export const getAllRsvps = async (): Promise<RsvpData[]> => {
  // Query entire collection without orderBy so Firestore doesn't filter out docs missing submittedAt
  const querySnapshot = await getDocs(collection(db, RSVP_COLLECTION));
  const rawDocs = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as any));

  // Sort by submittedAt descending in memory safely
  rawDocs.sort((a, b) => {
    const aTime = a.submittedAt?.toMillis ? a.submittedAt.toMillis() : (a.submittedAt ? new Date(a.submittedAt).getTime() : 0);
    const bTime = b.submittedAt?.toMillis ? b.submittedAt.toMillis() : (b.submittedAt ? new Date(b.submittedAt).getTime() : 0);
    return bTime - aTime;
  });

  // Separate regular RSVPs and confirmation update documents
  const confirmationUpdates = rawDocs.filter(d => d.isConfirmationUpdate && d.originalRsvpId);
  const regularRsvps: RsvpData[] = rawDocs.filter(d => !d.isConfirmationUpdate);

  // Apply confirmation updates (sorted oldest to newest so newest values win)
  confirmationUpdates.sort((a, b) => {
    const aTime = a.submittedAt?.seconds || 0;
    const bTime = b.submittedAt?.seconds || 0;
    return aTime - bTime;
  });

  for (const update of confirmationUpdates) {
    const targetIdx = regularRsvps.findIndex(r => r.id === update.originalRsvpId);
    if (targetIdx !== -1) {
      const { id: _updateDocId, isConfirmationUpdate, originalRsvpId, ...fieldsToMerge } = update;
      regularRsvps[targetIdx] = {
        ...regularRsvps[targetIdx],
        ...fieldsToMerge
      };
    }
  }

  return regularRsvps;
};

/**
 * Real-time subscription to RSVPs via Firestore onSnapshot.
 * Calls the callback with the merged list whenever any document changes.
 * Returns an unsubscribe function — call it to stop listening (e.g. on component unmount).
 */
export const subscribeToRsvps = (callback: (rsvps: RsvpData[]) => void): (() => void) => {
  // Query entire collection without orderBy to avoid dropping documents without submittedAt
  const unsubscribe = onSnapshot(collection(db, RSVP_COLLECTION), (querySnapshot) => {
    const rawDocs = querySnapshot.docs.map(d => ({
      id: d.id,
      ...d.data()
    } as any));

    // Sort descending by submittedAt safely
    rawDocs.sort((a, b) => {
      const aTime = a.submittedAt?.toMillis ? a.submittedAt.toMillis() : (a.submittedAt ? new Date(a.submittedAt).getTime() : 0);
      const bTime = b.submittedAt?.toMillis ? b.submittedAt.toMillis() : (b.submittedAt ? new Date(b.submittedAt).getTime() : 0);
      return bTime - aTime;
    });

    const confirmationUpdates = rawDocs.filter((d: any) => d.isConfirmationUpdate && d.originalRsvpId);
    const regularRsvps: RsvpData[] = rawDocs.filter((d: any) => !d.isConfirmationUpdate);

    confirmationUpdates.sort((a: any, b: any) => {
      const aTime = a.submittedAt?.seconds || 0;
      const bTime = b.submittedAt?.seconds || 0;
      return aTime - bTime;
    });

    for (const update of confirmationUpdates) {
      const targetIdx = regularRsvps.findIndex(r => r.id === update.originalRsvpId);
      if (targetIdx !== -1) {
        const { id: _updateDocId, isConfirmationUpdate, originalRsvpId, ...fieldsToMerge } = update;
        regularRsvps[targetIdx] = {
          ...regularRsvps[targetIdx],
          ...fieldsToMerge
        };
      }
    }

    callback(regularRsvps);
  }, (err) => {
    console.error('subscribeToRsvps error:', err);
  });

  return unsubscribe;
};

export const deleteRsvp = async (id: string) => {
  await deleteDoc(doc(db, RSVP_COLLECTION, id));
  // Clean any confirmation updates for this ID
  try {
    const q = query(collection(db, RSVP_COLLECTION), where("originalRsvpId", "==", id));
    const snap = await getDocs(q);
    for (const d of snap.docs) {
      await deleteDoc(d.ref).catch(() => {});
    }
  } catch (e) {}
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

  // If there are shadow confirmation update docs for this guest, remove them so they don't clobber the admin's edit
  try {
    const q = query(
      collection(db, RSVP_COLLECTION),
      where("originalRsvpId", "==", id),
      where("isConfirmationUpdate", "==", true)
    );
    const snap = await getDocs(q);
    for (const d of snap.docs) {
      await deleteDoc(d.ref).catch(() => {});
    }
  } catch (err) {
    // Unauthenticated or not allowed, ignore
  }
};

/**
 * Submits guest confirmation updates.
 * Tries direct updateDoc first; if Firestore rules deny it,
 * safely falls back to addDoc which is allowed by Firestore security rules.
 */
export const submitGuestConfirmation = async (guestId: string, updates: Partial<RsvpData>) => {
  try {
    await updateRsvp(guestId, updates);
    return;
  } catch (err) {
    console.warn("Direct updateDoc denied by rules. Saving confirmation record via addDoc...", err);
  }

  // Clean updates of undefined values
  const cleanUpdates: any = { ...updates };
  Object.keys(cleanUpdates).forEach(key => {
    if (cleanUpdates[key] === undefined) delete cleanUpdates[key];
  });

  await addDoc(collection(db, RSVP_COLLECTION), {
    ...cleanUpdates,
    isConfirmationUpdate: true,
    originalRsvpId: guestId,
    submittedAt: Timestamp.now(),
  });
};

export const getRsvpById = async (id: string): Promise<RsvpData | null> => {
  const rsvpRef = doc(db, RSVP_COLLECTION, id);
  const snap = await getDoc(rsvpRef);
  if (!snap.exists()) return null;
  const baseData = { id: snap.id, ...snap.data() } as RsvpData;

  // Check if there are any confirmation update documents submitted for this guest
  try {
    const q = query(
      collection(db, RSVP_COLLECTION),
      where("originalRsvpId", "==", id),
      where("isConfirmationUpdate", "==", true)
    );
    const updatesSnap = await getDocs(q);
    if (!updatesSnap.empty) {
      const updates = updatesSnap.docs.map(d => d.data());
      updates.sort((a: any, b: any) => {
        const aTime = a.submittedAt?.seconds || 0;
        const bTime = b.submittedAt?.seconds || 0;
        return aTime - bTime;
      });
      for (const update of updates) {
        const { id: _uid, isConfirmationUpdate, originalRsvpId, ...fieldsToMerge } = update as any;
        Object.assign(baseData, fieldsToMerge);
      }
    }
  } catch (err) {
    console.warn("Could not query confirmation updates for getRsvpById:", err);
  }

  return baseData;
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
    accommodation_payment_status: isAttending && isStayingAtCastle ? (rsvp.paymentStatus || "Unpaid") : "",
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
           
           if (roomTypeStr.includes("superior")) basePrice = 165;
           else if (roomTypeStr.includes("junior") || roomTypeStr.includes("castillo")) basePrice = 190;
           else if (roomTypeStr.includes("standard") || roomTypeStr.includes("comfy")) basePrice = 135;
           else if (roomTypeStr.includes("family") || roomTypeStr.includes("familiar") || roomTypeStr.includes("you and yours")) basePrice = 200;
           else basePrice = 135; // Default to Standard/Comfy if no match

           const checkDate = (dateStr: string) => {
             return occupants.some(o => 
               o.stayDuration?.toLowerCase().includes(dateStr.toLowerCase()) || 
               o.manualStayDates?.toLowerCase().includes(dateStr.toLowerCase())
             );
           };
           
           let nightsCount = 0;
           let totalAmount = 0;
           const dates = ["15th", "16th", "17th", "18th", "19th", "20th"];
           const hasSpecificDates = dates.some(d => checkDate(d));

           if (!hasSpecificDates && occupants.length > 0) {
             nightsCount = Math.max(...occupants.map(o => {
               const parts = o.stayDuration?.split(",").map(p => p.trim()).filter(Boolean) || [];
               return parts.length > 0 ? parts.length : 2;
             }));
             const breakfastCostPerNight = totalGuests > 0 ? totalGuests * 18.5 : 0;
             const nightlyRate = basePrice > 0 ? (basePrice + breakfastCostPerNight) : 0;
             totalAmount = nightlyRate * nightsCount;
           } else {
             dates.forEach(date => {
               if (checkDate(date)) {
                 nightsCount++;
                 const breakfastRate = date === "17th" ? 19.0 : 18.5;
                 const breakfastCost = totalGuests > 0 ? totalGuests * breakfastRate : 0;
                 if (basePrice > 0) {
                   totalAmount += (basePrice + breakfastCost);
                 }
               }
             });
           }

           const standardNightlyRate = basePrice > 0 ? (basePrice + (totalGuests > 0 ? totalGuests * 18.5 : 0)) : 0;
           const exclusiveNightlyRate = basePrice > 0 ? (basePrice + (totalGuests > 0 ? totalGuests * 19.0 : 0)) : 0;
           
           row.getCell(7).value = names;
           row.getCell(8).value = emails;
           row.getCell(10).value = totalGuests;
           
           if (checkDate("15th")) row.getCell(13).value = "X";
           if (checkDate("16th")) row.getCell(14).value = "X";
           if (checkDate("17th")) row.getCell(15).value = "X";
           if (checkDate("18th")) row.getCell(16).value = "X";
           if (checkDate("19th") || checkDate("20th")) row.getCell(17).value = "X"; 
           
           if (occupants.length > 0) {
             row.getCell(19).value = standardNightlyRate; // Rate Euros No exclu. days Breakfast Incl.
             row.getCell(20).value = exclusiveNightlyRate; // Rate Euros Exclu. days Breakfast Incl. (17th)
             row.getCell(21).value = standardNightlyRate; // Prices per day
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
