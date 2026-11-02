<?php

namespace App\Middleware;

use App\Support\HttpException;

class IdempotencyMiddleware
{
    // Endpoints that require idempotency
    private const IDEMPOTENT_ENDPOINTS = [
        'POST /api/v1/payments',
        'POST /api/v1/leave-requests',
        'POST /api/v1/complaints',
        'POST /api/v1/facility-bookings',
        'POST /api/v1/refunds',
        'PUT /api/v1/leave-requests/*/approve',
        'POST /api/v1/gate-passes',
    ];

    public static function handle(string $method, string $path, string $body): ?array
    {
        $endpoint = "{$method} {$path}";
        
        if (!self::isIdempotentEndpoint($endpoint)) {
            return null;
        }

        $headers = getallheaders();
        $idempotencyKey = $headers['Idempotency-Key'] ?? null;
        
        if (!$idempotencyKey) {
            throw new HttpException(
                'Idempotency-Key header required for this endpoint.',
                400
            );
        }

        if (strlen($idempotencyKey) > 255) {
            throw new HttpException('Idempotency-Key too long (max 255 chars).', 400);
        }

        // Check if already processed
        $cached = self::getCachedResponse($idempotencyKey);
        if ($cached !== null) {
            return $cached;
        }

        return null;
    }

    public static function cacheResponse(string $idempotencyKey, array $response): void
    {
        // TODO: Cache response for 24 hours
        // Store: response code, headers, body
    }

    private static function getCachedResponse(string $key): ?array
    {
        // TODO: Retrieve cached response if exists
        return null;
    }

    private static function isIdempotentEndpoint(string $endpoint): bool
    {
        foreach (self::IDEMPOTENT_ENDPOINTS as $pattern) {
            if (self::matchesPattern($endpoint, $pattern)) {
                return true;
            }
        }
        return false;
    }

    private static function matchesPattern(string $endpoint, string $pattern): bool
    {
        $pattern = str_replace('*', '[0-9]+', preg_quote($pattern, '/'));
        return (bool) preg_match("/^{$pattern}$/", $endpoint);
    }
}
