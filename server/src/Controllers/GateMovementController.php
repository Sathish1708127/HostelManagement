<?php

namespace App\Controllers;

use App\Support\Request;
use App\Support\Validator;

final class GateMovementController extends ApiController
{
    public static function recordEntry(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, ['super_admin', 'security_guard']);
        
        $body = Request::json();
        
        $validated = [
            'user_id' => Validator::requiredInt($body, 'user_id'),
            'gate_id' => Validator::requiredInt($body, 'gate_id'),
            'device_id' => trim((string) ($body['device_id'] ?? '')),
            'is_manual' => (bool) ($body['is_manual'] ?? false),
            'remarks' => trim((string) ($body['remarks'] ?? '')),
        ];
        
        // TODO: Record gate entry
        return $validated;
    }

    public static function recordExit(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, ['super_admin', 'security_guard']);
        
        $entryId = Request::param('entry_id');
        $body = Request::json();
        
        $validated = [
            'remarks' => trim((string) ($body['remarks'] ?? '')),
        ];
        
        // TODO: Record gate exit and link to entry
        return $validated;
    }

    public static function scanPass(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, ['super_admin', 'security_guard']);
        
        $body = Request::json();
        
        $passCode = Validator::requiredString($body, 'pass_code', 50);
        
        // TODO: Scan and validate gate pass, record movement
        return ['valid' => true, 'user' => []];
    }

    public static function getMovementLog(): array
    {
        $user = self::requireAuth();
        
        if (self::isStudent($user)) {
            // Students can only see their own log
            $userId = $user['id'];
        } else {
            $userId = Request::query('user_id') ? (int) Request::query('user_id') : null;
        }
        
        $page = self::getPage();
        $perPage = self::getPerPage();
        $fromDate = Request::query('from_date');
        $toDate = Request::query('to_date');
        
        // TODO: Get movement log with optional date range filter
        return [
            'items' => [],
            'meta' => ['total' => 0, 'page' => $page],
        ];
    }

    public static function getUserMovements(): array
    {
        $user = self::requireAuth();
        $userId = (int) Request::param('user_id');
        
        if (!self::isStaff($user) && $user['id'] != $userId) {
            self::unauthorized();
        }
        
        $date = Request::query('date');
        
        // TODO: Get all movements for a user on a specific date
        return [];
    }

    public static function createGate(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, self::SUPER_ADMIN);
        
        $body = Request::json();
        
        $validated = [
            'hostel_id' => Validator::requiredInt($body, 'hostel_id'),
            'gate_name' => Validator::requiredString($body, 'gate_name', 100),
            'gate_code' => Validator::requiredString($body, 'gate_code', 50),
            'location' => trim((string) ($body['location'] ?? '')),
            'device_sync_enabled' => (bool) ($body['device_sync_enabled'] ?? false),
        ];
        
        // TODO: Create gate
        return $validated;
    }

    public static function getGates(): array
    {
        $user = self::requireAuth();
        $hostelId = (int) Request::param('hostel_id');
        
        // TODO: Get all gates for a hostel
        return [];
    }

    public static function getMovementStats(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, self::STAFF_ROLES);
        
        $hostelId = (int) Request::param('hostel_id');
        $date = Request::query('date');
        
        // TODO: Get movement statistics for a hostel on a date
        return [
            'total_entries' => 0,
            'total_exits' => 0,
            'currently_inside' => 0,
            'peak_hour' => '',
        ];
    }
}
