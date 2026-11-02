-- Migration: Cleaning schedules and tasks
-- Run on MySQL 8+

CREATE TABLE IF NOT EXISTS cleaning_schedules (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  hostel_id BIGINT UNSIGNED NOT NULL,
  area_name VARCHAR(255) NOT NULL,
  frequency VARCHAR(50) NOT NULL,
  day_of_week TINYINT UNSIGNED DEFAULT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  responsible_person_id BIGINT UNSIGNED DEFAULT NULL,
  priority TINYINT UNSIGNED NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (hostel_id) REFERENCES hostels(id) ON DELETE CASCADE,
  FOREIGN KEY (responsible_person_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_active (is_active),
  INDEX idx_hostel (hostel_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cleaning_tasks (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  schedule_id BIGINT UNSIGNED NOT NULL,
  task_date DATE NOT NULL,
  assigned_to BIGINT UNSIGNED DEFAULT NULL,
  task_status VARCHAR(50) NOT NULL DEFAULT 'pending',
  completion_time DATETIME DEFAULT NULL,
  completed_by BIGINT UNSIGNED DEFAULT NULL,
  quality_check_status VARCHAR(50) DEFAULT NULL,
  quality_checked_by BIGINT UNSIGNED DEFAULT NULL,
  quality_check_time DATETIME DEFAULT NULL,
  notes TEXT DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (schedule_id) REFERENCES cleaning_schedules(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (completed_by) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (quality_checked_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_task_date (task_date),
  INDEX idx_status (task_status),
  INDEX idx_assigned (assigned_to)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cleaning_feedback (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  task_id BIGINT UNSIGNED NOT NULL,
  feedback_from BIGINT UNSIGNED NOT NULL,
  cleanliness_rating TINYINT UNSIGNED NOT NULL,
  tidiness_rating TINYINT UNSIGNED NOT NULL,
  maintenance_rating TINYINT UNSIGNED NOT NULL,
  overall_rating TINYINT UNSIGNED NOT NULL,
  comments TEXT DEFAULT NULL,
  feedback_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES cleaning_tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (feedback_from) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_feedback (task_id, feedback_from),
  INDEX idx_rating (overall_rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_cleaning_tasks_schedule_date ON cleaning_tasks(schedule_id, task_date);
