-- Migration: Staff shifts and handovers
-- Run on MySQL 8+

CREATE TABLE IF NOT EXISTS staff_shifts (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  shift_code VARCHAR(50) NOT NULL,
  hostel_id BIGINT UNSIGNED NOT NULL,
  staff_id BIGINT UNSIGNED NOT NULL,
  shift_type VARCHAR(50) NOT NULL,
  shift_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location VARCHAR(255) DEFAULT NULL,
  assigned_by BIGINT UNSIGNED DEFAULT NULL,
  assigned_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) NOT NULL DEFAULT 'scheduled',
  check_in_time DATETIME DEFAULT NULL,
  check_out_time DATETIME DEFAULT NULL,
  hours_worked DECIMAL(5, 2) DEFAULT NULL,
  notes TEXT DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (hostel_id) REFERENCES hostels(id) ON DELETE CASCADE,
  FOREIGN KEY (staff_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE KEY unique_shift (staff_id, shift_date, shift_type),
  INDEX idx_status (status),
  INDEX idx_shift_date (shift_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS shift_handovers (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  from_shift_id BIGINT UNSIGNED NOT NULL,
  to_shift_id BIGINT UNSIGNED NOT NULL,
  handover_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  from_staff_id BIGINT UNSIGNED NOT NULL,
  to_staff_id BIGINT UNSIGNED NOT NULL,
  items_handed_over TEXT DEFAULT NULL,
  amount_cash DECIMAL(12, 2) DEFAULT NULL,
  keys_handed_over TEXT DEFAULT NULL,
  documents_handed_over TEXT DEFAULT NULL,
  issues_noted TEXT DEFAULT NULL,
  from_staff_signature_path VARCHAR(500) DEFAULT NULL,
  to_staff_signature_path VARCHAR(500) DEFAULT NULL,
  handover_status VARCHAR(50) NOT NULL DEFAULT 'completed',
  verified_by BIGINT UNSIGNED DEFAULT NULL,
  verified_at DATETIME DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (from_shift_id) REFERENCES staff_shifts(id) ON DELETE CASCADE,
  FOREIGN KEY (to_shift_id) REFERENCES staff_shifts(id) ON DELETE CASCADE,
  FOREIGN KEY (from_staff_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (to_staff_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_handover_time (handover_time),
  INDEX idx_status (handover_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_staff_shifts_code ON staff_shifts(shift_code);
CREATE INDEX idx_staff_shifts_staff ON staff_shifts(staff_id, shift_date);
