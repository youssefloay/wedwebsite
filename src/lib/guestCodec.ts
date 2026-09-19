import { RsvpData } from "./rsvpService";

export const encodeGuestPayload = (rsvp: Partial<RsvpData>): string => {
  try {
    const minified = {
      id: rsvp.id || "",
      fn: rsvp.firstName || "",
      ln: rsvp.lastName || "",
      em: rsvp.email || "",
      g: rsvp.guests || 1,
      gn: rsvp.guestNames || [],
      acc: rsvp.accommodation || "",
      rp: rsvp.roomPreference || "",
      sd: rsvp.stayDuration || "",
      msd: rsvp.manualStayDates || "",
      ar: rsvp.assignedRoom || "",
      bp: rsvp.bedPreference || "",
      ean: rsvp.externalAccommodationName || "",
      eaa: rsvp.externalAccommodationAddress || "",
      eac: rsvp.externalAccommodationCity || "",
      tw: rsvp.travelingWithGuests || "",
      twn: rsvp.travelingWithGuestNames || "",
      am: rsvp.arrivalMethod || "",
      ad: rsvp.arrivalDate || "",
      at: rsvp.arrivalTime || "",
      fa: rsvp.flightNumberArrival || "",
      ati: rsvp.airportTransferIn || "",
      tip: rsvp.transferInPax || 0,
      wto: rsvp.weddingDayTransferTo || "",
      wfrom: rsvp.weddingDayTransferFrom || "",
      top: rsvp.weddingDayTransferPax || 0,
      dm: rsvp.departureMethod || "",
      dd: rsvp.departureDate || "",
      dt: rsvp.departureTime || "",
      fd: rsvp.flightNumberDeparture || "",
      ato: rsvp.airportTransferOut || "",
      dc: rsvp.dietaryCategories || [],
      d: rsvp.dietary || "",
      ha: rsvp.hasAccessibilityNeeds || false,
      adets: rsvp.accessibilityDetails || "",
      oc: rsvp.otherChanges || "",
      ae: rsvp.anythingElse || "",
      notes: rsvp.notes || "",
    };

    const jsonStr = JSON.stringify(minified);
    const bytes = new TextEncoder().encode(jsonStr);
    let binString = "";
    for (let i = 0; i < bytes.length; i++) {
      binString += String.fromCharCode(bytes[i]);
    }
    const b64 = btoa(binString);
    return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  } catch (err) {
    console.error("Failed to encode guest payload:", err);
    return "";
  }
};

export const decodeGuestPayload = (encoded: string): Partial<RsvpData> | null => {
  try {
    let b64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) {
      b64 += "=";
    }
    const binString = atob(b64);
    const bytes = new Uint8Array(binString.length);
    for (let i = 0; i < binString.length; i++) {
      bytes[i] = binString.charCodeAt(i);
    }
    const jsonStr = new TextDecoder().decode(bytes);
    const p = JSON.parse(jsonStr);
    return {
      id: p.id,
      firstName: p.fn,
      lastName: p.ln,
      email: p.em,
      guests: p.g,
      guestNames: p.gn,
      accommodation: p.acc,
      roomPreference: p.rp,
      stayDuration: p.sd,
      manualStayDates: p.msd,
      assignedRoom: p.ar,
      bedPreference: p.bp,
      externalAccommodationName: p.ean,
      externalAccommodationAddress: p.eaa,
      externalAccommodationCity: p.eac,
      travelingWithGuests: p.tw,
      travelingWithGuestNames: p.twn,
      arrivalMethod: p.am,
      arrivalDate: p.ad,
      arrivalTime: p.at,
      flightNumberArrival: p.fa,
      airportTransferIn: p.ati,
      transferInPax: p.tip,
      weddingDayTransferTo: p.wto,
      weddingDayTransferFrom: p.wfrom,
      weddingDayTransferPax: p.top,
      departureMethod: p.dm,
      departureDate: p.dd,
      departureTime: p.dt,
      flightNumberDeparture: p.fd,
      airportTransferOut: p.ato,
      dietaryCategories: p.dc,
      dietary: p.d,
      hasAccessibilityNeeds: p.ha,
      accessibilityDetails: p.adets,
      otherChanges: p.oc,
      anythingElse: p.ae,
      notes: p.notes,
    };
  } catch (err) {
    console.error("Failed to decode guest payload from URL:", err);
    return null;
  }
};

export const createGuestConfirmationLink = (rsvp: Partial<RsvpData>): string => {
  const baseUrl = window.location.href.split("#")[0];
  const encoded = encodeGuestPayload(rsvp);
  const token = rsvp.id || "guest";
  return encoded
    ? `${baseUrl}#/guest-confirmation/${token}?d=${encoded}`
    : `${baseUrl}#/guest-confirmation/${token}`;
};
