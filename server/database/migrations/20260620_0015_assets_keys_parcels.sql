-- Migration: Assets, keys, and parcels
-- Run on MySQL 8+

CREATE TABLE IF NOT EXISTS assets (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  asset_code VARCHAR(50) NOT NULL UNIQUE,
  asset_name VARCHAR(255) NOT NULL,
  asset_category VARCHAR(100) NOT NULL,
  description TEXT DEFAULT NULL,
  purchase_date DATE DEFAULT NULL,
  purchase_cost DECIMAL(12, 2) DEFAULT NULL,
  warranty_end_date DATE DEFAULT NULL,
  depreciation_rate DECIMAL(5, 2) DEFAULT NULL,
  current_value DECIMAL(12, 2) DEFAULT NULL,
  location VARCHAR(255) DEFAULT NULL,
  condition_status VARCHAR(50) DEFAULT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (asset_category),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS asset_assignments (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  asset_id BIGINT UNSIGNED NOT NULL,
  assigned_to BIGINT UNSIGNED NOT NULL,
  assigned_by BIGINT UNSIGNED DEFAULT NULL,
  assignment_date DATE NOT NULL,
  return_date DATE DEFAULT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  notes TEXT DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_assigned_to (assigned_to),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS asset_maintenance (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  asset_id BIGINT UNSIGNED NOT NULL,
  maintenance_date DATE NOT NULL,
  maintenance_type VARCHAR(50) NOT NULL,
  performed_by BIGINT UNSIGNED DEFAULT NULL,
  cost DECIMAL(12, 2) DEFAULT NULL,
  description TEXT DEFAULT NULL,
  next_maintenance_date DATE DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE,
  FOREIGN KEY (performed_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_asset (asset_id),
  INDEX idx_maintenance_date (maintenance_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS parcels (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  tracking_number VARCHAR(100) NOT NULL UNIQUE,
  student_id BIGINT UNSIGNED NOT NULL,
  hostel_id BIGINT UNSIGNED NOT NULL,
  parcel_description VARCHAR(255) NOT NULL,
  sender_name VARCHAR(255) DEFAULT NULL,
  sender_contact VARCHAR(32) DEFAULT NULL,
  received_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  received_by BIGINT UNSIGNED DEFAULT NULL,
  parcel_weight DECIMAL(8, 2) DEFAULT NULL,
  parcel_dimensions VARCHAR(100) DEFAULT NULL,
  storage_location VARCHAR(255) DEFAULT NULL,
  special_handling TEXT DEFAULT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'received',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (hostel_id) REFERENCES hostels(id) ON DELETE CASCADE,
  FOREIGN KEY (received_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_student (student_id),
  INDEX idx_status (status),
  INDEX idx_received_date (received_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS parcel_pickups (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  parcel_id BIGINT UNSIGNED NOT NULL,
  picked_up_by BIGINT UNSIGNED NOT NULL,
  picked_up_date DATETIME NOT NULL,
  verified_by BIGINT UNSIGNED DEFAULT NULL,
  signature_path VARCHAR(500) DEFAULT NULL,
  notes TEXT DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parcel_id) REFERENCES parcels(id) ON DELETE CASCADE,
  FOREIGN KEY (picked_up_by) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE KEY unique_pickup (parcel_id),
  INDEX idx_pickup_date (picked_up_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_assets_code ON assets(asset_code);
CREATE INDEX idx_asset_assignments_asset ON asset_assignments(asset_id, is_active);
CREATE INDEX idx_parcels_tracking ON parcels(tracking_number);
