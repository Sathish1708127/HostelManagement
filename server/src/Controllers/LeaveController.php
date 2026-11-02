<?php

namespace App\Controllers;

use App\Support\Request;
use App\Support\Validator;

final class LeaveController extends ApiController
{
    public static function apply(): array
    {
        $user = self::requireAuth();
        
        if (!self::isStudent($user)) {
            self::unauthorized();
        }
        
        $body = Request::json();
        
        $validated = [
            'leave_from_date' => Validator::requiredString($body, 'leave_from_date', 10),
            'leave_to_date' => Validator::requiredString($body, 'leave_to_date', 10),
            'reason' => Validator::requiredString($body, 'reason', 1000),
            'destination' => trim((string) ($body['destination'] ?? '')),
            'contact_number' => trim((string) ($body['contact_number'] ?? '')),
        ];
        
        // TODO: Create leave request
        return $validated;
    }

    public static function getMyRequests(): array
    {
        $user = self::requireAuth();
        
        if (!self::isStudent($user)) {
            self::unauthorized();
        }
        
        $status = Request::query('status');
        
        // TODO: Get student's leave requests
        return [];
    }

    public static function getPendingRequests(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, self::STAFF_ROLES);
        
        $hostelId = (int) Request::param('hostel_id');
        $page = self::getPage();
        $perPage = self::getPerPage();
        
        // TODO: Get pending leave requests for hostel
        return [
            'items' => [],
            'meta' => ['total' => 0, 'page' => $page],
        ];
    }

    public static function approve(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, self::STAFF_ROLES);
        
        $requestId = Request::param('request_id');
        
        // TODO: Approve leave request and generate gate pass
        return ['approved' => true, 'gate_pass_code' => ''];
    }

    public static function reject(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, self::STAFF_ROLES);
        
        $requestId = Request::param('request_id');
        $body = Request::json();
        
        $reason = Validator::requiredString($body, 'reason', 500);
        
        // TODO: Reject leave request
        return ['rejected' => true];
    }

    public static function reportLateReturn(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, ['super_admin', 'security_guard']);
        
        $gatePassId = Request::param('gate_pass_id');
        $body = Request::json();
        
        $hoursLate = (int) ($body['hours_late'] ?? 0);
        $reason = trim((string) ($body['reason'] ?? ''));
        
        // TODO: Report late return and trigger charges if applicable
        return ['reported' => true];
    }

    public static function getGatePasses(): array
    {
        $user = self::requireAuth();
        
        $hostelId = (int) Request::param('hostel_id');
        $date = Request::query('date');
        
        // TODO: Get gate passes issued for date
        return [];
    }

    public static function extendLeave(): array
    {
        $user = self::requireAuth();
        
        if (!self::isStudent($user)) {
            self::unauthorized();
        }
        
        $requestId = Request::param('request_id');
        $body = Request::json();
        
        $newEndDate = Validator::requiredString($body, 'new_end_date', 10);
        $reason = trim((string) ($body['reason'] ?? ''));
        
        // TODO: Request extension on leave
        return ['extension_requested' => true];
    }
}
