-- Migration: Attendance sessions, attendance records, gate movements
-- Run on MySQL 8+

CREATE TABLE IF NOT EXISTS attendance_sessions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  hostel_id BIGINT UNSIGNED NOT NULL,
  session_date DATE NOT NULL,
  session_type VARCHAR(50) NOT NULL DEFAULT 'daily',
  start_time TIME DEFAULT NULL,
  end_time TIME DEFAULT NULL,
  created_by BIGINT UNSIGNED NOT NULL,
  is_finalized BOOLEAN NOT NULL DEFAULT FALSE,
  finalized_at DATETIME DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (hostel_id) REFERENCES hostels(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE KEY unique_session (hostel_id, session_date, session_type),
  INDEX idx_finalized (is_finalized)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS attendance_records (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  session_id BIGINT UNSIGNED NOT NULL,
  student_id BIGINT UNSIGNED NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'absent',
  marked_by BIGINT UNSIGNED DEFAULT NULL,
  mark_time DATETIME DEFAULT NULL,
  remarks TEXT DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_attendance (session_id, student_id),
  FOREIGN KEY (session_id) REFERENCES attendance_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (marked_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_status (status),
  INDEX idx_student_date (student_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS gates (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  hostel_id BIGINT UNSIGNED NOT NULL,
  gate_name VARCHAR(100) NOT NULL,
  gate_code VARCHAR(50) UNIQUE DEFAULT NULL,
  location VARCHAR(255) DEFAULT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  device_sync_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (hostel_id) REFERENCES hostels(id) ON DELETE CASCADE,
  UNIQUE KEY unique_gate_name (hostel_id, gate_name),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS gate_movements (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  user_id BIGINT UNSIGNED NOT NULL,
  gate_id BIGINT UNSIGNED NOT NULL,
  movement_type VARCHAR(50) NOT NULL,
  entry_time DATETIME DEFAULT NULL,
  exit_time DATETIME DEFAULT NULL,
  recorded_by BIGINT UNSIGNED DEFAULT NULL,
  device_id VARCHAR(100) DEFAULT NULL,
  is_manual BOOLEAN NOT NULL DEFAULT FALSE,
  status VARCHAR(50) NOT NULL DEFAULT 'completed',
  remarks TEXT DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (gate_id) REFERENCES gates(id) ON DELETE SET NULL,
  FOREIGN KEY (recorded_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user_time (user_id, entry_time),
  INDEX idx_movement_type (movement_type),
  INDEX idx_date (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS gates (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  hostel_id BIGINT UNSIGNED NOT NULL,
  gate_name VARCHAR(100) NOT NULL,
  gate_code VARCHAR(50) UNIQUE DEFAULT NULL,
  location VARCHAR(255) DEFAULT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  device_sync_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (hostel_id) REFERENCES hostels(id) ON DELETE CASCADE,
  UNIQUE KEY unique_gate_name (hostel_id, gate_name),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_gate_movement_gate ON gate_movements(gate_id, entry_time);
CREATE INDEX idx_attendance_mark_time ON attendance_records(mark_time);
