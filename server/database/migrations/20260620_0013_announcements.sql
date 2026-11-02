-- Migration: Announcements
-- Run on MySQL 8+

CREATE TABLE IF NOT EXISTS announcements (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  announcement_type VARCHAR(50) NOT NULL DEFAULT 'general',
  priority VARCHAR(50) NOT NULL DEFAULT 'normal',
  author_id BIGINT UNSIGNED NOT NULL,
  publish_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expiry_date DATETIME DEFAULT NULL,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
  attachment_path VARCHAR(500) DEFAULT NULL,
  view_count INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_published (is_published),
  INDEX idx_pinned (is_pinned),
  INDEX idx_publish_date (publish_date),
  INDEX idx_priority (priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS announcement_audiences (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  announcement_id BIGINT UNSIGNED NOT NULL,
  audience_type VARCHAR(50) NOT NULL,
  hostel_id BIGINT UNSIGNED DEFAULT NULL,
  role_id SMALLINT UNSIGNED DEFAULT NULL,
  user_id BIGINT UNSIGNED DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (announcement_id) REFERENCES announcements(id) ON DELETE CASCADE,
  FOREIGN KEY (hostel_id) REFERENCES hostels(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_announcement (announcement_id),
  INDEX idx_audience_type (audience_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS announcement_reads (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  announcement_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  read_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_read (announcement_id, user_id),
  FOREIGN KEY (announcement_id) REFERENCES announcements(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_announcement (announcement_id),
  INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_announcements_expiry ON announcements(expiry_date);
CREATE INDEX idx_announcement_audiences_hostel ON announcement_audiences(hostel_id, audience_type);
