<?php

namespace App\Controllers;

use App\Support\Request;
use App\Support\Validator;

final class MedicalController extends ApiController
{
    public static function createReport(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, self::STAFF_ROLES);
        
        $body = Request::json();
        
        $validated = [
            'student_id' => Validator::requiredInt($body, 'student_id'),
            'visit_date' => Validator::requiredString($body, 'visit_date', 10),
            'visit_time' => Validator::requiredString($body, 'visit_time', 8),
            'complaint' => Validator::requiredString($body, 'complaint', 255),
            'diagnosis' => Validator::requiredString($body, 'diagnosis', 1000),
            'treatment_prescribed' => trim((string) ($body['treatment_prescribed'] ?? '')),
            'medicines' => trim((string) ($body['medicines'] ?? '')),
            'follow_up_required' => (bool) ($body['follow_up_required'] ?? false),
            'follow_up_date' => isset($body['follow_up_date']) ? trim($body['follow_up_date']) : null,
        ];
        
        // TODO: Create medical report
        return $validated;
    }

    public static function getMyReports(): array
    {
        $user = self::requireAuth();
        
        if (!self::isStudent($user)) {
            self::unauthorized();
        }
        
        // TODO: Get student's medical reports
        return [];
    }

    public static function getReport(): array
    {
        $user = self::requireAuth();
        $reportId = Request::param('report_id');
        
        // TODO: Get medical report with access log
        return [];
    }

    public static function requestWellnessCheckIn(): array
    {
        $user = self::requireAuth();
        
        if (!self::isStudent($user)) {
            self::unauthorized();
        }
        
        $body = Request::json();
        
        $requestType = Validator::oneOf($body, 'request_type', ['mental_health', 'fitness', 'nutrition', 'stress_management']);
        $description = Validator::requiredString($body, 'description', 500);
        
        // TODO: Create wellness request
        return ['request_type' => $requestType];
    }

    public static function getWellnessRequests(): array
    {
        $user = self::requireAuth();
        
        if (!self::isStudent($user)) {
            self::unauthorized();
        }
        
        // TODO: Get student's wellness requests
        return [];
    }

    public static function assignWellnessRequest(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, self::STAFF_ROLES);
        
        $requestId = Request::param('request_id');
        $body = Request::json();
        
        $assignedTo = Validator::requiredInt($body, 'assigned_to');
        
        // TODO: Assign wellness request to counselor/staff
        return ['assigned' => true];
    }

    public static function completeWellnessRequest(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, self::STAFF_ROLES);
        
        $requestId = Request::param('request_id');
        $body = Request::json();
        
        $feedback = Validator::requiredString($body, 'feedback', 1000);
        
        // TODO: Complete wellness request
        return ['completed' => true];
    }

    public static function emergencyAlert(): array
    {
        $user = self::requireAuth();
        
        if (!self::isStudent($user)) {
            self::unauthorized();
        }
        
        $body = Request::json();
        
        $severity = Validator::oneOf($body, 'severity', ['low', 'medium', 'high', 'critical']);
        $description = Validator::requiredString($body, 'description', 500);
        
        // TODO: Trigger emergency health alert
        return ['alert_sent' => true];
    }

    public static function getEmergencyContacts(): array
    {
        $user = self::requireAuth();
        
        $studentId = (int) Request::param('student_id');
        
        // TODO: Get emergency contacts for health emergency
        return [];
    }
}
