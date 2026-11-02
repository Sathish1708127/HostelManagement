# Database setup

Prerequisites: MySQL 8.0.13+, PHP 8.2+, and Composer.

1. Create the database once:

   ```sql
   CREATE DATABASE hostel_pulse CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. Copy `server/.env.example` to `server/.env` and set the database credentials.
3. From `server`, install PHP dependencies with `composer install`.
4. Apply every migration in order:

   ```bash
   php database/migrate.php
   ```

5. Load sample data for local development:

   ```bash
   mysql -u root -p hostel_pulse < database/seeders/20260614_demo_hostel.sql
   ```

The migration runner tracks completed files in `schema_migrations`, making repeated runs safe. Do not edit an applied migration; create a new timestamped SQL migration instead.
