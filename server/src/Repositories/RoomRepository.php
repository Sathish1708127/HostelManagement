<?php
namespace App\Repositories;

use App\Config\Database;

final class RoomRepository
{
    public static function floorMap(
        ?string $buildingCode,
        ?int $floorNumber,
        ?int $residentUserId = null
    ): array
    {
        $where = ['rooms.deleted_at IS NULL'];
        $parameters = [];
        if ($residentUserId !== null) {
            $where[] = 'student_profiles.user_id = :resident_user_id';
            $parameters['resident_user_id'] = $residentUserId;
        }
        if ($buildingCode !== null && $buildingCode !== '') {
            $where[] = 'buildings.code = :building';
            $parameters['building'] = $buildingCode;
        }
        if ($floorNumber !== null) {
            $where[] = 'floors.floor_number = :floor';
            $parameters['floor'] = $floorNumber;
        }

        $statement = Database::connection()->prepare(
            'SELECT buildings.code building_code, buildings.name building_name,
                    floors.floor_number, floors.name floor_name,
                    rooms.uuid room_uuid, rooms.room_number, rooms.room_type,
                    rooms.capacity, rooms.status room_status,
                    beds.uuid bed_uuid, beds.bed_number, beds.status bed_status,
                    student_profiles.legal_name resident_name,
                    student_profiles.uuid resident_uuid
             FROM rooms
             JOIN floors ON floors.id = rooms.floor_id
             JOIN buildings ON buildings.id = floors.building_id
             JOIN beds ON beds.room_id = rooms.id
             LEFT JOIN bed_assignments ON bed_assignments.bed_id = beds.id
                 AND bed_assignments.ends_at IS NULL
             LEFT JOIN student_profiles ON student_profiles.id = bed_assignments.student_profile_id
             WHERE ' . implode(' AND ', $where) . '
             ORDER BY buildings.code, floors.floor_number, rooms.room_number, beds.bed_number'
        );
        $statement->execute($parameters);

        $rooms = [];
        foreach ($statement->fetchAll() as $row) {
            $roomId = $row['room_uuid'];
            if (!isset($rooms[$roomId])) {
                $rooms[$roomId] = [
                    'uuid' => $roomId,
                    'room_number' => $row['room_number'],
                    'room_type' => $row['room_type'],
                    'capacity' => (int) $row['capacity'],
                    'status' => $row['room_status'],
                    'building' => ['code' => $row['building_code'], 'name' => $row['building_name']],
                    'floor' => ['number' => (int) $row['floor_number'], 'name' => $row['floor_name']],
                    'beds' => [],
                ];
            }
            $rooms[$roomId]['beds'][] = [
                'uuid' => $row['bed_uuid'],
                'number' => $row['bed_number'],
                'status' => $row['bed_status'],
                'resident' => $row['resident_uuid'] ? [
                    'uuid' => $row['resident_uuid'],
                    'name' => $row['resident_name'],
                ] : null,
            ];
        }
        return array_values($rooms);
    }
}
