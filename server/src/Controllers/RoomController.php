<?php
namespace App\Controllers;

use App\Repositories\RoomRepository;
use App\Support\HttpException;
use App\Support\Request;

final class RoomController
{
    public static function index(array $user): array
    {
        $floor = Request::query('floor');
        $roles = $user['roles'] ?? [];
        $staffRoles = ['super_admin', 'warden', 'accountant', 'mess_manager', 'maintenance_staff', 'cleaning_staff', 'security_guard'];
        $hasStaffAccess = count(array_intersect($roles, $staffRoles)) > 0;
        $isStudent = in_array('student', $roles, true);

        if (!$hasStaffAccess && !$isStudent) {
            throw new HttpException('You do not have permission to view room assignments.', 403);
        }

        return RoomRepository::floorMap(
            Request::query('building'),
            $floor === null || $floor === '' ? null : (int) $floor,
            $hasStaffAccess ? null : (int) $user['id']
        );
    }
}
