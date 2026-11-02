# Master Development Prompt: Modern Hostel Operations Platform

You are a senior full-stack architect and engineer. Rebuild the existing hostel management project into a production-oriented, responsive web application. Do not create a static demo, disconnected forms, placeholder pages, or features that only use React state. Every functional screen must be connected to a real backend and database.

## 1. Existing Project Context

The current repository is a Vite + React application with partially implemented admin and student pages. It contains duplicate routers, duplicate sidebars, Firebase configuration in multiple files, local-state-only forms, empty shared components, inconsistent naming, hard-coded sample data, and some broken or placeholder pages.

Preserve useful UI ideas, but refactor the project into one coherent architecture. Remove Firebase completely after the Supabase/PHP migration is working. Do not retain duplicate routing or authentication systems.

Current modules to migrate or replace:

- Authentication and registration
- Admin and student dashboards
- Student details and profile
- Room management
- Mess menu and reviews
- Laundry tracking and reviews
- Cleaning feedback
- Complaints
- Leave applications
- Medical issue reporting
- Announcements
- Fees
- Shared navbar, sidebar, cards, modal, loader, and protected routes

Fix inconsistent filenames and spelling such as `MessReveiw`, `feees`, `adminRout`, and lowercase component filenames. Use predictable PascalCase component names.

## 2. Required Technology Architecture

Use this architecture because Supabase itself uses PostgreSQL and cannot be configured as a MySQL database:

- Frontend: React 19, Vite, React Router, JavaScript or TypeScript, and plain modern CSS
- Authentication: Supabase Auth
- File storage: Supabase Storage
- Realtime events: Supabase Realtime channels for notifications and live dashboard updates
- Business backend: PHP 8.2+ REST API
- Operational database: MySQL 8+
- Database access: PHP PDO with prepared statements
- Frontend data access: a centralized API client that calls only the PHP API for business data
- Authentication bridge: React sends the Supabase access token as a Bearer token; PHP verifies the token and maps its `sub` user ID to the local MySQL user/profile record

Supabase must not become a second operational database. MySQL is the single source of truth for hostel business data. Supabase stores identities, uploaded files, and realtime notification delivery metadata only.

## 3. Roles and Permissions

Implement server-enforced role-based access control. Never rely only on hidden frontend buttons.

Roles:

- `super_admin`: manages hostels, admins, permissions, settings, and audit logs
- `warden`: manages students, rooms, leave, discipline, announcements, and emergencies
- `accountant`: manages invoices, payments, deposits, refunds, and financial reports
- `mess_manager`: manages menus, meal counts, inventory, allergens, and reviews
- `maintenance_staff`: receives and updates assigned maintenance tickets
- `cleaning_staff`: receives room/area cleaning tasks and updates completion proof
- `security_guard`: manages visitor passes, gate movement, and approved leave verification
- `student`: accesses only their own records and permitted shared information
- `parent_guardian`: optional read-only access to consented attendance, leave, fees, and emergency updates

Support one user having multiple staff roles. Add granular permissions and route-level authorization middleware in PHP.

## 4. Core Product Requirements

### Authentication and onboarding

- Email/password login, password reset, email verification, logout, and session restoration
- Optional phone OTP as a later-ready feature
- Student registration with admin approval before hostel access
- Profile completion progress and document checklist
- Nationality options including Nepali, Indian, and Other
- Student data: legal name, preferred name, date of birth, gender, nationality, university ID/USN, course, semester, phone, email, permanent address, guardian contacts, blood group, allergies, dietary preference, emergency contact, admission date, and status
- Upload profile image and admission documents to private Supabase Storage buckets
- Signed URLs for private files; never expose service-role credentials in React

### Student management

- Searchable, sortable, paginated student directory
- Filters by nationality, gender, course, semester, room, status, fee status, and risk flags
- View, create, edit, archive, and export student records according to permission
- Student lifecycle states: applicant, approved, checked_in, active, on_leave, suspended, checked_out, alumni
- Complete activity timeline with room changes, leave, payments, complaints, incidents, and profile updates
- Bulk CSV import with validation preview and downloadable error report
- CSV/PDF exports with permission checks and audit logging

