-- Migration: Leave requests and gate passes
-- Run on MySQL 8+

CREATE TABLE IF NOT EXISTS leave_requests (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  request_number VARCHAR(50) NOT NULL UNIQUE,
  student_id BIGINT UNSIGNED NOT NULL,
  leave_from_date DATE NOT NULL,
  leave_to_date DATE NOT NULL,
  reason TEXT NOT NULL,
  destination VARCHAR(255) DEFAULT NULL,
  contact_number VARCHAR(32) DEFAULT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  approved_by BIGINT UNSIGNED DEFAULT NULL,
  approved_at DATETIME DEFAULT NULL,
  rejection_reason TEXT DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_student (student_id),
  INDEX idx_status (status),
  INDEX idx_dates (leave_from_date, leave_to_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS leave_approvals (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  leave_request_id BIGINT UNSIGNED NOT NULL,
  approval_level TINYINT UNSIGNED NOT NULL,
  approved_by BIGINT UNSIGNED NOT NULL,
  approval_status VARCHAR(50) NOT NULL,
  approval_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  comments TEXT DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (leave_request_id) REFERENCES leave_requests(id) ON DELETE CASCADE,
  FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_leave_request (leave_request_id),
  INDEX idx_approval_level (approval_level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS gate_passes (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  pass_code VARCHAR(50) NOT NULL UNIQUE,
  student_id BIGINT UNSIGNED NOT NULL,
  hostel_id BIGINT UNSIGNED NOT NULL,
  pass_type VARCHAR(50) NOT NULL,
  valid_from DATE NOT NULL,
  valid_until DATE DEFAULT NULL,
  reason VARCHAR(255) DEFAULT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  issued_by BIGINT UNSIGNED DEFAULT NULL,
  issued_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  gate_entry_count INT NOT NULL DEFAULT 0,
  last_used_at DATETIME DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (hostel_id) REFERENCES hostels(id) ON DELETE CASCADE,
  FOREIGN KEY (issued_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_student (student_id),
  INDEX idx_active (is_active),
  INDEX idx_valid_dates (valid_from, valid_until)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_leave_request_dates ON leave_requests(leave_from_date, leave_to_date);
CREATE INDEX idx_gate_pass_student ON gate_passes(student_id, is_active);
