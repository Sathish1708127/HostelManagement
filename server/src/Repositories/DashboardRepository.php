<?php
namespace App\Repositories;

use App\Config\Database;

final class DashboardRepository
{
    public static function summary(): array
    {
        $pdo = Database::connection();
        $residents = (int) $pdo->query(
            "SELECT COUNT(*) FROM student_profiles
             WHERE deleted_at IS NULL AND status IN ('checked_in', 'active', 'on_leave')"
        )->fetchColumn();
        $beds = $pdo->query(
            "SELECT COUNT(*) total,
                    SUM(status = 'occupied') occupied,
                    SUM(status = 'available') available,
                    SUM(status IN ('maintenance', 'cleaning', 'inactive')) unavailable
             FROM beds"
        )->fetch() ?: [];
        $blocks = $pdo->query(
            "SELECT buildings.name,
                    COUNT(beds.id) total_beds,
                    SUM(beds.status = 'occupied') occupied_beds
             FROM buildings
             JOIN floors ON floors.building_id = buildings.id
             JOIN rooms ON rooms.floor_id = floors.id AND rooms.deleted_at IS NULL
             JOIN beds ON beds.room_id = rooms.id
             GROUP BY buildings.id, buildings.name
             ORDER BY buildings.code"
        )->fetchAll();

        $totalBeds = (int) ($beds['total'] ?? 0);
        $occupiedBeds = (int) ($beds['occupied'] ?? 0);
        $occupancy = $totalBeds > 0 ? round(($occupiedBeds / $totalBeds) * 100) : 0;

        return [
            'metrics' => [
                'residents' => $residents,
                'total_beds' => $totalBeds,
                'occupied_beds' => $occupiedBeds,
                'available_beds' => (int) ($beds['available'] ?? 0),
                'unavailable_beds' => (int) ($beds['unavailable'] ?? 0),
                'occupancy_percent' => $occupancy,
            ],
            'blocks' => array_map(
                static fn (array $block): array => [
                    'name' => $block['name'],
                    'occupied' => (int) $block['occupied_beds'],
                    'total' => (int) $block['total_beds'],
                ],
                $blocks
            ),
        ];
    }
}