### Room and bed management

- Model buildings, floors, rooms, beds, room types, capacity, gender policy, accessibility, amenities, and maintenance state
- Assign students to beds, not merely room numbers
- Prevent overlapping active bed assignments with database constraints/transactions
- Visual floor and occupancy map with available, occupied, reserved, cleaning, and maintenance states
- Check-in/check-out workflow with condition checklist, key issue/return, meter readings, inventory, photos, deposit, and digital acknowledgement
- Room transfer request with approval, reason, effective date, and complete history
- Smart room suggestion score based on capacity, gender policy, accessibility, course/year preference, quiet-hours preference, sleep schedule, dietary preference, and language preference
- Suggestions must be explainable; admins make the final decision

### Attendance, gate, visitors, and safety

- Daily attendance and night roll call
- Student self check-in using rotating QR code plus optional guard verification
- Anti-replay QR tokens with short expiry; do not treat GPS alone as proof
- Gate entry/exit log linked to approved leave
- Visitor pre-registration, student approval, guard check-in/out, ID type, visit purpose, and overstay alerts
- Emergency roll-call mode showing checked-in, away on approved leave, unknown, and needs-assistance students
- Emergency contacts and one-tap escalation workflow

### Laundry

- Create laundry batches with bag/tag number, item count, special instructions, weight, provider, expected return date, and status
- Status lifecycle: submitted, collected, washing, ready, returned, disputed
- QR/tag lookup for staff handover
- Student laundry history, return confirmation, missing/damaged item dispute, and service rating
- Overdue batch alerts and provider performance statistics

### Mess management

- Weekly menu by date and meal: breakfast, lunch, snacks, and dinner
- Dish ingredients, vegetarian/non-vegetarian/vegan labels, allergens, and nutrition notes
- Menu version history and publish/unpublish workflow
- Students can opt in/out before a configurable cutoff to improve meal forecasting
- Anonymous or named meal rating, comments, and issue tags such as oily, cold, late, insufficient, or excellent
- Prevent duplicate reviews for the same student, date, and meal
- Dashboard for rating trends, meal demand, estimated food waste, and recurring issues
- Optional inventory module with ingredients, stock movement, reorder level, supplier, expiry, and wastage log

### Cleaning and housekeeping

- Cleaning schedule by room and common area
- Students report done/not done with rating and notes
- Staff update assigned tasks and attach before/after proof images
- Reopen unsatisfactory tasks
- Repeated failure escalation and area cleanliness trend report
- Privacy rule: do not require interior room photos unless permitted by hostel policy

### Complaints and maintenance

- Categories: electrical, plumbing, furniture, internet, noise, food, cleaning, security, harassment, and other
- Priority, description, location, attachments, preferred contact method, and anonymous/confidential reporting where legally and institutionally appropriate
- Ticket number and SLA deadline calculated from category and priority
- Status lifecycle: submitted, acknowledged, assigned, in_progress, waiting_for_student, resolved, closed, reopened
- Assignment to staff, internal notes, student-visible updates, resolution proof, satisfaction rating, and escalation
- Duplicate/similar issue detection using normalized category/location/title matching; present suggestions without automatically merging reports
- Public hostel issue board only for non-sensitive common-area incidents, with student upvotes instead of duplicate tickets
- Tamper-evident audit history for status and assignment changes

### Leave applications

- Leave type, destination, reason, departure/return dates, transport details, guardian contact, and attachment
- Approval flow configurable by duration and risk: warden, guardian confirmation, or both
- Status history with comments and notifications
- Approved leave generates a time-limited gate pass QR code
- Guard scan validates the pass through the PHP API and records exit/return
- Late return alerts, extensions, cancellation, and emergency leave workflow

### Medical and wellbeing

- Student can report a health issue, severity, symptoms, medication, allergy warning, assistance needed, and preferred contact
- Emergency cases trigger a clearly separated urgent workflow and configured staff notification
- Restrict medical details to authorized roles and record every access in an audit log
- Store only necessary health information; do not present the system as medical diagnosis software
- Wellness check-in with optional private mood/assistance request
- Emergency accessibility and evacuation assistance flags

