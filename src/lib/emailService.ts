import emailjs from '@emailjs/browser';
import { RsvpData } from './rsvpService';

const EMAILJS_SERVICE_ID = 'service_am48iun';
const EMAILJS_TEMPLATE_ID = 'template_hvorhqr';
const EMAILJS_PUBLIC_KEY = '4S6Kn_MhXiaMiCtJV';

// Room prices logic matches Excel exactly
const getBasePrice = (roomTypeStr: string) => {
  const lower = roomTypeStr.toLowerCase();
  if (lower.includes("superior")) return 165;
  if (lower.includes("junior") || lower.includes("castillo")) return 190;
  if (lower.includes("standard") || lower.includes("comfy")) return 135;
  if (lower.includes("family") || lower.includes("familiar") || lower.includes("you and yours")) return 200;
  return 135; // Default
};
const EXTRA_PERSON_BREAKFAST = 18.50;

export const sendConfirmationEmail = async (rsvpData: Partial<RsvpData>) => {
  // We only send emails to people who accept
  if (rsvpData.attendance !== 'Joyfully accept') return;

  const toName = rsvpData.firstName || '';
  const toEmail = rsvpData.email || '';
  
  const hasRoom = rsvpData.accommodation === 'Yes, please' && !!rsvpData.roomPreference;
  const roomType = rsvpData.roomPreference || '';
  
  // We will pass the raw strings instead of formatting them into 'Dates: X'
  const stayDurationRaw = rsvpData.stayDuration || '';
  const manualDatesRaw = rsvpData.manualStayDates || '';

  // Calculate exact price mirroring Excel logic
  let totalPrice = 0;
  let roomDetailsHtml = '';
  if (hasRoom) {
    const basePrice = getBasePrice(roomType);
    const numGuests = rsvpData.guests || 1;
    
    let nightsCount = 2; // Default to 2 nights for standard weekend
    let checkInStr = "16 April 2027";
    let checkOutStr = "18 April 2027";

    const allDatesText = (stayDurationRaw + ' ' + manualDatesRaw).toLowerCase();

    // Advanced parsing for manual dates (e.g., "15th to 19th", "April 15 - 19")
    const match15 = allDatesText.includes('15');
    const match16 = allDatesText.includes('16');
    const match17 = allDatesText.includes('17');
    const match18 = allDatesText.includes('18');
    const match19 = allDatesText.includes('19');
    const match20 = allDatesText.includes('20');

    // Determine actual stayed dates if explicit
    const stayedDates = [];
    if (match15) stayedDates.push(15);
    if (match16) stayedDates.push(16);
    if (match17) stayedDates.push(17);
    if (match18) stayedDates.push(18);
    if (match19) stayedDates.push(19);
    if (match20) stayedDates.push(20);

    let minDate = 16;
    let maxDate = 17;
    
    if (stayedDates.length >= 2) {
      minDate = Math.min(...stayedDates);
      maxDate = Math.max(...stayedDates);
    } else if (stayedDates.length === 1) {
      minDate = stayedDates[0];
      maxDate = stayedDates[0];
    }
    
    nightsCount = (maxDate - minDate) + 1;
    checkInStr = `${minDate} April 2027`;
    checkOutStr = `${maxDate + 1} April 2027`;

    // Standard nightly rate (room + breakfast for all guests)
    const standardRate = basePrice + (numGuests > 0 ? numGuests * 18.5 : 0);
    const weekendRate = basePrice + (numGuests > 0 ? numGuests * 19.0 : 0);
    const stays17th = minDate <= 17 && maxDate >= 17;

    totalPrice = 0;
    let standardNights = 0;
    let weekendNights = 0;
    for (let d = minDate; d <= maxDate; d++) {
      if (d === 17) { weekendNights++; totalPrice += weekendRate; }
      else { standardNights++; totalPrice += standardRate; }
    }

    const breakdownListHtml = `
      <li style="margin-bottom: 6px; list-style: none; font-weight: bold;">Total: ${nightsCount} night${nightsCount > 1 ? 's' : ''}</li>
      ${standardNights > 0 ? `<li style="margin-bottom: 4px;">${standardNights} night${standardNights > 1 ? 's' : ''} × Room rate incl. breakfast (${numGuests} guest${numGuests > 1 ? 's' : ''}): <strong style="color: #B3724C;">€${standardRate.toFixed(2)}</strong> = €${(standardNights * standardRate).toFixed(2)}</li>` : ''}
      ${weekendNights > 0 ? `<li style="margin-bottom: 4px;">${weekendNights} night${weekendNights > 1 ? 's' : ''} × Room rate incl. breakfast (${numGuests} guest${numGuests > 1 ? 's' : ''}): <strong style="color: #B3724C;">€${weekendRate.toFixed(2)}</strong> (17th Apr) = €${(weekendNights * weekendRate).toFixed(2)}</li>` : ''}
    `;

    roomDetailsHtml = `
    <div class="details-box" style="background-color: #FAF8F5; border: 1px solid rgba(179, 114, 76, 0.1); padding: 20px; border-radius: 12px; margin-top: 20px; margin-bottom: 20px;">
      <p style="margin-top: 0; color: #515C4C; font-size: 20px; font-style: italic;">Your Accommodation Details</p>
      <p><strong>Room Type:</strong> <span style="color: #B3724C;">${roomType}</span></p>
      <p><strong>Check-in:</strong> <span style="color: #B3724C;">${checkInStr}</span></p>
      <p><strong>Check-out:</strong> <span style="color: #B3724C;">${checkOutStr}</span></p>
      
      <div style="margin-top: 15px; padding: 12px; background-color: rgba(255,255,255,0.6); border-radius: 8px;">
        <p style="margin: 0 0 8px 0; font-size: 15px;"><strong>Price Breakdown:</strong></p>
        <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #515C4C;">
          ${breakdownListHtml}
        </ul>
      </div>

      <p style="margin-top: 15px;"><strong>Estimated Total:</strong> <span style="color: #B3724C; font-size: 18px;">€${totalPrice.toFixed(2)}</span></p>
      <p style="font-size: 14px; margin-bottom: 0;"><em>Note: Because you booked a room at the castle, the hotel must have sent you a separate confirmation email. Please make sure to verify that the hotel email matches this confirmation email, and if you have any doubts, please contact us.</em></p>
    </div>
    `;
  }

  const templateParams = {
    to_name: toName,
    to_email: toEmail,
    room_details_html: roomDetailsHtml,
  };

  console.log("DEBUG EMAIL CALCULATION:", {
    rsvpData,
    basePrice: hasRoom ? getBasePrice(roomType) : 0,
    totalPrice,
    hasRoom,
    templateParams
  });

  try {
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );
    console.log('SUCCESS! Email sent.', response.status, response.text);
    return true;
  } catch (err) {
    console.error('FAILED to send email...', err);
    return false;
  }
};
