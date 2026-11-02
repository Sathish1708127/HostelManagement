-- Migration: Notifications, audit logs, and system settings
-- Run on MySQL 8+

CREATE TABLE IF NOT EXISTS notifications (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  user_id BIGINT UNSIGNED NOT NULL,
  notification_type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  icon_url VARCHAR(500) DEFAULT NULL,
  action_url VARCHAR(500) DEFAULT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  read_at DATETIME DEFAULT NULL,
  sent_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_read (user_id, is_read),
  INDEX idx_type (notification_type),
  INDEX idx_sent_at (sent_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS notification_preferences (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL UNIQUE,
  email_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  sms_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  push_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  announcement_emails BOOLEAN NOT NULL DEFAULT TRUE,
  complaint_updates BOOLEAN NOT NULL DEFAULT TRUE,
  leave_approvals BOOLEAN NOT NULL DEFAULT TRUE,
  payment_reminders BOOLEAN NOT NULL DEFAULT TRUE,
  meal_updates BOOLEAN NOT NULL DEFAULT TRUE,
  maintenance_alerts BOOLEAN NOT NULL DEFAULT TRUE,
  quiet_hours_start TIME DEFAULT NULL,
  quiet_hours_end TIME DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  user_id BIGINT UNSIGNED DEFAULT NULL,
  module VARCHAR(100) NOT NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id VARCHAR(100) DEFAULT NULL,
  old_values JSON DEFAULT NULL,
  new_values JSON DEFAULT NULL,
  ip_address VARCHAR(50) DEFAULT NULL,
  user_agent VARCHAR(500) DEFAULT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'success',
  error_message TEXT DEFAULT NULL,
  action_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user (user_id),
  INDEX idx_module_action (module, action),
  INDEX idx_action_date (action_date),
  INDEX idx_entity (entity_type, entity_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS idempotency_keys (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  idempotency_key VARCHAR(255) NOT NULL UNIQUE,
  user_id BIGINT UNSIGNED DEFAULT NULL,
  request_method VARCHAR(10) NOT NULL,
  request_path VARCHAR(500) NOT NULL,
  response_code INT DEFAULT NULL,
  response_body LONGTEXT DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS system_settings (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(255) NOT NULL UNIQUE,
  setting_value TEXT DEFAULT NULL,
  setting_type VARCHAR(50) NOT NULL DEFAULT 'string',
  description TEXT DEFAULT NULL,
  is_editable BOOLEAN NOT NULL DEFAULT TRUE,
  updated_by BIGINT UNSIGNED DEFAULT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_key (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed default system settings
INSERT INTO system_settings (setting_key, setting_type, setting_value, description, is_editable)
SELECT 'hostel_name', 'string', 'Hostel Management System', 'Default hostel name', TRUE
WHERE NOT EXISTS (SELECT 1 FROM system_settings WHERE setting_key='hostel_name');

INSERT INTO system_settings (setting_key, setting_type, setting_value, description, is_editable)
SELECT 'academic_year', 'string', '2024-2025', 'Current academic year', TRUE
WHERE NOT EXISTS (SELECT 1 FROM system_settings WHERE setting_key='academic_year');

INSERT INTO system_settings (setting_key, setting_type, setting_value, description, is_editable)
SELECT 'maintenance_mode', 'boolean', 'false', 'System maintenance mode', TRUE
WHERE NOT EXISTS (SELECT 1 FROM system_settings WHERE setting_key='maintenance_mode');

INSERT INTO system_settings (setting_key, setting_type, setting_value, description, is_editable)
SELECT 'max_login_attempts', 'integer', '5', 'Maximum failed login attempts', TRUE
WHERE NOT EXISTS (SELECT 1 FROM system_settings WHERE setting_key='max_login_attempts');

INSERT INTO system_settings (setting_key, setting_type, setting_value, description, is_editable)
SELECT 'session_timeout_minutes', 'integer', '30', 'Session timeout in minutes', TRUE
WHERE NOT EXISTS (SELECT 1 FROM system_settings WHERE setting_key='session_timeout_minutes');

CREATE INDEX idx_notifications_user_date ON notifications(user_id, sent_at);
CREATE INDEX idx_audit_logs_date ON audit_logs(action_date);