### Announcements and communication

- Rich announcements with audience targeting by hostel, building, floor, room, role, course, semester, or individual
- Priority, publish time, expiry, attachments, pinned status, and acknowledgement requirement
- Draft, scheduled, published, expired, and archived states
- Realtime in-app notification center with read/unread state
- Delivery adapter architecture for later email, SMS, and WhatsApp integration
- Announcement analytics: delivered, viewed, and acknowledged

### Fees and accounting

- Fee structures, invoices, due dates, discounts, scholarships, penalties, deposits, payments, refunds, and receipts
- Partial payments and payment allocation
- Payment gateway adapter interface, with a safe mock provider for local development
- Do not store card details
- Student ledger, overdue reminders, printable receipt, and accountant reconciliation report
- All financial mutations use MySQL transactions and immutable audit entries

### Asset, key, and parcel management

- Hostel asset register for furniture, appliances, extinguishers, routers, and room inventory
- Asset QR code, condition, location, warranty, maintenance history, and responsible person
- Key issue/return log and lost-key charge workflow
- Parcel desk: record incoming parcel, optional label photo, student notification, pickup OTP/QR, collector, and timestamp

## 5. Distinctive Product Features

Create a product with a recognizable operational identity, not a generic dashboard clone:

- `Hostel Pulse`: a privacy-aware daily operations score derived from unresolved SLA breaches, occupancy pressure, meal ratings, cleaning failures, and safety exceptions. Show the contributing factors; do not use opaque AI scoring.
- `Quiet Hours Map`: students can report time-limited noise zones; aggregate reports by floor without exposing reporter identity.
- `Resource Booking`: booking for study rooms, sports equipment, guest rooms, washing machines, or common facilities with conflict prevention, capacity, waitlist, and no-show policy.
- `Community Skill Exchange`: opt-in board where residents can offer tutoring, language practice, coding help, or event volunteering. Include moderation and reporting.
- `Lost and Found Match`: structured lost/found posts with category, location, date, color, and private verification question. Suggest possible matches using deterministic fields.
- `Digital Hostel Passport`: a student-facing timeline of onboarding, room assignment, issued assets, leave, clearances, and checkout readiness.
- `Checkout Readiness`: one screen that calculates pending fees, key return, room inspection, laundry disputes, assets, and approvals before final checkout.
- `Fairness Monitor`: room transfers, complaint SLAs, and service quality analytics grouped by building/floor/nationality only when sample sizes are large enough; warn against drawing conclusions from small groups.
- `Offline Action Queue`: allow critical guard/warden actions to be queued when connectivity drops and safely synchronized with idempotency keys when online.
- `Shift Handover`: staff create structured handover notes with unresolved incidents, expected late returns, medical watch items, visitors, and maintenance risks.

Do not claim that these features have never existed anywhere. Make their combination, workflow integration, and visual identity distinctive and thoughtfully implemented.

## 6. Frontend Requirements

Use a single React Router configuration with lazy-loaded route modules.

Recommended structure:

```text
src/
  app/
    router.jsx
    providers.jsx
  assets/
  components/
    ui/
    layout/
    feedback/
  features/
    auth/
    dashboard/
    students/
    rooms/
    attendance/
    visitors/
    mess/
    laundry/
    cleaning/
    complaints/
    leave/
    medical/
    announcements/
    fees/
    assets/
    parcels/
    bookings/
    community/
    reports/
    settings/
  hooks/
  lib/
    apiClient.js
    supabaseClient.js
    validation.js
  styles/
  App.jsx
  main.jsx
```

Frontend rules:

