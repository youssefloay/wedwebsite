# Admin Dashboard Planning: Wedding RSVPs

This document outlines the features and architecture for the internal Admin Dashboard to manage wedding RSVPs.

## 1. Objectives
- Provide a centralized view of all guest responses.
- Track logistics (Accommodation, Travel, Visas).
- Generate reports for vendors (Caterers, Hotel Concierge).
- Enable manual overrides or corrections to guest data.

## 2. Core Features

### 2.1 Dashboard Overview (Analytics)
- **Total RSVP Submissions**: Count of unique forms submitted.
- **Attendance Summary**:
    - Total "Joyfully Accepts" vs "Regretfully Declines".
    - Total Headcount (including plus-ones).
- **Accommodation Snapshot**: Number of rooms requested by type.
- **Dietary Alerts**: Count of guests with specific allergies or requirements.

### 2.2 Guest Management (The Master List)
- **Searchable Table**: Filter by name, email, or attendance status.
- **Columns**: 
    - Full Name
    - Status (Attending/Declined)
    - Party Size
    - Email
    - Dietaries (Indicator icon)
    - Action (View Details)
- **Detailed View**: Modal or dedicated page showing every field from the RSVP form (Music suggestions, Notes, Visa needs, etc.).

### 2.3 Specialized Logistics Views
- **Dietary Report**: A clean list for the chef, grouped by allergy/restriction type.
- **Accommodation Registry**: 
    - Grouped by room type (Comfy, Family, etc.).
    - Stay dates (Fri, Sat, Extra nights).
    - Room preference vs. allocation.
- **Travel & Visa Registry**:
    - List of guests needing Airport Transfers.
    - List of guests needing Visa support documents.

### 2.4 Data Actions
- **Export to CSV/Excel**: One-click download for sharing with vendors.

#### Export Specifications (CSV/Excel)
The export must be a flat file with **one row per submission** and the following column structure:

1. **Submission Details**: `submission_time`, `attendance`
2. **Main Guest**: `first_name`, `last_name`, `email`
3. **Party Info**: `total_guests` (including main guest)
4. **Additional Guests**: 
   - `guest_2_first_name`, `guest_2_last_name`
   - `guest_3_first_name`, `guest_3_last_name`
   - `guest_4_first_name`, `guest_4_last_name`
5. **Logistics**: `accommodation_choice`, `room_type_preference`
6. **Nights (Boolean Split)**:
   - `stay_friday_16` (TRUE/FALSE)
   - `stay_saturday_17` (TRUE/FALSE)
   - `stay_extra_night` (TRUE/FALSE)
7. **Nights Detail**: `extra_night_details` (only filled if `stay_extra_night` is TRUE)
8. **Final Details**: `travel_method`, `visa_support_needed`, `dietary_requirements`, `music_recommendation`, `personal_message`

#### Export Logic Rules:
- **Attendance**: If "Regretfully Decline", all logistics/guest fields are empty; only `personal_message` can be filled.
- **Accommodation**: If choice is NOT "Castillo de Monda", the `room_type_preference` and all `stay_*` fields must be empty.
- **Guests**:
  - `total_guests = 1`: all additional guest fields empty.
  - `total_guests = 2`: only `guest_2` filled.
  - `total_guests = 3`: `guest_2` and `guest_3` filled.
  - `total_guests = 4`: all guest fields filled.
- **General**: No nested JSON, no placeholders like "N/A" (leave empty).

- **Manual Edit**: Ability to fix typos or update status if a guest calls manually.
- **Delete Entry**: Remove duplicate or test submissions.

## 3. Technical Requirements

### 3.1 Authentication
- **Secure Access**: Since guest data is private (emails, phone numbers), the dashboard MUST be protected.
- **Method**: Firebase Authentication (Admin account only) or a simple protected route with a shared secret key (less secure).

### 3.2 Data Layer (Firebase Migration)
- Currently, the form uses Formspree. 
- To build a dashboard, we need to migrate to **Firebase Firestore**.
- **Collection Structure**:
    ```json
    rsvps: {
      "auto_id": {
        "attendance": "Joyfully accept",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "guests": 2,
        "guestNames": ["Jane Doe"],
        "accommodation": "Yes, please",
        "roomPreference": "Comfy",
        "stayDuration": "Friday 16th, Saturday 17th",
        "dietary": "Nut allergy",
        "musicSuggestion": "Dancing Queen",
        "notes": "Can't wait!",
        "visaSupport": "No",
        "submittedAt": "timestamp"
      }
    }
    ```

### 3.3 UI/UX Aesthetics
- **Style**: Match the elegant "Andalusian Editorial" aesthetic of the main site but with a more functional, clean interface.
- **Sidebar Navigation**: Dashboard, Guests, Logistics, Settings.
- **Mobile Responsive**: Ability to check guest counts on the go.

## 4. Next Steps
1. **Initialize Firebase**: Set up Firestore and Auth.
2. **Refactor RsvpPage.tsx**: Change submission from Formspree to Firestore.
3. **Build Admin Components**:
    - `AdminLayout.tsx`
    - `AdminLogin.tsx`
    - `AdminDashboard.tsx` (Summary stats)
    - `AdminGuestList.tsx` (Table view)
4. **Implement Export Functionality**.
