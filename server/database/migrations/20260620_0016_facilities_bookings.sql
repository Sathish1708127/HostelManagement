-- Migration: Facilities and bookings
-- Run on MySQL 8+

CREATE TABLE IF NOT EXISTS facilities (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  facility_code VARCHAR(50) NOT NULL,
  hostel_id BIGINT UNSIGNED NOT NULL,
  facility_name VARCHAR(255) NOT NULL,
  facility_type VARCHAR(100) NOT NULL,
  description TEXT DEFAULT NULL,
  capacity INT DEFAULT NULL,
  location VARCHAR(255) DEFAULT NULL,
  amenities TEXT DEFAULT NULL,
  hourly_rate DECIMAL(10, 2) DEFAULT NULL,
  daily_rate DECIMAL(10, 2) DEFAULT NULL,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  requires_approval BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (hostel_id) REFERENCES hostels(id) ON DELETE CASCADE,
  UNIQUE KEY unique_facility (hostel_id, facility_code),
  INDEX idx_available (is_available)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS facility_bookings (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  booking_number VARCHAR(50) NOT NULL UNIQUE,
  facility_id BIGINT UNSIGNED NOT NULL,
  student_id BIGINT UNSIGNED NOT NULL,
  hostel_id BIGINT UNSIGNED NOT NULL,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  purpose VARCHAR(255) DEFAULT NULL,
  expected_attendees INT DEFAULT NULL,
  booking_status VARCHAR(50) NOT NULL DEFAULT 'pending',
  approved_by BIGINT UNSIGNED DEFAULT NULL,
  approved_at DATETIME DEFAULT NULL,
  rejection_reason TEXT DEFAULT NULL,
  booking_cost DECIMAL(10, 2) DEFAULT NULL,
  payment_status VARCHAR(50) DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (hostel_id) REFERENCES hostels(id) ON DELETE CASCADE,
  FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_facility_date (facility_id, booking_date),
  INDEX idx_status (booking_status),
  INDEX idx_student (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS booking_waitlist (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  facility_id BIGINT UNSIGNED NOT NULL,
  student_id BIGINT UNSIGNED NOT NULL,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  priority_position INT NOT NULL,
  waitlist_status VARCHAR(50) NOT NULL DEFAULT 'active',
  added_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_facility_date (facility_id, booking_date),
  INDEX idx_status (waitlist_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_facility_bookings_date ON facility_bookings(booking_date);
CREATE INDEX idx_facility_name ON facilities(facility_name);