- Responsive desktop, tablet, and mobile layouts
- Collapsible role-aware sidebar, top bar, breadcrumbs, global search, notification center, and profile menu
- Use React Router `Link`/`NavLink`, never internal navigation through plain anchor tags
- Accessible forms, keyboard navigation, visible focus, semantic HTML, sufficient contrast, and reduced-motion support
- Reusable data table with server pagination, sorting, filters, bulk actions, loading, empty, and error states
- Reusable modal/drawer, confirmation dialog, toast, skeleton, status badge, file uploader, date picker wrapper, and error boundary
- Use design tokens with CSS custom properties; support light and dark themes
- Avoid browser `alert`, `prompt`, and `confirm`
- Validate on both client and server; server validation is authoritative
- Use abortable requests and prevent state updates after unmount
- Add route-level code splitting to avoid the current oversized bundle
- No hard-coded user names, hostel contacts, dates, counts, or sample records in production components

Visual direction:

- Calm institutional design rather than a generic neon admin template
- Deep indigo/slate foundation, warm amber for attention, teal for success, red only for danger
- Clear density controls for admin tables and spacious student mobile cards
- Occupancy floor map, timeline components, and status-driven visual language
- Meaningful charts only; every chart must have a table/text alternative

## 7. PHP REST API Requirements

Create a versioned API under `/api/v1`.

Recommended backend structure:

```text
server/
  public/
    index.php
  src/
    Config/
    Controllers/
    Middleware/
    Services/
    Repositories/
    Validators/
    Policies/
    Support/
  routes/
    api.php
  database/
    migrations/
    seeders/
  storage/
    logs/
  tests/
  composer.json
  .env.example
```

API rules:

- JSON responses with a consistent envelope: `data`, `meta`, and `error`
- Correct HTTP status codes
- Central exception handling without leaking stack traces or SQL errors
- PDO prepared statements only
- Service/repository separation where it reduces complexity
- Request validation with field-level error messages
- Authentication middleware verifies Supabase JWT and loads local user roles
- Authorization policy for every protected resource
- Rate limits for login-adjacent, upload, complaint, review, QR validation, and public endpoints
- CORS allowlist from environment configuration
- CSRF protection where cookie-based flows are used
- Idempotency keys for payments, QR scans, check-in/out, and offline synchronization
- Database transactions for room assignment, checkout, fees, inventory, and multi-record workflows
- Optimistic concurrency/version field for frequently edited records
- Audit create/update/delete, status changes, exports, medical access, and permission changes
- Never trust role, user ID, room number, or price sent by the frontend

Provide OpenAPI 3 documentation and an importable API collection.

## 8. MySQL Data Model

Create normalized migrations with foreign keys, indexes, unique constraints, timestamps, soft-delete/archive strategy, and seed data. Include at minimum:

- hostels, buildings, floors, rooms, beds
- users, roles, permissions, user_roles, role_permissions
- student_profiles, guardian_profiles, student_guardians, staff_profiles
- documents, emergency_contacts
- bed_assignments, room_transfer_requests, room_inspections, keys, key_transactions
- attendance_sessions, attendance_records, gate_movements
- visitors, visitor_passes
- laundry_batches, laundry_items, laundry_events, laundry_disputes, service_reviews
- menu_days, meals, dishes, meal_dishes, dietary_tags, allergens, meal_opt_ins, mess_reviews
- cleaning_schedules, cleaning_tasks, cleaning_feedback
- complaint_categories, complaints, complaint_assignments, complaint_events, complaint_comments
- leave_requests, leave_approvals, gate_passes
- medical_reports, medical_access_logs, wellness_requests
- announcements, announcement_audiences, announcement_reads
- fee_structures, invoices, invoice_items, payments, payment_allocations, refunds
- assets, asset_assignments, asset_maintenance
- parcels, parcel_pickups
- facilities, facility_bookings, booking_waitlist
- lost_found_posts, lost_found_matches
- community_posts, community_reports
- staff_shifts, shift_handovers
- notifications, notification_preferences
- audit_logs, idempotency_keys, system_settings

Use generated public UUIDs or non-sequential public identifiers at API boundaries while retaining efficient internal keys if desired. Add indexes based on actual list/filter queries.

## 9. Security and Privacy

