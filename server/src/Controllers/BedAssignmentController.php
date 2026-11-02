<?php
namespace App\Controllers;

use App\Middleware\AuthMiddleware;
use App\Services\BedAssignmentService;
use App\Support\Request;
use App\Support\Validator;

final class BedAssignmentController
{
    public static function store(array $user): array
    {
        AuthMiddleware::requireRole($user, ['super_admin', 'warden']);
        $body = Request::json();

        return BedAssignmentService::assign(
            Validator::requiredString($body, 'student_uuid', 36),
            Validator::requiredString($body, 'bed_uuid', 36),
            (int) $user['id'],
            isset($body['notes']) ? trim((string) $body['notes']) : null
        );
    }
}
