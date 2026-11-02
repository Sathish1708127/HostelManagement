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
