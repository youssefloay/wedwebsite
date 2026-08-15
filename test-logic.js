const getBasePrice = (roomTypeStr) => {
  const lower = (roomTypeStr || '').toLowerCase();
  if (lower.includes("superior")) return 165;
  if (lower.includes("junior") || lower.includes("castillo")) return 190;
  if (lower.includes("standard") || lower.includes("comfy")) return 135;
  if (lower.includes("family") || lower.includes("familiar") || lower.includes("you and yours")) return 200;
  return 135; // Default
};

const rsvpData = {
  stayDuration: "Friday 16th",
  manualStayDates: "",
  guests: "2", // if string
};

const hasRoom = true;
const roomType = "Comfy";
let totalPrice = 0;

if (hasRoom) {
  const basePrice = getBasePrice(roomType);
  let numGuests = rsvpData.guests || 1;
  if (typeof numGuests === 'string') numGuests = parseInt(numGuests, 10);
  
  const checkDate = (dateStr) => {
    const stayDuration = rsvpData.stayDuration || '';
    const manualDates = rsvpData.manualStayDates || '';
    return (
      stayDuration.toLowerCase().includes(dateStr.toLowerCase()) ||
      manualDates.toLowerCase().includes(dateStr.toLowerCase())
    );
  };

  const specificDates = ["15th", "16th", "17th", "18th", "19th", "20th"];
  const hasSpecificDates = specificDates.some(d => checkDate(d));

  if (!hasSpecificDates) {
    let nightsCount = (rsvpData.stayDuration || '').split(",").filter(Boolean).length || 2;
    const breakfastCostPerNight = numGuests > 0 ? numGuests * 18.5 : 0;
    const nightlyRate = basePrice > 0 ? (basePrice + breakfastCostPerNight) : 0;
    totalPrice = nightlyRate * nightsCount;
  } else {
    specificDates.forEach(date => {
      if (checkDate(date)) {
        const breakfastRate = date === "17th" ? 19.0 : 18.5;
        const breakfastCost = numGuests > 0 ? numGuests * breakfastRate : 0;
        if (basePrice > 0) {
          totalPrice += (basePrice + breakfastCost);
        }
      }
    });
  }
}
console.log("Total Price:", totalPrice);
