<?php

namespace App\Controllers;

use App\Support\Request;
use App\Support\Validator;

final class EmergencyContactController extends ApiController
{
    public static function index(): array
    {
        $user = self::requireAuth();
        $studentId = (int) Request::param('student_id');
        
        if (!self::isStaff($user) && $user['id'] != $studentId) {
            self::unauthorized();
        }
        
        // TODO: Get emergency contacts for student
        return [];
    }

    public static function store(): array
    {
        $user = self::requireAuth();
        $studentId = (int) Request::param('student_id');
        
        if (!self::isStaff($user) && $user['id'] != $studentId) {
            self::unauthorized();
        }
        
        $body = Request::json();
        
        $validated = [
            'student_id' => $studentId,
            'contact_name' => Validator::requiredString($body, 'contact_name', 255),
            'relation' => Validator::requiredString($body, 'relation', 50),
            'phone' => Validator::requiredString($body, 'phone', 32),
            'email' => trim((string) ($body['email'] ?? '')),
            'address' => trim((string) ($body['address'] ?? '')),
            'priority' => (int) ($body['priority'] ?? 1),
        ];
        
        // TODO: Create emergency contact
        return $validated;
    }

    public static function update(): array
    {
        $user = self::requireAuth();
        $contactId = Request::param('contact_id');
        $body = Request::json();
        
        $validated = [
            'contact_name' => trim((string) ($body['contact_name'] ?? '')),
            'relation' => trim((string) ($body['relation'] ?? '')),
            'phone' => trim((string) ($body['phone'] ?? '')),
            'email' => trim((string) ($body['email'] ?? '')),
            'address' => trim((string) ($body['address'] ?? '')),
            'priority' => isset($body['priority']) ? (int) $body['priority'] : null,
        ];
        
        // TODO: Update emergency contact
        return $validated;
    }

    public static function delete(): array
    {
        $user = self::requireAuth();
        $contactId = Request::param('contact_id');
        
        // TODO: Delete emergency contact
        return ['deleted' => true];
    }

    public static function verify(): array
    {
        $user = self::requireAuth();
        $contactId = Request::param('contact_id');
        
        // TODO: Mark contact as verified (send verification code)
        return ['verification_sent' => true];
    }

    public static function reorder(): array
    {
        $user = self::requireAuth();
        $studentId = (int) Request::param('student_id');
        
        $body = Request::json();
        $contactIds = Validator::requiredArray($body, 'contact_ids');
        
        // TODO: Reorder emergency contacts by priority
        return ['reordered' => true];
    }
}
