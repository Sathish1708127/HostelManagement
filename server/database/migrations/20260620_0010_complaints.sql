-- Migration: Complaint management
-- Run on MySQL 8+

CREATE TABLE IF NOT EXISTS complaint_categories (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  category_name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT DEFAULT NULL,
  priority_level VARCHAR(50) NOT NULL DEFAULT 'medium',
  response_time_hours SMALLINT UNSIGNED DEFAULT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS complaints (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  ticket_number VARCHAR(50) NOT NULL UNIQUE,
  student_id BIGINT UNSIGNED NOT NULL,
  category_id BIGINT UNSIGNED NOT NULL,
  hostel_id BIGINT UNSIGNED DEFAULT NULL,
  room_id BIGINT UNSIGNED DEFAULT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  severity VARCHAR(50) NOT NULL DEFAULT 'medium',
  status VARCHAR(50) NOT NULL DEFAULT 'open',
  complaint_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolved_date DATETIME DEFAULT NULL,
  resolution_notes TEXT DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES complaint_categories(id) ON DELETE RESTRICT,
  FOREIGN KEY (hostel_id) REFERENCES hostels(id) ON DELETE SET NULL,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE SET NULL,
  INDEX idx_status (status),
  INDEX idx_student (student_id),
  INDEX idx_date (complaint_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS complaint_assignments (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  complaint_id BIGINT UNSIGNED NOT NULL,
  assigned_to BIGINT UNSIGNED NOT NULL,
  assigned_by BIGINT UNSIGNED NOT NULL,
  assignment_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  estimated_completion_date DATE DEFAULT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE KEY unique_assignment (complaint_id, assigned_to),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS complaint_events (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  complaint_id BIGINT UNSIGNED NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  event_date DATETIME NOT NULL,
  performed_by BIGINT UNSIGNED DEFAULT NULL,
  notes TEXT DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE,
  FOREIGN KEY (performed_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_complaint (complaint_id),
  INDEX idx_event_type (event_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS complaint_comments (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  complaint_id BIGINT UNSIGNED NOT NULL,
  commented_by BIGINT UNSIGNED NOT NULL,
  comment_text TEXT NOT NULL,
  is_internal BOOLEAN NOT NULL DEFAULT FALSE,
  comment_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE,
  FOREIGN KEY (commented_by) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_complaint (complaint_id),
  INDEX idx_internal (is_internal)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed common complaint categories
INSERT INTO complaint_categories (uuid, category_name, description, priority_level, response_time_hours)
SELECT UUID(), 'maintenance', 'Room and facility maintenance issues', 'high', 24
WHERE NOT EXISTS (SELECT 1 FROM complaint_categories WHERE category_name='maintenance');

INSERT INTO complaint_categories (uuid, category_name, description, priority_level, response_time_hours)
SELECT UUID(), 'cleanliness', 'Cleanliness and hygiene concerns', 'medium', 24
WHERE NOT EXISTS (SELECT 1 FROM complaint_categories WHERE category_name='cleanliness');

INSERT INTO complaint_categories (uuid, category_name, description, priority_level, response_time_hours)
SELECT UUID(), 'noise', 'Noise and disturbance complaints', 'medium', 48
WHERE NOT EXISTS (SELECT 1 FROM complaint_categories WHERE category_name='noise');

INSERT INTO complaint_categories (uuid, category_name, description, priority_level, response_time_hours)
SELECT UUID(), 'safety', 'Safety and security concerns', 'critical', 4
WHERE NOT EXISTS (SELECT 1 FROM complaint_categories WHERE category_name='safety');

INSERT INTO complaint_categories (uuid, category_name, description, priority_level, response_time_hours)
SELECT UUID(), 'amenities', 'Amenities and facilities', 'low', 72
WHERE NOT EXISTS (SELECT 1 FROM complaint_categories WHERE category_name='amenities');
