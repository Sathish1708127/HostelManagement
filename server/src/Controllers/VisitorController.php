<?php

namespace App\Controllers;

use App\Support\Request;
use App\Support\Validator;

final class VisitorController extends ApiController
{
    public static function preRegister(): array
    {
        $user = self::requireAuth();
        
        $body = Request::json();
        
        $validated = [
            'full_name' => Validator::requiredString($body, 'full_name', 255),
            'email' => trim((string) ($body['email'] ?? '')),
            'phone' => trim((string) ($body['phone'] ?? '')),
            'id_proof_type' => Validator::oneOf($body, 'id_proof_type', ['aadhar', 'pan', 'passport', 'drivers_license', 'other']),
            'id_proof_number' => trim((string) ($body['id_proof_number'] ?? '')),
            'relation_to_student' => Validator::requiredString($body, 'relation_to_student', 100),
            'company_name' => trim((string) ($body['company_name'] ?? '')),
        ];
        
        // TODO: Create visitor profile
        return $validated;
    }

    public static function generatePass(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, ['super_admin', 'warden', 'security_guard']);
        
        $body = Request::json();
        
        $validated = [
            'visitor_id' => Validator::requiredInt($body, 'visitor_id'),
            'student_id' => Validator::requiredInt($body, 'student_id'),
            'hostel_id' => Validator::requiredInt($body, 'hostel_id'),
            'visit_date' => Validator::requiredString($body, 'visit_date', 10),
            'visit_start_time' => Validator::requiredString($body, 'visit_start_time', 8),
            'visit_end_time' => Validator::requiredString($body, 'visit_end_time', 8),
            'purpose' => trim((string) ($body['purpose'] ?? '')),
        ];
        
        // TODO: Generate visitor pass with unique code
        return $validated;
    }

    public static function checkIn(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, ['super_admin', 'security_guard']);
        
        $passId = Request::param('pass_id');
        
        // TODO: Check in visitor and update pass
        return ['checked_in' => true];
    }

    public static function checkOut(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, ['super_admin', 'security_guard']);
        
        $passId = Request::param('pass_id');
        
        // TODO: Check out visitor
        return ['checked_out' => true];
    }

    public static function getPasses(): array
    {
        $user = self::requireAuth();
        
        $hostelId = (int) Request::param('hostel_id');
        $date = Request::query('date');
        $status = Request::query('status');
        
        // TODO: Get visitor passes with optional filters
        return [];
    }

    public static function blockVisitor(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, self::STAFF_ROLES);
        
        $visitorId = Request::param('visitor_id');
        $body = Request::json();
        
        $reason = Validator::requiredString($body, 'reason', 255);
        
        // TODO: Block visitor from hostel
        return ['blocked' => true];
    }

    public static function unblockVisitor(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, self::SUPER_ADMIN);
        
        $visitorId = Request::param('visitor_id');
        
        // TODO: Unblock visitor
        return ['unblocked' => true];
    }

    public static function getOverstayAlerts(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, self::STAFF_ROLES);
        
        $hostelId = (int) Request::param('hostel_id');
        
        // TODO: Get visitors who have exceeded their visit time
        return [];
    }

    public static function sendReminder(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, ['super_admin', 'security_guard']);
        
        $passId = Request::param('pass_id');
        
        // TODO: Send overstay reminder to visitor/student
        return ['reminded' => true];
    }
}
