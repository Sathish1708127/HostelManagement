<?php

namespace App\Support;

class DatabaseSeeder
{
    private static object $db;

    public static function seed(object $db): void
    {
        self::$db = $db;

        // Seed in order of dependencies
        self::seedRoles();
        self::seedHostels();
        self::seedStaff();
        self::seedStudents();
        self::seedGuardians();
        self::seedRooms();
        self::seedRoomAssignments();
        self::seedComplaintCategories();
        self::seedDietaryTags();
        self::seedSystemSettings();

        echo "Database seeding completed successfully!\n";
        echo "Demo accounts created:\n";
        echo "  - super_admin: admin@hostel.local / password123\n";
        echo "  - Wardens: warden1@hostel.local / password123\n";
        echo "  - Students: student1-15@college.local / password123\n";
    }

    private static function seedRoles(): void
    {
        $stmt = self::$db->prepare("
            INSERT IGNORE INTO roles (id, name, description, permissions, created_at) VALUES
            (1, 'super_admin', 'Super Administrator with full access', 
             '[\"*\"]', NOW()),
            (2, 'warden', 'Hostel Warden - manages hostel operations', 
             '[\"manage_hostel\", \"approve_leave\", \"manage_staff\"]', NOW()),
            (3, 'accountant', 'Accountant - manages finances', 
             '[\"view_fees\", \"create_invoice\", \"process_payment\"]', NOW()),
            (4, 'mess_manager', 'Mess Manager - manages dining', 
             '[\"manage_menu\", \"view_mess_reviews\"]', NOW()),
            (5, 'cleaning_staff', 'Cleaning Staff - reports cleaning tasks', 
             '[\"report_cleaning\", \"view_schedule\"]', NOW()),
            (6, 'security_guard', 'Security Guard - gate management', 
             '[\"scan_qr\", \"log_entry_exit\"]', NOW()),
            (7, 'maintenance_staff', 'Maintenance Staff - handles repairs', 
             '[\"report_maintenance\", \"view_requests\"]', NOW()),
            (8, 'student', 'Student - standard user', 
             '[\"view_own_profile\", \"apply_leave\", \"submit_complaint\"]', NOW())
        ");
        $stmt->execute();
    }

    private static function seedHostels(): void
    {
        $hostels = [
            ['name' => 'North Wing', 'city' => 'Delhi', 'capacity' => 120],
            ['name' => 'South Wing', 'city' => 'Delhi', 'capacity' => 100],
            ['name' => 'East Tower', 'city' => 'Delhi', 'capacity' => 80],
        ];

        foreach ($hostels as $hostel) {
            $stmt = self::$db->prepare("
                INSERT IGNORE INTO hostels 
                (uuid, name, city, capacity, status, created_at) 
                VALUES (?, ?, ?, ?, 'active', NOW())
            ");
            $stmt->execute([bin2hex(random_bytes(18)), $hostel['name'], $hostel['city'], $hostel['capacity']]);
        }
    }

    private static function seedStaff(): void
    {
        $roles = [
            ['email' => 'warden1@hostel.local', 'role_id' => 2],
            ['email' => 'accountant1@hostel.local', 'role_id' => 3],
            ['email' => 'mess_manager1@hostel.local', 'role_id' => 4],
            ['email' => 'guard1@hostel.local', 'role_id' => 6],
            ['email' => 'guard2@hostel.local', 'role_id' => 6],
            ['email' => 'cleaning1@hostel.local', 'role_id' => 5],
            ['email' => 'maintenance1@hostel.local', 'role_id' => 7],
        ];

        foreach ($roles as $staff) {
            $stmt = self::$db->prepare("
                INSERT IGNORE INTO users 
                (uuid, email, name, phone, role_id, password_hash, email_verified_at, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
            ");
            $hashedPassword = password_hash('password123', PASSWORD_BCRYPT);
            $name = str_replace(['@hostel.local', '1'], '', $staff['email']);
            
            $stmt->execute([
                bin2hex(random_bytes(18)),
                $staff['email'],
                ucfirst($name),
                '91' . str_pad((string) rand(6000000000, 9999999999), 10, '0'),
                $staff['role_id'],
                $hashedPassword,
            ]);
        }
    }

    private static function seedStudents(): void
    {
        for ($i = 1; $i <= 15; $i++) {
            $stmt = self::$db->prepare("
                INSERT IGNORE INTO users 
                (uuid, email, name, phone, roll_number, role_id, password_hash, email_verified_at, created_at) 
                VALUES (?, ?, ?, ?, ?, 8, ?, NOW(), NOW())
            ");
            
            $email = 'student' . $i . '@college.local';
            $name = 'Student ' . $i;
            $rollNumber = '2024' . str_pad((string) $i, 5, '0', STR_PAD_LEFT);
            $phone = '91' . str_pad((string) (6000000000 + $i), 10, '0');
            $hashedPassword = password_hash('password123', PASSWORD_BCRYPT);
            
            $stmt->execute([
                bin2hex(random_bytes(18)),
                $email,
                $name,
                $phone,
                $rollNumber,
                $hashedPassword,
            ]);
        }
    }

    private static function seedGuardians(): void
    {
        $stmt = self::$db->prepare("
            SELECT id FROM users WHERE role_id = 8 LIMIT 10
        ");
        $stmt->execute();
        $students = $stmt->fetchAll();

        foreach ($students as $student) {
            $guardianStmt = self::$db->prepare("
                INSERT IGNORE INTO guardian_profiles 
                (user_id, full_name, phone, email, relationship, address, created_at) 
                VALUES (?, ?, ?, ?, 'Father', ?, NOW())
            ");
            
            $guardianStmt->execute([
                $student['id'],
                'Guardian of Student ' . $student['id'],
                '91' . str_pad((string) (9000000000 + $student['id']), 10, '0'),
                'guardian' . $student['id'] . '@example.com',
                '123 Example St, City',
            ]);
        }
    }

    private static function seedRooms(): void
    {
        $stmt = self::$db->prepare("SELECT id FROM hostels LIMIT 1");
        $stmt->execute();
        $hostel = $stmt->fetch();

        for ($floor = 1; $floor <= 3; $floor++) {
            for ($room = 1; $room <= 10; $room++) {
                $roomStmt = self::$db->prepare("
                    INSERT IGNORE INTO rooms 
                    (hostel_id, room_number, floor, capacity, status, created_at) 
                    VALUES (?, ?, ?, 4, 'available', NOW())
                ");
                
                $roomStmt->execute([
                    $hostel['id'],
                    $floor . sprintf('%02d', $room),
                    $floor,
                ]);
            }
        }
    }

    private static function seedRoomAssignments(): void
    {
        $stmt = self::$db->prepare("
            SELECT id FROM users WHERE role_id = 8 LIMIT 10
        ");
        $stmt->execute();
        $students = $stmt->fetchAll();

        $roomStmt = self::$db->prepare("SELECT id FROM rooms LIMIT 10");
        $roomStmt->execute();
        $rooms = $roomStmt->fetchAll();

        foreach ($students as $index => $student) {
            if (isset($rooms[$index])) {
                $assignStmt = self::$db->prepare("
                    INSERT IGNORE INTO room_assignments 
                    (student_id, room_id, assigned_on, status, created_at) 
                    VALUES (?, ?, NOW(), 'active', NOW())
                ");
                
                $assignStmt->execute([
                    $student['id'],
                    $rooms[$index]['id'],
                ]);
            }
        }
    }

    private static function seedComplaintCategories(): void
    {
        $categories = [
            'Maintenance Issue',
            'Cleanliness Concern',
            'Noise Complaint',
            'Facility Damage',
            'Mess Food Quality',
            'Security Issue',
            'Behavioral Complaint',
            'Service Quality',
        ];

        foreach ($categories as $category) {
            $stmt = self::$db->prepare("
                INSERT IGNORE INTO complaint_categories 
                (name, description, created_at) 
                VALUES (?, ?, NOW())
            ");
            $stmt->execute([$category, 'Complaint category for ' . $category]);
        }
    }

    private static function seedDietaryTags(): void
    {
        $tags = [
            ['name' => 'Vegetarian', 'description' => 'No meat products'],
            ['name' => 'Vegan', 'description' => 'No animal products'],
            ['name' => 'Gluten-Free', 'description' => 'No gluten products'],
            ['name' => 'Dairy-Free', 'description' => 'No dairy products'],
            ['name' => 'Halal', 'description' => 'Halal meat only'],
        ];

        foreach ($tags as $tag) {
            $stmt = self::$db->prepare("
                INSERT IGNORE INTO dietary_tags 
                (name, description, created_at) 
                VALUES (?, ?, NOW())
            ");
            $stmt->execute($tag);
        }
    }

    private static function seedSystemSettings(): void
    {
        $settings = [
            ['key' => 'hostel_name', 'value' => 'Central Hostel Management System'],
            ['key' => 'max_leave_days_per_semester', 'value' => '30'],
            ['key' => 'checkout_deadline_days', 'value' => '10'],
            ['key' => 'complaint_resolution_sla', 'value' => '7'],
            ['key' => 'late_checkout_fine', 'value' => '500'],
            ['key' => 'room_damage_deposit', 'value' => '2000'],
        ];

        foreach ($settings as $setting) {
            $stmt = self::$db->prepare("
                INSERT IGNORE INTO system_settings 
                (setting_key, setting_value, created_at) 
                VALUES (?, ?, NOW())
            ");
            $stmt->execute($setting);
        }
    }
}
