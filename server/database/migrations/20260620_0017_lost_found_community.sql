-- Migration: Lost and found, and community posts
-- Run on MySQL 8+

CREATE TABLE IF NOT EXISTS lost_found_posts (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  post_number VARCHAR(50) NOT NULL UNIQUE,
  posted_by BIGINT UNSIGNED NOT NULL,
  hostel_id BIGINT UNSIGNED NOT NULL,
  item_type VARCHAR(50) NOT NULL,
  item_description TEXT NOT NULL,
  item_color VARCHAR(100) DEFAULT NULL,
  item_value DECIMAL(10, 2) DEFAULT NULL,
  lost_or_found VARCHAR(20) NOT NULL,
  date_occurred DATE NOT NULL,
  location_description VARCHAR(255) DEFAULT NULL,
  photo_paths TEXT DEFAULT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  reward_offered DECIMAL(10, 2) DEFAULT NULL,
  claimed_by BIGINT UNSIGNED DEFAULT NULL,
  claim_date DATETIME DEFAULT NULL,
  verification_status VARCHAR(50) DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (hostel_id) REFERENCES hostels(id) ON DELETE CASCADE,
  FOREIGN KEY (claimed_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_status (status),
  INDEX idx_item_type (item_type),
  INDEX idx_lost_found (lost_or_found)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS lost_found_matches (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  lost_post_id BIGINT UNSIGNED NOT NULL,
  found_post_id BIGINT UNSIGNED NOT NULL,
  matched_by BIGINT UNSIGNED NOT NULL,
  match_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  match_confidence TINYINT UNSIGNED DEFAULT NULL,
  match_status VARCHAR(50) NOT NULL DEFAULT 'pending',
  verified_date DATETIME DEFAULT NULL,
  notes TEXT DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lost_post_id) REFERENCES lost_found_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (found_post_id) REFERENCES lost_found_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (matched_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_status (match_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS community_posts (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  posted_by BIGINT UNSIGNED NOT NULL,
  hostel_id BIGINT UNSIGNED NOT NULL,
  post_title VARCHAR(255) NOT NULL,
  post_content TEXT NOT NULL,
  post_category VARCHAR(100) DEFAULT NULL,
  attachment_paths TEXT DEFAULT NULL,
  is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
  allow_comments BOOLEAN NOT NULL DEFAULT TRUE,
  status VARCHAR(50) NOT NULL DEFAULT 'published',
  view_count INT NOT NULL DEFAULT 0,
  like_count INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (hostel_id) REFERENCES hostels(id) ON DELETE CASCADE,
  INDEX idx_status (status),
  INDEX idx_category (post_category),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS community_reports (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  post_id BIGINT UNSIGNED NOT NULL,
  reported_by BIGINT UNSIGNED NOT NULL,
  reason VARCHAR(100) NOT NULL,
  description TEXT DEFAULT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  reviewed_by BIGINT UNSIGNED DEFAULT NULL,
  reviewed_at DATETIME DEFAULT NULL,
  action_taken VARCHAR(100) DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (reported_by) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_status (status),
  INDEX idx_post (post_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_lost_found_date ON lost_found_posts(date_occurred);
CREATE INDEX idx_community_posts_hostel ON community_posts(hostel_id, created_at);
