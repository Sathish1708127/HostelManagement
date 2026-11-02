<?php

namespace App\Controllers;

use App\Support\Request;
use App\Support\Validator;

final class ComplaintController extends ApiController
{
    public static function getCategories(): array
    {
        $user = self::requireAuth();
        
        // TODO: Get all complaint categories
        return [];
    }

    public static function submit(): array
    {
        $user = self::requireAuth();
        
        if (!self::isStudent($user)) {
            self::unauthorized();
        }
        
        $body = Request::json();
        
        $validated = [
            'category_id' => Validator::requiredInt($body, 'category_id'),
            'title' => Validator::requiredString($body, 'title', 255),
            'description' => Validator::requiredString($body, 'description', 5000),
            'severity' => Validator::oneOf($body, 'severity', ['low', 'medium', 'high', 'critical']),
            'room_id' => isset($body['room_id']) ? (int) $body['room_id'] : null,
        ];
        
        // TODO: Create complaint and return ticket
        return $validated;
    }

    public static function getComplaints(): array
    {
        $user = self::requireAuth();
        
        $page = self::getPage();
        $perPage = self::getPerPage();
        $status = Request::query('status');
        
        if (self::isStudent($user)) {
            // Students see only their complaints
            $userId = $user['id'];
        } else {
            $userId = Request::query('user_id');
        }
        
        // TODO: Get complaints with optional filters
        return [
            'items' => [],
            'meta' => ['total' => 0, 'page' => $page],
        ];
    }

    public static function show(): array
    {
        $user = self::requireAuth();
        $complaintId = Request::param('complaint_id');
        
        // TODO: Get complaint details with full timeline
        return [];
    }

    public static function assign(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, self::STAFF_ROLES);
        
        $complaintId = Request::param('complaint_id');
        $body = Request::json();
        
        $assignedTo = Validator::requiredInt($body, 'assigned_to');
        $estimatedDate = trim((string) ($body['estimated_completion_date'] ?? ''));
        
        // TODO: Assign complaint to staff member
        return ['assigned' => true];
    }

    public static function updateStatus(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, self::STAFF_ROLES);
        
        $complaintId = Request::param('complaint_id');
        $body = Request::json();
        
        $status = Validator::oneOf($body, 'status', ['open', 'acknowledged', 'in_progress', 'resolved', 'closed']);
        
        // TODO: Update complaint status
        return ['status' => $status];
    }

    public static function addComment(): array
    {
        $user = self::requireAuth();
        
        $complaintId = Request::param('complaint_id');
        $body = Request::json();
        
        $comment = Validator::requiredString($body, 'comment', 2000);
        $isInternal = (bool) ($body['is_internal'] ?? false);
        
        // TODO: Add comment to complaint
        return ['commented' => true];
    }

    public static function getComments(): array
    {
        $user = self::requireAuth();
        
        $complaintId = Request::param('complaint_id');
        $page = self::getPage();
        $perPage = self::getPerPage();
        
        // TODO: Get complaint comments with pagination
        return [
            'items' => [],
            'meta' => ['total' => 0, 'page' => $page],
        ];
    }

    public static function getStats(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, self::STAFF_ROLES);
        
        // TODO: Get complaint statistics dashboard
        return [
            'total_open' => 0,
            'average_resolution_time' => 0,
            'by_category' => [],
        ];
    }
}
