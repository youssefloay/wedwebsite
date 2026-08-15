import emailjs from '@emailjs/browser';
import { RsvpData } from './rsvpService';

const EMAILJS_SERVICE_ID = 'service_am48iun';
const EMAILJS_TEMPLATE_ID = 'template_hvorhqr';
const EMAILJS_PUBLIC_KEY = '4S6Kn_MhXiaMiCtJV';

// Room prices from RsvpPage.tsx
const ROOM_PRICES: Record<string, number> = {
  'Comfy': 200,
  'Superior Comfy': 190,
  'Castillo Junior': 135,
  'Family Room': 165,
};
const EXTRA_PERSON_BREAKFAST = 18.50;

export const sendConfirmationEmail = async (rsvpData: Partial<RsvpData>) => {
  // We only send emails to people who accept
  if (rsvpData.attendance !== 'Joyfully accept') return;

  const toName = rsvpData.firstName || '';
  const toEmail = rsvpData.email || '';
  
  const hasRoom = rsvpData.accommodation === 'Yes, please' && !!rsvpData.roomPreference;
  const roomType = rsvpData.roomPreference || '';
  
  // Format stay dates
  let stayDatesStr = '';
  const dates = [];
  if (rsvpData.stayDuration?.includes('Friday 16th')) dates.push('Friday 16th');
  if (rsvpData.stayDuration?.includes('Saturday 17th')) dates.push('Saturday 17th');
  if (rsvpData.stayDuration?.includes('Extra Night') && rsvpData.manualStayDates) {
    dates.push(rsvpData.manualStayDates);
  }
  stayDatesStr = dates.join(', ');

  // Calculate estimated price
  let totalPrice = 0;
  if (hasRoom && ROOM_PRICES[roomType]) {
    const basePrice = ROOM_PRICES[roomType];
    const numGuests = rsvpData.guests || 1;
    const nightlyRate = basePrice + (numGuests > 1 ? (numGuests - 1) * EXTRA_PERSON_BREAKFAST : 0);
    // Estimate number of nights
    let nights = 0;
    if (dates.length > 0) {
       // Just counting checked days if no extra manual dates, otherwise default to 2+ for extra
       if (rsvpData.stayDuration?.includes('Extra Night')) {
         nights = 3; // rough estimate if extra night
       } else {
         nights = dates.length;
       }
    } else {
       nights = 2; // Default to 2 nights
    }
    totalPrice = nightlyRate * nights;
  }

  let roomDetailsHtml = '';
  if (hasRoom) {
    roomDetailsHtml = `
    <div class="details-box" style="background-color: #FAF8F5; border: 1px solid rgba(179, 114, 76, 0.1); padding: 20px; border-radius: 12px; margin-top: 20px; margin-bottom: 20px;">
      <p style="margin-top: 0; color: #515C4C; font-size: 20px; font-style: italic;">Your Accommodation Details</p>
      <p><strong>Room Type:</strong> <span style="color: #B3724C;">${roomType}</span></p>
      <p><strong>Dates:</strong> <span style="color: #B3724C;">${stayDatesStr}</span></p>
      <p><strong>Estimated Total:</strong> <span style="color: #B3724C;">€${totalPrice.toFixed(2)}</span></p>
      <p style="font-size: 14px; margin-bottom: 0;"><em>Note: Because you booked a room at the castle, the hotel must have sent you a separate confirmation email.</em></p>
    </div>
    `;
  }

  const templateParams = {
    to_name: toName,
    to_email: toEmail,
    room_details_html: roomDetailsHtml,
  };

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
