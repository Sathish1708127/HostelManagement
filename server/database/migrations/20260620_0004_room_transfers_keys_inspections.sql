-- Migration: Room transfers, room inspections, keys, key transactions
-- Run on MySQL 8+

CREATE TABLE IF NOT EXISTS room_transfer_requests (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  student_id BIGINT UNSIGNED NOT NULL,
  from_room_id BIGINT UNSIGNED NOT NULL,
  to_room_id BIGINT UNSIGNED NOT NULL,
  reason TEXT DEFAULT NULL,
  requested_by BIGINT UNSIGNED NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  approved_by BIGINT UNSIGNED DEFAULT NULL,
  approved_at DATETIME DEFAULT NULL,
  rejection_reason TEXT DEFAULT NULL,
  transfer_date DATE DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (from_room_id) REFERENCES rooms(id) ON DELETE RESTRICT,
  FOREIGN KEY (to_room_id) REFERENCES rooms(id) ON DELETE RESTRICT,
  FOREIGN KEY (requested_by) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_student (student_id),
  INDEX idx_status (status),
  INDEX idx_requested_date (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS room_inspections (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  room_id BIGINT UNSIGNED NOT NULL,
  inspection_type VARCHAR(50) NOT NULL,
  inspected_by BIGINT UNSIGNED NOT NULL,
  inspection_date DATE NOT NULL,
  condition_status VARCHAR(50) NOT NULL,
  cleanliness_score TINYINT UNSIGNED DEFAULT NULL,
  damage_score TINYINT UNSIGNED DEFAULT NULL,
  notes TEXT DEFAULT NULL,
  photos_path VARCHAR(500) DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
  FOREIGN KEY (inspected_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_room_date (room_id, inspection_date),
  INDEX idx_condition (condition_status),
  INDEX idx_type (inspection_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS keys (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  key_code VARCHAR(50) NOT NULL UNIQUE,
  key_type VARCHAR(50) NOT NULL,
  room_id BIGINT UNSIGNED DEFAULT NULL,
  is_master BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  current_holder_id BIGINT UNSIGNED DEFAULT NULL,
  issued_to_id BIGINT UNSIGNED DEFAULT NULL,
  issued_date DATETIME DEFAULT NULL,
  replacement_required BOOLEAN NOT NULL DEFAULT FALSE,
  replacement_reason TEXT DEFAULT NULL,
  replacement_date DATETIME DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE SET NULL,
  FOREIGN KEY (current_holder_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (issued_to_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_room (room_id),
  INDEX idx_active (is_active),
  INDEX idx_holder (current_holder_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS key_transactions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  key_id BIGINT UNSIGNED NOT NULL,
  transaction_type VARCHAR(50) NOT NULL,
  from_holder_id BIGINT UNSIGNED DEFAULT NULL,
  to_holder_id BIGINT UNSIGNED DEFAULT NULL,
  handled_by BIGINT UNSIGNED NOT NULL,
  transaction_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  notes TEXT DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (key_id) REFERENCES keys(id) ON DELETE CASCADE,
  FOREIGN KEY (from_holder_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (to_holder_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (handled_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_key (key_id),
  INDEX idx_type (transaction_type),
  INDEX idx_date (transaction_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_room_inspection_type ON room_inspections(room_id, inspection_type);
