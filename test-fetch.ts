import { getAllRsvps } from './src/lib/rsvpService';
import { sendConfirmationEmail } from './src/lib/emailService';

async function test() {
  const rsvps = await getAllRsvps();
  const alvaro = rsvps.find(r => (r.firstName + ' ' + r.lastName).toLowerCase().includes('alavaro'));
  if (alvaro) {
    console.log('Found Alvaro:', alvaro);
    // test emailService logic
    await sendConfirmationEmail(alvaro);
  } else {
    console.log('Could not find Alvaro');
  }
}

test().catch(console.error);
