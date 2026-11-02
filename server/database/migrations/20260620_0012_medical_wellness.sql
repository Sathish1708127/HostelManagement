-- Migration: Medical reports and wellness requests
-- Run on MySQL 8+

CREATE TABLE IF NOT EXISTS medical_reports (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  report_number VARCHAR(50) NOT NULL UNIQUE,
  student_id BIGINT UNSIGNED NOT NULL,
  medical_officer_id BIGINT UNSIGNED NOT NULL,
  visit_date DATE NOT NULL,
  visit_time TIME DEFAULT NULL,
  complaint VARCHAR(255) DEFAULT NULL,
  diagnosis TEXT DEFAULT NULL,
  treatment_prescribed TEXT DEFAULT NULL,
  medicines TEXT DEFAULT NULL,
  follow_up_required BOOLEAN NOT NULL DEFAULT FALSE,
  follow_up_date DATE DEFAULT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'completed',
  notes TEXT DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (medical_officer_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_student (student_id),
  INDEX idx_visit_date (visit_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS medical_access_logs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  medical_report_id BIGINT UNSIGNED NOT NULL,
  accessed_by BIGINT UNSIGNED NOT NULL,
  access_type VARCHAR(50) NOT NULL,
  access_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  purpose TEXT DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (medical_report_id) REFERENCES medical_reports(id) ON DELETE CASCADE,
  FOREIGN KEY (accessed_by) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_report (medical_report_id),
  INDEX idx_access_date (access_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS wellness_requests (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  request_number VARCHAR(50) NOT NULL UNIQUE,
  student_id BIGINT UNSIGNED NOT NULL,
  request_type VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  assigned_to BIGINT UNSIGNED DEFAULT NULL,
  assigned_at DATETIME DEFAULT NULL,
  completed_at DATETIME DEFAULT NULL,
  completed_by BIGINT UNSIGNED DEFAULT NULL,
  feedback TEXT DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (completed_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_student (student_id),
  INDEX idx_status (status),
  INDEX idx_request_type (request_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_medical_reports_officer ON medical_reports(medical_officer_id, visit_date);
