-- Migration: Mess and meals management
-- Run on MySQL 8+

CREATE TABLE IF NOT EXISTS menu_days (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  menu_date DATE NOT NULL UNIQUE,
  meal_type VARCHAR(50) NOT NULL,
  created_by BIGINT UNSIGNED DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_date (menu_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS meals (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  menu_day_id BIGINT UNSIGNED NOT NULL,
  meal_name VARCHAR(255) NOT NULL,
  description TEXT DEFAULT NULL,
  serving_size VARCHAR(100) DEFAULT NULL,
  cost_per_portion DECIMAL(10, 2) NOT NULL,
  is_vegetarian BOOLEAN NOT NULL DEFAULT FALSE,
  is_vegan BOOLEAN NOT NULL DEFAULT FALSE,
  allergen_info TEXT DEFAULT NULL,
  calories SMALLINT UNSIGNED DEFAULT NULL,
  protein DECIMAL(5, 2) DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (menu_day_id) REFERENCES menu_days(id) ON DELETE CASCADE,
  INDEX idx_menu_day (menu_day_id),
  INDEX idx_vegetarian (is_vegetarian)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS dishes (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  dish_name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT DEFAULT NULL,
  is_vegetarian BOOLEAN NOT NULL DEFAULT FALSE,
  is_vegan BOOLEAN NOT NULL DEFAULT FALSE,
  prep_time_minutes SMALLINT UNSIGNED DEFAULT NULL,
  difficulty_level VARCHAR(50) DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (dish_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS meal_dishes (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  meal_id BIGINT UNSIGNED NOT NULL,
  dish_id BIGINT UNSIGNED NOT NULL,
  quantity DECIMAL(5, 2) NOT NULL DEFAULT 1,
  unit VARCHAR(50) DEFAULT NULL,
  PRIMARY KEY (meal_id, dish_id),
  FOREIGN KEY (meal_id) REFERENCES meals(id) ON DELETE CASCADE,
  FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS dietary_tags (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  tag_name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_name (tag_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS allergens (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  allergen_name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT DEFAULT NULL,
  severity VARCHAR(50) DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_name (allergen_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS meal_opt_ins (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  student_id BIGINT UNSIGNED NOT NULL,
  meal_id BIGINT UNSIGNED NOT NULL,
  opt_in_date DATE NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  special_requests TEXT DEFAULT NULL,
  dietary_restrictions TEXT DEFAULT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_meal_optin (student_id, meal_id, opt_in_date),
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (meal_id) REFERENCES meals(id) ON DELETE CASCADE,
  INDEX idx_student_date (student_id, opt_in_date),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS mess_reviews (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  menu_day_id BIGINT UNSIGNED NOT NULL,
  student_id BIGINT UNSIGNED NOT NULL,
  food_quality_rating TINYINT UNSIGNED NOT NULL,
  portion_size_rating TINYINT UNSIGNED NOT NULL,
  hygiene_rating TINYINT UNSIGNED NOT NULL,
  overall_rating TINYINT UNSIGNED NOT NULL,
  comments TEXT DEFAULT NULL,
  review_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (menu_day_id) REFERENCES menu_days(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_review (menu_day_id, student_id),
  INDEX idx_rating (overall_rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed common dietary tags
INSERT INTO dietary_tags (tag_name, description)
SELECT * FROM (SELECT 'gluten_free' AS tag_name, 'No gluten' AS description) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM dietary_tags WHERE tag_name='gluten_free');

INSERT INTO dietary_tags (tag_name, description)
SELECT * FROM (SELECT 'dairy_free' AS tag_name, 'No dairy products' AS description) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM dietary_tags WHERE tag_name='dairy_free');

INSERT INTO dietary_tags (tag_name, description)
SELECT * FROM (SELECT 'nut_free' AS tag_name, 'No nuts' AS description) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM dietary_tags WHERE tag_name='nut_free');

-- Seed common allergens
INSERT INTO allergens (allergen_name, severity)
SELECT * FROM (SELECT 'peanuts' AS allergen_name, 'high' AS severity) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM allergens WHERE allergen_name='peanuts');

INSERT INTO allergens (allergen_name, severity)
SELECT * FROM (SELECT 'tree_nuts' AS allergen_name, 'high' AS severity) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM allergens WHERE allergen_name='tree_nuts');

INSERT INTO allergens (allergen_name, severity)
SELECT * FROM (SELECT 'shellfish' AS allergen_name, 'high' AS severity) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM allergens WHERE allergen_name='shellfish');
