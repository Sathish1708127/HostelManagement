-- Migration: Create users, roles, permissions, role_permissions, user_roles
-- Run on MySQL 8+

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  supabase_id VARCHAR(255) DEFAULT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  display_name VARCHAR(255) DEFAULT NULL,
  phone VARCHAR(32) DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS roles (
  id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS permissions (
  id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL UNIQUE,
  description TEXT DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id SMALLINT UNSIGNED NOT NULL,
  permission_id SMALLINT UNSIGNED NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_roles (
  user_id BIGINT UNSIGNED NOT NULL,
  role_id SMALLINT UNSIGNED NOT NULL,
  assigned_by BIGINT UNSIGNED DEFAULT NULL,
  assigned_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed some common roles (idempotent)
INSERT INTO roles (name, description)
SELECT * FROM (SELECT 'super_admin' AS name, 'Full system administrator' AS description) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name='super_admin');

INSERT INTO roles (name, description)
SELECT * FROM (SELECT 'warden' AS name, 'Warden role' AS description) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name='warden');

INSERT INTO roles (name, description)
SELECT * FROM (SELECT 'student' AS name, 'Student role' AS description) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name='student');

INSERT INTO roles (name, description)
SELECT role_name, role_description
FROM (
  SELECT 'accountant' role_name, 'Fees and accounting manager' role_description
  UNION ALL SELECT 'mess_manager', 'Mess operations manager'
  UNION ALL SELECT 'maintenance_staff', 'Maintenance service staff'
  UNION ALL SELECT 'cleaning_staff', 'Housekeeping staff'
  UNION ALL SELECT 'security_guard', 'Gate and visitor security'
  UNION ALL SELECT 'parent_guardian', 'Consented guardian access'
) role_seed
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE roles.name = role_seed.role_name);
