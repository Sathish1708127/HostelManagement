<?php

namespace App\Controllers;

use App\Middleware\AuthMiddleware;
use App\Support\HttpException;
use App\Support\Request;

abstract class ApiController
{
    protected const SUPER_ADMIN = ['super_admin'];
    protected const STAFF_ROLES = ['super_admin', 'warden', 'maintenance_staff', 'cleaning_staff'];
    protected const OFFICE_ROLES = ['super_admin', 'warden', 'accountant'];
    protected const ANY_STAFF = ['super_admin', 'warden', 'maintenance_staff', 'cleaning_staff', 'security_guard', 'mess_manager'];

    protected static function requireAuth(): array
    {
        return AuthMiddleware::authenticate();
    }

    protected static function requireRole(array $user, array $roles): void
    {
        AuthMiddleware::requireRole($user, $roles);
    }

    protected static function isStudent(array $user): bool
    {
        return in_array('student', $user['roles'] ?? [], true);
    }

    protected static function isStaff(array $user): bool
    {
        return count(array_intersect($user['roles'] ?? [], self::STAFF_ROLES)) > 0;
    }

    protected static function getPage(): int
    {
        return max(1, (int) Request::query('page', '1'));
    }

    protected static function getPerPage(int $default = 20, int $max = 100): int
    {
        return min($max, max(1, (int) Request::query('per_page', (string) $default)));
    }

    protected static function getSearch(): string
    {
        return Request::query('search', '') ?? '';
    }

    protected static function getSort(): string
    {
        return Request::query('sort', 'created_at') ?? 'created_at';
    }

    protected static function getOrder(): string
    {
        $order = Request::query('order', 'desc') ?? 'desc';
        return strtolower($order) === 'asc' ? 'asc' : 'desc';
    }

    protected static function getDateRange(): array
    {
        return [
            'from' => Request::query('from_date'),
            'to' => Request::query('to_date'),
        ];
    }

    protected static function error(string $message, int $code = 400): void
    {
        throw new HttpException($message, $code);
    }

    protected static function notFound(string $entity = 'Resource'): void
    {
        throw new HttpException("{$entity} not found.", 404);
    }

    protected static function unauthorized(): void
    {
        throw new HttpException('Unauthorized access.', 403);
    }

    protected static function unauthenticated(): void
    {
        throw new HttpException('Authentication required.', 401);
    }
}
