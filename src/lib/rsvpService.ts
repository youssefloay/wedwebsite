import { db } from "./firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  Timestamp,
  deleteDoc,
  doc
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
  transfer: string;
  carRental: string;
  visaSupport: string;
  dietary: string;
  musicSuggestion: string;
  notes: string;
  submittedAt: Timestamp | Date;
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
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as RsvpData));
};

export const deleteRsvp = async (id: string) => {
  await deleteDoc(doc(db, RSVP_COLLECTION, id));
};

/**
 * Maps Guest data to the flat structure requested for CSV export
 */
export const mapToExportFormat = (rsvp: RsvpData) => {
  const isAttending = rsvp.attendance === "Joyfully accept";
  const isStayingAtCastle = rsvp.accommodation === "Yes, please";

  // Nights logic
  const stay_friday_16 = isAttending && isStayingAtCastle && rsvp.stayDuration.includes("Friday 16th");
  const stay_saturday_17 = isAttending && isStayingAtCastle && rsvp.stayDuration.includes("Saturday 17th");
  const stay_extra_night = isAttending && isStayingAtCastle && rsvp.stayDuration.includes("Extra Night");

  // Guest mapping
  const guest_2 = rsvp.guestNames[0] || {};
  const guest_3 = rsvp.guestNames[1] || {};
  const guest_4 = rsvp.guestNames[2] || {};

  return {
    "Date & Time": rsvp.submittedAt instanceof Timestamp ? rsvp.submittedAt.toDate().toLocaleString() : new Date(rsvp.submittedAt).toLocaleString(),
    attendance: rsvp.attendance,
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
    stay_friday_16: isAttending && isStayingAtCastle ? (stay_friday_16 ? "Yes" : "No") : "",
    stay_saturday_17: isAttending && isStayingAtCastle ? (stay_saturday_17 ? "Yes" : "No") : "",
    stay_extra_night: isAttending && isStayingAtCastle ? (stay_extra_night ? "Yes" : "No") : "",
    extra_night_details: isAttending && stay_extra_night ? rsvp.manualStayDates : "",
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
