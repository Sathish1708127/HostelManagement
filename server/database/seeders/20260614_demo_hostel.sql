-- Development-only seed. Run after both migrations.

INSERT INTO users (uuid, supabase_id, email, display_name)
VALUES ('00000000-0000-4000-8000-000000000001', 'demo-warden', 'warden@haven.test', 'Aarav Sharma')
ON DUPLICATE KEY UPDATE display_name = VALUES(display_name);

SET @warden_user_id = (SELECT id FROM users WHERE email = 'warden@haven.test');
SET @warden_role_id = (SELECT id FROM roles WHERE name = 'warden');
INSERT IGNORE INTO user_roles (user_id, role_id) VALUES (@warden_user_id, @warden_role_id);

INSERT INTO hostels (uuid, name, code)
VALUES (UUID(), 'Haven North', 'HAVEN-N')
ON DUPLICATE KEY UPDATE name = VALUES(name);

SET @hostel_id = (SELECT id FROM hostels WHERE code = 'HAVEN-N');

INSERT INTO buildings (hostel_id, uuid, name, code, gender_policy)
VALUES
  (@hostel_id, UUID(), 'Block A', 'A', 'female'),
  (@hostel_id, UUID(), 'Block B', 'B', 'mixed'),
  (@hostel_id, UUID(), 'Block C', 'C', 'male')
ON DUPLICATE KEY UPDATE name = VALUES(name);

SET @building_id = (SELECT id FROM buildings WHERE hostel_id = @hostel_id AND code = 'B');

INSERT INTO floors (building_id, uuid, name, floor_number)
VALUES
  (@building_id, UUID(), 'Ground floor', 0),
  (@building_id, UUID(), 'First floor', 1),
  (@building_id, UUID(), 'Second floor', 2)
ON DUPLICATE KEY UPDATE name = VALUES(name);

SET @floor_id = (SELECT id FROM floors WHERE building_id = @building_id AND floor_number = 2);

INSERT INTO rooms (floor_id, uuid, room_number, room_type, capacity, gender_policy, status)
VALUES
  (@floor_id, UUID(), 'B-201', 'triple', 3, 'any', 'available'),
  (@floor_id, UUID(), 'B-202', 'double', 2, 'any', 'maintenance'),
  (@floor_id, UUID(), 'B-203', 'double', 2, 'any', 'available'),
  (@floor_id, UUID(), 'B-204', 'triple', 3, 'any', 'available'),
  (@floor_id, UUID(), 'B-205', 'double', 2, 'any', 'available'),
  (@floor_id, UUID(), 'B-206', 'triple', 3, 'any', 'available')
ON DUPLICATE KEY UPDATE capacity = VALUES(capacity), room_type = VALUES(room_type);

INSERT INTO beds (room_id, uuid, bed_number, status)
SELECT rooms.id, UUID(), numbers.number, 'available'
FROM rooms
JOIN (
  SELECT '1' AS number UNION ALL SELECT '2' UNION ALL SELECT '3'
) numbers ON CAST(numbers.number AS UNSIGNED) <= rooms.capacity
LEFT JOIN beds ON beds.room_id = rooms.id AND beds.bed_number = numbers.number
WHERE rooms.floor_id = @floor_id AND beds.id IS NULL;
