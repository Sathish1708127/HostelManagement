<?php

namespace App\Controllers;

use App\Support\Request;
use App\Support\Validator;

final class GuardianController extends ApiController
{
    public static function index(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, self::STAFF_ROLES);
        
        $page = self::getPage();
        $perPage = self::getPerPage();
        $search = self::getSearch();
        
        // TODO: Implement repository call
        return [
            'items' => [],
            'meta' => [
                'total' => 0,
                'page' => $page,
                'per_page' => $perPage,
            ],
        ];
    }

    public static function show(): array
    {
        $user = self::requireAuth();
        $guardianId = Request::param('guardian_id');
        
        // TODO: Implement get guardian by ID with student links
        return [];
    }

    public static function store(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, self::STAFF_ROLES);
        
        $body = Request::json();
        
        $validated = [
            'user_id' => Validator::requiredInt($body, 'user_id'),
            'relation' => Validator::oneOf($body, 'relation', ['parent', 'sibling', 'guardian', 'other']),
            'address' => trim((string) ($body['address'] ?? '')),
            'city' => trim((string) ($body['city'] ?? '')),
            'state' => trim((string) ($body['state'] ?? '')),
            'postal_code' => trim((string) ($body['postal_code'] ?? '')),
            'country' => trim((string) ($body['country'] ?? '')),
            'occupation' => trim((string) ($body['occupation'] ?? '')),
            'organization' => trim((string) ($body['organization'] ?? '')),
        ];
        
        // TODO: Create guardian profile and return
        return $validated;
    }

    public static function update(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, self::STAFF_ROLES);
        
        $guardianId = Request::param('guardian_id');
        $body = Request::json();
        
        // TODO: Update guardian profile
        return [];
    }

    public static function linkStudent(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, self::STAFF_ROLES);
        
        $body = Request::json();
        
        $validated = [
            'guardian_id' => Validator::requiredInt($body, 'guardian_id'),
            'student_id' => Validator::requiredInt($body, 'student_id'),
            'is_primary' => (bool) ($body['is_primary'] ?? false),
        ];
        
        // TODO: Link guardian to student
        return $validated;
    }

    public static function unlinkStudent(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, self::STAFF_ROLES);
        
        $guardianId = Request::param('guardian_id');
        $studentId = Request::param('student_id');
        
        // TODO: Unlink guardian from student
        return ['success' => true];
    }

    public static function giveConsent(): array
    {
        $user = self::requireAuth();
        
        $body = Request::json();
        $guardianId = Validator::requiredInt($body, 'guardian_id');
        $consentGiven = (bool) ($body['consent_given'] ?? false);
        
        // TODO: Update consent status
        return ['consent_updated' => true];
    }

    public static function getLinkedStudents(): array
    {
        $user = self::requireAuth();
        $guardianId = Request::param('guardian_id');
        
        // TODO: Get all students linked to this guardian
        return [];
    }
}
