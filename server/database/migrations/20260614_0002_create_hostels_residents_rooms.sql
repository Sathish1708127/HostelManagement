-- Core operational model for hostels, residents, rooms, beds, and assignments.
-- MySQL 8.0.13+ is required for generated-column uniqueness.

CREATE TABLE hostels (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL,
  code VARCHAR(30) NOT NULL UNIQUE,
  timezone VARCHAR(60) NOT NULL DEFAULT 'Asia/Kolkata',
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE buildings (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  hostel_id BIGINT UNSIGNED NOT NULL,
  uuid CHAR(36) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  code VARCHAR(30) NOT NULL,
  gender_policy ENUM('male', 'female', 'mixed', 'any') NOT NULL DEFAULT 'any',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY buildings_hostel_code_unique (hostel_id, code),
  CONSTRAINT buildings_hostel_fk FOREIGN KEY (hostel_id) REFERENCES hostels(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE floors (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  building_id BIGINT UNSIGNED NOT NULL,
  uuid CHAR(36) NOT NULL UNIQUE,
  name VARCHAR(80) NOT NULL,
  floor_number SMALLINT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY floors_building_number_unique (building_id, floor_number),
  CONSTRAINT floors_building_fk FOREIGN KEY (building_id) REFERENCES buildings(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE rooms (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  floor_id BIGINT UNSIGNED NOT NULL,
  uuid CHAR(36) NOT NULL UNIQUE,
  room_number VARCHAR(30) NOT NULL,
  room_type ENUM('single', 'double', 'triple', 'quad', 'accessible') NOT NULL,
  capacity TINYINT UNSIGNED NOT NULL,
  gender_policy ENUM('male', 'female', 'mixed', 'any') NOT NULL DEFAULT 'any',
  accessibility_features JSON DEFAULT NULL,
  amenities JSON DEFAULT NULL,
  status ENUM('available', 'occupied', 'reserved', 'cleaning', 'maintenance', 'inactive') NOT NULL DEFAULT 'available',
  version INT UNSIGNED NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME DEFAULT NULL,
  UNIQUE KEY rooms_floor_number_unique (floor_id, room_number),
  KEY rooms_status_idx (status),
  CONSTRAINT rooms_floor_fk FOREIGN KEY (floor_id) REFERENCES floors(id),
  CONSTRAINT rooms_capacity_check CHECK (capacity BETWEEN 1 AND 8)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE beds (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  room_id BIGINT UNSIGNED NOT NULL,
  uuid CHAR(36) NOT NULL UNIQUE,
  bed_number VARCHAR(20) NOT NULL,
  status ENUM('available', 'occupied', 'reserved', 'cleaning', 'maintenance', 'inactive') NOT NULL DEFAULT 'available',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY beds_room_number_unique (room_id, bed_number),
  KEY beds_status_idx (status),
  CONSTRAINT beds_room_fk FOREIGN KEY (room_id) REFERENCES rooms(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE student_profiles (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  hostel_id BIGINT UNSIGNED NOT NULL,
  uuid CHAR(36) NOT NULL UNIQUE,
  university_id VARCHAR(80) NOT NULL,
  legal_name VARCHAR(180) NOT NULL,
  preferred_name VARCHAR(120) DEFAULT NULL,
  date_of_birth DATE DEFAULT NULL,
  gender ENUM('male', 'female', 'non_binary', 'prefer_not_to_say', 'other') DEFAULT NULL,
  nationality ENUM('Nepali', 'Indian', 'Other') NOT NULL,
  course VARCHAR(150) DEFAULT NULL,
  semester VARCHAR(40) DEFAULT NULL,
  phone VARCHAR(32) DEFAULT NULL,
  permanent_address TEXT DEFAULT NULL,
  blood_group VARCHAR(10) DEFAULT NULL,
  dietary_preference VARCHAR(80) DEFAULT NULL,
  admission_date DATE DEFAULT NULL,
  status ENUM('applicant', 'approved', 'checked_in', 'active', 'on_leave', 'suspended', 'checked_out', 'alumni') NOT NULL DEFAULT 'applicant',
  profile_completion TINYINT UNSIGNED NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME DEFAULT NULL,
  UNIQUE KEY students_hostel_university_unique (hostel_id, university_id),
  UNIQUE KEY students_user_unique (user_id),
  KEY students_status_idx (hostel_id, status),
  KEY students_nationality_idx (hostel_id, nationality),
  CONSTRAINT students_user_fk FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT students_hostel_fk FOREIGN KEY (hostel_id) REFERENCES hostels(id),
  CONSTRAINT students_completion_check CHECK (profile_completion BETWEEN 0 AND 100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE bed_assignments (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid CHAR(36) NOT NULL UNIQUE,
  student_profile_id BIGINT UNSIGNED NOT NULL,
  bed_id BIGINT UNSIGNED NOT NULL,
  assigned_by BIGINT UNSIGNED NOT NULL,
  starts_at DATETIME NOT NULL,
  ends_at DATETIME DEFAULT NULL,
  ended_by BIGINT UNSIGNED DEFAULT NULL,
  end_reason VARCHAR(255) DEFAULT NULL,
  notes TEXT DEFAULT NULL,
  active_bed_id BIGINT UNSIGNED GENERATED ALWAYS AS (
    CASE WHEN ends_at IS NULL THEN bed_id ELSE NULL END
  ) STORED,
  active_student_id BIGINT UNSIGNED GENERATED ALWAYS AS (
    CASE WHEN ends_at IS NULL THEN student_profile_id ELSE NULL END
  ) STORED,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY assignments_active_bed_unique (active_bed_id),
  UNIQUE KEY assignments_active_student_unique (active_student_id),
  KEY assignments_student_history_idx (student_profile_id, starts_at),
  CONSTRAINT assignments_student_fk FOREIGN KEY (student_profile_id) REFERENCES student_profiles(id),
  CONSTRAINT assignments_bed_fk FOREIGN KEY (bed_id) REFERENCES beds(id),
  CONSTRAINT assignments_assigned_by_fk FOREIGN KEY (assigned_by) REFERENCES users(id),
  CONSTRAINT assignments_ended_by_fk FOREIGN KEY (ended_by) REFERENCES users(id),
  CONSTRAINT assignments_dates_check CHECK (ends_at IS NULL OR ends_at > starts_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

