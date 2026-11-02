<?php
namespace App\Controllers;

use App\Middleware\AuthMiddleware;
use App\Repositories\ResidentRepository;
use App\Support\Request;
use App\Support\Validator;

final class ResidentController
{
    private const STAFF_ROLES = ['super_admin', 'warden'];

    public static function index(array $user): array
    {
        AuthMiddleware::requireRole($user, self::STAFF_ROLES);
        $page = max(1, (int) Request::query('page', '1'));
        $perPage = min(100, max(1, (int) Request::query('per_page', '20')));
        return ResidentRepository::paginate(
            Request::query('search', '') ?? '',
            Request::query('nationality', '') ?? '',
            $page,
            $perPage
        );
    }

    public static function store(array $user): array
    {
        AuthMiddleware::requireRole($user, self::STAFF_ROLES);
        $body = Request::json();

        return ResidentRepository::create([
            'email' => Validator::requiredString($body, 'email', 255),
            'hostel_uuid' => Validator::requiredString($body, 'hostel_uuid', 36),
            'university_id' => Validator::requiredString($body, 'university_id', 80),
            'legal_name' => Validator::requiredString($body, 'legal_name', 180),
            'preferred_name' => trim((string) ($body['preferred_name'] ?? '')),
            'nationality' => Validator::oneOf($body, 'nationality', ['Nepali', 'Indian', 'Other']),
            'course' => trim((string) ($body['course'] ?? '')),
            'semester' => trim((string) ($body['semester'] ?? '')),
            'phone' => trim((string) ($body['phone'] ?? '')),
            'admission_date' => trim((string) ($body['admission_date'] ?? '')),
        ]);
    }
}
