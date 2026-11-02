# Hostel Pulse

Hostel Pulse is a responsive React + Supabase-ready frontend for a production-oriented hostel operations platform.

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env` from `.env.example` and configure Supabase values.
3. Start the frontend:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`
- `npm run typecheck`

## Student workspace

The navigation groups related pages under hostel, requests and care, dining and campus, and community. The dashboard includes shortcuts and an animated hostel illustration.

The calendar supports personal and hostel events, monthly navigation, and reminders while the calendar page is open. Optional browser notifications require permission and a supported secure browser context. Its built-in holiday list contains India's fixed national holidays (Republic Day, Independence Day, and Gandhi Jayanti); it is not a full regional or academic holiday calendar. Calendar entries are stored in the current browser.

The gallery stores uploaded photos in the current browser using IndexedDB. Photos are not uploaded to the server or shared across devices.

## Data and backend status

Set `VITE_SUPABASE_MOCK=true` for the local demo. Demo actions are stored in browser storage and are not shared across browsers or devices. The visitor, leave, service request, laundry, booking, cleaning, medical, and parcel workflows are interactive in demo mode.

With mock mode disabled, Supabase provides authentication and the PHP API currently exposes health, current-user, dashboard, residents, rooms, and bed-assignment endpoints. Other operational modules are not yet backed by API endpoints, payment processing is not configured, and guardian accounts are not linked to resident profiles. Do not treat sample records in those modules as live hostel data.

Registration and password-reset flows require a configured Supabase project and are intentionally unavailable in local mock mode rather than reporting false success.
