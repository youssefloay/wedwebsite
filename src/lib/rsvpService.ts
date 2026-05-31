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

  // Patch for Nadine Seleem and Bride/Groom as requested by admin
  return data.map(rsvp => {
    const fn = rsvp.firstName?.trim().toLowerCase() || "";
    const ln = rsvp.lastName?.trim().toLowerCase() || "";

    if (fn === "nadine" && ln === "seleem") {
      if (!rsvp.stayDuration?.includes("Saturday 17th")) {
        rsvp.stayDuration = rsvp.stayDuration 
          ? (rsvp.stayDuration.includes("Saturday 17th") ? rsvp.stayDuration : `${rsvp.stayDuration}, Saturday 17th`)
          : "Saturday 17th";
      }
    }

    if (
      (fn === "lama" && ln === "loay") || 
      ((fn === "alvaro" || fn === "álvaro") && ln === "recas") ||
      ((fn === "josé-alberto" || fn === "jose-alberto" || fn === "josé alberto" || fn === "jose alberto") && ln === "recas")
    ) {
      rsvp.isPlaceholder = false;
      rsvp.stayDuration = "Thursday 15th, Friday 16th, Saturday 17th, Sunday 18th";
      rsvp.attendance = "Joyfully accept";
      rsvp.accommodation = "Yes, please";
      if (rsvp.email?.includes('placeholder-')) {
        rsvp.email = `${fn}@wedding.com`;
      }
      if (rsvp.notes === "Placeholder created by admin.") {
        rsvp.notes = "Bride & Groom";
      }
    }
    
    return rsvp;
  });
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

export const downloadExcel = (data: any[], filename: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "RSVPs");
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};
