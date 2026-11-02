-- Migration: Visitors and visitor passes
-- Run on MySQL 8+

CREATE TABLE IF NOT EXISTS visitors (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) DEFAULT NULL,
  phone VARCHAR(32) DEFAULT NULL,
  id_proof_type VARCHAR(50) DEFAULT NULL,
  id_proof_number VARCHAR(100) DEFAULT NULL,
  relation_to_student VARCHAR(100) DEFAULT NULL,
  company_name VARCHAR(255) DEFAULT NULL,
  address TEXT DEFAULT NULL,
  is_blocked BOOLEAN NOT NULL DEFAULT FALSE,
  blocked_reason TEXT DEFAULT NULL,
  blocked_by BIGINT UNSIGNED DEFAULT NULL,
  blocked_at DATETIME DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (blocked_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_blocked (is_blocked),
  INDEX idx_phone (phone),
  INDEX idx_name (full_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS visitor_passes (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  pass_code VARCHAR(50) NOT NULL UNIQUE,
  visitor_id BIGINT UNSIGNED NOT NULL,
  student_id BIGINT UNSIGNED NOT NULL,
  hostel_id BIGINT UNSIGNED NOT NULL,
  visit_date DATE NOT NULL,
  visit_start_time TIME NOT NULL,
  visit_end_time TIME DEFAULT NULL,
  purpose VARCHAR(255) DEFAULT NULL,
  pass_status VARCHAR(50) NOT NULL DEFAULT 'active',
  approved_by BIGINT UNSIGNED DEFAULT NULL,
  approved_at DATETIME DEFAULT NULL,
  checked_in_at DATETIME DEFAULT NULL,
  checked_in_by BIGINT UNSIGNED DEFAULT NULL,
  checked_out_at DATETIME DEFAULT NULL,
  checked_out_by BIGINT UNSIGNED DEFAULT NULL,
  remarks TEXT DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (visitor_id) REFERENCES visitors(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (hostel_id) REFERENCES hostels(id) ON DELETE CASCADE,
  FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (checked_in_by) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (checked_out_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_student_date (student_id, visit_date),
  INDEX idx_pass_status (pass_status),
  INDEX idx_hostel (hostel_id),
  INDEX idx_visitor_date (visitor_id, visit_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_visitor_passes_pass_code ON visitor_passes(pass_code);
CREATE INDEX idx_visitor_passes_checked IN ON visitor_passes(checked_in_at);
