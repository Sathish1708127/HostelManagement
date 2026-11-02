<?php
namespace App\Controllers;

use App\Repositories\DashboardRepository;

final class DashboardController
{
    public static function index(array $user): array
    {
        $summary = DashboardRepository::summary();
        $summary['viewer'] = [
            'uuid' => $user['uuid'] ?? null,
            'name' => $user['display_name'] ?? null,
            'roles' => $user['roles'] ?? [],
        ];
        return $summary;
    }
}