- Environment variables for every secret; commit only `.env.example`
- Rotate and remove the Firebase configuration from the source after migration
- Supabase anon key may be public, but service-role key must exist only on the server
- Private storage buckets with file type, size, ownership, and malware-scanning integration points
- Prevent IDOR by scoping every student query to the authenticated identity unless staff permission permits broader access
- Passwords are handled only by Supabase Auth
- Escape output and protect against SQL injection, XSS, mass assignment, insecure uploads, and path traversal
- Encrypt especially sensitive fields when appropriate and document key-management assumptions
- Configurable data retention, account deactivation, export, and deletion/anonymization workflows
- Do not expose medical, complaint, guardian, financial, or identity-document data in logs
- Add security headers and a production deployment checklist

## 10. Reports and Dashboards

Admin dashboards must use real aggregate API queries:

- Occupancy and available beds
- Admissions/checkouts
- Students by nationality and status
- Complaint volume, SLA breaches, and resolution time
- Leave and late returns
- Meal ratings, opt-in forecast, and waste trend
- Cleaning completion and repeat failures
- Outstanding fees and collection summary
- Laundry turnaround and disputes
- Visitor and gate exceptions
- Hostel Pulse with explainable contributing factors

Student dashboard:

- Current room/bed and roommates' privacy-safe display
- Today's menu and opt-in cutoff
- Laundry status
- Active complaints
- Leave status and gate pass
- Fee balance
- Latest targeted announcements
- Upcoming bookings
- Checkout readiness where applicable

## 11. Testing and Quality

- Frontend unit/component tests for validation, authorization rendering, and critical workflows
- PHP unit tests and API integration tests
- MySQL migration and constraint tests
- End-to-end tests for login, student approval, bed assignment, complaint lifecycle, leave/gate pass, fee payment, and checkout
- Permission matrix tests proving students cannot access other students' records
- Upload security tests and API validation tests
- ESLint and formatter with zero errors
- Production build must succeed
- Include useful demo seed accounts for every role without embedding passwords in source code

## 12. Required Deliverables

Deliver working code, not only explanations:

1. Refactored React frontend and responsive CSS.
2. Supabase client setup, SQL/policy instructions needed only for Auth/Storage/Realtime support, and bucket setup.
3. PHP REST API with Composer configuration.
4. MySQL migrations, seeders, indexes, and sample data.
5. `.env.example` files for frontend and backend.
6. OpenAPI documentation.
7. Tests and commands to run them.
8. A rewritten README with architecture diagram, setup steps, role accounts, local development, production deployment, backup, and troubleshooting.
9. Migration notes describing which existing files were reused, renamed, or removed.
10. No empty components, fake buttons, TODO backend calls, console-only submissions, or hard-coded dashboard statistics.

## 13. Implementation Order

Implement in reviewable phases while keeping the application runnable:

1. Audit and normalize the existing React structure.
2. Add environment handling, Supabase Auth, session provider, and role-aware routing.
3. Build PHP API foundation, JWT verification, MySQL connection, migrations, and seeders.
4. Implement users, roles, student profiles, rooms, beds, and assignments.
5. Implement complaints, leave, attendance/gate, and announcements.
6. Implement mess, laundry, cleaning, medical, and fees.
7. Implement assets, parcels, bookings, community, lost/found, Hostel Pulse, and checkout readiness.
8. Add reports, realtime notifications, accessibility improvements, tests, documentation, and deployment configuration.

After every phase, run lint, tests, and production build. Fix failures before continuing.

## 14. Acceptance Criteria

The project is complete only when:

- A new user can register through Supabase, be approved, receive a local MySQL profile, and access the correct role dashboard.
- Authorization is enforced in PHP and tested.
- Admins can assign a student to an available bed without creating conflicting assignments.
- Every listed core module performs real CRUD through the PHP API and MySQL.
- Uploads use private Supabase Storage with authorized access.
- Notifications update in realtime without making Supabase the business database.
- Mobile navigation and essential workflows work at 320px width.
- Loading, empty, validation, permission-denied, network-error, and success states are implemented.
- Lint, tests, and production build pass.
- No Firebase dependency or credential remains.
- README setup works on a clean machine.

Begin by auditing the repository and presenting a concise migration map. Then implement the system phase by phase. Make reasonable engineering decisions without repeatedly asking for confirmation, but document important assumptions.
